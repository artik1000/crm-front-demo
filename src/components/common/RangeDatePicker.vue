<template>
  <div class="currency-rates-date">
    <VueDatePicker
      v-model="date"
      range
      :partial-range="false"
      :month-change-on-scroll="false"
      text-input
      :placeholder="$t('Pick a dates')"
      type="date"
      format="dd/MM/yyyy"
      @update:model-value="handleDate"
      auto-apply
    >
      <template #time-picker="{ time, updateTime }">
        <v-row class="pa-4">
          <v-col cols="6">
            <v-btn
              variant="outlined"
              color="primary"
              elevation="0"
              size="small"
              block
              @click="setDate('today')"
            >
              {{$t('Today')}}
            </v-btn>
          </v-col>
          <v-col cols="6">
            <v-btn
              variant="outlined"
              color="primary"
              elevation="0"
              size="small"
              block
              @click="setDate('yesterday')"
            >
              {{$t('Yesterday')}}
            </v-btn>
          </v-col>
          <v-col cols="6">
            <v-btn
              variant="outlined"
              color="primary"
              elevation="0"
              size="small"
              block
              @click="setDate('this week')"
            >
              {{$t('This week')}}
            </v-btn>
          </v-col>
          <v-col cols="6">
            <v-btn
              variant="outlined"
              color="primary"
              elevation="0"
              size="small"
              block
              @click="setDate('last 7 days')"
            >
              {{$t('Last 7 days')}}
            </v-btn>
          </v-col>
          <v-col cols="6">
            <v-btn
              variant="outlined"
              color="primary"
              elevation="0"
              size="small"
              block
              @click="setDate('this month')"
            >
              {{$t('This month')}}
            </v-btn>
          </v-col>
          <v-col cols="6">
            <v-btn
              variant="outlined"
              color="primary"
              elevation="0"
              size="small"
              block
              @click="setDate('previous month')"
            >
              {{$t('Previous month')}}
            </v-btn>
          </v-col>
          <v-col cols="6">
            <v-btn
              variant="outlined"
              color="primary"
              elevation="0"
              size="small"
              block
              @click="setDate('last 30 days')"
            >
              {{$t('Last 30 days')}}
            </v-btn>
          </v-col>
          <v-col cols="6">
            <v-btn
              variant="outlined"
              color="primary"
              elevation="0"
              size="small"
              block
              @click="setDate('this year')"
            >
              {{$t('This year')}}
            </v-btn>
          </v-col>
          <v-col cols="12">
            <v-btn
              variant="outlined"
              color="primary"
              elevation="0"
              size="small"
              block
              @click="setDate('all time')"
            >
              {{$t('All time')}}
            </v-btn>
          </v-col>
        </v-row>
        <!--            <p class="current-selection">internalModelValue</p>-->
        <!--            <button class="select-button" @click="selectDate">Select Date</button>-->
      </template>
    </VueDatePicker>
  </div>
</template>

<script setup>
import {reactive, ref, defineEmits} from "vue";
let date = ref(null)
const emit = defineEmits(['handleDate'])

import {useI18n} from "vue-i18n";
const { t } = useI18n({useScope: "global"})

let today = new Date()

let yesterday = new Date()
yesterday.setDate(yesterday.getDate() - 1)

let wDate = new Date();
let dDay = wDate.getDay() > 0 ? wDate.getDay() : 7;
let first = wDate.getDate() - dDay + 1;
let firstDayWeek = new Date(wDate.setDate(first));
let lastDayWeek = new Date(wDate.setDate(firstDayWeek.getDate()+6));

let last7Days = new Date(today)
last7Days.setDate(last7Days.getDate() - 7)

let fd = getFirstDayOfMonth(
  today.getFullYear(),
  today.getMonth(),
);
let ld = getLastDayOfMonth(
  today.getFullYear(),
  today.getMonth(),
);

let fdl = getFirstDayOfMonth(
  today.getFullYear(),
  today.getMonth() - 1,
);
let ldl = getLastDayOfMonth(
  today.getFullYear(),
  today.getMonth() - 1,
);

let last30Days = new Date(today)
last30Days.setDate(last30Days.getDate() - 30)

let thisYear = today.getFullYear()

function getFirstDayOfMonth(year, month) {
  return new Date(year, month, 1);
}
function getLastDayOfMonth(year, month) {
  return new Date(year, month + 1, 0);
}

function setDate (range) {
  if (range === 'today') {
    date.value = [
      today,
      today
    ]
  }
  if (range === 'yesterday') {
    date.value = [
      yesterday,
      yesterday
    ]
  }
  if (range === 'this week') {
    date.value = [
      firstDayWeek,
      lastDayWeek
    ]
  }
  if (range === 'last 7 days') {
    date.value = [
      last7Days,
      today
    ]
  }
  if (range === 'this month') {
    date.value = [
      fd,
      ld
    ]
  }
  if (range === 'previous month') {
    date.value = [
      fdl,
      ldl
    ]
  }
  if (range === 'last 30 days') {
    date.value = [
      last30Days,
      today
    ]
  }
  if (range === 'this year') {
    date.value = [
      new Date(thisYear, 0, 1),
      new Date(thisYear, 11, 31)
    ]
  }
  if (range === 'all time') {
    date.value = [
      new Date('01.01.1999'),
      new Date('01.01.3000')
    ]
  }
  // console.log(date.value)
  handleDate()
}

// const emit = defineEmits<{
//   handleDate: [dates: any]
// }>()

function handleDate () {
  let date_parsed1 = new Date(date.value[0]).toLocaleDateString('fr-CA')
  let date_parsed2 = new Date(date.value[1]).toLocaleDateString('fr-CA')
  emit('handleDate', {
    from: date_parsed1,
    to: date_parsed2
  })
}
</script>

<style lang="scss" scoped>
.currency-rates-date{
  width: 360px !important;
}
:deep(.dp__input) {
  border: 0.5px solid rgb(var(--v-theme-contrast)) !important;
  border-radius: 8px !important;
  height: 40px;
  background-color: rgb(var(--v-theme-surface));
  color: rgb(var(--v-theme-on-surface));
}
:deep(.dp__input:hover) {
  border: 1px solid rgb(var(--v-theme-contrast)) !important;
}
:deep(.dp__input:focus) {
  border: 2px solid rgb(var(--v-theme-primary)) !important;
}
:deep(.dp__range_end) {
  background: rgb(var(--v-theme-primary)) !important;
}
:deep(.dp__active_date) {
  background: rgb(var(--v-theme-primary)) !important;
}
:deep(.dp__range_start) {
  background: rgb(var(--v-theme-primary)) !important;
}
:deep(.dp__menu_inner) {
  width: 360px !important;
  border-radius: 8px !important;
  background-color: rgb(var(--v-theme-surface));
  color: rgb(var(--v-theme-on-surface));
}
:deep(.dp__menu){
  background-color: rgb(var(--v-theme-surface));
  color: rgb(var(--v-theme-on-surface));
}
:deep(.dp__calendar_item){
  color: rgb(var(--v-theme-on-surface));
}
:deep(.dp__btn){
  color: rgb(var(--v-theme-on-surface));
}
:deep(.dp__btn:hover){
  color: rgb(var(--v-theme-on-dark));
}
:deep(.dp__calendar_header_item){
  color: rgb(var(--v-theme-on-surface));
}
:deep(.dp__range_between){
  background: rgba(var(--v-theme-primary), 0.3);
  color: rgb(var(--v-theme-on-surface));
  border: none;
}
.action-row {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 8px;
}
.v-col{
  padding: 4px !important;
}
</style>
