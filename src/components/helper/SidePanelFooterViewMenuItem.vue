<template>
  <q-item v-if="showItem()" @click="toggleView()" :disable="props.disable" dense clickable v-close-popup>
    <q-item-section avatar>
      <q-icon :color="isActive() ? 'primary' : 'secondary'" :name="props.icon" size="xs" />
    </q-item-section>
    <q-item-section>{{ props.label }}</q-item-section>
  </q-item>
</template>

<script lang="ts" setup>
import { SidePanelViews } from 'src/app/models/SidePanelViews'
import { useUiStore } from 'src/ui/stores/uiStore'
import { PropType } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps({
  sidePanelView: { type: Object as PropType<SidePanelViews>, required: true },
  icon: { type: String, required: true },
  size: { type: String, default: '9px' },
  label: { type: String, required: true },
  disable: { type: Boolean, default: false },
  tooltip: { type: String, required: false },
})

const router = useRouter()

const isActive = () => useUiStore().sidePanelIsActive(props.sidePanelView)
const activateView = (view: SidePanelViews) => useUiStore().sidePanelSetActiveView(view)

const showItem = () => props.sidePanelView?.showButton()

const toggleView = () => {
  if (isActive()) {
    activateView(SidePanelViews.MAIN)
    router.push('/sidepanel')
  } else {
    activateView(props.sidePanelView)
    if (props.sidePanelView === SidePanelViews.MAIN) {
      router.push('/sidepanel')
    } else {
      router.push('/sidepanel/' + props.sidePanelView?.toString())
    }
  }
}
</script>

<style scoped>
.q-item__section--avatar {
  padding-right: 4px !important;
  min-width: 30px !important;
  margin-bottom: 0;
}
</style>
