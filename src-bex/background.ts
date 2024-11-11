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

// https://developer.chrome.com/docs/extensions/mv3/tut_analytics/
//console.log("ga: installing google analytics")

chrome.action.onClicked.addListener(openExtension)

declare module '@quasar/app-vite' {
}

// @ts-ignore
if (chrome.sidePanel && chrome.sidePanel.setPanelBehavior) {
  // @ts-ignore
  chrome.sidePanel
    .setPanelBehavior({openPanelOnActionClick: true})
    .catch((error: any) => console.error(error));
}

export default bexBackground((bridge /* , allActiveConnections */) => {







});
