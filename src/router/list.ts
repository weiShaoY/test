import { BLOG_IFRAME_LAYOUT } from '@/layouts'

// BLOG_EXTERNAL_LAYOUT,
const routeList1: RouterType.BlogRouteRecordRaw[] = [
  {
    name: 'Aaa',
    path: '/blog/aaa',
    component: () => import('@/views/aaa/index.vue'),
    meta: {
      title: 'aaa',
      icon: 'blog-menu-vue',
      textBadge: 'new',
    },
  },
  {
    name: 'Bbb',
    path: '/blog/bbb',

    // component: BASE_LAYOUT,
    meta: {
      title: '测试二级路由 bbb',
      icon: 'blog-menu-vue',
    },
    children: [
      {
        name: 'Bbb1',
        path: '/blog/bbb/bbb1',
        component: () => import('@/views/bbb/bbb1/index.vue'),
        meta: {
          title: '测试二级路由 bbb1',
          icon: 'blog-menu-vue',
          keepAlive: true,
        },
      },
      {
        name: 'Bbb2',
        path: '/blog/bbb/bbb2',
        component: () => import('@/views/bbb/bbb2/index.vue'),
        meta: {
          title: '测试二级路由 bbb2',
          icon: 'blog-menu-vue',
          iconBadge: 'blog-menu-react',
        },
      },
    ],
  },
  {
    name: 'Ccc',
    path: '/blog/ccc',
    meta: {
      title: '测试二级路由 ccc',
      icon: 'blog-menu-vue',
    },
    children: [
      {
        name: 'Ccc1',
        path: '/blog/ccc/ccc1',
        component: () => import('@/views/ccc/ccc1/index.vue'),
        meta: {
          title: '测试二级路由 ccc1',
          icon: 'blog-menu-vite',
          iconBadge: 'blog-menu-vue',
        },
      },
    ],
  },
  {
    name: 'Ddd',
    path: '/blog/ddd',
    meta: {
      title: '测试一级路由 内嵌',
      iframeUrl: 'https://element-plus.org/zh-CN/component/menu.html',
      icon: 'blog-menu-vue',
      iconBadge: 'blog-menu-vue',
      order: 1,
    },
  },
  {
    name: 'Eee',
    path: '/blog/eee',
    meta: {
      title: '测试一级路由 外链',
      externalUrl: 'https://www.baidu.com',
      icon: 'blog-menu-vue',
    },
  },
]

function processRoutes(routes: RouterType.BlogRouteRecordRaw[]): RouterType.BlogRouteRecordRaw[] {
  return routes
    .map((route) => {
      const processedRoute: RouterType.BlogRouteRecordRaw = {
        ...route,
      }

      // Process iframe routes
      if (route.meta?.iframeUrl) {
        processedRoute.component = BLOG_IFRAME_LAYOUT
      }

      // Uncomment if needed
      // else if (route.meta?.externalUrl) {
      //   processedRoute.component = BLOG_EXTERNAL_LAYOUT;
      // }

      // Recursively process children
      if (route.children) {
        processedRoute.children = processRoutes(route.children)
      }

      return processedRoute
    })
    .sort((a, b) => {
      const getOrder = (route: RouterType.BlogRouteRecordRaw) => route.meta?.order ?? Number.MAX_SAFE_INTEGER

      return getOrder(a) - getOrder(b)
    })
}

export const routeList = processRoutes(routeList1)
