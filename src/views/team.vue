<template>
  <section>
    <v-card elevation="0" rounded="lg" class="common-card">
      <h1>{{$t('My team')}}</h1>
        <v-table class="mt-6">
          <thead>
          <tr>
            <th>{{ $t('Login')}}</th>
            <th>{{ $t('First name')}}</th>
            <th>{{ $t('Last name')}}</th>
            <th>{{ $t('Last date of login')}}</th>
            <th class="user-list__td_actions">{{ $t('Actions')}}</th>
          </tr>
          </thead>
          <TablePreloader
            v-if="loading"
            :width="5"
            :height="10"
          />
          <tbody v-else>
          <template v-for="item in tableData" :key="item.id">
            <tr>
              <td>{{ item.username }}</td>
              <td>{{ item.first_name }}</td>
              <td>{{ item.last_name }}</td>
              <td>{{ new Date(item.date_joined).toLocaleDateString() }}</td>
              <td>
                <div class="d-flex justify-center align-content-center">
                  <v-btn
                    elevation="0"
                    color="primary"
                    @click="loginAs(item.id)"
                  >
                    {{ $t('Log in') }}
                  </v-btn>
                </div>
              </td>
            </tr>
          </template>
          </tbody>
        </v-table>
    </v-card>
  </section>
</template>

<script lang="ts" setup>
import TablePreloader from "@/components/tables/TablePreloader.vue";


import { ref, onMounted, reactive } from "vue";


import {useI18n} from "vue-i18n";
const { t } = useI18n({useScope: "global"})
import { useCookies } from "vue3-cookies";
const { cookies } = useCookies();
import { useAppStore } from "@/store/app";
const store = useAppStore()


import useAxiosGet from "@/composables/useAxiosGet";
import useAxiosPost from "@/composables/useAxiosPost";

let response = ref({})
let pr = ref({})
let tableData = reactive([])
let loading = ref(true)

async function getTeam () {
  response.value = await useAxiosGet('/accounts/team/')
  tableData = response.value.responseData
  loading.value = response.value.loading
}

async function loginAs (id: number) {
  pr.value = await useAxiosPost(`accounts/login-as/${id}/`)
  cookies.remove('ex-token', '/', window.location.hostname)
  cookies.set("ex-token",
    cookies.get("token"),
    "",
    "/",
    window.location.hostname,
    true,
    "None"
  )
  cookies.remove('token', '/', window.location.hostname)
  cookies.set("token",
    pr.value.response.data.token,
    "",
    "/",
    window.location.hostname,
    true,
    "None"
  )
  localStorage.removeItem('ex-username')
  localStorage.removeItem('ex-firstname')
  localStorage.removeItem('ex-lastname')
  localStorage.removeItem('ex-buyer')

  localStorage.setItem('ex-buyer',localStorage.getItem('buyer'))
  localStorage.setItem('ex-firstname', localStorage.getItem('firstname'))
  localStorage.setItem('ex-lastname', localStorage.getItem('lastname'))
  localStorage.setItem('ex-username', localStorage.getItem('username'))

  localStorage.removeItem('username')
  localStorage.removeItem('firstname')
  localStorage.removeItem('lastname')
  localStorage.removeItem('buyer')

  localStorage.setItem('buyer',pr.value.response.data.buyer)
  localStorage.setItem('firstname',pr.value.response.data.firstame)
  localStorage.setItem('lastname',pr.value.response.data.lastname)
  localStorage.setItem('username',pr.value.response.data.username)

  store.userdataKey += 1

  window.location.reload()
}

onMounted(() => {
  getTeam()
})
</script>

<style lang="scss" scoped>
.user-list__td_actions{
  width: 100px;
  text-align: center !important;
}
</style>
