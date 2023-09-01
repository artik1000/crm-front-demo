<template>
  <h1>{{$t('Edit campaign and script')}}</h1>
  <div class="sheet-data__fields__column">
    <v-alert
      type="error"
      icon="$error"
      class="text-white mb-3"
      style="cursor: pointer"
      v-if="errorAlert"
      @click="errorAlert = false"
    >
      <h4>{{$t('Authentication error')}}</h4>
    </v-alert>
    <v-text-field
      v-model="campaignData.campaign_name"
      variant="outlined"
      density="compact"
      color="primary"
      :label="$t('Campaign name')"
      :error-messages="(v$?.campaign_name?.$error) ? v$.campaign_name.$errors[0].$message : ''"
    />
    <v-text-field
      v-model="campaignData.url"
      variant="outlined"
      density="compact"
      color="primary"
      :label="$t('Url')"
      :error-messages="(v$?.url?.$error) ? v$.url.$errors[0].$message : ''"
    />
    <v-text-field
      v-model="campaignData.account_name"
      variant="outlined"
      density="compact"
      color="primary"
      :label="$t('Account name')"
      :error-messages="(v$?.campaign_name?.$error) ? v$.campaign_name.$errors[0].$message : ''"
    />
    <v-select
      v-model="campaignData.geo"
      :items="geo"
      variant="outlined"
      :label="$t('Geo')"
      density="compact"
      color="primary"
      :error-messages="(v$?.geo?.$error) ? v$.geo.$errors[0].$message : ''"
    />
    <v-textarea
      v-model="campaignData.keywords"
      variant="outlined"
      :label="$t('Keywords')"
      rows="10"
      color="primary"
      :error-messages="(v$?.keywords?.$error) ? v$.keywords.$errors[0].$message : ''"
    />
    <v-checkbox
      v-model="campaignData.is_active"
      color="primary"
      :label="(campaignData.is_active === false) ? $t('Activate') : $t('Deactivate')"
    />
    <v-btn
      color="blue-accent-3"
      variant="elevated"
      class="align-self-end"
      @click="postCampaign"
    >
      {{ $t('Update') }}
    </v-btn>
  </div>
  <v-snackbar
    v-model="successAlert"
    multi-line
    location="top right"
    class="snackbar"
    variant="flat"
    color="success"
  >
    <div class="d-flex flex-row align-items-center" style="justify-content: space-between">
      <v-icon icon="mdi-check-circle" class="my-auto mr-4" style="font-size: 30px"></v-icon>
      <p class="my-auto"> {{ $t('Success!') }} <br> {{ $t('Now you can get script') }} </p>
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
import { ref, onMounted } from "vue";
import {useI18n} from "vue-i18n";
import useAxiosPut from "@/composables/useAxiosPut";
import useAxiosGet from "@/composables/useAxiosGet";
import { useRoute } from 'vue-router';
const route = useRoute()


const { t } = useI18n({useScope: "global"})

// For validation
import { useVuelidate } from "@vuelidate/core"
import { useRules } from "@/composables/validationRules";
const rules = {
  campaign_name: useRules().value.campaign_name,
  url: useRules().value.url,
  account_name: useRules().value.account_name,
  geo: useRules().value.geo,
  keywords: useRules().value.keyword,
}

import {useAppStore} from "@/store/app";
const geo = useAppStore().geo

// Variables of text fields
const campaignData = ref({
  campaign_name: '',
  url: '',
  account_name: '',
  geo: null,
  keywords: '',
  is_active: false
})
let response = ref({})

// Validation object
const v$ = useVuelidate(rules, campaignData.value);

let successAlert = ref(false)
let errorAlert = ref(false)

let pr = ref({})
// Function of post campaign
async function postCampaign () {
  // Validation
  await v$.value.$validate()
  if (!v$.value.$error) {
    pr.value = await useAxiosPut(route.path, campaignData.value)
    errorAlert.value = pr.value.error
    successAlert.value = pr.value.success
  }
}

async function getCampaignData() {
  response.value = await useAxiosGet(route.path)
  campaignData.value = response.value.responseData
}

onMounted(() => {
  getCampaignData()
})

</script>

<style lang="scss" scoped>

</style>
