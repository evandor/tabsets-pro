<template>

  <!-- SidePanelPage -->
  <q-page style="padding-top: 50px">

    <div class="wrap" v-if="useUiStore().appLoading">
      <div class="loading">
        <div class="bounceball q-mr-lg"></div>
        <div class="text">{{ useUiStore().appLoading }}</div>
      </div>
    </div>

    <transition
      appear
      enter-active-class="animated fadeIn slower delay-5s"
      leave-active-class="animated fadeOut">
      <div class="wrap2"
           v-if="useTabsetsStore().tabsets.size === 0 && !useUiStore().appLoading">
        <div class="row items-center text-grey-5">how to start?</div>
        <div style="min-width:300px;border:1px solid #efefef;border-radius:5px">
          <q-list>
            <q-item clickable @click="useUiStore().startButtonAnimation('newTabset')">
              <q-item-section avatar>
                <q-btn outline label="..." color="primary" size="sm"/>
              </q-item-section>

              <q-item-section>
                <q-item-label>New Tabset</q-item-label>
                <q-item-label caption>Click to create a new tabset</q-item-label>
              </q-item-section>
            </q-item>

            <q-item clickable @click="useUiStore().startButtonAnimation('settings')">
              <q-item-section avatar>
                <SidePanelToolbarButton
                  icon="o_settings"/>
              </q-item-section>

              <q-item-section>
                <q-item-label>Settings</q-item-label>
                <q-item-label caption>Click here to activate more features</q-item-label>
              </q-item-section>
            </q-item>

            <q-item clickable @click="useUiStore().startButtonAnimation('bookmarks')">
              <q-item-section avatar>
                <SidePanelToolbarButton
                  icon="bookmark"
                  color="primary"/>
              </q-item-section>

              <q-item-section>
                <q-item-label>Bookmarks Manager</q-item-label>
                <q-item-label caption>Click to open the Bookmarks Manager</q-item-label>
              </q-item-section>
            </q-item>

          </q-list>
        </div>
      </div>
    </Transition>

    <!-- list of tabs, assuming here we have at least one tabset -->
    <div class="q-ma-none q-pa-none">
      <template v-if="suggestTabsetImport()">

        <InfoMessageWidget
          :probability="1"
          ident="sidePanelPage_importTabset">
          Whenever tabsets detects the <b>current tab to contain a new tabset</b>, it will suggest to import this
          set.<br>
          Importing will add the tabset to your existing ones.
        </InfoMessageWidget>

        <div class="row q-ma-sm q-pa-sm">
          <q-btn class="q-px-xl" dense label="Import Shared Tabset" color="warning" @click="importSharedTabset()">
            <q-tooltip class="tooltip-small">The Page in your current tab is a public Tabset which you can import into
              your own if you want.
            </q-tooltip>
          </q-btn>
        </div>
      </template>
      <div class="q-mx-md q-mx-sm text-primary text-caption"></div>

      <div class="q-pa-md q-gutter-sm" v-if="showSwitchedToLocalInfo()">
        <q-banner inline-actions rounded class="text-primary" style="border: 1px solid grey">
          <div class="row q-pa-xs">
            <div class="2">
              <q-icon name="o_lightbulb" color="warning" size="1.3em"/>
            </div>
            <div class="col text-right cursor-pointer" @click="ackSwitchToLocal()">x
              <q-tooltip>close this info message</q-tooltip>
            </div>
          </div>
          <div class="row q-pa-xs">
            <div class="2"></div>
            <div class="col text-caption">
              Showing local tabsets
              <slot></slot>
            </div>
          </div>
        </q-banner>
      </div>

      <SidePanelTabsetsExpansionList :tabsets="tabsets as Tabset[]"/>

    </div>

    <!-- place QPageSticky at end of page -->
    <q-page-sticky expand position="top" class="darkInDarkMode brightInBrightMode">
      <FirstToolbarHelper
        :showSearchBox="showSearchBox">

        <template v-slot:title v-if="permissionsStore && useFeaturesStore().hasFeature(FeatureIdent.SPACES)">
          <div class="text-subtitle1" @click.stop="router.push('/sidepanel/spaces')">
            <q-btn flat no-caps :label="toolbarTitle(tabsets as Tabset[]) as string | undefined"/>
            <q-tooltip :delay="1000" class="tooltip">Click to open List of all Spaces</q-tooltip>
          </div>
        </template>
        <template v-slot:title v-else>
          <div class="text-subtitle1">
            {{ toolbarTitle(tabsets as Tabset[]) }}
          </div>
        </template>

      </FirstToolbarHelper>

    </q-page-sticky>
  </q-page>

