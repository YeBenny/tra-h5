<script setup>
import { onMounted, ref } from 'vue'
import router from '@/router'
import { useRoute } from 'vue-router'
import Loading from '../components/Loading.vue'
import LazyImage from '../components/LazyImage.vue'
import ItemTRA from '../components/ItemTRA.vue'
import ItemRedemption from '../components/ItemRedemption.vue'
import DialogShareTRA from '../components/DialogShareTRA.vue'
import { getSeriesDetail, getTraList, getRedemptionList } from '../axios'

const { id } = useRoute().params

const series = ref()
const tab = ref()
const traList = ref([])
const redemptionList = ref([])
const selectedTra = ref()
const dialog = ref(false)
const overlay = ref(false)

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

const shareTra = (tra) => {
  dialog.value = true
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
                  <ItemRedemption
                    :redemption-rule="redemption.redemptionRule"
                    :redemption-tra-infos="redemption.redemptionTraInfos"
                  />
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
    :dialog="dialog"
    :own-number="selectedTra.ownNumber"
    :tra-info="selectedTra.traInfo"
    @on-close="dialog = false"
  />

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
