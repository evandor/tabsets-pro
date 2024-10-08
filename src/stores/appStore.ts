import {defineStore} from 'pinia';
import {ref} from "vue";
import {LocalStorage, uid} from "quasar";
import {APP_INSTALLATION_ID} from "boot/constants";

export const useAppStore = defineStore('app', () => {

  const installationId = ref<string | undefined>(LocalStorage.getItem(APP_INSTALLATION_ID) as string || undefined)

  function init() {
    // make sure we have an installation id
    getInstallationId()
  }

  function getInstallationId() {
    if (installationId.value) {
      return installationId.value
    }
    const useId = uid()
    installationId.value = useId
    LocalStorage.set(APP_INSTALLATION_ID, useId)
    return useId
  }

  return {
    init,
    getInstallationId
  }
})