</template>

<script lang="ts" setup>

import {onMounted, onUnmounted, ref, watchEffect} from "vue";
import _ from "lodash"
import {Tabset, TabsetStatus} from "src/tabsets/models/Tabset";
import {useRouter} from "vue-router";
import {useUtils} from "src/core/services/Utils";
import {LocalStorage} from "quasar";
import {useTabsetService} from "src/tabsets/services/TabsetService2";
import {useUiStore} from "src/ui/stores/uiStore";
import {usePermissionsStore} from "src/stores/permissionsStore";
import {useSpacesStore} from "src/spaces/stores/spacesStore";
import FirstToolbarHelper from "pages/sidepanel/helper/FirstToolbarHelper.vue";
import {FeatureIdent} from "src/app/models/FeatureIdent";
import TabsetService from "src/tabsets/services/TabsetService";
import Analytics from "src/core/utils/google-analytics";
import {useAuthStore} from "stores/authStore";
import {useSuggestionsStore} from "src/suggestions/stores/suggestionsStore";
import {TITLE_IDENT} from "boot/constants";
import SidePanelToolbarButton from "components/buttons/SidePanelToolbarButton.vue";
import {useI18n} from 'vue-i18n'
import SidePanelTabsetsExpansionList from "src/tabsets/components/SidePanelTabsetsExpansionList.vue";
import {useTabsetsStore} from "src/tabsets/stores/tabsetsStore";
import {useTabsStore2} from "src/tabsets/stores/tabsStore2";
import {useFeaturesStore} from "src/features/stores/featuresStore";
import AppService from "src/services/AppService";
import InfoMessageWidget from "components/widgets/InfoMessageWidget.vue";

const {t} = useI18n({locale: navigator.language, useScope: "global"})

const {inBexMode} = useUtils()

const router = useRouter()
const permissionsStore = usePermissionsStore()
const uiStore = useUiStore()

const showSearchBox = ref(false)
const user = ref<any>()
const tabsets = ref<Tabset[]>([])

function updateOnlineStatus(e: any) {
  const {type} = e
  useUiStore().networkOnline = type === 'online'
}

onMounted(() => {
  window.addEventListener('keypress', checkKeystroke);

  window.addEventListener("offline", (e) => updateOnlineStatus(e));
  window.addEventListener("online", (e) => updateOnlineStatus(e));

  if (!useAuthStore().isAuthenticated) {
    //router.push("/authenticate")
  } else {
    Analytics.firePageViewEvent('SidePanelPage', document.location.href);
  }
})

onUnmounted(() => {
  window.removeEventListener('keypress', checkKeystroke);
})

watchEffect(() => {
  const ar = useAuthStore().useAuthRequest
  if (ar) {
    AppService.restart(ar)
  }
})

watchEffect(() => {
  if (useAuthStore().user) {
    user.value = useAuthStore().user
  }
})

watchEffect(() => {
  if (useUiStore().tabsFilter) {
    console.log("filtering:::", useUiStore().tabsFilter)
  }
})

const getTabsetOrder =
  [
    function (o: Tabset) {
      return o.status === TabsetStatus.FAVORITE ? 0 : 1
    },
    function (o: Tabset) {
      return o.name?.toLowerCase()
    }
  ]

function determineTabsets() {
  return _.sortBy(
    _.filter([...useTabsetsStore().tabsets.values()] as Tabset[],
      (ts: Tabset) => ts.status !== TabsetStatus.DELETED
        && ts.status !== TabsetStatus.HIDDEN &&
        ts.status !== TabsetStatus.ARCHIVED),
    getTabsetOrder, ["asc"]);
}

watchEffect(() => {
  if (useFeaturesStore().hasFeature(FeatureIdent.SPACES)) {
    const currentSpace = useSpacesStore().space
    tabsets.value = _.sortBy(
      _.filter([...useTabsetsStore().tabsets.values()] as Tabset[], (ts: Tabset) => {
        if (currentSpace) {
          if (ts.spaces.indexOf(currentSpace.id) < 0) {
            return false
          }
        }
        return ts.status !== TabsetStatus.DELETED &&
          ts.status !== TabsetStatus.HIDDEN &&
          ts.status !== TabsetStatus.ARCHIVED
      }),
      getTabsetOrder, ["asc"])
  } else {
    tabsets.value = determineTabsets()
  }
})


function inIgnoredMessages(message: any) {
  return message.msg === "html2text" ||
    message.msg === "captureThumbnail" ||
    message.msg === "capture-annotation" ||
    message.name === "reload-spaces" ||
    // message.name === "window-updated" ||
    message.msg === "html2links"
}

