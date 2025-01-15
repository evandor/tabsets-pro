import { collection, onSnapshot } from 'firebase/firestore'
import { defineStore } from 'pinia'
import FirebaseServices from 'src/services/firebase/FirebaseServices'
import { Message } from 'src/tabsets/models/Message'
import { useAuthStore } from 'stores/authStore'
import { computed, ref } from 'vue'

export const useMessagesStore = defineStore('messages', () => {
  let unsubscribe: any

  const lastUpdate = ref<number>(new Date().getTime())
  const messages = ref<Message[]>([])

  function initialize() {
    // console.debug(` ...initializing messagesStore`)
    setUpSnapshotListener()
  }

  function setUpSnapshotListener() {
    messages.value = []
    const userId = useAuthStore().user.uid
    if (userId) {
      unsubscribe = onSnapshot(
        collection(FirebaseServices.getFirestore(), 'users', useAuthStore().user.uid, 'messages'),
        (docs) => {
          messages.value = []
          //const source = doc.metadata.hasPendingWrites ? 'Local' : 'Server'
          docs.forEach((doc: any) => {
            //console.log('onSnapshot data: ', messages.value.length, doc.data())
            messages.value.push(doc.data())
            lastUpdate.value = new Date().getTime()
          })
        },
      )
    } else {
      console.warn('could not add snapshot listener (yet), no user id available')
    }
  }

  const getUnreadMessages = computed(() => messages.value.sort((a: Message, b: Message) => b.created - a.created))

  return {
    initialize,
    lastUpdate,
    getUnreadMessages,
  }
})
