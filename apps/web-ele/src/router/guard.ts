import type { Router } from 'vue-router';

import { DEFAULT_HOME_PATH, LOGIN_PATH } from '@vben/constants';
import { preferences } from '@vben/preferences';
import { useAccessStore, useUserStore } from '@vben/stores';
import { startProgress, stopProgress } from '@vben/utils';

import { accessRoutes, coreRouteNames } from '#/router/routes';
import { useAuthStore } from '#/store';

import { generateAccess } from './access';

/**
 * 通用路由守卫配置
 * @param {Router} router - Vue Router 实例
 */
function setupCommonGuard(router: Router) {
  /** 记录已加载的页面路径 */
  const loadedPaths = new Set<string>();

  router.beforeEach(async (to) => {
    to.meta.loaded = loadedPaths.has(to.path);

    // 页面加载进度条
    if (!to.meta.loaded && preferences.transition.progress) {
      startProgress();
    }
    return true;
  });

  router.afterEach((to) => {
    // 记录页面是否已加载，避免重复执行页面切换动画
    loadedPaths.add(to.path);

    // 关闭页面加载进度条
    if (preferences.transition.progress) {
      stopProgress();
    }
  });
}

/**
 * 权限访问守卫配置
 * @param {Router} router - Vue Router 实例
 */
function setupAccessGuard(router: Router) {
  router.beforeEach(async (to, from) => {
    const accessStore = useAccessStore();
    const userStore = useUserStore();
    const authStore = useAuthStore();

    // 核心路由，这些路由不需要权限拦截
    if (coreRouteNames.includes(to.name as string)) {
      // 如果已登录，访问登录页则跳转到默认首页
      if (to.path === LOGIN_PATH && accessStore.accessToken) {
        return decodeURIComponent(
          (to.query?.redirect as string) ||
            userStore.userInfo?.homePath ||
            DEFAULT_HOME_PATH,
        );
      }
      return true;
    }

    // 检查 accessToken 是否存在
    if (!accessStore.accessToken) {
      // 忽略权限检查的页面可直接访问
      if (to.meta.ignoreAccess) {
        return true;
      }

      // 未登录，跳转到登录页面
      if (to.fullPath !== LOGIN_PATH) {
        return {
          path: LOGIN_PATH,
          query:
            to.fullPath === DEFAULT_HOME_PATH
              ? {}
              : { redirect: encodeURIComponent(to.fullPath) },
          replace: true, // 替换当前记录，避免返回时重复跳转
        };
      }
      return to;
    }

    // 检查是否已经生成过动态路由
    if (accessStore.isAccessChecked) {
      return true;
    }

    // 获取用户信息和角色
    const userInfo = userStore.userInfo || (await authStore.fetchUserInfo());
    const userRoles = userInfo.roles ?? [];

    // 生成菜单和动态路由
    const { accessibleMenus, accessibleRoutes } = await generateAccess({
      roles: userRoles,
      router,
      routes: accessRoutes, // 需要进行权限判断的路由
    });

    // 保存菜单和路由信息
    accessStore.setAccessMenus(accessibleMenus);
    accessStore.setAccessRoutes(accessibleRoutes);
    accessStore.setIsAccessChecked(true);

    /** 计算跳转路径 */
    const redirectPath = (from.query.redirect ??
      (to.path === DEFAULT_HOME_PATH
        ? userInfo.homePath || DEFAULT_HOME_PATH
        : to.fullPath)) as string;

    return {
      ...router.resolve(decodeURIComponent(redirectPath)),
      replace: true,
    };
  });
}

/**
 * 配置项目的路由守卫
 * @param {Router} router - Vue Router 实例
 */
function createRouterGuard(router: Router) {
  /** 配置通用守卫 */
  setupCommonGuard(router);
  /** 配置权限访问守卫 */
  setupAccessGuard(router);
}

export { createRouterGuard };
