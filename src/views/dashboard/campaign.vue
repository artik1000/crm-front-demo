<template>
  <h1>{{$t('Campaigns')}}</h1>
  <div
    class="dashboard-campaign__bts-row mt-6"
    v-if="tableData.some((e) => e.stateActive === true)"
  >
    <v-btn
      color="error"
      elevation="0"
      class="common-btn"
      @click="removeCampaign()"
    >
      {{ $t('Delete')}}
    </v-btn>
    <v-btn
      color="secondary"
      elevation="0"
      class="common-btn"
      @click="activateCampaign()"
    >
      {{ $t('On')}}
    </v-btn>
    <v-btn
      color="secondary"
      elevation="0"
      class="common-btn"
      @click="deactivateCampaign()"
    >
      {{ $t('Off')}}
    </v-btn>
  </div>
  <div class="dashboard-campaign__actions-row" v-else>
    <v-btn
      :to="{ name: 'Google Ads sheet add' }"
      color="primary"
      class="common-btn"
      elevation="0"
    >
      {{ $t('Create') }}
    </v-btn>
    <div class="dashboard-campaign__bts-row">
      <v-btn
        elevation="0"
        class="common-btn"
        color="secondary"
        type="button"
      >
        {{ $t('Metrics') }} {{ metricsValues.length }}
        <v-dialog
          v-model="metricsDialog"
          activator="parent"
          width="auto"
        >
          <v-card class="common-card dashboard-campaign__metrics-popup" elevation="0" rounded="lg">
            <div class="d-flex flex-row w-100" style="justify-content: space-between">
              <h3 class="my-auto">
                {{ $t('Metrics') }}
              </h3>
              <v-btn
                elevation="0"
                @click="metricsDialog = false"
                icon="mdi-close"
              >
              </v-btn>
            </div>
            <v-select
              v-model="metricsValues"
              :items="metricsItems"
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
                @click="metricsValues = ['CR','ROI','CPC','EPC']"
              >
                {{ $t('Reset') }}
              </v-btn>
              <v-btn
                color="error"
                elevation="0"
                @click="metricsValues = []; metricsDialog = false"
              >
                {{ $t('Cancel') }}
              </v-btn>
              <v-btn
                color="primary"
                elevation="0"
                @click="metricsDialog = false"
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
        <v-select
          density="compact"
          variant="outlined"
          color="primary"
          hide-details
          class="common-filter-input"
          v-model="request.state"
          :items="states"
          :label="$t('Choose state')"
          @update:modelValue="updateCampaigns()"
        >
        </v-select>
    </div>
  </div>
  <div style="overflow: scroll; margin-top: 24px" class="table-wrapper-big">
    <table id="tableId" class="resizable landings-table">
      <thead>
      <tr>
        <th>
          <v-checkbox
            v-model="allSelected"
            @click="selectAll()"
            true-icon="mdi-minus-box"
            hide-details
          ></v-checkbox>
        </th>
        <th
          v-for="(item,index) in tableHeadersAndMetrics" :key="index"
        >
          {{ item.title }}
        </th>
      </tr>
      </thead>
      <TablePreloader
        v-if="loading"
        :width="13"
        :height="10"
      />
      <tbody v-else>
      <tr v-for="(row , index) in tableDataFilteredByColumns" :key="index">
        <td>
          <div class="table-cell__content">
          <v-checkbox
            color="primary"
            v-model="tableData[index].stateActive"
            hide-details
            :true-value="true"
            :false-value="false"
          >
          </v-checkbox>
          </div>
        </td>
        <td>
          <div class="table-cell__content">
          <div :class="(row.state === 'active')?'dot-green':'dot-red'" class="mx-4">
          </div>
          </div>
        </td>
        <td>
          <div class="table-cell__content">
            {{ row.campaign_name}}
          </div>
        </td>
        <td>
          <div class="table-cell__content">
          {{ row.clicks }}
          </div>
        </td>
        <td>
          <div class="table-cell__content">
          {{ row.conversions }}
          </div>
        </td>
        <td v-if="metricsValues.includes('CR')">
          <div class="table-cell__content">
            {{ row.cr > 0 ? row.cr.toLocaleString('ru-RU', { style: 'percent', minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0' }}
          </div>
        </td>
        <td v-if="metricsValues.includes('ROI')">
          <div class="table-cell__content">
            {{ row.roi > 0 ? row.roi.toLocaleString('ru-RU', { style: 'percent', minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0' }}
          </div>
        </td>
        <td v-if="metricsValues.includes('CPC')">
          <div class="table-cell__content">
            {{ row.cpc > 0 ? row.cpc.toLocaleString('ru-RU', { style: 'percent', minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0' }}
          </div>
        </td>
        <td v-if="metricsValues.includes('EPC')">
          <div class="table-cell__content">
            {{ row.epc > 0 ? row.epc.toLocaleString('ru-RU', { style: 'percent', minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0' }}
          </div>
        </td>
        <td>
          <div class="table-cell__content">
            {{ row.cost > 0 ? row.cost.toLocaleString('ru-RU', { style: 'currency', currency: 'USD' }): '0' }}
          </div>
        </td>
        <td>
          <div class="table-cell__content">
            {{ row.profit > 0 ? row.profit.toLocaleString('ru-RU', { style: 'currency', currency: 'USD' }): '0' }}
          </div>
        </td>

        <td>
          <div class="table-cell__content">
            {{ row.created_at ? new Date(row.created_at).toLocaleDateString('ru-RU') : ''}} {{ row.created_at ? new Date(row.created_at).toLocaleTimeString('ru-RU') : '' }}
          </div>
        </td>
        <td>
          <div class="table-cell__content">
            {{ row.updated_at ? new Date(row.updated_at).toLocaleDateString('ru-RU') : ''}} {{ row.updated_at ? new Date(row.updated_at).toLocaleTimeString('ru-RU') : ''}}
          </div>
        </td>
      </tr>
      </tbody>
    </table>
  </div>
  <v-pagination
    v-model="request.page"
    @update:modelValue="updateCampaigns()"
    :length="pages"
    :total-visible="5"
    color="primary"
    class="mt-6"
  ></v-pagination>
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
      <p class="my-auto"> {{ $t('Success!') }} </p>
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
import {reactive, ref, onMounted, computed} from "vue";
import RangeDatePicker from "@/components/common/RangeDatePicker.vue";
import TablePreloader from "@/components/tables/TablePreloader.vue";
import useAxiosGet from "@/composables/useAxiosGet";
import useAxiosPost from "@/composables/useAxiosPost";
import {useI18n} from "vue-i18n";
const { t } = useI18n({useScope: "global"})

let request = reactive({
  state: '',
  from: '',
  to: '',
  page: 1,
  page_size: 10,
})
let response = ref({})
let tableData = ref([])
let loading = ref(true)
let pages = ref(1)

let states = ref([
  { title: t('All'), value: ''},
  { title: t('Active'), value: 'active'},
  { title: t('Inactive'), value: 'inactive'},
])
let metricsDialog = ref(false)
let metricsValues = ref(['CR','ROI','CPC','EPC'])
let metricsItems = ref(['CR','ROI','CPC','EPC'])

let pr = ref({})
let successAlert = ref(false)
let errorAlert = ref(false)

let tableHeaders = ref([
  {title: '', key: 'state'},
  {title: t('Campaign name' ), key: 'campaign_name'},
  {title: t('Clicks' ), key: 'clicks'},
  {title: t('Conversions' ), key: 'conversions'},
  {title: 'CR', key: 'cr'},
  {title: 'ROI', key: 'roi'},
  {title: 'CPC', key: 'cpc'},
  {title: 'EPC', key: 'epc'},
  {title: t('Costs' ), key: 'costs'},
  {title: t('Profit' ), key: 'profit'},
  {title: t('Created at' ), key: 'created_at'},
  {title: t('Updated at' ), key: 'updated_at'},
])

let allSelected = ref(false)

let tableHeadersAndMetrics = computed(() => {
  return [...tableHeaders.value]
    .filter(s => [...metricsValues.value].includes(s.title) || (s.title !== 'CR' && s.title !== 'ROI' && s.title !== 'CPC' && s.title !== 'EPC'))
})

let tableDataFilteredByColumns = computed(() => {
  let tableDataP = [...tableData.value]
  let tableDataResult = []
  tableDataP.forEach((item) => {
    let object = Object.fromEntries(
      Object.entries(item).filter(([key, value]) =>
        tableHeadersAndMetrics.value.some((e) => e.key === key))
    );
    tableDataResult.push(object)
  });
  return tableDataResult
})

function selectAll () {
  if (!allSelected.value){
    for (let i = 0; i < tableData.value.length; i++){
      tableData.value[i].stateActive = true
    }
  } else {
    for (let i = 0; i < tableData.value.length; i++){
      tableData.value[i].stateActive = false
    }
  }
}

function updateDate (date) {
  request.from = date.from
  request.to = date.to
  updateCampaigns()
}

function setIds () {
  let ids = ''
  for(let i = 0; i < tableData.value.length; i++){
    if (tableData.value[i].stateActive === true){
      ids += `${tableData.value[i].id},`
    }
  }
  return ids.slice(0, -1)
}

async function removeCampaign() {
  pr.value = await useAxiosPost(`dashboard/campaign/delete/`, { campaign_ids: setIds() })
  errorAlert.value = pr.value.error
  successAlert.value = pr.value.success
  updateCampaigns()
  allSelected.value = false
}

async function activateCampaign() {
  pr.value = await useAxiosPost(`dashboard/campaign/activate/`, { campaign_ids: setIds() })
  errorAlert.value = pr.value.error
  successAlert.value = pr.value.success
  updateCampaigns()
  allSelected.value = false
}

async function deactivateCampaign() {
  pr.value = await useAxiosPost(`dashboard/campaign/deactivate/`, { campaign_ids: setIds() })
  errorAlert.value = pr.value.error
  successAlert.value = pr.value.success
  updateCampaigns()
  allSelected.value = false
}

async function updateCampaigns() {
  response.value = await useAxiosGet(
    `dashboard/campaign/main/?from=${request.from}&to=${request.to}&state=${request.state}&page=${request.page}&page_size=${request.page_size}`
  )
  tableData.value = response.value.responseData
  for (let i = 0; i < tableData.value.length; i++){
    tableData.value[i].stateActive = false
  }
  loading.value = response.value.loading
  pages.value = Math.ceil(response.value.items / 10)
}

onMounted(() => {
  updateCampaigns()
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
  height: 56px !important;
  padding: 0 16px;
  white-space: nowrap;
  max-width: 190px;
  background: rgb(var(--v-theme-surface));
}
.resizable thead tr{
  background-color: rgb(var(--v-theme-surface));
}
.resizable th {
  height: 56px !important;
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
.campaigns-table{
  width: 100%;
}
.landings-table th:nth-child(1){
  width: 56px;
  min-width: 56px;
}
.landings-table th:nth-child(2){
  width: 56px;
}
</style>
