<script setup>
import LazyImage from './LazyImage.vue'

defineProps({
  ownNumber: {
    type: Number
  },
  traInfo: {
    type: Object
  }
})
</script>
<template>
  <v-list-item :title="traInfo.title" :subtitle="traInfo.description" :disabled="ownNumber === 0">
    <template v-slot:prepend>
      <v-avatar color="grey-lighten-1" size="x-large">
        <LazyImage :src="traInfo.image" contain />
      </v-avatar>
    </template>
    <template v-slot:append>
      <p class="text-grey">x {{ ownNumber }}</p>
    </template>
  </v-list-item>
</template>
