<template>
  <section>
    <v-card elevation="0" rounded="lg" class="common-card">
      <h1>{{$t('Logs')}}</h1>
      <div class="logs__from">
        <div class="logs__from__selects">
          <div class="common-input__wrapper logs__select_level">
            <v-select
              :label="$t('Level')"
              density="compact"
              variant="outlined"
              color="primary"
              hide-details
              v-model="request.level"
              :items="levels"
              @update:modelValue="getLogs"
            >
            </v-select>
          </div>
          <div class="common-input__wrapper logs__select_source">
            <v-select
              :label="$t('Sender')"
              density="compact"
              variant="outlined"
              color="primary"
              hide-details
              v-model="request.sender"
              :items="senders"
              @update:modelValue="getLogs"
            >
            </v-select>
          </div>
        </div>
      </div>
      <v-table class="mt-6 rounded-lg">
        <thead>
          <tr>
            <th></th>
            <th>{{$t('Level')}}</th>
            <th>{{$t('Sender')}}</th>
            <th>{{$t('Date')}}</th>
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
              <td>
                  <v-icon v-if="row.user" icon="mdi-account" class="ma-3"></v-icon>
                  <v-icon v-else="row.user" icon="mdi-account-multiple" class="ma-3"></v-icon>
              </td>
              <td>
                <div class="level-text " :class="`text-${row.level}`">
                  <template v-if="row.level == 0">
                    NOTSET
                  </template>
                  <template v-if="row.level == 10">
                    DEBUG
                  </template>
                  <template v-if="row.level == 20">
                    INFO
                  </template>
                  <template v-if="row.level == 30">
                    WARNING
                  </template>
                  <template v-if="row.level == 40">
                    ERROR
                  </template>
                  <template v-if="row.level == 50">
                    CRITICAL
                  </template>
                </div>
              </td>
              <td>
                <p class="mx-4 mt-1">{{ row.sender }}</p>
                <p class="mx-4 mb-1"><b>{{ row.title }}</b></p>
              </td>
              <td><p class="mx-4"><td><p class="mx-4">{{ new Date(row.datetime).toLocaleDateString('ru-RU')}} {{ new Date(row.datetime).toLocaleTimeString('ru-RU') }}</p></td></p></td>
            </tr>
          </template>
        </tbody>
      </v-table>
      <v-pagination
        v-model="request.page"
        @update:modelValue="getLogs"
        :length="pages"
        :total-visible="5"
        color="primary"
        class="mt-6"
      ></v-pagination>
    </v-card>
  </section>
</template>

<script lang="ts" setup>
import {ref, onMounted, reactive} from "vue";
import {useI18n} from "vue-i18n";
import TablePreloader from "@/components/tables/TablePreloader.vue";
import useAxiosGet from "@/composables/useAxiosGet";

const { t } = useI18n({useScope: "global"})
let loading = ref(true)
let response = ref({})
let tableData = ref([])
let request = reactive({
  level: null,
  sender: '',
  page: 1,
  page_size: 10,
})
let pages = ref(1)

let levels = ref([
  {title: t('All'), value: ''},
  {title: 'NOTSET', value: 0},
  {title: 'DEBUG', value: 10},
  {title: 'INFO', value: 20},
  {title: 'WARNING', value: 30},
  {title: 'ERROR', value: 40},
  {title: 'CRITICAL', value: 50},
])

let senders = ref([
  {title: t('All'), value: ''}
])

async function getLogs () {
  response.value = await useAxiosGet(
    `logs/?page=${request.page}&page_size=${request.page_size}&sender=${request.sender}&level=${request.level}`
  )
  tableData.value = response.value.responseData
  loading.value = response.value.loading
  pages.value = Math.ceil(response.value.items / 10)
  setSenders()
}

function setSenders () {
  for (let i = 0; i < tableData.value.length; i++){
    if (!senders.value.find(e => e.title == tableData.value[i].sender)){
      if (tableData.value[i].sender){
        senders.value.push({
          title: tableData.value[i].sender,
          value: tableData.value[i].sender
        })
      }
    }
  }
}
onMounted(() => {
  getLogs()
})
</script>

<style scoped lang="scss">
td{
  padding: 0 !important;
}
th{
}
th:nth-child(1){
  width: 50px;
}
th:nth-child(2){
  width: 115px;
}
th:nth-child(4){
  width: 190px;
}
th:last-child{
  border-top-right-radius: 8px;
}
.level-text{
  height: 100%;
  display: flex;
  justify-content: center;
  align-content: center;
  align-items: center;
}
.text-0{
  color: rgb(var(--v-theme-contrast)) !important;

}
.text-10{
  color: rgb(var(--v-theme-primary)) !important;

}
.text-20{
  color: rgb(var(--v-theme-success)) !important;

}
.text-30{
  color: rgb(var(--v-theme-warning)) !important;

}
.text-40{
  color: rgb(var(--v-theme-error)) !important;

}
.text-50{
  color: white !important;
  background: rgb(var(--v-theme-error)) !important;

}
.logs__from{
  margin-top: 24px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.logs__from__selects {
  display: flex;
  flex-direction: row;
  gap: 16px;
}
.logs__select_level{
  width: 180px;
  max-width: 180px;
}
.logs__select_source{
  width: 500px;
  max-width: 500px;
}
p{
  line-height: 20px;
}
</style>
