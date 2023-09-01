<template>
  <section>
    <v-card elevation="0" rounded="lg" class="common-card">
      <router-view name="dashboard"/>
    </v-card>
  </section>
</template>
<style lang="scss" scoped>
.v-card{
  overflow: visible !important;
}
</style>
