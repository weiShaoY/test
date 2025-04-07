import { useSvgIconRender } from '@sa/hooks';
import SvgIcon from '@/components/SvgIcon/index.vue';

export function useSvgIcon() {
  const { SvgIconVNode } = useSvgIconRender(SvgIcon);

  return {
    SvgIconVNode
  };
}
