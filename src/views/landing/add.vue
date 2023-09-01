<template>
  <h1>{{$t('Add landing')}}</h1>
  <div class="sheet-data__fields__column">
    <v-alert color="info" class="rounded-lg">
      <b><v-icon icon="mdi-alert-circle" class="mr-4"></v-icon>{{ $t('Template options will be randomly set by the server. You can change them in the list of landings via edit button') }}</b>
    </v-alert>
    <div class="d-flex flex-row w-100">
      <div class="d-flex flex-column w-50 mr-6">
        <v-text-field
          v-model="landingData.domain"
          variant="outlined"
          density="compact"
          color="primary"
          :label="$t('Domain')"
          :error-messages="(v$?.domain?.$error) ? v$.domain.$errors[0].$message : ''"
        />
        <v-text-field
          v-model="landingData.domain_ip"
          variant="outlined"
          density="compact"
          color="primary"
          :label="$t('Domain ip')"
          :error-messages="(v$?.domain_ip?.$error) ? v$.domain_ip.$errors[0].$message : ''"
        />
        <v-select
          v-model="landingData.geo"
          :items="searchedGeos"
          variant="outlined"
          :label="$t('Geo')"
          density="compact"
          color="primary"
          :error-messages="(v$?.geo?.$error) ? v$.geo.$errors[0].$message : ''"
        >
          <template v-slot:prepend-item>
            <v-list-item>
              <v-text-field
                :placeholder="$t('Search')"
                density="compact"
                variant="outlined"
                v-model="searchedGeo"
                prepend-inner-icon="mdi-magnify"
                hide-details
              />
            </v-list-item>
          </template>
        </v-select>
      </div>
      <div class="d-flex flex-column w-50">
        <v-text-field
          v-model="landingData.site_name"
          variant="outlined"
          density="compact"
          color="primary"
          :label="$t('Site name')"
          :error-messages="(v$?.site_name?.$error) ? v$.site_name.$errors[0].$message : ''"
        />
        <v-text-field
          v-model="landingData.server_password"
          variant="outlined"
          :label="$t('Server password')"
          density="compact"
          color="primary"
          :error-messages="(v$?.server_password?.$error) ? v$.server_password.$errors[0].$message : ''"
        />
        <v-text-field
          v-model="landingData.server_ip"
          variant="outlined"
          :label="$t('Server ip')"
          density="compact"
          color="primary"
          :error-messages="(v$?.server_ip?.$error) ? v$.server_ip.$errors[0].$message : ''"
        />
      </div>
    </div>
    <v-textarea
      v-model="landingData.session"
      variant="outlined"
      :label="$t('session')"
      rows="10"
      color="primary"
      :error-messages="(v$?.session?.$error) ? v$.session.$errors[0].$message : ''"
    />

    <v-btn
      color="primary"
      variant="elevated"
      class="align-self-end"
      @click="postLanding"
    >
      {{ $t('Add') }}
    </v-btn>
  </div>
  <v-snackbar
    v-model="successAlert"
    multi-line
    location="top right"
    class="snackbar"
    variant="flat"
    color="info"
  >
    <div class="d-flex flex-row align-items-center" style="justify-content: space-between">
      <v-icon icon="mdi-alert-circle" class="my-auto mr-4" style="font-size: 30px"></v-icon>
      <p class="my-auto">{{ $t('Landing creating started') }} </p>
      <v-btn
        elevation="0"
        icon="mdi-close"
        color="transparent"
        class="my-auto"
        @click="successAlert = false"
      ></v-btn>
    </div>
  </v-snackbar>
  <v-snackbar
    v-model="errorAlert"
    multi-line
    location="top right"
    class="snackbar"
    width="120"
    variant="flat"
    color="error"
  >
    <div class="d-flex flex-row align-items-center" style="justify-content: space-between">
      <v-icon @click="errorAlert = false" icon="mdi-close-circle" class="my-auto mr-4" style="font-size: 30px"></v-icon>
      <p class="my-auto"> {{ $t('Error!') }} <br> </p>
      <v-btn
        elevation="0"
        icon="mdi-close"
        color="transparent"
        class="my-auto"
        @click="errorAlert = false"
      ></v-btn>
    </div>
  </v-snackbar>

</template>

<script lang="ts" setup>
import {computed, ref} from "vue";
import {useI18n} from "vue-i18n";
import useAxiosPost from "@/composables/useAxiosPost";

import { useRouter } from 'vue-router'
const router = useRouter()


const { t } = useI18n({useScope: "global"})

// For validation
import { useVuelidate } from "@vuelidate/core"
import { useRules } from "@/composables/validationRules";
const rules = {
  domain: useRules().value.domain,
  domain_ip: useRules().value.domain_ip,
  site_name: useRules().value.site_name,
  geo: useRules().value.geo,
  session: useRules().value.session,
  server_ip: useRules().value.server_ip,
  server_password: useRules().value.server_password,
}

import {useAppStore} from "@/store/app";
const geo = useAppStore().geo

// Variables of text fields
let landingData = ref({
  domain: '',
  domain_ip: '',
  site_name: '',
  geo: null,
  session: '',
  server_ip: '',
  server_password: '',
})

// Validation object
const v$ = useVuelidate(rules, landingData.value);

let successAlert = ref(false)
let errorAlert = ref(false)

let searchedGeo = ref('')
let searchedGeos = computed(() => {
  return geo.filter(e => e.title.includes(searchedGeo.value))
})

let pr = ref({})
// Function of post campaign
async function postLanding () {
  // Validation
  await v$.value.$validate()
  if (!v$.value.$error) {
    pr.value = await useAxiosPost('/landing/add/', landingData.value)

    errorAlert.value = pr.value.error
    successAlert.value = pr.value.success
    if (pr.value.success){
      setTimeout(()=>{  router.push({ name: 'Landing list' }) },2000)
    }
  }
}

</script>

<style lang="scss" scoped>

</style>
