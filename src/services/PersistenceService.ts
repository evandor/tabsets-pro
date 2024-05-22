import {Tabset} from "src/tabsets/models/Tabset";
import {Account} from "src/models/Account";

interface PersistenceService {

  getServiceName(): string

  loadTabsets():Promise<void>
  reloadTabset(tabsetId: string): void
  saveTabset(tabset: Tabset): Promise<any>
  deleteTabset(tabsetId: string):Promise<any>
  cleanUpTabsets(): Promise<void>

  getRequest(url: string): Promise<string>

  getMetaLinks(url: string): Promise<object>
  getLinks(url: string): Promise<object>
  saveLinks(url: string, links: any): Promise<void | IDBValidKey>

  saveRequest(url: string, requestInfo: RequestInfo): Promise<void>

  cleanUpRequests(): Promise<void>

  getNotifications(onlyNew: boolean): Promise<Notification[]>
  addNotification(notification: Notification): Promise<any>
  notificationRead(notificationId: string): Promise<void>

  compactDb(): Promise<any>

  getActiveFeatures(): Promise<string[]>
  saveActiveFeatures(val: string[]): any

  addGroup(group: chrome.tabGroups.TabGroup): Promise<any>
  updateGroup(group: chrome.tabGroups.TabGroup): Promise<any>
  getGroups(): Promise<chrome.tabGroups.TabGroup[]>
  deleteGroupByTitle(title: string): Promise<void>

  getAccount(accountId: string): Promise<Account>
  upsertAccount(account: Account):void

  clear(name: string):any

}

export default PersistenceService
