/**
 * plugins/index.ts
 *
 * Automatically included in `./src/main.ts`
 */

// Plugins
import { loadFonts } from './webfontloader'
import vuetify from './vuetify'
import pinia from '../store'
import router from '../router'
import axios from 'axios'
import VueAxios from 'vue-axios'
import VueDatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'
import VueCookies from 'vue3-cookies'
import VueApexCharts from "vue3-apexcharts";

axios.defaults.baseURL = import.meta.env.VITE_API_URL

// Types
import type { App } from 'vue'

export function registerPlugins (app: App) {
  loadFonts()
  app
    .use(vuetify)
    .use(router)
    .use(pinia)
    .use(VueCookies, {
      expireTimes: "",
      path: "/",
      domain: window.location.hostname,
      secure: true,
      sameSite: "None",
    })
    .use(VueAxios, axios)
    .use(VueApexCharts)
    .component('VueDatePicker', VueDatePicker)
}
