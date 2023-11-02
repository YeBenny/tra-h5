<script setup>
import LazyImage from './LazyImage.vue'

defineProps({
  series: {
    type: Object
  }
})
</script>

<!-- <template>
  <v-card>
    <v-container class="py-3 px-4">
      <v-row justify="space-between">
        <v-col cols="auto" align-self="center">
          <v-card elevation="0">
            <LazyImage
              bg-color="bg-white"
              src="images/cover.png"
              width="48"
              :aspect-ratio="1"
              cover
            />
            <v-overlay v-model="overlap" class="align-center justify-center" contained persistent>
              <v-img src="images/locker.png" width="16"></v-img>
            </v-overlay>
          </v-card>
        </v-col>
        <v-col align-self="center">
          <p class="text-caption font-weight-bold">Baekhyun Series</p>
          <p class="text-caption text-description">4/8 Collections</p>
        </v-col>
        <v-col cols="auto" align-self="center">
          <v-img src="images/arrow_right.png" width="8"></v-img>
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template> -->
<template>
  <v-card v-if="series" class="mx-auto">
    <LazyImage bg-color="bg-white" :src="series.image" contain />
    <v-card-title>{{ series.title }}</v-card-title>
    <v-card-text>{{ series.description }}</v-card-text>
  </v-card>
</template>

<style>
.text-description {
  color: #2c3e50;
}
</style>
