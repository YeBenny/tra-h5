<template>
  <v-row justify="center">
    <v-col cols="4">
      <v-img cover :src="`https://picsum.photos/200?random=${Date.now()}`"></v-img>
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
</template>
