<template>
  <q-layout view="hHh lpR fFf">
    <q-drawer
      show-if-above
      v-model="useUiStore().rightDrawerOpen"
      side="right"
      bordered
      content-class="column justify-between no-wrap bg-grey-1">
      <DrawerRight />
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>
<script setup lang="ts">
import DrawerRight from 'src/core/components/DrawerRight.vue'
import { useUiStore } from 'src/ui/stores/uiStore'
</script>
