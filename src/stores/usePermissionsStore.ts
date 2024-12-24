import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const usePermissionsStore = defineStore('permissions', () => {
  // related to chrome permissions
  const grantedOptionalPermissions = ref<string[] | undefined>([])
  const grantedOptionalOrigins = ref<string[] | undefined>([])
  const permissions = ref<chrome.permissions.Permissions | undefined>(undefined)

  async function initialize() {
    console.debug(' ...initializing permissionsStore', '✅')
    await load()
  }

  async function load() {
    if (process.env.MODE !== 'bex') {
      return
    }
    if (chrome) {
      // issues in vitest where chrome is not defined
      // @ts-ignore
      permissions.value = await chrome.permissions.getAll()
      if (permissions.value) {
        grantedOptionalPermissions.value = permissions.value.permissions
          ? permissions.value.permissions
          : []
        grantedOptionalOrigins.value = permissions.value.origins ? permissions.value.origins : []
      }
    }
  }

  const hasPermission = computed(() => {
    return (permission: string): boolean | undefined => {
      console.log('query for permission', permission, grantedOptionalPermissions.value)
      return grantedOptionalPermissions.value
        ? grantedOptionalPermissions.value.indexOf(permission) >= 0
        : undefined
    }
  })

  const hasAllOrigins = computed(() => {
    return (): boolean | undefined => {
      return grantedOptionalOrigins.value
        ? grantedOptionalOrigins.value.indexOf('*://*/*') >= 0
        : undefined
    }
  })

  async function grantPermission(permission: string): Promise<boolean> {
    // @ts-ignore
    const granted: boolean = await chrome.permissions.request({ permissions: [permission] })
    return load().then(() => Promise.resolve(granted))
  }

  async function revokePermission(permission: string): Promise<void> {
    // @ts-ignore
    await chrome.permissions.remove({ permissions: [permission] })
    await load()
    return Promise.resolve()
  }

  return {
    initialize,
    load,
    hasPermission,
    grantPermission,
    revokePermission,
    hasAllOrigins,
    permissions,
  }
})
