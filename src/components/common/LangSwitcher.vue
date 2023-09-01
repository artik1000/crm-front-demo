<template>
  <v-btn
    class="mr-1"
    variant="plain"
    icon
  >
    <Flag
      :code="languages.filter(e => e.ln === selectedLanguage)[0].flag"
      size="large"
      rounded="circle"
    />
    <v-menu activator="parent">
      <v-list>
        <v-list-item
          v-for="language in languages"
          :key="language.id"
          style="cursor: pointer"
        >
          <Flag
            :code="language.flag"
            size="large"
            rounded="circle"
            has-border
            @click="langSwitcher(language)"
          />
        </v-list-item>
      </v-list>
    </v-menu>
  </v-btn>
</template>

<script lang="ts" setup>
import Flag from "@/components/common/Flag.vue";

import {ref, onMounted} from "vue";

import {defaultLocale} from "@/i18n";

import { useI18n } from "vue-i18n";

const { t , locale } = useI18n({ useScope: "global" })

const languages = ref([
  {
    id: 0,
    ln: 'en',
    flag: 'GB'
  },
  {
    id: 1,
    ln: 'ru',
    flag: 'RU'
  },
])

let selectedLanguage = ref(defaultLocale)

function langSwitcher (language: object) {
  selectedLanguage.value = language.ln
  locale.value = language.ln
  if(localStorage.getItem('ln')){
    localStorage.removeItem('ln')
  }
  localStorage.setItem("ln", selectedLanguage.value)
}
onMounted(() => {
  if(localStorage.getItem('ln')){
    selectedLanguage.value = localStorage.getItem('ln')
    locale.value = localStorage.getItem('ln')
  }
})
</script>

<style lang="scss" scoped>

</style>
