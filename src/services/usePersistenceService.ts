// import IndexedDbPersistenceService from "src/services/IndexedDbPersistenceService";
import {LocalStorage, QVueGlobals, useQuasar} from "quasar";
// import {LocalStoragePersistenceService} from "src/services/storage/LocalStoragePersistenceService";
import PersistenceService from "src/services/PersistenceService";
// import FsPersistentService from "src/services/persistence/FirestorePersistenceService";
import SpacesPersistence from "src/spaces/persistence/SpacesPersistence";
// import IndexedDbSpacesStorage from "src/spaces/persistence/IndexedDbSpacesStorage"
import TabsetsPersistence from "src/tabsets/persistence/TabsetsPersistence";
import IndexedDbTabsetsPersistence from "src/tabsets/persistence/IndexedDbTabsetsPersistence";
import FirestoreTabsetsPersistence from "src/tabsets/persistence/FirestoreTabsetsPersistence";
import FirestoreSpacesPersistence from "src/spaces/persistence/FirestoreSpacesPersistence";
import FeaturesPersistence from "src/features/persistence/FeaturesPersistence";
import {LocalStorageFeaturesPersistence} from "src/features/persistence/LocalStorageFeaturesPersistence";
import FirestoreFeaturesPersistence from "src/features/persistence/FirestoreFeaturesPersistence";
import IndexedDbSpacesPersistence from "src/spaces/persistence/IndexedDbSpacesPersistence";
import SnapshotsPersistence from "src/snapshots/persistence/SnapshotsPersistence";
import IndexedDbSnapshotPersistence from "src/snapshots/persistence/IndexedDbSnapshotPersistence";

export function useDB(quasar: QVueGlobals | undefined = undefined) {

  // const db: PersistenceService = IndexedDbPersistenceService

  const spacesIndexedDb: SpacesPersistence = IndexedDbSpacesPersistence
  const spacesFirestoreDb: SpacesPersistence = FirestoreSpacesPersistence

  const tabsetsIndexedDb: TabsetsPersistence = IndexedDbTabsetsPersistence
  const tabsetsFirestoreDb: TabsetsPersistence = FirestoreTabsetsPersistence

  const featuresFirestoreDb: FeaturesPersistence = FirestoreFeaturesPersistence

  const snapshotsIndexedDb: SnapshotsPersistence = IndexedDbSnapshotPersistence

  let localDb = undefined as unknown as PersistenceService
  let featuresLocalStorage: FeaturesPersistence = undefined as unknown as FeaturesPersistence
  if (quasar) {
    //localDb = new LocalStoragePersistenceService(quasar)
    featuresLocalStorage = new LocalStorageFeaturesPersistence(quasar)
  }
  //let firestore = FsPersistentService

  return {
    //db,
    localDb,
    //firestore,
    spacesIndexedDb, spacesFirestoreDb,
    tabsetsIndexedDb, tabsetsFirestoreDb,
    featuresFirestoreDb, featuresLocalStorage,
    snapshotsIndexedDb
  }

}
