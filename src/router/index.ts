// Composables
import { createRouter, createWebHistory } from 'vue-router'
import {useCookies} from "vue3-cookies";

const routes = [
  {
    path: '/login/',
    name: 'Login',
    component: () => import('@/layouts/default/Login.vue'),
  },
  {
    path: '/landing/edit/:id',
    name: 'Landing edit',
    component: () => import('@/layouts/landing/edit/_id.vue'),
  },
  {
    path: '/',
    component: () => import('@/layouts/default/Default.vue'),
    children: [
      {
        path: '',
        name: 'Main',
        component: () => import('@/views/main.vue')
      },
      {
        path: 'team/',
        name: 'Team',
        component: () => import('@/views/team.vue'),
      },
      {
        path: 'logs/',
        name: 'Logs',
        component: () => import('@/views/logs.vue'),
      },
      {
        path: 'common/',
        name: 'Common',
        redirect: 'common/currency_rates',
        component: () => import('@/views/common/index.vue'),
        children: [
          {
            path: 'currency_rates',
            name: 'Currency rates',
            components: {
              common: () => import('@/views/common/currency_rates.vue')
            }
          }
        ],
      },
      {
        path: 'google-ads/',
        name: 'Google Ads',
        redirect: 'google-ads/list',
        component: () => import('@/views/google-ads/index.vue'),
        children: [
          {
            path: 'list',
            name: 'Google Ads sheet list',
            components: {
              gads: () => import('@/views/google-ads/list.vue')
            }
          },
          {
            path: 'sheet/view/:id?',
            name: 'Google Ads sheet details',
            components: {
              gads: () => import('@/views/google-ads/sheet-details/_id.vue')
            }
          },
          {
            path: 'sheet/edit/:id?',
            name: 'Google Ads sheet edit',
            components: {
              gads: () => import('@/views/google-ads/sheet-edit/_id.vue')
            }
          },
          {
            path: 'sheet/add',
            name: 'Google Ads sheet add',
            components: {
              gads: () => import('@/views/google-ads/sheet-add.vue')
            }
          },
        ],
      },
      {
        path: 'keyword/',
        name: 'keywords',
        redirect: 'keyword/statistics',
        component: () => import('@/views/keyword/index.vue'),
        children: [
          {
            path: 'add',
            name: 'Add keyword',
            components: {
              keywords: () => import('@/views/keyword/add.vue')
            }
          },
          {
            path: 'statistics',
            name: 'Keywords statistics',
            components: {
              keywords: () => import('@/views/keyword/statistics.vue')
            }
          },
        ],
      },
      {
        path: 'dashboard/',
        name: 'Dashboard',
        redirect: 'dashboard/',
        component: () => import('@/views/dashboard/index.vue'),
        children: [
          {
            path: 'main',
            name: 'Dashboard main',
            components: {
              dashboard: () => import('@/views/dashboard/main.vue')
            }
          },
          {
            path: 'clicks',
            name: 'Dashboard clicks',
            components: {
              dashboard: () => import('@/views/dashboard/clicks.vue')
            }
          },
          {
            path: 'conversion',
            name: 'Dashboard conversion',
            components: {
              dashboard: () => import('@/views/dashboard/conversion.vue')
            }
          },
          {
            path: 'campaigns',
            name: 'Dashboard campaigns',
            components: {
              dashboard: () => import('@/views/dashboard/campaign.vue')
            }
          },
        ],
      },
      {
        path: 'landing/',
        name: 'Landing',
        redirect: 'landing/list',
        component: () => import('@/views/landing/index.vue'),
        children: [
          {
            path: 'list',
            name: 'Landing list',
            components: {
              landings: () => import('@/views/landing/list.vue')
            }
          },
          {
            path: 'add',
            name: 'Landing add',
            components: {
              landings: () => import('@/views/landing/add.vue')
            }
          },
        ],
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

router.beforeEach((to, from, next) => {
  const { cookies } = useCookies();
  // console.log('token: ' + cookies.get("token"))
  if (to.name !== 'Login' && !cookies.get("token")) {
    next({ name: 'Login' })
  } else {
    next()
  }
})

export default router
