import { createApp } from 'vue'

import App from './App.vue'

import {
  setupAppVersionNotification,
  setupDayjs,
  setupIconifyOffline,
  setupLoading,
  setupNProgress,
  setupUI,
} from './plugins'

import { setupRouter } from './router'

import { setupStore } from './store'

import './plugins/assets'

async function setupApp() {
  setupLoading()

  setupNProgress()

  setupIconifyOffline()

  setupDayjs()

  const app = createApp(App)

  setupUI(app)

  setupStore(app)

  await setupRouter(app)

  setupAppVersionNotification()

  app.mount('#app')
}

setupApp()
