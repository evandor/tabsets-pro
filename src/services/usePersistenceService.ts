import PersistenceService from 'src/services/PersistenceService'
import SpacesPersistence from 'src/spaces/persistence/SpacesPersistence'
import TabsetsPersistence from 'src/tabsets/persistence/TabsetsPersistence'
import FirestoreTabsetsPersistence from 'src/tabsets/persistence/FirestoreTabsetsPersistence'
import FirestoreSpacesPersistence from 'src/spaces/persistence/FirestoreSpacesPersistence'
import FeaturesPersistence from 'src/features/persistence/FeaturesPersistence'
import FirestoreFeaturesPersistence from 'src/features/persistence/FirestoreFeaturesPersistence'
import SnapshotsPersistence from 'src/snapshots/persistence/SnapshotsPersistence'
import FirestoreSnapshotsPersistence from 'src/snapshots/persistence/FirestoreSnapshotsPersistence'
import FirestoreNotesPersistence from 'src/notes/persistence/FirestoreNotesPersistence'
import NotesPersistence from 'src/notes/persistence/NotesPersistence'
import ThumbnailsPersistence from 'src/thumbnails/persistence/ThumbnailsPersistence'
import FirestoreThumbnailsPersistence from 'src/thumbnails/persistence/FirestoreThumbnailsPersistence'
import { LocalStorageTabsetsPersistence } from 'src/tabsets/persistence/LocalStorageTabsetsPersistence'

export function useDB() {
  const spacesDb: SpacesPersistence = FirestoreSpacesPersistence
  const tabsetsDb: TabsetsPersistence = FirestoreTabsetsPersistence

  const featuresDb: FeaturesPersistence = FirestoreFeaturesPersistence

  const snapshotsDb: SnapshotsPersistence = FirestoreSnapshotsPersistence
  const notesDb: NotesPersistence = FirestoreNotesPersistence
  const thumbnailsDb: ThumbnailsPersistence = FirestoreThumbnailsPersistence

  let localDb = undefined as unknown as PersistenceService

  let localStorageTabsetsDb: LocalStorageTabsetsPersistence = new LocalStorageTabsetsPersistence()

  return {
    //db,
    localDb,
    spacesDb,
    tabsetsDb,
    localStorageTabsetsDb,
    snapshotsDb,
    notesDb,
    thumbnailsDb,
    featuresDb,
  }
}
