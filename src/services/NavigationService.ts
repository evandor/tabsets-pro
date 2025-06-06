import _ from 'lodash'
import { openURL } from 'quasar'
import { FeatureIdent } from 'src/app/models/FeatureIdent'
import { ExecutionResult } from 'src/core/domain/ExecutionResult'
import { useNotificationHandler } from 'src/core/services/ErrorHandler'
import JsUtils from 'src/core/utils/JsUtils'
import { useFeaturesStore } from 'src/features/stores/featuresStore'
import { useAuthStore } from 'src/stores/authStore'
import { RefreshTabCommand } from 'src/tabsets/commands/RefreshTabCommand'
import { TabAndTabsetId } from 'src/tabsets/models/TabAndTabsetId'
import { useTabsetService } from 'src/tabsets/services/TabsetService2'
import { useGroupsStore } from 'src/tabsets/stores/groupsStore'
import { useTabsetsStore } from 'src/tabsets/stores/tabsetsStore'
import { useTabsStore2 } from 'src/tabsets/stores/tabsStore2'
import { useThumbnailsService } from 'src/thumbnails/services/ThumbnailsService'
import { useWindowsStore } from 'src/windows/stores/windowsStore'

/**
 * refactoring remark: uses many other modules, needs to be one-per-application
 *
 */
