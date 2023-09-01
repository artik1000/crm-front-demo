<template>
  <router-view />
</template>

<script lang="ts" setup>
import { onMounted } from "vue";

import { useTheme } from 'vuetify';

import {useI18n} from "vue-i18n";
const theme = useTheme()

import { useCookies } from "vue3-cookies";
const { cookies } = useCookies();

import { useAppStore } from "@/store/app";
const store = useAppStore()

const { t, locale } = useI18n({useScope: "global"})

// store.login = computed(() => {
//   return cookies.isKey("token");
// }).value


onMounted(() => {
  if(localStorage.getItem('theme')){
    theme.global.name.value = localStorage.getItem('theme')
  }
  if(localStorage.getItem('ln')){
    locale.value = localStorage.getItem('ln')
  }
})
</script>

<style lang="scss">
  @import "./src/assets/css/style.scss";
  .v-tooltip>.v-overlay__content{
    color: white !important;
    background: rgb(var(--v-theme-primary)) !important;
    opacity: 1 !important;
  }
</style>
