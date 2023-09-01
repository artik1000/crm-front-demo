<template>
  <v-app>
    <default-bar :key="store.userdataKey" />
    <default-menu :key="store.userdataKey" />
    <default-view />
  </v-app>
</template>

<script lang="ts" setup>
  import DefaultBar from './AppBar.vue'
  import DefaultView from './View.vue'
  import DefaultMenu from './Menu.vue'

  import { useAppStore } from "@/store/app";
  const store = useAppStore()
</script>
