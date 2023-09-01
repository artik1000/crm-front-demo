<template>
  <div class="landing-edit__wrapper">
    <div class="landing-edit__forms-all">
    <div
      class="landing-edit__forms"
      :class="showForm ? '' : 'hide-form'"
    >
      <div>
        <v-btn
          icon="mdi-home"
          color="primary"
          rounded="lg"
          class="mb-4 mt-4 ml-4 mr-0"
          to="/"
        >
        </v-btn>
        <v-btn
          icon="mdi-eye"
          color="primary"
          rounded="lg"
          class="mb-4 mt-4 mx-4"
          @click="showForm = !showForm"
        >
        </v-btn>
        <v-btn
          icon="mdi-content-save"
          color="primary"
          rounded="lg"
          class="mb-4 mt-4 mr-4"
          @click="putLanding()"
        >
        </v-btn>
        <v-btn
          icon="mdi-restore"
          color="primary"
          rounded="lg"
          class="mb-4 mt-4 mr-4"
          @click="resetLanding"
        >
        </v-btn>
        <template v-if="showForm">
          <v-btn
            icon="mdi-lan-connect"
            :color="landingData.connection_status === 'True' ? 'success': landingData.connection_status === 'False' ? 'error': 'secondary'"
            rounded="lg"
            class="mb-4 mt-4 mr-4"
            disabled
            :title="$t('Connection status')"
          >
          </v-btn>
          <v-btn
            icon="mdi-file-check-outline"
            :color="landingData.deploy_status === 'True' ? 'success': landingData.deploy_status === 'False' ? 'error': 'secondary'"
            rounded="lg"
            class="mb-4 mt-4 mr-4"
            disabled
            :title="$t('Deploy status')"
          >
          </v-btn>
        </template>
      </div>

      <div class="landing-edit__forms" v-show="showForm">
        <v-expansion-panels variant="accordion" style="max-width: 400px">
          <v-expansion-panel>
            <v-expansion-panel-title>
              {{ $t('Main data') }}
            </v-expansion-panel-title>
            <v-expansion-panel-text>
              <v-text-field
                v-model="mainData.domain"
                variant="outlined"
                density="compact"
                class="mb-3"
                color="primary"
                :label="$t('Domain')"
                :error-messages="(v$?.domain?.$error) ? v$.domain.$errors[0].$message : ''"
              />
              <v-text-field
                v-model="mainData.domain_ip"
                variant="outlined"
                density="compact"
                class="mb-3"
                color="primary"
                :label="$t('Domain ip')"
                :error-messages="(v$?.domain_ip?.$error) ? v$.domain_ip.$errors[0].$message : ''"
              />
              <v-select
                v-model="mainData.geo"
                :items="geo"
                variant="outlined"
                :label="$t('Geo')"
                density="compact"
                class="mb-3"
                color="primary"
                :error-messages="(v$?.geo?.$error) ? v$.geo.$errors[0].$message : ''"
              />
              <v-text-field
                v-model="mainData.site_name"
                variant="outlined"
                density="compact"
                class="mb-3"
                color="primary"
                :label="$t('Site name')"
                :error-messages="(v$?.site_name?.$error) ? v$.site_name.$errors[0].$message : ''"
              />
              <v-text-field
                v-model="mainData.server_password"
                variant="outlined"
                class="mb-3"
                :label="$t('Server password')"
                density="compact" color="primary"
                :error-messages="(v$?.server_password?.$error) ? v$.server_password.$errors[0].$message : ''"
              />
              <v-text-field
                v-model="mainData.server_ip"
                variant="outlined"
                class="mb-3"
                :label="$t('Server ip')"
                density="compact" color="primary"
                :error-messages="(v$?.server_ip?.$error) ? v$.server_ip.$errors[0].$message : ''"
              />
              <v-textarea
                v-model="mainData.session"
                variant="outlined"
                class="mb-3"
                :label="$t('session')"
                rows="10" color="primary"
                :error-messages="(v$?.session?.$error) ? v$.session.$errors[0].$message : ''"
              />
            </v-expansion-panel-text>
          </v-expansion-panel>
          <v-expansion-panel>
            <v-expansion-panel-title>
              {{ $t('Content') }}
            </v-expansion-panel-title>
            <v-expansion-panel-text>
              <v-textarea v-model="landingData.text" variant="outlined" color="primary" :label="$t('Text')" rows="7">

              </v-textarea>
            </v-expansion-panel-text>
          </v-expansion-panel>
          <v-expansion-panel>
            <v-expansion-panel-title>
              {{ $t('Page constructor') }}
            </v-expansion-panel-title>
            <v-expansion-panel-text @click="landingKey += 1">
              <p class="text-center mb-4">{{ $t('Columns') }}</p>
              <div class="d-flex justify-center">
                <v-btn-toggle
                  color="primary"
                  density="compact"
                  rounded="pill"
                  style="border: 1px solid #EEEEEE"
                  class="mb-4"
                  v-model="landingData.grid"
                  mandatory
                >
                  <v-btn value="3"> 3 </v-btn>
                  <v-btn value="4"> 4 </v-btn>
                  <v-btn value="5"> 5 </v-btn>
                </v-btn-toggle>
              </div>
              <p class="text-center mb-4">{{ $t('Header type') }}</p>
              <div class="d-flex justify-center">
                <v-btn-toggle
                  color="primary"
                  density="compact"
                  rounded="pill"
                  style="border: 1px solid #EEEEEE"
                  class="mb-4"
                  v-model="landingData.header"
                  mandatory
                >
                  <v-btn value="1"> 1 </v-btn>
                  <v-btn value="2"> 2 </v-btn>
                  <v-btn value="3"> 3 </v-btn>
                  <v-btn value="4"> 4 </v-btn>
                  <v-btn value="5"> 5 </v-btn>
                </v-btn-toggle>
              </div>
              <p class="text-center mb-4">{{ $t('Slots area type') }}</p>
              <div class="d-flex justify-center">
                <v-btn-toggle
                  color="primary"
                  density="compact"
                  rounded="pill"
                  style="border: 1px solid #EEEEEE"
                  class="mb-4"
                  v-model="landingData.main"
                >
                  <v-btn value="1"> 1 </v-btn>
                  <v-btn value="2"> 2 </v-btn>
                  <v-btn value="3"> 3 </v-btn>
                  <v-btn value="4"> 4 </v-btn>
                  <v-btn value="5"> 5 </v-btn>
                </v-btn-toggle>
              </div>
              <p class="text-center mb-4">{{ $t('Footer type') }}</p>
              <div class="d-flex justify-center">
                <v-btn-toggle
                  color="primary"
                  density="compact"
                  rounded="pill"
                  style="border: 1px solid #EEEEEE"
                  class="mb-4"
                  v-model="landingData.footer"
                  mandatory
                >
                  <v-btn value="1"> 1 </v-btn>
                  <v-btn value="2"> 2 </v-btn>
                  <v-btn value="3"> 3 </v-btn>
                  <v-btn value="4"> 4 </v-btn>
                  <v-btn value="5"> 5 </v-btn>
                </v-btn-toggle>
              </div>
              <p class="text-center mb-4">{{ $t('Card type') }}</p>
              <div class="d-flex justify-center">
                <v-btn-toggle
                  color="primary"
                  density="compact"
                  rounded="pill"
                  style="border: 1px solid #EEEEEE"
                  class="mb-4"
                  v-model="landingData.card_rounded"
                  mandatory
                >
                  <v-btn value="1"> 1 </v-btn>
                  <v-btn value="2"> 2 </v-btn>
                  <v-btn value="3"> 3 </v-btn>
                  <v-btn value="4"> 4 </v-btn>
                  <v-btn value="5"> 5 </v-btn>
                </v-btn-toggle>
              </div>
              <p class="text-center mb-4">{{ $t('Buttons type') }}</p>
              <div class="d-flex justify-center">
                <v-btn-toggle
                  color="primary"
                  density="compact"
                  rounded="pill"
                  style="border: 1px solid #EEEEEE"
                  class="mb-4"
                  v-model="landingData.buttons_rounded"
                  mandatory
                >
                  <v-btn value="1"> 1 </v-btn>
                  <v-btn value="2"> 2 </v-btn>
                  <v-btn value="3"> 3 </v-btn>
                  <v-btn value="4"> 4 </v-btn>
                  <v-btn value="5"> 5 </v-btn>
                </v-btn-toggle>
              </div>
            </v-expansion-panel-text>
          </v-expansion-panel>
          <v-expansion-panel>
            <v-expansion-panel-title>
              {{ $t('Color scheme') }}
            </v-expansion-panel-title>
            <v-expansion-panel-text>
              <div class="landing-edit__colors__wrapper">
                <v-btn
                  elevation="0"
                  rounded="pill"
                  v-for="scheme in colors"
                  :color="landingData.color_scheme === scheme.id || landingData.color_scheme === scheme.id.toString() ? 'primary' : 'secondary'"
                  @click="landingData.color_scheme = scheme.id"
                  :key="scheme.id"
                >
                  <p class="pr-2">#{{ scheme.id }}</p>
                  <div class="landing-edit__colors__picker">
                    <div class="landing-edit__colors__square" :style="`background:` + scheme.color_1">
                    </div>
                    <div class="landing-edit__colors__square" :style="`background:` + scheme.color_2">
                    </div>
                    <div class="landing-edit__colors__square" :style="`background:` + scheme.color_3">
                    </div>
                  </div>
                </v-btn>
              </div>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
      </div>
    </div>
    </div>
    <div class="landing" :key="landingKey">
      <div :class="`buttons-rounded-${ landingData.buttons_rounded } color-scheme-${ landingData.color_scheme } card-rounded-${ landingData.card_rounded }`"
      >
        <div class="body">
        <LandingHeader1
          v-if="landingData.header === 1 || landingData.header === '1'"
          :site_name="landingData.site_name"
        />
        <LandingHeader2
          v-if="landingData.header === 2 || landingData.header === '2'"
          :site_name="landingData.site_name"
        />
        <LandingHeader3
          v-if="landingData.header === 3 || landingData.header === '3'"
          :site_name="landingData.site_name"
        />
        <LandingHeader4
          v-if="landingData.header === 4 || landingData.header === '4'"
          :site_name="landingData.site_name"
        />
        <LandingHeader5
          v-if="landingData.header === 5 || landingData.header === '5'"
          :site_name="landingData.site_name"
        />

        <LandingMain1
          v-if="landingData.main === 1 || landingData.main === '1'"
          :slots="slots"
          :text="landingData.text"
          :grid="parseInt(landingData.grid)"
          :buttons_rounded="landingData.buttons_rounded"
          :color_scheme="landingData.color_scheme"
          :card_rounded="landingData.card_rounded"
        />
        <LandingMain2
          v-if="landingData.main === 2 || landingData.main === '2'"
          :slots="slots"
          :text="landingData.text"
          :grid="parseInt(landingData.grid)"
          :buttons_rounded="landingData.buttons_rounded"
          :color_scheme="landingData.color_scheme"
          :card_rounded="landingData.card_rounded"
        />
        <LandingMain3
          v-if="landingData.main === 3 || landingData.main === '3'"
          :slots="slots"
          :text="landingData.text"
          :grid="parseInt(landingData.grid)"
          :buttons_rounded="landingData.buttons_rounded"
          :color_scheme="landingData.color_scheme"
          :card_rounded="landingData.card_rounded"
        />
        <LandingMain4
          v-if="landingData.main === 4 || landingData.main === '4'"
          :slots="slots"
          :text="landingData.text"
          :grid="parseInt(landingData.grid)"
          :buttons_rounded="landingData.buttons_rounded"
          :color_scheme="landingData.color_scheme"
          :card_rounded="landingData.card_rounded"
        />
        <LandingMain5
          v-if="landingData.main === 5 || landingData.main === '5'"
          :slots="slots"
          :text="landingData.text"
          :grid="parseInt(landingData.grid)"
          :buttons_rounded="landingData.buttons_rounded"
          :color_scheme="landingData.color_scheme"
          :card_rounded="landingData.card_rounded"
        />

        <LandingFooter1
          v-if="landingData.footer === 1 || landingData.footer === '1'"
        />
        <LandingFooter2
          v-if="landingData.footer === 2 || landingData.footer === '2'"
          :site_name="landingData.site_name"
        />
        <LandingFooter3
          v-if="landingData.footer === 3 || landingData.footer === '3'"
          :site_name="landingData.site_name"
        />
        <LandingFooter4
          v-if="landingData.footer === 4 || landingData.footer === '4'"
          :site_name="landingData.site_name"
        />
        <LandingFooter5
          v-if="landingData.footer === 5 || landingData.footer === '5'"
          :site_name="landingData.site_name"
        />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import useAxiosPost from "@/composables/useAxiosPost";
