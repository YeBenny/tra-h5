<script setup>
import { toRefs } from 'vue'

const props = defineProps({
  overlay: {
    type: Boolean,
    required: true
  }
})

const { overlay } = toRefs(props)
</script>

<template>
  <v-overlay :model-value="overlay" class="align-center justify-center" persistent>
    <v-progress-circular color="primary" indeterminate size="64"></v-progress-circular>
  </v-overlay>
</template>
