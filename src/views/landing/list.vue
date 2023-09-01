<template>
  <div class="d-flex flex-row justify-space-between">
    <h1>{{$t('Landings archive list')}}</h1>
    <v-btn
      :to="{ name: 'Landing add' }"
      color="primary"
      class="common-btn"
      elevation="0"
      prepend-icon="mdi-plus"
    >
      {{$t('Add')}}
    </v-btn>
  </div>
  <div style="overflow: scroll; margin-top: 24px" class="table-wrapper-big">
    <table id="tableId" class="resizable landings-table">
      <thead>
      <tr>
        <th style="width: 56px;"><v-icon icon="mdi-lan-connect" class="mx-1"></v-icon></th>
        <th style="width: 56px;"><v-icon icon="mdi-file-check-outline" class="mx-1"></v-icon></th>
        <th>{{$t('Domain')}}</th>
        <th>{{$t('Synchronized')}}</th>
        <th>{{$t('Geo')}}</th>
        <th>{{$t('Account')}}</th>
        <th>{{$t('Session')}}</th>
        <th>{{$t('Actions')}}</th>
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
            <div v-if="row.connection_status === true || row.connection_status === 'True'" class="dot-green"></div>
            <div v-else-if="row.connection_status === false || row.connection_status === 'False'" class="dot-red"></div>
            <div v-else class="dot-gray"></div>
          </td>
          <td>
            <div v-if="row.deploy_status === true || row.deploy_status === 'True'" class="dot-green"></div>
            <div v-else-if="row.deploy_status === false || row.deploy_status === 'False'" class="dot-red"></div>
            <div v-else class="dot-gray"></div>
          </td>
          <td><div class="table-cell__content">{{ row.domain }}</div></td>
          <td class="pa-1 text-center">{{ new Date(row.sync_at).toLocaleDateString('ru-RU')}} {{ new Date(row.sync_at).toLocaleTimeString('ru-RU') }}</td>
          <td><div class="table-cell__content">{{ row.geo }}</div></td>
          <td><div class="table-cell__content">{{ row.user.buyer }}</div></td>
          <td>
            <div class="table-cell__content">
              <v-tooltip :text="$t('Copy to clipboard')" location="bottom">
                <template v-slot:activator="{ props }">
                  <v-btn
                    elevation="0"
                    v-bind="props"
                    class="px-0"
                    style="text-transform: capitalize !important;"
                    @click="copy(row.session)"
                  >
                    {{ row.session }}
                  </v-btn>
                </template>
              </v-tooltip>
            </div>
          </td>
          <td>
                      <div class="icons-cell">
                        <v-tooltip :text="$t('Send to server')" location="bottom">
                          <template v-slot:activator="{ props }">
                            <v-btn
                              icon="mdi-file-export-outline"
                              size="big"
                              elevation="0"
                              v-bind="props"
                              class="p-0 table-icon"
                              :ripple="false"
                              @click="sendToServer(row.id)"
                            >
                            </v-btn>
                          </template>
                        </v-tooltip>
                        <v-tooltip :text="$t('Open site in new tab')" location="bottom">
                          <template v-slot:activator="{ props }">
                            <v-btn
                              icon="mdi-link-variant"
                              elevation="0"
                              size="big"
                              v-bind="props"
                              class="p-0 table-icon"
                              :ripple="false"
                              tag="a"
                              target="_blank"
                              :href="`https://${row.domain}`"
                            >
                            </v-btn>
                          </template>
                        </v-tooltip>
                        <v-tooltip :text="$t('Edit and view')" location="bottom">
                          <template v-slot:activator="{ props }">
                            <v-btn
                              icon="mdi-lead-pencil"
                              elevation="0"
                              size="big"
                              v-bind="props"
                              class="p-0 table-icon"
                              :ripple="false"
                              :to="{ name: 'Landing edit', params: { id: row.id }}"
                            >
                            </v-btn>
                          </template>
                        </v-tooltip>
                        <v-tooltip :text="$t('Remove')" location="bottom">
                          <template v-slot:activator="{ props }">
                            <v-btn
                              icon="mdi-trash-can-outline"
                              elevation="0"
                              size="big"
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
                                      {{$t('Are you sure you want to remove the landing data from the table?')}}
                                    </p>
                                    <div class="common-popup__bts-row">
                                      <v-btn
                                        color="primary"
                                        elevation="0"
                                        type="submit"
                                        @click="deleteLanding(row.id); isActive.value = false;"
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
    </table>
    <v-pagination
      v-model="request.page"
      @update:modelValue="getLandings"
      :length="pages"
      :total-visible="5"
      color="primary"
      class="mt-6"
    ></v-pagination>
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
let pages = ref(1)

let tableData = ref([])
let request = reactive({
  page: 1,
  page_size: 10,
})

let successAlert = ref(false)
let errorAlert = ref(false)

async function getLandings () {
  response.value = await useAxiosGet(`/landing/list/?page=${ request.page }&page_size=${ request.page_size }`)
  tableData.value = response.value.responseData
  loading.value = response.value.loading
  console.log(tableData.value)
  pages.value = Math.ceil(response.value.items / 10)
}

async function deleteLanding (id) {
  await useAxiosDelete(`/landing/delete/${id}`).then(() => {
    getLandings()
    successAlert.value = true
  })
}

function copy(session) {
  successAlert.value = true
  navigator.clipboard.writeText(session)
}

function resizebleColumns() {
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

let response2 = ref([])

async function sendToServer (id) {
  response2.value = await useAxiosGet(`/landing/send_to_server/${id}/`)
  console.log(response2.value)
}

onMounted(() => {
  resizebleColumns()
  getLandings()
})
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
}
.resizable thead tr{
  background-color: rgb(var(--v-theme-secondary));
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
.landings-table{
  width: 100%;
}
.landings-table th:nth-child(1){
  width: 50px;
}
.landings-table th:nth-child(2){
  width: 50px;
}
.landings-table th:nth-child(3){
  width: 110px;
}
.landings-table th:nth-child(4){
  width: 110px;
}
.landings-table th:nth-child(5){
  width: 50px;
}
.landings-table th:nth-child(6){
  width: 70px;
}
.landings-table th:nth-child(7){
  width: calc(100% - 390px);
}
.landings-table th:nth-child(8){
  width: 180px;
}
</style>
