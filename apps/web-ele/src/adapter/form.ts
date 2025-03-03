import type {
  VbenFormSchema as FormSchema,
  VbenFormProps,
} from '@vben/common-ui';

import type { ComponentType } from './component';

import { setupVbenForm, useVbenForm as useForm, z } from '@vben/common-ui';
import { $t } from '@vben/locales';

/**
 * 配置 vben-form 的全局默认设置
 */
setupVbenForm<ComponentType>({
  config: {
    modelPropNameMap: {
      /** 上传组件的绑定字段名称 */
      Upload: 'fileList',

      /** 复选框组件的绑定字段名称 */
      CheckboxGroup: 'model-value',
    },
  },
  defineRules: {
    /**
     * 必填项校验规则
     * @param {any} value - 当前字段的值
     * @param {any} _params - 额外参数
     * @param {any} ctx - 校验上下文，包含 label 等信息
     * @returns {boolean | string} 校验结果，true 表示通过，string 表示错误消息
     */
    required: (value, _params, ctx) => {
      if (value === undefined || value === null || value.length === 0) {
        return $t('ui.formRules.required', [ctx.label]);
      }
      return true;
    },

    /**
     * 下拉选择框的必填项校验规则
     * @param {any} value - 当前字段的值
     * @param {any} _params - 额外参数
     * @param {any} ctx - 校验上下文，包含 label 等信息
     * @returns {boolean | string} 校验结果，true 表示通过，string 表示错误消息
     */
    selectRequired: (value, _params, ctx) => {
      if (value === undefined || value === null) {
        return $t('ui.formRules.selectRequired', [ctx.label]);
      }
      return true;
    },
  },
});

/** vben-form 的封装 Hook */
const useVbenForm = useForm<ComponentType>;

export { useVbenForm, z };

/** vben-form 的表单 schema 类型 */
export type VbenFormSchema = FormSchema<ComponentType>;

/** vben-form 的表单属性类型 */
export type { VbenFormProps };