import useAxiosPut from "@/composables/useAxiosPut";
import { useRouter } from 'vue-router'
const router = useRouter()
const { t } = useI18n({ useScope: "global" })
import { useVuelidate } from "@vuelidate/core"
import { useRules } from "@/composables/validationRules";
import useAxiosGet from "@/composables/useAxiosGet";
import { useAppStore } from "@/store/app";
const geo = useAppStore().geo
import LandingHeader1 from "@/components/landings/headers/LandingHeader1.vue";
import LandingHeader2 from "@/components/landings/headers/LandingHeader2.vue";
import LandingHeader3 from "@/components/landings/headers/LandingHeader3.vue";
import LandingHeader4 from "@/components/landings/headers/LandingHeader4.vue";
import LandingHeader5 from "@/components/landings/headers/LandingHeader5.vue";
import LandingMain1 from "@/components/landings/mains/LandingMain1.vue";
import LandingMain2 from "@/components/landings/mains/LandingMain2.vue";
import LandingMain3 from "@/components/landings/mains/LandingMain3.vue";
import LandingMain4 from "@/components/landings/mains/LandingMain4.vue";
import LandingMain5 from "@/components/landings/mains/LandingMain5.vue";
import LandingFooter1 from "@/components/landings/footers/LandingFooter1.vue";
import LandingFooter2 from "@/components/landings/footers/LandingFooter2.vue";
import LandingFooter3 from "@/components/landings/footers/LandingFooter3.vue";
import LandingFooter4 from "@/components/landings/footers/LandingFooter4.vue";
import LandingFooter5 from "@/components/landings/footers/LandingFooter5.vue";


const rules = {
  domain: useRules().value.domain,
  domain_ip: useRules().value.domain_ip,
  site_name: useRules().value.site_name,
  geo: useRules().value.geo,
  session: useRules().value.session,
  server_ip: useRules().value.server_ip,
  server_password: useRules().value.server_password,
}

let mainData = ref({
  domain: '',
  domain_ip: '',
  site_name: '',
  geo: null,
  session: '',
  server_ip: '',
  server_password: '',
})

let landingData = ref({
  domain: '',
  domain_ip: '',
  site_name: '',
  geo: null,
  session: '',
  server_ip: '',
  server_password: '',
  text: '',
  grid: null,
  color_scheme: null,
  img_rounded: null,
  card_rounded: null,
  buttons_rounded: null,
  header: null,
  main: null,
  footer: null,
  font: null,
  slot: []
})

const v$ = useVuelidate(rules, mainData.value);

let successAlert = ref(false)
let errorAlert = ref(false)
let pr = ref({})
let response = ref({})
let loading = ref(true)

let showForm = ref(true)
let landingKey = ref(0)

let slots = ref([])

async function getSlotsData() {
  slots.value = []
  for (let i = 0; i < landingData.value.slot.length; i++){
    let s = {
      items: 0,
      loading: false,
      responseData: {}
    }
    s = await useAxiosGet(`landing/view_slot/${ landingData.value.slot[i] }/`)
    slots.value.push(s.responseData)
  }
}

async function getLanding() {
  response.value = await useAxiosGet(window.location.pathname.replace('edit', 'view') + '/')
  landingData.value = response.value.responseData
  loading.value = response.value.loading
  mainData.value.domain = landingData.value.domain
  mainData.value.domain_ip = landingData.value.domain_ip
  mainData.value.site_name = landingData.value.site_name
  mainData.value.geo = landingData.value.geo
  mainData.value.session = landingData.value.session
  mainData.value.server_ip = landingData.value.server_ip
  mainData.value.server_password = landingData.value.server_password
  console.log(landingData.value)
  getSlotsData()
}

const colors = ref([
  {
    id: 1,
    color_1: '#3167FF',
    color_2: '#F4F4F4',
    color_3: '#F8BAFF'
  },
  {
    id: 2,
    color_1: '#d20202',
    color_2: '#35654d',
    color_3: '#a58d00'
  },
  {
    id: 3,
    color_1: '#fec82f',
    color_2: '#fbfbfb',
    color_3: '#2e2d2c'
  },
  {
    id: 4,
    color_1: '#213363',
    color_2: '#D3D04F',
    color_3: '#17594A'
  },
  {
    id: 5,
    color_1: '#F7B32D',
    color_2: '#C00000',
    color_3: '#F8F9FC'
  },
  {
    id: 6,
    color_1: '#F94A29',
    color_2: '#D61355',
    color_3: '#30E3DF'
  },
  {
    id: 7,
    color_1: '#F94A29',
    color_2: '#FCE22A',
    color_3: '#11009E'
  },
  {
    id: 8,
    color_1: '#FFEA20',
    color_2: '#8DCBE6',
    color_3: '#E3F6FF'
  },
  {
    id: 9,
    color_1: '#2192FF',
    color_2: '#38E54D',
    color_3: '#FDFF00'
  },
  {
    id: 10,
    color_1: '#FF6000',
    color_2: '#FFE6C7',
    color_3: '#454545'
  },
  {
    id: 11,
    color_1: '#FF8400',
    color_2: '#4F200D',
    color_3: '#F6F1E9'
  },
  {
    id: 12,
    color_1: '#EC994B',
    color_2: '#15133C',
    color_3: '#F1EEE9'
  },
  {
    id: 13,
    color_1: '#CF7500',
    color_2: '#FBE555',
    color_3: '#1A1C20'
  },
  {
    id: 14,
    color_1: '#F45905',
    color_2: '#FBE555',
    color_3: '#2A1A5E'
  },
  {
    id: 15,
    color_1: '#E6AF2E',
    color_2: '#282F44',
    color_3: '#ECECEC'
  },
  {
    id: 16,
    color_1: '#212A3E',
    color_2: '#F1F6F9',
    color_3: '#394867'
  },
  {
    id: 17,
    color_1: '#FFA3FD',
    color_2: '#865DFF',
    color_3: '#191825'
  },
  {
    id: 18,
    color_1: '#EA5455',
    color_2: '#002B5B',
    color_3: '#F9F5EB'
  },
  {
    id: 19,
    color_1: '#4C4B16',
    color_2: '#E7B10A',
    color_3: '#F7F1E5'
  },
  {
    id: 20,
    color_1: '#1B120F',
    color_2: '#8F1D14',
    color_3: '#E6DEDD'
  },
])

function resetLanding() {
  localStorage.removeItem('cookie')
  localStorage.removeItem('login')
  localStorage.removeItem('old')
  getLanding()
  landingKey.value += 1
}

async function putLanding() {
  // Validation
  await v$.value.$validate()
  if (!v$.value.$error) {
    Object.assign(landingData.value, mainData.value)
    pr.value = await useAxiosPut(window.location.pathname + '/', landingData.value)

    errorAlert.value = pr.value.error
    successAlert.value = pr.value.success
    if (pr.value.success) {
      setTimeout(() => {
        router.push({
          name: 'Landing list'
        })
      }, 2000)
    }
  }
}
onMounted(() => {
  getLanding()
  console.log(geo)
})
</script>

<style lang="scss" scoped>
.hide-form{
  position: absolute;
  left: 0;
  top: 0;
  z-index: 1000;
  background-color: transparent;
  opacity: .2;
}
.hide-form:hover{
  opacity: 1;
}
.landing-edit {
  &__wrapper {
    display: flex;
    flex-direction: row;
    position: relative;
  }

  &__forms {
    display: flex;
    flex-direction: column;
    min-width: 400px;
    &-all{
      display: flex;
      flex-direction: column;
      min-width: 400px;
      position: absolute;
      left: 0;
      top: 0;
      z-index: 1000;
      background-color: rgb(var(--v-theme-surface));

    }
  }

  &__hide-form {
    &__btn {
      min-height: 64px;
      min-width: 64px;
    }

    &__icon {
      font-size: 40px;
    }
  }

  &__colors {
    &__wrapper {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 16px;
      margin-top: 10px;
    }

    &__square {
      height: 18px;
      width: 18px;
    }

    &__square:last-child {
      border-top-right-radius: 4px;
      border-bottom-right-radius: 4px;
    }

    &__square:first-child {
      border-top-left-radius: 4px;
      border-bottom-left-radius: 4px;
    }

    &__picker {
      border-radius: 5px;
      border: 1px solid rgb(var(--v-theme-secondary));
      background-color: rgb(var(--v-theme-secondary));
      font-size: 14px;
      display: grid;
      grid-template-columns: 18px 18px 18px;
    }
  }
}
</style>

