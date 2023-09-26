<script setup>
import { ref } from 'vue'
import router from '@/router'
import LazyImage from '../components/LazyImage.vue'
import ItemTRA from '../components/ItemTRA.vue'

const title = ref('My Series Detail')
const dialog = ref(false)
</script>

<template>
  <v-layout
    class="h-auto"
    :style="{
      minHeight: '100%'
    }"
  >
    <v-app-bar :title="title" color="primary" density="compact" fixed flat>
      <v-app-bar-nav-icon>
        <v-btn icon="mdi-arrow-left" @click="router.back()" />
      </v-app-bar-nav-icon>
    </v-app-bar>
    <v-main class="bg-color">
      <v-container class="h-100 pa-0">
        <v-container class="my-4">
          <v-row justify="center">
            <v-col cols="auto">
              <v-card elevation="0">
                <LazyImage
                  bg-color="bg-white"
                  :src="`https://picsum.photos/200?random=${Date.now()}`"
                  width="218"
                  :aspect-ratio="1"
                  cover
                />
              </v-card>
            </v-col>
            <v-col cols="12">
              <p class="text-caption font-weight-bold text-center">ABC Series</p>
              <p class="text-caption text-description text-center">4/8 Collections</p>
            </v-col>
          </v-row>
        </v-container>

        <v-divider :thickness="8"></v-divider>

        <v-container>
          <v-row>
            <v-col v-for="n in 10" :key="n" cols="12">
              <ItemTRA :id="n" @click="dialog = true" />
            </v-col>
          </v-row>
        </v-container>
      </v-container>
    </v-main>
  </v-layout>

  <v-dialog v-model="dialog" scrollable fullscreen persistent>
    <v-container class="bottom-container pa-0">
      <v-toolbar class="rounded-t-xl" color="white" title="ABC Series">
        <v-spacer></v-spacer>
        <v-btn icon @click="dialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-container class="bg-white">
        <v-row justify="center">
          <v-col cols="auto">
            <v-card elevation="0">
              <LazyImage
                bg-color="bg-white"
                src="https://picsum.photos/200"
                width="218"
                :aspect-ratio="1"
                cover
              />
            </v-card>
          </v-col>
          <v-col cols="12">
            <p class="text-caption font-weight-bold text-center">TRA-1</p>
            <p class="text-caption text-description text-center">{{ $d(new Date(), 'long') }}</p>
          </v-col>
        </v-row>
        <v-row justify="center">
          <v-col cols="10">
            <v-btn class="text-capitalize" elevation="0" color="primary" block rounded>Share</v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-container>
  </v-dialog>
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

.text-description {
  color: #2c3e50;
}

.bottom-container {
  position: absolute;
  bottom: 0;
  left: 0;
}
</style>
