<script setup>
defineProps({
  bgColor: {
    type: String,
    default: 'bg-grey-lighten-4'
  },
  src: {
    type: String,
    required: true
  },
  maxHeight: {
    type: Number
  },
  aspectRatio: {
    type: Number
  },
  size: {
    type: Number
  }
})
</script>

<template>
  <v-img :class="bgColor" :src="src" :max-height="maxHeight" :aspect-ratio="aspectRatio">
    <template v-slot:placeholder>
      <v-row class="fill-height ma-0" align-content="center" justify="center">
        <v-progress-circular
          :size="size"
          color="grey-lighten-5"
          indeterminate
        ></v-progress-circular>
      </v-row>
    </template>
  </v-img>
</template>
