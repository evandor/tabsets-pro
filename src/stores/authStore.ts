import { defineStore } from 'pinia'
import { getAuth, signOut, User } from 'firebase/auth'
import { LocalStorage } from 'quasar'
import { computed, ref } from 'vue'
import { Account, UserData } from 'src/models/Account'
import { CURRENT_USER_ID } from 'boot/constants'
import { collection, doc, getDoc, getDocs } from 'firebase/firestore'
import FirebaseServices from 'src/services/firebase/FirebaseServices'
import PersistenceService from 'src/services/PersistenceService'
import { useSettingsStore } from 'stores/settingsStore'
import { sha256 } from 'js-sha256'

export enum AccessItem {
  TABSETS = 'TABSETS',
  SYNC = 'SYNC',
  SHARE = 'SHARE',
  FEATURE_TOGGLES = 'FEATURE_TOGGLES',
}

export const useAuthStore = defineStore('auth', () => {
  let storage = null as unknown as PersistenceService

  const authenticated = ref(false)
  const user = ref<User>(null as unknown as User)
  const roles = ref<string[]>([])
  const authRequest = ref<string>(null as unknown as string)
  const account = ref<Account | undefined>(undefined)

  const products = ref<string[]>([])
  const avatar = ref('https://www.gravatar.com/avatar/unknown')

  // --- init ---
  async function initialize(ps: PersistenceService) {
    console.debug(' ...initializing AuthStore')
    storage = ps

    //check stored user info
    const userId = LocalStorage.getItem(CURRENT_USER_ID) as string
    if (userId) {
      try {
        console.log('getting account info for user', userId)
        const a: Account = await storage.getAccount(userId)
        account.value = a
      } catch (err) {
        console.warn('could not get account:', err)
      }
    }
  }

  // --- getters ---
  const isAuthenticated = computed(() => {
    return (): boolean => {
      return authenticated.value
    }
  })

  const getUsername = computed(() => {
    if (authenticated.value) {
      // @ts-ignore
      return user.value?.displayName || 'undefined'
    }
    return 'anonymous'
  })

  const getAccount = computed(() => {
    return (): Account | undefined => account.value
  })

  const getAccessTokenSilently = computed(async () => {
    if (process.env.MODE === 'electron') {
      // @ts-ignore
      const accessToken = await window.electronAPI.getAccessToken()
      return accessToken
    }
    return 'await auth0.getAccessTokenSilently()'
  })

  const useAuthRequest = computed(() => {
    const val = authRequest.value
    // authRequest.value = null as unknown as string
    // console.log("auth request was nulled, was ", val)
    return val
  })

  const limitExceeded = computed(() => {
    function hasRole(role: string) {
      return roles.value.indexOf(role) >= 0
    }

    return (item: AccessItem, count: number): boolean => {
      const localMode = useSettingsStore().isEnabled('localMode')
      if (localMode) {
        return false
      }

      switch (item) {
        case AccessItem.TABSETS:
          if (hasRole('bibbly.team')) {
            return count >= 50
          } else if (hasRole('bibbly.user')) {
            return count >= 10
          } else {
            return count >= 5
          }
        default:
          return false
      }
    }
  })

  async function getCustomClaimRoles(): Promise<string[]> {
    await FirebaseServices.getAuth().currentUser!.getIdToken(true)
    const decodedToken = await FirebaseServices.getAuth().currentUser!.getIdTokenResult()
    //console.log("decodedToken", decodedToken)
    return (decodedToken.claims.stripeRole as string[]) || []
  }

  const userMayAccess = computed(() => {
    return (item: AccessItem): boolean => {
      //console.log("checking access item", item)
      if (!user.value) {
        //console.log("result: no (no user)")
        return false
      }
      //console.log("checking against account", account.value)
      switch (item) {
        case AccessItem.SYNC:
          // return products.value.indexOf("prod_PLJipUG1Zfw7pC") >= 0
          return account.value ? account.value.products.indexOf('skysailSync') >= 0 : false
        case AccessItem.SHARE:
          return account.value !== undefined
        case AccessItem.FEATURE_TOGGLES:
          return true
        default:
          return false
      }
    }
  })

  // --- actions ---
  async function setUser(u: User | undefined) {
    if (u) {
      console.log('setting user id to', u.uid, await getCustomClaimRoles())
      LocalStorage.set(CURRENT_USER_ID, u.uid)
      authenticated.value = true
      user.value = JSON.parse(JSON.stringify(u))
      roles.value = await getCustomClaimRoles()
      console.log('user has roles: ', roles.value)
      const fs = FirebaseServices.getFirestore()
      const d = doc(fs, 'users', u.uid)
      const userDoc = await getDoc(d)
      const userData = userDoc.data() as UserData
      const account = new Account(u.uid, userData)
      console.debug('created account object', account)
      const querySnapshot = await getDocs(
        collection(FirebaseServices.getFirestore(), 'users', u.uid, 'subscriptions'),
      )
      const products = new Set<string>()
      querySnapshot.forEach((doc) => {
        const subscriptionData = doc.data()
        if (subscriptionData.data && subscriptionData.data.metadata) {
          products.add(subscriptionData.data.metadata.product)
        }
        account.setProducts(Array.from(products))
        //console.log("hier", account, products)
      })
      upsertAccount(account)

      if (user.value.email) {
        const hashedEmail = sha256(user.value.email.trim().toLowerCase())
        avatar.value = `https://www.gravatar.com/avatar/${hashedEmail}`
      }
    } else {
      LocalStorage.remove(CURRENT_USER_ID)
      authenticated.value = false
      user.value = null as unknown as User
      console.log(` ...setting user id to <null>`)
      products.value = []
    }
  }

  function setAuthRequest(ar: string) {
    console.log('setting auth request to', ar)
    authRequest.value = ar
  }

  function logout(): Promise<any> {
    console.log('logging out user')
    avatar.value = 'https://www.gravatar.com/avatar/unknown'
    return signOut(getAuth()).then(() => {
      authenticated.value = false
      user.value = null as unknown as User
      LocalStorage.remove(CURRENT_USER_ID)
      //console.log("logout", (process.env.MODE === 'bex') ? window.location.origin + "/www/index.html" : window.location.origin)
      return Promise.resolve('')
    })
  }

  function upsertAccount(acc: Account | undefined) {
    if (acc) {
      //storage.upsertAccount(acc)
    }
    account.value = acc
  }

  function setProducts(ps: string[]) {
    products.value = ps
  }

  return {
    initialize,
    isAuthenticated,
    getUsername,
    getAccessTokenSilently,
    useAuthRequest,
    setAuthRequest,
    setUser,
    logout,
    user,
    upsertAccount,
    getAccount,
    setProducts,
    userMayAccess,
    limitExceeded,
    avatar,
  }
})
