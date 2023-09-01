<template>
  <tbody>
  <tr v-for="row in props.height" :key="row">
    <td v-for="ceil in props.width" :key="ceil">
      <v-skeleton-loader type="heading"></v-skeleton-loader>
    </td>
  </tr>
  </tbody>
</template>

<script lang="ts" setup>
const props = defineProps({
  width: Number,
  height: Number
})
</script>

<style lang="scss" scoped>
:deep(.v-skeleton-loader__heading){
  margin: 0 !important;
}
td {
  text-align: left;
  height: 56px !important;
  padding: 0 16px;
  white-space: nowrap;
  max-width: 190px;
}
</style>
