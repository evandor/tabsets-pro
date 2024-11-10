import Command from "src/core/domain/Command";
import {ExecutionResult} from "src/core/domain/ExecutionResult";
import {GrantPermissionCommand} from "src/domain/commands/GrantPermissionCommand";
import {useBookmarksStore} from "src/bookmarks/stores/bookmarksStore";
import ChromeBookmarkListeners from "src/services/ChromeBookmarkListeners";
import {useFeaturesStore} from "src/features/stores/featuresStore";
import {usePermissionsStore} from "stores/usePermissionsStore";

class UndoCommand implements Command<boolean> {

  constructor(public permission: string) {
  }

  execute(): Promise<ExecutionResult<boolean>> {
    console.log("execution undo command", this.permission)
    return new GrantPermissionCommand(this.permission).execute()
      .then(res => new ExecutionResult(true, "Permission was granted again"))
  }

}

export class RevokePermissionCommand implements Command<boolean> {

  constructor(public permission: string) {
  }

  async execute(): Promise<ExecutionResult<boolean>> {
    if ("bookmarks" === this.permission) {
      useBookmarksStore().loadBookmarks()
        .then(() => {
          ChromeBookmarkListeners.removeListeners()
          useBookmarksStore().bookmarksLeaves = []
          // TabsetService.init()
        })
        .catch ((err) => {
          console.info("dealing with error: " + err)
          ChromeBookmarkListeners.removeListeners()
          useBookmarksStore().bookmarksLeaves = []
          // TabsetService.init()
        })
    }
    useFeaturesStore().deactivateFeature(this.permission)
    return usePermissionsStore().revokePermission(this.permission)
      .then(() => {

        return new ExecutionResult(
          true,
          "Permission was revoked",
          new Map([["Undo", new UndoCommand(this.permission)]]))
      })
  }

}

RevokePermissionCommand.prototype.toString = function cmdToString() {
  return `RevokePermissionCommand: {permission=${this.permission}}`;
};
