<script setup>
import { ref } from 'vue'
import router from '@/router'
import Loading from '../components/Loading.vue'
import { useConfigStore } from '../stores/config'
import { storeToRefs } from 'pinia'
import { getTokenContext } from '../axios'

const title = ref('Home')
const overlay = ref(false)
const tab = ref(null)

const appIdRegsiterRef = ref('10b4b0c4-7605-11ee-b5fb-018bb7f5a65d')
const appSecretRegisterRef = ref('01fff3db0c0cd53ee09865236a50aaa982ddae01014e2c44795c99ea59cd7458')

const upstreamUserIdRef = ref('FL0000000001')
const appIdRef = ref('10b4b0c4-7605-11ee-b5fb-018bb7f5a65d')
const appSecretRef = ref('01fff3db0c0cd53ee09865236a50aaa982ddae01014e2c44795c99ea59cd7458')

const onClickRegister = async () => {}

const onClickHome = async () => {
  let upstreamUserId = upstreamUserIdRef.value
  let appId = appIdRef.value
  let appSecret = appSecretRef.value
  try {
    overlay.value = true
    let data = await getTokenContext(upstreamUserId, appId, appSecret)

    let store = useConfigStore()
    let { config } = storeToRefs(store)
    let { timestamp, signature } = data
    config.value.webTraBaseUrl = import.meta.env.VITE_BASE_URL
    if (upstreamUserId) {
      config.value.upstreamUserId = upstreamUserId
    }
    if (appId) {
      config.value.appId = appId
    }
    if (timestamp) {
      config.value.timestamp = timestamp
    }
    if (signature) {
      config.value.signature = signature
    }
    router.push({ name: 'my-series' })
  } catch (err) {
    console.log(err)
  } finally {
    overlay.value = false
  }
}
</script>

<template>
  <v-layout
    class="h-auto"
    :style="{
      minHeight: '100%'
    }"
  >
    <v-app-bar :title="title" color="primary" density="compact" fixed flat>
      <template v-slot:extension>
        <v-tabs v-model="tab">
          <v-tab value="operator">Operator</v-tab>
          <v-tab value="user">End User</v-tab>
        </v-tabs>
      </template>
    </v-app-bar>
    <v-main class="bg-white">
      <v-window v-model="tab">
        <v-window-item value="operator">
          <v-container fluid>
            <v-row justify="center">
              <v-col cols="12">
                <v-text-field v-model="appIdRegsiterRef" label="App ID" required></v-text-field>
                <v-text-field
                  v-model="appSecretRegisterRef"
                  label="App Secret"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="auto">
                <v-btn color="primary" @click="onClickRegister">Register</v-btn>
              </v-col>
            </v-row>
          </v-container>
        </v-window-item>
        <v-window-item value="user">
          <v-container fluid>
            <v-row justify="center">
              <v-col cols="12">
                <v-text-field
                  v-model="upstreamUserIdRef"
                  label="Upstream User ID"
                  required
                ></v-text-field>
                <v-text-field v-model="appIdRef" label="App ID" required></v-text-field>
                <v-text-field v-model="appSecretRef" label="App Secret" required></v-text-field>
              </v-col>
              <v-col cols="auto">
                <v-btn color="primary" @click="onClickHome">My TRA</v-btn>
              </v-col>
            </v-row>
          </v-container>
        </v-window-item>
      </v-window>
    </v-main>
  </v-layout>

  <Loading :overlay="overlay" />
</template>