if (inBexMode()) {
  // seems we need to define these listeners here to get the matching messages reliably
  // these messages are created by triggering events in the mainpanel
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log(" <<< received message", message)
    if (inIgnoredMessages(message)) {
      return true
    }
    if (message.name === 'current-tabset-id-change') {
      if (message.ignore) {
        return true
      }
      const tsId = message.data.tabsetId
      useTabsetsStore().selectCurrentTabset(tsId)
    } else if (message.name === 'feature-activated') {
      console.log("===>", message)
      // usePermissionsStore().addActivateFeature(message.data.feature)
      useFeaturesStore().activateFeature(message.data.feature)
      // if (message.data.feature === 'help') {
      //   useTabsetService().reloadTabset("HELP")
      // } else if (message.data.feature === 'bookmarks') {
      //   usePermissionsStore().load()
      //     .then(() => {
      //       useBookmarksStore().init()
      //       useBookmarksStore().loadBookmarks()
      //     })
      // }
    } else if (message.name === "feature-deactivated") {
      // usePermissionsStore().removeActivateFeature(message.data.feature)
      useFeaturesStore().deactivateFeature(message.data.feature)
    } else if (message.name === "tabsets-imported") {
      useSpacesStore().reload()
      //useTabsetService().init(useDB(undefined).db)
      // TODO reload
    } else if (message.name === "tab-being-dragged") {
      useUiStore().draggingTab(message.data.tabId, null as unknown as any)
    } else if (message.name === "note-changed") {
      // TODO needed?
      const tabset = useTabsetsStore().getTabset(message.data.tabsetId) as Tabset
      if (message.data.noteId) {
        console.log("updating note", message.data.noteId)
        const res = useTabsetsStore().getTabAndTabsetId(message.data.noteId)
        //.then((res: TabAndTabsetId | undefined) => {
        if (res) {
          const note = res.tab
          note.title = message.data.tab.title
          note.description = message.data.tab.description
          note.longDescription = message.data.tab.longDescription
        }
        useTabsetService().saveTabset(tabset)
        //    })
      } else {
        console.log("adding tab", message.data.tab)
        tabset.tabs.push(message.data.tab)
        useTabsetService().saveTabset(tabset)
      }
    } else if (message.name === "tab-added") {
      // hmm - getting this twice...
      console.log(" > got message '" + message.name + "'", message)
      useTabsetService().reloadTabset(message.data.tabsetId)
      //updateSelectedTabset(message.data.tabsetId, true)
    } else if (message.name === "tab-deleted") {
      useTabsetService().reloadTabset(message.data.tabsetId)
    } else if (message.name === "tabset-added") {
      useTabsetService().reloadTabset(message.data.tabsetId)
    } else if (message.name === "tabset-renamed") {
      TabsetService.rename(message.data.tabsetId, message.data.newName, message.data.newColor)
    } else if (message.name === "progress-indicator") {
      if (message.percent) {
        // uiStore.progress = message.percent
        // uiStore.progressLabel = message.label
      }
      if (message.status === "done") {
        // uiStore.progress = undefined
        // uiStore.progressLabel = undefined
      }
      sendResponse("ui store progress set to " + uiStore.progress)
    } else if (message.name === "detail-level-changed") {
      console.log("setting list detail level to ", message.data.level)
      useUiStore().setListDetailLevel(message.data.level)
    } else if (message.name === "detail-level-perTabset-changed") {
      console.log("setting list detail perTabset level to ", message.data.level)
      useUiStore().showDetailsPerTabset = message.data.level
    } else if (message.name === "fullUrls-changed") {
      console.log("setting fullUrls to ", message.data.value)
      useUiStore().setShowFullUrls(message.data.value)
    } else if (message.name === "reload-suggestions") {
      console.log("reload-suggestions message received")
      useSuggestionsStore().loadSuggestionsFromDb()
    } else if (message.name === "reload-tabset") {
      console.log("reload-tabset message received")
      const tabsetId = message.data.tabsetId ?
        message.data.tabsetId :
        useTabsetsStore().getCurrentTabset?.id
      useTabsetService().reloadTabset(tabsetId)
    } else if (message.name === 'reload-application') {
      AppService.restart("restarted=true")
    } else {
      console.log("got unmatched message", message)
    }
    return true
  })
}

function checkKeystroke(e: KeyboardEvent) {
  if (useUiStore().ignoreKeypressListener()) {
    return
  }
  if (e.key === '/') {
    // TODO does not work properly yet
    //showSearchBox.value = true
    // e.preventDefault()
    // // @ts-ignore
    // searchBox.value.focus()
    // search.value = ''
  }
}

