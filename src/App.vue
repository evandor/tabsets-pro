<template>
  <router-view/>
</template>

<script setup lang="ts">

import {setCssVar, useQuasar} from "quasar";
import AppService from "src/services/AppService";
import {onAuthStateChanged} from "firebase/auth";
import {useRouter} from "vue-router";
import FirebaseServices from "src/services/firebase/FirebaseServices";
import {useNotificationHandler} from "src/core/services/ErrorHandler";
import {useUtils} from "src/core/services/Utils";
import {CURRENT_USER_ID} from "boot/constants";
import {useSettingsStore} from "stores/settingsStore.ts";
import {useAppStore} from "stores/appStore.ts";
import {useLogger} from "src/services/Logger.ts";

const $q = useQuasar()
const router = useRouter()
const {inBexMode} = useUtils()

const {handleError} = useNotificationHandler()

const settingsStore = useSettingsStore()
settingsStore.initialize($q.localStorage)
//const localMode = settingsStore.isEnabled('localMode')
//console.log(` ...config: localMode=${localMode}`)

useAppStore().init()

const {info} = useLogger()

// https://stackoverflow.com/questions/9768444/possible-eventemitter-memory-leak-detected
// const emitter = new EventEmitter()
// emitter.setMaxListeners(12)

FirebaseServices.init()

const auth = FirebaseServices.getAuth()

onAuthStateChanged(auth, async (user) => {
  if (user) {
    console.log("%conAuthStateChanged: about to log in", "border:1px solid green")

    try {
      await AppService.init($q, router, true, user)
      info(`tabsets-pro started: mode=${process.env.MODE}, version=${process.env.VERSION}`)
      if (inBexMode()) {
        // @ts-ignore
        $q.bex.send('auth.user.login', {userId: user.uid})
      }
      //FirebaseServices.startRealtimeDbListeners(user.uid)
    } catch (error: any) {
      console.log("%ccould not initialize appService due to " + error, "background-color:orangered")
      console.error("error", error, typeof error, error.code, error.message)
      handleError(error.code)
      return Promise.resolve()
    }

  } else {
    // User is signed out
    console.log("%conAuthStateChanged: logged out", "border:1px solid green")
    // await AppService.init($q, router, true, undefined)
    // if (inBexMode()) {
    //   $q.bex.send('auth.user.logout', {})
    // }
    router.push("/sidepanel/login")
    // if (!router.currentRoute.value.path.startsWith("/mainpanel")) {
    //   console.log("NOT redirecting to '/'")
    //   //await router.push("/")
    // }
  }
});

let useDarkMode: string = $q.localStorage.getItem('darkMode') || "auto" as string

if ($q.platform.is.safari && !$q.platform.is.bex) {
  console.log("switching dark mode default to false on safari non-bex")
  useDarkMode = $q.localStorage.getItem('darkMode') || "false" as string
}

if (useDarkMode === "true") {
  $q.dark.set(true)
} else if (useDarkMode === "false") {
  $q.dark.set(false)
} else {
  $q.dark.set("auto")
}

if (useDarkMode === "true") {
  setCssVar('primary', '#D9E8F5');
  setCssVar('secondary', '#26A69A');
  setCssVar('accent', '#9C27B0');
  setCssVar('dark', '#1d1d1d');
  setCssVar('positive', '#21BA45');
  setCssVar('negative', '#C10015');
  setCssVar('info', '#31CCEC');
  setCssVar('separator', '#AA0099');
  // setCssVar('warning', 'green');
}

const currentUser = $q.localStorage.getItem(CURRENT_USER_ID)
if (currentUser) {
  console.log("current user id found, waiting for auto-login")
  // we should be logged in any second
} else {
  setTimeout(() => {
    // triggers, but app should already have been started, no restart enforced
    console.debug("app start fallback after 2000ms")
    AppService.init($q, router, false)
    info(`tabsets-pro started: timeout=true, mode=${process.env.MODE}, version=${process.env.VERSION}`)
  }, 2000)
}

</script>
