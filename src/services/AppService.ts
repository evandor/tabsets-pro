import BookmarksService from "src/bookmarks/services/BookmarksService";
import {useDB} from "src/services/usePersistenceService";
import {useSuggestionsStore} from "src/suggestions/stores/suggestionsStore";
import tabsetService from "src/tabsets/services/TabsetService";
import {useTabsetService} from "src/tabsets/services/TabsetService2";
import ChromeApi from "src/services/ChromeApi";
import {useSpacesStore} from "src/spaces/stores/spacesStore";
import {useSettingsStore} from "stores/settingsStore";
import {useBookmarksStore} from "src/bookmarks/stores/bookmarksStore";
import {useWindowsStore} from "src/windows/stores/windowsStore";
import {useSearchStore} from "src/search/stores/searchStore";
import {Router} from "vue-router";
import {useGroupsStore} from "src/tabsets/stores/groupsStore";
import {FeatureIdent} from "src/models/FeatureIdent";
import {useAppStore} from "stores/appStore";
import {useAuthStore} from "stores/authStore";
import PersistenceService from "src/services/PersistenceService";
import {useUiStore} from "src/ui/stores/uiStore";
import {User} from "firebase/auth";
import {useThumbnailsService} from "src/thumbnails/services/ThumbnailsService";
import IndexedDbThumbnailsPersistence from "src/thumbnails/persistence/IndexedDbThumbnailsPersistence";
import {useContentService} from "src/content/services/ContentService";
import IndexedDbContentPersistence from "src/content/persistence/IndexedDbContentPersistence";
import {useTabsetsStore} from "src/tabsets/stores/tabsetsStore";
import {useTabsStore2} from "src/tabsets/stores/tabsStore2";
import {useFeaturesStore} from "src/features/stores/featuresStore";
import ChromeListeners from "src/services/ChromeListeners";
import {useSnapshotsService} from "src/snapshots/services/SnapshotsService";
import IndexedDbSnapshotPersistence from "src/snapshots/persistence/IndexedDbSnapshotPersistence";
import {useSnapshotsStore} from "src/snapshots/stores/SnapshotsStore";

function dbStoreToUse() {
  const isAuthenticated = useAuthStore().isAuthenticated()
  if (!isAuthenticated) {
    console.debug("%not authenticated", "font-weight:bold")
    return useDB(undefined).localDb
  }
  return useDB(undefined).localDb
}

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

    const appStore = useAppStore()
    const settingsStore = useSettingsStore()
    const bookmarksStore = useBookmarksStore()
    const searchStore = useSearchStore()
    const uiStore = useUiStore()

    this.router = router

    uiStore.appLoading = "loading tabsets..."

    appStore.init()

    // init of stores and some listeners
    // await usePermissionsStore().initialize(useDB(quasar).localDb)

    await ChromeListeners.initListeners()

    // ChromeBookmarkListeners.initListeners()
    await bookmarksStore.init()
    await BookmarksService.init()

    settingsStore.initialize(quasar.localStorage);

    await useSnapshotsService().init()
    await useSnapshotsStore().initialize(useDB().snapshotsIndexedDb)

    // should be initialized before search submodule
    await useThumbnailsService().init(IndexedDbThumbnailsPersistence)
    await useContentService().init(IndexedDbContentPersistence)

    searchStore.init().catch((err) => console.error(err))

    // init db
    // await IndexedDbPersistenceService.init("db")

    // init services
    // await useAuthStore().initialize(useDB(undefined).db)
    await useAuthStore().setUser(user)
    //useAuthStore().upsertAccount(account)


    // await useNotificationsStore().initialize(useDB(undefined).db)
    await useSuggestionsStore().init()

    tabsetService.setLocalStorage(localStorage)

    if (useAuthStore().isAuthenticated()) {

      let persistenceStore = dbStoreToUse()

      // await useFeaturesStore().initialize(useDB(quasar).featuresLocalStorage)


      if (router.currentRoute.value.query.token === "failed") {
        console.log("failed login, falling back to indexedDB")
      }

      // console.debug(`%cchecking sync config: persistenceStore=${persistenceStore.getServiceName()}`, "font-weight:bold")

      // await FsPersistenceService.init()

      await this.initCoreSerivces(quasar, persistenceStore, this.router)
    } else {
      await this.initCoreSerivces(quasar, useDB().localDb, this.router)
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

  private async initCoreSerivces(quasar: any, store: PersistenceService, router: Router) {
    const spacesStore = useSpacesStore()
    const groupsStore = useGroupsStore()
    const tabsetsStore = useTabsetsStore()

    /**
     * features store: passing storage for better testing.
     * make sure features are not used before this line in code.
     */
    const featuresStorage = useDB(quasar).featuresLocalStorage
    await useFeaturesStore().initialize(featuresStorage)

    /**
     * windows store
     */
    await useWindowsStore().initialize()
    useWindowsStore().initListeners()


    await spacesStore.initialize(useDB().spacesFirestoreDb)

    // const tabsetsPersistence = store.getServiceName() === 'FirestorePersistenceService' ?
    //   useDB().tabsetsFirestoreDb : useDB().tabsetsIndexedDb
    await tabsetsStore.initialize(useDB().tabsetsFirestoreDb)
    await useTabsetService().init()

    await useTabsStore2().initialize()


    ChromeApi.init(router)

    if (useFeaturesStore().hasFeature(FeatureIdent.TAB_GROUPS)) {
      // await groupsStore.initialize(useDB(undefined).db)
      groupsStore.initListeners()
    }

    useUiStore().appLoading = undefined

    // tabsets not in bex mode means running on "pwa.tabsets.net"
    // probably running an import ("/imp/:sharedId")
    // we do not want to go to the welcome back
    // console.log("checking for welcome page", useTabsetsStore().tabsets.size === 0, quasar.platform.is.bex, !useAuthStore().isAuthenticated())
    // if (useTabsetsStore().tabsets.size === 0 &&
    //   quasar.platform.is.bex &&
    //   !useAuthStore().isAuthenticated() &&
    //   !router.currentRoute.value.path.startsWith("/fullpage") &&
    //   !router.currentRoute.value.path.startsWith("/mainpanel")) {
    //   await router.push("/sidepanel/welcome")
    // }


  }

}

export default new AppService();