<style lang="scss">
.landing {
  width: 100%;
  html, .body, div, span, applet, object, iframe,
  h1, h2, h3, h4, h5, h6, p, blockquote, pre,
  a, abbr, acronym, address, big, cite, code,
  del, dfn, em, img, ins, kbd, q, s, samp,
  small, strike, strong, sub, sup, tt, var,
  b, u, i, center,
  dl, dt, dd, ol, ul, li,
  fieldset, form, label, legend,
  table, caption, t.body, tfoot, thead, tr, th, td,
  article, aside, canvas, details, embed,
  figure, figcaption, footer, header, hgroup,
  menu, nav, output, ruby, section, summary,
  time, mark, audio, video {
    margin: 0;
    padding: 0;
    border: 0;
    font-size: 100%;
    font: inherit;
    vertical-align: baseline;
    position: relative;
  }

  .close-slot {
    cursor: pointer !important
  }

  button::-moz-focus-inner,
  input::-moz-focus-inner {
    border: 0;
    padding: 0;
  }

  a {
    text-decoration: none;
    all: unset;
  }

  /* HTML5 display-role reset for older browsers */
  article,
  aside,
  details,
  figcaption,
  figure,
  footer,
  header,
  hgroup,
  menu,
  nav,
  section {
    display: block;
  }

  .body {
    line-height: 1.5;
    width: 100%;
  }

  ol,
  ul {
    list-style: none;
  }

  blockquote,
  q {
    quotes: none;
  }

  blockquote:before,
  blockquote:after,
  q:before,
  q:after {
    content: '';
    content: none;
  }

  table {
    border-collapse: collapse;
    border-spacing: 0;
  }

  *,
  .body {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    -webkit-font-smoothing: antialiased;
    position: relative;
  }

  .body {
    min-height: 100vh;
    position: relative;
  }

  button,
  a {
    cursor: pointer !important;
  }

  .contact-us {
    position: fixed;
    height: 100vh;
    width: 100vw;
    top: 0;
    overflow: hidden;
    z-index: 999;
    display: none;
    justify-content: center;
    align-items: center;
    background: rgba(0, 0, 0, 0.7);
  }

  .buttons-rounded-1 {
    .menu-btn__wrapper {
      border-radius: 3px;
    }

    .common-button {
      border-radius: 28px;
    }

    .common-input {
      border-radius: 3px;
    }

    .common-button-2 {
      border-radius: 28px;
    }
  }

  .buttons-rounded-2 {
    .menu-btn__wrapper {
      border-radius: 4px;
    }

    .common-button {
      border-radius: 4px;
    }

    .common-input {
      border-radius: 4px;
    }

    .common-button-2 {
      border-radius: 4px;
    }
  }

  .buttons-rounded-3 {
    .menu-btn__wrapper {
      border-radius: 0px;
    }

    .common-button {
      border-radius: 0px;
    }

    .common-input {
      border-radius: 0px;
    }

    .common-button-2 {
      border-radius: 0px;
    }
  }

  .buttons-rounded-4 {
    .menu-btn__wrapper {
      border-radius: 5px;
    }

    .common-button {
      border-radius: 10px;
    }

    .common-input {
      border-radius: 5px;
    }

    .common-button-2 {
      border-radius: 10px;
    }
  }

  .buttons-rounded-5 {
    .menu-btn__wrapper {
      border-radius: 5px;
    }

    .common-button {
      border-radius: 15px;
    }

    .common-input {
      border-radius: 5px;
    }

    .common-button-2 {
      border-radius: 15px;
    }
  }

  .color-scheme-1 {

    .swiper-button-next,
    .swiper-button-prev {
      color: #3167FF !important;
    }

    .close-slot {
      background: white;
    }

    .close-slot:before,
    .close-slot:after {
      background-color: #3167FF;
    }

    .top-plank {
      color: #3167FF;
      background: white;
    }

    header {
      background: #3167FF;
    }

    .sitename {
      color: white;
    }

    .menu-pc li a {
      color: white;
    }

    .menu-pc li a:hover {
      color: #FF4B71;
    }

    .menu-btn__wrapper {
      background: #5279E6;
      border: 1px solid white;

    }

    .menu-btn-1 span,
    .menu-btn-1 span::before,
    .menu-btn-1 span::after {
      background: white;
    }

    .menu-btn__wrapper:hover {
      border: 1px solid #3167FF;
      background: white;
    }

    .menu-btn__wrapper:hover .menu-btn-1 span,
    .menu-btn__wrapper:hover .menu-btn-1 span::before,
    .menu-btn__wrapper:hover .menu-btn-1 span::after {
      background: #3167FF;
    }

    .menu li {
      background: white;
      color: #3167FF;
    }

    .menu li:hover {
      background: #3167FF;
      color: white;
    }

    .body {
      /*color: #3167FF;*/
      background: white;
    }

    h1,
    h2,
    h3,
    h4,
    h5 {
      color: #3167FF;
    }

    h3 {
      color: white;
    }

    .common-button {
      color: white;
      border: 1px solid white;
      background: linear-gradient(210deg, #3167FF 0%, #FF7694 100%);
    }

    .game-text {
      color: #3167FF;
    }

    .slot-cards__card {
      background: white;
      border: 1px solid white;
      box-shadow: 0px 0px 10px 0px rgba(96.67585066162559, 31.59782608695651, 255, 0.14);
    }

    .slot-cards__text {
      background: #3167FF;
    }

    .slot-cards__card h4 {
      color: white;
    }

    .slot-cards__card button {
      color: white;
    }

    footer {
      color: white;
      background: #3167FF;
    }

    .common-input {
      background: transparent;
      color: white;
      border: 1px solid #F8BAFF;

    }

    .common-input {
      min-width: 300px;
    }

    footer form input::placeholder,
    .common-input::placeholder {
      color: white;
    }

    .modal-18 {
      background: #3167FF;
      color: white;
    }

    .modal-cookie__modal {
      background: #3167FF;
      color: white;
    }

    .modal-18 button {
      color: white;
    }

    .common-button-2 {
      border: 1px solid white;
      color: white;
      background: #5279E6;
    }

    .slot-cards__card {
      background: #3167FF;
    }

    .play-btn {
      background: #3167FF;
    }
  }

  .color-scheme-2 {

    .swiper-button-next,
    .swiper-button-prev {
      color: white !important;
    }

    .close-slot {
      background: #d20202;
    }

    .close-slot:before,
    .close-slot:after {
      background-color: white;
    }

    .top-plank {
      color: #a58d00;
      background: white;
    }

    header {
      background: #d20202;
    }

    .sitename {
      color: white;
    }

    .menu-pc li a {
      color: white;
    }

    .menu-pc li a:hover {
      color: #a58d00;
    }

    .menu-btn__wrapper {
      background: black;
    }

    .menu-btn-1 span,
    .menu-btn-1 span::before,
    .menu-btn-1 span::after {
      background: white;
    }

    .menu-btn__wrapper:hover {

      background: white;
    }

    .menu-btn__wrapper:hover .menu-btn-1 span,
    .menu-btn__wrapper:hover .menu-btn-1 span::before,
    .menu-btn__wrapper:hover .menu-btn-1 span::after {
      background: #d20202;
    }

    .menu li {
      background: white;
      color: #d20202;
    }

    .menu li:hover {
      background: #d20202;
      color: white;
    }

    .body {
      /*color: #3167FF;*/
      background: #35654d;
    }

    h1,
    h2,
    h3,
    h4,
    h5 {
      color: white;
    }

    .common-button {
      color: black;

      border: 1px solid #35654d;
      background: linear-gradient(210deg, #a58d00 0%, #009900 100%);
    }

    .game-text {
      color: white;
    }

    .slot-cards__card {
      background: white;
      border: 1px solid white;
      box-shadow: 0px 0px 10px 0px rgba(96.67585066162559, 31.59782608695651, 255, 0.14);
    }

    .slot-cards__text {
      background: #d20202;
    }

    .slot-cards__card h4 {
      color: white;
    }

    .slot-cards__card button {
      color: white;
    }

    footer {
      color: white;
      background: #d20202;
    }

    .common-input {
      background: transparent;
      color: white;
      border: 1px solid white;

    }

    .common-input {
      min-width: 300px;
    }

    footer form input::placeholder,
    .common-input::placeholder {
      color: white;
    }

    .modal-18 {
      background: #d20202;
      color: white;

    }

    .modal-18 button {
      color: white;
    }

    .modal-cookie__modal {
      background: #d20202;
      color: white;

    }

    .common-button-2 {

      border: 1px solid white;
      color: white;
      background: #d20202;
    }

    .play-btn {
      color: #d20202;
      background: white;
    }

    .play-btn:hover {
      opacity: 0.5;
    }

    .slot-cards__card {
      background: #d20202;
    }
  }

  .color-scheme-3 {
    .close-slot {
      background: #fec82f;
    }

    .close-slot:before,
    .close-slot:after {
      background-color: #2e2d2c;
    }

    .top-plank {
      color: #fec82f;
      background: #2e2d2c;
    }

    header {
      background: #2e2d2c;
    }

    .sitename {
      color: #fec82f;
    }

    .menu-pc li a {
      color: #fbfbfb;
    }

    .menu-pc li a:hover {
      color: #fec82f;
    }

    .menu-btn__wrapper {
      background: #2e2d2c;
    }

    .menu-btn-1 span,
    .menu-btn-1 span::before,
    .menu-btn-1 span::after {
      background: white;
    }

    .menu-btn__wrapper:hover {
      background: white;
    }

    .menu-btn__wrapper:hover .menu-btn-1 span,
    .menu-btn__wrapper:hover .menu-btn-1 span::before,
    .menu-btn__wrapper:hover .menu-btn-1 span::after {
      background: #fec82f;
    }

    .menu li {
      background: #fbfbfb;
      color: #2e2d2c;
    }

    .menu li:hover {
      background: #2e2d2c;
      color: #fec82f;
    }

    .body {
      /*color: #3167FF;*/
      background: #fbfbfb;
    }

    .swiper-button-next,
    .swiper-button-prev {
      color: #2e2d2c !important;
    }

    h1,
    h2,
    h4 {
      color: #2e2d2c;
    }

    h3,
    h5 {
      color: #fbfbfb;
    }

    .common-button {
      color: #2e2d2c;
      border: 1px solid #fec82f;
      background: #fec82f;
    }

    .game-text {
      color: #2e2d2c;
    }

    .slot-cards__card {
      background: #fec82f;
      border: 1px solid #2e2d2c;
      box-shadow: 0px 0px 10px 0px rgba(96.67585066162559, 31.59782608695651, 255, 0.14);
    }

    .slot-cards__text {
      background: #fec82f;
    }

    .slot-cards__card h4 {
      color: #2e2d2c;
    }

    .slot-cards__card button {
      color: #2e2d2c;
    }

    footer {
      color: #fbfbfb;
      background: #2e2d2c;
    }

    .common-input {
      background: transparent;
      color: #fec82f;
      border: 1px solid #fec82f;

    }
    .modal-18 button {
      color: #fbfbfb !important;
    }

    .common-input {
      min-width: 300px;
    }

    footer form input::placeholder,
    .common-input::placeholder {
      color: white;
    }

    .modal-18 {
      background: #fbfbfb;
      color: #2e2d2c;

    }

    .modal-18 button {
      color: #2e2d2c;
    }

    .modal-cookie__modal {
      background: #fbfbfb;
      color: #2e2d2c;
    }

    .common-button-2 {
      border: 1px solid #fec82f;
      color: #fec82f;
      background: #2e2d2c !important;
    }

    .play-btn {
      color: #2e2d2c;
      background: #fec82f;
    }

    .play-btn:hover {
      opacity: 0.5;
    }

    .slot-cards__card {
      background: #fec82f;
    }
  }

  .color-scheme-4 {
    .close-slot {
      background: #213363;
    }

    .close-slot:before,
    .close-slot:after {
      background-color: #D3D04F;
    }

    .top-plank {
      color: #213363;
      background: #D3D04F;
    }

    header {
      background: #213363;
    }

    .sitename {
      color: white;
    }

    .menu-pc li a {
      color: #D3D04F;
    }

    .menu-pc li a:hover {
      color: #D3D04F;
    }

    .menu-btn__wrapper {
      background: #D3D04F;
    }

    .menu-btn-1 span,
    .menu-btn-1 span::before,
    .menu-btn-1 span::after {
      background: #213363;
    }

    .menu-btn__wrapper:hover {

      background: #213363;
    }

    .menu-btn__wrapper:hover .menu-btn-1 span,
    .menu-btn__wrapper:hover .menu-btn-1 span::before,
    .menu-btn__wrapper:hover .menu-btn-1 span::after {
      background: #D3D04F;
    }

    .menu li {
      background: #D3D04F;
      color: #213363;
    }

    .menu li:hover {
      background: #213363;
      color: #D3D04F;
    }

    .body {
      /*color: #3167FF;*/
      background: #17594A;
    }

    .swiper-button-next,
    .swiper-button-prev {
      color: #D3D04F !important;
    }

    h1,
    h2,
    h3,
    h4,
    h5 {
      color: white;
    }

    .common-button {
      color: black;

      border: 1px solid #35654d;
      background: #D3D04F;
    }

    .game-text {
      color: white;
    }

    .slot-cards__card {
      background: #D3D04F;

      box-shadow: 0px 0px 10px 0px rgba(96.67585066162559, 31.59782608695651, 255, 0.14);
    }

    .slot-cards__text {
      background: #213363;
    }

    .slot-cards__card h4 {
      color: #D3D04F;
    }

    .slot-cards__card button {
      color: #D3D04F;
    }

    footer {
      color: #D3D04F;
      background: #213363;
    }

    .common-input {
      background: transparent;
      color: white;
      border: 1px solid #8EAC50;

    }

    .common-input {
      min-width: 300px;
    }

    footer form input::placeholder,
    .common-input::placeholder {
      color: #8EAC50;
    }

    .modal-18 {
      background: #213363;
      color: #D3D04F;

    }

    .modal-cookie__modal {
      background: #213363;
      color: #D3D04F;

    }

    .common-button-2 {
      border: 1px solid #17594A;
      color: white;
      background: #17594A;
    }

    .play-btn {
      color: #213363;
      background: #D3D04F;
    }

    .play-btn:hover {
      opacity: 0.5;
    }

    .slot-cards__card {
      background: #213363;
    }
  }

  .color-scheme-5 {
    .close-slot {
      background: #F7B32D;
    }

    .close-slot:before,
    .close-slot:after {
      background-color: #C00000;
    }

    .top-plank {
      color: #F7B32D;
      background: #C00000;
    }

    header {
      background: #C00000;
    }

    .body {
      /*color: #3167FF;*/
      background: #F8F9FC;
    }

    .sitename {
      color: #F7B32D;
    }

    .menu-pc li a {
      color: #F8F9FC;
    }

    .menu-pc li a:hover {
      color: #F7B32D;
    }

    .menu-btn__wrapper {
      background: #C00000;
    }

    .menu-btn-1 span,
    .menu-btn-1 span::before,
    .menu-btn-1 span::after {
      background: #F8F9FC;
    }

    .menu-btn__wrapper:hover {
      background: #F8F9FC;
    }

    .menu-btn__wrapper:hover .menu-btn-1 span,
    .menu-btn__wrapper:hover .menu-btn-1 span::before,
    .menu-btn__wrapper:hover .menu-btn-1 span::after {
      background: #F7B32D;
    }

    .menu li {
      background: #F8F9FC;
      color: #C00000;
    }

    .menu li:hover {
      background: #C00000;
      color: #F7B32D;
    }

    .swiper-button-next,
    .swiper-button-prev {
      color: #C00000 !important;
    }

    h1,
    h2,
    h4 {
      color: #C00000;
    }

    h3,
    h5 {
      color: #F8F9FC;
    }

    .common-button {
      color: #C00000;
      border: 1px solid #F7B32D;
      background: #F7B32D;
    }

    .game-text {
      color: #C00000;
    }

    .slot-cards__card {
      background: #F7B32D;
      border: 1px solid #C00000;
      box-shadow: 0px 0px 10px 0px rgba(96.67585066162559, 31.59782608695651, 255, 0.14);
    }

    .slot-cards__text {
      background: #F7B32D;
    }

    .slot-cards__card h4 {
      color: #C00000;
    }

    .slot-cards__card button {
      color: #C00000;
    }

    footer {
      color: #F8F9FC;
      background: #C00000;
    }

    .common-input {
      background: transparent;
      color: #F7B32D;
      border: 1px solid #F7B32D;

    }

    .common-input {
      min-width: 300px;
    }

    footer form input::placeholder,
    .common-input::placeholder {
      color: #F8F9FC;
    }

    .modal-18 {
      background: #F8F9FC;
      color: #C00000;

    }

    .modal-cookie__modal {
      background: #F8F9FC;
      color: #C00000;
    }

    .common-button-2 {
      border: 1px solid #F7B32D;
      color: #F7B32D;
      background: #C00000 !important;
    }

    .play-btn {
      color: #C00000;
      background: #F7B32D;
    }

    .play-btn:hover {
      opacity: 0.5;
    }

    .slot-cards__card {
      background: #F7B32D;
    }

  }

  .color-scheme-6 {
    .close-slot {
      background: #F94A29;
    }

    .close-slot:before,
    .close-slot:after {
      background-color: #FCE22A;
    }

    .top-plank {
      color: #D61355;
      background: #FBE369;
    }

    header {
      background: #D61355;
    }

    .sitename {
      color: #FBE369;
    }

    .menu-pc li a {
      color: #FBE369;
    }

    .menu-pc li a:hover {
      color: #30E3DF;
    }

    .menu-btn__wrapper {
      background: #FBE369;
    }

    .menu-btn-1 span,
    .menu-btn-1 span::before,
    .menu-btn-1 span::after {
      background: #D61355;
    }

    .menu-btn__wrapper:hover {
      background: #D61355;
    }

    .menu-btn__wrapper:hover .menu-btn-1 span,
    .menu-btn__wrapper:hover .menu-btn-1 span::before,
    .menu-btn__wrapper:hover .menu-btn-1 span::after {
      background: #fec82f;
    }

    .menu li {
      background: #D61355;
      color: #FCE22A;
    }

    .menu li:hover {
      background: #FCE22A;
      color: #D61355;
    }

    .body {
      /*color: #3167FF;*/
      background: #62284D;
    }

    .swiper-button-next,
    .swiper-button-prev {
      color: #FCE22A !important;
    }

    h1,
    h2,
    h4 {
      color: #FBE369;
    }

    h3,
    h5 {
      color: #30E3DF;
    }

    .common-button {
      color: #D61355;
      border: 1px solid #FBE369;
      background: #FBE369;
    }

    .game-text {
      color: #FBE369;
    }

    .slot-cards__card {
      background: #D61355;
      border: 1px solid #FCE22A;
      box-shadow: 0px 0px 10px 0px rgba(96.67585066162559, 31.59782608695651, 255, 0.14);
    }

    .slot-cards__text {
      background: #D61355;
    }

    .slot-cards__card h4 {
      color: #FCE22A;
    }

    .slot-cards__card button {
      color: #FCE22A;
    }

    footer {
      color: #FBE369;
      background: #D61355;
    }

    .common-input {
      background: transparent;
      color: #FCE22A;
      border: 1px solid #FCE22A;

    }

    .common-input {
      min-width: 300px;
    }

    footer form input::placeholder,
    .common-input::placeholder {
      color: #FCE22A;
    }

    .modal-18 {
      background: #D61355;
      color: #FCE22A;

    }

    .modal-cookie__modal {
      background: #D61355;
      color: #FCE22A;
    }

    .common-button-2 {
      border: 1px solid #30E3DF;
      color: #30E3DF;
      background: transparent !important;
    }

    .play-btn {
      color: #FCE22A;
      background: #D61355;
    }

    .play-btn:hover {
      opacity: 0.5;
    }

    .slot-cards__card {
      background: #D61355;
    }
  }

  .color-scheme-7 {
    .close-slot {
      background: #F94A29;
    }

    .close-slot:before,
    .close-slot:after {
      background-color: #FCE22A;
    }

    .top-plank {
      color: black;
      background: #FBE369;
    }

    header {
      background: #11009E;
    }

    .sitename {
      color: #FBE369;
    }

    .menu-pc li a {
      color: #FBE369;
    }

    .menu-pc li a:hover {
      color: #30E3DF;
    }

    .menu-btn__wrapper {
      background: #FBE369;
    }

    .menu-btn-1 span,
    .menu-btn-1 span::before,
    .menu-btn-1 span::after {
      background: #D61355;
    }

    .menu-btn__wrapper:hover {
      background: #D61355;
    }

    .menu-btn__wrapper:hover .menu-btn-1 span,
    .menu-btn__wrapper:hover .menu-btn-1 span::before,
    .menu-btn__wrapper:hover .menu-btn-1 span::after {
      background: #fec82f;
    }

    .menu li {
      background: #4942E4;
      color: #FCE22A;
    }

    .menu li:hover {
      background: #FCE22A;
      color: #4942E4;
    }

    .body {
      /*color: #3167FF;*/
      background: #8696FE;
    }

    .swiper-button-next,
    .swiper-button-prev {
      color: #FCE22A !important;
    }

    h1,
    h2,
    h4 {
      color: #FBE369;
    }

    h3,
    h5 {
      color: #30E3DF;
    }

    .common-button {
      color: #D61355;
      border: 1px solid #FBE369;
      background: #FBE369;
    }

    .game-text {
      color: #FBE369;
    }

    .slot-cards__card {
      background: #C4B0FF;
      border: 1px solid #FCE22A;
      box-shadow: 0px 0px 10px 0px rgba(96.67585066162559, 31.59782608695651, 255, 0.14);
    }

    .slot-cards__text {
      background: #C4B0FF;
    }

    .slot-cards__card h4 {
      color: #FCE22A;
    }

    .slot-cards__card button {
      color: #Fff;
    }

    footer {
      color: #FBE369;
      background: #11009E;
    }

    .common-input {
      background: transparent;
      color: #FCE22A;
      border: 1px solid #FCE22A;

    }

    .common-input {
      min-width: 300px;
    }

    footer form input::placeholder,
    .common-input::placeholder {
      color: #FCE22A;
    }

    .modal-18 {
      background: #C4B0FF;
      color: #FCE22A;

    }

    .modal-cookie__modal {
      background: #C4B0FF;
      color: #FCE22A;
    }

    .common-button-2 {
      border: 1px solid white;
      color: white;
      background: transparent !important;
    }

    .play-btn {
      color: #FCE22A;
      background: #D61355;
    }

    .play-btn:hover {
      opacity: 0.5;
    }

    .slot-cards__card {
      background: #C4B0FF;
    }
  }

  .color-scheme-8 {
    .close-slot {
      background: #FFEA20;
    }

    .close-slot:before,
    .close-slot:after {
      background-color: #8DCBE6;
    }

    .top-plank {
      color: #FFEA20;
      background: #8DCBE6;
    }

    header {
      background: #8DCBE6;
    }

    .sitename {
      color: #FFEA20;
    }

    .menu-pc li a {
      color: #E3F6FF;
    }

    .menu-pc li a:hover {
      color: #FFEA20;
    }

    .menu-btn__wrapper {
      background: #8DCBE6;
    }

    .menu-btn-1 span,
    .menu-btn-1 span::before,
    .menu-btn-1 span::after {
      background: #9DF1DF;
    }

    .menu-btn__wrapper:hover {
      background: #9DF1DF;
    }

    .menu-btn__wrapper:hover .menu-btn-1 span,
    .menu-btn__wrapper:hover .menu-btn-1 span::before,
    .menu-btn__wrapper:hover .menu-btn-1 span::after {
      background: #FFEA20;
    }

    .menu li {
      background: #E3F6FF;
      color: #8DCBE6;
    }

    .menu li:hover {
      background: #8DCBE6;
      color: #FFEA20;
    }

    .body {
      /*color: #3167FF;*/
      background: #E3F6FF;
    }

    .swiper-button-next,
    .swiper-button-prev {
      color: #8DCBE6 !important;
    }

    h1,
    h2,
    h4 {
      color: #8DCBE6;
    }

    h3,
    h5 {
      color: #E3F6FF;
    }

    .common-button {
      color: #8DCBE6;
      border: 1px solid #FFEA20;
      background: #FFEA20;
    }

    .game-text {
      color: #8DCBE6;
    }

    .slot-cards__card {
      background: #FFEA20;
      border: 1px solid #8DCBE6;
      box-shadow: 0px 0px 10px 0px rgba(96.67585066162559, 31.59782608695651, 255, 0.14);
    }

    .slot-cards__text {
      background: #FFEA20;
    }

    .slot-cards__card h4 {
      color: #8DCBE6;
    }

    .slot-cards__card button {
      color: #8DCBE6;
    }

    footer {
      color: #E3F6FF;
      background: #8DCBE6;
    }

    .common-input {
      background: transparent;
      color: #FFEA20;
      border: 1px solid #FFEA20;

    }

    .common-input {
      min-width: 300px;
    }

    footer form input::placeholder,
    .common-input::placeholder {
      color: #9DF1DF;
    }

    .modal-18 {
      background: #E3F6FF;
      color: #8DCBE6;

    }

    .modal-cookie__modal {
      background: #E3F6FF;
      color: #8DCBE6;
    }

    .common-button-2 {
      border: 1px solid #FFEA20;
      color: #FFEA20;
      background: #8DCBE6 !important;
    }

    .play-btn {
      color: #8DCBE6;
      background: #FFEA20;
    }

    .play-btn:hover {
      opacity: 0.5;
    }

    .slot-cards__card {
      background: #FFEA20;
    }
  }

  .color-scheme-9 {
    .close-slot {
      background: #2192FF;
    }

    .close-slot:before,
    .close-slot:after {
      background-color: #38E54D;
    }

    .top-plank {
      color: #2192FF;
      background: #38E54D;
    }

    header {
      background: #38E54D;
    }

    .sitename {
      color: #2192FF;
    }

    .menu-pc li a {
      color: #fff;
    }

    .menu-pc li a:hover {
      color: #2192FF;
    }

    .menu-btn__wrapper {
      background: #38E54D;
    }

    .menu-btn-1 span,
    .menu-btn-1 span::before,
    .menu-btn-1 span::after {
      background: #FDFF00;
    }

    .menu-btn__wrapper:hover {
      background: #FDFF00;
    }

    .menu-btn__wrapper:hover .menu-btn-1 span,
    .menu-btn__wrapper:hover .menu-btn-1 span::before,
    .menu-btn__wrapper:hover .menu-btn-1 span::after {
      background: #2192FF;
    }

    .menu li {
      background: #fff;
      color: #38E54D;
    }

    .menu li:hover {
      background: #38E54D;
      color: #2192FF;
    }

    .body {
      /*color: #3167FF;*/
      background: #fff;
    }

    .swiper-button-next,
    .swiper-button-prev {
      color: #38E54D !important;
    }

    h1,
    h2,
    h4 {
      color: #38E54D;
    }

    h3,
    h5 {
      color: #fff;
    }

    .common-button {
      color: #38E54D;
      border: 1px solid #2192FF;
      background: #2192FF;
    }

    .game-text {
      color: #38E54D;
    }

    .slot-cards__card {
      background: #2192FF;
      border: 1px solid #38E54D;
      box-shadow: 0px 0px 10px 0px rgba(96.67585066162559, 31.59782608695651, 255, 0.14);
    }

    .slot-cards__text {
      background: #2192FF;
    }

    .slot-cards__card h4 {
      color: #38E54D;
    }

    .slot-cards__card button {
      color: #38E54D;
    }

    footer {
      color: #fff;
      background: #38E54D;
    }

    .common-input {
      background: transparent;
      color: #2192FF;
      border: 1px solid #2192FF;

    }

    .common-input {
      min-width: 300px;
    }

    footer form input::placeholder,
    .common-input::placeholder {
      color: #FDFF00;
    }

    .modal-18 {
      background: #fff;
      color: #38E54D;

    }

    .modal-cookie__modal {
      background: #fff;
      color: #38E54D;
    }

    .common-button-2 {
      border: 1px solid #2192FF;
      color: #2192FF;
      background: #38E54D !important;
    }

    .play-btn {
      color: #38E54D;
      background: #2192FF;
    }

    .play-btn:hover {
      opacity: 0.5;
    }

    .slot-cards__card {
      background: #2192FF;
    }
  }

  .color-scheme-10 {
    .close-slot {
      background: #FF6000;
    }

    .close-slot:before,
    .close-slot:after {
      background-color: #FFE6C7;
    }

    .top-plank {
      color: #FF6000;
      background: #FFE6C7;
    }

    header {
      background: #FFE6C7;
    }

    .sitename {
      color: #FF6000;
    }

    .menu-pc li a {
      color: #454545;
    }

    .menu-pc li a:hover {
      color: #FF6000;
    }

    .menu-btn__wrapper {
      background: #FFE6C7;
    }

    .menu-btn-1 span,
    .menu-btn-1 span::before,
    .menu-btn-1 span::after {
      background: #FDFF00;
    }

    .menu-btn__wrapper:hover {
      background: #FDFF00;
    }

    .menu-btn__wrapper:hover .menu-btn-1 span,
    .menu-btn__wrapper:hover .menu-btn-1 span::before,
    .menu-btn__wrapper:hover .menu-btn-1 span::after {
      background: #FF6000;
    }

    .menu li {
      background: #454545;
      color: #FFE6C7;
    }

    .menu li:hover {
      background: #FFE6C7;
      color: #FF6000;
    }

    .body {
      /*color: #3167FF;*/
      background: #454545;
    }

    .swiper-button-next,
    .swiper-button-prev {
      color: #FFE6C7 !important;
    }

    h1,
    h2,
    h4 {
      color: #FFE6C7;
    }

    h3,
    h5 {
      color: #454545;
    }

    .common-button {
      color: #FFE6C7;
      border: 1px solid #FF6000;
      background: #FF6000;
    }

    .game-text {
      color: #FFE6C7;
    }

    .slot-cards__card {
      background: #FF6000;
      border: 1px solid #FFE6C7;
      box-shadow: 0px 0px 10px 0px rgba(96.67585066162559, 31.59782608695651, 255, 0.14);
    }

    .slot-cards__text {
      background: #FF6000;
    }

    .slot-cards__card h4 {
      color: #FFE6C7;
    }

    .slot-cards__card button {
      color: #FFE6C7;
    }

    footer {
      color: #454545;
      background: #FFE6C7;
    }

    .common-input {
      background: transparent;
      color: #FF6000;
      border: 1px solid #FF6000;

    }

    .common-input {
      min-width: 300px;
    }

    footer form input::placeholder,
    .common-input::placeholder {
      color: #FDFF00;
    }

    .modal-18 {
      background: #454545;
      color: #FFE6C7;

    }

    .modal-cookie__modal {
      background: #454545;
      color: #FFE6C7;
    }

    .common-button-2 {
      border: 1px solid #FF6000;
      color: #FF6000;
      background: #FFE6C7 !important;
    }

    .play-btn {
      color: #FFE6C7;
      background: #FF6000;
    }

    .play-btn:hover {
      opacity: 0.5;
    }

    .slot-cards__card {
      background: #FF6000;
    }
  }

  .color-scheme-11 {
    .close-slot {
      background: #FF8400;
    }

    .close-slot:before,
    .close-slot:after {
      background-color: #4F200D;
    }

    .top-plank {
      color: #FF8400;
      background: #4F200D;
    }

    header {
      background: #4F200D;
    }

    .sitename {
      color: #FF8400;
    }

    .menu-pc li a {
      color: #F6F1E9;
    }

    .menu-pc li a:hover {
      color: #FF8400;
    }

    .menu-btn__wrapper {
      background: #4F200D;
    }

    .menu-btn-1 span,
    .menu-btn-1 span::before,
    .menu-btn-1 span::after {
      background: white;
    }

    .menu-btn__wrapper:hover {
      background: white;
    }

    .menu-btn__wrapper:hover .menu-btn-1 span,
    .menu-btn__wrapper:hover .menu-btn-1 span::before,
    .menu-btn__wrapper:hover .menu-btn-1 span::after {
      background: #FF8400;
    }

    .menu li {
      background: #F6F1E9;
      color: #4F200D;
    }

    .menu li:hover {
      background: #4F200D;
      color: #FF8400;
    }

    .body {
      /*color: #3167FF;*/
      background: #F6F1E9;
    }

    .swiper-button-next,
    .swiper-button-prev {
      color: #4F200D !important;
    }

    h1,
    h2,
    h4 {
      color: #4F200D;
    }

    h3,
    h5 {
      color: #F6F1E9;
    }

    .common-button {
      color: #4F200D;
      border: 1px solid #FF8400;
      background: #FF8400;
    }

    .game-text {
      color: #4F200D;
    }

    .slot-cards__card {
      background: #FF8400;
      border: 1px solid #4F200D;
      box-shadow: 0px 0px 10px 0px rgba(96.67585066162559, 31.59782608695651, 255, 0.14);
    }

    .slot-cards__text {
      background: #FF8400;
    }

    .slot-cards__card h4 {
      color: #4F200D;
    }

    .slot-cards__card button {
      color: #4F200D;
    }

    footer {
      color: #F6F1E9;
      background: #4F200D;
    }

    .common-input {
      background: transparent;
      color: #FF8400;
      border: 1px solid #FF8400;

    }

    .common-input {
      min-width: 300px;
    }

    footer form input::placeholder,
    .common-input::placeholder {
      color: white;
    }

    .modal-18 {
      background: #F6F1E9;
      color: #4F200D;

    }

    .modal-cookie__modal {
      background: #F6F1E9;
      color: #4F200D;
    }

    .common-button-2 {
      border: 1px solid #FF8400;
      color: #FF8400;
      background: #4F200D !important;
    }

    .play-btn {
      color: #4F200D;
      background: #FF8400;
    }

    .play-btn:hover {
      opacity: 0.5;
    }

    .slot-cards__card {
      background: #FF8400;
    }
  }

  .color-scheme-12 {
    .close-slot {
      background: #EC994B;
    }

    .close-slot:before,
    .close-slot:after {
      background-color: #15133C;
    }

    .top-plank {
      color: #EC994B;
      background: #15133C;
    }

    header {
      background: #15133C;
    }

    .sitename {
      color: #EC994B;
    }

    .menu-pc li a {
      color: #F1EEE9;
    }

    .menu-pc li a:hover {
      color: #EC994B;
    }

    .menu-btn__wrapper {
      background: #15133C;
    }

    .menu-btn-1 span,
    .menu-btn-1 span::before,
    .menu-btn-1 span::after {
      background: #F1EEE9;
    }

    .menu-btn__wrapper:hover {
      background: #F1EEE9;
    }

    .menu-btn__wrapper:hover .menu-btn-1 span,
    .menu-btn__wrapper:hover .menu-btn-1 span::before,
    .menu-btn__wrapper:hover .menu-btn-1 span::after {
      background: #EC994B;
    }

    .menu li {
      background: #F1EEE9;
      color: #15133C;
    }

    .menu li:hover {
      background: #15133C;
      color: #EC994B;
    }

    .body {
      /*color: #3167FF;*/
      background: #F1EEE9;
    }

    .swiper-button-next,
    .swiper-button-prev {
      color: #15133C !important;
    }

    h1,
    h2,
    h4 {
      color: #15133C;
    }

    h3,
    h5 {
      color: #F1EEE9;
    }

    .common-button {
      color: #15133C;
      border: 1px solid #EC994B;
      background: #EC994B;
    }

    .game-text {
      color: #15133C;
    }

    .slot-cards__card {
      background: #EC994B;
      border: 1px solid #15133C;
      box-shadow: 0px 0px 10px 0px rgba(96.67585066162559, 31.59782608695651, 255, 0.14);
    }

    .slot-cards__text {
      background: #EC994B;
    }

    .slot-cards__card h4 {
      color: #15133C;
    }

    .slot-cards__card button {
      color: #15133C;
    }

    footer {
      color: #F1EEE9;
      background: #15133C;
    }

    .common-input {
      background: transparent;
      color: #EC994B;
      border: 1px solid #EC994B;

    }

    .common-input {
      min-width: 300px;
    }

    footer form input::placeholder,
    .common-input::placeholder {
      color: #F1EEE9;
    }

    .modal-18 {
      background: #F1EEE9;
      color: #15133C;

    }

    .modal-cookie__modal {
      background: #F1EEE9;
      color: #15133C;
    }

    .common-button-2 {
      border: 1px solid #EC994B;
      color: #EC994B;
      background: #15133C !important;
    }

    .play-btn {
      color: #15133C;
      background: #EC994B;
    }

    .play-btn:hover {
      opacity: 0.5;
    }

    .slot-cards__card {
      background: #EC994B;
    }
  }

  .color-scheme-13 {
    .close-slot {
      background: #CF7500;
    }

    .close-slot:before,
    .close-slot:after {
      background-color: #F4F4F4;
    }

    .top-plank {
      color: #CF7500;
      background: #F4F4F4;
    }

    header {
      background: #F4F4F4;
    }

    .sitename {
      color: #CF7500;
    }

    .menu-pc li a {
      color: #1A1C20;
    }

    .menu-pc li a:hover {
      color: #CF7500;
    }

    .menu-btn__wrapper {
      background: #F4F4F4;
    }

    .menu-btn-1 span,
    .menu-btn-1 span::before,
    .menu-btn-1 span::after {
      background: #1A1C20;
    }

    .menu-btn__wrapper:hover {
      background: #1A1C20;
    }

    .menu-btn__wrapper:hover .menu-btn-1 span,
    .menu-btn__wrapper:hover .menu-btn-1 span::before,
    .menu-btn__wrapper:hover .menu-btn-1 span::after {
      background: #CF7500;
    }

    .menu li {
      background: #1A1C20;
      color: #F4F4F4;
    }

    .menu li:hover {
      background: #F4F4F4;
      color: #CF7500;
    }

    .body {
      /*color: #3167FF;*/
      background: #1A1C20;
    }

    .swiper-button-next,
    .swiper-button-prev {
      color: #F4F4F4 !important;
    }

    h1,
    h2,
    h4 {
      color: #F4F4F4;
    }

    h3,
    h5 {
      color: #1A1C20;
    }

    .common-button {
      color: #F4F4F4;
      border: 1px solid #CF7500;
      background: #CF7500;
    }

    .game-text {
      color: #F4F4F4;
    }

    .slot-cards__card {
      background: #CF7500;
      border: 1px solid #F4F4F4;
      box-shadow: 0px 0px 10px 0px rgba(96.67585066162559, 31.59782608695651, 255, 0.14);
    }

    .slot-cards__text {
      background: #CF7500;
    }

    .slot-cards__card h4 {
      color: #F4F4F4;
    }

    .slot-cards__card button {
      color: #F4F4F4;
    }

    footer {
      color: #1A1C20;
      background: #F4F4F4;
    }

    .common-input {
      background: transparent;
      color: #CF7500;
      border: 1px solid #CF7500;

    }

    .common-input {
      min-width: 300px;
    }

    footer form input::placeholder,
    .common-input::placeholder {
      color: #1A1C20;
    }

    .modal-18 {
      background: #1A1C20;
      color: #F4F4F4;

    }

    .modal-cookie__modal {
      background: #1A1C20;
      color: #F4F4F4;
    }

    .common-button-2 {
      border: 1px solid #CF7500;
      color: #CF7500;
      background: #F4F4F4 !important;
    }

    .play-btn {
      color: #F4F4F4;
      background: #CF7500;
    }

    .play-btn:hover {
      opacity: 0.5;
    }

    .slot-cards__card {
      background: #CF7500;
    }
  }

  .color-scheme-14 {
    .close-slot {
      background: #F45905;
    }

    .close-slot:before,
    .close-slot:after {
      background-color: #FBE555;
    }

    .top-plank {
      color: #F45905;
      background: #FBE555;
    }

    header {
      background: #FBE555;
    }

    .sitename {
      color: #F45905;
    }

    .menu-pc li a {
      color: #2A1A5E;
    }

    .menu-pc li a:hover {
      color: #F45905;
    }

    .menu-btn__wrapper {
      background: #FBE555;
    }

    .menu-btn-1 span,
    .menu-btn-1 span::before,
    .menu-btn-1 span::after {
      background: #2A1A5E;
    }

    .menu-btn__wrapper:hover {
      background: #2A1A5E;
    }

    .menu-btn__wrapper:hover .menu-btn-1 span,
    .menu-btn__wrapper:hover .menu-btn-1 span::before,
    .menu-btn__wrapper:hover .menu-btn-1 span::after {
      background: #F45905;
    }

    .menu li {
      background: #2A1A5E;
      color: #FBE555;
    }

    .menu li:hover {
      background: #FBE555;
      color: #F45905;
    }

    .body {
      /*color: #3167FF;*/
      background: #2A1A5E;
    }

    .swiper-button-next,
    .swiper-button-prev {
      color: #FBE555 !important;
    }

    h1,
    h2,
    h4 {
      color: #FBE555;
    }

    h3,
    h5 {
      color: #2A1A5E;
    }

    .common-button {
      color: #FBE555;
      border: 1px solid #F45905;
      background: #F45905;
    }

    .game-text {
      color: #FBE555;
    }

    .slot-cards__card {
      background: #F45905;
      border: 1px solid #FBE555;
      box-shadow: 0px 0px 10px 0px rgba(96.67585066162559, 31.59782608695651, 255, 0.14);
    }

    .slot-cards__text {
      background: #F45905;
    }

    .slot-cards__card h4 {
      color: #FBE555;
    }

    .slot-cards__card button {
      color: #FBE555;
    }

    footer {
      color: #2A1A5E;
      background: #FBE555;
    }

    .common-input {
      background: transparent;
      color: #F45905;
      border: 1px solid #F45905;

    }

    .common-input {
      min-width: 300px;
    }

    footer form input::placeholder,
    .common-input::placeholder {
      color: #2A1A5E;
    }

    .modal-18 {
      background: #2A1A5E;
      color: #FBE555;

    }

    .modal-cookie__modal {
      background: #2A1A5E;
      color: #FBE555;
    }

    .common-button-2 {
      border: 1px solid #F45905;
      color: #F45905;
      background: #FBE555 !important;
    }

    .play-btn {
      color: #FBE555;
      background: #F45905;
    }

    .play-btn:hover {
      opacity: 0.5;
    }

    .slot-cards__card {
      background: #F45905;
    }
  }

  .color-scheme-15 {
    .close-slot {
      background: #E6AF2E;
    }

    .close-slot:before,
    .close-slot:after {
      background-color: #282F44;
    }

    .top-plank {
      color: #E6AF2E;
      background: #282F44;
    }

    header {
      background: #282F44;
    }

    .sitename {
      color: #E6AF2E;
    }

    .menu-pc li a {
      color: #ECECEC;
    }

    .menu-pc li a:hover {
      color: #E6AF2E;
    }

    .menu-btn__wrapper {
      background: #282F44;
    }

    .menu-btn-1 span,
    .menu-btn-1 span::before,
    .menu-btn-1 span::after {
      background: #ECECEC;
    }

    .menu-btn__wrapper:hover {
      background: #ECECEC;
    }

    .menu-btn__wrapper:hover .menu-btn-1 span,
    .menu-btn__wrapper:hover .menu-btn-1 span::before,
    .menu-btn__wrapper:hover .menu-btn-1 span::after {
      background: #E6AF2E;
    }

    .menu li {
      background: #ECECEC;
      color: #282F44;
    }

    .menu li:hover {
      background: #282F44;
      color: #E6AF2E;
    }

    .body {
      /*color: #3167FF;*/
      background: #ECECEC;
    }

    .swiper-button-next,
    .swiper-button-prev {
      color: #282F44 !important;
    }

    h1,
    h2,
    h4 {
      color: #282F44;
    }

    h3,
    h5 {
      color: #ECECEC;
    }

    .common-button {
      color: #282F44;
      border: 1px solid #E6AF2E;
      background: #E6AF2E;
    }

    .game-text {
      color: #282F44;
    }

    .slot-cards__card {
      background: #E6AF2E;
      border: 1px solid #282F44;
      box-shadow: 0px 0px 10px 0px rgba(96.67585066162559, 31.59782608695651, 255, 0.14);
    }

    .slot-cards__text {
      background: #E6AF2E;
    }

    .slot-cards__card h4 {
      color: #282F44;
    }

    .slot-cards__card button {
      color: #282F44;
    }

    footer {
      color: #ECECEC;
      background: #282F44;
    }

    .common-input {
      background: transparent;
      color: #E6AF2E;
      border: 1px solid #E6AF2E;

    }

    .common-input {
      min-width: 300px;
    }

    footer form input::placeholder,
    .common-input::placeholder {
      color: #ECECEC;
    }

    .modal-18 {
      background: #ECECEC;
      color: #282F44;

    }

    .modal-cookie__modal {
      background: #ECECEC;
      color: #282F44;
    }

    .common-button-2 {
      border: 1px solid #E6AF2E;
      color: #E6AF2E;
      background: #282F44 !important;
    }

    .play-btn {
      color: #282F44;
      background: #E6AF2E;
    }

    .play-btn:hover {
      opacity: 0.5;
    }

    .slot-cards__card {
      background: #E6AF2E;
    }
  }

  .color-scheme-16 {
    .close-slot {
      background: #212A3E;
    }

    .close-slot:before,
    .close-slot:after {
      background-color: #F1F6F9;
    }

    .top-plank {
      color: #212A3E;
      background: #F1F6F9;
    }

    header {
      background: #F1F6F9;
    }

    .body {
      /*color: #3167FF;*/
      background: #394867;
    }

    .sitename {
      color: #212A3E;
    }

    .menu-pc li a {
      color: #394867;
    }

    .menu-pc li a:hover {
      color: #212A3E;
    }

    .menu-btn__wrapper {
      background: #F1F6F9;
    }

    .menu-btn-1 span,
    .menu-btn-1 span::before,
    .menu-btn-1 span::after {
      background: #394867;
    }

    .menu-btn__wrapper:hover {
      background: #394867;
    }

    .menu-btn__wrapper:hover .menu-btn-1 span,
    .menu-btn__wrapper:hover .menu-btn-1 span::before,
    .menu-btn__wrapper:hover .menu-btn-1 span::after {
      background: #212A3E;
    }

    .menu li {
      background: #394867;
      color: #F1F6F9;
    }

    .menu li:hover {
      background: #F1F6F9;
      color: #212A3E;
    }

    .swiper-button-next,
    .swiper-button-prev {
      color: #F1F6F9 !important;
    }

    h1,
    h2,
    h4 {
      color: #F1F6F9;
    }

    h3,
    h5 {
      color: #394867;
    }

    .common-button {
      color: #F1F6F9;
      border: 1px solid #212A3E;
      background: #212A3E;
    }

    .game-text {
      color: #F1F6F9;
    }

    .slot-cards__card {
      background: #212A3E;
      border: 1px solid #F1F6F9;
      box-shadow: 0px 0px 10px 0px rgba(96.67585066162559, 31.59782608695651, 255, 0.14);
    }

    .slot-cards__text {
      background: #212A3E;
    }

    .slot-cards__card h4 {
      color: #F1F6F9;
    }

    .slot-cards__card button {
      color: #F1F6F9;
    }

    footer {
      color: #394867;
      background: #F1F6F9;
    }

    .common-input {
      background: transparent;
      color: #212A3E;
      border: 1px solid #212A3E;

    }

    .common-input {
      min-width: 300px;
    }

    footer form input::placeholder,
    .common-input::placeholder {
      color: #394867;
    }

    .modal-18 {
      background: #394867;
      color: #F1F6F9;

    }

    .modal-cookie__modal {
      background: #394867;
      color: #F1F6F9;
    }

    .common-button-2 {
      border: 1px solid #212A3E;
      color: #212A3E;
      background: #F1F6F9 !important;
    }

    .play-btn {
      color: #F1F6F9;
      background: #212A3E;
    }

    .play-btn:hover {
      opacity: 0.5;
    }

    .slot-cards__card {
      background: #212A3E;
    }
  }

  .color-scheme-17 {
    .close-slot {
      background: #FFA3FD;
    }

    .close-slot:before,
    .close-slot:after {
      background-color: #865DFF;
    }

    .top-plank {
      color: #FFA3FD;
      background: #865DFF;
    }

    header {
      background: #865DFF;
    }

    .body {
      /*color: #3167FF;*/
      background: #191825;
    }

    .sitename {
      color: #FFA3FD;
    }

    .menu-pc li a {
      color: #191825;
    }

    .menu-pc li a:hover {
      color: #FFA3FD;
    }

    .menu-btn__wrapper {
      background: #865DFF;
    }

    .menu-btn-1 span,
    .menu-btn-1 span::before,
    .menu-btn-1 span::after {
      background: #191825;
    }

    .menu-btn__wrapper:hover {
      background: #191825;
    }

    .menu-btn__wrapper:hover .menu-btn-1 span,
    .menu-btn__wrapper:hover .menu-btn-1 span::before,
    .menu-btn__wrapper:hover .menu-btn-1 span::after {
      background: #FFA3FD;
    }

    .menu li {
      background: #191825;
      color: #865DFF;
    }

    .menu li:hover {
      background: #865DFF;
      color: #FFA3FD;
    }

    .swiper-button-next,
    .swiper-button-prev {
      color: #865DFF !important;
    }

    h1,
    h2,
    h4 {
      color: #865DFF;
    }

    h3,
    h5 {
      color: #191825;
    }

    .common-button {
      color: #865DFF;
      border: 1px solid #FFA3FD;
      background: #FFA3FD;
    }

    .game-text {
      color: #865DFF;
    }

    .slot-cards__card {
      background: #FFA3FD;
      border: 1px solid #865DFF;
      box-shadow: 0px 0px 10px 0px rgba(96.67585066162559, 31.59782608695651, 255, 0.14);
    }

    .slot-cards__text {
      background: #FFA3FD;
    }

    .slot-cards__card h4 {
      color: #865DFF;
    }

    .slot-cards__card button {
      color: #865DFF;
    }

    footer {
      color: #191825;
      background: #865DFF;
    }

    .common-input {
      background: transparent;
      color: #FFA3FD;
      border: 1px solid #FFA3FD;

    }

    .common-input {
      min-width: 300px;
    }

    footer form input::placeholder,
    .common-input::placeholder {
      color: #191825;
    }

    .modal-18 {
      background: #191825;
      color: #865DFF;

    }

    .modal-cookie__modal {
      background: #191825;
      color: #865DFF;
    }

    .common-button-2 {
      border: 1px solid #FFA3FD;
      color: #FFA3FD;
      background: #865DFF !important;
    }

    .play-btn {
      color: #865DFF;
      background: #FFA3FD;
    }

    .play-btn:hover {
      opacity: 0.5;
    }

    .slot-cards__card {
      background: #FFA3FD;
    }
  }

  .color-scheme-18 {
    .close-slot {
      background: #EA5455;
    }

    .close-slot:before,
    .close-slot:after {
      background-color: #002B5B;
    }

    .top-plank {
      color: #EA5455;
      background: #002B5B;
    }

    header {
      background: #002B5B;
    }

    .body {
      /*color: #3167FF;*/
      background: #F9F5EB;
    }

    .sitename {
      color: #EA5455;
    }

    .menu-pc li a {
      color: #F9F5EB;
    }

    .menu-pc li a:hover {
      color: #EA5455;
    }

    .menu-btn__wrapper {
      background: #002B5B;
    }

    .menu-btn-1 span,
    .menu-btn-1 span::before,
    .menu-btn-1 span::after {
      background: #F9F5EB;
    }

    .menu-btn__wrapper:hover {
      background: #F9F5EB;
    }

    .menu-btn__wrapper:hover .menu-btn-1 span,
    .menu-btn__wrapper:hover .menu-btn-1 span::before,
    .menu-btn__wrapper:hover .menu-btn-1 span::after {
      background: #EA5455;
    }

    .menu li {
      background: #F9F5EB;
      color: #002B5B;
    }

    .menu li:hover {
      background: #002B5B;
      color: #EA5455;
    }

    .swiper-button-next,
    .swiper-button-prev {
      color: #002B5B !important;
    }

    h1,
    h2,
    h4 {
      color: #002B5B;
    }

    h3,
    h5 {
      color: #F9F5EB;
    }

    .common-button {
      color: #002B5B;
      border: 1px solid #EA5455;
      background: #EA5455;
    }

    .game-text {
      color: #002B5B;
    }

    .slot-cards__card {
      background: #EA5455;
      border: 1px solid #002B5B;
      box-shadow: 0px 0px 10px 0px rgba(96.67585066162559, 31.59782608695651, 255, 0.14);
    }

    .slot-cards__text {
      background: #EA5455;
    }

    .slot-cards__card h4 {
      color: #002B5B;
    }

    .slot-cards__card button {
      color: #002B5B;
    }

    footer {
      color: #F9F5EB;
      background: #002B5B;
    }

    .common-input {
      background: transparent;
      color: #EA5455;
      border: 1px solid #EA5455;

    }

    .common-input {
      min-width: 300px;
    }

    footer form input::placeholder,
    .common-input::placeholder {
      color: #F9F5EB;
    }

    .modal-18 {
      background: #F9F5EB;
      color: #002B5B;

    }

    .modal-cookie__modal {
      background: #F9F5EB;
      color: #002B5B;
    }

    .common-button-2 {
      border: 1px solid #EA5455;
      color: #EA5455;
      background: #002B5B !important;
    }

    .play-btn {
      color: #002B5B;
      background: #EA5455;
    }

    .play-btn:hover {
      opacity: 0.5;
    }

    .slot-cards__card {
      background: #EA5455;
    }

  }

  .color-scheme-19 {
    .close-slot {
      background: #4C4B16;
    }

    .close-slot:before,
    .close-slot:after {
      background-color: #E7B10A;
    }

    .top-plank {
      color: #4C4B16;
      background: #E7B10A;
    }

    header {
      background: #E7B10A;
    }

    .body {
      /*color: #3167FF;*/
      background: #F7F1E5;
    }

    .sitename {
      color: #4C4B16;
    }

    .menu-pc li a {
      color: #F7F1E5;
    }

    .menu-pc li a:hover {
      color: #4C4B16;
    }

    .menu-btn__wrapper {
      background: #E7B10A;
    }

    .menu-btn-1 span,
    .menu-btn-1 span::before,
    .menu-btn-1 span::after {
      background: #F7F1E5;
    }

    .menu-btn__wrapper:hover {
      background: #F7F1E5;
    }

    .menu-btn__wrapper:hover .menu-btn-1 span,
    .menu-btn__wrapper:hover .menu-btn-1 span::before,
    .menu-btn__wrapper:hover .menu-btn-1 span::after {
      background: #4C4B16;
    }

    .menu li {
      background: #F7F1E5;
      color: #E7B10A;
    }

    .menu li:hover {
      background: #E7B10A;
      color: #4C4B16;
    }

    .swiper-button-next,
    .swiper-button-prev {
      color: #E7B10A !important;
    }

    h1,
    h2,
    h4 {
      color: #E7B10A;
    }

    h3,
    h5 {
      color: #F7F1E5;
    }

    .common-button {
      color: #E7B10A;
      border: 1px solid #4C4B16;
      background: #4C4B16;
    }

    .game-text {
      color: #E7B10A;
    }

    .slot-cards__card {
      background: #4C4B16;
      border: 1px solid #E7B10A;
      box-shadow: 0px 0px 10px 0px rgba(96.67585066162559, 31.59782608695651, 255, 0.14);
    }

    .slot-cards__text {
      background: #4C4B16;
    }

    .slot-cards__card h4 {
      color: #E7B10A;
    }

    .slot-cards__card button {
      color: #E7B10A;
    }

    footer {
      color: #F7F1E5;
      background: #E7B10A;
    }

    .common-input {
      background: transparent;
      color: #4C4B16;
      border: 1px solid #4C4B16;

    }

    .common-input {
      min-width: 300px;
    }

    footer form input::placeholder,
    .common-input::placeholder {
      color: #F7F1E5;
    }

    .modal-18 {
      background: #F7F1E5;
      color: #E7B10A;

    }

    .modal-cookie__modal {
      background: #F7F1E5;
      color: #E7B10A;
    }

    .common-button-2 {
      border: 1px solid #4C4B16;
      color: #4C4B16;
      background: #E7B10A !important;
    }

    .play-btn {
      color: #E7B10A;
      background: #4C4B16;
    }

    .play-btn:hover {
      opacity: 0.5;
    }

    .slot-cards__card {
      background: #4C4B16;
    }

  }

  .color-scheme-20 {
    .close-slot {
      background: #1B120F;
    }

    .close-slot:before,
    .close-slot:after {
      background-color: #8F1D14;
    }

    .top-plank {
      color: #1B120F;
      background: #8F1D14;
    }

    header {
      background: #8F1D14;
    }

    .body {
      /*color: #3167FF;*/
      background: #E6DEDD;
    }

    .sitename {
      color: #1B120F;
    }

    .menu-pc li a {
      color: #E6DEDD;
    }

    .menu-pc li a:hover {
      color: #1B120F;
    }

    .menu-btn__wrapper {
      background: #8F1D14;
    }

    .menu-btn-1 span,
    .menu-btn-1 span::before,
    .menu-btn-1 span::after {
      background: #E6DEDD;
    }

    .menu-btn__wrapper:hover {
      background: #E6DEDD;
    }

    .menu-btn__wrapper:hover .menu-btn-1 span,
    .menu-btn__wrapper:hover .menu-btn-1 span::before,
    .menu-btn__wrapper:hover .menu-btn-1 span::after {
      background: #1B120F;
    }

    .menu li {
      background: #E6DEDD;
      color: #8F1D14;
    }

    .menu li:hover {
      background: #8F1D14;
      color: #1B120F;
    }

    .swiper-button-next,
    .swiper-button-prev {
      color: #8F1D14 !important;
    }

    h1,
    h2,
    h4 {
      color: #8F1D14;
    }

    h3,
    h5 {
      color: #E6DEDD;
    }

    .common-button {
      color: #8F1D14;
      border: 1px solid #1B120F;
      background: #1B120F;
    }

    .game-text {
      color: #8F1D14;
    }

    .slot-cards__card {
      background: #1B120F;
      border: 1px solid #8F1D14;
      box-shadow: 0px 0px 10px 0px rgba(96.67585066162559, 31.59782608695651, 255, 0.14);
    }

    .slot-cards__text {
      background: #1B120F;
    }

    .slot-cards__card h4 {
      color: #8F1D14;
    }

    .slot-cards__card button {
      color: #8F1D14;
    }

    footer {
      color: #E6DEDD;
      background: #8F1D14;
    }

    .common-input {
      background: transparent;
      color: #1B120F;
      border: 1px solid #1B120F;

    }

    .common-input {
      min-width: 300px;
    }

    footer form input::placeholder,
    .common-input::placeholder {
      color: #E6DEDD;
    }

    .modal-18 {
      background: #E6DEDD;
      color: #8F1D14;

    }

    .modal-cookie__modal {
      background: #E6DEDD;
      color: #8F1D14;
    }

    .common-button-2 {
      border: 1px solid #1B120F;
      color: #1B120F;
      background: #8F1D14 !important;
    }

    .play-btn {
      color: #8F1D14;
      background: #1B120F;
    }

    .play-btn:hover {
      opacity: 0.5;
    }

    .slot-cards__card {
      background: #1B120F;
    }

  }

  .card-rounded-1 {

    .modal-18 {

      border-radius: 3px;
    }

    .modal-cookie__modal {

      border-radius: 3px;
    }

    .slot-cards__card {
      border-radius: 8px;
    }
  }

  .card-rounded-2 {
    .modal-18 {

      border-radius: 8px;
    }

    .modal-cookie__modal {

      border-radius: 8px;
    }

    .slot-cards__card {
      border-radius: 16px;
    }
  }

  .card-rounded-3 {
    .modal-18 {

      border-radius: 16px;
    }

    .modal-cookie__modal {

      border-radius: 16px;
    }

    .slot-cards__card {
      border-radius: 16px;
    }
  }

  .card-rounded-4 {
    .modal-18 {

      border-radius: 0px;
    }

    .modal-cookie__modal {

      border-radius: 0px;
    }

    .slot-cards__card {
      border-radius: 0px;
    }
  }

  .card-rounded-5 {
    .modal-18 {

      border-radius: 25px;
    }

    .modal-cookie__modal {

      border-radius: 25px;
    }

    .slot-cards__card {
      border-radius: 25px;
    }
  }

  .common-input {
    min-width: 300px;
  }

  footer form input::placeholder,
  .common-input::placeholder {}

  .modal-area {
    position: fixed;
    height: 100vh;
    width: 100vw;
    top: 0;
    overflow: hidden;
    z-index: 999;
    display: none;
    justify-content: center;
    align-items: center;
    background: rgba(0, 0, 0, 0.7);
  }

  .modal-18 {
    padding: 24px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    overflow: hidden;
  }

  .modal-18__header {
    font-size: 32px;
    font-weight: 600;
  }

  .modal-18 a {
    text-decoration: underline;
  }

  .common-button {
    font-size: 21px;
    font-weight: 500;

    padding: 12px 24px;
    min-width: 100px;
  }

  .common-button-2 {
    font-size: 21px;
    font-weight: 500;
    padding: 12px 24px;
    min-width: 100px;
  }

  .modal-cookie {
    position: fixed;
    top: 0;
    height: 100vh;
    width: 100vw;
    overflow: hidden;
    z-index: 999;
    display: none;
    justify-content: flex-end;
    align-items: flex-end;
    background: rgba(0, 0, 0, 0.7);
  }

  .modal-cookie__modal {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 20px;
    padding: 24px;
    justify-content: center;
    align-items: center;
    font-weight: bold;
    text-align: center;
  }

  .modal-cookie__header {
    font-size: 24px;
  }

  .top-content-modal h1 {
    font-size: 23px;
    font-weight: 600;
    text-transform: capitalize;
    text-align: center;
  }

  .top-content-modal p {
    text-align: center;
    font-size: 18px;
    font-weight: 400;
  }



  .log-in-modal {
    position: fixed;
    height: 100vh;
    width: 100vw;
    top: 0;
    overflow: hidden;
    z-index: 996;
    display: none;
    justify-content: center;
    align-items: center;
    background: rgba(0, 0, 0, 0.7);
  }

  .form-log-in {
    display: flex;
    flex-direction: column;
    gap: 16px;
    margin-bottom: 20px;
    position: relative;
  }

  .close-contact {
    top: 0 !important;
    right: 0 !important;
  }

  .register-now {
    margin-top: 20px;
    border: none;
    outline: none;
    background: transparent;
    font-size: 20px;
    font-weight: bold;
    text-decoration: underline;
  }

  .hidden {
    display: none !important;
  }

  .visible {
    display: flex !important;
  }

  .play-demo {
    margin-top: 0px;
    border: none;
    outline: none;
    background: transparent;
    font-size: 14px;
    font-weight: normal;
    text-decoration: underline;
  }

  @media screen and (max-width: 320px) {
    .common-button {
      font-size: 16px;
      padding: 0px;
    }
  }

  .game-text {
    white-space: break-spaces !important;
  }
  .game-text{
    margin-top: 40px;
    margin-bottom: 40px;
  }
}
</style>
