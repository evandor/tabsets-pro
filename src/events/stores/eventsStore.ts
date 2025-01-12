import { collection, onSnapshot } from 'firebase/firestore'
import { defineStore } from 'pinia'
import FirebaseServices from 'src/services/firebase/FirebaseServices'
import { Message } from 'src/tabsets/models/Message'
import { useAuthStore } from 'stores/authStore'
import { ref } from 'vue'

export const useEventsStore = defineStore('events', () => {
  let unsubscribe: any

  const lastUpdate = ref<number>(new Date().getTime())
  const events = ref<Message[]>([])

  function initialize() {
    console.debug(` ...initializing eventsStore`)
    setUpSnapshotListener()
  }

  function setUpSnapshotListener() {
    events.value = []
    unsubscribe = onSnapshot(
      collection(FirebaseServices.getFirestore(), 'users', useAuthStore().user.uid, 'events'),
      (docs) => {
        events.value = []
        //const source = doc.metadata.hasPendingWrites ? 'Local' : 'Server'
        docs.forEach((doc: any) => {
          console.log('onSnapshot data event: ', events.value.length, doc.data())
          events.value.push(doc.data())
          lastUpdate.value = new Date().getTime()
        })
      },
    )
  }

  //const getUnreadMessages = computed(() => events.value.sort((a: Message, b: Message) => b.created - a.created))

  return {
    initialize,
    lastUpdate,
    //getUnreadMessages,
  }
})
