import BookmarksService from "src/bookmarks/services/BookmarksService";
import {useDB} from "src/services/usePersistenceService";
import {useSuggestionsStore} from "src/suggestions/stores/suggestionsStore";
import tabsetService from "src/tabsets/services/TabsetService";
import {useTabsetService} from "src/tabsets/services/TabsetService2";
import ChromeApi from "src/app/BrowserApi";
import {useSpacesStore} from "src/spaces/stores/spacesStore";
import {useBookmarksStore} from "src/bookmarks/stores/bookmarksStore";
import {useWindowsStore} from "src/windows/stores/windowsStore";
import {useSearchStore} from "src/search/stores/searchStore";
import {Router} from "vue-router";
import {useAppStore} from "stores/appStore";
import {useAuthStore} from "stores/authStore";
import {useUiStore} from "src/ui/stores/uiStore";
import {User} from "firebase/auth";
import {useThumbnailsService} from "src/thumbnails/services/ThumbnailsService";
import {useContentService} from "src/content/services/ContentService";
import IndexedDbContentPersistence from "src/content/persistence/IndexedDbContentPersistence";
import {useTabsStore2} from "src/tabsets/stores/tabsStore2";
import {useFeaturesStore} from "src/features/stores/featuresStore";
import ChromeListeners from "src/app/listeners/BrowserListeners";
import {useSnapshotsService} from "src/snapshots/services/SnapshotsService";
import {useSnapshotsStore} from "src/snapshots/stores/SnapshotsStore";
import {watch} from "vue";
import {useEntityRegistryStore} from "src/core/stores/entityRegistryStore.ts";
import {useNotesStore} from "src/notes/stores/NotesStore.ts";
import {useTabsetsStore} from "src/tabsets/stores/tabsetsStore.ts";
import _ from "lodash"
import {TabsetInfo} from "src/core/models/TabsetInfo";
import ChromeBookmarkListeners from "src/services/ChromeBookmarkListeners.ts";
import {SpaceInfo} from "src/core/models/SpaceInfo.ts";


class AppService {

  router: Router = null as unknown as Router
  initialized = false

  async init(quasar: any, router: Router, forceRestart = false, user: User | undefined = undefined) {

    console.log(`%cinitializing AppService: first start=${!this.initialized}, forceRestart=${forceRestart}, quasar set=${quasar !== undefined}, router set=${router !== undefined}`, forceRestart ? "font-weight:bold" : "")

    if (this.initialized && !forceRestart) {
      console.debug("stopping AppService initialization; already initialized and not forcing restart")
      return Promise.resolve()
    }

    if (this.initialized) {
      await ChromeListeners.resetListeners()
      await useWindowsStore().resetListeners()
    }

    this.initialized = true
    await useAuthStore().setUser(user)

    this.router = router

    useUiStore().appLoading = "loading tabsets pro..."

    useAppStore().init()

    await ChromeListeners.initListeners()
    console.debug('')

    // Bookmarks
    ChromeBookmarkListeners.initListeners()

    useBookmarksStore().init()
    await BookmarksService.init()
    console.debug('')

    // Snapshots
    await useSnapshotsStore().initialize(useDB().snapshotsDb)
    await useSnapshotsService().init()
    console.debug('')

    // should be initialized before search submodule
    await useThumbnailsService().init(useDB().thumbnailsDb)
    console.debug('')

    await useContentService().init(IndexedDbContentPersistence)
    console.debug('')

    // await useRequestsService().init(IndexedDbRequestPersistence)
    // console.debug('')

    await useSearchStore().init().catch((err: any) => console.error(err))
    console.debug('')


    // init services
    await useSuggestionsStore().init()
    console.debug('')

    tabsetService.setLocalStorage(localStorage)

    if (useAuthStore().isAuthenticated()) {

      if (router.currentRoute.value.query.token === "failed") {
        console.log("failed login, falling back to indexedDB")
      }

      // console.debug(`%cchecking sync config: persistenceStore=${persistenceStore.getServiceName()}`, "font-weight:bold")

      await this.initCoreSerivces(this.router)
    } else {
      //await this.initCoreSerivces(quasar, useDB().localDb, this.router)
    }

    // useNotificationsStore().bookmarksExpanded = quasar.localStorage.getItem("bookmarks.expanded") || []

  }


  restart(ar: string) {
    console.log("%crestarting tabsets", "font-weight:bold", window.location.href, ar)
    const baseLocation = window.location.href.split("?")[0]
    console.log("%cbaseLocation", "font-weight:bold", baseLocation)
    console.log("%cwindow.location.href", "font-weight:bold", window.location.href)
    if (window.location.href.indexOf("?") < 0) {
      const tsIframe = window.parent.frames[0]
      //log("iframe", tsIframe)
      if (tsIframe) {
        console.debug("%cnew window.location.href", "font-weight:bold", baseLocation + "?" + ar)
        tsIframe.location.href = baseLocation + "?" + ar
        //tsIframe.location.href = "https://www.skysail.io"
        tsIframe.location.reload()
      }
    }
    useAuthStore().setAuthRequest(null as unknown as string)
  }

  private async initCoreSerivces(router: Router) {

    console.log(`%cinitializing AppService: initCoreSerivces`, "font-weight:bold")

    await useWindowsStore().initialize()
    console.debug("")

    useWindowsStore().initListeners()
    console.debug("")

    /**
     * features store: passing storage for better testing.
     * make sure features are not used before this line in code.
     */
    const featuresStorage = useDB().featuresDb
    await useFeaturesStore().initialize(featuresStorage)
    console.debug("")

    await useNotesStore().initialize(useDB().notesDb)
    console.debug('')

    /**
     * Pattern: TODO
     * initialize store with optional registry watcher and persistence
     * run persistence init code in store init
     * no persistence for service!
     */

    watch(useSpacesStore().spaces, (newSpaces: Map<string, any>) => {
      const spacesInfo = _.map([...newSpaces.values()], (ts: any) => new SpaceInfo(ts.id, ts.name))
      useEntityRegistryStore().spacesRegistry = spacesInfo
    })
    await useSpacesStore().initialize(useDB().spacesDb)
    console.debug('')

    const tabsetsStore = useTabsetsStore()
    watch(tabsetsStore.tabsets, (newTabsets: Map<string, any>) => {
      const tsInfo = _.map([...newTabsets.values()], (ts: any) => new TabsetInfo(ts.id, ts.name, ts.window, ts.tabs.length))
      useEntityRegistryStore().tabsetRegistry = tsInfo
    })
    await tabsetsStore.initialize(useDB().tabsetsDb)
    await useTabsetService().init(false)
    console.debug('')

    await useTabsStore2().initialize()
    console.debug('')


    const existingUrls = useTabsetsStore().getAllUrls()
    await useContentService().populateSearch(existingUrls)
    await useTabsetService().populateSearch()
    console.debug('')

    ChromeApi.init(router)

    // if (useFeaturesStore().hasFeature(FeatureIdent.TAB_GROUPS)) {
    //   // await groupsStore.initialize(useDB(undefined).db)
    //   groupsStore.initListeners()
    // }

    useUiStore().appLoading = undefined
    console.debug('')
  }


}

export default new AppService();

