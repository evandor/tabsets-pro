<template>
  <q-menu :offset="[12, 8]">
    <q-list dense style="min-width: 180px">
      <ContextMenuItem
        v-close-popup
        @was-clicked="createSubfolder(tabset, folder)"
        icon="o_folder"
        label="Create Subfolder" />

      <ContextMenuItem
        v-close-popup
        @was-clicked="renameSubfolder(tabset, folder)"
        icon="o_edit"
        label="Rename Subfolder" />

      <q-separator inset />

      <ContextMenuItem
        v-close-popup
        @was-clicked="deleteSubfolder(tabset, folder)"
        color="negative"
        icon="o_delete"
        label="Delete Folder" />
    </q-list>
  </q-menu>
</template>

<script lang="ts" setup>
import ContextMenuItem from 'pages/sidepanel/helper/ContextMenuItem.vue'
import { Tabset } from 'src/tabsets/models/Tabset'
import { PropType } from 'vue'

// @ts-ignore
const props = defineProps({
  tabset: { type: Object as PropType<Tabset>, required: true },
  folder: { type: Object as PropType<Tabset>, required: true },
})

const emits = defineEmits(['editHeaderDescription'])

const createSubfolder = (tabset: Tabset, folder: Tabset) => {
  // $q.dialog({
  //   component: NewSubfolderDialog,
  //   componentProps: {
  //     tabsetId: tabset.id,
  //     parentFolder: folder.id
  //   }
  // })
}

const renameSubfolder = (tabset: Tabset, folder: Tabset) => {
  // $q.dialog({
  //   component: RenameSubfolderDialog,
  //   componentProps: {
  //     tabset: tabset,
  //     folder: folder,
  //     name: folder.name
  //   }
  // })
}

const deleteSubfolder = (tabset: Tabset, folder: Tabset) => {
  // $q.dialog({
  //   component: DeleteSubfolderDialog,
  //   componentProps: {
  //     tabset: tabset,
  //     folder: folder
  //   }
  // })
}
</script>
