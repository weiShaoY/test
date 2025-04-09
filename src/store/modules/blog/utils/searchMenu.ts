/**
 * 转换菜单为搜索菜单
 *
 * @param menus - menus
 * @param treeMap
 */
export function transformMenuToSearchMenuList(menus: BlogType.BlogMenuItem[], treeMap: BlogType.BlogMenuItem[] = []) {
  if (menus && menus.length === 0) { return [] }

  return menus.reduce((acc, cur) => {
    if (!cur.children) {
      acc.push(cur)
    }

    if (cur.children && cur.children.length > 0) {
      transformMenuToSearchMenuList(cur.children, treeMap)
    }

    return acc
  }, treeMap)
}
