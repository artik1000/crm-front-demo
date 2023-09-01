<template>
  <h1>{{$t('Conversions')}}</h1>
  <div class="dashboard-campaign__actions-row">
    <div class="dashboard-campaign__bts-row">
      <v-text-field
        :label="$t('Search by subid')"
        color="primary"
        class="common-filter-input-small"
        density="compact"
        variant="outlined"
        hide-details
        prepend-inner-icon="mdi-magnify"
        v-model="request.sub_id_exist"
        @update:modelValue="updateClicks()"
      >
      </v-text-field>
      <v-select
        :label="$t('Campaigns')"
        density="compact"
        variant="outlined"
        color="primary"
        hide-details
        class="common-filter-input-small campaigns-filter"
        v-model="request.campaign_exist"
        :items="campaigns"
        @update:modelValue="updateClicks()"
      >
      </v-select>
      <v-btn
        color="secondary"
        elevation="0"
        class="align-self-end common-btn"
      >
        {{ $t('Filters') }}
        <v-dialog
          v-model="dialogFilters"
          activator="parent"
          width="auto"
        >
          <v-card class="common-card dashboard-campaign__metrics-popup" elevation="0" rounded="lg">
            <div class="d-flex flex-row w-100" style="justify-content: space-between">
              <h3 class="my-auto">
                {{ $t('Filters') }}
              </h3>
              <v-btn
                elevation="0"
                @click="dialogFilters = false"
                icon="mdi-close"
              >
              </v-btn>
            </div>
            <div
              class="filters-row"
              v-for="(filter, index) in chosenFilters"
              :key="index"
            >
              <v-btn
                icon="mdi-close-circle-outline"
                color="secondary"
                class="btn-filter"
                elevation="0"
                @click="chosenFilters.splice(index, 1)"
              >
              </v-btn>
              <v-select
                v-model="filter.key"
                :items="filterKeysPossible"
                variant="outlined"
                color="primary"
                density="compact"
                class="filters-filter-item__select"
                hide-details
                :label="$t('filter')"
              >
                <template v-slot:prepend-inner>
                  {{ $t(filter.key) }}
                </template>
              </v-select>
              <v-select
                v-model="filter.condition"
                :items="filersConditions"
                variant="outlined"
                color="primary"
                density="compact"
                class="filters-condition-item__select"
                hide-details
                :label="$t('Condition')"
                v-if="filter.key"
              >
              </v-select>
              <v-select
                v-if="filter.condition === 'exist' || filter.condition === 'exclude'"
                v-model="filter.value"
                :items="filtersValues(filter.key)"
                variant="outlined"
                color="primary"
                density="compact"
                class="filters-compare-item__select"
                hide-details
                :label="$t('Value')"
              >

              </v-select>
              <v-text-field
                v-else-if="filter.condition === 'contains'"
                v-model="filter.value"
                variant="outlined"
                color="primary"
                density="compact"
                class="filters-compare-item__select"
                hide-details
                :label="$t('Value')"
              >

              </v-text-field>
            </div>
            <v-btn
              color="secondary"
              elevation="0"
              prepend-icon="mdi-plus"
              class="common-btn"
              max-width="180px"
              @click="addFilter"
            >
              {{ $t('Add filter')}}
            </v-btn>

            <div class="common-popup__bts-row mt-6">
              <v-btn
                color="secondary"
                elevation="0"
                @click="chosenFilters = []"
              >
                {{ $t('Reset') }}
              </v-btn>
              <v-btn
                color="error"
                elevation="0"
                @click="chosenFilters = []; dialogFilters = false"
              >
                {{ $t('Cancel') }}
              </v-btn>
              <v-btn
                color="primary"
                elevation="0"
                @click="setFilters"
              >
                Ok
              </v-btn>
            </div>
          </v-card>
        </v-dialog>
      </v-btn>
    </div>
    <div class="dashboard-campaign__bts-row">
      <v-btn
        elevation="0"
        class="common-btn"
        color="secondary"
        type="button"
      >
        {{ $t('Columns') }} {{ columns.length }}
        <v-dialog
          v-model="columnsDialog"
          activator="parent"
          width="auto"
        >
          <v-card class="common-card dashboard-campaign__metrics-popup" elevation="0" rounded="lg">
            <div class="d-flex flex-row w-100" style="justify-content: space-between">
              <h3 class="my-auto">
                {{ $t('Columns') }}
              </h3>
              <v-btn
                elevation="0"
                @click="columnsDialog = false"
                icon="mdi-close"
              >
              </v-btn>
            </div>
            <v-select
              v-model="columns"
              :items="tableHeaders"
              variant="outlined"
              :label="$t('Metrics')"
              multiple
              hide-details
              color="primary"
            >
              <template v-slot:selection="{ item, index }">
                <v-chip rounded="sm" color="primary" class="ma-1">
                  <span>{{ item.title }}</span>
                </v-chip>
              </template>
            </v-select>
            <div class="common-popup__bts-row mt-6">
              <v-btn
                color="secondary"
                elevation="0"
                @click="columns = columnsDefault"
              >
                {{ $t('Reset') }}
              </v-btn>
              <v-btn
                color="error"
                elevation="0"
                @click="columns = []; columnsDialog = false"
              >
                {{ $t('Cancel') }}
              </v-btn>
              <v-btn
                color="primary"
                elevation="0"
                @click="columnsDialog = false"
              >
                Ok
              </v-btn>
            </div>
          </v-card>
        </v-dialog>
      </v-btn>
      <RangeDatePicker
        @handleDate="updateDate"
        class="common-filter-input"
      />
    </div>
  </div>
  <div style="overflow: scroll; margin-top: 24px" class="table-wrapper table-wrapper-common">
    <table id="tableId" class="resizable" :class="(showTableHeaders.length < 17)? 'cols-width-none' : 'cols-width-190px' ">
      <thead>
      <tr>
        <th></th>
        <template v-for="(item,index) in showTableHeaders" :key="index">
          <th v-if="item.title !== $t('Campaign')" :style="(item.value === 'browser_icon' || item.value === 'os_icon')? 'max-width: 56.5px !important': ''">
            <div :style="(item.value === 'browser_icon' || item.value === 'os_icon')? 'max-width: 25px; width: 100%': ''">
              {{ item.title }}
            </div>
          </th>
        </template>
      </tr>
      </thead>
      <TablePreloader
        v-if="loading"
        :width="16"
        :height="10"
      />
      <tbody v-else>
      <tr v-for="(row, index) in tableData" :key="index">
        <td>
          <v-btn
            elevation="0"
            color="primary"
            class="btn-filter my-2 pa-0"
            width="25px"
            min-width="25px"
            max-width="25px"
            height="25px !important"
            type="button"
          >
            <v-icon icon="mdi-eye"></v-icon>
            <v-dialog
              width="auto"
              activator="parent"
            >
              <template v-slot:default="{ isActive }">
                <v-card class="common-popup common-card" elevation="0" rounded="lg">
                  <v-btn
                    elevation="0"
                    @click="isActive.value = false"
                    icon="mdi-close"
                    class="align-self-end"
                  >
                  </v-btn>
                  <v-row v-for="(ceil, index2) in tableHeaders" :key="index2" class="table_item-row">
                    <v-col cols="6">{{ ceil.title }}</v-col>
                    <v-col cols="6">{{ row[ceil.value] }}</v-col>
                  </v-row>
                </v-card>
              </template>
            </v-dialog>
          </v-btn>
        </td>
        <td v-if="columns.includes('keitaro_campaign')">
          <div class="table-cell__content">
            {{ row.keitaro_campaign.campaign_name }}
          </div>
        </td>
        <td v-if="columns.includes('source')">
          <div class="table-cell__content">
            {{ row.source }}
          </div>
        </td>
        <td v-if="columns.includes('referrer')">
          <div class="table-cell__content">
            {{ row.referrer }}
          </div>
        </td>

        <td v-if="columns.includes('keyword')">
          <div class="table-cell__content">
            {{ row.keyword }}
          </div>
        </td>
        <td v-if="columns.includes('sub_id')">
          <div class="table-cell__content">
            {{ row.sub_id }}
          </div>
        </td>
        <td v-if="columns.includes('visitor_code')">
          <div class="table-cell__content">
            {{ row.visitor_code }}
          </div>
        </td>
        <td v-if="columns.includes('stream')">
          <div class="table-cell__content">
            {{ row.stream }}
          </div>
        </td>
        <td v-if="columns.includes('sub_id_1')">
          <div class="table-cell__content">
            {{ row.sub_id_1 }}
          </div>
        </td>
        <td v-if="columns.includes('sub_id_2')">
          <div class="table-cell__content">
            {{ row.sub_id_2 }}
          </div>
        </td>
        <td v-if="columns.includes('sub_id_3')">
          <div class="table-cell__content">
            {{ row.sub_id_3 }}
          </div>
        </td>
        <td v-if="columns.includes('sub_id_4')">
          <div class="table-cell__content">
            {{ row.sub_id_4 }}
          </div>
        </td>
        <td v-if="columns.includes('sub_id_5')">
          <div class="table-cell__content">
            {{ row.sub_id_5 }}
          </div>
        </td>
        <td v-if="columns.includes('sub_id_6')">
          <div class="table-cell__content">
            {{ row.sub_id_6 }}
          </div>
        </td>
        <td v-if="columns.includes('sub_id_7')">
          <div class="table-cell__content">
            {{ row.sub_id_7 }}
          </div>
        </td>
        <td v-if="columns.includes('sub_id_8')">
          <div class="table-cell__content">
            {{ row.sub_id_8 }}
          </div>
        </td>
        <td v-if="columns.includes('sub_id_9')">
          <div class="table-cell__content">
            {{ row.sub_id_9 }}
          </div>
        </td>
        <td v-if="columns.includes('sub_id_10')">
          <div class="table-cell__content">
            {{ row.sub_id_10 }}
          </div>
        </td>
        <td v-if="columns.includes('sub_id_11')">
          <div class="table-cell__content">
            {{ row.sub_id_11 }}
          </div>
        </td>
        <td v-if="columns.includes('sub_id_12')">
          <div class="table-cell__content">
            {{ row.sub_id_12 }}
          </div>
        </td>
        <td v-if="columns.includes('sub_id_13')">
          <div class="table-cell__content">
            {{ row.sub_id_13 }}
          </div>
        </td>
        <td v-if="columns.includes('sub_id_14')">
          <div class="table-cell__content">
            {{ row.sub_id_14 }}
          </div>
        </td>
        <td v-if="columns.includes('sub_id_15')">
          <div class="table-cell__content">
            {{ row.sub_id_15 }}
          </div>
        </td>
        <td v-if="columns.includes('connection_type')">
          <div class="table-cell__content">
            {{ row.connection_type }}
          </div>
        </td>
        <td v-if="columns.includes('operator')">
          <div class="table-cell__content">
            {{ row.operator }}
          </div>
        </td>
        <td v-if="columns.includes('country_flag')">
          <div class="table-cell__content">
            <Flag
              v-if="row.country_flag"
              :code="row.country_flag"
              size="large"
              rounded="small"
            />
          </div>
        </td>
        <td v-if="columns.includes('country')">
          <div class="table-cell__content">
            {{ row.country }}
          </div>
        </td>
        <td v-if="columns.includes('region')">
          <div class="table-cell__content">
            {{ row.region }}
          </div>
        </td>
        <td v-if="columns.includes('city')">
          <div class="table-cell__content">
            {{ row.city }}
          </div>
        </td>
        <td v-if="columns.includes('language')">
          <div class="table-cell__content">
            {{ row.language }}
          </div>
        </td>
        <td v-if="columns.includes('device_type')">
          <div class="table-cell__content">
            {{ row.device_type }}
          </div>
        </td>
        <td v-if="columns.includes('user_agent')">
          <div class="table-cell__content">
            {{ row.user_agent }}
          </div>
        </td>
        <td v-if="columns.includes('os_icon')">
          <div class="table-cell__content">
            <div v-if="row.os_icon" class="logo-icon mx-auto" :class="row.os_icon.toLowerCase()"
            ></div>
          </div>
        </td>
        <td v-if="columns.includes('os')">
          <div class="table-cell__content">
            {{ row.os }}
          </div>
        </td>
        <td v-if="columns.includes('os_version')">
          <div class="table-cell__content">
            {{ row.os_version }}
          </div>
        </td>
        <td v-if="columns.includes('browser')">
          <div class="table-cell__content">
            {{ row.browser }}
          </div>
        </td>
        <td v-if="columns.includes('browser_version')">
          <div class="table-cell__content">
            {{ row.browser_version }}
          </div>
        </td>
        <td v-if="columns.includes('device_model')">
          <div class="table-cell__content">
            {{ row.device_model }}
          </div>
        </td>
        <td v-if="columns.includes('browser_icon')">
          <div class="table-cell__content">
            <div v-if="row.browser_icon" class="logo-icon mx-auto" :class="row.browser_icon.toLowerCase()"
            ></div>
          </div>
        </td>
        <td v-if="columns.includes('ip')">
          <div class="table-cell__content">
            {{ row.ip }}
          </div>
        </td>
        <td v-if="columns.includes('ip_mask1')">
          <div class="table-cell__content">
            {{ row.ip_mask1 }}
          </div>
        </td>
        <td v-if="columns.includes('ip_mask2')">
          <div class="table-cell__content">
            {{ row.ip_mask2 }}
          </div>
        </td>
        <td v-if="columns.includes('datetime')">
          <div class="table-cell__content">
            {{ row.datetime ? new Date(row.datetime).toLocaleDateString('ru-RU') : ''}} {{ row.datetime ? new Date(row.datetime).toLocaleTimeString('ru-RU') : '' }}
          </div>
        </td>
        <td v-if="columns.includes('postback_datetime')">
          <div class="table-cell__content">
            {{ row.postback_datetime ? new Date(row.postback_datetime).toLocaleDateString('ru-RU') : ''}} {{ row.postback_datetime ? new Date(row.postback_datetime).toLocaleTimeString('ru-RU') : '' }}
          </div>
        </td>
        <td v-if="columns.includes('sale_datetime')">
          <div class="table-cell__content">
            {{ row.sale_datetime ? new Date(row.sale_datetime).toLocaleDateString('ru-RU') : ''}} {{ row.sale_datetime? new Date(row.sale_datetime).toLocaleTimeString('ru-RU') : '' }}
          </div>
        </td>
        <td v-if="columns.includes('click_datetime')">
          <div class="table-cell__content">
            {{ row.click_datetime ? new Date(row.click_datetime).toLocaleDateString('ru-RU') : ''}} {{ row.click_datetime ? new Date(row.click_datetime).toLocaleTimeString('ru-RU') : '' }}
          </div>
        </td>
        <td v-if="columns.includes('weekday')">
          <div class="table-cell__content">
            <p v-if="row.weekday === 0"></p>
            <p v-else-if="row.weekday === 1"> {{ $t('Monday') }}</p>
            <p v-else-if="row.weekday === 2"> {{ $t('Tuesday') }}</p>
            <p v-else-if="row.weekday === 3"> {{ $t('Wednesday') }}</p>
            <p v-else-if="row.weekday === 4"> {{ $t('Thursday') }}</p>
            <p v-else-if="row.weekday === 5"> {{ $t('Friday') }}</p>
            <p v-else-if="row.weekday === 6"> {{ $t('Saturday') }}</p>
          </div>
        </td>
        <td v-if="columns.includes('destination')">
          <div class="table-cell__content">
            {{ row.destination }}
          </div>
        </td>
        <td v-if="columns.includes('cost')">
          <div class="table-cell__content" v-if="row.cost">
            {{ row.cost.toLocaleString('ru-RU', { style: 'currency', currency: 'USD' }) }}
          </div>
        </td>
        <td v-if="columns.includes('profitability')">
          <div class="table-cell__content" v-if="row.profitability">
            {{ row.profitability.toLocaleString('ru-RU', { style: 'currency', currency: 'USD' }) }}
          </div>
        </td>
        <td v-if="columns.includes('revenue')">
          <div class="table-cell__content" v-if="row.revenue">
            {{ row.revenue.toLocaleString('ru-RU', { style: 'currency', currency: 'USD' }) }}
          </div>
        </td>
        <td v-if="columns.includes('profit')">
          <div class="table-cell__content" v-if="row.profit">
            {{ row.profit.toLocaleString('ru-RU', { style: 'currency', currency: 'USD' }) }}
          </div>
        </td>
        <td v-if="columns.includes('payout')">
          <div class="table-cell__content" v-if="row.payout">
            {{ row.payout.toLocaleString('ru-RU', { style: 'currency', currency: 'USD' }) }}
          </div>
        </td>
        <td v-if="columns.includes('currency')">
          <div class="table-cell__content" v-if="row.currency">
            {{ row.currency }}
          </div>
        </td>
      </tr>
      </tbody>
    </table>
  </div>
  <v-pagination
    v-model="request.page"
    @update:modelValue="updateClicks"
    :length="pages"
    :total-visible="5"
    color="primary"
    class="mt-6"
  ></v-pagination>
</template>

<script lang="ts" setup>
import { reactive, ref, onMounted, computed } from "vue";
import RangeDatePicker from "@/components/common/RangeDatePicker.vue";
import TablePreloader from "@/components/tables/TablePreloader.vue";
import Flag from "@/components/common/Flag.vue";
import useAxiosGet from "@/composables/useAxiosGet";
import useAxiosPost from "@/composables/useAxiosPost";
import { useI18n } from "vue-i18n";
import {fi} from "vuetify/locale";
const { t } = useI18n({useScope: "global"})

let filtersParams = ''
let request = reactive({
  sub_id_exist: '',
  campaign_exist: '',
  from: '',
  to: '',
  page: 1,
  page_size: 10,
})
let response = ref({})
let tableData = ref([])
let loading = ref(true)
let pages = ref(1)
let campaigns = ref([])

let tableHeaders = ref([
  {title: t('Campaign'), value: 'keitaro_campaign'},
  {title: t('Offer'), key: 'offer'},
  {title: t('Affiliate network'), key: 'affiliate_network'},
  {title: t('Source'), key: 'source'},
  {title: t('Referrer'), key: 'referrer'},
  {title: t('Keyword'), key: 'keyword'},
  {title: 'sub id', key: 'sub_id'},
  {title: 'Visitor code', key: 'visitor_code'},
  {title: t('Stream'), key: 'stream'},
  {title: 'sub id 1', key: 'sub_id_1'},
  {title: 'sub id 2', key: 'sub_id_2'},
  {title: 'sub id 3', key: 'sub_id_3'},
  {title: 'sub id 4', key: 'sub_id_4'},
  {title: 'sub id 5', key: 'sub_id_5'},
  {title: 'sub id 6', key: 'sub_id_6'},
  {title: 'sub id 7', key: 'sub_id_7'},
  {title: 'sub id 8', key: 'sub_id_8'},
  {title: 'sub id 9', key: 'sub_id_9'},
  {title: 'sub id 10', key: 'sub_id_10'},
  {title: 'sub id 11', key: 'sub_id_11'},
  {title: 'sub id 12', key: 'sub_id_12'},
  {title: 'sub id 13', key: 'sub_id_13'},
  {title: 'sub id 14', key: 'sub_id_14'},
  {title: 'sub id 15', key: 'sub_id_15'},
  {title: t('Connection type'), key: 'connection_type'},
  {title: t('Operator'), key: 'operator'},
  {title: t('Flag'), key: 'country_flag'},
  {title: t('Country'), key: 'country'},
  {title: t('Region'), key: 'region'},
  {title: t('City'), key: 'city'},
  {title: t('Language'), key: 'language'},
  {title: t('Device type'), key: 'device_type'},
  {title: 'User agent', key: 'user_agent'},
  {title:  t('OS icon'), value: 'os_icon'},
  {title: 'OS', key: 'os'},
  {title: t('Version os'), value: 'os_version'},
  {title: t('Browser'), key: 'browser'},
  {title: t('Browser version'), key: 'browser_version'},
  {title: t('Device model'), key: 'device_model'},
  {title: t('Browser icon'), value: 'browser_icon'},
  {title: 'ip', key: 'ip'},
  {title: t('ip mask 1'), value: 'ip_mask1'},
  {title: t('ip mask 2'), value: 'ip_mask2'},
  {title: t('Cost'), key: 'cost'},
  {title: t('Profitability'), key: 'profitability'},
  {title: t('Revenue'), key: 'revenue'},
  {title: t('Profit'), key: 'profit'},
  {title: t('Date and time'), value: 'datetime'},
  {title: t('Postback date and time'), key: 'postback_datetime'},
  {title: t('Conversion date and time'), key: 'sale_datetime'},
  {title: t('Click date and time'), key: 'click_datetime'},
  {title: t('Sale period'), key: 'sale_period'},
  {title: t('Status'), key: 'status'},
  {title: t('Previous status'), key: 'previous_status'},
  {title: t('Original status'), key: 'original_status'},
  {title: 'subid', key: 'subid'},
  {title: 'tid', key: 'tid'},
  {title: t('Payout'), key: 'payout'},
  {title: t('Currency'), key: 'currency'},
  {title: t('From partner'), key: 'from_partner'},
])

let columnsDialog = ref(false)
let columns = ref([
  'keitaro_campaign',
  'offer',
  'sub_id',
  'connection_type',
  'country_flag',
  'country',
  'region',
  'city',
  'device_type',
  'os',
  'browser',
  'device_model',
  'ip',
  'datetime',
  'cost',
  'profit',
])
const columnsDefault = ref([
  'keitaro_campaign',
  'offer',
  'sub_id',
  'connection_type',
  'country_flag',
  'country',
  'region',
  'city',
  'device_type',
  'os',
  'browser',
  'device_model',
  'ip',
  'datetime',
  'cost',
  'profit',
])


let showTableHeaders = computed(() => {
  return [...tableHeaders.value].filter(e => columns.value.includes(e.value))
})


function updateDate (date) {
  request.from = date.from
  request.to = date.to
  updateClicks ()
}

function setFiltersValues () {
  let f = Object.keys(filters.value)
  filtersKeys.value = []
  for (let i = 0; i < f.length; i++){
    if (f[i].includes('campaign_name_values')){
      campaigns.value = []
      for(let j = 0; j < filters.value['campaign_name_values'].length; j++) {
        campaigns.value.push({
          title: filters.value['campaign_name_values'][j][1],
          value: filters.value['campaign_name_values'][j][0],
        })
      }
    } else {
      filtersKeys.value.push({
        title: t(f[i].replace('_values','')),
        value: f[i].replace('_values','')
      })
    }
  }
  console.log(filtersKeys.value)
}

let filters = ref([])
let dialogFilters = ref(false)
let chosenFilters = ref([])

function filtersValues (key) {
  if (key) {
    let k = key + '_values'
    return filters.value[k]
  }
}

let filtersKeys = ref([])
let filersConditions = ref([
  { title: t('Exist'), value: 'exist'},
  { title: t('Exclude'), value: 'exclude'},
  { title: t('Contains'), value: 'contains'}
])

function addFilter () {
  chosenFilters.value.push({
    key: '',
    condition: '',
    value: ''
  })
}

function setFilters () {
  filtersParams = ''
  for (let i = 0; i < chosenFilters.value.length; i++){
    filtersParams += `&${chosenFilters.value[i].key}_${chosenFilters.value[i].condition}=${chosenFilters.value[i].value}`
  }
  console.log(filtersParams)
  dialogFilters.value = false
  updateClicks()
}

let filterKeysPossible = computed(() => {
  return [...filtersKeys.value].filter(e => !chosenFilters.value.some((el) => el.key === e.value))
})

async function updateClicks() {
  response.value = await useAxiosGet(
    `dashboard/conversion/?from=${request.from}&to=${request.to}&page=${request.page}&page_size=${request.page_size}&campaign_exist=${request.campaign_exist}&sub_id_exist=${request.sub_id_exist}`
  )
  // console.log(filtersParams)
  tableData.value = response.value.responseData.filter(e => !e.filters)
  filters.value = response.value.responseData.filter(e => e.filters)[0].filters[0]
  console.log(response.value.responseData)
  setFiltersValues()
  console.log(campaigns.value)
  loading.value = response.value.loading
  pages.value = Math.ceil(response.value.items / 10)
}

onMounted(() => {
  updateClicks()
  resizableColumns()
})

