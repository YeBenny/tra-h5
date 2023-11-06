<script setup>
import { onMounted, ref, toRefs } from 'vue'
import LazyImage from './LazyImage.vue'
import Loading from './Loading.vue'

const props = defineProps({
  dialog: {
    type: Boolean,
    required: true
  },
  redemption: {
    Object
  },
  traList: {
    type: Array
  }
})

const { dialog, traList } = toRefs(props)
const emits = defineEmits(['onClose', 'onClickRedeem'])
function onClose() {
  emits('onClose')
}
function onClickRedeem(redemption) {
  const redeemItems = []
  selects.forEach((select) => {
    for (let i = 0; i < select.value.length; i++) {
      let item = select.value[i]
      let traInfo = traList.value[i].traInfo
      let redeemItem = {
        traId: traInfo.id,
        contractAddress: traInfo.contractAddress,
        assetIds: item.value.replace(/\s/g, '').split(',')
      }
      redeemItems.push(redeemItem)
    }
  })
  emits('onClickRedeem', redemption, redeemItems)
}

const overlay = ref(false)
const selects = []

onMounted(() => {
  for (let i = 0; i < traList.value.length; i++) {
    selects.push(ref())
  }
})
</script>
<template>
  <v-dialog v-model="dialog" scrollable fullscreen persistent>
    <v-container class="bottom-container pa-0" fluid>
      <v-toolbar class="rounded-t-xl" :title="redemption.redemptionRule.title" color="white" density="comfortable">
        <v-spacer></v-spacer>
        <v-btn icon @click="onClose">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-container class="bg-white" fluid>
        <v-row justify="center">
          <v-col cols="12" v-for="(tra, index) in traList" :key="index">
            <v-select
              :ref="selects[index]"
              :items="tra.assetList"
              item-title="id"
              item-value="id"
              multiple
              chips
            >
              <template v-slot:item="{ props, item }">
                <v-list-item
                  v-bind="props"
                  :title="`${tra.traInfo.title} #${item.raw.id}`"
                  :subtitle="tra.traInfo.description"
                >
                  <template v-slot:prepend>
                    <v-avatar color="grey-lighten-1" size="x-large">
                      <LazyImage :src="tra.traInfo.image" contain />
                    </v-avatar>
                  </template>
                </v-list-item>
              </template>
            </v-select>
          </v-col>
          <v-col cols="10">
            <v-btn
              class="text-capitalize"
              elevation="0"
              color="primary"
              block
              rounded
              @click="onClickRedeem(redemption)"
            >
              Redeem
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-container>
  </v-dialog>

  <Loading :overlay="overlay" />
</template>
