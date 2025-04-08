/** 博客模块类型 */
declare namespace BlogType {
  /** Theme namespace */
  namespace Theme {}

  type BlogMenuItem = Omit<RouterType.BlogRouteRecordRaw, 'children'> & {
    /** 子菜单 */
    children?: BlogMenuItem[];
  };

  /** 面包屑 */
  type Breadcrumb = Omit<BlogMenuItem, 'children'> & {
    /** 面包屑选项 */
    options?: Breadcrumb[];
  };
}