function resizableColumns() {
  var tables = document.getElementsByClassName('resizable');
  for (var i = 0; i < tables.length; i++) {
    resizableGrid(tables[i]);
  }

  function resizableGrid(table) {
    var row = table.getElementsByTagName('tr')[0],
      cols = row ? row.children : undefined;
    if (!cols) return;

    table.style.overflow = 'hidden';

    var tableHeight = table.offsetHeight;

    for (var i = 0; i < cols.length; i++) {
      var div = createDiv(tableHeight);
      cols[i].appendChild(div);
      cols[i].style.position = 'relative';
      setListeners(div);
    }

    function setListeners(div) {
      var pageX, curCol, nxtCol, curColWidth, nxtColWidth, tableWidth;

      div.addEventListener('mousedown', function(e) {

        tableWidth = document.getElementById('tableId').offsetWidth;
        curCol = e.target.parentElement;
        nxtCol = curCol.nextElementSibling;
        pageX = e.pageX;

        var padding = paddingDiff(curCol);

        curColWidth = curCol.offsetWidth - padding;
        //  if (nxtCol)
        //nxtColWidth = nxtCol.offsetWidth - padding;
      });

      div.addEventListener('mouseover', function(e) {
        e.target.style.borderRight = '2px solid #2979ff';
      })

      div.addEventListener('mouseout', function(e) {
        e.target.style.borderRight = '';
      })

      document.addEventListener('mousemove', function(e) {
        if (curCol) {
          var diffX = e.pageX - pageX;

          // if (nxtCol)
          //nxtCol.style.width = (nxtColWidth - (diffX)) + 'px';

          curCol.style.width = (curColWidth + diffX) + 'px';
          document.getElementById('tableId').style.width = tableWidth + diffX + "px"
        }
      });

      document.addEventListener('mouseup', function(e) {
        curCol = undefined;
        nxtCol = undefined;
        pageX = undefined;
        nxtColWidth = undefined;
        curColWidth = undefined
      });
    }

    function createDiv(height) {
      var div = document.createElement('div');
      div.style.top = 0;
      div.style.right = 0;
      div.style.width = '5px';
      div.style.position = 'absolute';
      div.style.cursor = 'col-resize';
      div.style.userSelect = 'none';
      div.style.height = height + 'px';
      return div;
    }

    function paddingDiff(col) {

      if (getStyleVal(col, 'box-sizing') == 'border-box') {
        return 0;
      }

      var padLeft = getStyleVal(col, 'padding-left');
      var padRight = getStyleVal(col, 'padding-right');
      return (parseInt(padLeft) + parseInt(padRight));

    }

    function getStyleVal(elm, css) {
      return (window.getComputedStyle(elm, null).getPropertyValue(css))
    }
  };
}
</script>

<style lang="scss" scoped>
* {
  box-sizing: border-box;
}
.v-card{
  overflow-y: scroll;
}
table .resizable {
  border-collapse: collapse;
  overflow: scroll;
  border-radius: 8px;
}
.table-wrapper{
  border-radius: 8px;
  border: 1px solid rgb(var(--v-theme-surface));
  overflow: scroll;
  background: rgb(var(--v-theme-surface));
  background: linear-gradient(
      180deg,
      rgb(var(--v-theme-secondary)) 0%,
      rgb(var(--v-theme-secondary)) 40px,
      rgba(0, 0, 0, 0.12) 40.01px,
      rgba(0, 0, 0, 0.12) 40.6px,
      rgb(var(--v-theme-surface)) 40.61px,
      rgb(var(--v-theme-surface)) 100%
  );
}
.resizable td {
  text-align: left;
  height: 40px !important;
  padding: 0 16px;
  white-space: nowrap;
  max-width: 190px;
  background: rgb(var(--v-theme-surface));
}
.resizable thead tr{
  background-color: rgb(var(--v-theme-surface));
}
.resizable th {
  height: 40px !important;
  padding: 0 16px;
  white-space: nowrap;
  text-align: left;
  background-color: rgb(var(--v-theme-secondary));
  color: #00000099;
  font-weight: normal;
  border-bottom: none !important;
}

.resizable table,
.resizable th,
.resizable td {
  border: 1px solid #000;
}
.filters-wrapper{
  display: flex;
  flex-direction: column;
  gap: 24px;
}
.table-cell__content{
  width: 100%;
  overflow: hidden;
  white-space: nowrap;
}
.table_item-row{
  border-bottom: 1px solid rgb(var(--v-theme-surface));
}
.table_item-row:last-of-type {
  border-bottom: none !important;
}
.table-wrapper-big{
  border-radius: 8px;
  border: 1px solid rgb(var(--v-theme-surface));
  overflow: scroll;
  background: rgb(var(--v-theme-surface));
  background: linear-gradient(
      180deg,
      rgb(var(--v-theme-secondary)) 0%,
      rgb(var(--v-theme-secondary)) 56.5px,
      rgba(0, 0, 0, 0.12) 56.51px,
      rgba(0, 0, 0, 0.12) 57.1px,
      rgb(var(--v-theme-surface)) 57.11px,
      rgb(var(--v-theme-surface)) 100%
  );
}

.table-wrapper-big th:nth-child(1),
.table-wrapper-big th:nth-child(2) {
  padding: 0 8px !important;
}
.table-wrapper-big td:nth-child(1),
.table-wrapper-big td:nth-child(2) {
  padding: 0 8px !important;
}
.table-wrapper-common td:nth-child(1),
.table-wrapper-common td:nth-child(2) {
  padding: 0 8px !important;
}

