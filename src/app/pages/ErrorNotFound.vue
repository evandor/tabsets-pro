<template>
  <div class="fullscreen bg-blue text-white text-center q-pa-md flex flex-center">
    <div>
      <div style="font-size: 30vh">404</div>

      <div class="text-h2" style="opacity: 0.4">Oops. Nothing here...<br /><br /></div>
      <div class="text-caption" style="opacity: 0.4">
        {{ location }}
      </div>

      <q-btn class="q-mt-xl" color="white" text-color="blue" unelevated to="/" label="Go Home" no-caps />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const location = ref(window.location.href)
</script>
