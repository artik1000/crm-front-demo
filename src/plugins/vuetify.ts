/**
 * plugins/vuetify.ts
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import { VSkeletonLoader } from "vuetify/labs/VSkeletonLoader";

// Composables
import { createVuetify } from 'vuetify'


// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  theme: {
    themes: {
      light: {
        colors: {
          background: '#f4f7fb',
          surface: '#FFFFFF',
          primary: '#2979FF',
          'light-primary': '#f4f7fb',
          'primary-darken-1': '#3700B3',
          secondary: '#EEEEEE',
          'secondary-darken-1': '#018786',
          error: '#FF1744',
          info: '#2196F3',
          success: '#4CAF50',
          warning: '#FB8C00',
          'theme-color': '#FFEB3B',
          'bg-switcher': '#2979FF',
          contrast: '#222b45'
        },
      },
      dark: {
        colors: {
          background: '#000000',
          surface: '#212121',
          primary: '#2979FF',
          'primary-darken-1': '#3700B3',
          secondary: '#EEEEEE',
          'secondary-darken-1': '#018786',
          error: '#FF1744',
          info: '#2196F3',
          success: '#4CAF50',
          warning: '#FB8C00',
          'theme-color': '#303F9F',
          'bg-switcher': '#303F9F',
          contrast: '#fff'
        },
      }
    }
  },
  // theme: {
  //   themes: {
  //     light: {
  //       colors: {
  //         primary: '#2979FF',
  //         secondary: '#EEEEEE',
  //         error: '#FF1744'
  //       },
  //     },
  //   },
  // },
  components: {
    VSkeletonLoader,
  },
})
