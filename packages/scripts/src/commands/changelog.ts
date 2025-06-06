import type { ChangelogOption } from '@soybeanjs/changelog'

import { generateChangelog, generateTotalChangelog } from '@soybeanjs/changelog'

export async function genChangelog(options?: Partial<ChangelogOption>, total = false) {
  if (total) {
    await generateTotalChangelog(options)
  }
  else {
    await generateChangelog(options)
  }
}
