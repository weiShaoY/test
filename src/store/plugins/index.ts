import type { PiniaPluginContext } from 'pinia';
import { jsonClone } from '@sa/utils';
import { SetupStoreId } from '@/enum';

/**
 * 插件用于重置使用 setup 语法编写的 store 的状态
 *
 * @param context - Pinia 插件上下文
 */
export function resetSetupStore(context: PiniaPluginContext) {
  // 获取所有使用 setup 语法编写的 store 的 ID
  const setupSyntaxIds = Object.values(SetupStoreId) as string[];

  // 检查当前 store 的 ID 是否在 setup 语法编写的 store ID 列表中
  if (setupSyntaxIds.includes(context.store.$id)) {
    const { $state } = context.store;

    // 通过克隆当前 store 的状态来创建默认状态
    const defaultStore = jsonClone($state);

    // 为 store 添加 $reset 方法，用于重置 store 的状态
    context.store.$reset = () => {
      context.store.$patch(defaultStore);
    };
  }
}
