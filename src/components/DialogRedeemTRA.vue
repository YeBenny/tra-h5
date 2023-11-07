<script setup>
import { computed, onMounted, ref, toRefs } from 'vue'
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
  for (let i = 0; i < selects.value.length; i++) {
    let traInfo = traList.value[i].traInfo
    let select = selects.value[i]
    select.value.forEach((item) => {
      let redeemItem = {
        traId: traInfo.id,
        contractAddress: traInfo.contractAddress,
        assetIds: item.value.replace(/\s/g, '').split(',')
      }
      redeemItems.push(redeemItem)
    })
  }
  emits('onClickRedeem', redemption, redeemItems)
}

const overlay = ref(false)
const canRedeems = ref([])
const selects = ref([])

const canRedeem = computed(() => {
  return canRedeems.value.length > 0 && canRedeems.value.filter((item) => !item).length === 0
})

onMounted(() => {
  for (let i = 0; i < traList.value.length; i++) {
    canRedeems.value[i] = false
    selects.value[i] = ref()
  }
})
</script>
<template>
  <v-dialog v-model="dialog" scrollable fullscreen persistent>
    <v-container class="bottom-container pa-0" fluid>
      <v-toolbar
        class="rounded-t-xl"
        :title="redemption.redemptionRule.title"
        color="white"
        density="comfortable"
      >
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
              :label="tra.traInfo.title"
              :rules="[
                (e) => {
                  let quantity =
                    redemption.redemptionTraInfos.find(
                      (redemptionTraInfo) => redemptionTraInfo.traId === tra.traInfo.id
                    )?.quantity || 0
                  let canRedeem = e && e.length === quantity
                  canRedeems[index] = canRedeem
                  return canRedeem || `You must choose ${quantity} asset(s).`
                }
              ]"
              :menu-props="{
                closeOnContentClick: true
              }"
              item-title="id"
              item-value="id"
              color="primary"
              multiple
              hide-selected
              chips
              closable-chips
            >
              <template v-slot:item="{ props, item }">
                <v-list-item
                  v-bind="props"
                  :title="`${tra.traInfo.title} #${item.raw.id}`"
                  :subtitle="tra.traInfo.description"
                  :disabled="item.raw.value === 0 || item.raw.writeOff === true"
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
              :disabled="!canRedeem"
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
