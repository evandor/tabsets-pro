import { useAuthStore } from 'stores/authStore'
import { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect:
      process.env.MODE === 'pwa'
        ? '/splash' // use case: sharing tabset, opening link, import in PWA for anonymous user
        : '/sidepanel',
  },
  {
    path: '/splash',
    component: () => import('layouts/PlainLayout.vue'),
    children: [{ path: '', component: () => import('src/pages/SplashPage.vue') }],
  },
  {
    path: '/fullpage',
    component: () => import('layouts/PlainLayout.vue'),
    children: [{ path: '', component: () => import('src/core/pages/FullpageStart.vue') }],
  },
  {
    path: '/sidepanel',
    component: () => import('layouts/SidePanelLayout.vue'),
    children: [{ path: '', component: () => import('src/core/pages/SidePanelPage2.vue') }],
  },
  {
    path: '/sidepanel/login',
    component: () => import('layouts/SidePanelNoFooterLayout.vue'),
    children: [{ path: '', component: () => import('src/pages/SidePanelLoginPage.vue') }],
  },
  {
    path: '/sidepanel/collections',
    component: () => import('layouts/SidePanelLayout.vue'),
    children: [{ path: '', component: () => import('src/core/pages/SidePanelCollectionsPage.vue') }],
  },
  {
    path: '/sidepanel/welcomepro',
    component: () => import('layouts/SidePanelNoFooterLayout.vue'),
    children: [{ path: '', component: () => import('src/pages/sidepanel/WelcomeProPage.vue') }],
  },
  {
    path: '/sidepanel/welcome',
    component: () => import('layouts/SidePanelNoFooterLayout.vue'),
    children: [{ path: '', component: () => import('src/core/pages/sidepanel/WelcomePage.vue') }],
  },
  // {
  //   path: '/sidepanel/tabsets/:tabsetId',
  //   component: () => import('layouts/SidePanelLayout.vue'),
  //   children: [{ path: '', component: () => import('src/tabsets/pages/SidePanelTabsetPage.vue') }],
  // },
  {
    path: '/sidepanel/spaces',
    component: () => import('layouts/SidePanelLayout.vue'),
    children: [{ path: '', component: () => import('src/spaces/pages/SidePanelSpacesPage.vue') }],
  },
  {
    path: '/sidepanel/search',
    component: () => import('layouts/SidePanelLayout.vue'),
    children: [{ path: '', component: () => import('src/pages/SidePanelSearchPage.vue') }],
  },
  {
    path: '/sidepanel/research/:sourceId',
    component: () => import('layouts/SidePanelLayout.vue'),
    children: [{ path: '', component: () => import('src/core/pages/SidePanelResearchPage.vue') }],
  },
  {
    path: '/sidepanel/tab/:tabId',
    component: () => import('layouts/SidePanelLayout.vue'),
    children: [{ path: '', component: () => import('src/core/pages/sidepanel/SidePanelTabDetails.vue') }],
  },
  {
    path: '/sidepanel/bookmarks/import',
    component: () => import('layouts/SidePanelNoFooterLayout.vue'),
    children: [{ path: '', component: () => import('src/core/pages/sidepanel/SidePanelImportBookmarksPage.vue') }],
  },
  {
    path: '/sidepanel/bookmarks',
    component: () => import('layouts/SidePanelLayout.vue'),
    children: [{ path: '', component: () => import('src/core/pages/sidepanel/SidePanelBookmarksPage.vue') }],
  },
  {
    path: '/sidepanel/tabslist',
    component: () => import('layouts/SidePanelLayout.vue'),
    children: [{ path: '', component: () => import('src/opentabs/pages/SidePanelOpenTabsPage.vue') }],
  },
  {
    path: '/sidepanel/sessions',
    component: () => import('layouts/SidePanelLayout.vue'),
    children: [{ path: '', component: () => import('src/tabsets/pages/SidePanelSessionsPage.vue') }],
  },
  {
    path: '/sidepanel/reminders',
    component: () => import('layouts/SidePanelLayout.vue'),
    children: [{ path: '', component: () => import('src/tabsets/pages/SidePanelRemindersPage.vue') }],
  },
  {
    path: '/sidepanel/tagslist',
    component: () => import('layouts/SidePanelLayout.vue'),
    children: [{ path: '', component: () => import('src/core/pages/sidepanel/SidePanelTagsListViewer.vue') }],
  },
  {
    path: '/sidepanel/tags',
    component: () => import('layouts/SidePanelLayout.vue'),
    children: [{ path: '', component: () => import('src/core/pages/sidepanel/SidePanelTagsPage.vue') }],
  },
  {
    path: '/sidepanel/rsslist',
    component: () => import('layouts/SidePanelLayout.vue'),
    children: [{ path: '', component: () => import('src/core/pages/sidepanel/SidePanelRssListViewer.vue') }],
  },
  {
    path: '/sidepanel/rss/:encodedUrl',
    component: () => import('layouts/SidePanelLayout.vue'),
    children: [{ path: '', component: () => import('src/core/pages/sidepanel/SidePanelRssPage.vue') }],
  },
  {
    path: '/sidepanel/byDomainList',
    component: () => import('layouts/SidePanelLayout.vue'),
    children: [{ path: '', component: () => import('src/core/pages/sidepanel/SidePanelByDomainList.vue') }],
  },
  // {
  //   path: '/sidepanel/sharedTsList',
  //   component: () => import('layouts/SidePanelLayout.vue'),
  //   children: [{path: '', component: () => import('src/pages/sidepanel/SidePanelSharedTsList.vue')}],
  // },
  {
    path: '/sidepanel/latestList',
    component: () => import('layouts/SidePanelLayout.vue'),
    children: [{ path: '', component: () => import('src/pages/sidepanel/SidePanelLatestTabsPage.vue') }],
  },
  {
    path: '/sidepanel/tabsAsTree',
    component: () => import('layouts/SidePanelLayout.vue'),
    children: [{ path: '', component: () => import('src/core/pages/sidepanel/SidePanelTabsAsTreePage.vue') }],
  },
  {
    path: '/sidepanel/notesView',
    component: () => import('layouts/SidePanelLayout.vue'),
    children: [{ path: '', component: () => import('src/core/pages/sidepanel/SidePanelNotesViewPage.vue') }],
  },
  {
    path: '/sidepanel/messages',
    component: () => import('layouts/SidePanelLayout.vue'),
    children: [{ path: '', component: () => import('src/core/pages/sidepanel/SidePanelMessagesPage.vue') }],
  },
  {
    path: '/sidepanel/top10List',
    component: () => import('layouts/SidePanelLayout.vue'),
    children: [{ path: '', component: () => import('src/core/pages/sidepanel/SidePanelTop10Page.vue') }],
  },
  {
    path: '/sidepanel/byDomain/:encodedUrl',
    component: () => import('layouts/SidePanelLayout.vue'),
    children: [{ path: '', component: () => import('src/core/pages/sidepanel/SidePanelByDomainPage.vue') }],
  },
  {
    path: '/sidepanel/research/:sourceId',
    component: () => import('layouts/SidePanelLayout.vue'),
    children: [{ path: '', component: () => import('src/core/pages/SidePanelResearchPage.vue') }],
  },
  {
    path: '/mainpanel/login',
    component: () => import('layouts/SidePanelNoFooterLayout.vue'),
    children: [{ path: '', component: () => import('src/pages/SidePanelLoginPage.vue') }],
  },
  {
    path: '/mainpanel/settings',
    component: () => import('layouts/PlainWithRightDrawerLayout.vue'),
    children: [{ path: '', component: () => import('src/pages/SettingsPage.vue') }],
  },
  {
    path: '/features/:feature',
    component: () => import('layouts/PlainLayout.vue'),
    children: [{ path: '', component: () => import('src/features/pages/FeaturesPage.vue') }],
  },
  {
    path: '/mainpanel/features/:feature',
    component: () => import('layouts/PlainWithRightDrawerLayout.vue'),
    children: [{ path: '', component: () => import('src/features/pages/FeaturesPage.vue') }],
  },
  {
    path: '/mainpanel/notes/:notebookId',
    component: () => import('layouts/PlainLayout.vue'),
    children: [{ path: '', component: () => import('src/notes/pages/mainpanel/MainPanelNotePage.vue') }],
  },
  {
    path: '/mainpanel/notes/:notebookId/:subNoteId',
    component: () => import('layouts/PlainLayout.vue'),
    children: [{ path: '', component: () => import('src/notes/pages/mainpanel/MainPanelNotePage.vue') }],
  },
  {
    path: '/mainpanel/notes/',
    component: () => import('layouts/PlainLayout.vue'),
    children: [{ path: '', component: () => import('src/notes/pages/mainpanel/MainPanelNotePage.vue') }],
  },
  {
    path: '/mainpanel/html/:snapshotId', // both MHtml and HTML managed by same page
    component: () => import('layouts/PlainLayout.vue'),
    children: [{ path: '', component: () => import('src/snapshots/pages/MainPanelHtmlPage.vue') }],
  },
  {
    path: '/mainpanel/editedHtml/:snapshotId',
    component: () => import('layouts/PlainLayout.vue'),
    children: [{ path: '', component: () => import('src/snapshots/pages/MainPanelHtmlPage.vue') }],
  },
  {
    path: '/mainpanel/mhtml/:snapshotId',
    component: () => import('layouts/PlainLayout.vue'),
    children: [{ path: '', component: () => import('src/snapshots/pages/MainPanelMHtmlPage.vue') }],
  },
  {
    path: '/mainpanel/png/:snapshotId',
    component: () => import('layouts/PlainLayout.vue'),
    children: [{ path: '', component: () => import('src/snapshots/pages/MainPanelPngPage.vue') }],
  },
  {
    path: '/mainpanel/pdf/:snapshotId',
    component: () => import('layouts/PlainLayout.vue'),
    children: [{ path: '', component: () => import('src/snapshots/pages/MainPanelPdfPage.vue') }],
  },

  {
    path: '/mainpanel/tabsets/overview/:tabsetId',
    component: () => import('layouts/PlainLayout.vue'),
    children: [{ path: '', component: () => import('src/tabsets/pages/MainPanelTabsetOverviewPage.vue') }],
  },
  {
    path: '/mainpanel/tabsets/overview',
    component: () => import('layouts/PlainLayout.vue'),
    children: [{ path: '', component: () => import('src/tabsets/pages/MainPanelTabsetsOverviewPage.vue') }],
  },
  {
    path: '/mainpanel/png/:tabId/:blobId',
    component: () => import('layouts/PlainLayout.vue'),
    children: [{ path: '', component: () => import('src/notes/pages/mainpanel/MainPanelNotePage.vue') }],
  },
  {
    path: '/mainpanel/html/:tabId/:blobId',
    component: () => import('layouts/PlainLayout.vue'),
    children: [{ path: '', component: () => import('src/snapshots/pages/MainPanelHtmlPage.vue') }],
  },
  {
    path: '/mainpanel/pdf/:tabId/:blobId',
    component: () => import('layouts/PlainLayout.vue'),
    children: [{ path: '', component: () => import('src/snapshots/pages/MainPanelPngPage.vue') }],
  },
  {
    path: '/mainpanel/tab/:id', // TODO combine with Tag page
    component: () => import('layouts/PlainLayout.vue'),
    children: [{ path: '', component: () => import('src/core/pages/TabPage.vue') }],
  },
  // {
  //   path: '/mainpanel/suggestions/:suggestionId',
  //   component: () => import('layouts/PlainLayout.vue'),
  //   children: [
  //     {
  //       path: '',
  //       component: () => import('src/suggestions/pages/MainPanelCheckSuggestionPage.vue'),
  //     },
  //   ],
  // },
  {
    path: '/mainpanel/spaces',
    component: () => import('layouts/PlainLayout.vue'),
    children: [
      { path: '', component: () => import('src/spaces/pages/MainPanelSpacesPage.vue'), props: { fullpage: false } },
    ],
  },
  {
    path: '/fullpage/spaces',
    component: () => import('layouts/FullPageLayout.vue'),
    children: [
      { path: '', component: () => import('src/spaces/pages/MainPanelSpacesPage.vue'), props: { fullpage: true } },
    ],
  },
  {
    path: '/mainpanel/bookmarks/:id',
    component: () => import('layouts/PlainLayout.vue'),
    children: [{ path: '', component: () => import('src/bookmarks/pages/MainPanelBookmarksPage.vue') }],
  },
  {
    path: '/mainpanel/tabAssignment/:id',
    component: () => import('layouts/PlainLayout.vue'),
    children: [{ path: '', component: () => import('src/pages/mainpanel/MainPanelTabAssignmentPage.vue') }],
  },
  {
    path: '/mainpanel/mhtml/:tabId/:blobIndex',
    component: () => import('layouts/PlainLayout.vue'),
    children: [{ path: '', component: () => import('src/snapshots/pages/MainPanelMHtmlPage.vue') }],
  },
  {
    path: '/mainpanel/readingmode/:tabId',
    component: () => import('layouts/PlainLayout.vue'),
    children: [{ path: '', component: () => import('src/core/pages/mainpanel/MainPanelReadingModePage.vue') }],
  },
  {
    path: '/mainpanel/navigation',
    component: () => import('layouts/MainNavigationLayout.vue'),
    children: [{ path: '', component: () => import('src/core/pages/mainpanel/NavigationPage.vue') }],
  },
  {
    path: '/overlay/note/:tabId',
    component: () => import('layouts/MainNavigationLayout.vue'),
    children: [{ path: '', component: () => import('src/core/pages/mainpanel/NoteOverlayPage.vue'), props: true }],
  },
  {
    path: '/overlay/snapshots/:tabId',
    component: () => import('layouts/MainNavigationLayout.vue'),
    children: [{ path: '', component: () => import('src/core/pages/mainpanel/SnapshotOverlayPage.vue'), props: true }],
  },
  {
    path: '/settings',
    component: () => import('layouts/DefaultLayout.vue'),
    children: [{ path: '', component: () => import('src/pages/SettingsPage.vue') }],
  },
  {
    path: '/tabsets/:tabsetId',
    component: () => import('layouts/FullPageLayout.vue'),
    children: [{ path: '', component: () => import('src/tabsets/pages/TabsetPage.vue') }],
  },
  {
    path: '/p', // p <=> 'public'
    component: () => import('layouts/PublicLayout.vue'),
    children: [
      { path: 'tabs/:tabId', component: () => import('src/tabsets/pages/PublicTabsetPage.vue') },
      { path: 'notes/:notebookId', component: () => import('src/tabsets/pages/PublicNotePage.vue') },
    ],
  },
  {
    path: '/tabsets',
    component: () => import('layouts/FullPageLayout.vue'),
    children: [{ path: '', component: () => import('src/tabsets/pages/TabsetPage.vue') }],
    beforeEnter: (to: any, from: any) => {
      // console.error(`to2: ${JSON.stringify(to)}`)
      if (useAuthStore().user?.isAnonymous) {
        return '/mainpanel/login'
      }
    },
  },
  {
    path: '/dynamicTs/:tabsetId',
    component: () => import('layouts/FullPageLayout.vue'),
    children: [{ path: '', component: () => import('src/tabsets/pages/TabsetPage.vue') }],
  },
  // {
  //   path: '/tab/:id',
  //   component: () => import('layouts/DefaultLayout.vue'),
  //   children: [{path: '', component: () => import('src/core/pages/TabPage.vue')}],
  // },
  {
    path: '/bookmarks/:id',
    component: () => import('layouts/FullPageLayout.vue'),
    children: [{ path: '', component: () => import('src/bookmarks/pages/BookmarksPage.vue') }],
  },
  {
    path: '/bydomain/:encodedUrl',
    component: () => import('layouts/FullPageLayout.vue'),
    children: [{ path: '', component: () => import('src/tabsets/pages/ByDomainPage.vue') }],
  },
  {
    path: '/historyByAge/:encodedAge',
    component: () => import('layouts/DefaultLayout.vue'),
    children: [{ path: '', component: () => import('src/tabsets/pages/ByAgePage.vue') }],
  },
  {
    path: '/features/:feature',
    component: () => import('layouts/FullPageLayout.vue'),
    children: [{ path: '', component: () => import('src/features/pages/FeaturesPage.vue') }],
  },
  {
    path: '/search',
    component: () => import('layouts/FullPageLayout.vue'),
    children: [{ path: '', component: () => import('src/core/pages/SearchPage.vue') }],
  },
  {
    path: '/searchresult',
    component: () => import('layouts/FullPageLayout.vue'),
    children: [{ path: '', component: () => import('src/core/pages/SearchResultPage.vue') }],
  },
  {
    path: '/browser/:tabId',
    component: () => import('layouts/FullPageLayout.vue'),
    children: [{ path: '', component: () => import('src/core/pages/BrowserViewPage.vue') }],
  },
  {
    path: '/mainpanel/obsidian/files/:file',
    component: () => import('layouts/PlainLayout.vue'),
    children: [{ path: '', component: () => import('src/core/pages/ObsidianPage.vue') }],
  },
  {
    path: '/mainpanel/restapi/:api',
    component: () => import('layouts/PlainLayout.vue'),
    children: [{ path: '', component: () => import('src/core/pages/RestCallResultPage.vue') }],
  },
  {
    path: '/pwa/imp/:sharedId',
    component: () => import('layouts/PlainLayout.vue'),
    children: [{ path: '', component: () => import('src/pages/public/ImportPublicTabsetPage.vue') }],
  },
  {
    path: '/invitation',
    redirect: (to) => ({
      path: '/mainpanel/login',
      query: { invited: to.query.email },
    }),
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('src/app/pages/ErrorNotFound.vue'),
  },
]

export default routes
