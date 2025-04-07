import { useRouter } from 'vue-router';
import { routeList } from '@/router/list';

/**
 * 递归查找路由配置
 *
 * @param routes 路由列表
 * @param path 要查找的路径
 * @returns 找到的路由项或undefined
 */
function findRouteRecursive(
  routes: RouterType.BlogRouteRecordRaw[],
  path: string
): RouterType.BlogRouteRecordRaw | undefined {
  for (const route of routes) {
    // 检查当前路由是否匹配
    if (route.path === path) {
      return route;
    }

    // 如果有子路由，递归查找
    if (route.children?.length) {
      const found = findRouteRecursive(route.children, path);
      if (found) return found;
    }
  }
  return undefined;
}

export function useNavigation() {
  const router = useRouter();

  const navigate = (path: string) => {
    if (!path) {
      return;
    }

    // 检查是否是当前路由
    if (path === router.currentRoute.value.path) {
      return;
    }

    // 递归查找路由
    const currentRoute = findRouteRecursive(routeList, path);

    if (!currentRoute) {
      return;
    }

    // 处理外部链接
    if (currentRoute.meta && currentRoute.meta.externalUrl) {
      window.open(currentRoute.meta.externalUrl as string, '_blank');
      return;
    }

    // 处理iframe嵌入
    if (currentRoute.meta?.iframeUrl) {
      router.push(path);
      return;
    }

    // 正常路由跳转
    router.push(path);
  };

  return {
    navigate
  };
}
