import SvgIcon from '@/components/SvgIcon/index.vue'

import { useSvgIconRender } from '@sa/hooks'

export function useSvgIcon() {
  const { SvgIconVNode } = useSvgIconRender(SvgIcon)

  return {
    SvgIconVNode,
  }
}
