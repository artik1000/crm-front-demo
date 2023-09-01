<template>
  <v-app-bar
    v-if="cookies.get('ex-token')"
    class="pa-0 elevation-0 bg-primary text-center text-lowercase"
    style="cursor: pointer"
    height="30"
    @click="backToMainAccount"
  >
    <h3 class="w-100 text-center">
      {{ $t('Back to main account')}}
    </h3>
  </v-app-bar>
  <v-app-bar class="d-flex flex-column">
    <v-btn
      variant="plain"
      class="v-app-bar__company-logo text-primary"
      :ripple="false"
      :to="{ name: 'Main' }"
    >
      HardHead
    </v-btn>
    <!--    -->
    <v-spacer></v-spacer>
    <LangSwitcher />
    <div class="mr-4">
      <v-switch
        v-model="themeValue"
        false-icon="mdi-white-balance-sunny"
        true-icon="mdi-moon-waning-crescent"
        @update:modelValue="toggleTheme"
        color="themeColor"
        density="comfortable"
        hide-details
        inset
      ></v-switch>
    </div>
    <v-btn
      prepend-icon="mdi-logout-variant"
      color="primary"
      elevation="0"
      variant="elevated"
      rounded="pill"
      @click="logOut"
    >
      {{ $t('Log out') }}
    </v-btn>

  </v-app-bar>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";

import { useTheme } from 'vuetify'
import { useCookies } from "vue3-cookies";
import LangSwitcher from "@/components/common/LangSwitcher.vue";


const { cookies } = useCookies();
const theme = useTheme()
const themeValue = ref(false)

import {useI18n} from "vue-i18n";
const { t } = useI18n({useScope: "global"})

import { useAppStore } from "@/store/app";
const store = useAppStore()

import { useRouter } from 'vue-router'
const router = useRouter()

function logOut () {
  cookies.remove('token', '/', window.location.hostname)
  cookies.remove('ex-token', '/', window.location.hostname)

  localStorage.removeItem('username')
  localStorage.removeItem('firstname')
  localStorage.removeItem('lastname')
  localStorage.removeItem('buyer')

  localStorage.removeItem('ex-username')
  localStorage.removeItem('ex-firstname')
  localStorage.removeItem('ex-lastname')
  localStorage.removeItem('ex-buyer')
  router.push({ name: 'Login' })
}

function backToMainAccount () {
  cookies.remove('token', '/', window.location.hostname)
  cookies.set("token",
    cookies.get("ex-token"),
    "",
    "/",
    window.location.hostname,
    true,
    "None"
  )
  cookies.remove('ex-token', '/', window.location.hostname)

  localStorage.removeItem('username')
  localStorage.removeItem('firstname')
  localStorage.removeItem('lastname')
  localStorage.removeItem('buyer')

  localStorage.setItem('buyer',localStorage.getItem('ex-buyer'))
  localStorage.setItem('firstname', localStorage.getItem('ex-firstname'))
  localStorage.setItem('lastname', localStorage.getItem('ex-lastname'))
  localStorage.setItem('username', localStorage.getItem('ex-username'))

  localStorage.removeItem('ex-username')
  localStorage.removeItem('ex-firstname')
  localStorage.removeItem('ex-lastname')
  localStorage.removeItem('ex-buyer')

  store.userdataKey += 1

  window.location.reload()
}

function toggleTheme () {
  theme.global.name.value = theme.global.current.value.dark ? 'light' : 'dark'
  if(localStorage.getItem('theme')){
    localStorage.removeItem('theme')
  }
  localStorage.setItem("theme", theme.global.name.value)
}
onMounted(() => {
  if(localStorage.getItem('theme')){
    theme.global.name.value = localStorage.getItem('theme')
    if (theme.global.name.value === 'dark'){
      themeValue.value = true
    }
  }
})
</script>

<style lang="scss" scoped>
.v-app-bar__company-logo {
  text-transform: capitalize !important;
  font-size: 24px !important;
  margin: 0;
}
:deep(.v-selection-control--density-comfortable .v-switch__track){
  background: rgba(var(--v-theme-bg-switcher),0.8);
}
:deep(.v-selection-control--density-comfortable .v-icon--size-default){
  background: #fff;
  opacity: 1 !important;
  color: rgb(var(--v-theme-theme-color));
  border-radius: 50%;
  font-size: 20px;
  height: 26px;
  width: 26px;
}
</style>
