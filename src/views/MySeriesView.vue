<script setup>
import { ref } from 'vue'
import router from '@/router'
import EmptySeries from '../components/EmptySeries.vue'
import ItemSeries from '../components/ItemSeries.vue'

const title = ref('My Series Title')
const series = ref([1, 2, 3, 4, 5, 6])

const onClickSeries = () => {
  router.push({ name: 'my-series-detail', params: { id: '332eb08e-081f-4724-a248-426e3cd4a9bb' } })
}
</script>
<template>
  <v-layout
    class="h-auto"
    :style="{
      minHeight: '100%',
      backgroundImage: 'linear-gradient(180deg, #FFBC25 0.15%, #F2B64B 35.74%, #F2994A 83.5%)',
      backgroundSize: '100% 100%'
    }"
  >
    <v-app-bar color="primary" :title="title" extension-height="100" density="compact" fixed flat>
      <v-app-bar-nav-icon>
        <v-btn icon="mdi-arrow-left" @click="router.back()" />
      </v-app-bar-nav-icon>
      <template v-slot:extension>
        <div class="w-100 rounded-t-xl" :style="{ backgroundColor: 'rgba(51, 51, 51, 0.8)' }">
          <div class="text-white ma-3 d-flex justify-center">My Series Description</div>
          <div class="w-100 py-4 bg-color rounded-t-xl"></div>
        </div>
      </template>
    </v-app-bar>
    <v-main class="bg-color">
      <v-container class="h-100">
        <v-row v-if="series.length === 0">
          <EmptySeries />
        </v-row>
        <v-row v-else>
          <v-col v-for="n in series.length" :key="n" cols="6">
            <ItemSeries @click="onClickSeries" />
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-layout>
</template>

<style>
.v-toolbar__content > .v-toolbar-title {
  position: absolute !important;
  width: 100% !important;
  margin-inline-start: 0px !important;
  text-align: center !important;
}

.v-toolbar__extension {
  align-items: end !important;
}

.bg-color {
  background: #fafcff;
}
</style>
