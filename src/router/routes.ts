import { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: (process.env.MODE === 'pwa' || process.env.MODE === 'electron') ?
      '/tabsets' : // use case: sharing tabset, opening link, import in PWA for anonymous user
      '/sidepanel'
  },
  {
    path: '/sidepanel',
    component: () => import('layouts/SidePanelLayout.vue'),
    children: [{path: '', component: () => import('pages/SidePanelPage.vue')}],
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
