/**
 * 通用组件适配器
 * 该文件用于提取和封装一些基础组件，以便在 vben-form、vben-modal、vben-drawer 等组件中使用
 */

import type { Component, SetupContext } from 'vue';

import type { BaseFormComponentType } from '@vben/common-ui';
import type { Recordable } from '@vben/types';

import { h } from 'vue';

import { ApiComponent, globalShareState, IconPicker } from '@vben/common-ui';
import { $t } from '@vben/locales';

import {
  ElButton,
  ElCheckbox,
  ElCheckboxButton,
  ElCheckboxGroup,
  ElDatePicker,
  ElDivider,
  ElInput,
  ElInputNumber,
  ElNotification,
  ElRadio,
  ElRadioButton,
  ElRadioGroup,
  ElSelectV2,
  ElSpace,
  ElSwitch,
  ElTimePicker,
  ElTreeSelect,
  ElUpload,
} from 'element-plus';

/**
 * 为输入类组件添加默认占位符
 * @template T 组件类型
 * @param {T} component 组件
 * @param {'input' | 'select'} type 组件类型
 * @returns {Function} 处理后的组件
 */
const withDefaultPlaceholder = <T extends Component>(
  component: T,
  type: 'input' | 'select',
) => {
  return (props: any, { attrs, slots }: Omit<SetupContext, 'expose'>) => {
    const placeholder = props?.placeholder || $t(`ui.placeholder.${type}`);
    return h(component, { ...props, ...attrs, placeholder }, slots);
  };
};

/**
 * 组件类型定义
 */
export type ComponentType =
  | 'ApiSelect'
  | 'ApiTreeSelect'
  | 'Checkbox'
  | 'CheckboxGroup'
  | 'DatePicker'
  | 'Divider'
  | 'IconPicker'
  | 'Input'
  | 'InputNumber'
  | 'RadioGroup'
  | 'Select'
  | 'Space'
  | 'Switch'
  | 'TimePicker'
  | 'TreeSelect'
  | 'Upload'
  | BaseFormComponentType;

/**
 * 初始化组件适配器
 * 该方法会将常用的组件封装，并注册到全局共享状态
 */
async function initComponentAdapter() {
  /**
   * 组件映射表
   * @type {Partial<Record<ComponentType, Component>>}
   */
  const components: Partial<Record<ComponentType, Component>> = {
    ApiSelect: (props, { attrs, slots }) => {
      return h(
        ApiComponent,
        {
          placeholder: $t('ui.placeholder.select'),
          ...props,
          ...attrs,
          component: ElSelectV2,
          loadingSlot: 'loading',
          visibleEvent: 'onVisibleChange',
        },
        slots,
      );
    },
    ApiTreeSelect: (props, { attrs, slots }) => {
      return h(
        ApiComponent,
        {
          placeholder: $t('ui.placeholder.select'),
          ...props,
          ...attrs,
          component: ElTreeSelect,
          props: { label: 'label', children: 'children' },
          nodeKey: 'value',
          loadingSlot: 'loading',
          optionsPropName: 'data',
          visibleEvent: 'onVisibleChange',
        },
        slots,
      );
    },
    Checkbox: ElCheckbox,
    CheckboxGroup: (props, { attrs, slots }) => {
      let defaultSlot;
      if (Reflect.has(slots, 'default')) {
        defaultSlot = slots.default;
      } else {
        const { options, isButton } = attrs;
        if (Array.isArray(options)) {
          defaultSlot = () =>
            options.map((option) =>
              h(isButton ? ElCheckboxButton : ElCheckbox, option),
            );
        }
      }
      return h(
        ElCheckboxGroup,
        { ...props, ...attrs },
        { ...slots, default: defaultSlot },
      );
    },
    /**
     * 自定义默认按钮
     */
    DefaultButton: (props, { attrs, slots }) => {
      return h(ElButton, { ...props, attrs, type: 'info' }, slots);
    },
    /**
     * 自定义主要按钮
     */
    PrimaryButton: (props, { attrs, slots }) => {
      return h(ElButton, { ...props, attrs, type: 'primary' }, slots);
    },
    Divider: ElDivider,
    IconPicker: (props, { attrs, slots }) => {
      return h(
        IconPicker,
        {
          iconSlot: 'append',
          modelValueProp: 'model-value',
          inputComponent: ElInput,
          ...props,
          ...attrs,
        },
        slots,
      );
    },
    Input: withDefaultPlaceholder(ElInput, 'input'),
    InputNumber: withDefaultPlaceholder(ElInputNumber, 'input'),
    RadioGroup: (props, { attrs, slots }) => {
      let defaultSlot;
      if (Reflect.has(slots, 'default')) {
        defaultSlot = slots.default;
      } else {
        const { options } = attrs;
        if (Array.isArray(options)) {
          defaultSlot = () =>
            options.map((option) =>
              h(attrs.isButton ? ElRadioButton : ElRadio, option),
            );
        }
      }
      return h(
        ElRadioGroup,
        { ...props, ...attrs },
        { ...slots, default: defaultSlot },
      );
    },
    Select: (props, { attrs, slots }) => {
      return h(ElSelectV2, { ...props, attrs }, slots);
    },
    Space: ElSpace,
    Switch: ElSwitch,
    TimePicker: (props, { attrs, slots }) => {
      const { name, id, isRange } = props;
      const extraProps: Recordable<any> = {};
      if (isRange) {
        if (name && !Array.isArray(name)) {
          extraProps.name = [name, `${name}_end`];
        }
        if (id && !Array.isArray(id)) {
          extraProps.id = [id, `${id}_end`];
        }
      }
      return h(
        ElTimePicker,
        {
          ...props,
          ...attrs,
          ...extraProps,
        },
        slots,
      );
    },
    DatePicker: (props, { attrs, slots }) => {
      const { name, id, type } = props;
      const extraProps: Recordable<any> = {};
      if (type && type.includes('range')) {
        if (name && !Array.isArray(name)) {
          extraProps.name = [name, `${name}_end`];
        }
        if (id && !Array.isArray(id)) {
          extraProps.id = [id, `${id}_end`];
        }
      }
      return h(
        ElDatePicker,
        {
          ...props,
          ...attrs,
          ...extraProps,
        },
        slots,
      );
    },
    TreeSelect: withDefaultPlaceholder(ElTreeSelect, 'select'),
    Upload: ElUpload,
  };

  // 注册组件到全局共享状态
  globalShareState.setComponents(components);

  /**
   * 定义全局共享状态中的消息提示
   */
  globalShareState.defineMessage({
    /**
     * 复制成功消息提示
     * @param {string} title 提示标题
     * @param {string} content 提示内容
     */
    copyPreferencesSuccess: (title, content) => {
      ElNotification({
        title,
        message: content,
        position: 'bottom-right',
        duration: 0,
        type: 'success',
      });
    },
  });
}

export { initComponentAdapter };
