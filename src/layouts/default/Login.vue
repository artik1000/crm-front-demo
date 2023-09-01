<template>
  <section class="log-in__section">
    <div class="d-flex justify-end">
      <lang-switcher/>
    </div>
    <v-card class="common-card log-in__card">
      <h1
        class="text-center"
        :class="(authenticationErrorAlert) ? '' : 'mb-6'"
      >
        {{ $t('log in') }}
      </h1>
      <v-alert
        type="error"
        icon="$error"
        class="text-white mb-3"
        style="cursor: pointer"
        v-if="authenticationErrorAlert"
        @click="authenticationErrorAlert = false"
      >
        <h4>{{ $t('authentication error') }} <br> {{ $t('login or password is incorrect') }} </h4>
      </v-alert>
      <div class="log-in__form">
        <v-text-field
          v-model="userData.username"
          variant="outlined"
          density="compact"
          color="primary"
          prepend-inner-icon="mdi-account-circle"
          :label="$t('username')"
          type="text"
          :error-messages="(v$?.username?.$error) ? v$.username.$errors[0].$message : ''"
        />
        <v-text-field
          v-model="userData.password"
          variant="outlined"
          density="compact"
          color="primary"
          :label="$t('password')"
          :type="(showPassword) ? 'text' : 'password'"
          :error-messages="(v$?.password?.$error) ? v$.password.$errors[0].$message : ''"
        >
          <template v-slot:prepend-inner>
            <v-icon
              :icon="(showPassword) ? 'mdi-eye' : 'mdi-eye-off'"
              cursor="pointer"
              :title="showPassword ?
              $t('hide') + ' ' + $t('password') :
              $t('show') + ' ' + $t('password')"
              @click="showPassword = !showPassword"
            >
            </v-icon>
          </template>
        </v-text-field>
        <v-btn
          color="blue-accent-3"
          size="large"
          type="submit"
          block
          @click="logIn"
        >
          {{ $t('log in') }}
        </v-btn>
      </div>
    </v-card>
  </section>
</template>

<script lang="ts" setup>
import {useI18n} from "vue-i18n";
const { t } = useI18n({useScope: "global"})

import axios from 'axios'

import { useCookies } from "vue3-cookies";
const { cookies } = useCookies();

import { ref, reactive, onMounted } from "vue";

import { useRouter } from 'vue-router'
const router = useRouter()

import { useVuelidate } from "@vuelidate/core"
import { useRules } from "@/composables/validationRules";
import LangSwitcher from "@/components/common/LangSwitcher.vue";

import { useAppStore } from "@/store/app";
const store = useAppStore()


// Create rules object with required fields
const rules = {
  username: useRules().value.username,
  password: useRules().value.password,
}


// Variables of text fields
const userData = ref({
  username: null,
  password: null
})

// Validation object
const v$ = useVuelidate(rules, userData.value);

let authenticationErrorAlert = ref(false)

// Redirect into main page
function redirectToMain () {
  if (cookies.isKey("token")){
    router.push({ name: 'Main' })
  }
}

// Function of log in
function logIn () {
  // Validation
  v$.value.$validate()
  if (!v$.value.$error) {
    axios.post('/accounts/login/', userData.value)
      .then(function (response) {
        if (response.data.error){
          authenticationErrorAlert.value = true
        } else {
          let userData = {
            buyer: response.data.buyer,
            firstname: response.data.firstame,
            lastname: response.data.lastname,
            username: response.data.username
          }
          localStorage.removeItem('username')
          localStorage.removeItem('firstname')
          localStorage.removeItem('lastname')
          localStorage.removeItem('buyer')

          localStorage.removeItem('ex-username')
          localStorage.removeItem('ex-firstname')
          localStorage.removeItem('ex-lastname')
          localStorage.removeItem('ex-buyer')

          localStorage.setItem('buyer',response.data.buyer)
          localStorage.setItem('firstname',response.data.firstame)
          localStorage.setItem('lastname',response.data.lastname)
          localStorage.setItem('username',response.data.username)
          // Set cookie with CSRF token
          cookies.set("token",
            response.data.token,
            "",
            "/",
            window.location.hostname,
            true,
            "None"
          )
          redirectToMain()
        }
      })
      .catch(function (error) {
        console.error(error);
      });
  }
}

// Redirect if user go to login page, but he has cookie
onMounted(() => {
  redirectToMain()
})

// Show hide password

let showPassword = ref(false)
</script>

<style lang="scss" scoped>
.log-in__section{
  height: 100vh;
  width: 100vw;
  padding: 0 !important;
  position: relative !important;
}
.log-in__card{
  position: absolute !important;
  top:0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto !important;
  height: fit-content !important;
  padding: 32px !important;
  width: 30vw !important;
  gap: 16px !important;
  min-width: 423px !important;
}
.log-in__form{
  display: flex;
  flex-direction: column;
  gap: 16px;
}
:deep(.v-icon:before){
  font-size: 20px !important;
}
</style>