class NavigationService {
  placeholderPattern = /\${[^}]*}/gm

  async openChromeTab(chromeTab: chrome.tabs.Tab) {
    const window = await chrome.tabs.highlight({
      windowId: chromeTab.windowId,
      tabs: chromeTab.index,
    })
    if (typeof window.id === 'number') {
      await chrome.windows.update(window.id, { focused: true })
    }
  }

  /**
   * superseded by useNavigationService().openOrCreateTab(...)
   * @param withUrls
   * @param matcher
   * @param groups
   * @param forceCurrent
   * @param forceReload
   */
  async openOrCreateTab(
    withUrls: string[],
    matcher: string | undefined = undefined,
    groups: string[] = [],
    forceCurrent: boolean = false,
    forceReload: boolean = false,
  ) {
    withUrls.map((u) => u.replace(this.placeholderPattern, ''))
    const useWindowIdent = this.getUseWindowIdent(forceCurrent, withUrls)
    console.log(` > opening #url ${withUrls.length} in window: '${useWindowIdent}', groups: '${groups.toString()}'`)

    const windowFromDb = await useWindowsStore().windowFor(useWindowIdent)
    const existingWindow = await useWindowsStore().currentWindowFor(useWindowIdent)

    if (useWindowIdent !== 'current') {
      console.log('existingWindow:', windowFromDb, existingWindow)
      if (!existingWindow) {
        const createData: any = { url: withUrls }
        if (windowFromDb) {
          const w = windowFromDb.browserWindow
          createData['left' as keyof object] = w?.left || 50
          createData['top' as keyof object] = w?.top || 50 //(w.top || 0) < 0 ? 0 : w.top
          createData['width' as keyof object] = w?.width || 1200 //(w.width || -1) < 0 ? 600 : w.width
          createData['height' as keyof object] = w?.height || 800 //(w.top || -1) < 0 ? 400 : w.height
          // window does not exist anymore, remove from 'allWindows'
          await useWindowsStore().removeWindow(windowFromDb.id)
        }

        await this.createNewWindow(createData, useWindowIdent, withUrls, groups)

        return
      }
    }

    if (process.env.MODE === 'bex') {
      for (const url of withUrls) {
        // get all tabs with this url
        const tabsForUrl = useTabsetsStore().tabsForUrl(url) || []
        tabsForUrl.forEach((t) => {
          if (t.tab.httpInfo) {
            t.tab.httpError = ''
            t.tab.httpInfo = ''

            const ts = useTabsetsStore().tabsetFor(t.tab.id)
            if (ts) {
              //console.log("saving tabset ", ts)
              useTabsetService().saveTabset(ts)
            }
          }
        })
      }

      const useWindowId = existingWindow?.id || chrome.windows.WINDOW_ID_CURRENT
      const queryInfo = { windowId: useWindowId }

      // getting all tabs from this window
      chrome.tabs.query(queryInfo, (t: chrome.tabs.Tab[]) => {
        const ctx = this
        withUrls.forEach(function (url, i) {
          let found = false
          t.filter((r) => r.url).map((r) => {
            let matchCondition = url === r.url
            if (matcher && r.url) {
              //console.log("matcher yielded", JsUtils.match(matcher, r.url))
              matchCondition = JsUtils.match(matcher, r.url)
            }
            // console.log("===>", matchCondition, url, r.url)
            if (matchCondition) {
              if (!found) {
                // highlight only first hit
                found = true
                console.debug('found something', r)

                const tabsForUrl = useTabsetsStore().tabsForUrl(url)
                console.log('tabsForUrl', tabsForUrl)
                const lastActive = _.min(_.map(tabsForUrl, (tfu: TabAndTabsetId) => tfu.tab.lastActive))
                const { handleSuccess } = useNotificationHandler()
                if (r.active) {
                  console.log(
                    `lastActive ${lastActive}, now: ${new Date().getTime()}, diff: ${new Date().getTime() - (lastActive || new Date().getTime())}`,
                  )
                  if (lastActive && new Date().getTime() - lastActive > 1000 * 60) {
                    handleSuccess(
                      new ExecutionResult(
                        '',
                        'already opened,...',
                        new Map([['Refresh', new RefreshTabCommand(r.id!, url)]]),
                      ),
                    )
                  } else {
                    handleSuccess(new ExecutionResult('', 'already opened...'))
                  }
                } else {
                  if (lastActive && new Date().getTime() - lastActive > 1000 * 60) {
                    handleSuccess(
                      new ExecutionResult(
                        '',
                        'maybe outdated...',
                        new Map([['Refresh?', new RefreshTabCommand(r.id!, url)]]),
                      ),
                    )
                  }
                }
                chrome.tabs.highlight({ tabs: r.index, windowId: useWindowId })
                chrome.windows.update(useWindowId, { focused: true })

                tabsForUrl.forEach((t) => {
                  useThumbnailsService()
                    .getThumbnailFor(t.tab.id, useAuthStore().user.uid)
                    .then((optionalThumbnail: any) => {
                      if (!optionalThumbnail) {
                        // saving thumbnail
                        useThumbnailsService().captureVisibleTab(t.tab.id, '???')
                      }
                    })
                })

                if (forceReload && r.id) {
                  console.debug('forced reload')
                  chrome.tabs.reload(r.id)
                }

                if (groups.length > i) {
                  ctx.handleGroup(groups[i], useWindowId, r)
                }
              }
            }
          })
          if (!found) {
            console.debug('tab not found, creating new one:', url)
            chrome.tabs.create(
              {
                active: true,
                pinned: false,
                url: url,
                windowId: useWindowId,
              },
              (tab: chrome.tabs.Tab) => {
                chrome.windows.update(useWindowId, { focused: true })

                if (groups.length > i) {
                  ctx.handleGroup(groups[i], useWindowId, tab)
                }
              },
            )
          }
        })
      })
    } else {
      openURL(withUrls[0]!)
    }
  }

  private getUseWindowIdent(forceCurrent: boolean, urls: string[]) {
    if (forceCurrent) {
      return 'current'
    } else if (urls.length === 1) {
      const tabs = useTabsetsStore().tabsForUrl(urls[0]!)
      if (tabs.length === 1) {
        const tabAndTabsetId = useTabsetsStore().getTabAndTabsetId(tabs[0]!.tab.id)
        if (tabAndTabsetId) {
          return useTabsetsStore().getTabset(tabAndTabsetId.tabsetId)?.window || 'current'
        }
      }
      return useTabsetsStore().getCurrentTabset?.window || 'current'
    }
    return useTabsetsStore().getCurrentTabset?.window || 'current'
  }

  private handleGroup(group: string | undefined, useWindowId: number, r: chrome.tabs.Tab) {
    if (group && useFeaturesStore().hasFeature(FeatureIdent.TAB_GROUPS) && chrome?.tabs?.group) {
      console.log('handling current Group', group)
      const optionalGroup = useGroupsStore().currentGroupForName(group)
      if (!optionalGroup) {
        const props = {
          createProperties: {
            windowId: useWindowId,
          },
          tabIds: [r.id || 0],
        }
        console.log('group not found, creating with', props)
        chrome.tabs.group(props, (groupId) => {
          console.log('groupId', groupId)
          const color = useGroupsStore().groupForName(group)?.color || 'grey'
          chrome.tabGroups.update(groupId, {
            collapsed: false,
            color: color,
            title: group,
          })
        })
      } else {
        const props = {
          groupId: optionalGroup.id,
          tabIds: [r.id || 0],
        }
        console.log('updating group with', props)

        chrome.tabs.group(props, (c) => console.log('c', c))
      }
    }
  }

  openTab(tabId: number) {
    return chrome.tabs.update(tabId, { active: true })
  }

  async openSingleTab(url: string): Promise<chrome.tabs.Tab> {
    return await chrome.tabs.create({ url: url })
  }

  closeChromeTab(tab: chrome.tabs.Tab) {
    console.log('closing chrome tab', tab.id, tab?.id)
    try {
      chrome.tabs.remove(tab.id || 0)
    } catch (err) {
      console.log('error clsosing chrome tab', err)
    }
  }

  backOneTab() {
    const [tabId, url] = useTabsStore2().tabHistoryBack()!
    this.openTab(tabId).catch((err) => {
      useTabsStore2().chromeTabsHistoryNavigating = false
      this.openOrCreateTab([url])
    })
  }

  forwardOneTab() {
    const [tabId, url] = useTabsStore2().tabHistoryForward()!
    this.openTab(tabId).catch((err) => {
      useTabsStore2().chromeTabsHistoryNavigating = false
      this.openOrCreateTab([url])
    })
  }

  private async createNewWindow(createData: any, useWindowIdent: string, withUrls: string[], groups: string[]) {
    console.log('opening new window with', createData)

    chrome.windows.create(createData, (window) => {
      //console.log("creating window", useWindowIdent, window)
      if (chrome.runtime.lastError) {
        // probably out of bounds issues
        chrome.windows.create({}, (window) => {
          if (window) {
            this.createWindow(useWindowIdent, window, 0, withUrls, groups)
          }
        })
      } else if (window) {
        this.createWindow(useWindowIdent, window, 0, withUrls, groups)
      }
    })
  }

  private createWindow(
    useWindowIdent: string,
    window: chrome.windows.Window,
    index: number = 0,
    withUrls: string[],
    groups: string[],
  ) {
    //useWindowsStore().assignWindow(useWindowIdent, window.id || 0)
    // useWindowsStore().upsertWindow(window, useWindowIdent, index)
    // const ctx = this
    // withUrls.forEach(function (url, i) {
    //   if (groups.length > i) {
    //     const group = groups[i]
    //     if (group && window.id && window.tabs && window.tabs.length > i) {
    //       console.log("assiging group", group, i)
    //       ctx.handleGroup(group, window.id, window.tabs[i]);
    //     }
    //   }
    // })
  }
}

export default new NavigationService()
