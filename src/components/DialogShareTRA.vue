<script setup>
import { ref, toRefs } from 'vue'
import html2canvas from 'html2canvas'
import Loading from './Loading.vue'
import LazyImage from './LazyImage.vue'

const props = defineProps({
  dialog: {
    type: Boolean,
    required: true
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
        title: 'Share Title',
        text: 'Share Text',
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
      <v-toolbar class="rounded-t-xl" color="white" title="ABC Series" density="comfortable">
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
                src="https://picsum.photos/200"
                width="218"
                :aspect-ratio="1"
                cover
              />
            </v-col>
            <v-col cols="12">
              <p class="text-caption font-weight-bold text-center">TRA-1</p>
              <p class="text-caption text-description text-center">{{ $d(new Date(), 'long') }}</p>
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
