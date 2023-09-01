<template>
  <h1>{{$t('Add keywords')}}</h1>
  <div class="keywords-add__from">

    <v-select
      v-model="keywordData.geo"
      :items="searchedGeos"
      variant="outlined"
      :label="$t('Geo')"
      density="compact"
      class="mt-6 mb-2"
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
    <v-textarea
      v-model="keywordData.keyword"
      variant="outlined"
      :label="$t('Keywords')"
      class="mb-6"
      rows="10"
      color="primary"
      :error-messages="(v$?.keyword?.$error) ? v$.keyword.$errors[0].$message : ''"
    />
    <v-btn
      color="blue-accent-3"
      variant="elevated"
      class="align-self-end"
      @click="postKeywords"
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
    color="success"
  >
    <div class="d-flex flex-row align-items-center" style="justify-content: space-between">
      <v-icon icon="mdi-check-circle" class="my-auto mr-4" style="font-size: 30px"></v-icon>
      <p class="my-auto"> {{ $t('Statistics for added keywords') }} <br> {{ $t('appear within a minute') }} </p>
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
import { ref, computed } from "vue";
import {useI18n} from "vue-i18n";
import useAxiosPost from "@/composables/useAxiosPost";
const { t } = useI18n({useScope: "global"})

// For validation
import { useVuelidate } from "@vuelidate/core"
import { useRules } from "@/composables/validationRules";
const rules = {
  geo: useRules().value.geo,
  keyword: useRules().value.keyword,
}

import { useRouter } from 'vue-router'
const router = useRouter()

import {useAppStore} from "@/store/app";
const geo = useAppStore().geo

// Variables of text fields
const keywordData = ref({
  geo: null,
  keyword: ''
})

// Validation object
const v$ = useVuelidate(rules, keywordData.value);

let successAlert = ref(false)
let errorAlert = ref(false)

let searchedGeo = ref('')
let searchedGeos = computed(() => {
  return geo.filter(e => e.title.includes(searchedGeo.value))
})


let pr = ref({})
// Function of post keyword
async function postKeywords () {
  // Validation
  await v$.value.$validate()
  if (!v$.value.$error) {
    pr.value = await useAxiosPost('keyword/add/', keywordData.value)
    errorAlert.value = pr.value.error
    successAlert.value = pr.value.success
    if(successAlert.value === true) {
      setTimeout(()=>{  router.push({ name: 'Keywords statistics' }) },2000)
    }
  }
}
</script>

<style lang="scss" scoped>
:deep(.v-snackbar__content){
  background: transparent !important;
  padding: 8px 16px !important;
}
</style>
