<template>
  <h1>{{$t('Statistics')}}</h1>
  <div class="keyword-statistics__filters">
    <div class="keyword-statistics__selects">
      <v-select
        v-model="request.geo"
        :items="filtersValues.countries"
        variant="outlined"
        color="primary"
        density="compact"
        :label="$t('Geo')"
        class="keyword-statistics__select"
        @update:modelValue="getStatistics()"
      />
      <v-select
        v-model="request.keyword"
        :items="filtersValues.keywords"
        variant="outlined"
        color="primary"
        density="compact"
        :label="$t('Keywords')"
        class="keyword-statistics__select"
        @update:modelValue="getStatistics()"
      />
    </div>
  </div>
  <v-table class="mt-6">
  <thead>
  <tr>
    <th class="keyword-statistics-th">
      <div class="d-flex justify-center align-content-center">
        <v-btn
          icon="mdi-delete"
          elevation="0"
          color="error"
          class="btn-filter d-flex align-self-end btn-delete"
          @click="deleteKeywords()"
        />
      </div>
    </th>
    <th>{{$t('Geo')}}</th>
    <th>{{ $t('Keyword') }}</th>
  </tr>
  </thead>
  <TablePreloader
    v-if="loading"
    :width="3"
    :height="10"
  />
  <tbody v-else>
  <template v-for="item in tableData" :key="item.id">
    <tr>
      <td class="px-2">
        <v-checkbox
          @click="addToDeleteList(item.keyword.id)"
          color="primary"
          hide-details
        >
        </v-checkbox>
      </td>
      <td>{{ item.country.name }}</td>
      <td>{{ item.keyword.keyword }}</td>
    </tr>
  </template>
  </tbody>
  </v-table>
  <v-pagination
    v-model="request.page"
    @update:modelValue="getStatistics"
    :length="pages"
    :total-visible="5"
    color="primary"
    class="mt-6"
  ></v-pagination>
  <v-snackbar
    v-model="showSnackbar"
    multi-line
    location="top right"
    class="snackbar"
    variant="flat"
    color="success"
    min-width="180px"
    max-width="180px"
    min-height="40px"
    max-height="40px"
  >
    <div class="d-flex flex-row align-items-center" style="justify-content: space-between">
      <p class="my-auto">{{ $t('Deleted') }}</p>
      <v-btn
        elevation="0"
        icon="mdi-close"
        size="small"
        color="transparent"
        class="my-auto px-0"
        @click="showSnackbar = false"
      ></v-btn>
    </div>
  </v-snackbar>
</template>

<script lang="ts" setup>
import TablePreloader from "@/components/tables/TablePreloader.vue";


import {ref, onMounted, reactive} from "vue";
import {useI18n} from "vue-i18n";
const { t } = useI18n({useScope: "global"})

const idsForDelete = {
  keywords_ids: []
}

let loading = ref(true)
let showSnackbar = ref(false)

import useAxiosGet from "@/composables/useAxiosGet";
import useAxiosPost from "@/composables/useAxiosPost";

let request = reactive({
  keyword: '',
  geo: '',
  page: 1,
  page_size: 10,
})

let pages = ref(1)

let response = ref({})
let pr = ref({})
let filtersValues = ref({})
let tableData = reactive([])

async function getStatistics () {
  response.value = await useAxiosGet(`keyword/?page=${request.page}&page_size=${request.page_size}&keyword=${request.keyword}&geo=${request.geo}`)
  tableData = response.value.responseData[0].keywords
  filtersValues.value = response.value.responseData[1].filters
  loading.value = response.value.loading
  pages.value = Math.ceil(response.value.responseData[0].keywords.length / 10)

}
function addToDeleteList(id:number){
  if (idsForDelete.keywords_ids.find((i) => i === id) != -1){
    idsForDelete.keywords_ids.push(id)
  } else {
    const index = idsForDelete.keywords_ids.indexOf(id);
    if (index > -1) {
      idsForDelete.keywords_ids.splice(index, 1);
    }
  }
}

import axios from 'axios'
import { axiosConfigDefault } from "@/composables/axiosConf";
async function deleteKeywords() {
  const request = {
    keywords_ids: idsForDelete.keywords_ids.toString()
  }
  console.log(request)
  pr.value = await useAxiosPost('keyword/delete/',request)
  showSnackbar.value = pr.value.success
  getStatistics ()
}

onMounted(() => {
  getStatistics()
})

</script>

<style lang="scss" scoped>
.keyword-statistics__filters{
  margin-top: 24px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.keyword-statistics__selects{
  display: flex;
  flex-direction: row;
  gap: 16px;
}
.keyword-statistics-th{
  border-top-left-radius: 8px;
  max-width: 56px;
  width: 56px;
  padding: 0 8px !important;
}
.keyword-statistics__select{
  min-width: 200px;
}
:deep(.v-snackbar__content){
  background: transparent !important;
  padding: 4px 8px 4px 16px!important;
}
</style>
