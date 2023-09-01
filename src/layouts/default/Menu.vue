<template>
  <v-navigation-drawer>
    <v-list>
      <v-list-item>
        <div class="d-flex flex-row">
          <div class="avatar">
            {{ userData.buyer }}
          </div>
          <div class="ml-4">
            <h4 v-if="userData.firstname || userData.lastname">
              {{ userData.firstname }} <br> {{ userData.lastname }}
            </h4>
            <h4 v-else>
              {{ userData.username }}
            </h4>
          </div>
        </div>
      </v-list-item>
    </v-list>

    <v-divider></v-divider>

    <v-list density="compact" nav>
      <v-list-item
        :title="$t(pages[0].title)"
        :prepend-icon="pages[0].icon"
        :value="pages[0].value"
        :to="pages[0].to"
        :style="($route.path === pages[0].to)?'color:#2979FF':'color:#7a7a7a'"
      ></v-list-item>
      <v-list-group
        v-for="page in pages"
        :key="page.id"
        :value="page.value"
      >
        <template
          v-if="page.subPages"
          v-slot:activator="{ props }"
        >
          <v-list-item
            :title="$t(page.title)"
            v-bind="props"
            :prepend-icon="page.icon"
            active-class="text-primary"
          ></v-list-item>
        </template>
        <v-list-item
          v-for="subpage in page.subPages"
          :key="subpage.id"
          :title="$t(subpage.title)"
          :value="subpage.value"
          :to="page.to + subpage.to"
          active-class="text-primary"
        ></v-list-item>
      </v-list-group>
    </v-list>
  </v-navigation-drawer>
</template>

<script lang="ts" setup>
 import { ref } from "vue";

 import {useI18n} from "vue-i18n";
 const { t } = useI18n({useScope: "global"})

 let userData = ref({
   buyer: localStorage.getItem('buyer'),
   firstname: localStorage.getItem('firstname'),
   lastname: localStorage.getItem('lastname'),
   username: localStorage.getItem('username')
 })

 const pages = ref([
   {
     id: 0,
     icon: 'mdi-home',
     title: 'Main',
     to: '/',
     value: 'Main',
     active: false,
   },
   {
     id: 1,
     icon: 'mdi-account-box-multiple',
     title: 'Accounts',
     value: 'Accounts',
     to: '/',
     active: false,
     subPages:[
       {
         id: 0,
         title: 'My team',
         to: 'team/',
         value: 'My team'
       }
     ]
   },
   {
     id: 2,
     icon: 'mdi-google-ads',
     title: 'Google Ads',
     to: '/google-ads/',
     value: 'Google Ads',
     active: false,
     subPages:[
       {
         id: 0,
         title: 'Integration with Google Ads through Google Sheets',
         to: 'list',
         value: 'Integration with Google Ads through Google Sheets'
       }
     ]
   },
   {
     id: 3,
     icon: 'mdi-folder-open',
     title: 'Common',
     to: '/common/',
     value: 'Common',
     active: false,
     subPages:[
       {
         id: 0,
         title: 'Currencies rates',
         to: 'currency_rates',
         value: 'Currencies rates',
       }
     ]
   },
   {
     id: 4,
     icon: 'mdi-application-cog',
     title: 'System',
     to: '/logs/',
     value: 'System',
     active: false,
     subPages:[
       {
         id: 0,
         title: 'Logs',
         to: '',
         value: 'Logs'
       }
     ]
   },
   {
     id: 5,
     icon: 'mdi-chart-bar',
     title: 'Google Search Volume',
     to: '/keyword/',
     value: 'Google Search Volume',
     active: false,
     subPages:[
       {
         id: 0,
         title: 'Add keywords',
         to: 'add',
         value: 'Add keyword'
       },
       {
         id: 1,
         title: t('Statistics'),
         to: 'statistics',
         value: 'Statistics'
       },
     ]
   },
   {
     id: 6,
     icon: 'mdi-view-dashboard',
     title: t('Dashboard'),
     to: '/dashboard/',
     value: 'Dashboard',
     active: false,
     subPages:[
       {
         id: 0,
         title: 'Dashboard',
         to: 'main',
         value: 'Main'
       },
       {
         id: 1,
         title: 'Campaigns',
         to: 'campaigns',
         value: 'Campaigns'
       },
       {
         id: 2,
         title: 'Clicks',
         to: 'clicks',
         value: 'Clicks'
       },
       {
         id: 3,
         title: 'Conversions',
         to: 'conversion',
         value: 'Conversions'
       },
     ]
   },
   {
     id: 7,
     icon: 'mdi-web',
     title: 'Landings',
     to: '/landing/',
     value: 'Landing',
     active: false,
     subPages:[
       {
         id: 0,
         title: 'List',
         to: 'list',
         value: 'Landing list'
       },
     ]
   },
 ])
</script>

<style lang="scss" scoped>
:deep(.v-list-item--active > .v-list-item__overlay){
  opacity: 0 !important;
}
</style>
