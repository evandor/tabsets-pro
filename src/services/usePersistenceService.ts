import PersistenceService from "src/services/PersistenceService";
import SpacesPersistence from "src/spaces/persistence/SpacesPersistence";
import TabsetsPersistence from "src/tabsets/persistence/TabsetsPersistence";
import FirestoreTabsetsPersistence from "src/tabsets/persistence/FirestoreTabsetsPersistence";
import FirestoreSpacesPersistence from "src/spaces/persistence/FirestoreSpacesPersistence";
import FeaturesPersistence from "src/features/persistence/FeaturesPersistence";
import FirestoreFeaturesPersistence from "src/features/persistence/FirestoreFeaturesPersistence";
import SnapshotsPersistence from "src/snapshots/persistence/SnapshotsPersistence";
import FirestoreSnapshotsPersistence from "src/snapshots/persistence/FirestoreSnapshotsPersistence.ts";
import FirestoreNotesPersistence from "src/notes/persistence/FirestoreNotesPersistence.ts";
import NotesPersistence from "src/notes/persistence/NotesPersistence.ts";
import ThumbnailsPersistence from "src/thumbnails/persistence/ThumbnailsPersistence.ts";
import FirestoreThumbnailsPersistence from "src/thumbnails/persistence/FirestoreThumbnailsPersistence.ts";

export function useDB() {

  const spacesDb: SpacesPersistence = FirestoreSpacesPersistence
  const tabsetsDb: TabsetsPersistence = FirestoreTabsetsPersistence

  const featuresDb: FeaturesPersistence = FirestoreFeaturesPersistence

  const snapshotsDb: SnapshotsPersistence = FirestoreSnapshotsPersistence
  const notesDb: NotesPersistence = FirestoreNotesPersistence
  const thumbnailsDb: ThumbnailsPersistence = FirestoreThumbnailsPersistence

  let localDb = undefined as unknown as PersistenceService

  return {
    //db,
    localDb,
    spacesDb,
    tabsetsDb,
    snapshotsDb,
    notesDb,
    thumbnailsDb,
    featuresDb
  }

}