const toolbarTitle = (tabsets: Tabset[]) => {
  if (useFeaturesStore().hasFeature(FeatureIdent.SPACES)) {
    const spaceName = useSpacesStore().space ? useSpacesStore().space.label : t('no_space_selected')
    return tabsets.length > 6 ?
      spaceName + ' (' + tabsets.length.toString() + ')' :
      spaceName
  }
  const title = LocalStorage.getItem(TITLE_IDENT) || ('My Tabsets' + stageIdentifier())
  return tabsets.length > 6 ? title + ' (' + tabsets.length.toString() + ')' : title
}

const suggestTabsetImport = () => {
  const currentTabUrl = useTabsStore2().currentChromeTab?.url
  if (currentTabUrl?.startsWith("https://shared.tabsets.net/#/pwa/tabsets/")) {
    const urlSplit = currentTabUrl.split("/")
    const tabsetId = urlSplit[urlSplit.length - 1]
    console.log("tabsetId", tabsetId, useTabsetsStore().getTabset(tabsetId))
    return !useTabsetsStore().getTabset(tabsetId)
  }
  return false
}

const importSharedTabset = () => {
  const currentTabUrl = useTabsStore2().currentChromeTab?.url
  if (currentTabUrl) {
    console.log("Importing", currentTabUrl)
  }
}

// @ts-ignore
const drop = (evt: any, folder: Tabset) => {
  console.log("drop", evt, folder)
  const tabToDrag = useUiStore().tabBeingDragged
  const tabset = useTabsetsStore().getCurrentTabset as Tabset | undefined
  if (tabToDrag && tabset) {
    console.log("tabToDrag", tabToDrag)
    const moveToFolderId = folder.id
    console.log("moveToFolderId", moveToFolderId)
    useTabsetService().moveTabToFolder(tabset, tabToDrag, moveToFolderId)
  }
}

const stageIdentifier = () => process.env.TABSETS_STAGE !== 'PRD' ? ' (' + process.env.TABSETS_STAGE + ')' : ''

const showSwitchedToLocalInfo = () => useUiStore().showSwitchedToLocalInfo
const ackSwitchToLocal = () => useUiStore().showSwitchedToLocalInfo = false

</script>

<style lang="scss">

.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}

.q-item__section--avatar {
  min-width: 46px !important;
  padding-right: 12px !important;
  margin-bottom: 14px;
}

.welcome-tooltip-container {
  position: absolute;
  top: 30px;
  right: -50px;
  width: 140px;
  display: inline-block
}

.welcome-tooltip-container .tooltip {
  z-index: 10000;
  padding: 0 8px;
  background: white;
  color: #333;
  position: absolute;
  top: -17px;
  right: 0;
  border: 2px solid #FFBF46;
  border-radius: 8px;
  font-size: 16px;
  box-shadow: 3px 3px 3px #ddd;
  animation: welcome-tooltip-pulse 1s ease-in-out infinite alternate
}

.welcome-tooltip-container .tooltip p {
  margin: 15px 0;
  line-height: 1.5
}

.welcome-tooltip-container .tooltip * {
  vertical-align: middle
}

.welcome-tooltip-container .tooltip::after {
  content: " ";
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 10px 12.5px 0 12.5px;
  border-color: #FFBF46 transparent transparent transparent;
  position: absolute;
  top: -10px;
  right: 35px;
  transform: rotate(180deg)
}

$width: 25px;
$height: 25px;

$bounce_height: 30px;

body {
  position: relative;
  width: 100%;
  height: 100vh;
}

.wrap {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.wrap2 {
  position: absolute;
  top: 30%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.text {
  //color: #000066;
  font-size: 24px;
  display: inline-block;
  margin-left: 5px;
}

.bounceball {
  position: relative;
  display: inline-block;
  height: 37px;
  width: $width;

  &:before {
    position: absolute;
    content: '';
    display: block;
    top: 0;
    width: $width;
    height: $height;
    border-radius: 50%;
    background-color: #fbae17;
    transform-origin: 50%;
    animation: bounce 500ms alternate infinite ease;
  }
}

@keyframes bounce {
  0% {
    top: $bounce_height;
    height: 5px;
    border-radius: 60px 60px 20px 20px;
    transform: scaleX(2);
  }
  35% {
    height: $height;
    border-radius: 50%;
    transform: scaleX(1);
  }
  100% {
    top: 0;
  }
}

</style>
