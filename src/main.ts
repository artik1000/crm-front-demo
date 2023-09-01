/**
 * main.ts
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Components
import App from './App.vue'

// Composables
import { createApp } from 'vue'
import { createI18n, useI18n } from 'vue-i18n'
import {languages} from "@/i18n";
import {defaultLocale} from "@/i18n";

// Plugins
import { registerPlugins } from '@/plugins'

const messages = Object.assign(languages)
const i18n: object = createI18n({
  legacy: false,
  locale: defaultLocale,
  fallbackLocale: 'ru',
  messages
})


const app = createApp(App,{
  setup() {
    const {t} = useI18n()
    return t
  }
})

registerPlugins(app)

app.use(i18n).mount('#app')


