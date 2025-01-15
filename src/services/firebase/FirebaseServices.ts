import firebase from 'firebase/compat/app'
import 'firebase/compat/auth'
import 'firebase/compat/firestore'
import { Auth, connectAuthEmulator, getAuth } from 'firebase/auth'
import { connectFirestoreEmulator, Firestore, getFirestore, initializeFirestore } from 'firebase/firestore'
import { connectStorageEmulator, FirebaseStorage, getStorage } from 'firebase/storage'
import { useUiStore } from 'src/ui/stores/uiStore'

class FirebaseServices {
  private firebaseApp: firebase.app.App = null as unknown as firebase.app.App
  private auth: Auth = null as unknown as Auth
  private firestore: Firestore = null as unknown as Firestore
  // private messaging: Messaging = null as unknown as Messaging
  private storage: FirebaseStorage = null as unknown as FirebaseStorage

  // private realtimeDb: Database = null as unknown as Database

  init() {
    // console.log('initializing FirebaseServices')
    this.firebaseApp = firebase.initializeApp({
      apiKey: process.env.FIREBASE_API_KEY,
      authDomain: process.env.FIREBASE_AUTH_DOMAIN,
      projectId: process.env.FIREBASE_PROJECT_ID,
      appId: process.env.FIREBASE_APP_ID,
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    })
    this.auth = getAuth(this.firebaseApp)
    if (process.env.TABSETS_STAGE === 'EMULATOR') {
      useUiStore().setWatermark('emulator')
      console.warn('using firebase emulators for auth, storage and firestore')
      connectAuthEmulator(this.auth, 'http://127.0.0.1:9099')
      const db = getFirestore()
      connectFirestoreEmulator(db, '127.0.0.1', 8080)
      connectStorageEmulator(getStorage(), '127.0.0.1', 9199)
    }

    // https://firebase.google.com/docs/firestore/manage-data/enable-offline#web-modular-api
    // initializeFirestore(this.firebaseApp, {
    //   localCache:
    //     persistentLocalCache({tabManager: persistentMultipleTabManager()})
    // })
    initializeFirestore(this.firebaseApp, {})
    this.firestore = getFirestore(this.firebaseApp)
    this.storage = getStorage(this.firebaseApp)
    //console.log('initializing FirebaseServices -- done')
  }

  getAuth() {
    return this.auth
  }

  getFirestore(): Firestore {
    return this.firestore
  }

  getStorage(): FirebaseStorage {
    return this.storage
  }
}

export default new FirebaseServices()
