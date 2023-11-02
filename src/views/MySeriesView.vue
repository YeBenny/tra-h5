<script setup>
import { onMounted, ref } from 'vue'
import router from '@/router'
import EmptySeries from '../components/EmptySeries.vue'
import ItemSeries from '../components/ItemSeries.vue'
import { useConfigStore } from '../stores/config'
import { storeToRefs } from 'pinia'
import { getToken, getSeriesList } from '../axios'

const title = ref('My Series Title')
const overlay = ref(false)
const seriesList = ref([])
const isLoading = ref(true)
const isFinish = ref(true)
const pageSize = 10
var startIndex = 1

const onClickSeries = (series) => {
  router.push({ name: 'my-series-detail', params: { id: series.id } })
}

const getAppToken = async (upstreamUserId, appId, signature, timestamp) => {
  let data
  try {
    overlay.value = true
    data = await getToken(upstreamUserId, appId, signature, timestamp)
    return data
  } catch (err) {
    console.log(err)
    return data
  } finally {
    overlay.value = false
  }
}

const getData = async () => {
  try {
    overlay.value = true
    isLoading.value = true
    isFinish.value = true
    startIndex = 1
    seriesList.value = []
    let data = await getSeriesList(startIndex, pageSize)
    let list = data.result
    let totalRows = data.pageInfo.totalRows
    seriesList.value.push(...list)
    isFinish.value = totalRows === 0 || startIndex + pageSize >= totalRows
  } catch (err) {
    console.log(err)
    isFinish.value = true
    startIndex = 1
  } finally {
    overlay.value = false
    isLoading.value = false
  }
}

const loadMoreData = async () => {
  try {
    if (!isLoading.value && !isFinish.value) {
      isLoading.value = true
      startIndex = startIndex + pageSize
      let data = await getSeriesList(startIndex, pageSize)
      let list = data.result
      let totalRows = data.pageInfo.totalRows
      seriesList.value.push(...list)
      isFinish.value = totalRows === 0 || startIndex + pageSize >= totalRows
    }
  } catch (err) {
    console.log(err)
    isFinish.value = false
    startIndex = startIndex - pageSize
  } finally {
    overlay.value = false
    isLoading.value = false
  }
}

onMounted(async () => {
  window.onscroll = () => {
    let isBottom =
      document.documentElement.scrollTop + window.innerHeight ===
      document.documentElement.offsetHeight
    if (isBottom) {
      loadMoreData()
    }
  }

  let store = useConfigStore()
  let { config } = storeToRefs(store)
  let upstreamUserId = config.value.upstreamUserId
  let appId = config.value.appId
  let timestamp = config.value.timestamp
  let signature = config.value.signature
  let webTraAccessToken = await getAppToken(upstreamUserId, appId, signature, timestamp)
  if (webTraAccessToken) {
    config.value.webTraAccessToken = webTraAccessToken
  }

  await getData()
})
</script>
<template>
  <v-layout
    class="h-auto"
    :style="{
      minHeight: '100%',
      backgroundImage: 'linear-gradient(180deg, #FFBC25 0.15%, #F2B64B 35.74%, #F2994A 83.5%)',
      backgroundSize: '100% 100%'
    }"
  >
    <v-app-bar color="primary" :title="title" extension-height="100" density="compact" fixed flat>
      <v-app-bar-nav-icon>
        <v-btn icon="mdi-arrow-left" @click="router.back()" />
      </v-app-bar-nav-icon>
      <template v-slot:extension>
        <div class="w-100 rounded-t-xl" :style="{ backgroundColor: 'rgba(51, 51, 51, 0.8)' }">
          <div class="text-white ma-3 d-flex justify-center">My Series Description</div>
          <div class="w-100 py-4 bg-white rounded-t-xl"></div>
        </div>
      </template>
    </v-app-bar>
    <v-main class="bg-white">
      <v-container class="h-100" fluid>
        <v-row v-if="seriesList.length === 0">
          <EmptySeries />
        </v-row>
        <v-row v-else>
          <v-col v-for="(series, index) in seriesList" :key="index" cols="6">
            <ItemSeries :series="series" @click="onClickSeries(series)" />
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-layout>
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
</style>
