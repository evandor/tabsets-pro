<template>
  <router-view />
</template>

<script setup lang="ts">
import { getAuth, onAuthStateChanged, signInAnonymously } from 'firebase/auth/web-extension'
import { LocalStorage, setCssVar, useQuasar } from 'quasar'
import AppService from 'src/app/AppService'
import { CURRENT_USER_ID, EXTENSION_NAME, NEW_TAB_EXTENSION_ID } from 'src/boot/constants'
import BexFunctions from 'src/core/communication/BexFunctions'
import { useNotificationHandler } from 'src/core/services/ErrorHandler'
import { useUtils } from 'src/core/services/Utils'
import { usePermissionsStore } from 'src/core/stores/usePermissionsStore'
import FirebaseServices from 'src/services/firebase/FirebaseServices'
import { useLogger } from 'src/services/Logger'
import { useAppStore } from 'src/stores/appStore'
import { useSettingsStore } from 'src/stores/settingsStore'
import { useUiStore } from 'src/ui/stores/uiStore'
import { onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const $q = useQuasar()
const router = useRouter()
const route = useRoute()
const { inBexMode, setupConsoleInterceptor } = useUtils()

const { handleError } = useNotificationHandler()

// TODO only in prod?
if (process.env.TABSETS_STAGE !== 'EMULATOR') {
  setupConsoleInterceptor(useUiStore())
}

const settingsStore = useSettingsStore()
settingsStore.initialize($q.localStorage)

usePermissionsStore().initialize()

useAppStore().init()

const { info } = useLogger()

FirebaseServices.init()

const auth = FirebaseServices.getAuth()

onAuthStateChanged(auth, async (user) => {
  if (user) {
    console.log('%conAuthStateChanged: about to log in', 'border:1px solid green', user?.email)

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
    if (inBexMode()) {
      if (!(route.fullPath.startsWith('/pwa/imp/') || route.fullPath.startsWith('/mainpanel/login'))) {
        const welcomePageHasBeenShown = LocalStorage.getItem('ui.welcome.shown') as boolean
        if (welcomePageHasBeenShown) {
          await router.push('/sidepanel/login')
        } else {
          await router.push('/sidepanel/welcome')
        }
      }
    } else {
      const auth = getAuth()
      signInAnonymously(auth)
        .then((user: any) => {
          console.log('logged in anonymously', user)
        })
        .catch((err: any) => {
          console.warn('error logging ')
        })
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
  }, 2000)
}

info(`${EXTENSION_NAME} started`)

if (inBexMode()) {
  $q.bex.on('tabsets.bex.tab.excerpt', BexFunctions.handleBexTabExcerpt)
  onBeforeUnmount(() => {
    $q.bex.off('tabsets.bex.tab.excerpt', BexFunctions.handleBexTabExcerpt)
  })
  $q.bex.on('reload-current-tabset', BexFunctions.handleReload)
  onBeforeUnmount(() => {
    $q.bex.off('reload-current-tabset', BexFunctions.handleReload)
  })
}

// newtab extension installed?
//console.log('checkin', NEW_TAB_EXTENSION_ID)
chrome.runtime.sendMessage(NEW_TAB_EXTENSION_ID, { message: 'getVersion' }, function (response) {
  //console.log('testing for newtab extension', response)
  if (response) {
    console.log('newtab is installed')
    LocalStorage.setItem('ui.newtab.installed', true)
  } else if (chrome.runtime.lastError) {
    LocalStorage.setItem('ui.newtab.installed', false)
    /* ignore */
  }
  // if (targetInRange(response.targetData))
  //chrome.runtime.sendMessage('bafapaeaebbfoobjakidbomlnpfcfakn', { activateLasers: true })
})

chrome.runtime.onMessageExternal.addListener(function (request, sender, sendResponse) {
  // if (sender.id === "oeocceffjkjgiljgelllkaddapnaafgn") { // tabsets.net
  //   if (request.message === "getVersion") {
  //     sendResponse({version: "0.0.1"});
  //   } else if (request.message === "setTabset") {
  //     useTabsetsStore().setTabset( request.tabset)
  //     sendResponse({message: "done"});
  //   }
  //   // sendResponse({version: import.meta.env.PACKAGE_VERSION});
  // }
  console.log('request:', request)
  console.log('sender:', sender)
})
</script>
