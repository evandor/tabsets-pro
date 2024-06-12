import Command from "src/core/domain/Command";
import {ExecutionResult} from "src/core/domain/ExecutionResult";
import {useGroupsStore} from "stores/groupsStore";


export class DeleteChromeGroupCommand implements Command<string> {

    constructor(public groupTitle: string) {
    }

    async execute(): Promise<ExecutionResult<string>> {
        return useGroupsStore().deleteGroupByTitle(this.groupTitle)
            .then((res) => {
                return new ExecutionResult("", "Chrome Group was removed")
            })
    }
}


DeleteChromeGroupCommand.prototype.toString = function cmdToString() {
    return `DeleteChromeGroupCommand: {groupTitle=${this.groupTitle}}`;
};