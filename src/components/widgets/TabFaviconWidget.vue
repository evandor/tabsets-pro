<template>
  <q-icon v-if="UrlExtension.IMAGE === tab?.extension" :size="props.width" name="image" />
  <q-icon v-else-if="UrlExtension.RSS === tab?.extension" size="22px" name="rss_feed" />
  <q-icon v-else-if="UrlExtension.PDF === tab?.extension" size="22px" name="pdf" />
  <q-icon v-else-if="UrlExtension.NOTE === tab?.extension" size="22px" name="o_note" />
  <q-img
    v-else
    class="rounded-borders"
    :style="props.preventDragAndDrop ? '' : 'cursor: move'"
    :width="props.width"
    :height="props.height"
    :src="getFaviconUrl(tab as Tab)">
    <q-tooltip v-if="!props.preventDragAndDrop" class="tooltip">
      drag and drop to reorder in tabset
      {{ useSettingsStore().isEnabled('dev') ? 'Tab#: ' + tab.id : '' }}
    </q-tooltip>
    <q-tooltip v-else class="tooltip">This is a sorted list, you cannot drag and drop</q-tooltip>
  </q-img>
</template>

<script lang="ts" setup>
import { useUtils } from 'src/core/services/Utils'
import { useSettingsStore } from 'src/core/stores/settingsStore'
import { Tab, UrlExtension } from 'src/tabsets/models/Tab'
import { PropType } from 'vue'

const { favIconFromUrl } = useUtils()

const props = defineProps({
  tab: { type: Object as PropType<Tab>, required: true },
  width: { type: String, default: '22px' },
  height: { type: String, default: '22px' },
  preventDragAndDrop: { type: Boolean, default: false },
})

const getFaviconUrl = (tab: Tab) => {
  //const chromeTab = tab?.chromeTab
  if (tab && tab.url?.startsWith('chrome')) {
    return ''
  }
  if (tab && tab.favIconUrl) {
    return tab.favIconUrl
  }
  if (!useSettingsStore().isEnabled('noDDG') && tab && tab.url) {
    return favIconFromUrl(tab.url)
  }
  return ''
}
</script>
