import {RouteRecordRaw} from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: (process.env.MODE === 'pwa' || process.env.MODE === 'electron') ?
      '/tabsets' : // use case: sharing tabset, opening link, import in PWA for anonymous user
      '/sidepanel'
  },
  {
    path: '/fullpage',
    component: () => import('layouts/PlainLayout.vue'),
    children: [{path: '', component: () => import('pages/FullpageStart.vue')}],
  },
  {
    path: '/sidepanel',
    component: () => import('layouts/SidePanelLayout.vue'),
    children: [{path: '', component: () => import('pages/SidePanelPage2.vue')}],
  },
  {
    path: '/sidepanel/login',
    component: () => import('layouts/SidePanelNoFooterLayout.vue'),
    children: [{path: '', component: () => import('pages/SidePanelLoginPage.vue')}],
  },
  {
    path: '/sidepanel/collections',
    component: () => import('layouts/SidePanelLayout.vue'),
    children: [{path: '', component: () => import('pages/SidePanelCollectionsPage.vue')}],
  },
  {
    path: '/sidepanel/spaces',
    component: () => import('layouts/SidePanelLayout.vue'),
    children: [{path: '', component: () => import('src/spaces/pages/SidePanelSpacesPage.vue')}],
  },
  {
    path: '/sidepanel/tab/:tabId',
    component: () => import('layouts/SidePanelLayout.vue'),
    children: [{path: '', component: () => import('pages/sidepanel/SidePanelTabDetails.vue')}],
  },
  {
    path: '/sidepanel/welcome',
    component: () => import('layouts/SidePanelLayout.vue'),
    children: [{path: '', component: () => import('pages/sidepanel/WelcomePage.vue')}],
  },
  {
    path: '/sidepanel/research/:sourceId',
    component: () => import('layouts/SidePanelLayout.vue'),
    children: [{path: '', component: () => import('src/pages/SidePanelResearchPage.vue')}],
  },
  {
    path: '/mainpanel/settings',
    component: () => import('layouts/PlainWithRightDrawerLayout.vue'),
    children: [{path: '', component: () => import('pages/SettingsPage.vue')}],
  },
  {
    path: '/mainpanel/features/:feature',
    component: () => import('layouts/PlainWithRightDrawerLayout.vue'),
    children: [{path: '', component: () => import('src/features/pages/FeaturesPage.vue')}],
  },
  {
    path: '/mainpanel/notes/:noteId/edit', // editorjs setup cannot toggle between readonly/write mode
    component: () => import('layouts/PlainLayout.vue'),
    children: [{path: '', component: () => import('src/notes/pages/mainpanel/MainPanelNotePage.vue')}],
  },
  {
    path: '/mainpanel/notes/:noteId',
    component: () => import('layouts/PlainLayout.vue'),
    children: [{path: '', component: () => import('src/notes/pages/mainpanel/MainPanelNotePage.vue')}],
  },
  {
    path: '/mainpanel/notes/',
    component: () => import('layouts/PlainLayout.vue'),
    children: [{path: '', component: () => import('src/notes/pages/mainpanel/MainPanelNotePage.vue')}],
  },
  {
    path: '/mainpanel/html/:snapshotId', // both MHtml and HTML managed by same page
    component: () => import('layouts/PlainLayout.vue'),
    children: [{path: '', component: () => import('src/snapshots/pages/MainPanelHtmlPage.vue')}],
  },
  {
    path: '/mainpanel/editedHtml/:snapshotId',
    component: () => import('layouts/PlainLayout.vue'),
    children: [{path: '', component: () => import('src/snapshots/pages/MainPanelHtmlPage.vue')}],
  },
  {
    path: '/mainpanel/tabsets/overview/:tabsetId',
    component: () => import('layouts/PlainLayout.vue'),
    children: [{path: '', component: () => import('src/tabsets/pages/MainPanelTabsetOverviewPage.vue')}],
  },
  {
    path: '/mainpanel/png/:snapshotId',
    component: () => import('layouts/PlainLayout.vue'),
    children: [{path: '', component: () => import('src/snapshots/pages/MainPanelPngPage.vue')}],
  },
  {
    path: '/mainpanel/pdf/:snapshotId',
    component: () => import('layouts/PlainLayout.vue'),
    children: [{path: '', component: () => import('src/snapshots/pages/MainPanelPdfPage.vue')}],
  },
  {
    path: '/mainpanel/tab/:id',// TODO combine with Tag page
    component: () => import('layouts/PlainLayout.vue'),
    children: [{path: '', component: () => import('pages/TabPage.vue')}],
  },
  {
    path: '/tabsets/:tabsetId',
    component: () => import('layouts/FullPageLayout.vue'),
    children: [{path: '', component: () => import('src/tabsets/pages/TabsetPage.vue')}],
  },
  {
    path: '/tabsets',
    component: () => import('layouts/FullPageLayout.vue'),
    children: [{path: '', component: () => import('src/tabsets/pages/TabsetPage.vue')}],
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
