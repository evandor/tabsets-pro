<template>
  <!-- FirstToolbarHelper -->
  <q-toolbar class="text-primary q-pa-none q-pl-sm q-pr-xs q-pb-none greyBorderBottom" :style="offsetTop()">
    <q-toolbar-title>
      <div class="row q-ma-none q-pa-none">

        <!-- we have spaces -->
        <div v-if="useFeaturesStore().hasFeature(FeatureIdent.SPACES)" class="col-6 q-ma-none q-pa-none">

          <!-- spaces and no back button -->

          <SearchWithTransitionHelper v-if="searching"/>

          <FilterWithTransitionHelper v-else-if="showFilter"/>

          <template>
            <div class="column q-ma-none q-pa-none">
              <div class="col q-ma-none q-pa-none cursor-pointer text-subtitle1">
                <slot name="title">**{{ props.title }}</slot>
              </div>
            </div>
          </template>
        </div>

        <!-- no spaces here -->
        <div v-else class="col q-ma-none q-pa-none">
          <!-- no spaces && searching -->
          <SearchWithTransitionHelper v-if="searching"
                                      :search-term="props.searchTerm"
                                      :search-hits="props.searchHits"/>

          <FilterWithTransitionHelper v-else-if="showFilter"/>
          <!-- no spaces && not searching -->
          <template v-else>

            <!-- no spaces && not searching -->
            <div class="col-12 text-subtitle1">
              <slot name="title">{{ props.title }}</slot>
            </div>

          </template>
        </div>

        <!-- spaces or not, here's the icons on the right side -->
        <div class="col text-subtitle1 text-right q-ma-none q-pa-none q-pr-sm" v-if="!useUiStore().appLoading">

          <slot name="iconsRight">

<!--            <SidePanelToolbarButton-->
<!--              v-if="showToggleSessionIcon()"-->
<!--              :color="existingSession ? (useTabsetsStore().getCurrentTabset?.type === TabsetType.SESSION ? 'red':'grey-5') :'black'"-->
<!--              :icon="existingSession ? 'o_stop_circle':'o_play_circle'"-->
<!--              @click="toggleSessionState"-->
<!--              :tooltip="existingSession ? 'Stop Session' : 'Start new Session'"/>-->

            <template v-if="showSearchIcon()">
              <SidePanelToolbarButton icon="search"
                                      id="toggleSearchBtn"
                                      size="11px"
                                      @click="toggleSearch"/>
              <span class="q-ma-none q-pa-none q-mx-sm text-grey-5">|</span>
            </template>

<!--            <SidePanelToolbarTabNavigationHelper/>-->

            <SidePanelToolbarButton
              v-if="showSyncInfo()"
              icon="o_sync_alt"
              tooltip="This account is being synced"
              :color="useUiStore().syncing ? 'green':'grey'"
              size="9px"
              class="q-ml-sm q-mr-sm"/>

            <!--            <SidePanelToolbarButton-->
            <!--              icon="o_add_circle"-->
            <!--              :tooltip="newTabsetTooltip()"-->
            <!--              color="warning"-->
            <!--              class="q-ml-sm"-->
            <!--              :class="{ shake: annimateNewTabsetButton }"-->
            <!--              data-testid="addTabsetBtn"-->
            <!--              @click="openNewTabsetDialog()"/>-->

            <q-btn outline
                   label="New Tabset"
                   color="primary"
                   size="sm"
                   :class="{ shake: annimateNewTabsetButton }"
                   data-testid="addTabsetBtn"
                   @click="openNewTabsetDialog()"
                   class="q-ma-none q-px-sm q-py-none"
                   name="o_bookmark_add"/>

          </slot>
        </div>
      </div>
    </q-toolbar-title>
  </q-toolbar>
</template>

<script lang="ts" setup>

import {FeatureIdent} from "src/app/models/FeatureIdent";
import {useSpacesStore} from "src/spaces/stores/spacesStore";
import {useRouter} from "vue-router";
import {ref, watchEffect} from "vue";
import {useUiStore} from "src/ui/stores/uiStore";
import NewTabsetDialog from "src/tabsets/dialogues/NewTabsetDialog.vue";
import SidePanelToolbarButton from "components/buttons/SidePanelToolbarButton.vue";
import {useQuasar} from "quasar";
import {useAuthStore} from "stores/authStore";
import {useTabsetsStore} from "src/tabsets/stores/tabsetsStore";
import {useFeaturesStore} from "src/features/stores/featuresStore";
import {SidePanelViews} from "src/models/SidePanelViews";
import FilterWithTransitionHelper from "src/core/widget/FilterWithTransitionHelper.vue";
import SearchWithTransitionHelper from "pages/sidepanel/helper/SearchWithTransitionHelper.vue";

const props = defineProps({
  title: {type: String, default: "My Tabsets"},
  forceTitle: {type: Boolean, default: false},
  showSearchBox: {type: Boolean, default: false},
  searchTerm: {type: String, default: ''},
  searchHits: {type: Number, required: false}
})

const $q = useQuasar()
const router = useRouter()

const searching = ref(false)
const showFilter = ref(false)
const windowLocation = ref('')
const annimateNewTabsetButton = ref(false)

const toggleSearch = () => {
  searching.value = !searching.value
  if (searching.value) {
    router.push("/sidepanel/search")
  } else {
    router.push("/sidepanel")
  }
}

windowLocation.value = window.location.href

watchEffect(() => {
  annimateNewTabsetButton.value = useUiStore().animateNewTabsetButton
})

watchEffect(() => {
  if (props.showSearchBox && !searching.value) {
    searching.value = true
  }
})

watchEffect(() => {
  showFilter.value = useUiStore().sidePanelActiveViewIs(SidePanelViews.TABS_LIST) &&
    useUiStore().toolbarFilter
})

if ($q.platform.is.chrome && $q.platform.is.bex && chrome.commands) {
  chrome.commands.onCommand.addListener((command) => {
    if (command === 'search') {
      console.debug(`got Command: ${command}`);
      toggleSearch()
    }
  })
}

// const toggleSessionState = () => existingSession ? stopSession() : startSession()
//
// const startSession = () => $q.dialog({
//   component: NewSessionDialog,
//   componentProps: {replaceSession: false, inSidePanel: true}
// })

// const stopSession = () => {
//   const tabsetWithSession = _.filter([...useTabsetsStore().tabsets.values()], (ts: Tabset) => ts.type === TabsetType.SESSION)
//   console.log("tabsetWithSession", tabsetWithSession)
//   if (tabsetWithSession && tabsetWithSession.length > 0) { // should be one at most
//     useCommandExecutor().executeFromUi(new StopSessionCommand(tabsetWithSession[0]))
//   }
// }

const showSearchIcon = () => useTabsetsStore().tabsets.size > 1

const openNewTabsetDialog = () => {
  $q.dialog({
    component: NewTabsetDialog,
    componentProps: {
      tabsetId: useTabsetsStore().getCurrentTabset?.id,
      spaceId: useSpacesStore().space?.id,
      fromPanel: true
    }
  })
}

const showSyncInfo = () => {
  if (!useAuthStore().isAuthenticated()) {
    return false
  }
  // const syncType = useAuthStore().getAccount()?.userData?.sync?.type || SyncType.NONE
  return true
}

const offsetTop = () => ($q.platform.is.capacitor || $q.platform.is.cordova) ? 'margin-top:40px;' : ''

</script>

<style scoped>

.v-enter-active,
.v-leave-active {
  transition: opacity 3.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}

</style>
