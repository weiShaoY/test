import { BLOG_IFRAME_LAYOUT } from '@/layouts';
// BLOG_EXTERNAL_LAYOUT,
const routeList1: RouterType.BlogRouteRecordRaw[] = [
  {
    name: 'Aaa',
    path: '/blog/aaa',
    component: () => import('@/views/aaa/index.vue'),
    meta: {
      title: 'aaa'
    }
  },
  {
    name: 'Bbb',
    path: '/blog/bbb',
    // component: BASE_LAYOUT,
    meta: {
      title: '测试二级路由 bbb'
    },
    children: [
      {
        name: 'Bbb1',
        path: '/blog/bbb/bbb1',
        component: () => import('@/views/bbb/bbb1/index.vue'),
        meta: {
          title: 'bbb1'
        }
      }
    ]
  },
  {
    name: 'Ccc',
    path: '/blog/ccc',
    meta: {
      title: '测试二级路由 ccc'
    },
    children: [
      {
        name: '测试二级路由 ccc1',
        path: '/blog/ccc/ccc1',
        component: () => import('@/views/ccc/ccc1/index.vue'),
        meta: {
          title: 'ccc1'
        }
      }
    ]
  },
  {
    name: 'Ddd',
    path: '/blog/ddd',
    meta: {
      title: '测试一级路由 内嵌',
      iframeUrl: 'https://element-plus.org/zh-CN/component/menu.html'
    }
  },
  {
    name: 'Eee',
    path: '/blog/eee',
    meta: {
      title: '测试一级路由 外链',
      externalUrl: 'https://www.baidu.com'
    }
  }
];

function processRoutes(routes: RouterType.BlogRouteRecordRaw[]): RouterType.BlogRouteRecordRaw[] {
  return routes.map(route => {
    // 处理iframe路由
    if (route.meta?.iframeUrl) {
      return {
        ...route,
        component: BLOG_IFRAME_LAYOUT,
        children: route.children ? processRoutes(route.children) : undefined
      };
    }
    //  else if (route.meta?.externalUrl) {
    //   // 处理外链路由
    //   return {
    //     ...route,
    //     component: BLOG_EXTERNAL_LAYOUT,
    //     children: route.children ? processRoutes(route.children) : undefined
    //   };
    // }

    // 默认处理
    return {
      ...route,
      children: route.children ? processRoutes(route.children) : undefined
    };
  });
}

export const routeList = processRoutes(routeList1).sort((a, b) => {
  const orderA = a.meta?.order ?? Number.MAX_SAFE_INTEGER; // 如果没有 order，则排在后面

  const orderB = b.meta?.order ?? Number.MAX_SAFE_INTEGER; // 如果没有 order，则排在后面

  return orderA - orderB; // 按 order 升序排序
});
