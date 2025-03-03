import { h } from 'vue';

import { setupVbenVxeTable, useVbenVxeGrid } from '@vben/plugins/vxe-table';

import { ElButton, ElImage } from 'element-plus';

import { useVbenForm } from './form';

/**
 * 配置 vxe-table 的全局默认设置
 */
setupVbenVxeTable({
  /**
   * 配置 vxe-table 的 UI 组件库
   * @param {any} vxeUI - vxe-table 的 UI 配置对象
   */
  configVxeTable: (vxeUI) => {
    vxeUI.setConfig({
      grid: {
        /** 表格内容居中对齐 */
        align: 'center',

        /** 是否显示表格边框 */
        border: false,

        columnConfig: {
          /** 是否允许调整列宽 */
          resizable: true,
        },

        /** 表格的最小高度 */
        minHeight: 180,

        formConfig: {
          /** 是否启用 vxe-table 内置表单，默认为禁用，使用 formOptions 代替 */
          enabled: false,
        },

        proxyConfig: {
          /** 是否在初始化时自动加载数据 */
          autoLoad: true,

          response: {
            /** 数据结果字段 */
            result: 'items',

            /** 数据总数字段 */
            total: 'total',

            /** 数据列表字段 */
            list: 'items',
          },

          /** 是否显示请求中的活动消息 */
          showActiveMsg: true,

          /** 是否显示响应消息 */
          showResponseMsg: false,
        },

        /** 是否显示表格圆角样式 */
        round: true,

        /** 是否显示超出部分内容 */
        showOverflow: true,

        /** 表格尺寸，可选值：medium / small / mini */
        size: 'small',
      },
    });

    /**
     * 自定义 vxe-table 单元格渲染器：图片显示
     */
    vxeUI.renderer.add('CellImage', {
      /**
       * 表格默认渲染函数
       * @param {any} _renderOpts - 渲染选项
       * @param {any} params - 渲染参数
       * @returns {VNode} 渲染的 VNode
       */
      renderTableDefault(_renderOpts, params) {
        const { column, row } = params;

        /** 获取单元格中的图片地址 */
        const src = row[column.field];

        return h(ElImage, {
          /** 图片地址 */
          src,

          /** 预览图片列表 */
          previewSrcList: [src],
        });
      },
    });

    /**
     * 自定义 vxe-table 单元格渲染器：链接按钮
     */
    vxeUI.renderer.add('CellLink', {
      /**
       * 表格默认渲染函数
       * @param {any} renderOpts - 渲染选项
       * @returns {VNode} 渲染的 VNode
       */
      renderTableDefault(renderOpts) {
        const { props } = renderOpts;

        return h(
          ElButton,
          {
            /** 按钮大小 */
            size: 'small',

            /** 是否显示为链接样式 */
            link: true,
          },
          {
            /** 按钮文本内容 */
            default: () => props?.text,
          },
        );
      },
    });

    // 这里可以扩展 vxe-table 的其他全局配置，如自定义格式化函数
    // vxeUI.formats.add(...)
  },
  /** 绑定表单功能 */
  useVbenForm,
});

export { useVbenVxeGrid };

export type * from '@vben/plugins/vxe-table';
