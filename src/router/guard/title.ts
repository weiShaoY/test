import type { Router } from 'vue-router'

import { useTitle } from '@vueuse/core'

export function createDocumentTitleGuard(router: Router) {
  router.afterEach((to) => {
    const { title } = to.meta

    const documentTitle = title

    useTitle(documentTitle)
  })
}
