<template>
  <router-view />
</template>

<script setup lang="ts">
import { CURRENT_USER_ID } from 'boot/constants'
import { onAuthStateChanged } from 'firebase/auth'
import { setCssVar, useQuasar } from 'quasar'
import AppService from 'src/app/AppService'
import BexFunctions from 'src/core/communication/BexFunctions'
import { useNotificationHandler } from 'src/core/services/ErrorHandler'
import { useUtils } from 'src/core/services/Utils'
import { usePermissionsStore } from 'src/core/stores/usePermissionsStore'
import FirebaseServices from 'src/services/firebase/FirebaseServices'
import { useLogger } from 'src/services/Logger'
import { useUiStore } from 'src/ui/stores/uiStore'
import { useAppStore } from 'stores/appStore'
import { useSettingsStore } from 'stores/settingsStore'
import { onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const $q = useQuasar()
const router = useRouter()
const route = useRoute()
const { inBexMode } = useUtils()

const { handleError } = useNotificationHandler()

const settingsStore = useSettingsStore()
settingsStore.initialize($q.localStorage)
console.debug('')

usePermissionsStore().initialize()
console.debug('')

useAppStore().init()

const { info } = useLogger()

FirebaseServices.init()

const auth = FirebaseServices.getAuth()

onAuthStateChanged(auth, async (user) => {
  if (user) {
    console.log('%conAuthStateChanged: about to log in', 'border:1px solid green', user)

    try {
      await AppService.init($q, router, true, user)
      // info(`tabsets-pro started: mode=${process.env.MODE}, version=${import.meta.env.PACKAGE_VERSION}`)
      //FirebaseServices.startRealtimeDbListeners(user.uid)
    } catch (error: any) {
      console.log('%ccould not initialize appService due to ' + error, 'background-color:orangered')
      console.error('error', error, typeof error, error.code, error.message)
      handleError(error.code)
      return Promise.resolve()
    }
  } else {
    // User is signed out
    console.log('%conAuthStateChanged: logged out', 'border:1px solid green')
    console.log('test', route)
    if (!route.fullPath.startsWith('/pwa/imp/')) {
      await router.push('/sidepanel/login')
    }
  }
})

let useDarkMode: string = $q.localStorage.getItem('darkMode') || ('auto' as string)

if ($q.platform.is.safari && !$q.platform.is.bex) {
  console.log('switching dark mode default to false on safari non-bex')
  useDarkMode = $q.localStorage.getItem('darkMode') || ('false' as string)
}

if (useDarkMode === 'true') {
  $q.dark.set(true)
} else if (useDarkMode === 'false') {
  $q.dark.set(false)
} else {
  $q.dark.set('auto')
}

if (useDarkMode === 'true') {
  setCssVar('primary', '#D9E8F5')
  setCssVar('secondary', '#26A69A')
  setCssVar('accent', '#9C27B0')
  setCssVar('dark', '#1d1d1d')
  setCssVar('positive', '#21BA45')
  setCssVar('negative', '#C10015')
  setCssVar('info', '#31CCEC')
  setCssVar('separator', '#AA0099')
  // setCssVar('warning', 'green');

  // $body-font-size   : var(--q-theme-font-size, 20px);
  // $body-line-height : var(--q-theme-line-height, 1.2);
  // $typography-font-family: var(--q-theme-font-family, "'Roboto', '-apple-system', 'Helvetica Neue', Helvetica, Arial, sans-serif");
  // $button-font-size: var(--q-theme-btn-font-size, 16px);
}

const fontsize = useUiStore().fontsize
useUiStore().setFontsize(fontsize)

const currentUser = $q.localStorage.getItem(CURRENT_USER_ID)
if (currentUser) {
  console.log('current user id found, waiting for auto-login')
  // we should be logged in any second
} else {
  setTimeout(() => {
    // triggers, but app should already have been started, no restart enforced
    console.debug('app start fallback after 2000ms')
    AppService.init($q, router, false)
    // info(
    //   `tabsets-pro started: timeout=true, mode=${process.env.MODE}, version=${import.meta.env.PACKAGE_VERSION}`,
    // )
  }, 2000)
}

if (inBexMode()) {
  $q.bex.on('tabsets.bex.tab.excerpt', BexFunctions.handleBexTabExcerpt)
  onBeforeUnmount(() => {
    $q.bex.off('tabsets.bex.tab.excerpt', BexFunctions.handleBexTabExcerpt)
  })
}
</script>
