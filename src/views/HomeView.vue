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
    <v-app-bar :title="title" color="primary" density="compact" fixed> </v-app-bar>
    <main class="w-100">
      <v-carousel class="h-100">
        <v-carousel-item v-for="i in 6" :key="i" @click="onClickHome">
          <LazyImage
            class="h-100"
            :src="`https://picsum.photos/512/1024?random=${Date.now()}`"
            cover
          ></LazyImage>
        </v-carousel-item>
      </v-carousel>
    </main>
  </v-layout>
</template>
