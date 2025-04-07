import { useRouter } from 'vue-router';
import type { RouteLocationRaw } from 'vue-router';
import { router as globalRouter } from '@/router';

/**
 * Router push
 *
 * Jump to the specified route, it can replace function router.push
 *
 * @param inSetup Whether is in vue script setup
 */
export function useRouterPush(inSetup = true) {
  const router = inSetup ? useRouter() : globalRouter;
  // const route = globalRouter.currentRoute;

  const routerPush = router.push;

  const routerBack = router.back;

  /** 路由跳转选项; */
  type RouterPushOptions = {
    /** 路由查询参数 */
    query?: Record<string, string>;

    /** 路由动态参数 */
    params?: Record<string, string>;
  };

  /**
   * 根据路由键名跳转
   *
   * @param key 路由键名
   * @param options 路由选项
   */
  async function routerPushByKey(key: string, options?: RouterPushOptions) {
    const { query, params } = options || {};

    const routeLocation: RouteLocationRaw = {
      name: key
    };

    if (Object.keys(query || {}).length) {
      routeLocation.query = query;
    }

    if (Object.keys(params || {}).length) {
      routeLocation.params = params;
    }

    return routerPush(routeLocation);
  }

  /**
   * 根据路由键名跳转并带上 meta 中的 query
   *
   * @param key 路由键名
   */
  function routerPushByKeyWithMetaQuery(path: string) {
    const allRoutes = router.getRoutes();

    const currentRoute = allRoutes.find(item => item.path === path) as RouterType.BlogRouteRecordRaw;
    if (currentRoute?.meta?.externalUrl) {
      window.open(currentRoute.meta.externalUrl, '_blank');
      return;
    }

    const query: Record<string, string> = {};

    currentRoute?.meta?.query?.forEach(item => {
      query[item.key] = item.value;
    });

    routerPushByKey(currentRoute?.name as string, {
      query
    });
  }

  return {
    routerPush,
    routerBack,
    routerPushByKey,
    routerPushByKeyWithMetaQuery
  };
}
