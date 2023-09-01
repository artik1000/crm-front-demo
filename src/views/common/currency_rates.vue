<template>
  <h1>{{$t('Currencies rates')}}</h1>
  <div class="currency-rates-form">
    <RangeDatePicker
      @handleDate="updateDate"
    />
    <v-select
      v-model="selectedCurrencies"
      :items="searchedCurrencies"
      :label="$t('Choose currencies')"
      density="compact"
      multiple
      variant="outlined"
      class="currency-select"
      color="primary"
      hide-details
      @update:modelValue="updateCurrencies"
    >
      <template v-slot:prepend-item>
        <v-list-item>
          <v-text-field
            :placeholder="$t('Search currency')"
            density="compact"
            variant="outlined"
            v-model="searchedCurrency"
            prepend-inner-icon="mdi-magnify"
            hide-details
          />
        </v-list-item>
        <v-list-item
          :title="$t('Select all')"
          @click="selectAllCurrencies"
        >
          <template v-slot:prepend>
            <v-checkbox-btn
              v-model="selectedAll"
            ></v-checkbox-btn>
          </template>
        </v-list-item>
      </template>
      <template v-slot:selection="{ item, index }">
        <v-chip v-if="index < 4" rounded="sm" color="primary">
          <span>{{ item.title }}</span>
        </v-chip>
        <v-chip v-if="index === 4" rounded="sm" class="select-counter">
              <span>
                +{{ currencies.length - 4 }}
              </span>
        </v-chip>
      </template>
    </v-select>
  </div>
  <v-table class="mt-6">
    <thead>
      <tr>
        <th style="width: 120px">{{$t('Date')}}</th>
        <th style="width: 80px">
          {{$t('Currency')}}
        </th>
        <th>
          {{$t('Rate')}}
        </th>
      </tr>
    </thead>
    <TablePreloader
      v-if="loading"
      :width="3"
      :height="10"
    />
    <tbody v-else>
      <tr v-for="row in tableData" :key="row.id">
        <td>{{row.date}}</td>
        <td>{{row.currency}}</td>
        <td>{{row.rate}}</td>
      </tr>
    </tbody>
  </v-table>
  <v-pagination
    v-model="request.page"
    @update:modelValue="updateCurrenciesList"
    :length="pages"
    :total-visible="5"
    color="primary"
    class="mt-6"
  ></v-pagination>
</template>

<script lang="ts" setup>
import {reactive, ref, onMounted, computed} from "vue";
import RangeDatePicker from "@/components/common/RangeDatePicker.vue";
import TablePreloader from "@/components/tables/TablePreloader.vue";
import useAxiosGet from "@/composables/useAxiosGet";
import {useI18n} from "vue-i18n";
const { t } = useI18n({useScope: "global"})

interface Currency {
  title: string,
  value: number
}

let date = ref()
let selectedCurrencies = ref(['EUR', 'USD'])
let request = reactive({
  currency: '',
  start_date: '',
  end_date: '',
  page: 1,
  page_size: 10,
})

let response = ref({})
let tableData = ref([])
let loading = ref(true)
let pages = ref(1)

let selectedAll = computed(() => {
  return selectedCurrencies.value.length === currencies.value.length;
})

const currencies = ref([])

async function getCurrenciesList () {
  response.value = await useAxiosGet('common/currency-list/')
  for(let i = 0; i < response.value.responseData.length; i++){
    currencies.value.push({
      title: response.value.responseData[i].currency,
      value: response.value.responseData[i].currency
    })
  }
}
let searchedCurrency = ref('')

let searchedCurrencies = computed(() => {
  console.log(currencies.value)
  return currencies.value.filter(e => e.title.includes(searchedCurrency.value.toUpperCase()))
})

function selectAllCurrencies () {
  if (selectedCurrencies.value.length === currencies.value.length){
    selectedCurrencies.value = ['EUR', 'USD']
  } else {
    selectedCurrencies.value = currencies.value
  }
  console.log(currencies.value.length)
  console.log(selectedCurrencies.value.length)
  updateCurrencies ()

}

function updateCurrencies () {
  request.currency = ''
  for (let i = 0; i < selectedCurrencies.value.length; i ++){
    if (selectedCurrencies.value[i].value){
      request.currency += `&currency=${selectedCurrencies.value[i].value}`
    } else {
      request.currency += `&currency=${selectedCurrencies.value[i]}`
    }
  }
  updateCurrenciesList()
}

function updateDate (date) {
  request.start_date = date.from
  request.end_date = date.to
  updateCurrenciesList()
}

async function updateCurrenciesList() {
  response.value = await useAxiosGet(
    `common/currency-rates/?start_date=${request.start_date}&end_date=${request.end_date}${request.currency}&page=${request.page}&page_size=${request.page_size}`
  )
  tableData.value = response.value.responseData
  loading.value = response.value.loading
  pages.value = Math.ceil(response.value.items / 10)
}

onMounted(() => {
  updateCurrenciesList()
  getCurrenciesList()
})

</script>

<style lang="scss" scoped>
.currency-rates-form{
  display: flex;
  flex-direction: row;
  margin-top: 24px;
  gap: 16px;
}
.currency-rates-th{
  border-top-left-radius: 8px;
  max-width: 180px;
  width: 180px;
}
</style>
