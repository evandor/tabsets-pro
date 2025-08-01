import { Tabset } from 'src/tabsets/models/Tabset'

export type ActionProps = {
  tabset: Tabset
  folder?: Tabset | undefined
  currentChromeTab?: chrome.tabs.Tab
  level: 'root' | 'folder'
  disable?: boolean | undefined
  element: 'contextmenu' | 'btn' | 'popup'
}
