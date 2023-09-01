<template>
  <div class="d-flex flex-row justify-space-between">
    <h1>{{$t('Integration with Google Ads through Google Sheets')}}</h1>
    <v-btn
      :to="{ name: 'Google Ads sheet add' }"
      color="primary"
      class="common-btn"
      elevation="0"
      prepend-icon="mdi-plus"
    >
      {{$t('Add')}}
    </v-btn>
  </div>
  <v-table class="mt-6">
    <thead>
      <tr>
        <th>{{$t('Keywords')}}</th>
        <th class="sheet-list__th_account">{{$t('Account')}}</th>
        <th class="sheet-list__th_geo">{{$t('Geo')}}</th>
        <th class="sheet-list__th_synchronized text-center">{{$t('Synchronized')}}</th>
        <th class="sheet-list__th_actions text-center">{{$t('Actions')}}</th>
      </tr>
    </thead>
    <TablePreloader
      v-if="loading"
      :width="5"
      :height="10"
    />
    <tbody v-else>
    <template v-for="row in tableData" :key="row.id">
      <tr>
        <td class="pa-1">
          <v-chip
            rounded="sm"
            class="ma-1"
            v-for="(keyword,index) in row.keywords.split(' ')"
            :key="index"
          >
            {{ keyword }}
          </v-chip>
        </td>
        <td>{{ row.account_name }}</td>
        <td>{{ row.geo }}</td>
        <td>{{ new Date(row.sync_at).toLocaleDateString('ru-RU')}} {{ new Date(row.sync_at).toLocaleTimeString('ru-RU') }}</td>
        <td>
          <div class="icons-cell">
            <v-tooltip :text="$t('Open table')" location="bottom">
              <template v-slot:activator="{ props }">
                <v-btn
                  icon="mdi-google-spreadsheet"
                  elevation="0"
                  v-bind="props"
                  class="p-0 table-icon"
                  :ripple="false"
                  tag="a"
                  target="_blank"
                  :href="row.url"
                >
                </v-btn>
              </template>
            </v-tooltip>
            <v-tooltip :text="$t('Download script')" location="bottom">
              <template v-slot:activator="{ props }">
                <v-btn
                  icon="mdi-file-download-outline"
                  elevation="0"
                  v-bind="props"
                  class="p-0 table-icon"
                  :ripple="false"
                  @click="downloadScript(
                    row.url,
                    row.account_name,
                    row.user.buyer,
                    row.geo,
                    row.keitaro_campaign.campaign_name,
                    row.keywords
                    )"
                >
                </v-btn>
              </template>
            </v-tooltip>
            <v-tooltip :text="$t('Details')" location="bottom">
              <template v-slot:activator="{ props }">
                <v-btn
                  icon="mdi-eye"
                  elevation="0"
                  v-bind="props"
                  class="p-0 table-icon"
                  :ripple="false"
                  :to="{ name: 'Google Ads sheet details', params: { id: row.id }}"
                >
                </v-btn>
              </template>
            </v-tooltip>
            <v-tooltip :text="$t('Edit')" location="bottom">
              <template v-slot:activator="{ props }">
                <v-btn
                  icon="mdi-lead-pencil"
                  elevation="0"
                  v-bind="props"
                  class="p-0 table-icon"
                  :ripple="false"
                  :to="{ name: 'Google Ads sheet edit', params: { id: row.id }}"
                >
                </v-btn>
              </template>
            </v-tooltip>
            <v-tooltip :text="$t('Remove')" location="bottom">
              <template v-slot:activator="{ props }">
                <v-btn
                  icon="mdi-trash-can-outline"
                  elevation="0"
                  v-bind="props"
                  class="p-0 table-icon"
                  :ripple="false"

                >
                  <v-icon>mdi-trash-can-outline</v-icon>
                  <v-dialog
                    width="auto"
                    activator="parent"
                  >
                    <template v-slot:default="{ isActive }">
                      <v-card class="common-popup common-card" elevation="0" rounded="lg">
                        <h3>
                          {{$t('Confirm action')}}
                        </h3>
                        <p class="mt-2">
                          {{$t('Are you sure you want to remove the script and its data from the table?')}}
                        </p>
                        <div class="common-popup__bts-row">
                          <v-btn
                            color="primary"
                            elevation="0"
                            type="submit"
                            @click="deleteSheet(row.id); isActive.value = false;"
                          >
                            {{$t('Yes')}}
                          </v-btn>
                          <v-btn
                            color="red-accent-3"
                            elevation="0"
                            @click="isActive.value = false"
                          >
                            {{$t('No')}}
                          </v-btn>
                        </div>
                      </v-card>
                    </template>
                  </v-dialog>
                </v-btn>
              </template>
            </v-tooltip>
          </div>
        </td>
      </tr>
    </template>
    </tbody>
  </v-table>
  <v-pagination
    v-model="request.page"
    @update:modelValue="getSheets"
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
      <p class="my-auto"> {{ $t('Success!') }}</p>
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
import {ref, onMounted, reactive} from "vue";
import {useI18n} from "vue-i18n";
import TablePreloader from "@/components/tables/TablePreloader.vue";
import useAxiosGet from "@/composables/useAxiosGet";
import useAxiosDelete from "@/composables/useAxiosDelete";
// @ts-ignore
import saveAs from 'save-as'

