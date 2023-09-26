<script setup>
const props = defineProps({
  id: {
    type: String
  }
})
</script>
<template>
  <v-list-item
    :prependAvatar="`https://picsum.photos/200?random=${Date.now()}`"
    :title="`TRA-${id}`"
    :subtitle="$d(new Date(), 'long')"
  ></v-list-item>
</template>
