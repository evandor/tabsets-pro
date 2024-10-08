import {bexBackground} from 'quasar/wrappers'

function openExtension() {
  chrome.tabs.create(
    {
      url: chrome.runtime.getURL('www/index.html')
    },
    (/* newTab */) => {
      // Tab opened.
    }
  )
}


// chrome.runtime.onInstalled.addListener((callback) => {
//   console.log("[service-worker] ga: fire event install", callback.reason, callback.previousVersion)
//   // getting error: "Service worker registration failed. Status code: 15"
//   // Analytics.fireEvent('install-' + callback.reason);
//   console.log("callback:::", callback)
//   if (callback.reason !== OnInstalledReason.CHROME_UPDATE) {
//     chrome.tabs.create({
//       active: false,
//       url: callback.previousVersion ?
//         "https://docs.tabsets.net/release-notes" :
//         "https://tabsets.web.app/#/installed/"
//     }).then((newTab: chrome.tabs.Tab) => {
//       setTimeout(() => {
//         chrome.tabs.update(newTab.id || 0, {active: true})
//       }, 2000)
//     })
//   }
//   if (chrome.runtime.lastError) {
//     console.warn("got runtime error", chrome.runtime.lastError)
//   }
// });

chrome.action.onClicked.addListener(openExtension)

declare module '@quasar/app-vite' {
  interface BexEventMap {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    log: [{ message: string; data?: any[] }, never];
    getTime: [never, number];

    'storage.get': [{ key: string | null }, any];
    'storage.set': [{ key: string; value: any }, any];
    'storage.remove': [{ key: string }, any];
    /* eslint-enable @typescript-eslint/no-explicit-any */
  }
}

// @ts-ignore
if (chrome.sidePanel && chrome.sidePanel.setPanelBehavior) {
  // @ts-ignore
  chrome.sidePanel
    .setPanelBehavior({openPanelOnActionClick: true})
    .catch((error: any) => console.error(error));
}

export default bexBackground((bridge /* , allActiveConnections */) => {
  bridge.on('log', ({data/*, respond */}) => {
    console.log(`[BEX] ${data.message}`, ...(data.data || []));
    // TODO
    //respond();
  });

  bridge.on('getTime', ({respond}) => {
    respond(Date.now());
  });

  bridge.on('storage.get', ({data, respond}) => {
    const {key} = data;
    if (key === null) {
      chrome.storage.local.get(null, (items) => {
        // Group the values up into an array to take advantage of the bridge's chunk splitting.
        respond(Object.values(items));
      });
    } else {
      chrome.storage.local.get([key], (items) => {
        respond(items[key]);
      });
    }
  });
  // Usage:
  // const { data } = await bridge.send('storage.get', { key: 'someKey' })

  bridge.on('storage.set', ({data, respond}) => {
    chrome.storage.local.set({[data.key]: data.value}, () => {
      respond();
    });
  });
  // Usage:
  // await bridge.send('storage.set', { key: 'someKey', value: 'someValue' })

  bridge.on('storage.remove', ({data, respond}) => {
    chrome.storage.local.remove(data.key, () => {
      respond();
    });
  });
  // Usage:
  // await bridge.send('storage.remove', { key: 'someKey' })

  /*
  // EXAMPLES
  // Listen to a message from the client
  bridge.on('test', d => {
    console.log(d)
  })

  // Send a message to the client based on something happening.
  chrome.tabs.onCreated.addListener(tab => {
    bridge.send('browserTabCreated', { tab })
  })

  // Send a message to the client based on something happening.
  chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.url) {
      bridge.send('browserTabUpdated', { tab, changeInfo })
    }
  })
   */
});
