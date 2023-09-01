<template>
  <section>
    <v-row>
      <template
        v-for="page in pages"
        :key="page.id"
      >
        <v-col cols="6" v-if="page.subPages">
          <v-list
            :value="page.value"
            class="home__list"
            rounded="lg"
          >
            <template v-if="page.subPages">
              <v-list-item
                :prepend-icon="page.icon"
                :title="$t(page.title)"
                :key="page.id + 1"
                :value="page.value"
                class="home__list__header"
              ></v-list-item>
              <v-list-item
                v-for="subpage in page.subPages"
                :key="subpage.id"
                :prepend-icon="subpage.icon"
                :title="$t(subpage.title)"
                :value="subpage.value"
                :to="page.to + subpage.to"
                class="v-list-item__default"
              ></v-list-item>
            </template>
          </v-list>
        </v-col>
      </template>
    </v-row>
  </section>
</template>

<script lang="ts" setup>
import {ref} from "vue";

import {useI18n} from "vue-i18n";
const { t } = useI18n({useScope: "global"})

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
        title: 'Statistics',
        to: 'statistics',
        value: 'Statistics'
      },
    ]
  },
  {
    id: 6,
    icon: 'mdi-web',
    title: 'Landings',
    value: 'Landings',
    to: '/landing/',
    active: false,
    subPages:[
      {id: 0, title: 'List', to: 'list', value: 'Landing list'},
    ]
  },
  {
    id: 7,
    icon: 'mdi-view-dashboard',
    title: 'Dashboard',
    to: '/dashboard/',
    value: 'Dashboard',
    active: false,
    subPages:[
      {
        id: 0,
        title: 'Dashboard',
        to: 'main',
        value: 'Dashboard'
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
])
</script>

<style lang="scss" scoped>
.home__list{
  height: fit-content;
  padding: 0px !important;
  width: 100%;

}
.home__list__header {
  background-color: #2979FF !important;
  color: #fff !important;
  cursor: default;
}
:deep(.v-list-item__prepend > .v-icon) {
  opacity: 1 !important;
  margin-inline-end: 16px !important;
}
</style>
