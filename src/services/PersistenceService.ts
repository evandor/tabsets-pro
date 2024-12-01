// Deprecated
import {Account} from "src/models/Account";

interface PersistenceService {

  getServiceName(): string

  //getRequest(url: string): Promise<string>

  //getMetaLinks(url: string): Promise<object>
  //saveMetaLinks(url: string, metaLinks: MetaLink[]): Promise<void | IDBValidKey>
  //getLinks(url: string): Promise<object>
  //saveLinks(url: string, links: any): Promise<void | IDBValidKey>

  //saveRequest(url: string, requestInfo: RequestInfo): Promise<void>

  cleanUpRequests(): Promise<void>


  compactDb(): Promise<any>


  getAccount(accountId: string): Promise<Account>
  upsertAccount(account: Account):void

  clear(name: string):any

}

export default PersistenceService
