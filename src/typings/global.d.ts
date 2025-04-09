export {}

declare global {
  export interface Window {

    /**
     *  NProgress 实例
     */
    NProgress?: import('nprogress').NProgress

    /**
     *  MessageBox 实例
     */
    $messageBox?: import('element-plus').IElMessageBox

    /**
     *  Message 实例
     */
    $message?: import('element-plus').Message

    /**
     *  Notification 实例
     */
    $notification?: import('element-plus').Notify
  }

  /** Build time of the project */
  export const BUILD_TIME: string
}
