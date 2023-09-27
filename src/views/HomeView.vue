<script setup>
import { ref } from 'vue'
import router from '@/router'
import LazyImage from '../components/LazyImage.vue'

const title = ref('Home')

const onClickHome = () => {
  router.push({ name: 'my-series' })
}
</script>

<template>
  <v-layout
    class="h-auto"
    :style="{
      minHeight: '100%'
    }"
  >
    <v-app-bar :title="title" color="primary" density="compact" fixed flat> </v-app-bar>
    <v-main class="bg-color">
      <v-container fluid>
        <v-row justify="center">
          <v-col cols="12">
            <v-carousel height="480" cycle>
              <v-carousel-item v-for="i in 6" :key="i">
                <LazyImage :src="`https://picsum.photos/512/1024?random=${Date.now()}`" cover>
                </LazyImage>
              </v-carousel-item>
            </v-carousel>
          </v-col>
          <v-col cols="auto">
            <v-btn color="primary" @click="onClickHome">Enter</v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-layout>
</template>
