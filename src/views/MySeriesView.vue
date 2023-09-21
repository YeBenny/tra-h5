<script setup>
import { ref } from 'vue'
import router from '@/router'
import ItemSeries from '../components/ItemSeries.vue'

const title = ref('MY SERIES')
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
    <v-app-bar color="primary" :title="title" elevation="0" extension-height="100" fixed>
      <v-app-bar-nav-icon>
        <v-btn icon="mdi-arrow-left" @click="router.back()" />
      </v-app-bar-nav-icon>
      <template v-slot:extension>
        <div class="w-100 rounded-t-xl" :style="{ backgroundColor: 'rgba(51, 51, 51, 0.8)' }">
          <div class="text-white ma-3 d-flex justify-center">
            Complete the mission & win rewards!🎉
          </div>
          <div class="w-100 py-4 bg-color rounded-t-xl"></div>
        </div>
      </template>
    </v-app-bar>
    <v-main class="bg-color">
      <v-container class="h-100 pa-4">
        <v-row justify="center">
          <v-col cols="4">
            <v-img cover src="images/empty_box.png"></v-img>
          </v-col>
          <v-col cols="12">
            <p class="font-weight-bold text-center">We found 0 collection(s)</p>
          </v-col>
          <v-col cols="12">
            <p class="font-weight-regular text-center">
              In the meantime, feel free to browse our wide selection of products and services.
            </p>
          </v-col>
        </v-row>
        <v-row>
          <v-col v-for="n in 3" :key="n" cols="12">
            <ItemSeries />
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
