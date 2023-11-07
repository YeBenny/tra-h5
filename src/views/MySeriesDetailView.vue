<script setup>
import { onMounted, ref } from 'vue'
import router from '@/router'
import { useRoute } from 'vue-router'
import Loading from '../components/Loading.vue'
import LazyImage from '../components/LazyImage.vue'
import ItemTRA from '../components/ItemTRA.vue'
import ItemRedemption from '../components/ItemRedemption.vue'
import DialogShareTRA from '../components/DialogShareTRA.vue'
import DialogRedeemTRA from '../components/DialogRedeemTRA.vue'
import { getSeriesDetail, getTraList, getRedemptionList, redeemTRA } from '../axios'

const { id } = useRoute().params

const series = ref()
const tab = ref()
const traList = ref([])
const redemptionList = ref([])
const dialogShare = ref(false)
const selectedTra = ref()
const dialogRedeem = ref(false)
const selectedRedemption = ref()
const overlay = ref(false)
const snackbar = ref(false)
const color = ref()
const msg = ref()

const getData = async () => {
  try {
    overlay.value = true
    let result = await getSeriesDetail(id)
    series.value = result
    result = await getTraList(id)
    traList.value = result
    result = await getRedemptionList(id)
    redemptionList.value = result
  } catch (err) {
    console.log(err)
  } finally {
    overlay.value = false
  }
}

onMounted(() => {
  getData()
})

const redeemTra = (redemption) => {
  const redemptionTraInfos = redemption.redemptionTraInfos
  let canRedeem = true
  redemptionTraInfos.forEach((redemptionTraInfo) => {
    canRedeem = false
    let tra = traList.value.find((tra) => tra.traInfo.id === redemptionTraInfo.traId)
    if (tra && tra.assetList) {
      canRedeem =
        tra.assetList.filter((asset) => asset.value === 1 && asset.writeOff === false).length >=
        redemptionTraInfo.quantity
    }
    if (!canRedeem) {
      return
    }
  })
  if (canRedeem) {
    dialogRedeem.value = true
    selectedRedemption.value = redemption
  } else {
    snackbar.value = true
    color.value = 'error'
    msg.value = 'Not Enough TRA'
  }
}

const redeem = async (redemption, redeemItems) => {
  const redemptionRule = redemption.redemptionRule
  try {
    overlay.value = true
    let result = await redeemTRA(redemptionRule.id, redeemItems)
    console.log(result)
    snackbar.value = true
    color.value = 'success'
    msg.value = 'Redeem Successfully'
  } catch (err) {
    console.log(err)
    snackbar.value = true
    color.value = 'error'
    msg.value = err
  } finally {
    overlay.value = false
    dialogRedeem.value = false
  }
}

const shareTra = (tra) => {
  dialogShare.value = true
  selectedTra.value = tra
}
</script>

<template>
  <v-layout
    class="h-auto"
    :style="{
      minHeight: '100%'
    }"
  >
    <v-app-bar :title="series ? series.title : ''" color="primary" density="compact" fixed flat>
      <v-app-bar-nav-icon>
        <v-btn icon="mdi-arrow-left" @click="router.back()" />
      </v-app-bar-nav-icon>
    </v-app-bar>
    <v-main class="bg-white">
      <v-container class="h-100 pa-0" fluid>
        <v-container v-if="series" class="my-4" fluid>
          <v-row justify="center">
            <v-col cols="auto">
              <v-card elevation="0">
                <LazyImage
                  bg-color="bg-white"
                  :src="series.image"
                  width="218"
                  :aspect-ratio="1"
                  contain
                />
              </v-card>
            </v-col>
            <v-col cols="12">
              <p class="text-caption font-weight-bold text-center">{{ series.title }}</p>
              <p class="text-caption text-description text-center">{{ series.description }}</p>
            </v-col>
          </v-row>
        </v-container>

        <v-tabs v-model="tab" bg-color="primary" align-tabs="center">
          <v-tab value="tra">TRA</v-tab>
          <v-tab value="redemption">Redemption</v-tab>
        </v-tabs>

        <v-window v-model="tab">
          <v-window-item value="tra">
            <v-container fluid>
              <v-row>
                <v-col v-for="(tra, index) in traList" :key="index" cols="12">
                  <ItemTRA
                    :own-number="tra.ownNumber"
                    :tra-info="tra.traInfo"
                    @click="shareTra(tra)"
                  />
                </v-col>
              </v-row>
            </v-container>
          </v-window-item>
          <v-window-item value="redemption">
            <v-container fluid>
              <v-row justify="center">
                <v-col v-for="(redemption, index) in redemptionList" :key="index" cols="12">
                  <ItemRedemption :redemption="redemption" @on-click-redeem="redeemTra" />
                </v-col>
              </v-row>
            </v-container>
          </v-window-item>
        </v-window>
      </v-container>
    </v-main>
  </v-layout>

  <DialogShareTRA
    v-if="series && selectedTra"
    :series="series"
    :dialog="dialogShare"
    :tra="selectedTra"
    @on-close="dialogShare = false"
  />

  <DialogRedeemTRA
    v-if="traList && selectedRedemption"
    :tra-list="traList"
    :redemption="selectedRedemption"
    :dialog="dialogRedeem"
    @on-close="dialogRedeem = false"
    @on-click-redeem="redeem"
  />

  <v-snackbar v-model="snackbar" :color="color" timeout="3000">
    {{ msg }}
  </v-snackbar>

  <Loading :overlay="overlay" />
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

.text-description {
  color: #2c3e50;
}

.bottom-container {
  position: absolute;
  bottom: 0;
  left: 0;
}
</style>
