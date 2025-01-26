import { LocalStorage } from 'quasar'

export function useEventsServices() {
  const getLocalStorageEvents = (): { added: string[]; removed: string[] } => {
    return (
      (LocalStorage.getItem('ui.events.tabsets') as {
        added: string[]
        removed: string[]
      }) || { added: [], removed: [] }
    )
  }

  const updateTabsetEvents = (tabsetEvents: { [p: string]: object }) => {
    LocalStorage.setItem('ui.events.tabsets', tabsetEvents)
  }

  const addTabsetsEvent = (eventTabsetId: string, events: string[]) => {
    const localStorageEvents: { added: string[]; removed: string[] } = getLocalStorageEvents()
    const tabsetEvents: { [k: string]: object } = {}

    tabsetEvents[eventTabsetId] = {
      added: localStorageEvents.added ? localStorageEvents.added.concat(events) : events,
      removed: localStorageEvents.removed,
    }
    updateTabsetEvents(tabsetEvents)
  }

  const removeTabsetEvent = (eventTabsetId: string, identifier: string, commentId: string) => {
    console.log('removing tabset event', eventTabsetId, identifier, commentId)
    const localStorageEvents = getLocalStorageEvents()
    const tabsetEvents: { [k: string]: object } = {}
    tabsetEvents[eventTabsetId] = {
      added: localStorageEvents.added
        ? localStorageEvents.added.filter((a: string) => a !== identifier + ':' + commentId)
        : [],
      removed: localStorageEvents.removed,
    }
    updateTabsetEvents(tabsetEvents)
  }

  return {
    // getLocalStorageEvents,
    // updateTabsetEvents,
    addTabsetsEvent,
    removeTabsetEvent,
  }
}
