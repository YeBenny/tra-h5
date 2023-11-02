<script setup>
import { ref, toRefs } from 'vue'
import html2canvas from 'html2canvas'
import Loading from './Loading.vue'
import LazyImage from './LazyImage.vue'

const props = defineProps({
  dialog: {
    type: Boolean,
    required: true
  },
  series: {
    type: Object
  },
  ownNumber: {
    type: Number
  },
  traInfo: {
    type: Object
  }
})

const { dialog } = toRefs(props)
const emits = defineEmits(['onClose'])
function onClose() {
  emits('onClose')
}

const overlay = ref(false)

const shareViaWebShare = async () => {
  overlay.value = true
  let canvas = await html2canvas(document.querySelector('#share-content'), {
    backgroundColor: 'transparent',
    useCORS: true,
    allowTaint: true,
    imageTimeout: 0
  })
  await canvas.toBlob(async (blob) => {
    let type = blob.type.split('/')[1]
    let files = [new File([blob], `${Date.now()}.${type}`, { type: blob.type })]
    if (navigator.share) {
      navigator.share({
        title: 'Share Your TRA',
        text: 'Share ',
        files
      })
    }
    overlay.value = false
  })
}
</script>
<template>
  <v-dialog v-model="dialog" scrollable fullscreen persistent>
    <v-container class="bottom-container pa-0" fluid>
      <v-toolbar class="rounded-t-xl" color="white" :title="series.title" density="comfortable">
        <v-spacer></v-spacer>
        <v-btn icon @click="onClose">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-container class="bg-white" fluid>
        <v-row justify="center">
          <v-card id="share-content">
            <v-col cols="auto">
              <LazyImage
                bg-color="bg-white"
                :src="traInfo.image"
                width="218"
                :aspect-ratio="1"
                contain
              />
            </v-col>
            <v-col cols="12">
              <p class="text-caption font-weight-bold text-center">{{ traInfo.title }}</p>
              <p class="text-caption text-description text-center">{{ traInfo.description }}</p>
            </v-col>
          </v-card>
          <v-col cols="10">
            <v-btn
              class="text-capitalize"
              elevation="0"
              color="primary"
              block
              rounded
              @click="shareViaWebShare"
              >Share</v-btn
            >
          </v-col>
        </v-row>
      </v-container>
    </v-container>
  </v-dialog>

  <Loading :overlay="overlay" />
</template>
