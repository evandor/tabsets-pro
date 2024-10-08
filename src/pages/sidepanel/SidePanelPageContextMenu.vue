<template>
  <q-menu :offset="[12, 8]">
    <q-list dense style="min-width: 180px">

      <ContextMenuItem v-close-popup
                       @was-clicked="openEditTabsetDialog(tabset)"
                       icon="o_note"
                       label="Edit Tabset"/>

      <ContextMenuItem v-close-popup
                       @was-clicked="emits('editHeaderDescription')"
                       icon="o_description"
                       label="Tabset Description..."/>

      <template v-if="useFeaturesStore().hasFeature(FeatureIdent.TABSET_SUBFOLDER)">

        <q-separator inset/>

        <ContextMenuItem v-close-popup
                         @was-clicked="createSubfolder(tabset)"
                         icon="o_folder"
                         label="Create Subfolder"/>

      </template>

      <q-separator inset v-if="useTabsetsStore().tabsets.size > 1"/>

      <ContextMenuItem v-close-popup
                       v-if="useFeaturesStore().hasFeature(FeatureIdent.NOTES)"
                       @was-clicked="startTabsetNote(tabset)"
                       icon="o_add_circle"
                       label="Create Note"/>


      <template v-if="tabset.tabs.length > 0 && inBexMode() && (
          (!tabset.window || tabset.window === 'current'))">
        <ContextMenuItem
          icon="open_in_new"
          label="Open all...">

          <q-item-section side>
            <q-icon name="keyboard_arrow_right"/>
          </q-item-section>
          <q-menu anchor="top end" self="top start">
            <q-list>
              <q-item v-if="useFeaturesStore().hasFeature(FeatureIdent.AUTO_TAB_SWITCHER)"
                      dense clickable v-close-popup @click="startAutoSwitchingTab(tabset.id)">
                <q-item-section>switching tab</q-item-section>
              </q-item>
              <q-item dense clickable v-close-popup @click="restoreInNewWindow(tabset.id)">
                <q-item-section>in new window</q-item-section>
              </q-item>
              <q-item dense clickable v-close-popup @click="restoreInGroup(tabset.id)">
                <q-item-section>in current window</q-item-section>
              </q-item>
            </q-list>
          </q-menu>

        </ContextMenuItem>

      </template>

      <template v-if="tabset.tabs.length > 0 && inBexMode() &&
            tabset.window && tabset.window !== 'current'">
        <ContextMenuItem v-close-popup
                         @was-clicked="restoreInGroup(tabset.id, tabset.window)"
                         icon="open_in_new"
                         label="Open in window..."/>
      </template>

      <template v-if="tabset.tabs.length > 0 && inBexMode()">
        <ContextMenuItem v-close-popup
                         @was-clicked="openOverviewPage(tabset.id)"
                         icon="open_in_new"
                         label="Show Overview"/>
      </template>

      <ContextMenuItem v-if="useTabsetsStore().tabsets.size > 6"
                       v-close-popup
                       @was-clicked="focus(tabset)"
                       icon="filter_center_focus"
                       color="accent"
                       label="Focus on tabset"/>

      <template v-if="tabset.status === TabsetStatus.DEFAULT && useTabsetsStore().tabsets.size > 1">
        <ContextMenuItem v-close-popup
                         @was-clicked="pin(tabset)"
                         icon="o_push_pin"
                         color="warning"
                         label="Pin"/>
      </template>
      <template v-else-if="tabset.status === TabsetStatus.FAVORITE">
        <ContextMenuItem v-close-popup
                         @was-clicked="unpin(tabset)"
                         icon="push_pin"
                         color="warning"
                         label="Unpin"/>

      </template>

      <template v-if="useFeaturesStore().hasFeature(FeatureIdent.ARCHIVE_TABSET) &&
        tabset.status === TabsetStatus.DEFAULT">
        <ContextMenuItem
          v-close-popup
          @was-clicked="archiveTabset(tabset)"
          icon="o_inventory_2"
          color="warning"
          label="Archive"/>
      </template>

      <q-separator inset/>

      <ContextMenuItem
        v-if="useFeaturesStore().hasFeature(FeatureIdent.TABSETS_SHARING) && (tabset.sharing === TabsetSharing.UNSHARED || !tabset.sharing)"
        v-close-popup
        @was-clicked="shareTabsetPubliclyDialog(tabset)"
        icon="ios_share"
        color="warning"
        label="Share as link..."/>

      <ContextMenuItem v-if="tabset.sharing === TabsetSharing.PUBLIC_LINK_OUTDATED"
                       v-close-popup
                       @was-clicked="shareTabsetPubliclyDialog(tabset, true)"
                       icon="ios_share"
                       color="warning"
                       label="Republish">
        <q-tooltip class="tooltip-small">Tabset has changed, republish</q-tooltip>
      </ContextMenuItem>

      <ContextMenuItem
        v-if="tabset.sharing === TabsetSharing.PUBLIC_LINK || tabset.sharing === TabsetSharing.PUBLIC_LINK_OUTDATED"
        v-close-popup
        @was-clicked="removePublicShare(tabset.id, tabset.sharedId || '')"
        icon="ios_share"
        color="warning"
        label="Stop Sharing">
        <q-tooltip class="tooltip-small">Delete Shared Link</q-tooltip>
      </ContextMenuItem>

      <q-separator inset v-if="useFeaturesStore().hasFeature(FeatureIdent.TABSETS_SHARING)"/>

      <!--      <template v-if="useFeaturesStore().hasFeature(FeatureIdent.DEV_MODE)">-->
      <!--        <ContextMenuItem v-close-popup-->
      <!--                         @was-clicked="useSearchStore().reindexTabset(tabset.id)"-->
      <!--                         icon="o_note"-->
      <!--                         label="Re-Index Search (dev)"/>-->

      <!--        <q-separator inset/>-->
      <!--      </template>-->

      <ContextMenuItem v-close-popup
                       @was-clicked="deleteTabsetDialog(tabset as Tabset)"
                       icon="o_delete"
                       color="negative"
                       :disable="tabset.sharedId !== undefined"
                       label="Delete Tabset">
        <q-tooltip class="tooltip-small" v-if="tabset.sharedId !== undefined">
          Stop sharing first if you want to delete this tabset
        </q-tooltip>
      </ContextMenuItem>

    </q-list>
  </q-menu>

