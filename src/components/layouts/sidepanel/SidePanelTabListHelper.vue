<template>
  <q-item
    clickable
    v-ripple
    class="q-ma-none q-px-sm q-pt-xs q-pb-none q-ml-sm"
    :class="props.indent ? 'q-ml-md' : ''"
    :style="itemStyle()"
    @dragstart="startDrag($event, tab)"
    :key="'paneltablist_' + tab.id">
    <PanelTabListElementWidget
      :key="'ptlew__' + tab.id"
      :tab="tab"
      :type="props.type"
      :sorting="props.sorting"
      :show-tabsets="props.showTabsets"
      :preventDragAndDrop="props.preventDragAndDrop"
      :tabset="props.tabset!"
      :hide-menu="props.hideMenu" />
  </q-item>
</template>

<script setup lang="ts">
import { FeatureIdent } from 'src/app/models/FeatureIdent'
import { useFeaturesStore } from 'src/features/stores/featuresStore'
import { Tab, TabSorting } from 'src/tabsets/models/Tab'
import { Tabset } from 'src/tabsets/models/Tabset'
import PanelTabListElementWidget from 'src/tabsets/widgets/PanelTabListElementWidget.vue'
import { useUiStore } from 'src/ui/stores/uiStore'
import { PropType } from 'vue'

const props = defineProps({
  tab: { type: Object as PropType<Tab>, required: true },
  index: { type: Number, required: true },
  hideMenu: { type: Boolean, default: false },
  indent: { type: Boolean, default: false },
  sorting: { type: String as PropType<TabSorting>, default: TabSorting.CUSTOM },
  type: { type: String, default: 'sidepanel' },
  tabset: { type: Object as PropType<Tabset>, required: false },
  showTabsets: { type: Boolean, default: false },
  preventDragAndDrop: { type: Boolean, default: false },
})

const startDrag = (evt: any, tab: Tab) => {
  console.log('start drag', evt, tab)
  if (evt.dataTransfer) {
    evt.dataTransfer.dropEffect = 'all'
    evt.dataTransfer.effectAllowed = 'all'
    evt.dataTransfer.setData('text/plain', tab.id)
    useUiStore().draggingTab(tab.id, evt)
  }
  //console.log("evt.dataTransfer.getData('text/plain')", evt.dataTransfer.getData('text/plain'))
}

const itemStyle = () => {
  let style = ''
  if (props.tab.color && useFeaturesStore().hasFeature(FeatureIdent.COLOR_TAGS)) {
    style = style + 'border-left:3px solid ' + props.tab.color + ';border-radius:4px;'
  }
  return style
}
</script>
