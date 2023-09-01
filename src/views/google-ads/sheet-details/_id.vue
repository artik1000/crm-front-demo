<template>
  <h1 class="mb-6">{{$t('Sheet Details')}}</h1>
  <v-table class="sheet-view">
    <tbody>
    <tr
      v-for="(item, name, index) in tableData"
      :key="item.id"
    >
      <td>
        <b>{{ $t(`${name}`) }}</b>
      </td>
      <td v-if="name == 'keitaro_campaign'">
        {{ item.campaign_name }}
      </td>
      <td v-else-if="name == 'user'">
        {{ item.buyer }}
      </td>
      <td v-else-if="name == 'url'">
        <a class="text-primary" :href="item">{{ item }}</a>
      </td>
      <td v-else-if="name == 'created_at'">
        {{ new Date(item).toLocaleDateString('ru-RU')}} {{ new Date(item).toLocaleTimeString('ru-RU') }}
      </td>
      <td v-else-if="name == 'updated_at'">
        {{ new Date(item).toLocaleDateString('ru-RU')}} {{ new Date(item).toLocaleTimeString('ru-RU') }}
      </td>
      <td v-else-if="name == 'sync_at'">
        {{ new Date(item).toLocaleDateString('ru-RU')}} {{ new Date(item).toLocaleTimeString('ru-RU') }}
      </td>
      <td v-else-if="name == 'is_active'">
        <span v-if="item == 'true'">
          {{$t('Yes')}}
        </span>
        <span v-else>
          {{$t('No')}}
        </span>
      </td>
      <td v-else>
        {{ item }}
      </td>
    </tr>
    <tr>
      <td><b>{{$t('Script')}}</b></td>
      <td class="pl-4 pr-0">
        <textarea
          cols="40" rows="12"
          class="sheet-view__script-field"
          :value="script"
        ></textarea>
      </td>
    </tr>
    </tbody>
  </v-table>
  <div class="sheet-data__btns-row pa-6">
    <v-btn
      color="secondary"
      elevation="0"
      class="align-self-end text-primary"
      @click="downloadScript"
    >
      {{ $t('Download script') }}
    </v-btn>
    <v-btn
      color="primary"
      elevation="0"
      class="align-self-end"
      :to="{ name: 'Google Ads sheet edit', params: { id: tableData.id }}"
    >
      {{ $t('Edit') }}
    </v-btn>
  </div>
  <v-snackbar
    v-model="successAlert"
    multi-line
    location="top right"
    class="snackbar"
    variant="flat"
    color="success"
    width="280px"
    min-width="280px"
    max-width="280px"
  >
    <div class="d-flex flex-row align-items-center" style="justify-content: space-between;">
      <v-icon icon="mdi-check-circle" class="my-auto mr-3" style="font-size: 30px"></v-icon>
      <p class="my-auto">{{ $t('Script downloaded') }}</p>
      <v-btn
        elevation="0"
        icon="mdi-close"
        color="transparent"
        class="my-auto"
        @click="successAlert = false"
      ></v-btn>
    </div>
  </v-snackbar>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import useAxiosGet from "@/composables/useAxiosGet";
// @ts-ignore
import saveAs from 'save-as'
import { useRoute } from 'vue-router';
const route = useRoute()

let successAlert = ref(false)
let response = ref({})
let tableData = ref([])

async function getCampaignData() {
  response.value = await useAxiosGet(route.path)
  tableData.value = response.value.responseData
  console.log(tableData.value)
  await formerScript()
}

let script = ref(``)

function formerScript () {
  let kw = '['
  for (let i = 0; i < tableData.value.keywords.split(' ').length; i ++){
    kw = kw + " '" + tableData.value.keywords.split(' ')[i] + "', "
    if (i == tableData.value.keywords.split(' ').length - 1){
      kw = kw + ']'
    }
  }
  script.value = `// version: 1.0.0

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
const spreadsheedUrl = '${ tableData.value.url }';
const account = '${ tableData.value.account_name }';
const buyer = '${ tableData.value.user.buyer }';
const geo = '${ tableData.value.geo }';
const keitaro_campaign_name = '${ tableData.value.keitaro_campaign.campaign_name }';
const keywords = ${kw};

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
        `
}
//
function downloadScript() {
  const blob = new Blob([script.value],
    { type: "text/plain;charset=utf-8" });
  saveAs(blob, 'script' + ' ' + tableData.value.account_name + `script.gs.js`)

}
//
// function copyScript() {
//
// }


onMounted(() => {
  getCampaignData()
})

</script>

<style lang="scss" scoped>
.sheet-view__script-field:focus{
  border: none;
  outline: none;
}
</style>