</template>

<script lang="ts" setup>

import {FeatureIdent} from "src/app/models/FeatureIdent";
import {Tabset, TabsetSharing, TabsetStatus} from "src/tabsets/models/Tabset";
import NavigationService from "src/services/NavigationService";
import EditTabsetDialog from "src/tabsets/dialogues/EditTabsetDialog.vue";
import {LocalStorage, useQuasar} from "quasar";
import {useUtils} from "src/core/services/Utils";
import {useCommandExecutor} from "src/core/services/CommandExecutor";
import {RestoreTabsetCommand} from "src/tabsets/commands/RestoreTabset";
import {MarkTabsetAsFavoriteCommand} from "src/tabsets/commands/MarkTabsetAsFavorite";
import {MarkTabsetAsDefaultCommand} from "src/tabsets/commands/MarkTabsetAsDefault";
import DeleteTabsetDialog from "src/tabsets/dialogues/DeleteTabsetDialog.vue";
import ContextMenuItem from "pages/sidepanel/helper/ContextMenuItem.vue";
import {PropType} from "vue";
import {UnShareTabsetCommand} from "src/tabsets/commands/UnShareTabsetCommand"
import ShareTabsetPubliclyDialog from "src/tabsets/dialogues/ShareTabsetPubliclyDialog.vue";
import {MarkTabsetAsArchivedCommand} from "src/tabsets/commands/MarkTabsetAsArchived";
import {useRouter} from "vue-router";
import {useUiStore} from "src/ui/stores/uiStore";
import {NotificationType} from "src/core/services/ErrorHandler";
import {useTabsetsStore} from "src/tabsets/stores/tabsetsStore";
import {useFeaturesStore} from "src/features/stores/featuresStore";

const {inBexMode} = useUtils()

const $q = useQuasar()
const router = useRouter()