const { t } = useI18n({useScope: "global"})
let loading = ref(true)

let response = ref({})

let tableData = ref([])
let request = reactive({
  page: 1,
  page_size: 10,
})
let pages = ref(1)

let successAlert = ref(false)
let errorAlert = ref(false)

function downloadScript(url,account_name,buyer,geo,campaign_name,keywords) {
  let kw = '['
  for (let i = 0; i < keywords.split(' ').length; i ++){
    kw = kw + " '" + keywords.split(' ')[i] + "', "
    if (i == keywords.split(' ').length - 1){
      kw = kw + ']'
    }
  }
  const blob = new Blob([`// version: 1.0.0

const REPORTING_OPTIONS = {
\tapiVersion: 'v201809'
};

// Данные которые будут браться из google ads
const REPORT_FIELDS = [
\t'Criteria', // = keyword
\t'Impressions',
\t'Clicks',
\t'Cost',
\t'SearchImpressionShare',
\t'TopImpressionPercentage',
\t'AbsoluteTopImpressionPercentage',
\t'CampaignId',
\t'CampaignName',
\t'AdGroupId',
\t'AdGroupName',
];

// Данные получаемые из бекенда сервиса keywords
const spreadsheedUrl = '${ url }';
const account = '${ account_name }';
const buyer = '${ buyer }';
const geo = '${ geo }';
const keitaro_campaign_name = '${ campaign_name}';
const keywords = ${ kw };

// Статичные переменные
const timezone = AdsApp.currentAccount().getTimeZone();
const currency = AdsApp.currentAccount().getCurrencyCode();

function main() {
\t// Получение вчерашнего дня
\tvar yesterday = new Date(new Date().getTime() - 24 * 3600 * 1000);

\t// Обращение к гугл таблице
\tvar spreadsheet = SpreadsheetApp.openByUrl(spreadsheedUrl);

\t// Установка временной зоны гугл таблицы, согласно аккаунту гугл адс
\tspreadsheet.setSpreadsheetTimeZone(AdsApp.currentAccount().getTimeZone());

\t// Получение последней даты в гугл таблице + 1 день. Или вчерашняя, если дата не найдена
\tlastDate = getFirstDayToCheck(spreadsheet, yesterday);

\t// Итерация по дням до вчерашнего дня
\twhile (lastDate.getDate() <= yesterday.getDate()) {

\t\t// Получение данных таблицы по дате
\t\tvar report = getReportRowForDate(lastDate);

\t\t// Форматирование полученных данных
\t\tdataFormatting(report);

\t\t// Запись даты согласно итерации в ячейку last_check гугл таблицы
\t\tspreadsheet.getRangeByName('last_check').setValue(lastDate);

\t\t// Прибавления одного дня к дате
\t\tlastDate.setDate(lastDate.getDate() + 1);
\t}
}

// Обработка и отправка данных
function dataFormatting(report) {

\t// Получение строк гугл адс
\tvar rows = report.rows();

\t// Итерация по списку строк гугл адс
\tfor (let value of rows) {
\t\t// Объявление переменных
\t\tvar topCount, absCount, impCount, impShare, clicksCount, totalCost = 0;
\t\t
\t\t// Парсинг элементов строки
\t\tvar keyword = value.Criteria; // ключевые слова

\t\tif (!keywords.includes(keyword)) {
\t\t\tcontinue;
\t\t}

\t\timpCount = value.Impressions; // показы
\t\tclicksCount = value.Clicks; // клики
\t\ttotalCost = parseFloat(value.Cost); // цена
\t\timpShare = value.SearchImpressionShare; // процент полученных показов в поиске
\t\ttopCount = parseFloat(impCount) * parseFloat(value.TopImpressionPercentage); // процент лучших показов
\t\tabsCount = parseFloat(value.Impressions) * parseFloat(value.AbsoluteTopImpressionPercentage); // абсолютный % показов

\t\t// Расчёт АБС и ТОП
\t\tif (impShare === '--') {
\t\t\timpShare = 0;
\t\t\tvar abs = 0;
\t\t\tvar top = 0;
\t\t} else {
\t\t\tvar abs = absCount / impCount;
\t\t\tvar top = topCount / impCount;
\t\t}

\t\t// Id и имена
\t\tvar campaignId, campaignName, adGroupId, adGroupName = 0;
\t\tcampaignId = value.CampaignId;
\t\tcampaignName = value.CampaignName;
\t\tadGroupId = value.AdGroupId;
\t\tadGroupName = value.AdGroupName;

\t\t// Приведение даты к ISO формату
\t\tisoDate = Utilities.formatDate(lastDate, AdsApp.currentAccount().getTimeZone(), 'yyyy-MM-dd');

\t\t// Отправка в гугл таблицу
\t\tvar values = [
\t\t\t[account, keyword, impCount, isoDate, clicksCount, totalCost, impShare, top, abs, timezone, buyer, geo,
\t\t\tcurrency, campaignId, campaignName, adGroupId, adGroupName, keitaro_campaign_name]
\t\t];
\t\tvar rows = report.rows();
\t\tpushTable(rows, values);
\t}
}

// Запись данных в таблицу гугл
function pushTable(rows, values) {
\tvar access = new SpreadsheetAccess(spreadsheedUrl, 'Report');
\tvar emptyRow = access.findEmptyRow(4, 2);
\tif (emptyRow < 0) {
\t\taccess.addRows(rows.length);
\t\temptyRow = access.findEmptyRow(4, 2);
\t}
\taccess.writeRows(values, emptyRow, 2);
}

// Получение доступа к таблице гугл
function SpreadsheetAccess(spreadsheetUrl, sheetName) {
\tthis.spreadsheet = SpreadsheetApp.openByUrl(spreadsheetUrl);
\tthis.sheet = this.spreadsheet.getSheetByName(sheetName);

\t// Поиск свободной строки гугл таблицы
\tthis.findEmptyRow = function(minRow, column) {
\t\tvar values = this.sheet.getRange(minRow, column,
\t\t\tthis.sheet.getMaxRows(), 1).getValues();
\t\tfor (var i = 0; i < values.length; i++) {
\t\t\tif (!values[i][0]) {
\t\t\t\treturn i + minRow;
\t\t\t}
\t\t}
\t\treturn -1;
\t};

\t// Добавление строк в гугл таблицу
\tthis.addRows = function(howMany) {
\t\tthis.sheet.insertRowsAfter(this.sheet.getMaxRows(), howMany);
\t};

\t// Запись данных в строки гугл таблицы
\tthis.writeRows = function(rows, startRow, startColumn) {
\t\tthis.sheet.getRange(startRow, startColumn, rows.length, rows[0].length).setValues(rows);
\t};
}


// Получение данных из гугл адс по переданной дате.
function getReportRowForDate(thisDate) {
\tvar timeZone = AdsApp.currentAccount().getTimeZone();
\tvar dateString = Utilities.formatDate(thisDate, timeZone, 'yyyyMMdd');
\tduring = dateString + ',' + dateString;

\tvar report = AdsApp.report(
\t\t'SELECT ' + REPORT_FIELDS
\t\t.map(function(field) {
\t\t\treturn field;
\t\t}).join(',') +
\t\t' FROM KEYWORDS_PERFORMANCE_REPORT ' +
\t\t'DURING ' + during,
\t\tREPORTING_OPTIONS);
\treturn report;
}

// Получение последней даты в гугл таблице + 1 день. Или вчерашняя, если дата не найдена
function getFirstDayToCheck(spreadsheet, yesterday) {
\tvar last_check = spreadsheet.getRangeByName('last_check').getValue();
\tvar lastDate;
\tif (last_check.length === 0) {
\t\tlastDate = new Date(yesterday);
\t} else {
\t\tlastDate = new Date(last_check);
\t\tlastDate.setDate(lastDate.getDate() + 1);
\t}
\treturn lastDate;
}
        `],
    { type: "text/plain;charset=utf-8" });
  saveAs(blob, 'script' + ' ' + account_name + `script.gs.js`)
}

async function getSheets () {
  response.value = await useAxiosGet(`/google-ads/sheet/?page=${request.page}&page_size=${request.page_size}`)
  tableData.value = response.value.responseData
  loading.value = response.value.loading
  pages.value = Math.ceil(response.value.items / 10)
  // console.log(tableData.value)
}

async function deleteSheet (id) {
  await useAxiosDelete(`/google-ads/sheet/delete/${id}`).then(() => {
    getSheets()
    successAlert.value = true
  })
}

onMounted(() => {
  getSheets()
})
</script>

<style lang="scss" scoped>
.sheet-list__th_account{
  width: 110px;
}
.sheet-list__th_geo{
  width: 60px;
}
.sheet-list__th_synchronized{
  width: 172px;
}
.sheet-list__th_actions{
  width: 200px;
  max-width: 200px;
  min-width: 200px;
}
</style>
