import Command from "src/core/domain/Command.ts";
import {ExecutionResult} from "src/core/domain/ExecutionResult.ts";
import {deleteUser, getAuth} from "firebase/auth";
import {useTabsetsStore} from "src/tabsets/stores/tabsetsStore.ts";
import {Tabset} from "src/tabsets/models/Tabset.ts";
import {useSpacesStore} from "src/spaces/stores/spacesStore.ts";
import {Space} from "src/spaces/models/Space.ts";

export default class DeleteAccountCommand implements Command<any> {

  async execute(): Promise<ExecutionResult<any>> {
    const auth = getAuth();
    const user2 = auth.currentUser;
    if (user2) {
      try {
        await deleteUser(user2)

        localStorage.clear()

        for (const ts of useTabsetsStore().tabsets.values()) {
          await useTabsetsStore().deleteTabset(ts.id)
        }

        for (const space of useSpacesStore().spaces.values()) {
          useSpacesStore().deleteById(space.id)
        }

        useTabsetsStore().tabsets = new Map<string, Tabset>()
        useSpacesStore().spaces = new Map<string, Space>()
        alert("user account has been deleted")
        // sendMsg('restart-application', {initiatedBy: "FeatureToggleSettings"})
        // setTimeout(() => {
        //   window.close()
        // }, 1000)
      } catch (error) {
        console.warn(error)
        alert(error)
        return Promise.reject(error)
      }

      // FirebaseServices.getFirestore().clearPersistence().catch(error => {
      //   console.error('Could not enable persistence:', error.code);
      // })

      return Promise.resolve(new ExecutionResult("", "done"))


    } else {
      return Promise.reject("could not find current user")
    }
  }

}

DeleteAccountCommand.prototype.toString = function cmdToString() {
  return `DeleteAccountCommand: {}`;
};