// @ts-ignore
const props = defineProps({
  tabset: {type: Object as PropType<Tabset>, required: true}
})

const emits = defineEmits(['editHeaderDescription'])

const startTabsetNote = (tabset: Tabset) => {
  const url = chrome && chrome.runtime && chrome.runtime.getURL ?
    chrome.runtime.getURL('www/index.html') + "#/mainpanel/notes/?tsId=" + tabset.id + "&edit=true" :
    "#/mainpanel/notes/?tsId=" + tabset.id + "&edit=true"
  NavigationService.openOrCreateTab([url])
}

const createSubfolder = (tabset: Tabset) => {
  // $q.dialog({
  //   component: NewSubfolderDialog,
  //   componentProps: {
  //     tabsetId: tabset.id,
  //     parentFolder: undefined
  //   }
  // })
}

const openEditTabsetDialog = (tabset: Tabset) => {
  $q.dialog({
    component: EditTabsetDialog,
    //TODO switch to tabset: tabset?
    componentProps: {
      tabsetId: tabset.id,
      tabsetName: tabset.name,
      tabsetColor: tabset.color,
      window: tabset.window,
      details: tabset.details || useUiStore().listDetailLevel,
      fromPanel: true
    }
  })
}

const restoreInNewWindow = (tabsetId: string, windowName: string | undefined = undefined) =>
  useCommandExecutor().execute(new RestoreTabsetCommand(tabsetId, windowName))

const startAutoSwitchingTab = (tabsetId: string) => {
  const tabset = useTabsetsStore().getTabset(tabsetId)
  if (tabset && tabset.tabs?.length > 1 && tabset.tabs[0].url) {
    const tabs = tabset.tabs
    let tabIndex = 0
    NavigationService.openSingleTab(tabset.tabs[tabIndex].url || '')
      .then(tab => {
        console.log("tabId", tab)
        let interval = setInterval(() => {
          try {
            const nextTab = tabs[++tabIndex % tabs.length]
            console.log("updating ", nextTab.url)
            chrome.tabs.update(tab.id || 0, {url: nextTab.url},
              cb => {
                if (chrome.runtime.lastError) {
                  console.warn("got runtime error", chrome.runtime.lastError)
                  clearInterval(interval)
                }
              })
          } catch (err) {
            console.log("got error", err, interval)
            clearInterval(interval)
          }
        }, LocalStorage.getItem("ui.tabSwitcher") as number || 5000)
      })
  }
}

const restoreInGroup = (tabsetId: string, windowName: string | undefined = undefined) =>
  useCommandExecutor().execute(new RestoreTabsetCommand(tabsetId, windowName, false))

const openOverviewPage = (tabsetId: string) =>
  NavigationService.openOrCreateTab([chrome.runtime.getURL(`www/index.html#/mainpanel/tabsets/overview/${tabsetId}`)])

const focus = (tabset: Tabset) =>
  router.push("/sidepanel/tabsets/" + tabset.id)

const pin = (tabset: Tabset) =>
  useCommandExecutor().executeFromUi(new MarkTabsetAsFavoriteCommand(tabset.id))

const unpin = (tabset: Tabset) =>
  useCommandExecutor().executeFromUi(new MarkTabsetAsDefaultCommand(tabset.id))

const removePublicShare = (tabsetId: string, sharedId: string) => useCommandExecutor().executeFromUi(new UnShareTabsetCommand(tabsetId, sharedId))

const archiveTabset = (tabset: Tabset) =>
  useCommandExecutor().executeFromUi(new MarkTabsetAsArchivedCommand(tabset.id), NotificationType.NOTIFY)

const deleteTabsetDialog = (tabset: Tabset) => {
  $q.dialog({
    component: DeleteTabsetDialog,
    componentProps: {
      tabsetId: tabset.id,
      tabsetName: tabset.name
    }
  })
}

const shareTabsetPubliclyDialog = (tabset: Tabset, republish: boolean = false) => {
  $q.dialog({
    component: ShareTabsetPubliclyDialog,
    componentProps: {
      tabsetId: tabset.id,
      sharedId: tabset.sharedId,
      tabsetName: tabset.name,
      republish: republish
    }
  })
}

</script>
