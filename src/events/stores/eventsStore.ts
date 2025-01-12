import { collection, onSnapshot } from 'firebase/firestore'
import { defineStore } from 'pinia'
import FirebaseServices from 'src/services/firebase/FirebaseServices'
import { Event } from 'src/tabsets/models/Event'
import { useTabsetsStore } from 'src/tabsets/stores/tabsetsStore'
import { useAuthStore } from 'stores/authStore'
import { ref } from 'vue'

export const useEventsStore = defineStore('events', () => {
  let unsubscribe: any

  const lastUpdate = ref<number>(new Date().getTime())
  const events = ref<Event[]>([])

  function initialize() {
    console.debug(` ...initializing eventsStore`)
    setUpSnapshotListener()
  }

  function setUpSnapshotListener() {
    events.value = []
    let reloadTabset = false
    unsubscribe = onSnapshot(
      collection(FirebaseServices.getFirestore(), 'users', useAuthStore().user.uid, 'events'),
      (docs) => {
        events.value = []
        //const source = doc.metadata.hasPendingWrites ? 'Local' : 'Server'
        docs.forEach((doc: any) => {
          console.log('onSnapshot data event: ', events.value.length, doc.data())
          const event = doc.data() as Event
          events.value.push(event)
          lastUpdate.value = new Date().getTime()

          // compare with current tabset
          const currentTs = useTabsetsStore().getCurrentTabset
          if (currentTs) {
            console.log('checking timestamps', currentTs.loaded - event.created)
            if (currentTs.loaded && currentTs.loaded < event.created) {
              console.log('reloading tabset!')
              reloadTabset = true
            }
          }
        })

        if (reloadTabset) {
          console.log('initiating reload')
          useTabsetsStore().reloadTabset(useTabsetsStore().currentTabsetId!)
          reloadTabset = false
        }
      },
    )
  }

  return {
    initialize,
    lastUpdate,
    //getUnreadMessages,
  }
})