.logo-icon{
  background-repeat: no-repeat;
  background-size: 100% 100%;
  width: 24px;
  height: 24px;
  filter: grayscale(0.20);
}
.android{
  background-image: url("data:image/svg+xml,%3C%3Fxml version='1.0'%3F%3E%3Csvg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' viewBox='-147 -70 294 345'%3E%3Cg fill='%23a4c639'%3E%3Cuse stroke-width='14.4' xlink:href='%23b' stroke='%23FFF'/%3E%3Cuse xlink:href='%23a' transform='scale(-1,1)'/%3E%3Cg id='a' stroke='%23FFF' stroke-width='7.2'%3E%3Crect rx='6.5' transform='rotate(29)' height='86' width='13' y='-86' x='14'/%3E%3Crect id='c' rx='24' height='133' width='48' y='41' x='-143'/%3E%3Cuse y='97' x='85' xlink:href='%23c'/%3E%3C/g%3E%3Cg id='b'%3E%3Cellipse cy='41' rx='91' ry='84'/%3E%3Crect rx='22' height='182' width='182' y='20' x='-91'/%3E%3C/g%3E%3C/g%3E%3Cg stroke='%23FFF' stroke-width='7.2' fill='%23FFF'%3E%3Cpath d='m-95 44.5h190'/%3E%3Ccircle cx='-42' r='4'/%3E%3Ccircle cx='42' r='4'/%3E%3C/g%3E%3C/svg%3E");
}
.brave{
  background-image: url("data:image/svg+xml,%3C%3Fxml version='1.0' encoding='UTF-8'%3F%3E%3Csvg width='218px' height='256px' viewBox='0 0 218 256' version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3C!-- Generator: Sketch 51.2 (57519) - http://www.bohemiancoding.com/sketch --%3E%3Ctitle%3Ebuild-icons/Stable Copy 3%3C/title%3E%3Cdesc%3ECreated with Sketch.%3C/desc%3E%3Cdefs%3E%3ClinearGradient x1='0%25' y1='50.7055163%25' x2='100%25' y2='50.7055163%25' id='linearGradient-1'%3E%3Cstop stop-color='%23FF5500' offset='0%25'%3E%3C/stop%3E%3Cstop stop-color='%23FF5500' offset='40.9877232%25'%3E%3C/stop%3E%3Cstop stop-color='%23FF2000' offset='58.1981215%25'%3E%3C/stop%3E%3Cstop stop-color='%23FF2000' offset='100%25'%3E%3C/stop%3E%3C/linearGradient%3E%3ClinearGradient x1='2.1484375%25' y1='50.7055163%25' x2='100%25' y2='50.7055163%25' id='linearGradient-2'%3E%3Cstop stop-color='%23FF452A' offset='0%25'%3E%3C/stop%3E%3Cstop stop-color='%23FF2000' offset='100%25'%3E%3C/stop%3E%3C/linearGradient%3E%3Cpath d='M170.272109,25.3359387 L147.968109,0.00010893617 L108.800109,0.00010893617 L69.6321088,0.00010893617 L47.3281088,25.3359387 C47.3281088,25.3359387 27.7441088,19.8891302 18.4961088,29.1487047 C18.4961088,29.1487047 44.6081088,26.7886026 53.5841088,41.4040238 C53.5841088,41.4040238 77.7921088,46.0338111 81.0561088,46.0338111 C84.3201088,46.0338111 91.3921088,43.3104068 97.9201088,41.1316834 C104.448109,38.95296 108.800109,38.9371643 108.800109,38.9371643 C108.800109,38.9371643 113.152109,38.95296 119.680109,41.1316834 C126.208109,43.3104068 133.280109,46.0338111 136.544109,46.0338111 C139.808109,46.0338111 164.016109,41.4040238 164.016109,41.4040238 C172.992109,26.7886026 199.104109,29.1487047 199.104109,29.1487047 C189.856109,19.8891302 170.272109,25.3359387 170.272109,25.3359387' id='path-3'%3E%3C/path%3E%3C/defs%3E%3Cg id='starting-collection' stroke='none' stroke-width='1' fill='none' fill-rule='evenodd'%3E%3Cg id='Build-Icons' transform='translate(-70.000000, -350.000000)'%3E%3Cg id='build-icons/Stable' transform='translate(50.000000, 350.000000)'%3E%3Cg id='Logo' transform='translate(20.114286, 0.000000)'%3E%3Cpath d='M209.984109,61.2848749 L215.968109,46.5784919 C215.968109,46.5784919 208.352109,38.4082791 199.104109,29.1487047 C189.856109,19.8891302 170.272109,25.3359387 170.272109,25.3359387 L147.968109,0.00010893617 L108.800109,0.00010893617 L69.6321088,0.00010893617 L47.3281088,25.3359387 C47.3281088,25.3359387 27.7441088,19.8891302 18.4961088,29.1487047 C9.2481088,38.4082791 1.6321088,46.5784919 1.6321088,46.5784919 L7.6161088,61.2848749 L0.0001088,83.0721089 C0.0001088,83.0721089 22.3993088,168.017811 25.0241088,178.391258 C30.1921088,198.81679 33.7281088,206.714662 48.4161088,217.063598 C63.1041088,227.412534 89.7601088,245.387003 94.1121088,248.110407 C98.4641088,250.833811 103.904109,255.472858 108.800109,255.472858 C113.696109,255.472858 119.136109,250.833811 123.488109,248.110407 C127.840109,245.387003 154.496109,227.412534 169.184109,217.063598 C183.872109,206.714662 187.408109,198.81679 192.576109,178.391258 C195.200365,168.017811 217.600109,83.0721089 217.600109,83.0721089 L209.984109,61.2848749 Z' id='Head' fill='url(%23linearGradient-1)'%3E%3C/path%3E%3Cpath d='M164.016109,41.4040238 C164.016109,41.4040238 192.704493,76.1274281 192.704493,83.5487047 C192.704493,90.9699813 189.095597,92.9286536 185.467117,96.7866281 C181.838637,100.644603 165.991373,117.49376 163.956269,119.657232 C161.921165,121.821249 157.684493,125.101862 160.176557,131.006747 C162.668621,136.911632 166.344973,144.425505 162.256813,152.046679 C158.168109,159.667854 151.164109,164.754628 146.676109,163.913641 C142.188109,163.072109 131.648109,157.557215 127.772109,155.038066 C123.896109,152.518917 111.611501,142.374781 111.611501,138.493386 C111.611501,134.612534 124.310093,127.643888 126.655821,126.0605 C129.002637,124.477658 139.703117,118.349454 139.922349,115.944143 C140.141037,113.538288 140.057805,112.832926 136.899885,106.889369 C133.741965,100.945266 128.054989,93.0136238 129.001549,87.7362111 C129.948109,82.459343 139.119949,79.7152409 145.665357,77.2402111 C152.209677,74.765726 164.811437,70.0918196 166.385229,69.3652153 C167.960109,68.6380664 167.553197,67.945777 162.783949,67.4931472 C158.015789,67.0405174 144.483245,65.2419813 138.382285,66.9446536 C132.281325,68.647326 121.858285,71.2378281 121.013997,72.6115132 C120.169709,73.9851983 119.424973,74.0314962 120.292109,78.7702196 C121.158701,83.508943 125.622765,106.24719 126.055789,110.285998 C126.489357,114.324807 127.336909,116.994832 122.987629,117.990509 C118.637805,118.986186 111.316109,120.715003 108.800109,120.715003 C106.284109,120.715003 98.9618688,118.986186 94.6125888,117.990509 C90.2627648,116.994832 91.1103168,114.324807 91.5438848,110.285998 C91.9774528,106.24719 96.4409728,83.508943 97.3081088,78.7702196 C98.1747008,74.0314962 97.4299648,73.9851983 96.5862208,72.6115132 C95.7419328,71.2378281 85.3183488,68.647326 79.2173888,66.9446536 C73.1164288,65.2419813 59.5844288,67.0405174 54.8157248,67.4931472 C50.0470208,67.945777 49.6401088,68.6380664 51.2144448,69.3652153 C52.7887808,70.0918196 65.3905408,74.765726 71.9348608,77.2402111 C78.4797248,79.7152409 87.6521088,82.459343 88.5986688,87.7362111 C89.5452288,93.0136238 83.8577088,100.945266 80.7003328,106.889369 C77.5424128,112.832926 77.4586368,113.538288 77.6778688,115.944143 C77.8965568,118.349454 88.5975808,124.477658 90.9438528,126.0605 C93.2901248,127.643888 105.988173,134.612534 105.988173,138.493386 C105.988173,142.374781 93.7041088,152.518917 89.8281088,155.038066 C85.9521088,157.557215 75.4121088,163.072109 70.9241088,163.913641 C66.4361088,164.754628 59.4321088,159.667854 55.3434048,152.046679 C51.2552448,144.425505 54.9315968,136.911632 57.4231168,131.006747 C59.9151808,125.101862 55.6790528,121.821249 53.6434048,119.657232 C51.6088448,117.49376 35.7610368,100.644603 32.1325568,96.7866281 C28.5040768,92.9286536 24.8957248,90.9699813 24.8957248,83.5487047 C24.8957248,76.1274281 53.5841088,41.4040238 53.5841088,41.4040238 C53.5841088,41.4040238 77.7921088,46.0338111 81.0561088,46.0338111 C84.3201088,46.0338111 91.3921088,43.3104068 97.9201088,41.1316834 C104.448109,38.95296 108.800109,38.9371643 108.800109,38.9371643 C108.800109,38.9371643 113.152109,38.95296 119.680109,41.1316834 C126.208109,43.3104068 133.280109,46.0338111 136.544109,46.0338111 C139.808109,46.0338111 164.016109,41.4040238 164.016109,41.4040238 Z M142.509504,174.227935 C144.28512,175.341263 143.202016,177.439918 141.584704,178.584837 C139.966848,179.729757 118.228064,196.584361 116.118432,198.447169 C114.008256,200.310523 110.908,203.387425 108.8,203.387425 C106.692,203.387425 103.5912,200.310523 101.481568,198.447169 C99.371392,196.584361 77.633152,179.729757 76.015296,178.584837 C74.39744,177.439918 73.31488,175.341263 75.090496,174.227935 C76.866656,173.115152 82.422528,170.306233 90.08912,166.333876 C97.754624,162.362063 107.308896,158.985042 108.8,158.985042 C110.291104,158.985042 119.844832,162.362063 127.511424,166.333876 C135.177472,170.306233 140.733344,173.115152 142.509504,174.227935 Z' id='Face' fill='%23FFFFFF'%3E%3C/path%3E%3Cmask id='mask-4' fill='white'%3E%3Cuse xlink:href='%23path-3'%3E%3C/use%3E%3C/mask%3E%3Cuse id='Top-Head' fill='url(%23linearGradient-2)' xlink:href='%23path-3'%3E%3C/use%3E%3C/g%3E%3C/g%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
}
.chrome{
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='720' height='720' viewBox='0 0 190.5 190.5' xmlns:v='https://vecta.io/nano'%3E%3Cg transform='translate(90.669 -507.469)'%3E%3Cpath d='M4.583 650.342c26.304 0 47.627-21.324 47.627-47.628s-21.323-47.628-47.627-47.628-47.627 21.324-47.627 47.628 21.323 47.628 47.627 47.628z' fill='%23fff' clip-path='none' mask='none'/%3E%3Cpath d='M-36.664 626.539l-41.24-71.43c-8.362 14.479-12.765 30.904-12.765 47.625s4.401 33.146 12.762 47.625 20.387 26.503 34.868 34.86 30.908 12.755 47.628 12.75l41.24-71.43v-.011c-4.177 7.244-10.188 13.26-17.428 17.443a47.62 47.62 0 0 1-47.632.007 47.62 47.62 0 0 1-17.433-17.437z' fill='%23229342' clip-path='none' mask='none'/%3E%3Cpath d='M45.826 626.536l-41.239 71.43c16.72.003 33.146-4.398 47.626-12.757s26.504-20.384 34.863-34.865a95.24 95.24 0 0 0 12.755-47.627c-.003-16.72-4.408-33.145-12.772-47.623H4.58l-.01.007a47.62 47.62 0 0 1 23.819 6.372c7.243 4.179 13.257 10.19 17.439 17.431a47.62 47.62 0 0 1-.001 47.633z' fill='%23fbc116' clip-path='none' mask='none'/%3E%3Cpath d='M4.583 640.43c20.824 0 37.705-16.881 37.705-37.706s-16.881-37.705-37.705-37.705-37.705 16.881-37.705 37.705 16.881 37.706 37.705 37.706z' fill='%231a73e8' clip-path='none' mask='none'/%3E%3Cpath d='M4.583 555.097h82.479c-8.358-14.481-20.381-26.507-34.861-34.868a95.23 95.23 0 0 0-47.625-12.76c-16.72.001-33.145 4.404-47.623 12.767a95.23 95.23 0 0 0-34.856 34.872l41.24 71.43.011.006a47.62 47.62 0 0 1-.015-47.633c4.179-7.242 10.193-13.256 17.434-17.436s15.456-6.381 23.818-6.379z' fill='%23e33b2e' clip-path='none' mask='none'/%3E%3C/g%3E%3C/svg%3E");
}
.chromium{
  background-image: url("data:image/svg+xml,%3C%3Fxml version='1.0' encoding='UTF-8' standalone='no'%3F%3E%3Csvg version='1.1' id='svg44' width='511.98489' height='511.98489' viewBox='0 0 511.98489 511.98489' xmlns:xlink='http://www.w3.org/1999/xlink' xmlns='http://www.w3.org/2000/svg' xmlns:svg='http://www.w3.org/2000/svg'%3E%3Cdefs id='defs18'%3E%3ClinearGradient xlink:href='%23linearGradient4975' id='linearGradient4633' gradientUnits='userSpaceOnUse' gradientTransform='matrix(231.62575,0,0,231.62472,111.11013,159.99363)' x2='0.5565635' x1='0.46521288' y1='-0.67390651' y2='0.81129867' /%3E%3ClinearGradient id='linearGradient4975'%3E%3Cstop style='stop-color:%231972e7' offset='0' id='stop4971' /%3E%3Cstop style='stop-color:%231969d5' offset='1' id='stop4973' /%3E%3C/linearGradient%3E%3ClinearGradient xlink:href='%233' id='linearGradient1331' x1='101.74381' y1='33.726189' x2='101.59915' y2='135.466' gradientUnits='userSpaceOnUse' gradientTransform='matrix(3.7794235,0,0,3.7794067,0.00151555,0.00377865)' /%3E%3ClinearGradient id='3' x2='1' gradientTransform='matrix(61.286,0,0,61.286,29.399,42.333)' gradientUnits='userSpaceOnUse'%3E%3Cstop offset='0' id='stop1397' style='stop-color:%23afccfb' /%3E%3Cstop offset='1' id='stop1399' style='stop-color:%238bb5f8' /%3E%3C/linearGradient%3E%3ClinearGradient xlink:href='%231' id='linearGradient2962' gradientUnits='userSpaceOnUse' gradientTransform='matrix(94.931559,164.42687,-164.4276,94.931137,97.555991,173.61083)' x2='1.7695541' x1='0.018202547' y1='-0.51170158' y2='0.4994337' /%3E%3ClinearGradient id='1' x2='1' gradientTransform='matrix(25.118,43.506,-43.506,25.118,25.812,45.935)' gradientUnits='userSpaceOnUse'%3E%3Cstop offset='0' id='stop3122' style='stop-color:%23659cf6' /%3E%3Cstop offset='1' id='stop3124' style='stop-color:%234285f4' /%3E%3C/linearGradient%3E%3ClinearGradient xlink:href='%232' id='linearGradient2688' x1='67.452377' y1='40.320694' x2='67.733002' y2='95.25' gradientUnits='userSpaceOnUse' gradientTransform='matrix(3.7794235,0,0,3.7794067,0.00150043,0.00377865)' /%3E%3ClinearGradient id='2'%3E%3Cstop style='stop-color:%233680f0' offset='0' id='stop2682' /%3E%3Cstop style='stop-color:%232678ec' offset='1' id='stop2684' /%3E%3C/linearGradient%3E%3C/defs%3E%3Cpath d='m 255.99319,255.99433 110.85049,63.99671 -110.85049,191.99385 c 141.38068,0 255.9917,-114.61051 255.9917,-255.99056 0,-46.64165 -12.53559,-90.3316 -34.33115,-127.99716 h -221.6632 z' id='path34-4' style='fill:url(%23linearGradient1331)' /%3E%3Cpath d='M 255.99054,0 C 161.2404,0 78.576848,51.513314 34.31224,128.0274 l 110.82781,191.96363 110.85049,-63.9967 V 127.99717 h 221.6632 C 433.38157,51.501975 350.72936,0 255.99054,0 Z' id='path36-1' style='fill:url(%23linearGradient4633)' /%3E%3Cpath d='m 0.00151177,255.99433 c 0,141.38005 114.60723823,255.99056 255.99168823,255.99056 L 366.84368,319.99103 255.9932,255.99433 145.14271,319.99103 34.314897,128.0274 C 12.531434,165.68239 0,209.35646 0,255.99056' id='path38-7' style='fill:url(%23linearGradient2962)' /%3E%3Cpath d='m 383.99094,255.99433 c 0,70.69003 -57.30741,127.99717 -127.99775,127.99717 -70.69034,0 -127.99773,-57.30714 -127.99773,-127.99717 0,-70.69002 57.30739,-127.99716 127.99773,-127.99716 70.69034,0 127.99775,57.30714 127.99775,127.99716' fill='%23ffffff' id='path40' /%3E%3Cpath d='m 359.99158,255.99433 c 0,57.43565 -46.56249,103.99794 -103.99839,103.99794 -57.4359,0 -103.9984,-46.56229 -103.9984,-103.99794 0,-57.43564 46.5625,-103.99793 103.9984,-103.99793 57.4359,0 103.99839,46.56229 103.99839,103.99793' id='path42-5' style='fill:url(%23linearGradient2688)' /%3E%3C/svg%3E%0A");
}
.debian{
  background-image: url("data:image/svg+xml,%3C%3Fxml version='1.0' encoding='UTF-8' standalone='no'%3F%3E%3Csvg xmlns='http://www.w3.org/2000/svg' width='108.76' height='144.13' viewBox='0 0 108.758 144.133'%3E%3Cpath fill='%23D70751' d='M60.969 47.645c-1.494.02.281.768 2.232 1.069.541-.422 1.027-.846 1.463-1.26-1.213.297-2.449.304-3.695.191m8.017-1.999c.893-1.229 1.541-2.573 1.77-3.963-.201.99-.736 1.845-1.244 2.749-2.793 1.759-.264-1.044-.002-2.111-3.002 3.783-.414 2.268-.524 3.325m2.963-7.704c.182-2.691-.529-1.839-.768-.814.278.146.499 1.898.768.814M55.301 1.163c.798.142 1.724.252 1.591.443.876-.193 1.073-.367-1.591-.443m1.592.443-.561.117.523-.048.038-.069'/%3E%3Cpath fill='%23D70751' d='M81.762 38.962c.09 2.416-.705 3.59-1.424 5.666l-1.293.643c-1.057 2.054.105 1.304-.652 2.937-1.652 1.467-5.006 4.589-6.08 4.875-.785-.017.531-.926.703-1.281-2.209 1.516-1.773 2.276-5.152 3.199l-.098-.221c-8.33 3.92-19.902-3.847-19.75-14.443-.088.672-.253.504-.437.774-.43-5.451 2.518-10.926 7.49-13.165 4.863-2.406 10.564-1.42 14.045 1.829-1.912-2.506-5.721-5.163-10.232-4.917-4.421.072-8.558 2.881-9.938 5.932-2.264 1.425-2.528 5.496-3.514 6.242-1.329 9.76 2.497 13.975 8.97 18.936 1.016.686.286.791.422 1.313-2.15-1.006-4.118-2.526-5.738-4.387.86 1.257 1.787 2.479 2.986 3.439-2.029-.685-4.738-4.913-5.527-5.085 3.495 6.258 14.178 10.975 19.775 8.634-2.59.096-5.879.053-8.787-1.022-1.225-.629-2.884-1.93-2.587-2.173 7.636 2.851 15.522 2.158 22.128-3.137 1.682-1.31 3.518-3.537 4.049-3.567-.799 1.202.137.578-.477 1.639 1.672-2.701-.729-1.1 1.73-4.664l.908 1.25c-.34-2.244 2.785-4.966 2.467-8.512.717-1.084.799 1.168.039 3.662 1.055-2.767.279-3.212.549-5.496.291.768.678 1.583.875 2.394-.688-2.675.703-4.503 1.049-6.058-.342-.15-1.061 1.182-1.227-1.976.025-1.372.383-.719.52-1.057-.268-.155-.975-1.207-1.404-3.224.309-.475.832 1.229 1.256 1.298-.273-1.603-.742-2.826-.762-4.057-1.24-2.59-.439.346-1.443-1.112-1.32-4.114 1.094-.955 1.258-2.823 1.998 2.895 3.137 7.385 3.662 9.244-.4-2.267-1.045-4.464-1.834-6.589.609.257-.979-4.663.791-1.405C87.189 15.552 81 9.062 75.305 6.018c.695.637 1.574 1.437 1.26 1.563-2.834-1.685-2.336-1.818-2.742-2.53-2.305-.939-2.459.077-3.984.002-4.35-2.308-5.188-2.063-9.191-3.507l.182.852c-2.881-.96-3.357.362-6.47.002-.189-.147.998-.536 1.976-.677-2.786.368-2.656-.55-5.382.101.671-.471 1.383-.784 2.099-1.184-2.271.138-5.424 1.322-4.451.244-3.705 1.654-10.286 3.975-13.979 7.438l-.116-.776c-1.692 2.031-7.379 6.066-7.832 8.699l-.453.105c-.879 1.491-1.45 3.18-2.148 4.713-1.151 1.963-1.688.756-1.524 1.064-2.265 4.592-3.392 8.45-4.363 11.616.692 1.035.017 6.232.278 10.391-1.136 20.544 14.418 40.489 31.42 45.093 2.492.893 6.197.861 9.349.949-3.718-1.064-4.198-.563-7.822-1.826-2.613-1.232-3.185-2.637-5.037-4.244l.733 1.295c-3.63-1.285-2.111-1.59-5.065-2.525l.783-1.021c-1.177-.09-3.117-1.982-3.647-3.033l-1.288.051c-1.546-1.906-2.371-3.283-2.31-4.35l-.416.742c-.471-.809-5.691-7.158-2.983-5.68-.503-.458-1.172-.747-1.897-2.066l.551-.629c-1.301-1.677-2.398-3.826-2.314-4.542.695.938 1.177 1.114 1.655 1.275-3.291-8.164-3.476-.449-5.967-8.31l.526-.042c-.403-.611-.65-1.27-.974-1.919l.23-2.285c-2.368-2.736-.662-11.645-.319-16.53.235-1.986 1.977-4.101 3.3-7.418l-.806-.138c1.542-2.688 8.802-10.799 12.166-10.383 1.629-2.046-.324-.008-.643-.522 3.579-3.703 4.704-2.616 7.119-3.283 2.603-1.545-2.235.604-1.001-.589 4.503-1.149 3.19-2.614 9.063-3.197.62.352-1.437.544-1.953 1.001 3.75-1.836 11.869-1.417 17.145 1.018 6.117 2.861 12.994 11.314 13.266 19.267l.309.083c-.156 3.162.484 6.819-.627 10.177l.751-1.591'/%3E%3Cpath fill='%23D70751' d='m44.658 49.695-.211 1.047c.983 1.335 1.763 2.781 3.016 3.821-.902-1.759-1.571-2.486-2.805-4.868m2.321-.09c-.52-.576-.826-1.268-1.172-1.956.33 1.211 1.006 2.252 1.633 3.312l-.461-1.356m41.084-8.93-.219.552c-.402 2.858-1.273 5.686-2.605 8.309 1.472-2.767 2.421-5.794 2.824-8.861M55.598.446C56.607.077 58.08.243 59.154 0c-1.398.117-2.789.187-4.162.362l.606.084M20.127 19.308c.233 2.154-1.62 2.991.41 1.569 1.09-2.454-.424-.677-.41-1.569m-2.388 9.974c.469-1.437.553-2.299.732-3.132-1.293 1.654-.596 2.007-.732 3.132'/%3E%3Cpath d='M13.437 125.51c-.045.047-.045 7.506-.138 9.453-.092 1.574-.232 4.957-3.568 4.957-3.429 0-4.263-3.939-4.541-5.652-.324-1.9-.324-3.477-.324-4.17 0-2.225.139-8.436 5.375-8.436 1.576 0 2.456.465 3.151.834l.045 3.02zM0 130.98c0 13.066 6.951 13.066 7.97 13.066 2.873 0 4.727-1.576 5.514-4.309l.093 4.123c.881-.047 1.761-.139 3.197-.139.51 0 .926 0 1.298.047.371 0 .741.045 1.158.092-.741-1.482-1.297-4.818-1.297-12.049 0-7.043 0-18.951.602-22.566-1.667.789-3.105 1.299-6.256 1.576 1.251 1.344 1.251 2.039 1.251 8.154-.879-.277-1.992-.602-3.892-.602-8.294 0-9.638 7.23-9.638 12.61m25.13-2.373c.047-3.846.835-7.275 4.124-7.275 3.615 0 3.891 3.984 3.799 7.275H25.13zm12.51.46c0-5.422-1.065-10.752-7.923-10.752-9.452 0-9.452 10.475-9.452 12.697 0 9.406 4.216 13.113 11.306 13.113 3.149 0 4.68-.461 5.514-.695-.046-1.668.185-2.734.465-4.17-.975.604-2.226 1.391-5.006 1.391-7.229 0-7.322-6.582-7.322-8.852H37.55l.09-2.74m15.075 2.008c0 4.309-.787 10.102-6.162 10.102-.742 0-1.668-.141-2.27-.279-.093-1.668-.093-4.541-.093-7.877 0-3.986.416-6.068.742-7.09.972-3.289 3.15-3.334 3.566-3.334 3.522 0 4.217 4.86 4.217 8.48zm-13.298 5.05c0 3.43 0 5.375-.556 6.857 1.9.742 4.262 1.158 7.09 1.158 1.807 0 7.043 0 9.869-5.791 1.344-2.688 1.807-6.303 1.807-9.037 0-1.668-.186-5.328-1.529-7.646-1.296-2.176-3.382-3.289-5.605-3.289-4.449 0-5.746 3.707-6.44 5.607 0-2.363.045-10.611.415-14.828-3.011 1.391-4.866 1.621-6.857 1.807 1.807.74 1.807 3.801 1.807 13.764v11.397m27.117 7.741c-.928-.139-1.578-.232-2.922-.232-1.48 0-2.502.094-3.566.232.463-.881.648-1.299.787-4.309.186-4.125.232-15.154-.092-17.471-.232-1.762-.648-2.039-1.297-2.502 3.799-.371 4.865-.648 6.625-1.482-.369 2.037-.418 3.059-.418 6.162-.091 15.98-.138 17.7.883 19.6m14.838-13.118c-.092 2.92-.139 4.959-.928 6.58-.973 2.086-2.594 2.688-3.799 2.688-2.783 0-3.383-2.316-3.383-4.586 0-4.355 3.893-4.682 5.652-4.682h2.458zm-12.744 5.7c0 2.92.881 5.838 3.477 7.09 1.158.51 2.316.51 2.688.51 4.264 0 5.699-3.152 6.58-5.098-.047 2.039 0 3.289.139 4.912.834-.047 1.668-.139 3.059-.139.787 0 1.529.092 2.316.139-.51-.787-.787-1.252-.928-3.059-.092-1.76-.092-3.521-.092-5.977l.047-9.453c0-3.523-.928-6.998-7.879-6.998-4.586 0-7.273 1.391-8.617 2.086.557 1.02 1.02 1.898 1.436 3.893 1.809-1.576 4.172-2.41 6.58-2.41 3.848 0 3.848 2.549 3.848 6.162-.881-.045-1.623-.137-2.875-.137-5.887.01-9.779 2.28-9.779 8.49m39.431 2.819c.047 1.576.047 3.244.695 4.588-1.021-.092-1.623-.232-3.521-.232-1.113 0-1.715.094-2.596.232.184-.602.279-.834.371-1.623.139-1.064.232-4.633.232-5.885v-5.004c0-2.178 0-5.33-.141-6.441-.092-.787-.322-2.918-3.012-2.918-2.641 0-3.521 1.945-3.846 3.521-.369 1.621-.369 3.383-.369 10.24.045 5.932.045 6.486.508 8.109-.787-.092-1.76-.184-3.15-.184-1.113 0-1.854.045-2.779.184.324-.742.51-1.113.602-3.707.094-2.549.279-15.061-.141-18.025-.23-1.809-.695-2.225-1.203-2.688 3.754-.186 4.957-.789 6.117-1.389v4.91c.555-1.438 1.713-4.635 6.348-4.635 5.793 0 5.838 4.217 5.885 6.996v13.928'/%3E%3Cpath fill='%23D70751' d='m66.926 111.53-3.838 3.836-3.836-3.836 3.836-3.836 3.838 3.84'/%3E%3C/svg%3E");
}
.edge{
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 256 256'%3E%3Cdefs%3E%3CradialGradient id='b' cx='161.8' cy='68.9' r='95.4' gradientTransform='matrix(1 0 0 -.95 0 248.8)' gradientUnits='userSpaceOnUse'%3E%3Cstop offset='.7' stop-opacity='0'/%3E%3Cstop offset='.9' stop-opacity='.5'/%3E%3Cstop offset='1'/%3E%3C/radialGradient%3E%3CradialGradient id='d' cx='-340.3' cy='63' r='143.2' gradientTransform='matrix(.15 -.99 -.8 -.12 176.6 -125.4)' gradientUnits='userSpaceOnUse'%3E%3Cstop offset='.8' stop-opacity='0'/%3E%3Cstop offset='.9' stop-opacity='.5'/%3E%3Cstop offset='1'/%3E%3C/radialGradient%3E%3CradialGradient id='e' cx='113.4' cy='570.2' r='202.4' gradientTransform='matrix(-.04 1 2.13 .08 -1179.5 -106.7)' gradientUnits='userSpaceOnUse'%3E%3Cstop offset='0' stop-color='%2335c1f1'/%3E%3Cstop offset='.1' stop-color='%2334c1ed'/%3E%3Cstop offset='.2' stop-color='%232fc2df'/%3E%3Cstop offset='.3' stop-color='%232bc3d2'/%3E%3Cstop offset='.7' stop-color='%2336c752'/%3E%3C/radialGradient%3E%3CradialGradient id='f' cx='376.5' cy='568' r='97.3' gradientTransform='matrix(.28 .96 .78 -.23 -303.8 -148.5)' gradientUnits='userSpaceOnUse'%3E%3Cstop offset='0' stop-color='%2366eb6e'/%3E%3Cstop offset='1' stop-color='%2366eb6e' stop-opacity='0'/%3E%3C/radialGradient%3E%3ClinearGradient id='a' x1='63.3' y1='84' x2='241.7' y2='84' gradientTransform='matrix(1 0 0 -1 0 266)' gradientUnits='userSpaceOnUse'%3E%3Cstop offset='0' stop-color='%230c59a4'/%3E%3Cstop offset='1' stop-color='%23114a8b'/%3E%3C/linearGradient%3E%3ClinearGradient id='c' x1='157.3' y1='161.4' x2='46' y2='40.1' gradientTransform='matrix(1 0 0 -1 0 266)' gradientUnits='userSpaceOnUse'%3E%3Cstop offset='0' stop-color='%231b9de2'/%3E%3Cstop offset='.2' stop-color='%231595df'/%3E%3Cstop offset='.7' stop-color='%230680d7'/%3E%3Cstop offset='1' stop-color='%230078d4'/%3E%3C/linearGradient%3E%3C/defs%3E%3Cpath d='M235.7 195.5a93.7 93.7 0 0 1-10.6 4.7 101.9 101.9 0 0 1-35.9 6.4c-47.3 0-88.5-32.5-88.5-74.3a31.5 31.5 0 0 1 16.4-27.3c-42.8 1.8-53.8 46.4-53.8 72.5 0 74 68.1 81.4 82.8 81.4 7.9 0 19.8-2.3 27-4.6l1.3-.4a128.3 128.3 0 0 0 66.6-52.8 4 4 0 0 0-5.3-5.6Z' transform='translate(-4.6 -5)' style='fill:url(%23a)'/%3E%3Cpath d='M235.7 195.5a93.7 93.7 0 0 1-10.6 4.7 101.9 101.9 0 0 1-35.9 6.4c-47.3 0-88.5-32.5-88.5-74.3a31.5 31.5 0 0 1 16.4-27.3c-42.8 1.8-53.8 46.4-53.8 72.5 0 74 68.1 81.4 82.8 81.4 7.9 0 19.8-2.3 27-4.6l1.3-.4a128.3 128.3 0 0 0 66.6-52.8 4 4 0 0 0-5.3-5.6Z' transform='translate(-4.6 -5)' style='isolation:isolate;opacity:.35;fill:url(%23b)'/%3E%3Cpath d='M110.3 246.3A79.2 79.2 0 0 1 87.6 225a80.7 80.7 0 0 1 29.5-120c3.2-1.5 8.5-4.1 15.6-4a32.4 32.4 0 0 1 25.7 13 31.9 31.9 0 0 1 6.3 18.7c0-.2 24.5-79.6-80-79.6-43.9 0-80 41.6-80 78.2a130.2 130.2 0 0 0 12.1 56 128 128 0 0 0 156.4 67 75.5 75.5 0 0 1-62.8-8Z' transform='translate(-4.6 -5)' style='fill:url(%23c)'/%3E%3Cpath d='M110.3 246.3A79.2 79.2 0 0 1 87.6 225a80.7 80.7 0 0 1 29.5-120c3.2-1.5 8.5-4.1 15.6-4a32.4 32.4 0 0 1 25.7 13 31.9 31.9 0 0 1 6.3 18.7c0-.2 24.5-79.6-80-79.6-43.9 0-80 41.6-80 78.2a130.2 130.2 0 0 0 12.1 56 128 128 0 0 0 156.4 67 75.5 75.5 0 0 1-62.8-8Z' transform='translate(-4.6 -5)' style='opacity:.41;fill:url(%23d);isolation:isolate'/%3E%3Cpath d='M157 153.8c-.9 1-3.4 2.5-3.4 5.6 0 2.6 1.7 5.2 4.8 7.3 14.3 10 41.4 8.6 41.5 8.6a59.6 59.6 0 0 0 30.3-8.3 61.4 61.4 0 0 0 30.4-52.9c.3-22.4-8-37.3-11.3-43.9C228 28.8 182.3 5 132.6 5a128 128 0 0 0-128 126.2c.5-36.5 36.8-66 80-66 3.5 0 23.5.3 42 10a72.6 72.6 0 0 1 30.9 29.3c6.1 10.6 7.2 24.1 7.2 29.5s-2.7 13.3-7.8 19.9Z' transform='translate(-4.6 -5)' style='fill:url(%23e)'/%3E%3Cpath d='M157 153.8c-.9 1-3.4 2.5-3.4 5.6 0 2.6 1.7 5.2 4.8 7.3 14.3 10 41.4 8.6 41.5 8.6a59.6 59.6 0 0 0 30.3-8.3 61.4 61.4 0 0 0 30.4-52.9c.3-22.4-8-37.3-11.3-43.9C228 28.8 182.3 5 132.6 5a128 128 0 0 0-128 126.2c.5-36.5 36.8-66 80-66 3.5 0 23.5.3 42 10a72.6 72.6 0 0 1 30.9 29.3c6.1 10.6 7.2 24.1 7.2 29.5s-2.7 13.3-7.8 19.9Z' transform='translate(-4.6 -5)' style='fill:url(%23f)'/%3E%3C/svg%3E%0A");
}
.firefox{
  background-image: url("data:image/svg+xml,%3C%3Fxml version='1.0' encoding='UTF-8'%3F%3E%3C!-- This Source Code Form is subject to the terms of the Mozilla Public - License, v. 2.0. If a copy of the MPL was not distributed with this - file, You can obtain one at http://mozilla.org/MPL/2.0/. --%3E%3Csvg width='77.42' height='79.97' version='1.1' viewBox='0 0 77.42 79.97' xmlns='http://www.w3.org/2000/svg' xmlns:cc='http://creativecommons.org/ns%23' xmlns:dc='http://purl.org/dc/elements/1.1/' xmlns:rdf='http://www.w3.org/1999/02/22-rdf-syntax-ns%23'%3E%3Ctitle%3EFirefox Browser logo%3C/title%3E%3Cdefs%3E%3ClinearGradient id='a' x1='70.79' x2='6.447' y1='12.39' y2='74.47' gradientTransform='translate(-1.3 -.004086)' gradientUnits='userSpaceOnUse'%3E%3Cstop stop-color='%23fff44f' offset='.048'/%3E%3Cstop stop-color='%23ffe847' offset='.111'/%3E%3Cstop stop-color='%23ffc830' offset='.225'/%3E%3Cstop stop-color='%23ff980e' offset='.368'/%3E%3Cstop stop-color='%23ff8b16' offset='.401'/%3E%3Cstop stop-color='%23ff672a' offset='.462'/%3E%3Cstop stop-color='%23ff3647' offset='.534'/%3E%3Cstop stop-color='%23e31587' offset='.705'/%3E%3C/linearGradient%3E%3CradialGradient id='b' cx='-7907' cy='-8515' r='80.8' gradientTransform='translate(7974,8524)' gradientUnits='userSpaceOnUse'%3E%3Cstop stop-color='%23ffbd4f' offset='.129'/%3E%3Cstop stop-color='%23ffac31' offset='.186'/%3E%3Cstop stop-color='%23ff9d17' offset='.247'/%3E%3Cstop stop-color='%23ff980e' offset='.283'/%3E%3Cstop stop-color='%23ff563b' offset='.403'/%3E%3Cstop stop-color='%23ff3750' offset='.467'/%3E%3Cstop stop-color='%23f5156c' offset='.71'/%3E%3Cstop stop-color='%23eb0878' offset='.782'/%3E%3Cstop stop-color='%23e50080' offset='.86'/%3E%3C/radialGradient%3E%3CradialGradient id='c' cx='-7937' cy='-8482' r='80.8' gradientTransform='translate(7974,8524)' gradientUnits='userSpaceOnUse'%3E%3Cstop stop-color='%23960e18' offset='.3'/%3E%3Cstop stop-color='%23b11927' stop-opacity='.74' offset='.351'/%3E%3Cstop stop-color='%23db293d' stop-opacity='.343' offset='.435'/%3E%3Cstop stop-color='%23f5334b' stop-opacity='.094' offset='.497'/%3E%3Cstop stop-color='%23ff3750' stop-opacity='0' offset='.53'/%3E%3C/radialGradient%3E%3CradialGradient id='d' cx='-7927' cy='-8533' r='58.53' gradientTransform='translate(7974,8524)' gradientUnits='userSpaceOnUse'%3E%3Cstop stop-color='%23fff44f' offset='.132'/%3E%3Cstop stop-color='%23ffdc3e' offset='.252'/%3E%3Cstop stop-color='%23ff9d12' offset='.506'/%3E%3Cstop stop-color='%23ff980e' offset='.526'/%3E%3C/radialGradient%3E%3CradialGradient id='e' cx='-7946' cy='-8461' r='38.47' gradientTransform='translate(7974,8524)' gradientUnits='userSpaceOnUse'%3E%3Cstop stop-color='%233a8ee6' offset='.353'/%3E%3Cstop stop-color='%235c79f0' offset='.472'/%3E%3Cstop stop-color='%239059ff' offset='.669'/%3E%3Cstop stop-color='%23c139e6' offset='1'/%3E%3C/radialGradient%3E%3CradialGradient id='f' cx='-7936' cy='-8492' r='20.4' gradientTransform='matrix(.972 -.235 .275 1.138 10090 7834)' gradientUnits='userSpaceOnUse'%3E%3Cstop stop-color='%239059ff' stop-opacity='0' offset='.206'/%3E%3Cstop stop-color='%238c4ff3' stop-opacity='.064' offset='.278'/%3E%3Cstop stop-color='%237716a8' stop-opacity='.45' offset='.747'/%3E%3Cstop stop-color='%236e008b' stop-opacity='.6' offset='.975'/%3E%3C/radialGradient%3E%3CradialGradient id='g' cx='-7938' cy='-8518' r='27.68' gradientTransform='translate(7974,8524)' gradientUnits='userSpaceOnUse'%3E%3Cstop stop-color='%23ffe226' offset='0'/%3E%3Cstop stop-color='%23ffdb27' offset='.121'/%3E%3Cstop stop-color='%23ffc82a' offset='.295'/%3E%3Cstop stop-color='%23ffa930' offset='.502'/%3E%3Cstop stop-color='%23ff7e37' offset='.732'/%3E%3Cstop stop-color='%23ff7139' offset='.792'/%3E%3C/radialGradient%3E%3CradialGradient id='h' cx='-7916' cy='-8536' r='118.1' gradientTransform='translate(7974,8524)' gradientUnits='userSpaceOnUse'%3E%3Cstop stop-color='%23fff44f' offset='.113'/%3E%3Cstop stop-color='%23ff980e' offset='.456'/%3E%3Cstop stop-color='%23ff5634' offset='.622'/%3E%3Cstop stop-color='%23ff3647' offset='.716'/%3E%3Cstop stop-color='%23e31587' offset='.904'/%3E%3C/radialGradient%3E%3CradialGradient id='i' cx='-7927' cy='-8523' r='86.5' gradientTransform='matrix(.105 .995 -.653 .069 -4685 8470)' gradientUnits='userSpaceOnUse'%3E%3Cstop stop-color='%23fff44f' offset='0'/%3E%3Cstop stop-color='%23ffe847' offset='.06'/%3E%3Cstop stop-color='%23ffc830' offset='.168'/%3E%3Cstop stop-color='%23ff980e' offset='.304'/%3E%3Cstop stop-color='%23ff8b16' offset='.356'/%3E%3Cstop stop-color='%23ff672a' offset='.455'/%3E%3Cstop stop-color='%23ff3647' offset='.57'/%3E%3Cstop stop-color='%23e31587' offset='.737'/%3E%3C/radialGradient%3E%3CradialGradient id='j' cx='-7938' cy='-8508' r='73.72' gradientTransform='translate(7974,8524)' gradientUnits='userSpaceOnUse'%3E%3Cstop stop-color='%23fff44f' offset='.137'/%3E%3Cstop stop-color='%23ff980e' offset='.48'/%3E%3Cstop stop-color='%23ff5634' offset='.592'/%3E%3Cstop stop-color='%23ff3647' offset='.655'/%3E%3Cstop stop-color='%23e31587' offset='.904'/%3E%3C/radialGradient%3E%3CradialGradient id='k' cx='-7919' cy='-8504' r='80.69' gradientTransform='translate(7974,8524)' gradientUnits='userSpaceOnUse'%3E%3Cstop stop-color='%23fff44f' offset='.094'/%3E%3Cstop stop-color='%23ffe141' offset='.231'/%3E%3Cstop stop-color='%23ffaf1e' offset='.509'/%3E%3Cstop stop-color='%23ff980e' offset='.626'/%3E%3C/radialGradient%3E%3ClinearGradient id='l' x1='70.01' x2='15.27' y1='12.06' y2='66.81' gradientTransform='translate(-1.3 -.004086)' gradientUnits='userSpaceOnUse'%3E%3Cstop stop-color='%23fff44f' stop-opacity='.8' offset='.167'/%3E%3Cstop stop-color='%23fff44f' stop-opacity='.634' offset='.266'/%3E%3Cstop stop-color='%23fff44f' stop-opacity='.217' offset='.489'/%3E%3Cstop stop-color='%23fff44f' stop-opacity='0' offset='.6'/%3E%3C/linearGradient%3E%3C/defs%3E%3Cg transform='matrix(.9819843 0 0 .9819843 .6974849 .7199239)'%3E%3Cpath d='m74.62 26.83c-1.684-4.052-5.1-8.427-7.775-9.81a40.27 40.27 0 0 1 3.925 11.76l7e-3 0.065c-4.382-10.92-11.81-15.33-17.88-24.92-0.307-0.485-0.614-0.971-0.913-1.484-0.171-0.293-0.308-0.557-0.427-0.8a7.053 7.053 0 0 1-0.578-1.535 0.1 0.1 0 0 0-0.088-0.1 0.138 0.138 0 0 0-0.073 0c-5e-3 0-0.013 9e-3 -0.019 0.011s-0.019 0.011-0.028 0.015l0.015-0.026c-9.735 5.7-13.04 16.25-13.34 21.53a19.39 19.39 0 0 0-10.67 4.111 11.59 11.59 0 0 0-1-0.758 17.97 17.97 0 0 1-0.109-9.473 28.7 28.7 0 0 0-9.329 7.21h-0.018c-1.536-1.947-1.428-8.367-1.34-9.708a6.928 6.928 0 0 0-1.294 0.687 28.22 28.22 0 0 0-3.788 3.245 33.84 33.84 0 0 0-3.623 4.347v6e-3 -7e-3a32.73 32.73 0 0 0-5.2 11.74l-0.052 0.256c-0.073 0.341-0.336 2.049-0.381 2.42 0 0.029-6e-3 0.056-9e-3 0.085a36.94 36.94 0 0 0-0.629 5.343v0.2a38.76 38.76 0 0 0 76.95 6.554c0.065-0.5 0.118-0.995 0.176-1.5a39.86 39.86 0 0 0-2.514-19.47zm-44.67 30.34c0.181 0.087 0.351 0.181 0.537 0.264l0.027 0.017q-0.282-0.135-0.564-0.281zm8.878-23.38m31.95-4.934v-0.037l7e-3 0.041z' fill='url(%23a)'/%3E%3Cpath d='m74.62 26.83c-1.684-4.052-5.1-8.427-7.775-9.81a40.27 40.27 0 0 1 3.925 11.76v0.037l7e-3 0.041a35.1 35.1 0 0 1-1.206 26.16c-4.442 9.531-15.19 19.3-32.02 18.82-18.18-0.515-34.2-14.01-37.19-31.68-0.545-2.787 0-4.2 0.274-6.465a28.88 28.88 0 0 0-0.623 5.348v0.2a38.76 38.76 0 0 0 76.95 6.554c0.065-0.5 0.118-0.995 0.176-1.5a39.86 39.86 0 0 0-2.514-19.47z' fill='url(%23b)'/%3E%3Cpath d='m74.62 26.83c-1.684-4.052-5.1-8.427-7.775-9.81a40.27 40.27 0 0 1 3.925 11.76v0.037l7e-3 0.041a35.1 35.1 0 0 1-1.206 26.16c-4.442 9.531-15.19 19.3-32.02 18.82-18.18-0.515-34.2-14.01-37.19-31.68-0.545-2.787 0-4.2 0.274-6.465a28.88 28.88 0 0 0-0.623 5.348v0.2a38.76 38.76 0 0 0 76.95 6.554c0.065-0.5 0.118-0.995 0.176-1.5a39.86 39.86 0 0 0-2.514-19.47z' fill='url(%23c)'/%3E%3Cpath d='m55.78 31.38c0.084 0.059 0.162 0.118 0.241 0.177a21.1 21.1 0 0 0-3.6-4.695c-12.05-12.05-3.157-26.12-1.658-26.84l0.015-0.022c-9.735 5.7-13.04 16.25-13.34 21.53 0.452-0.031 0.9-0.069 1.362-0.069a19.56 19.56 0 0 1 16.98 9.917z' fill='url(%23d)'/%3E%3Cpath d='m38.82 33.79c-0.064 0.964-3.47 4.289-4.661 4.289-11.02 0-12.81 6.667-12.81 6.667 0.488 5.614 4.4 10.24 9.129 12.68 0.216 0.112 0.435 0.213 0.654 0.312q0.569 0.252 1.138 0.466a17.24 17.24 0 0 0 5.043 0.973c19.32 0.906 23.06-23.1 9.119-30.07a13.38 13.38 0 0 1 9.345 2.269 19.56 19.56 0 0 0-16.98-9.917c-0.46 0-0.91 0.038-1.362 0.069a19.39 19.39 0 0 0-10.67 4.111c0.591 0.5 1.258 1.168 2.663 2.553 2.63 2.591 9.375 5.275 9.39 5.59z' fill='url(%23e)'/%3E%3Cpath d='m38.82 33.79c-0.064 0.964-3.47 4.289-4.661 4.289-11.02 0-12.81 6.667-12.81 6.667 0.488 5.614 4.4 10.24 9.129 12.68 0.216 0.112 0.435 0.213 0.654 0.312q0.569 0.252 1.138 0.466a17.24 17.24 0 0 0 5.043 0.973c19.32 0.906 23.06-23.1 9.119-30.07a13.38 13.38 0 0 1 9.345 2.269 19.56 19.56 0 0 0-16.98-9.917c-0.46 0-0.91 0.038-1.362 0.069a19.39 19.39 0 0 0-10.67 4.111c0.591 0.5 1.258 1.168 2.663 2.553 2.63 2.591 9.375 5.275 9.39 5.59z' fill='url(%23f)'/%3E%3Cpath d='m24.96 24.36c0.314 0.2 0.573 0.374 0.8 0.531a17.97 17.97 0 0 1-0.109-9.473 28.7 28.7 0 0 0-9.329 7.21c0.189-5e-3 5.811-0.106 8.638 1.732z' fill='url(%23g)'/%3E%3Cpath d='m0.354 42.16c2.991 17.67 19.01 31.17 37.19 31.68 16.83 0.476 27.58-9.294 32.02-18.82a35.1 35.1 0 0 0 1.206-26.16v-0.037c0-0.029-6e-3 -0.046 0-0.037l7e-3 0.065c1.375 8.977-3.191 17.67-10.33 23.56l-0.022 0.05c-13.91 11.33-27.22 6.834-29.91 5q-0.282-0.135-0.564-0.281c-8.109-3.876-11.46-11.26-10.74-17.6a9.953 9.953 0 0 1-9.181-5.775 14.62 14.62 0 0 1 14.25-0.572 19.3 19.3 0 0 0 14.55 0.572c-0.015-0.315-6.76-3-9.39-5.59-1.405-1.385-2.072-2.052-2.663-2.553a11.59 11.59 0 0 0-1-0.758c-0.23-0.157-0.489-0.327-0.8-0.531-2.827-1.838-8.449-1.737-8.635-1.732h-0.018c-1.536-1.947-1.428-8.367-1.34-9.708a6.928 6.928 0 0 0-1.294 0.687 28.22 28.22 0 0 0-3.788 3.245 33.84 33.84 0 0 0-3.638 4.337v6e-3 -7e-3a32.73 32.73 0 0 0-5.2 11.74c-0.019 0.079-1.396 6.099-0.717 9.221z' fill='url(%23h)'/%3E%3Cpath d='m52.42 26.86a21.1 21.1 0 0 1 3.6 4.7c0.213 0.161 0.412 0.321 0.581 0.476 8.787 8.1 4.183 19.55 3.84 20.36 7.138-5.881 11.7-14.58 10.33-23.56-4.384-10.93-11.82-15.34-17.88-24.93-0.307-0.485-0.614-0.971-0.913-1.484-0.171-0.293-0.308-0.557-0.427-0.8a7.053 7.053 0 0 1-0.578-1.535 0.1 0.1 0 0 0-0.088-0.1 0.138 0.138 0 0 0-0.073 0c-5e-3 0-0.013 9e-3 -0.019 0.011s-0.019 0.011-0.028 0.015c-1.499 0.711-10.39 14.79 1.66 26.83z' fill='url(%23i)'/%3E%3Cpath d='m56.6 32.04c-0.169-0.155-0.368-0.315-0.581-0.476-0.079-0.059-0.157-0.118-0.241-0.177a13.38 13.38 0 0 0-9.345-2.269c13.94 6.97 10.2 30.97-9.119 30.07a17.24 17.24 0 0 1-5.043-0.973q-0.569-0.213-1.138-0.466c-0.219-0.1-0.438-0.2-0.654-0.312l0.027 0.017c2.694 1.839 16 6.332 29.91-5l0.022-0.05c0.347-0.81 4.951-12.26-3.84-20.36z' fill='url(%23j)'/%3E%3Cpath d='m21.35 44.74s1.789-6.667 12.81-6.667c1.191 0 4.6-3.325 4.661-4.289a19.3 19.3 0 0 1-14.55-0.572 14.62 14.62 0 0 0-14.25 0.572 9.953 9.953 0 0 0 9.181 5.775c-0.718 6.337 2.632 13.72 10.74 17.6 0.181 0.087 0.351 0.181 0.537 0.264-4.733-2.445-8.641-7.069-9.129-12.68z' fill='url(%23k)'/%3E%3Cpath d='m74.62 26.83c-1.684-4.052-5.1-8.427-7.775-9.81a40.27 40.27 0 0 1 3.925 11.76l7e-3 0.065c-4.382-10.92-11.81-15.33-17.88-24.92-0.307-0.485-0.614-0.971-0.913-1.484-0.171-0.293-0.308-0.557-0.427-0.8a7.053 7.053 0 0 1-0.578-1.535 0.1 0.1 0 0 0-0.088-0.1 0.138 0.138 0 0 0-0.073 0c-5e-3 0-0.013 9e-3 -0.019 0.011s-0.019 0.011-0.028 0.015l0.015-0.026c-9.735 5.7-13.04 16.25-13.34 21.53 0.452-0.031 0.9-0.069 1.362-0.069a19.56 19.56 0 0 1 16.98 9.917 13.38 13.38 0 0 0-9.345-2.269c13.94 6.97 10.2 30.97-9.119 30.07a17.24 17.24 0 0 1-5.043-0.973q-0.569-0.213-1.138-0.466c-0.219-0.1-0.438-0.2-0.654-0.312l0.027 0.017q-0.282-0.135-0.564-0.281c0.181 0.087 0.351 0.181 0.537 0.264-4.733-2.446-8.641-7.07-9.129-12.68 0 0 1.789-6.667 12.81-6.667 1.191 0 4.6-3.325 4.661-4.289-0.015-0.315-6.76-3-9.39-5.59-1.405-1.385-2.072-2.052-2.663-2.553a11.59 11.59 0 0 0-1-0.758 17.97 17.97 0 0 1-0.109-9.473 28.7 28.7 0 0 0-9.329 7.21h-0.018c-1.536-1.947-1.428-8.367-1.34-9.708a6.928 6.928 0 0 0-1.294 0.687 28.22 28.22 0 0 0-3.788 3.245 33.84 33.84 0 0 0-3.623 4.347v6e-3 -7e-3a32.73 32.73 0 0 0-5.2 11.74l-0.052 0.256c-0.073 0.341-0.4 2.073-0.447 2.445a45.09 45.09 0 0 0-0.572 5.403v0.2a38.76 38.76 0 0 0 76.95 6.554c0.065-0.5 0.118-0.995 0.176-1.5a39.86 39.86 0 0 0-2.514-19.47zm-3.845 1.991 7e-3 0.041z' fill='url(%23l)'/%3E%3C/g%3E%3Cmetadata%3E%3Crdf:RDF%3E%3Ccc:Work rdf:about=''%3E%3Cdc:title%3EFirefox Browser logo%3C/dc:title%3E%3C/cc:Work%3E%3C/rdf:RDF%3E%3C/metadata%3E%3C/svg%3E");
}
.internet-explorer{
  background-image: url("data:image/svg+xml,%3C%3Fxml version='1.0' encoding='UTF-8' standalone='no'%3F%3E%3C!-- Created with Inkscape (http://www.inkscape.org/) --%3E%3Csvg id='svg3769' xmlns:rdf='http://www.w3.org/1999/02/22-rdf-syntax-ns%23' xmlns='http://www.w3.org/2000/svg' height='218.79' width='222.64' version='1.1' xmlns:cc='http://creativecommons.org/ns%23' xmlns:dc='http://purl.org/dc/elements/1.1/'%3E%3Cmetadata id='metadata3774'%3E%3Crdf:RDF%3E%3Ccc:Work rdf:about=''%3E%3Cdc:format%3Eimage/svg+xml%3C/dc:format%3E%3Cdc:type rdf:resource='http://purl.org/dc/dcmitype/StillImage'/%3E%3Cdc:title/%3E%3C/cc:Work%3E%3C/rdf:RDF%3E%3C/metadata%3E%3Cg id='layer1' transform='translate(-314.39 -274.4)'%3E%3Cpath id='svg' fill='%231ebbee' d='m533.03 388.73c0-16.968-4.387-32.909-12.08-46.761 32.791-74.213-35.136-63.343-38.918-62.603-14.391 2.816-27.705 7.337-39.986 13.068-1.811-0.102-3.633-0.158-5.469-0.158-45.833 0-84.198 31.968-94.017 74.823 24.157-27.101 41.063-38.036 51.187-42.412-1.616 1.444-3.198 2.904-4.754 4.375-0.518 0.489-1.017 0.985-1.528 1.477-1.026 0.987-2.05 1.975-3.05 2.972-0.595 0.593-1.174 1.191-1.76 1.788-0.887 0.903-1.772 1.805-2.638 2.713-0.615 0.645-1.215 1.292-1.819 1.938-0.809 0.866-1.613 1.733-2.402 2.603-0.613 0.676-1.216 1.352-1.818 2.03-0.748 0.842-1.489 1.684-2.22 2.528-0.606 0.7-1.207 1.4-1.801 2.101-0.693 0.818-1.377 1.636-2.054 2.454-0.599 0.724-1.196 1.447-1.782 2.17-0.634 0.782-1.254 1.563-1.873 2.343-0.6 0.756-1.2 1.511-1.786 2.266-0.558 0.719-1.1 1.435-1.646 2.152-0.616 0.81-1.237 1.62-1.837 2.426-0.429 0.577-0.841 1.148-1.262 1.723-3.811 5.2-7.293 10.3-10.438 15.199-0.008 0.012-0.016 0.024-0.023 0.036-0.828 1.29-1.627 2.561-2.41 3.821-0.042 0.068-0.086 0.137-0.128 0.206-0.784 1.265-1.541 2.508-2.279 3.738-0.026 0.043-0.053 0.087-0.079 0.13-1.984 3.311-3.824 6.503-5.481 9.506-8.687 15.743-12.916 26.742-13.099 27.395-27.432 98.072 58.184 56.657 70.131 50.475 12.864 6.355 27.346 9.932 42.666 9.932 41.94 0 77.623-26.771 90.905-64.156h-50.68c-7.499 12.669-21.936 21.25-38.522 21.25-24.301 0-44-18.412-44-41.125h137.96c0.523-4.068 0.794-8.214 0.794-12.423zm-18.018-94.916c8.306 5.606 14.968 14.41 3.527 44.059-10.973-17.647-27.482-31.49-47.104-39.099 8.926-4.311 31.031-13.429 43.577-4.96zm-176.52 181.24c-6.765-6.938-7.961-23.836 6.967-54.628 7.534 21.661 22.568 39.811 42 51.33-9.664 5.319-35.32 17.295-48.967 3.298zm55.571-100.28c0.771-22.075 19.983-39.75 43.588-39.75 23.604 0 42.817 17.675 43.588 39.75h-87.176z'/%3E%3C/g%3E%3C/svg%3E%0A");
}
.ios{
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Ctitle%3Eapple%3C/title%3E%3Cpath d='M18.71,19.5C17.88,20.74 17,21.95 15.66,21.97C14.32,22 13.89,21.18 12.37,21.18C10.84,21.18 10.37,21.95 9.1,22C7.79,22.05 6.8,20.68 5.96,19.47C4.25,17 2.94,12.45 4.7,9.39C5.57,7.87 7.13,6.91 8.82,6.88C10.1,6.86 11.32,7.75 12.11,7.75C12.89,7.75 14.37,6.68 15.92,6.84C16.57,6.87 18.39,7.1 19.56,8.82C19.47,8.88 17.39,10.1 17.41,12.63C17.44,15.65 20.06,16.66 20.09,16.67C20.06,16.74 19.67,18.11 18.71,19.5M13,3.5C13.73,2.67 14.94,2.04 15.94,2C16.07,3.17 15.6,4.35 14.9,5.19C14.21,6.04 13.07,6.7 11.95,6.61C11.8,5.46 12.36,4.26 13,3.5Z' /%3E%3C/svg%3E");
}
.linux{
  background-image: url("data:image/svg+xml,%3C%3Fxml version='1.0' encoding='utf-8'%3F%3E%3C!-- Generator: Adobe Illustrator 19.1.1, SVG Export Plug-In . SVG Version: 6.00 Build 0) --%3E%3Csvg version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' viewBox='0 2 48 48' enable-background='new 0 2 48 48' xml:space='preserve'%3E%3Cpolygon fill='%23ECEFF1' points='20.1,18.2 20.2,20.5 18.6,23.5 16.1,28.4 15.6,32.5 17.4,38.3 21.5,40.6 27.7,40.6 33.5,36.2 36.1,29.3 30.1,22 28.4,17.9 '/%3E%3Cpath fill='%23263238' d='M34.3,23.9c-1.6-2.3-2.9-3.7-3.6-6.6c-0.7-2.9,0.2-2.1-0.4-4.6c-0.3-1.3-0.8-2.2-1.3-2.9 c-0.6-0.7-1.3-1.1-1.7-1.2c-0.9-0.5-3-1.3-5.6,0.1c-2.7,1.4-2.4,4.4-1.9,10.5c0,0.4-0.1,0.9-0.3,1.3c-0.4,0.9-1.1,1.7-1.7,2.4 c-0.7,1-1.4,2-1.9,3.1c-1.2,2.3-2.3,5.2-2,6.3c0.5-0.1,6.8,9.5,6.8,9.7c0.4-0.1,2.1-0.1,3.6-0.1c2.1-0.1,3.3-0.2,5,0.2 c0-0.3-0.1-0.6-0.1-0.9c0-0.6,0.1-1.1,0.2-1.8c0.1-0.5,0.2-1,0.3-1.6c-1,0.9-2.8,1.9-4.5,2.2c-1.5,0.3-4-0.2-5.2-1.7 c0.1,0,0.3,0,0.4-0.1c0.3-0.1,0.6-0.2,0.7-0.4c0.3-0.5,0.1-1-0.1-1.3c-0.2-0.3-1.7-1.4-2.4-2c-0.7-0.6-1.1-0.9-1.5-1.3 c0,0-0.6-0.6-0.8-0.8c-0.2-0.2-0.3-0.4-0.4-0.5c-0.2-0.5-0.3-1.1-0.2-1.9c0.1-1.1,0.5-2,1-3c0.2-0.4,0.7-1.2,0.7-1.2 s-1.7,4.2-0.8,5.5c0,0,0.1-1.3,0.5-2.6c0.3-0.9,0.8-2.2,1.4-2.9s2.1-3.3,2.2-4.9c0-0.7,0.1-1.4,0.1-1.9c-0.4-0.4,6.6-1.4,7-0.3 c0.1,0.4,1.5,4,2.3,5.9c0.4,0.9,0.9,1.7,1.2,2.7c0.3,1.1,0.5,2.6,0.5,4.1c0,0.3,0,0.8-0.1,1.3c0.2,0,4.1-4.2-0.5-7.7 c0,0,2.8,1.3,2.9,3.9c0.1,2.1-0.8,3.8-1,4.1c0.1,0,2.1,0.9,2.2,0.9c0.4,0,1.2-0.3,1.2-0.3c0.1-0.3,0.4-1.1,0.4-1.4 C37.6,29.9,35.9,26.2,34.3,23.9z'/%3E%3Cg%3E%3Cellipse fill='%23ECEFF1' cx='21.6' cy='15.3' rx='1.3' ry='2'/%3E%3Cellipse fill='%23ECEFF1' cx='26.1' cy='15.2' rx='1.7' ry='2.3'/%3E%3C/g%3E%3Cg%3E%3Cellipse transform='matrix(-0.1254 -0.9921 0.9921 -0.1254 8.9754 38.9969)' fill='%23212121' cx='21.7' cy='15.5' rx='1.2' ry='0.7'/%3E%3Cellipse fill='%23212121' cx='26' cy='15.6' rx='1' ry='1.3'/%3E%3C/g%3E%3Cg%3E%3Cpath fill='%23FFC107' d='M39.3,37.6c-0.4-0.2-1.1-0.5-1.7-1.4c-0.3-0.5-0.2-1.9-0.7-2.5c-0.3-0.4-0.7-0.2-0.8-0.2 c-0.9,0.2-3,1.6-4.4,0c-0.2-0.2-0.5-0.5-1-0.5c-0.5,0-0.7,0.2-0.9,0.6s-0.2,0.7-0.2,1.7c0,0.8,0,1.7-0.1,2.4 c-0.2,1.7-0.5,2.7-0.5,3.7c0,1.1,0.3,1.8,0.7,2.1c0.3,0.3,0.8,0.5,1.9,0.5c1.1,0,1.8-0.4,2.5-1.1c0.5-0.5,0.9-0.7,2.3-1.7 c1.1-0.7,2.8-1.6,3.1-1.9c0.2-0.2,0.5-0.3,0.5-0.9C40,37.9,39.6,37.7,39.3,37.6z'/%3E%3Cpath fill='%23FFC107' d='M19.2,37.9c-1-1.6-1.1-1.9-1.8-2.9c-0.6-1-1.9-2.9-2.7-2.9c-0.6,0-0.9,0.3-1.3,0.7 c-0.4,0.4-0.8,1.3-1.5,1.8c-0.6,0.5-2.3,0.4-2.7,1c-0.4,0.6,0.4,1.5,0.4,3c0,0.6-0.5,1-0.6,1.4c-0.1,0.5-0.2,0.8,0,1.2 c0.4,0.6,0.9,0.8,4.3,1.5c1.8,0.4,3.5,1.4,4.6,1.5c1.1,0.1,3,0,3-2.7C21,39.9,20.1,39.5,19.2,37.9z'/%3E%3Cpath fill='%23FFC107' d='M21.1,19.8C20.5,19.4,20,19,20,18.4c0-0.6,0.4-0.8,1-1.3c0.1-0.1,1.2-1.1,2.3-1.1s2.4,0.7,2.9,0.9 c0.9,0.2,1.8,0.4,1.7,1.1c-0.1,1-0.2,1.2-1.2,1.7c-0.7,0.2-2,1.3-2.9,1.3c-0.4,0-1,0-1.4-0.1C22.1,20.8,21.6,20.3,21.1,19.8z'/%3E%3C/g%3E%3Cg%3E%3Cpath fill='%23634703' d='M20.9,19c0.2,0.2,0.5,0.4,0.8,0.5c0.2,0.1,0.5,0.2,0.5,0.2c0.4,0,0.7,0,0.9,0c0.5,0,1.2-0.2,1.9-0.6 c0.7-0.3,0.8-0.5,1.3-0.7c0.5-0.3,1-0.6,0.8-0.7c-0.2-0.1-0.4,0-1.1,0.4c-0.6,0.4-1.1,0.6-1.7,0.9c-0.3,0.1-0.7,0.3-1,0.3 c-0.3,0-0.6,0-0.9,0c-0.3,0-0.5-0.1-0.8-0.2c-0.2-0.1-0.3-0.2-0.4-0.2c-0.2-0.1-0.6-0.5-0.8-0.6c0,0-0.2,0-0.1,0.1 C20.6,18.7,20.7,18.8,20.9,19z'/%3E%3Cpath fill='%23634703' d='M23.9,16.8c0.1,0.2,0.3,0.2,0.4,0.3c0.1,0.1,0.2,0.1,0.2,0.1c0.1-0.1,0-0.3-0.1-0.3 C24.4,16.7,23.9,16.7,23.9,16.8z'/%3E%3Cpath fill='%23634703' d='M22.3,17c0,0.1,0.2,0.2,0.2,0.1c0.1-0.1,0.2-0.2,0.3-0.2c0.2-0.1,0.1-0.2-0.2-0.2 C22.4,16.8,22.4,16.9,22.3,17z'/%3E%3C/g%3E%3Cpath fill='%23455A64' d='M32,34.7c0,0.1,0,0.2,0,0.3c0.2,0.4,0.7,0.5,1.1,0.5c0.6,0,1.2-0.4,1.5-0.8c0-0.1,0.1-0.2,0.2-0.3 c0.2-0.3,0.3-0.5,0.4-0.6c0,0-0.1-0.1-0.1-0.2c-0.1-0.2-0.4-0.4-0.8-0.5c-0.3-0.1-0.8-0.2-1-0.2c-0.9-0.1-1.4,0.2-1.7,0.5 c0,0,0.1,0,0.1,0.1c0.2,0.2,0.3,0.4,0.3,0.7C32.1,34.4,32,34.5,32,34.7z'/%3E%3C/svg%3E%0A");
}
.osx{
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Ctitle%3Eapple-finder%3C/title%3E%3Cpath d='M8 11C7.45 11 7 10.55 7 10V8C7 7.45 7.45 7 8 7C8.55 7 9 7.45 9 8V10C9 10.55 8.55 11 8 11M17 10V8C17 7.45 16.55 7 16 7C15.45 7 15 7.45 15 8V10C15 10.55 15.45 11 16 11C16.55 11 17 10.55 17 10M22 5V20C22 21.1 21.1 22 20 22H4C2.9 22 2 21.1 2 20V5C2 3.9 2.9 3 4 3H20C21.1 3 22 3.9 22 5M4 20L13.06 20C12.96 19.35 12.89 18.64 12.83 17.94C12.56 17.96 12.3 18 12 18C8.24 18 6.31 15.73 6.23 15.63C5.88 15.21 5.94 14.58 6.36 14.22C6.78 13.87 7.41 13.93 7.77 14.35C7.83 14.43 9.23 16 12 16C12.27 16 12.5 15.97 12.74 15.95C12.71 14.75 12.73 13.74 12.74 13.26H10.93C10.28 13.26 9.75 12.7 9.75 12C9.77 11.75 10.07 7.82 11 5H4L4 20M20 20L20 5H12.6C11.74 7.19 11.37 10.73 11.27 11.76H13.08C13.72 11.76 14.25 12.32 14.25 13C14.25 13.04 14.21 14.15 14.24 15.6C15.54 15.11 16.22 14.35 16.23 14.34C16.58 13.92 17.21 13.85 17.63 14.2C18.06 14.55 18.12 15.18 17.77 15.61C17.71 15.68 16.55 17.05 14.32 17.68C14.38 18.5 14.46 19.29 14.58 20H20Z' /%3E%3C/svg%3E");
}
.mozilla-developer{
  background-image: url("data:image/svg+xml,%3C%3Fxml version='1.0' encoding='UTF-8'%3F%3E%3C!-- This Source Code Form is subject to the terms of the Mozilla Public - License, v. 2.0. If a copy of the MPL was not distributed with this - file, You can obtain one at http://mozilla.org/MPL/2.0/. --%3E%3Csvg width='77.51' height='79.99' version='1.1' viewBox='0 0 77.51 79.99' xmlns='http://www.w3.org/2000/svg'%3E%3Ctitle%3EFirefox Developer Edition logo%3C/title%3E%3Cdefs%3E%3ClinearGradient id='f' x1='84.16' x2='91.02' y1='-3.604' y2='41.14' gradientTransform='matrix(.6885 0 0 1.452 -1.253 -.004086)' gradientUnits='userSpaceOnUse'%3E%3Cstop stop-color='%23AAF2FF' offset='0'/%3E%3Cstop stop-color='%230DF' offset='.29'/%3E%3Cstop stop-color='%230090ED' offset='.61'/%3E%3Cstop stop-color='%230250BB' offset='.89'/%3E%3C/linearGradient%3E%3ClinearGradient id='g' x1='59.67' x2='65.72' y1='.008446' y2='30.05' gradientTransform='matrix(.7678 0 0 1.302 -1.253 -.004086)' gradientUnits='userSpaceOnUse'%3E%3Cstop stop-color='%23AAF2FF' offset='0'/%3E%3Cstop stop-color='%230DF' offset='.29'/%3E%3Cstop stop-color='%230090ED' offset='.74'/%3E%3Cstop stop-color='%230250BB' offset='1'/%3E%3C/linearGradient%3E%3ClinearGradient id='k' x1='68.99' x2='17.02' y1='11.82' y2='66.15' gradientTransform='matrix(.9844 0 0 1.016 -1.253 -.004086)' gradientUnits='userSpaceOnUse'%3E%3Cstop stop-color='%2380EBFF' stop-opacity='.5' offset='.24'/%3E%3Cstop stop-color='%230DF' stop-opacity='0' offset='.7'/%3E%3C/linearGradient%3E%3ClinearGradient id='l' x1='32.21' x2='25.12' y1='33.09' y2='60.57' gradientTransform='matrix(1.03 0 0 .9706 -1.253 -.004086)' gradientUnits='userSpaceOnUse'%3E%3Cstop stop-color='%23BFF3FF' stop-opacity='.9' offset='0'/%3E%3Cstop stop-color='%2380EBFF' stop-opacity='.5' offset='1'/%3E%3C/linearGradient%3E%3ClinearGradient id='m' x1='95.01' x2='93.77' y1='-.8238' y2='57.47' gradientTransform='matrix(.6427 0 0 1.556 -1.253 -.004086)' gradientUnits='userSpaceOnUse'%3E%3Cstop stop-color='%23BFF3FF' offset='0'/%3E%3Cstop stop-color='%230DF' stop-opacity='0' offset='1'/%3E%3C/linearGradient%3E%3ClinearGradient id='n' x1='56.14' x2='55.33' y1='-.6373' y2='23.11' gradientTransform='matrix(.8154 0 0 1.226 -1.253 -.004086)' gradientUnits='userSpaceOnUse'%3E%3Cstop stop-color='%23BFF3FF' offset='0'/%3E%3Cstop stop-color='%23AAF2FF' stop-opacity='.5' offset='1'/%3E%3C/linearGradient%3E%3ClinearGradient id='o' x1='58.33' x2='56.72' y1='25.31' y2='64.11' gradientTransform='matrix(.8913 0 0 1.122 -1.253 -.004086)' gradientUnits='userSpaceOnUse'%3E%3Cstop stop-color='%23BFF3FF' offset='0'/%3E%3Cstop stop-color='%230DF' stop-opacity='0' offset='1'/%3E%3C/linearGradient%3E%3ClinearGradient id='p' x1='23.73' x2='25.87' y1='33.09' y2='66.49' gradientTransform='matrix(1.063 0 0 .9412 -1.253 -.004086)' gradientUnits='userSpaceOnUse'%3E%3Cstop stop-color='%23BFF3FF' stop-opacity='.8' offset='0'/%3E%3Cstop stop-color='%2380EBFF' stop-opacity='.2' offset='1'/%3E%3C/linearGradient%3E%3ClinearGradient id='q' x1='29.19' x2='20.56' y1='12.97' y2='26.99' gradientTransform='matrix(.9798 0 0 1.021 -1.253 -.004086)' gradientUnits='userSpaceOnUse'%3E%3Cstop stop-color='%23BFF3FF' stop-opacity='.8' offset='0'/%3E%3Cstop stop-color='%2380EBFF' stop-opacity='.2' offset='1'/%3E%3C/linearGradient%3E%3ClinearGradient id='r' x1='18.5' x2='16.87' y1='29.41' y2='74.32' gradientTransform='matrix(.8 0 0 1.25 -1.253 -.004086)' gradientUnits='userSpaceOnUse'%3E%3Cstop stop-color='%230DF' stop-opacity='.4' offset='0'/%3E%3Cstop stop-color='%230DF' stop-opacity='0' offset='1'/%3E%3C/linearGradient%3E%3ClinearGradient id='s' x1='25.58' x2='25.58' y1='4.555' y2='57.37' gradientTransform='matrix(.7948 0 0 1.258 -1.253 -.004086)' gradientUnits='userSpaceOnUse'%3E%3Cstop stop-color='%23BFF3FF' offset='0'/%3E%3Cstop stop-color='%230DF' stop-opacity='0' offset='1'/%3E%3C/linearGradient%3E%3ClinearGradient id='t' x1='68.3' x2='65.11' y1='12.78' y2='89.88' gradientTransform='matrix(.8443 0 0 1.184 -1.253 -.004086)' gradientUnits='userSpaceOnUse'%3E%3Cstop stop-color='%23BFF3FF' stop-opacity='.8' offset='0'/%3E%3Cstop stop-color='%230DF' stop-opacity='0' offset='1'/%3E%3C/linearGradient%3E%3CradialGradient id='a' cx='42.07' cy='30.95' r='22.65' gradientTransform='matrix(1 0 0 .9997 -1.253 -.004086)' gradientUnits='userSpaceOnUse'%3E%3Cstop stop-color='%230DF' stop-opacity='.4' offset='.1'/%3E%3Cstop stop-color='%237542E5' stop-opacity='.25' offset='.9'/%3E%3C/radialGradient%3E%3CradialGradient id='b' cx='39.89' cy='41.4' r='19.26' fx='39.8' gradientTransform='matrix(1 0 0 .9997 -1.253 -.004086)' gradientUnits='userSpaceOnUse'%3E%3Cstop stop-color='%237542E5' stop-opacity='0' offset='.91'/%3E%3Cstop stop-color='%230DF' stop-opacity='.4' offset='1'/%3E%3C/radialGradient%3E%3CradialGradient id='c' cx='61.2' cy='9.81' r='89.4' gradientTransform='matrix(1.11 0 0 .9011 -1.253 -.004086)' gradientUnits='userSpaceOnUse'%3E%3Cstop stop-color='%2380EBFF' offset='0'/%3E%3Cstop stop-color='%230DF' offset='.26'/%3E%3Cstop stop-color='%230090ED' offset='.53'/%3E%3Cstop stop-color='%230060DF' offset='.86'/%3E%3C/radialGradient%3E%3CradialGradient id='d' cx='34.47' cy='46.83' r='89.4' fx='34.66' gradientTransform='matrix(1.11 0 0 .9011 -1.253 -.004086)' gradientUnits='userSpaceOnUse'%3E%3Cstop stop-color='%23321C64' stop-opacity='.8' offset='.3'/%3E%3Cstop stop-color='%23212F83' stop-opacity='.5' offset='.37'/%3E%3Cstop stop-color='%230A47AC' stop-opacity='.14' offset='.48'/%3E%3Cstop stop-color='%230250BB' stop-opacity='0' offset='.53'/%3E%3C/radialGradient%3E%3CradialGradient id='e' cx='61.19' cy='-19.16' r='139.7' gradientTransform='matrix(1.092 0 0 .9158 -1.253 -.004086)' gradientUnits='userSpaceOnUse'%3E%3Cstop stop-color='%2380EBFF' offset='0'/%3E%3Cstop stop-color='%2300B3F4' offset='.47'/%3E%3Cstop stop-color='%230060DF' offset='.84'/%3E%3Cstop stop-color='%23592ACB' offset='1'/%3E%3C/radialGradient%3E%3CradialGradient id='h' cx='37.3' cy='5.563' r='28.38' gradientTransform='matrix(.9988 0 0 1.001 -1.253 -.004086)' gradientUnits='userSpaceOnUse'%3E%3Cstop stop-color='%230DF' offset='0'/%3E%3Cstop stop-color='%230090ED' offset='.82'/%3E%3C/radialGradient%3E%3CradialGradient id='i' cx='52.95' cy='21.18' r='85.36' gradientTransform='matrix(1.057 0 0 .9458 -1.253 -.004086)' gradientUnits='userSpaceOnUse'%3E%3Cstop stop-color='%2380EBFF' offset='.29'/%3E%3Cstop stop-color='%2300B3F4' offset='1'/%3E%3C/radialGradient%3E%3CradialGradient id='j' cx='36.14' cy='15.88' r='71.75' gradientTransform='matrix(1.01 0 0 .9901 -1.253 -.004086)' gradientUnits='userSpaceOnUse'%3E%3Cstop stop-color='%23AAF2FF' offset='.18'/%3E%3Cstop stop-color='%230DF' offset='.43'/%3E%3Cstop stop-color='%230060DF' offset='.69'/%3E%3C/radialGradient%3E%3C/defs%3E%3Cpath d='m21.11 46.62 2.442 6.77 3.669 4.951 8.614 1.644 4.121 0.35 7.036-1.758 3.031-2.905z' style='fill:%2309204d'/%3E%3Cpath d='m57.56 36.64-0.863-2.862-2.466-4.654-2.821-2.974-2.995-2.139-2.6-1.02-3.12-1.11-5.137-0.327-3.24 0.584-2.643 0.813-4.69 2.745-2.931 3.271-2.703 4.39-1.063 3.736-0.199 5.669 1.014 3.865 2.236 4.4 1.576 2.125 2.181 2 2.723 1.842 3.358 1.461 5.619 0.659 2.935 0.082 4.342-1.223 3.882-2.131 2.497-2.131 1.937-2.31 2.738-5.36 0.604-3.667z' style='fill:%2309204d'/%3E%3Cpath d='m37.66 24.13-2.301 2.282 3.753 1.522 2.792-3.463z' style='fill:%230e56d7'/%3E%3Cpath d='m39.11 27.93 7.266-0.221-4.474-3.242z' style='fill:%231053d1'/%3E%3Cpath d='m45.84 24.44-3.934 0.024 4.474 3.242 4.137-0.27z' style='fill:%230b4fbf'/%3E%3Cpath d='m50.51 27.44-2.352-3.243 3.255 1.95z' style='fill:%230b48b0'/%3E%3Cpath d='m53.63 29.43-3.114-1.986 0.903-1.293z' style='fill:%230c45a7'/%3E%3Cpath d='m50.51 27.44-0.521 2.222 2.848 1.139z' style='fill:%230f46af'/%3E%3Cpath d='m50.51 27.44 3.114 1.986-0.787 1.375z' style='fill:%230c47ad'/%3E%3Cpath d='m46.38 27.71 4.137-0.27-0.521 2.222z' style='fill:%230e4fc3'/%3E%3Cpath d='m46.38 27.71-3.269 2.96 4.207 2.06z' style='fill:%23174dca'/%3E%3Cpath d='m39.11 27.93 7.266-0.221-3.269 2.96z' style='fill:%231650d4'/%3E%3Cpath d='m49.99 29.66 1.978 3.838 0.87-2.699z' style='fill:%231246b2'/%3E%3Cpath d='m51.97 33.5 0.87-2.699 2.073 4.93z' style='fill:%23133ea1'/%3E%3Cpath d='m52.84 30.8 3.159 2.314-1.086 2.616z' style='fill:%23103d98'/%3E%3Cpath d='m53.63 29.43 0.61-0.305 1.762 3.994z' style='fill:%230b3785'/%3E%3Cpath d='m56 33.12 0.704 0.66-2.466-4.654z' style='fill:%230b3685'/%3E%3Cpath d='m56 33.12-2.372-3.689-0.787 1.375zm-4.583-6.968 2.211 3.279 0.61-0.3z' style='fill:%230c3b91'/%3E%3Cpath d='m57.41 38.87-0.704-5.098 0.863 2.862-0.17 2.236z' style='fill:%230b3279'/%3E%3Cpath d='m56 33.12 1.408 5.758-0.704-5.098z' style='fill:%230f388d'/%3E%3Cpath d='m54.91 35.73 2.494 3.142-1.408-5.758z' style='fill:%230d3481'/%3E%3Cpath d='m57.4 38.87 0.17-2.236 0.171 5.734-0.33-3.498z' style='fill:%230b2e71'/%3E%3Cpath d='m56.99 43.41 0.748-1.034-0.33-3.498z' style='fill:%230e2f77'/%3E%3Cpath d='m57.13 46.04-0.598 0.288 1.202-3.955z' style='fill:%230e2969'/%3E%3Cpath d='m56.53 46.33 1.202-3.955-0.748 1.034z' style='fill:%230c2a69'/%3E%3Cpath d='m56.99 43.41 0.418-4.532-1.281 1.511z' style='fill:%23123180'/%3E%3Cpath d='m56.53 46.33 0.454-2.921-2.471 4.153z' style='fill:%23112b70'/%3E%3Cpath d='m54.91 35.73 2.494 3.142-1.281 1.511z' style='fill:%2312378c'/%3E%3Cpath d='m56.99 43.41-0.863-3.021-1.303 3.72z' style='fill:%23122e7b'/%3E%3Cpath d='m54.39 51.4 2.14-5.072-2.002 3.697z' style='fill:%2311296c'/%3E%3Cpath d='m54.53 50.02 2.002-3.697-2.017 1.232z' style='fill:%23142a72'/%3E%3Cpath d='m56.53 46.33-2.14 5.069 2.738-5.36zm-4.076 7.382 1.936-2.31 0.138-1.375zm-2.5 2.131 2.5-2.131-2.64 1.214z' style='fill:%23112768'/%3E%3Cpath d='m35.38 57.32-2.523 0.618 0.077-1.762z' style='fill:%231c226a'/%3E%3Cpath d='m21.36 33.35 0.696-0.258-1.759 3.994z' style='fill:%23182b7a'/%3E%3Cpath d='m20.29 37.09 1.332-0.248 0.427-3.746z' style='fill:%231f308d'/%3E%3Cpath d='m20.37 41.89-0.08-4.797 1.332-0.248z' style='fill:%231e2b7f'/%3E%3Cpath d='m49.99 29.66-2.678 3.068 4.656 0.77zm-23.37-3.146 3.418-2.339-3.051 1.518z' style='fill:%231346b5'/%3E%3Cpath d='m26.99 25.69 4.69-2.745-1.639 1.229-3.051 1.516' style='fill:%231244ac'/%3E%3Cpath d='m30.04 24.18 4.282-2.042-2.643 0.813z' style='fill:%230e4ab6'/%3E%3Cpath d='m46.38 27.71 0.938 5.02 2.678-3.068zm-13.73-3.771 3.99-1.6-2.316-0.208z' style='fill:%230e4bba'/%3E%3Cpath d='m37.56 21.55-3.24 0.584 2.316 0.208z' style='fill:%230a4ebc'/%3E%3Cpath d='m40.63 22.3-3.988 0.039 0.924-0.792' style='fill:%230c54cc'/%3E%3Cpath d='m48.16 24.2-2.325 0.247 4.677 3zm-7.533-1.891 5.193 0.684-3.12-1.11z' style='fill:%230b4bb4'/%3E%3Cpath d='m48.16 24.2-2.34-1.209 2.6 1.02z' style='fill:%230c3889'/%3E%3Cpath d='m21.11 46.62 1.539 1.263-2.27-6zm21.19 11.93 1.35-3.178-4.919 1.321zm1.35-3.178 4.112 1.141 0.249-3.18z' style='fill:%23202575'/%3E%3Cpath d='m49.82 54.92-1.81-1.582 4.373-2.906z' style='fill:%231b2773'/%3E%3Cpath d='m52.38 50.43-2.563 4.488 2.64-1.214 2.074-3.685z' style='fill:%2315276d'/%3E%3Cpath d='m48.42 24.01-0.26 0.189 3.255 1.95zm-2.585 0.436 2.325-0.247-2.34-1.209z' style='fill:%230c409d'/%3E%3Cpath d='m37.56 21.55 3.064 0.753 2.073-0.426zm8.257 1.437-5.193-0.684 5.208 2.14z' style='fill:%230b4cb7'/%3E%3Cpath d='m40.63 22.3 1.274 2.164 3.934-0.024z' style='fill:%230b55ce'/%3E%3Cpath d='m40.63 22.3 1.274 2.164-4.244-0.341z' style='fill:%230a52c5'/%3E%3Cpath d='m36.64 22.34 1.018 1.784 2.97-1.823z' style='fill:%230951c4'/%3E%3Cpath d='m32.65 23.94 3.99-1.596 1.018 1.784z' style='fill:%230b50c4'/%3E%3Cpath d='m30.04 24.18 2.608-0.238 1.674-1.8zm2.608-0.238 2.707 2.47 2.3-2.282z' style='fill:%230f4dbf'/%3E%3Cpath d='m32.65 23.94-4.407 4.133 1.799-3.895z' style='fill:%231546b6'/%3E%3Cpath d='m28.24 28.07 2.812 0.467 1.595-4.6z' style='fill:%231549bd'/%3E%3Cpath d='m31.05 28.54 1.595-4.6 2.707 2.47z' style='fill:%23144bc3'/%3E%3Cpath d='m24.06 28.96 0.171 1.662 2.393-4.11z' style='fill:%23173794'/%3E%3Cpath d='m22.05 33.1 2.007-4.132 0.171 1.662z' style='fill:%23192f84'/%3E%3Cpath d='m24.23 30.63 2.393-4.11 1.619 1.556z' style='fill:%231a389b'/%3E%3Cpath d='m24.08 34.19 0.145-3.564-2.178 2.47z' style='fill:%231d3089'/%3E%3Cpath d='m24.08 34.19 0.145-3.564 2.827 2.295z' style='fill:%231e389f'/%3E%3Cpath d='m27.06 32.92 1.185-4.849-4.012 2.554z' style='fill:%231c40af'/%3E%3Cpath d='m27.06 32.92 1.185-4.849 2.812 0.467z' style='fill:%231e41b7'/%3E%3Cpath d='m21.62 36.84 0.427-3.746 2.033 1.094z' style='fill:%23192c7d'/%3E%3Cpath d='m42.3 58.56 3.781-0.587 1.681-1.45zm-22.2-15.8 0.279-0.872-0.08-4.8zm1.531-5.917-1.252 5.045 2.27 6-1.111-6.95z' style='fill:%23162467'/%3E%3Cpath d='m22.64 47.89 1.873 0.263-1.312-3.062z' style='fill:%231a236a'/%3E%3Cpath d='m49.82 54.92-2.059 1.6-1.681 1.45 3.882-2.131zm-11.02 4.189 2.935 0.082 4.342-1.223-3.781 0.587zm-14.41-7.742 1.968 0.378-1.843-3.6z' style='fill:%23132668'/%3E%3Cpath d='m32.94 56.18-3.333-2.566-1.385 1.333 4.641 2.995zm-11.83-9.555 2.236 4.4-0.7-3.137zm-1.014-3.865 1.014 3.865-0.735-4.737zm18.63 13.94-5.79-0.521 2.446 1.144-2.523 0.618-3.037-0.946 3.358 1.461 5.619 0.659 3.5-0.554zm-14.21-8.55-1.869-0.263 1.748 3.482zm-2.981-7.215 1.112 6.952 0.561-2.8zm4.824 10.81-1.968-0.378-1.044-0.345 1.576 2.125 2.181 2 2.72 1.846-1.6-2.045z' style='fill:%231b2268'/%3E%3Cpath d='m21.62 36.84 2.643 4.089-0.183-6.741z' style='fill:%23212a81'/%3E%3Cpath d='m21.54 40.94 1.669 4.153 1.064-4.157z' style='fill:%2321267a'/%3E%3Cpath d='m23.2 45.09 1.064-4.157 1.321 3.285z' style='fill:%23262781'/%3E%3Cpath d='m24.52 48.15 5.068 3.141-3.995-7.075z' style='fill:%23272379'/%3E%3Cpath d='m23.35 51.02 1.047 0.345-1.747-3.482zm11.19 1.807-1.6 3.348 5.79 0.521zm-10.02-4.681 1.843 3.6 1.861 3.2 1.385-1.333-0.021-2.322z' style='fill:%231e226d'/%3E%3Cpath d='m48.01 53.34-0.249 3.18 2.059-1.6zm-8.861-0.457-0.421 3.817 4.921-1.321-0.175-4.291z' style='fill:%23222475'/%3E%3Cpath d='m21.54 40.94h2.733l-2.643-4.089zm21.94 10.15 0.175 4.291 4.361-2.039z' style='fill:%2323277d'/%3E%3Cpath d='m43.47 51.09 2.807-2.542 1.729 4.794z' style='fill:%231e2776'/%3E%3Cpath d='m48.01 53.34 2.122-6.427-3.851 1.633z' style='fill:%23222b86'/%3E%3Cpath d='m52.38 50.43-4.373 2.906 2.122-6.427z' style='fill:%23192974'/%3E%3Cpath d='m54.52 47.56-4.387-0.645 2.251 3.521 2.151-0.411z' style='fill:%23172a75'/%3E%3Cpath d='m54.82 44.1-4.692 2.809 4.387 0.645 2.471-4.154z' style='fill:%23172d7d'/%3E%3Cpath d='m22.05 33.1 2.007-4.132-2.7 4.39zm31.02 5.115 1.75 5.893 1.3-3.72z' style='fill:%2318338a'/%3E%3Cpath d='m56.12 40.38-1.213-4.653-1.84 2.48z' style='fill:%23153791'/%3E%3Cpath d='m50.13 46.91 4.692-2.809-4.547-2.024z' style='fill:%231b318b'/%3E%3Cpath d='m50.13 46.91-4.252-4.296 0.401 5.929z' style='fill:%23242d8d'/%3E%3Cpath d='m43.47 51.09-3.265-2.891 6.072 0.349z' style='fill:%232a2b8f'/%3E%3Cpath d='m24.52 48.15 1.073-3.934-2.385 0.872zm15.69 0.045-1.06 4.688 4.323-1.795z' style='fill:%2327267f'/%3E%3Cpath d='m33.45 49.16-3.142-1.598-0.723 3.733 4.954 1.54 4.611 0.052z' style='fill:%232d2381'/%3E%3Cpath d='m39.15 52.88 1.058-4.686-6.758 0.959z' style='fill:%232f2485'/%3E%3Cpath d='m24.27 40.93 1.355-4.328-1.538-2.413z' style='fill:%23233196'/%3E%3Cpath d='m27.06 32.92 5.95-1.734-3.143 6.421z' style='fill:%23293cb7'/%3E%3Cpath d='m50.13 46.91-4.252-4.296 4.397-0.537z' style='fill:%2325339c'/%3E%3Cpath d='m54.82 44.1-1.75-5.893-2.797 3.869z' style='fill:%2319348f'/%3E%3Cpath d='m46.28 48.55-4.863-4.702 4.462-1.227z' style='fill:%232a309a'/%3E%3Cpath d='m40.21 48.2 6.072 0.349-4.863-4.702z' style='fill:%23302b96'/%3E%3Cpath d='m40.21 48.2-3.325-2.708 4.534-1.645z' style='fill:%233630a7'/%3E%3Cpath d='m26.62 26.52 0.367-0.823-2.931 3.271zm25.35 6.984 1.1 4.711 1.84-2.48z' style='fill:%23173da2'/%3E%3Cpath d='m27.06 32.92 2.807 4.687-4.241-1.005z' style='fill:%232a36a8'/%3E%3Cpath d='m25.62 36.6 4.241 1.005-2.868 4.517z' style='fill:%23312e9f'/%3E%3Cpath d='m33.01 31.19 2.349-4.778-4.302 2.13z' style='fill:%23184dcd'/%3E%3Cpath d='m24.27 40.93 2.728 1.194-1.407 2.091z' style='fill:%23272986'/%3E%3Cpath d='m27 42.13-1.407 2.091 3.995 7.075 0.723-3.733z' style='fill:%232c2584'/%3E%3Cpath d='m30.31 47.56 0.442-6.573-3.753 1.14z' style='fill:%2332268b'/%3E%3Cpath d='m30.31 47.56 6.575-2.069-6.133-4.504z' style='fill:%23372999'/%3E%3Cpath d='m36.88 45.49-0.641-5.082-5.492 0.578z' style='fill:%23392da5'/%3E%3Cpath d='m36.24 40.41 4.638-1.734 0.537 5.171z' style='fill:%233338bc'/%3E%3Cpath d='m33.45 49.16 6.758-0.959-3.325-2.708z' style='fill:%23362896'/%3E%3Cpath d='m33.45 49.16-3.142-1.598 6.575-2.069z' style='fill:%2335268f'/%3E%3Cpath d='m33.01 31.19 4.027 0.426-1.678-5.204z' style='fill:%232648d3'/%3E%3Cpath d='m39.11 27.93-3.753-1.522 1.678 5.204z' style='fill:%231057dc'/%3E%3Cpath d='m39.11 27.93 3.997 2.739-6.072 0.943z' style='fill:%231653da'/%3E%3Cpath d='m37.03 31.61 5.956 3.159-2.111 3.901z' style='fill:%232b46d5'/%3E%3Cpath d='m42.99 34.77 0.116-4.102-6.072 0.943z' style='fill:%23244ad7'/%3E%3Cpath d='m42.99 34.77 0.116-4.102 4.207 2.06z' style='fill:%232547cf'/%3E%3Cpath d='m37.03 31.61 3.845 7.06-6.743-3.378z' style='fill:%23333cc5'/%3E%3Cpath d='m36.24 40.41 4.638-1.734-6.743-3.378z' style='fill:%233833b6'/%3E%3Cpath d='m40.88 38.67 5.947-1.087-3.836-2.814z' style='fill:%232a41c6'/%3E%3Cpath d='m47.31 32.73-0.487 4.856-3.836-2.814z' style='fill:%232045c1'/%3E%3Cpath d='m47.31 32.73 2.807 3.813-3.294 1.043z' style='fill:%231b43b7'/%3E%3Cpath d='m51.97 33.5-4.656-0.77 2.807 3.813z' style='fill:%231742af'/%3E%3Cpath d='m28.25 28.07 1.8-3.9-3.418 2.339zm23.73 5.428-1.849 3.043 2.952 1.668z' style='fill:%231740a9'/%3E%3Cpath d='m50.28 42.08 2.797-3.869-2.952-1.668z' style='fill:%231b3ca4'/%3E%3Cpath d='m50.28 42.08-0.155-5.537-3.294 1.043z' style='fill:%231f3dad'/%3E%3Cpath d='m27.06 32.92 5.95-1.734-1.953-2.648zm13.82 5.752 5 3.944 0.948-5.031z' style='fill:%232543c3'/%3E%3Cpath d='m41.42 43.84 4.462-1.227-4.999-3.944z' style='fill:%232e37b2'/%3E%3Cpath d='m33.01 31.19 1.129 4.108 2.898-3.682z' style='fill:%232d40c7'/%3E%3Cpath d='m33.01 31.19-3.143 6.421 4.272-2.313z' style='fill:%233537b8'/%3E%3Cpath d='m34.14 35.3-3.387 5.69 5.492-0.578z' style='fill:%233931b0'/%3E%3Cpath d='m36.24 40.41 0.641 5.082 4.534-1.645zm-5.494 0.578 3.387-5.69-4.272 2.313z' style='fill:%233735b8'/%3E%3Cpath d='m27 42.13 2.868-4.517 0.885 3.377z' style='fill:%23342892'/%3E%3Cpath d='m29.82 57 3.037 0.95-4.641-2.995zm-0.219-3.378 3.333 2.566 1.6-3.348-4.954-1.54zm9.123 3.087 0.421-3.817-4.611-0.052zm4.919-1.325-1.35 3.178 5.462-2.037z' style='fill:%23232372'/%3E%3Cpath d='m24.27 40.93 1.355-4.328 1.373 5.522z' style='fill:%232a2f96'/%3E%3Cpath d='m25.62 36.6 1.434-3.682-2.971 1.274zm21.2 0.983-0.948 5.031 4.4-0.537z' style='fill:%232636a5'/%3E%3Cpath d='m57.82 42.38v-8e-3l-0.174-5.734v-0.02l-0.862-2.861v-6e-3l-2.466-4.654-2.842-3.004h-6e-3l-2.994-2.137h-0.012l-2.6-1.02h-0.018l-3.12-1.11h-0.021l-5.137-0.327h-0.022l-3.24 0.585h-0.012l-2.641 0.812h-0.017l-4.69 2.728-2.93 3.269-2.7 4.389v0.011l-1.064 3.736v0.014l-0.2 5.669v0.027l1.013 3.862v0.013l2.235 4.4v7e-3l1.546 2.178v5e-3l2.18 2h6e-3l2.723 1.842h6e-3l3.358 1.46h0.021l5.619 0.659h8e-3l2.934 0.082h0.023l4.342-1.224h0.015l3.88-2.13 7e-3 -5e-3h5e-3l2.5-2.13 1.936-2.311 7e-3 -0.01 2.738-5.36v-0.021l0.6-3.665v-9e-3zm-30.67 12.71-0.565-0.518 1.27 0.995zm8.242 2.153-1.985-0.928 4.7 0.423zm0.723-16.9-5.21 0.548 3.213-5.4zm-1.818-4.863 6.366 3.189-4.379 1.634zm1.866 5.028 0.606 4.8-5.8-4.257zm0.53 4.958-6.3 1.982 0.423-6.3zm-0.35-4.878 4.881 3.241-4.276 1.552zm0.078-0.152 4.38-1.638 0.507 4.884zm6.729-5.641 4.059-1.916-0.458 4.559zm3.462 2.751-5.58 1.02 1.982-3.663zm-5.739 0.957-3.63-6.675 5.631 2.986zm-0.2-0.019-6.408-3.21 2.754-3.5zm-9.895 2.292-0.817-3.118 3.943-2.134zm-0.54 6.518-3.116-5.111 3.53-1.073zm6.359-1.619-3.168 3.384-2.9-1.474zm4.691-1.687-1.13 4.07-3.115-2.532zm-0.306-5.116 4.71 3.715-4.2 1.157zm0.094-0.142 5.641-1.03-0.9 4.771zm5.845-1.255 0.452-4.509 2.606 3.54zm3.115-0.81 0.144 5.163-3.216-4.189zm-6.959-2.021 0.108-3.832 3.931 1.925zm-0.17 0-5.61-2.976 5.719-0.888zm-8.736 0.477-1.051-3.826 3.751 0.4zm-0.137 0.143-3.981 2.151 2.928-5.981zm-3.391 5.672-3.455 1.05 2.641-4.161zm-0.625 6.323-4.316-3.056 1.287-1.911zm0.348 0.434 2.9 1.474-3.566 1.97zm6.521-2.08 3.114 2.536-6.328 0.9zm4.57-1.6 4.6 4.444-5.739-0.329zm0.122-0.118 4.218-1.16 0.379 5.606zm5.292-6.1 3.243 4.225-4.134 0.5zm3.335-1.1 2.737 1.551-2.6 3.589zm0.029-0.178 1.7-2.791 1.008 4.324zm-0.125-0.122-2.608-3.542 4.327 0.715zm-6.857-5.742 3.063-2.773 0.879 4.705zm-6.062 0.854 1.944-3.449 3.744 2.566zm-4.058-0.384 2.2-4.48 1.574 4.88zm-3.28 6.315-2.67-4.458 5.659-1.65zm-2.826 4.483-1.292-5.195 3.99 0.945zm-1.423 2.122-1.184-2.94 2.445 1.07zm4.605 3.56-0.666 3.453-3.7-6.544zm3.185 1.685 1.013 3.422-4.612-1.434zm6.7-0.983-1.005 4.448-5.409-3.538zm5.974 0.321-2.6 2.355-3.025-2.678zm-0.094-5.781 4 4.046-3.627 1.538zm0.082-0.158 4.127-0.5-0.14 4.534zm6.98-4.279 1.648 5.551-4.284-1.906zm-0.935-4.692 2.689 2.039-1.681 2.266zm-4.628-1.037 2.5-2.859 1.843 3.576zm-0.113-0.129-0.873-4.673 3.366 1.817zm-4.265-1.98-3.728-2.554 6.776-0.206zm-6.043 0.84-1.563-4.846 3.495 1.417zm-4.064-0.378-1.809-2.454 3.987-1.975zm-0.125 0.116-5.544 1.616 3.724-4.083zm-3.179 6.339-3.95-0.936 1.336-3.429zm-2.816 4.5-2.5-1.095 1.243-3.967zm-1.394 2.187-2.151 0.787 0.959-3.75zm3.869 6.878-4.732-2.933 1-3.674zm4.819 1.76-4.477 0.71-0.019-2.108zm-0.57-3.451 5.264 3.442-4.259-0.048zm6.663-1 3.055 2.706-4.046 1.68zm5.988 0.342 1.615 4.476-4.236-2.1zm0.144-0.1 3.6-1.528-1.986 6.015zm3.97-6.384 4.283 1.906-4.419 2.646zm2.867-3.786 2.8 1.993-1.2 3.413zm-0.031-0.231 1.683-2.268 1.109 4.256zm-1.124-4.724 0.774-2.425 1.861 4.428zm-0.117-0.189-1.786-3.456 2.564 1.025zm-5.277-5.5 3.729-0.244-0.47 2zm-7.383 0.065 2.625-3.257 4.208 3.049zm-0.155-0.078-1.352-3.541 3.95 0.318zm-0.176 0.016-3.453-1.4 2.117-2.1zm-7.758 0.593 1.485-4.284 2.521 2.3zm-3.983 4.247 1.087-4.451 2.581 0.429zm-1.614 3.8-1.394-2.189 2.694-1.15zm-0.074 0.2-1.192 3.8-0.16-5.926zm-1.373 4.4-0.972 3.8-1.525-3.8zm-2.536-0.166 0.081-3.729 2.409 3.726zm3.842 3.5-0.971 3.537-1.18-2.757zm3.876 6.888-2.933 0.415-1.676-3.272zm0.16 0.148 0.019 2.078-2.9-1.669zm4.891 1.552-1.489 3.102-3.094-2.382zm0.174 0.031 3.918 3.618-5.421-0.488zm0.192-0.053 4.3 0.049-0.392 3.557zm8.635-1.7 0.164 4.018-4.214-2.347zm0.171 0.015 4.25 2.11-4.086 1.91zm6.592-4.118 2.11 3.3-4.1 2.724zm0.147-0.086 4.062 0.6-1.983 2.65zm0.075-0.16 4.346-2.6-0.283 3.2zm5.74-6.2 0.767 2.685-1.925 0.622zm-1.026-4.58 2.2 2.772-1.13 1.334zm-2.06-5.049 2.859 2.094-0.983 2.367zm-2.946-1.439 0.461-1.965 2.058 2.972zm-3.643-1.986-0.5-3 4.3 2.754zm-0.189-0.1-4.1-2.969 3.6-0.023zm-8.335-3.458 2.675-1.642 1.149 1.95zm-2.569 2.232-2.477-2.26 4.581 0.172zm-4.357 2.149-2.572-0.428 4.031-3.78zm-3.99 4.327-2.632-2.137 3.735-2.378zm-0.112 0.128-2.719 1.16 0.132-3.261zm-2.72 7.732-2.443-3.779 2.274-2.452zm-1.059 4.464-0.463 2.312-0.915-5.741zm0.118 0.276 1.145 2.673-1.632-0.228zm2.97 6.259-1.726-0.335 0.11-2.822zm3.261 2-1.226 1.179-1.647-2.831zm0.146 0.094 2.945 2.271-4.169-1.09zm9.608-0.706 4.2 2.332-4.6 1.235zm8.693 0.459-0.23 2.933-3.791-1.053zm4.218-2.775-2.334 4.093-1.649-1.446zm2.3-2.89 0.012 2.14-1.867 0.357zm0.468-3.645 1.9-0.614-2.164 3.642zm1.317-3.764 1.078-1.271-0.346 3.813zm-1.209-4.686 0.968-2.331 1.254 5.129zm-2.059-4.94 0.68-1.187 2.049 3.186zm-0.118-0.135-2.012-2.9 2.692 1.716zm-6.749-6.139 2.036-0.217 2.06 2.841zm-4.135-0.12-1.121-1.905 4.584 1.884zm-4.262-0.374-0.9-1.582 3.538-0.036zm-0.18 0.027-4.456-0.167 3.551-1.419zm-9 3.676 1.6-3.455 2.314-0.211zm-0.287 0.216-1.458-1.4 3.078-2.106zm-0.109 0.13-3.627 2.309 2.167-3.715zm-4.1 5.993-1.82-0.979 1.95-2.211zm-0.057 0.161-2.212 2.383 0.384-3.365zm-2.503 6.683-0.935 0.764 1.007-4.055zm0.023 0.2 0.954 5.986-1.955-5.166zm2.954 7.129-0.109 2.813-1.524-3.042zm1.877 3.6 1.556 2.671-3.194-2.984zm6.546 4.42-0.067 1.545-4.072-2.627zm0.167 0.066 2.114 0.988-2.18 0.533zm5.629 0.492 0.066 2.167-3.071-1.607zm4.855-1.3-1.246 2.933-3.294-1.713zm0.2-0.026 3.789 1.052-5.032 1.877zm4.384-1.965 1.605 1.4-1.829 1.424zm4.356-3.005 1.85-0.354-4.056 4.216zm2.179-0.818-0.013-2.087 1.707-1.043zm0.15-2.385 2.07-3.478-0.381 2.449zm2.642-7.52 0.242 2.56-0.548 0.757zm-1.262-6.411 0.473 0.444 0.474 3.43zm-2.4-3.912 0.445-0.224 1.288 2.919zm-3.117-2.044 0.782-1.119 1.914 2.839zm-0.122-0.122-2.038-2.812 2.822 1.691zm-4.591-2.944-0.013-1.222 1.964 1.014zm-0.17-0.033-4.489-1.844 4.476 0.589zm-8.879-2.061 0.715-0.613 2.369 0.583zm-3.9 1.464 1.389-1.5 1.922 0.173zm-0.359 0.138-2.1 0.191 3.455-1.646zm-5.786 2.418 0.232-0.521 1.931-0.959zm-2.535 4.082-0.141-1.363 2.1-2zm-0.146 0.24-1.742 1.975 1.605-3.3zm-2.595 6.172-1.112 0.207 1.469-3.335zm-0.037 0.18-1.063 4.285-0.068-4.075zm0.937 10.67-1.264-1.04-0.606-3.9zm1.772 3.6-0.807-0.265-0.54-2.419zm3.451 3.328-2.678-1.452-0.431-1.448zm0.49 0.46 1.161 1.48-3.55-2.781zm0.434 0.279 3.693 2.383-2.417-0.756zm6.775 2.122 2.87 1.5-4.989-0.983zm3.445-0.571 3.212 1.671-3.147 0.5zm8.528-0.078-1.3 1.126-2.935 0.455zm2.41-1.686 0.109 0.7-1.686 0.521zm4.375-4.516-1.73 3.086-2.207 1.015zm0.484-0.514 1.161-2.145-1.241 2.943zm2.454-6.61 0.438-0.606-0.7 2.318zm0.422-4.572-6e-3 -0.045 0.044-0.574 0.044 1.487zm-0.117-0.845-0.438-3.178 0.543 1.8zm-1.3-4.956-0.8-1.815 1.12 2.115zm-2.414-3.748-1.6-2.371 2.04 2.15zm-5.342-5.117 0.107-0.077 1.226 0.877zm-0.162-0.093-0.831-0.429 0.924 0.363zm-7.016-1.817 1.558-0.32 2.344 0.834zm-0.508-0.068-2.121-0.522 3.556 0.226zm-4.018 0.039-1.654-0.149 2.315-0.418zm-5.837 1.478 0.946-0.709 1.526-0.47zm-0.777 0.37-0.821 0.408 1.262-0.738zm-3.444 2.362-0.974 0.93 1.113-1.242zm-4.562 6.563-0.433 0.16 1.683-2.733zm-0.564 0.389 0.467-0.173-1.181 2.683zm-1.163 6.963 0.024 1.493-0.086 0.272zm0.081 1.875 0.426 2.745-0.587-2.24zm2.223 5.678 0.547 2.45-1.747-3.437zm1.755 3.5 0.38 1.278-1.131-1.525zm8.484 6.577 0.158 0.253-1.66-0.722zm0.426 0.36-0.2-0.31 3.611 0.711zm8.846 0.3-0.38 0.43-1.982-0.055zm0.263-0.041 2.363-0.367-2.714 0.764zm5.46-2.041 1.386-0.428-2.44 1.347zm2.22-0.919-0.109-0.7 2.025-0.931zm4.386-5.258-0.095 0.945-1.332 1.589zm2.193-4.03 0.342-0.165-1.567 3.078zm0.455-0.408-0.384 0.186 0.772-2.54z' style='fill:url(%23a)'/%3E%3Cpath d='m57.82 42.38v-8e-3l-0.174-5.734v-0.02l-0.862-2.861v-6e-3l-2.466-4.654-2.842-3.004h-6e-3l-2.994-2.137h-0.012l-2.6-1.02h-0.018l-3.12-1.11h-0.021l-5.137-0.327h-0.022l-3.24 0.585h-0.012l-2.641 0.812h-0.017l-4.69 2.728-2.93 3.269-2.7 4.389v0.011l-1.064 3.736v0.014l-0.2 5.669v0.027l1.013 3.862v0.013l2.235 4.4v7e-3l1.546 2.178v5e-3l2.18 2h6e-3l2.723 1.842h6e-3l3.358 1.46h0.021l5.619 0.659h8e-3l2.934 0.082h0.023l4.342-1.224h0.015l3.88-2.13 7e-3 -5e-3h5e-3l2.5-2.13 1.936-2.311 7e-3 -0.01 2.738-5.36v-0.021l0.6-3.665v-9e-3zm-30.67 12.71-0.565-0.518 1.27 0.995zm8.242 2.153-1.985-0.928 4.7 0.423zm0.723-16.9-5.21 0.548 3.213-5.4zm-1.818-4.863 6.366 3.189-4.379 1.634zm1.866 5.028 0.606 4.8-5.8-4.257zm0.53 4.958-6.3 1.982 0.423-6.3zm-0.35-4.878 4.881 3.241-4.276 1.552zm0.078-0.152 4.38-1.638 0.507 4.884zm6.729-5.641 4.059-1.916-0.458 4.559zm3.462 2.751-5.58 1.02 1.982-3.663zm-5.739 0.957-3.63-6.675 5.631 2.986zm-0.2-0.019-6.408-3.21 2.754-3.5zm-9.895 2.292-0.817-3.118 3.943-2.134zm-0.54 6.518-3.116-5.111 3.53-1.073zm6.359-1.619-3.168 3.384-2.9-1.474zm4.691-1.687-1.13 4.07-3.115-2.532zm-0.306-5.116 4.71 3.715-4.2 1.157zm0.094-0.142 5.641-1.03-0.9 4.771zm5.845-1.255 0.452-4.509 2.606 3.54zm3.115-0.81 0.144 5.163-3.216-4.189zm-6.959-2.021 0.108-3.832 3.931 1.925zm-0.17 0-5.61-2.976 5.719-0.888zm-8.736 0.477-1.051-3.826 3.751 0.4zm-0.137 0.143-3.981 2.151 2.928-5.981zm-3.391 5.672-3.455 1.05 2.641-4.161zm-0.625 6.323-4.316-3.056 1.287-1.911zm0.348 0.434 2.9 1.474-3.566 1.97zm6.521-2.08 3.114 2.536-6.328 0.9zm4.57-1.6 4.6 4.444-5.739-0.329zm0.122-0.118 4.218-1.16 0.379 5.606zm5.292-6.1 3.243 4.225-4.134 0.5zm3.335-1.1 2.737 1.551-2.6 3.589zm0.029-0.178 1.7-2.791 1.008 4.324zm-0.125-0.122-2.608-3.542 4.327 0.715zm-6.857-5.742 3.063-2.773 0.879 4.705zm-6.062 0.854 1.944-3.449 3.744 2.566zm-4.058-0.384 2.2-4.48 1.574 4.88zm-3.28 6.315-2.67-4.458 5.659-1.65zm-2.826 4.483-1.292-5.195 3.99 0.945zm-1.423 2.122-1.184-2.94 2.445 1.07zm4.605 3.56-0.666 3.453-3.7-6.544zm3.185 1.685 1.013 3.422-4.612-1.434zm6.7-0.983-1.005 4.448-5.409-3.538zm5.974 0.321-2.6 2.355-3.025-2.678zm-0.094-5.781 4 4.046-3.627 1.538zm0.082-0.158 4.127-0.5-0.14 4.534zm6.98-4.279 1.648 5.551-4.284-1.906zm-0.935-4.692 2.689 2.039-1.681 2.266zm-4.628-1.037 2.5-2.859 1.843 3.576zm-0.113-0.129-0.873-4.673 3.366 1.817zm-4.265-1.98-3.728-2.554 6.776-0.206zm-6.043 0.84-1.563-4.846 3.495 1.417zm-4.064-0.378-1.809-2.454 3.987-1.975zm-0.125 0.116-5.544 1.616 3.724-4.083zm-3.179 6.339-3.95-0.936 1.336-3.429zm-2.816 4.5-2.5-1.095 1.243-3.967zm-1.394 2.187-2.151 0.787 0.959-3.75zm3.869 6.878-4.732-2.933 1-3.674zm4.819 1.76-4.477 0.71-0.019-2.108zm-0.57-3.451 5.264 3.442-4.259-0.048zm6.663-1 3.055 2.706-4.046 1.68zm5.988 0.342 1.615 4.476-4.236-2.1zm0.144-0.1 3.6-1.528-1.986 6.015zm3.97-6.384 4.283 1.906-4.419 2.646zm2.867-3.786 2.8 1.993-1.2 3.413zm-0.031-0.231 1.683-2.268 1.109 4.256zm-1.124-4.724 0.774-2.425 1.861 4.428zm-0.117-0.189-1.786-3.456 2.564 1.025zm-5.277-5.5 3.729-0.244-0.47 2zm-7.383 0.065 2.625-3.257 4.208 3.049zm-0.155-0.078-1.352-3.541 3.95 0.318zm-0.176 0.016-3.453-1.4 2.117-2.1zm-7.758 0.593 1.485-4.284 2.521 2.3zm-3.983 4.247 1.087-4.451 2.581 0.429zm-1.614 3.8-1.394-2.189 2.694-1.15zm-0.074 0.2-1.192 3.8-0.16-5.926zm-1.373 4.4-0.972 3.8-1.525-3.8zm-2.536-0.166 0.081-3.729 2.409 3.726zm3.842 3.5-0.971 3.537-1.18-2.757zm3.876 6.888-2.933 0.415-1.676-3.272zm0.16 0.148 0.019 2.078-2.9-1.669zm4.891 1.552-1.489 3.102-3.094-2.382zm0.174 0.031 3.918 3.618-5.421-0.488zm0.192-0.053 4.3 0.049-0.392 3.557zm8.635-1.7 0.164 4.018-4.214-2.347zm0.171 0.015 4.25 2.11-4.086 1.91zm6.592-4.118 2.11 3.3-4.1 2.724zm0.147-0.086 4.062 0.6-1.983 2.65zm0.075-0.16 4.346-2.6-0.283 3.2zm5.74-6.2 0.767 2.685-1.925 0.622zm-1.026-4.58 2.2 2.772-1.13 1.334zm-2.06-5.049 2.859 2.094-0.983 2.367zm-2.946-1.439 0.461-1.965 2.058 2.972zm-3.643-1.986-0.5-3 4.3 2.754zm-0.189-0.1-4.1-2.969 3.6-0.023zm-8.335-3.458 2.675-1.642 1.149 1.95zm-2.569 2.232-2.477-2.26 4.581 0.172zm-4.357 2.149-2.572-0.428 4.031-3.78zm-3.99 4.327-2.632-2.137 3.735-2.378zm-0.112 0.128-2.719 1.16 0.132-3.261zm-2.72 7.732-2.443-3.779 2.274-2.452zm-1.059 4.464-0.463 2.312-0.915-5.741zm0.118 0.276 1.145 2.673-1.632-0.228zm2.97 6.259-1.726-0.335 0.11-2.822zm3.261 2-1.226 1.179-1.647-2.831zm0.146 0.094 2.945 2.271-4.169-1.09zm9.608-0.706 4.2 2.332-4.6 1.235zm8.693 0.459-0.23 2.933-3.791-1.053zm4.218-2.775-2.334 4.093-1.649-1.446zm2.3-2.89 0.012 2.14-1.867 0.357zm0.468-3.645 1.9-0.614-2.164 3.642zm1.317-3.764 1.078-1.271-0.346 3.813zm-1.209-4.686 0.968-2.331 1.254 5.129zm-2.059-4.94 0.68-1.187 2.049 3.186zm-0.118-0.135-2.012-2.9 2.692 1.716zm-6.749-6.139 2.036-0.217 2.06 2.841zm-4.135-0.12-1.121-1.905 4.584 1.884zm-4.262-0.374-0.9-1.582 3.538-0.036zm-0.18 0.027-4.456-0.167 3.551-1.419zm-9 3.676 1.6-3.455 2.314-0.211zm-0.287 0.216-1.458-1.4 3.078-2.106zm-0.109 0.13-3.627 2.309 2.167-3.715zm-4.1 5.993-1.82-0.979 1.95-2.211zm-0.057 0.161-2.212 2.383 0.384-3.365zm-2.503 6.683-0.935 0.764 1.007-4.055zm0.023 0.2 0.954 5.986-1.955-5.166zm2.954 7.129-0.109 2.813-1.524-3.042zm1.877 3.6 1.556 2.671-3.194-2.984zm6.546 4.42-0.067 1.545-4.072-2.627zm0.167 0.066 2.114 0.988-2.18 0.533zm5.629 0.492 0.066 2.167-3.071-1.607zm4.855-1.3-1.246 2.933-3.294-1.713zm0.2-0.026 3.789 1.052-5.032 1.877zm4.384-1.965 1.605 1.4-1.829 1.424zm4.356-3.005 1.85-0.354-4.056 4.216zm2.179-0.818-0.013-2.087 1.707-1.043zm0.15-2.385 2.07-3.478-0.381 2.449zm2.642-7.52 0.242 2.56-0.548 0.757zm-1.262-6.411 0.473 0.444 0.474 3.43zm-2.4-3.912 0.445-0.224 1.288 2.919zm-3.117-2.044 0.782-1.119 1.914 2.839zm-0.122-0.122-2.038-2.812 2.822 1.691zm-4.591-2.944-0.013-1.222 1.964 1.014zm-0.17-0.033-4.489-1.844 4.476 0.589zm-8.879-2.061 0.715-0.613 2.369 0.583zm-3.9 1.464 1.389-1.5 1.922 0.173zm-0.359 0.138-2.1 0.191 3.455-1.646zm-5.786 2.418 0.232-0.521 1.931-0.959zm-2.535 4.082-0.141-1.363 2.1-2zm-0.146 0.24-1.742 1.975 1.605-3.3zm-2.595 6.172-1.112 0.207 1.469-3.335zm-0.037 0.18-1.063 4.285-0.068-4.075zm0.937 10.67-1.264-1.04-0.606-3.9zm1.772 3.6-0.807-0.265-0.54-2.419zm3.451 3.328-2.678-1.452-0.431-1.448zm0.49 0.46 1.161 1.48-3.55-2.781zm0.434 0.279 3.693 2.383-2.417-0.756zm6.775 2.122 2.87 1.5-4.989-0.983zm3.445-0.571 3.212 1.671-3.147 0.5zm8.528-0.078-1.3 1.126-2.935 0.455zm2.41-1.686 0.109 0.7-1.686 0.521zm4.375-4.516-1.73 3.086-2.207 1.015zm0.484-0.514 1.161-2.145-1.241 2.943zm2.454-6.61 0.438-0.606-0.7 2.318zm0.422-4.572-6e-3 -0.045 0.044-0.574 0.044 1.487zm-0.117-0.845-0.438-3.178 0.543 1.8zm-1.3-4.956-0.8-1.815 1.12 2.115zm-2.414-3.748-1.6-2.371 2.04 2.15zm-5.342-5.117 0.107-0.077 1.226 0.877zm-0.162-0.093-0.831-0.429 0.924 0.363zm-7.016-1.817 1.558-0.32 2.344 0.834zm-0.508-0.068-2.121-0.522 3.556 0.226zm-4.018 0.039-1.654-0.149 2.315-0.418zm-5.837 1.478 0.946-0.709 1.526-0.47zm-0.777 0.37-0.821 0.408 1.262-0.738zm-3.444 2.362-0.974 0.93 1.113-1.242zm-4.562 6.563-0.433 0.16 1.683-2.733zm-0.564 0.389 0.467-0.173-1.181 2.683zm-1.163 6.963 0.024 1.493-0.086 0.272zm0.081 1.875 0.426 2.745-0.587-2.24zm2.223 5.678 0.547 2.45-1.747-3.437zm1.755 3.5 0.38 1.278-1.131-1.525zm8.484 6.577 0.158 0.253-1.66-0.722zm0.426 0.36-0.2-0.31 3.611 0.711zm8.846 0.3-0.38 0.43-1.982-0.055zm0.263-0.041 2.363-0.367-2.714 0.764zm5.46-2.041 1.386-0.428-2.44 1.347zm2.22-0.919-0.109-0.7 2.025-0.931zm4.386-5.258-0.095 0.945-1.332 1.589zm2.193-4.03 0.342-0.165-1.567 3.078zm0.455-0.408-0.384 0.186 0.772-2.54z' style='fill:url(%23b)'/%3E%3Cpath d='m74.71 26.83c-1.686-4.052-5.1-8.427-7.784-9.809a40.16 40.16 0 0 1 3.925 11.76c0-9e-3 0 8e-3 6e-3 0.037l7e-3 0.041a35.05 35.05 0 0 1-1.208 26.16c-4.446 9.532-15.21 19.3-32.06 18.82-18.2-0.515-34.24-14.01-37.23-31.68-0.545-2.787 0-4.2 0.274-6.465a28.87 28.87 0 0 0-0.628 5.347v0.2a38.81 38.81 0 0 0 77.04 6.554c0.065-0.5 0.118-0.995 0.176-1.495a39.8 39.8 0 0 0-2.517-19.47z' style='fill:url(%23c)'/%3E%3Cpath d='m74.71 26.83c-1.686-4.052-5.1-8.427-7.784-9.809a40.16 40.16 0 0 1 3.925 11.76c0-9e-3 0 8e-3 6e-3 0.037l7e-3 0.041a35.05 35.05 0 0 1-1.208 26.16c-4.446 9.532-15.21 19.3-32.06 18.82-18.2-0.515-34.24-14.01-37.23-31.68-0.545-2.787 0-4.2 0.274-6.465a28.87 28.87 0 0 0-0.628 5.347v0.2a38.81 38.81 0 0 0 77.04 6.554c0.065-0.5 0.118-0.995 0.176-1.495a39.8 39.8 0 0 0-2.517-19.47z' style='fill:url(%23d)'/%3E%3Cpath d='m0.358 42.16c2.994 17.67 19.03 31.17 37.24 31.68 16.85 0.476 27.62-9.293 32.06-18.82a35.05 35.05 0 0 0 1.208-26.16v-0.037c0-0.029-6e-3 -0.046-6e-3 -0.037l8e-3 0.065c1.376 8.977-3.195 17.67-10.34 23.56l-0.022 0.05c-13.93 11.32-27.26 6.829-29.96 4.991a24.76 24.76 0 0 1-0.565-0.282c-8.118-3.875-11.47-11.26-10.75-17.6a9.964 9.964 0 0 1-9.192-5.776 14.65 14.65 0 0 1 14.27-0.571 19.34 19.34 0 0 0 14.57 0.572c-0.014-0.315-6.767-3-9.4-5.59-1.407-1.385-2.075-2.052-2.666-2.553a11.76 11.76 0 0 0-1-0.758c-0.231-0.157-0.49-0.327-0.8-0.531-2.83-1.838-8.458-1.736-8.644-1.732h-0.018c-1.539-1.947-1.43-8.367-1.342-9.707a6.954 6.954 0 0 0-1.3 0.686 28.28 28.28 0 0 0-3.792 3.245 34 34 0 0 0-3.627 4.346v6e-3 -6e-3a32.69 32.69 0 0 0-5.207 11.74c-0.018 0.084-1.396 6.104-0.717 9.226z' style='fill:url(%23e)'/%3E%3Cpath d='m52.49 26.87a21.06 21.06 0 0 1 3.6 4.7 7.876 7.876 0 0 1 0.583 0.476c8.8 8.1 4.187 19.55 3.844 20.36 7.146-5.881 11.72-14.58 10.34-23.56-4.388-10.92-11.83-15.33-17.9-24.92a47.89 47.89 0 0 1-0.914-1.485 11.75 11.75 0 0 1-0.427-0.8 7.032 7.032 0 0 1-0.58-1.539 0.1 0.1 0 0 0-0.088-0.1 0.129 0.129 0 0 0-0.073 0l-0.019 0.01-0.029 0.012c-1.5 0.715-10.4 14.79 1.662 26.84z' style='fill:url(%23f)'/%3E%3Cpath d='m37.56 21.55 5.137 0.327 3.12 1.11 2.6 1.02 2.995 2.139 2.821 2.974 0.98 1.849a23.46 23.46 0 0 1 0.634 0.413c0.085 0.059 0.162 0.118 0.241 0.177a21.06 21.06 0 0 0-3.6-4.695c-12.06-12.05-3.164-26.12-1.664-26.84l0.02-0.022c-9.747 5.7-13.05 16.25-13.36 21.53v0.03z' style='fill:url(%23g)'/%3E%3Cpath d='m25 24.36a22.82 22.82 0 0 1 0.8 0.531 17.93 17.93 0 0 1-0.109-9.472 28.74 28.74 0 0 0-9.34 7.209c0.191-4e-3 5.819-0.106 8.649 1.732z' style='fill:url(%23h)'/%3E%3Cpath d='m21.38 44.75s1.791-6.667 12.82-6.667c1.193 0 4.6-3.325 4.666-4.289a19.34 19.34 0 0 1-14.57-0.572 14.65 14.65 0 0 0-14.27 0.571 9.964 9.964 0 0 0 9.192 5.776c-0.719 6.336 2.635 13.72 10.75 17.6 0.182 0.087 0.352 0.182 0.538 0.265-4.738-2.447-8.651-7.07-9.14-12.68z' style='fill:url(%23i)'/%3E%3Cpath d='m56.67 32.04a7.876 7.876 0 0 0-0.583-0.476c-0.079-0.059-0.156-0.118-0.241-0.177a13.41 13.41 0 0 0-9.356-2.269c13.96 6.97 10.21 30.97-9.129 30.06a17.24 17.24 0 0 1-5.049-0.973 22.74 22.74 0 0 1-1.14-0.465c-0.218-0.1-0.437-0.2-0.654-0.312l0.027 0.017c2.7 1.838 16.02 6.331 29.95-4.995l0.022-0.05c0.343-0.816 4.952-12.27-3.844-20.36z' style='fill:url(%23j)'/%3E%3Cpath d='m74.7 26.83c-1.686-4.053-5.1-8.427-7.784-9.81a40.19 40.19 0 0 1 3.928 11.76l8e-3 0.064c-4.387-10.92-11.83-15.33-17.9-24.92a45.31 45.31 0 0 1-0.914-1.484 12.8 12.8 0 0 1-0.428-0.8 7.053 7.053 0 0 1-0.578-1.535 0.1 0.1 0 0 0-0.088-0.1 0.138 0.138 0 0 0-0.073 0c-6e-3 0-0.014 9e-3 -0.02 0.011s-0.019 0.011-0.028 0.015l0.016-0.022c-9.747 5.7-13.05 16.28-13.36 21.56l0.079-0.014 5.137 0.327 2.891 1.028 2.829 1.1 2.995 2.139 2.818 2.972s0.97 1.82 0.983 1.851a13.28 13.28 0 0 0-8.725-1.858c13.96 6.97 10.21 30.97-9.129 30.06a17.27 17.27 0 0 1-5.049-0.972q-0.566-0.212-1.14-0.468a14.44 14.44 0 0 1-0.654-0.312l0.027 0.017a22.82 22.82 0 0 1-0.565-0.281c0.181 0.086 0.352 0.181 0.538 0.264-4.738-2.446-8.651-7.07-9.14-12.68 0 0 1.791-6.667 12.82-6.667 1.193 0 4.6-3.325 4.666-4.289-0.014-0.315-6.768-3-9.4-5.59-1.407-1.384-2.075-2.052-2.667-2.553a11.4 11.4 0 0 0-1.005-0.757 17.94 17.94 0 0 1-0.109-9.473 28.74 28.74 0 0 0-9.34 7.21h-0.018c-1.538-1.946-1.429-8.366-1.342-9.707a7.042 7.042 0 0 0-1.3 0.686 28.22 28.22 0 0 0-3.792 3.246 33.91 33.91 0 0 0-3.624 4.34 32.71 32.71 0 0 0-5.201 11.74c-0.019 0.084-0.034 0.171-0.052 0.255-0.073 0.342-0.4 2.073-0.448 2.445v0a45.09 45.09 0 0 0-0.572 5.408v0.2a38.81 38.81 0 0 0 77.05 6.555c0.066-0.5 0.119-1 0.177-1.5a39.81 39.81 0 0 0-2.521-19.47zm-3.849 1.99 6e-3 0.042z' style='fill:url(%23k)'/%3E%3Cpath d='m38.87 33.79s-0.164 0.068-0.468 0.172c-0.758 1.281-3.453 3.727-4.483 3.722-11.03-0.048-12.85 6.546-12.85 6.546a14.09 14.09 0 0 0 2.162 6.333 14.19 14.19 0 0 1-1.848-5.817s1.791-6.667 12.82-6.667c1.193 0 4.6-3.325 4.666-4.289z' style='fill:url(%23l)'/%3E%3Cpath d='m70.86 28.86v-0.037c0-0.029-6e-3 -0.046 0-0.037s0 0.022 7e-3 0.065a38.74 38.74 0 0 0-0.834-1.92c-0.1-0.212-0.2-0.41-0.305-0.617-0.195-0.4-0.388-0.8-0.59-1.176-0.125-0.235-0.256-0.458-0.384-0.686-0.188-0.335-0.374-0.672-0.567-1-0.142-0.236-0.288-0.462-0.432-0.692-0.189-0.3-0.377-0.6-0.57-0.892-0.153-0.231-0.31-0.454-0.465-0.679-0.193-0.278-0.385-0.556-0.582-0.827-0.162-0.224-0.327-0.443-0.492-0.662-0.2-0.261-0.393-0.522-0.592-0.778a67.04 67.04 0 0 0-0.516-0.651c-0.2-0.249-0.4-0.5-0.605-0.745q-0.265-0.321-0.533-0.639c-0.1-0.115-0.193-0.233-0.291-0.348l0.124 0.152c-3.374-3.966-7.023-7.621-10.28-12.77a47.16 47.16 0 0 1-0.914-1.485 11.75 11.75 0 0 1-0.427-0.8 7.949 7.949 0 0 1-0.534-1.362c-7e-3 -0.025-0.019-0.063-0.023-0.083a4.52 4.52 0 0 1-0.022-0.09 0.1 0.1 0 0 0-0.088-0.1 0.129 0.129 0 0 0-0.073 0l-0.019 0.011a0.27 0.27 0 0 0-0.029 0.015 1.138 1.138 0 0 0-0.235 0.173 1.26 1.26 0 0 0-0.056 0.05 3.722 3.722 0 0 0-0.307 0.325l-0.011 0.011c-2.321 2.728-8.258 14.61 1.309 25.26-8.957-10.54-3.312-21.93-0.859-24.91a8.61 8.61 0 0 0 0.479 1.172 11.49 11.49 0 0 0 0.427 0.8c0.3 0.513 0.607 1 0.914 1.484 6.076 9.592 13.52 14 17.9 24.92 0-0.042-7e-3 -0.058-7e-3 -0.064s0 8e-3 5e-3 0.037l6e-3 0.037a35.05 35.05 0 0 1-1.204 26.16 32.15 32.15 0 0 1-6.164 8.838 32.21 32.21 0 0 0 6.632-9.307 35.06 35.06 0 0 0 1.208-26.16z' style='fill:url(%23m)'/%3E%3Cpath d='m50.83 0.02891 0.02-0.022c-8.78 5.137-12.33 14.21-13.17 19.81a28.67 28.67 0 0 1 11.72-18.09 5.436 5.436 0 0 1 1.433-1.702z' style='fill:url(%23n)'/%3E%3Cpath d='m60.5 52.45 0.022-0.05c0.343-0.816 4.952-12.27-3.844-20.36a7.876 7.876 0 0 0-0.583-0.476c-0.079-0.059-0.156-0.118-0.241-0.177a13.54 13.54 0 0 0-9-2.325h-3e-3a8.612 8.612 0 0 0-0.353 0.055c13.8 6.892 10.29 30.43-8.481 30.08l0.153 9e-3c19.03 0.748 22.78-22.59 9.558-29.91a14.05 14.05 0 0 1 7.349 2.122 8.183 8.183 0 0 1 0.247 0.169 7.4 7.4 0 0 1 0.6 0.452c9.107 7.747 4.95 19.37 4.638 20.2l-0.02 0.052' style='fill:url(%23o)'/%3E%3Cpath d='m24.41 33.61a19.38 19.38 0 0 0 14.03 0.345 19.39 19.39 0 0 1-14.13-0.733 14.74 14.74 0 0 0-14.08 0.45l-0.051 0.033h-5e-3l-0.042 0.028-0.032 0.022-0.02 0.014h-6e-3l-0.014 0.01h-5e-3l0.018 0.043v6e-3l0.022 0.05v0.01l0.033 0.072v6e-3a8 8 0 0 0 0.255 0.487 9.925 9.925 0 0 0 8.852 5.1c-0.7 6.146 2.438 13.28 10.04 17.24-7.262-4.185-10.31-11.78-9.465-17.82-5.607-0.148-8.114-3.509-8.831-4.934a15.33 15.33 0 0 1 13.44-0.43z' style='fill:url(%23p)'/%3E%3Cpath d='m25.8 24.87-0.19-0.111 0.2 0.132zm-0.04-0.142a17.96 17.96 0 0 1-0.063-9.309 28.28 28.28 0 0 0-8.98 6.811 29.29 29.29 0 0 1 8.189-5.784 18.18 18.18 0 0 0 0.854 8.282z' style='fill:url(%23q)'/%3E%3Cpath d='m1.294 46.22-0.031-0.111a35.89 35.89 0 0 1-0.9-3.951 16.76 16.76 0 0 1 0-5 32.99 32.99 0 0 0-0.355 3.88v0.2a38.77 38.77 0 0 0 26.04 36.61 39.22 39.22 0 0 1-24.75-31.63z' style='fill:url(%23r)'/%3E%3Cpath d='m0.983 42.32c-0.679-3.122 0.7-9.141 0.717-9.226a32.69 32.69 0 0 1 5.207-11.74v6e-3 -6e-3a34 34 0 0 1 3.623-4.341 28.28 28.28 0 0 1 3.792-3.245 3.338 3.338 0 0 1 0.164-0.1c-0.014 2.948 0.154 7.923 1.519 9.554h0.018c0.187-0.01 5.835-0.259 8.724 1.5 0.321 0.2 0.585 0.359 0.821 0.51a11.93 11.93 0 0 1 1.029 0.731c0.606 0.486 1.294 1.135 2.743 2.482 2.1 1.951 6.669 3.891 8.644 4.815-1.924-0.969-6.464-3.04-8.511-5.055-1.407-1.385-2.075-2.052-2.666-2.553a11.76 11.76 0 0 0-1-0.758c-0.231-0.157-0.49-0.327-0.8-0.531-2.83-1.838-8.458-1.736-8.644-1.732h-0.018c-1.406-1.779-1.436-7.293-1.364-9.252 0-0.076 0-0.145 8e-3 -0.21v-0.127c0-0.042 0-0.083 7e-3 -0.118 0 0-7e-3 -7e-3 -0.016-7e-3h-0.035l-0.022 8e-3 -0.032 0.012-0.031 0.013-0.037 0.017-0.04 0.019-0.04 0.02-0.049 0.024-0.039 0.021-0.058 0.03-0.033 0.018a19.29 19.29 0 0 0-0.864 0.5 28.28 28.28 0 0 0-3.792 3.245 34 34 0 0 0-3.626 4.358v6e-3 -6e-3a32.69 32.69 0 0 0-5.207 11.74c-0.018 0.084-1.4 6.1-0.717 9.226 2.548 15.04 14.54 27.05 29.28 30.61-14.45-3.747-26.14-15.63-28.66-30.46z' style='fill:url(%23s)'/%3E%3Cpath d='m74.71 26.83a23.76 23.76 0 0 0-6.81-9.2l-0.069-0.049a13.61 13.61 0 0 0-0.23-0.158q-0.043-0.03-0.087-0.057-0.11-0.07-0.216-0.135l-0.084-0.05a7.863 7.863 0 0 0-0.288-0.159 35.14 35.14 0 0 1 0.306 0.615 33.59 33.59 0 0 1 0.186 0.383 39.74 39.74 0 0 1 3.433 10.76l8e-3 0.065c1.376 8.977-3.195 17.67-10.34 23.56l-0.022 0.05c-8.883 7.225-17.52 8.013-23.31 7.159 5.771 1.078 14.87 0.623 24.25-7l0.021-0.05c7.146-5.881 11.72-14.58 10.34-23.56l-8e-3 -0.065a38.94 38.94 0 0 0-2.829-9.445 25.66 25.66 0 0 1 4.243 6.047 38.62 38.62 0 0 1 3.586 19c-0.03 0.495-0.055 0.989-0.093 1.48a38.63 38.63 0 0 1-36.41 33.79 39.65 39.65 0 0 1-7.661-0.312 38.84 38.84 0 0 0 44.43-31.71c0.065-0.5 0.118-0.995 0.176-1.495a39.8 39.8 0 0 0-2.517-19.47zm-3.842 2.032v-0.037z' style='fill:url(%23t)'/%3E%3C/svg%3E%0A");
}
.opera{
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 75.591 75.591' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3ClinearGradient id='a' gradientTransform='matrix(0 -54.944 -54.944 0 23.62 79.474)' gradientUnits='userSpaceOnUse' x2='1'%3E%3Cstop offset='0' stop-color='%23ff1b2d'/%3E%3Cstop offset='.3' stop-color='%23ff1b2d'/%3E%3Cstop offset='.614' stop-color='%23ff1b2d'/%3E%3Cstop offset='1' stop-color='%23a70014'/%3E%3C/linearGradient%3E%3ClinearGradient id='b' gradientTransform='matrix(0 -48.595 -48.595 0 37.854 76.235)' gradientUnits='userSpaceOnUse' x2='1'%3E%3Cstop offset='0' stop-color='%239c0000'/%3E%3Cstop offset='.7' stop-color='%23ff4b4b'/%3E%3Cstop offset='1' stop-color='%23ff4b4b'/%3E%3C/linearGradient%3E%3Cg transform='matrix(1.3333 0 0 -1.3333 0 107.2)'%3E%3Cpath d='m28.346 80.398c-15.655 0-28.346-12.691-28.346-28.346 0-15.202 11.968-27.609 26.996-28.313.44848-.02115.89766-.03314 1.3504-.03314 7.2574 0 13.876 2.7289 18.891 7.2137-3.3227-2.2036-7.2074-3.4715-11.359-3.4715-6.7504 0-12.796 3.3488-16.862 8.6297-3.1344 3.6999-5.1645 9.1691-5.3028 15.307v1.3349c.13821 6.1377 2.1683 11.608 5.302 15.307 4.0666 5.2809 10.112 8.6297 16.862 8.6297 4.1526 0 8.038-1.2679 11.361-3.4729-4.9904 4.4643-11.569 7.1876-18.786 7.2144-.03596 0-.07122.0014-.10718.0014z' fill='url(%23a)'/%3E%3Cpath d='m19.016 68.025c2.6013 3.0709 5.9607 4.9227 9.631 4.9227 8.2524 0 14.941-9.356 14.941-20.897s-6.6891-20.897-14.941-20.897c-3.6703 0-7.0297 1.851-9.6303 4.922 4.0659-5.2809 10.111-8.6297 16.862-8.6297 4.1519 0 8.0366 1.2679 11.359 3.4715 5.802 5.1906 9.4554 12.735 9.4554 21.133 0 8.397-3.6527 15.941-9.4533 21.131-3.3234 2.205-7.2088 3.4729-11.361 3.4729-6.7504 0-12.796-3.3488-16.862-8.6297' fill='url(%23b)'/%3E%3C/g%3E%3C/svg%3E");
}
.safari{
  background-image: url("data:image/svg+xml,%3C%3Fxml version='1.0' encoding='UTF-8' standalone='no'%3F%3E%3Csvg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' width='66.165833mm' height='65.803795mm' viewBox='0 0 66.165833 65.803795'%3E%3Cdefs%3E%3ClinearGradient id='b'%3E%3Cstop offset='0' stop-color='%2306c2e7'/%3E%3Cstop offset='.25000015' stop-color='%230db8ec'/%3E%3Cstop offset='.5000003' stop-color='%2312aef1'/%3E%3Cstop offset='.75000012' stop-color='%231f86f9'/%3E%3Cstop offset='1' stop-color='%23107ddd'/%3E%3C/linearGradient%3E%3ClinearGradient id='a'%3E%3Cstop offset='0' stop-color='%23bdbdbd'/%3E%3Cstop offset='1' stop-color='%23fff'/%3E%3C/linearGradient%3E%3ClinearGradient xlink:href='%23a' id='d' x1='412.97501' x2='412.97501' y1='237.60777' y2='59.392235' gradientTransform='translate(206.79018 159.77261) scale(.35154)' gradientUnits='userSpaceOnUse'/%3E%3Cfilter id='f' width='1.0418189' height='1.0446756' x='-.02090938' y='-.0223378' color-interpolation-filters='sRGB'%3E%3CfeGaussianBlur stdDeviation='.95767362'/%3E%3C/filter%3E%3Cfilter id='c' width='1.096' height='1.096' x='-.048' y='-.048' color-interpolation-filters='sRGB'%3E%3CfeGaussianBlur stdDeviation='3.5643107'/%3E%3C/filter%3E%3CradialGradient xlink:href='%23b' id='e' cx='413.06128' cy='136.81819' r='82.125351' fx='413.06128' fy='136.81819' gradientTransform='translate(194.54473 155.58044) scale(.38143)' gradientUnits='userSpaceOnUse'/%3E%3C/defs%3E%3Cpath d='M502.08277 148.5a89.107765 89.107765 0 0 1-89.10777 89.10777A89.107765 89.107765 0 0 1 323.86724 148.5 89.107765 89.107765 0 0 1 412.975 59.392235 89.107765 89.107765 0 0 1 502.08277 148.5Z' filter='url(%23c)' opacity='.52999998' paint-order='markers stroke fill' transform='matrix(.33865 0 0 .3261 -106.76956 -14.47833)'/%3E%3Cpath fill='url(%23d)' stroke='%23cdcdcd' stroke-linecap='round' stroke-linejoin='round' stroke-width='.09301235' d='M383.29373 211.97671a31.325188 31.325188 0 0 1-31.32519 31.32519 31.325188 31.325188 0 0 1-31.32518-31.32519 31.325188 31.325188 0 0 1 31.32518-31.32519 31.325188 31.325188 0 0 1 31.32519 31.32519z' paint-order='markers stroke fill' transform='translate(-318.88562 -180.59501)'/%3E%3Cpath fill='url(%23e)' d='M380.83911 211.97671a28.870571 28.870571 0 0 1-28.87057 28.87057 28.870571 28.870571 0 0 1-28.87057-28.87057 28.870571 28.870571 0 0 1 28.87057-28.87057 28.870571 28.870571 0 0 1 28.87057 28.87057z' paint-order='markers stroke fill' transform='translate(-318.88562 -180.59501)'/%3E%3Cpath fill='%23f4f2f3' d='M33.08292 4.01671c-.23319 0-.42092.18772-.42092.42092V9.2928c0 .2332.18773.42092.42092.42092.2332 0 .42092-.18772.42092-.42092V4.43763c0-.2332-.18772-.42092-.42092-.42092zm-2.75367.17404c-.0279-.003-.0566-.003-.0856.00035-.23194.0242-.39917.2304-.37495.46234l.21218 2.03119c.0242.23194.23041.39918.46233.37496.23195-.0242.39919-.2304.37496-.46234l-.212-2.03118c-.0212-.20295-.18177-.35637-.37695-.37532zm5.5266.002c-.19519.0188-.35578.17221-.37714.37513l-.21363 2.03102c-.0244.23192.14285.43831.37478.4627.23191.0244.43811-.14268.46251-.3746l.21364-2.03119c.0244-.23192-.14286-.43814-.37478-.46252-.029-.003-.0575-.003-.0854-.00052zm-8.3553.4082c-.028.00022-.0565.003-.085.009-.22814.0483-.37294.27089-.32464.49903l1.00552 4.74981c.0483.22814.27088.37293.49902.32464.22814-.0483.37294-.27072.32465-.49886l-1.00552-4.74998c-.0423-.19963-.21792-.33543-.41401-.3339zm11.18382.004c-.19609-.002-.3718.13394-.41419.33353l-1.00897 4.74925c-.0485.22811.0962.45076.32427.49922.22811.0485.45076-.0962.49921-.32428l1.00897-4.74926c.0485-.2281-.0962-.45076-.32427-.49921-.0285-.006-.057-.009-.085-.009zM24.801 5.36212c-.0545-.005-.11077.001-.16622.0194-.22178.0721-.34238.3085-.27031.53028l.6311 1.94236c.0721.22179.30868.34238.53046.27032.22179-.0721.3422-.30868.27013-.53046l-.63109-1.94236c-.054-.16634-.20059-.27568-.36407-.28958zm16.56765.001c-.16348.0139-.30999.12324-.36406.28957l-.63147 1.94218c-.0721.22177.0484.45837.27014.53046.22178.0721.45837-.0484.53047-.27013l.63146-1.94236c.0721-.22178-.0484-.45837-.27014-.53046-.0554-.018-.11191-.0239-.1664-.0193zm-19.23721.9759c-.0547.001-.11004.013-.16331.0367-.21298.0947-.30836.34244-.21364.55553l1.97197 4.43662c.0947.21308.34244.30836.55553.21364.21298-.0947.30854-.34244.21382-.55553l-1.97216-4.43662c-.071-.15983-.22817-.25351-.39221-.25033zm21.93693.0149c-.16403-.003-.32132.0901-.39257.24979l-1.97798 4.4339c-.095.21296-.00004.46088.21292.55589.21297.095.46088.00005.5559-.21291L44.4446 6.9467c.095-.21297.00005-.46089-.21291-.5559-.0532-.0237-.10864-.0357-.16332-.0369zM19.65353 7.6501c-.0808-.006-.16406.012-.23979.0558-.20196.1166-.27065.37302-.15406.57497l1.02115 1.76869c.1166.20196.373.27065.57496.15405.20195-.1166.27065-.37301.15406-.57497L19.9887 7.85996c-.0729-.12623-.20047-.20041-.33517-.20983zm26.85877 0c-.13468.009-.26211.0836-.33498.20983l-1.02133 1.76868c-.1166.20196-.0477.45837.15424.57497.20196.1166.45837.0479.57497-.15405l1.02114-1.76869c.1166-.20195.0479-.45837-.15406-.57497-.0757-.0437-.15916-.0614-.23998-.0558zM17.24739 9.15083c-.081.003-.16211.029-.2329.0803-.18875.13693-.23048.39911-.0935.58787l2.85086 3.92995c.13693.18876.39929.23049.58805.0936.18876-.13693.23049-.39911.0935-.58787l-2.85104-3.92995c-.0856-.11798-.22004-.17847-.35497-.17386zm31.70122.0214c-.13493-.005-.26941.0555-.35516.17331l-2.8563 3.92614c-.1372.18857-.0958.45086.0928.58805.18858.13718.45087.0959.58806-.0926l2.85613-3.92614c.13718-.18858.0957-.45086-.0928-.58805-.0707-.0514-.15176-.0778-.23272-.0807zm-33.85196 1.78231c-.10744-.006-.21708.0299-.30374.10791-.17332.15602-.18725.42109-.0312.59441l1.36648 1.51799c.15601.17332.42109.18726.59441.0312.17332-.15602.18726-.42127.0312-.59459l-1.3663-1.51781c-.078-.0867-.18339-.13351-.29085-.13916zm35.97562.003c-.10745.006-.21282.0525-.29084.13915l-1.36648 1.51763c-.15606.1733-.14224.43855.0311.59459.17329.15604.43837.14205.59441-.0312l1.36666-1.51762c.15605-.17331.14205-.43856-.0312-.59459-.0867-.078-.19611-.11354-.30357-.10791zm-38.03696 1.97705c-.10745.006-.21266.0525-.29067.13916-.15602.17332-.14207.43839.0312.59441l3.60841 3.24834c.17332.15603.43839.14207.5944-.0312.15603-.17331.14226-.43839-.0311-.59441l-3.60858-3.24834c-.0867-.078-.1963-.11356-.30376-.10791zm40.10831.0142c-.10745-.006-.21722.0298-.30393.10773l-3.61059 3.24581c-.17342.15589-.18768.42097-.0318.5944.1559.17342.42117.18751.59459.0316l3.61077-3.2458c.17342-.1559.1875-.42098.0316-.59441-.078-.0867-.18322-.13361-.29066-.13933zm-41.8225 2.18998c-.13494-.005-.26949.0558-.35515.17367-.13707.18866-.0955.4508.0932.58787l1.65224 1.20044c.18866.13708.45079.0957.58786-.093.13708-.18866.0956-.45098-.093-.58805l-1.65224-1.20044c-.0707-.0514-.15193-.0776-.23289-.0805zm43.53505.0153c-.081.003-.16211.0289-.23289.0803l-1.65297 1.19936c-.18875.13694-.2305.39929-.0936.58805.13695.18875.39912.23031.58787.0934l1.65316-1.19935c.18875-.13694.23031-.39912.0934-.58787-.0856-.11797-.22004-.17847-.35497-.17385zM9.7192 17.48992c-.13469.009-.26211.0836-.33499.20982-.1166.20195-.0479.45837.15405.57497l4.20463 2.42758c.20195.1166.45837.0479.57497-.15405.1166-.20195.0479-.45837-.15405-.57497l-4.20463-2.42759c-.0757-.0437-.15917-.0614-.23998-.0558zm46.72744 0c-.0808-.006-.16425.012-.23998.0558l-4.20463 2.42759c-.20195.1166-.27065.37302-.15405.57497.1166.20195.37302.27065.57497.15405l4.20482-2.42758c.20195-.1166.27064-.37302.15404-.57497-.0729-.12622-.20048-.20041-.33517-.20982zm-47.9386 2.50606c-.16403-.004-.32133.0899-.39258.2496-.095.21298-.00006.46091.21292.5559l1.86532.83202c.21298.095.46091.00007.5559-.2129.095-.21298-.00012-.46091-.21309-.5559l-1.86515-.83202c-.0532-.0238-.10865-.0356-.16332-.0367zm49.15794.0173c-.0547.001-.11024.013-.16351.0367l-1.86569.83057c-.21304.0949-.3083.34267-.21346.55571.0949.21304.34286.3083.5559.21346l1.8657-.83076c.21303-.0948.30811-.34267.21327-.55571-.0711-.15978-.22818-.25323-.39221-.24997zM7.42859 22.61527c-.16349.0137-.31006.12291-.36424.28921-.0722.22172.048.45839.26977.53064l4.61629 1.50418c.22171.0722.45839-.0481.53064-.26977.0722-.22172-.048-.4584-.26977-.53064L7.595 22.6347c-.0554-.0181-.11192-.024-.16641-.0194zm51.31484.018c-.0545-.005-.11078.001-.16623.0194l-4.61736 1.50092c-.22178.0721-.34223.30869-.27014.53046.0721.22177.30868.34223.53046.27014l4.61719-1.50092c.22178-.0721.3424-.30869.27032-.53046-.0541-.16633-.20077-.2757-.36424-.28957zM6.75607 25.36479c-.1961-.002-.37196.13412-.41438.33371-.0485.2281.0962.45073.32427.49922l1.99777.42455c.2281.0485.45072-.0962.49921-.32427.0485-.22811-.0962-.45074-.32427-.49922l-1.99759-.42455c-.0285-.006-.057-.009-.085-.009zm52.65462.004c-.028.00023-.0563.004-.0848.009l-1.99778.42437c-.2281.0485-.37271.27093-.32426.49904.0485.2281.2711.3729.49921.32445l1.99759-.42437c.2281-.0485.3729-.27111.32445-.49922-.0424-.19959-.21829-.33537-.41437-.33371zM6.24704 28.13046c-.1952.0187-.35587.17185-.37731.37477-.0245.2319.14232.43838.37422.46288l4.82829.51048c.2319.0245.43838-.1425.46288-.37441.0245-.2319-.1425-.43838-.37441-.46288l-4.82828-.51048c-.029-.003-.0575-.003-.0854-.00035zm53.6763.0363c-.0279-.003-.0566-.003-.0856.00035l-4.82883.50394c-.23194.0242-.39914.2304-.37496.46233.0242.23194.2304.39918.46234.37496l4.82883-.50394c.23193-.0242.39914-.2304.37496-.46234-.0212-.20294-.1816-.35634-.37678-.37532zM6.16529 30.96149c-.2332 0-.42091.18772-.42091.42092 0 .23319.18771.42091.42091.42091h2.04228c.23319 0 .4211-.18772.4211-.42091 0-.2332-.18791-.42092-.4211-.42092zm51.79298 0c-.23319 0-.42092.18772-.42092.42092.00001.23319.18773.42091.42092.42091h2.04228c.23319 0 .42092-.18772.42092-.42091 0-.2332-.18773-.42092-.42092-.42092zM11.15508 33.2561c-.0279-.003-.0564-.003-.0854.00035l-4.82902.50394c-.23194.0242-.39913.2304-.37495.46233.0242.23194.2304.39918.46233.37496l4.82902-.50394c.23194-.0242.39913-.2304.37495-.46234-.0212-.20294-.18177-.35634-.37695-.37531zm43.85314.0298c-.19521.0187-.35588.17186-.37732.37478-.0245.2319.14233.43838.37423.46288l4.82829.51048c.23191.0245.43837-.14251.46288-.37441.0245-.2319-.14251-.43838-.37441-.46288l-4.8281-.51048c-.029-.003-.0577-.003-.0856-.00035zm-46.2602 2.8436c-.028.00024-.0565.003-.085.009l-1.99777.42436c-.22811.0485-.37271.27111-.32427.49922.0485.22811.27111.37272.49922.32427l1.99777-.42419c.2281-.0485.37271-.27111.32426-.49921-.0424-.1996-.2181-.33537-.41419-.33372zm48.66925.004c-.19609-.002-.37177.13394-.41419.33353-.0485.2281.096.45074.32409.49922l1.99777.42455c.22809.0485.45073-.096.49921-.32409.0485-.2281-.0962-.45092-.32426-.4994l-1.9976-.42455c-.0285-.006-.057-.009-.085-.009zm-45.30519 1.65787c-.0545-.005-.11077.001-.16622.0194L7.3285 39.31168c-.22178.0721-.34223.30869-.27014.53046.0721.22178.30868.34222.53046.27014l4.61719-1.50092c.22178-.0721.34241-.30869.27032-.53046-.0541-.16633-.20077-.2757-.36425-.28957zm41.93713.0149c-.16349.0137-.31005.12292-.36423.28921-.0722.22173.048.4584.26977.53065l4.61628 1.50418c.22172.0722.4584-.0481.53064-.26977.0723-.22172-.048-.4584-.26977-.53065l-4.61628-1.50418c-.0554-.0181-.11191-.024-.16641-.0194zm-43.69909 3.27251c-.0547.001-.11006.0128-.16332.0365l-1.86587.83075c-.21304.0948-.30812.34267-.21328.55571.0949.21304.34268.30812.55571.21328l1.86589-.83058c.21303-.0948.30811-.34267.21327-.55571-.0711-.15978-.22837-.25323-.3924-.24997zm45.45888.016c-.16403-.004-.32133.0899-.39258.24961-.095.21297-.00006.4609.21291.55589l1.86515.83202c.21297.095.46091.00006.5559-.21291.095-.21297.00006-.4609-.21291-.55589l-1.86515-.83203c-.0532-.0238-.10864-.0356-.16332-.0367zm-41.82613.91214c-.0808-.006-.16424.012-.23998.0558L9.53826 44.4903c-.20195.1166-.27065.37302-.15405.57497.1166.20195.37302.27065.57497.15405l4.20463-2.4274c.20195-.1166.27064-.3732.15405-.57515-.0729-.12622-.2003-.20041-.33499-.20982zm38.20028 0c-.13469.009-.26229.0836-.33517.20982-.1166.20195-.0479.45855.15405.57515l4.20463 2.4274c.20196.1166.45855.0479.57515-.15405.1166-.20195.0479-.45837-.15404-.57497l-4.20482-2.42758c-.0757-.0437-.15899-.0614-.2398-.0558zm-39.24903 3.56244c-.081.003-.16211.0291-.2329.0805l-1.65296 1.19935c-.18875.13694-.2305.39912-.0936.58787.13695.18875.39912.2305.58787.0935l1.65314-1.19935c.18877-.13693.23051-.39911.0936-.58786-.0856-.11797-.22022-.17866-.35516-.17404zm40.28761.0142c-.13494-.005-.26948.0558-.35515.17367-.13708.18865-.0955.45098.0932.58805l1.65224 1.20044c.18866.13707.4508.0955.58787-.0932.13707-.18866.0956-.4508-.093-.58787l-1.65224-1.20044c-.0707-.0514-.15193-.0778-.23289-.0807zm-36.54387.14533c-.10743-.006-.21702.0298-.30374.10773l-3.61076 3.2458c-.17342.15589-.18751.42098-.0316.59441.15589.17342.42097.1875.5944.0316l3.61077-3.2458c.17342-.15589.18751-.42098.0316-.59441-.0779-.0867-.18322-.13361-.29067-.13933zm32.80012.0116c-.10745.006-.21283.0525-.29084.13915-.15603.17332-.14207.43839.0312.59441l3.60841 3.24834c.17332.15604.43857.14208.59459-.0312.15603-.17331.14207-.43839-.0312-.5944l-3.6086-3.24835c-.0867-.078-.19611-.11355-.30356-.10791zm-29.37464 3.08358c-.13493-.005-.2696.0554-.35534.1733l-2.85613 3.92614c-.13719.18858-.0959.45087.0926.58805.18857.13719.45087.0959.58805-.0927l2.85613-3.92614c.13718-.18857.0959-.45086-.0926-.58805-.0707-.0514-.15175-.0778-.23271-.0806zm25.93573.0176c-.081.003-.16211.0289-.2329.0803-.18875.13694-.23048.39911-.0936.58787l2.85086 3.92995c.13693.18876.39911.2305.58787.0936.18876-.13693.23049-.3991.0936-.58786l-2.85086-3.92996c-.0856-.11797-.22004-.17846-.35498-.17385zm-29.6228.6064c-.10745.006-.21282.0525-.29084.13915l-1.36649 1.51763c-.15605.1733-.14223.43855.0311.59459.1733.15604.43837.14205.5944-.0313l1.36666-1.51762c.15606-.1733.14206-.43856-.0312-.59459-.0867-.078-.19611-.11354-.30357-.10791zm33.33076.002c-.10745-.006-.21691.0299-.30356.10791-.17333.156-.18726.42108-.0313.5944l1.3663 1.51799c.15602.17333.42109.18726.59442.0312.17332-.15601.18726-.42126.0312-.59459l-1.36631-1.5178c-.078-.0867-.18339-.13351-.29084-.13916zm-25.65524 1.68366c-.16403-.004-.32114.0899-.39239.24961l-1.97816 4.43389c-.095.21297-.00005.46089.21292.5559.21296.095.46089.00005.55589-.21291l1.97815-4.4339c.095-.21296.00005-.46089-.21292-.55589-.0532-.0238-.10881-.0356-.16349-.0367zm17.95556.0122c-.0547.001-.11023.0128-.1635.0365-.21297.0947-.30836.34244-.21363.55553l1.97196 4.43662c.0947.21297.34262.30836.55571.21364.21298-.0947.30836-.34244.21364-.55553l-1.97197-4.43662c-.071-.15973-.22818-.25329-.39221-.25015zM20.61581 52.5046c-.13468.009-.26212.0836-.33498.20982l-1.02115 1.76869c-.11659.20195-.0479.45837.15406.57497.20195.1166.45837.0479.57496-.15405l1.02115-1.76869c.11659-.20195.0479-.45837-.15406-.57497-.0757-.0437-.15916-.0614-.23998-.0558zm24.93421 0c-.0808-.006-.16406.0121-.23979.0558-.20195.1166-.27065.37302-.15405.57497l1.02114 1.76869c.1166.20195.37302.27064.57496.15405.20196-.1166.27066-.37302.15406-.57497l-1.02114-1.76869c-.0729-.12622-.20049-.20041-.33518-.20982zm-17.0545.0634c-.19609-.002-.3718.13394-.41419.33354l-1.00897 4.74926c-.0485.2281.0962.45076.32427.49921.22811.0485.45076-.0962.49922-.32427l1.00896-4.74926c.0485-.2281-.0962-.45076-.32427-.49921-.0285-.006-.057-.009-.085-.009zm9.1599.003c-.028.00022-.0563.003-.0848.009-.22814.0483-.37294.27071-.32465.49885l1.00553 4.74999c.0483.22814.27088.37293.49903.32464.22814-.0483.37293-.27089.32464-.49903l-1.0057-4.74965c-.0423-.19963-.21793-.33543-.41402-.33391zm-4.5725.47905c-.23319 0-.42092.18772-.42092.42092v4.85517c0 .2332.18773.42092.42092.42092.2332 0 .42092-.18772.42092-.42092v-4.85517c0-.2332-.18772-.42092-.42092-.42092zm-7.72657 1.56886c-.16347.0139-.31017.12324-.36423.28957l-.63129 1.94236c-.0721.22178.0484.45837.27014.53047.22177.0721.45836-.0486.53046-.27032l.63128-1.94218c.0721-.22177-.0484-.45836-.27013-.53046-.0554-.018-.11173-.024-.16623-.0194zm15.44987.001c-.0545-.005-.11078.001-.16622.0193-.22178.0721-.34238.30868-.27033.53047l.63111 1.94235c.0721.22179.30868.3422.53046.27014.22178-.0721.34238-.3085.27032-.53028l-.63128-1.94236c-.0541-.16634-.20058-.27568-.36406-.28957zm-10.36543 1.08181c-.1952.0188-.356.17203-.37732.37496l-.21346 2.03119c-.0244.23192.14268.43812.3746.46252.23192.0244.4383-.14268.4627-.3746l.21345-2.03101c.0244-.23192-.14268-.4383-.37458-.4627-.029-.003-.0575-.003-.0854-.00035zm5.26736.002c-.0279-.003-.0566-.003-.0856.00035-.23193.0242-.39917.2304-.37495.46233l.21218 2.03138c.0242.23193.2304.399.46234.37478.23193-.0242.39918-.23041.37496-.46234l-.212-2.03119c-.0212-.20295-.18178-.35637-.37697-.37533z' paint-order='markers stroke fill'/%3E%3Cpath d='m469.09621 100.6068-65.50955 38.06124-41.41979 65.20654 60.59382-44.88117z' filter='url(%23f)' opacity='.40900005' paint-order='markers stroke fill' transform='translate(-112.09544 -20.8224) scale(.35154)'/%3E%3Cpath fill='%23ff5150' d='m36.3834003 34.83806178-6.60095092-6.91272438 23.41607429-15.75199774z' paint-order='markers stroke fill'/%3E%3Cpath fill='%23f1f1f1' d='m36.38339038 34.83805895-6.60095092-6.91272438-16.81512624 22.66471911z' paint-order='markers stroke fill'/%3E%3Cpath d='m12.96732 50.59006 23.41607-15.75201 16.81513-22.66472z' opacity='.243'/%3E%3C/svg%3E");
}
.ubuntu{
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' viewBox='0 0 100 100'%3E%3Ccircle fill='%23f47421' cy='50' cx='50' r='45'/%3E%3Ccircle fill='none' stroke='%23ffffff' stroke-width='8.55' cx='50' cy='50' r='21.825'/%3E%3Cg id='friend'%3E%3Ccircle fill='%23f47421' cx='19.4' cy='50' r='8.4376'/%3E%3Cpath stroke='%23f47421' stroke-width='3.2378' d='M67,50H77'/%3E%3Ccircle fill='%23ffffff' cx='19.4' cy='50' r='6.00745'/%3E%3C/g%3E%3Cuse xlink:href='%23friend' transform='rotate(120,50,50)'/%3E%3Cuse xlink:href='%23friend' transform='rotate(240,50,50)'/%3E%3C/svg%3E");
}
.windows{
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' height='88' width='88' xmlns:v='https://vecta.io/nano'%3E%3Cpath d='M0 12.402l35.687-4.86.016 34.423-35.67.203zm35.67 33.529l.028 34.453L.028 75.48.026 45.7zm4.326-39.025L87.314 0v41.527l-47.318.376zm47.329 39.349l-.011 41.34-47.318-6.678-.066-34.739z' fill='%2300adef'/%3E%3C/svg%3E");
}
//:deep(.v-field__input){
//  height: 18px !important;
//  max-height: 18px !important;
//  overflow: hidden;
//}
</style>
