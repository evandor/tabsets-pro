import { collection, onSnapshot } from 'firebase/firestore'
import { defineStore } from 'pinia'
import FirebaseServices from 'src/services/firebase/FirebaseServices'
import { Message } from 'src/tabsets/models/Message'
import { useAuthStore } from 'stores/authStore'
import { computed, ref } from 'vue'

export const useMessagesStore = defineStore('messages', () => {
  let unsubscribe: any

  const lastUpdate = ref<number>(new Date().getTime())
  const count = ref(0)
  const messages = ref<Message[]>([])

  function initialize() {
    console.debug(` ...initializing messagesStore`)
    setUpSnapshotListener()
  }

  function setUpSnapshotListener() {
    messages.value = []
    unsubscribe = onSnapshot(
      collection(FirebaseServices.getFirestore(), 'users', useAuthStore().user.uid, 'messages'),
      (docs) => {
        //const source = doc.metadata.hasPendingWrites ? 'Local' : 'Server'
        docs.forEach((doc: any) => {
          console.log('onSnapshot data: ', doc.data())
          messages.value.push(doc.data())
          lastUpdate.value = new Date().getTime()
        })
      },
    )
  }

  const getUnreadMessages = computed(() => messages.value)
  const doubleCount = computed(() => count.value * 2)

  return {
    initialize,
    lastUpdate,
    doubleCount,
    getUnreadMessages,
  }
})
