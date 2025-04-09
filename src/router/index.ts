import type { App } from 'vue'

import type { RouterHistory } from 'vue-router'

import { BLOG_BASE_LAYOUT } from '@/layouts'

import {
  createMemoryHistory,
  createRouter,
  createWebHashHistory,
  createWebHistory,

} from 'vue-router'

import { createRouterGuard } from './guard'

import { routeList } from './list'

import errorRouter from './modules/error'

const { VITE_ROUTER_HISTORY_MODE = 'history', VITE_BASE_URL } = import.meta.env

const historyCreatorMap: Record<Env.RouterHistoryMode, (base?: string) => RouterHistory> = {
  hash: createWebHashHistory,
  history: createWebHistory,
  memory: createMemoryHistory,
}

export const ROOT_ROUTE = {
  name: 'root',
  path: '/',
  redirect: import.meta.env.VITE_ROUTE_HOME || '/blog',
  meta: {
    title: 'root',
    constant: true,
  },
}

export const router = createRouter({
  history: historyCreatorMap[VITE_ROUTER_HISTORY_MODE](VITE_BASE_URL),
  routes: [
    ROOT_ROUTE,
    {
      path: '/blog',
      component: BLOG_BASE_LAYOUT,
      children: routeList as any,
      redirect: '/blog/aaa',
    },
    ...(errorRouter as any),
  ],
})

/** Setup Vue Router */
export async function setupRouter(app: App) {
  app.use(router)
  createRouterGuard(router)
  await router.isReady()
}
