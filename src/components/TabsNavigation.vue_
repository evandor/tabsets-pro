<template>
  <q-layout view="lHh lpr lFf" container style="height: 100%">
    <!--    <q-header class="q-pa-none q-mt-sm darkInDarkMode brightInBrightMode">-->
    <!--      <q-toolbar>-->
    <!--        <q-toolbar-title>-->
    <!--          <div class="row justify-start items-baseline" v-if="useFeaturesStore().hasFeature(FeatureIdent.SPACES)">-->
    <!--            <SpacesSelectorWidget />-->
    <!--          </div>-->
    <!--          <div class="row justify-start items-baseline" v-else>My Tabsets</div>-->
    <!--        </q-toolbar-title>-->
    <!--      </q-toolbar>-->
    <!--    </q-header>-->

    <q-page-container>
      <q-page class="q-pa-md" style="padding-top: 30px">
        <div class="q-ma-none q-pa-none q-pt-xs">
          #{{ tabsets.length }}
          <template v-if="useTabsetsStore().tabsets.size > 0">
            <div class="row q-ma-none q-pa-none items-start darkInDarkMode brightInBrightMode">
              <!-- optional: notes -->
              <div class="col-12">
                <SidePanelNotesView v-if="currentTabset" :tabset="currentTabset" />
              </div>

              <!-- folders -->
              <div class="col-12">
                <SidePanelFoldersView v-if="currentTabset" :tabset="currentTabset" filter="" />
              </div>

              <!-- list of tabs, assuming here we have at least one tabset-->
              <PublicPageTabList
                v-if="currentTabset"
                :tabsCount="(currentTabset as Tabset).tabs.length"
                :tabset="tabsetForTabList(currentTabset as Tabset)" />
            </div>
          </template>
        </div>
        <!-- place QPageSticky at end of page -->
        <q-page-sticky expand position="top" class="darkInDarkMode brightInBrightMode">
          <FirstToolbarHelper2 :showSearchBox="false"></FirstToolbarHelper2>
        </q-page-sticky>
      </q-page>
    </q-page-container>

    <q-footer class="q-pa-none q-mt-sm darkInDarkMode brightInBrightMode">
      <template v-if="useFeaturesStore().hasFeature(FeatureIdent.TABSET_LIST)">
        <SidePanelTabsetListMarkup />
      </template>

      <SidePanelMessagesMarkup />
    </q-footer>
  </q-layout>
</template>

<script setup lang="ts">
import _ from 'lodash'
import FirstToolbarHelper2 from 'pages/sidepanel/helper/FirstToolbarHelper2.vue'
import { useQuasar } from 'quasar'
import { FeatureIdent } from 'src/app/models/FeatureIdent'
import { useFeaturesStore } from 'src/features/stores/featuresStore'
import SidePanelNotesView from 'src/notes/views/sidepanel/SidePanelNotesView.vue'
import SidePanelMessagesMarkup from 'src/tabsets/components/helper/SidePanelMessagesMarkup.vue'
import SidePanelTabsetListMarkup from 'src/tabsets/components/helper/SidePanelTabsetListMarkup.vue'
import PublicPageTabList from 'src/tabsets/layouts/PublicPageTabList.vue'
import { Tabset, TabsetStatus } from 'src/tabsets/models/Tabset'
import { useTabsetService } from 'src/tabsets/services/TabsetService2'
import { useTabsetsStore } from 'src/tabsets/stores/tabsetsStore'
import SidePanelFoldersView from 'src/tabsets/views/sidepanel/SidePanelFoldersView.vue'
import { ref, watchEffect } from 'vue'

const $q = useQuasar()

const tabsets = ref<Tabset[]>([])

const currentTabset = ref<Tabset | undefined>(undefined)

$q.loadingBar.setDefaults({
  color: 'green',
  size: '10px',
  position: 'bottom',
})

watchEffect(() => {
  currentTabset.value = useTabsetsStore().getCurrentTabset
})

watchEffect(() => {
  tabsets.value = determineTabsets()
})

const tabsetForTabList = (tabset: Tabset) => {
  if (tabset.folderActive) {
    const af = useTabsetService().findFolder(tabset.folders, tabset.folderActive)
    if (af) {
      return af
    }
  }
  return tabset
}

function determineTabsets() {
  return _.sortBy(
    _.filter(
      [...useTabsetsStore().tabsets.values()] as Tabset[],
      (ts: Tabset) =>
        ts.status !== TabsetStatus.DELETED && ts.status !== TabsetStatus.HIDDEN && ts.status !== TabsetStatus.ARCHIVED,
    ),
    ['asc'],
  )
}
</script>
