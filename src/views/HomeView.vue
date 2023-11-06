<script setup>
import { ref } from 'vue'
import router from '@/router'
import Loading from '../components/Loading.vue'
import { useConfigStore } from '../stores/config'
import { storeToRefs } from 'pinia'
import { registerUpstreamUser, issueTra, getTokenContext } from '../axios'

const title = ref('Demo')
const overlay = ref(false)
const snackbar = ref(false)
const color = ref()
const msg = ref()
const tab = ref(null)

const appIdOperatorRef = ref('z3dmGarJ7KEI354VyctaqJf8NoOVQ0BHe1vkUxDXY')
const appSecretOperatorRef = ref('Jtx0suVNtGCb3eF8feJrvYqB5QWXHomKIVlFrqSzw')

const upstreamUserIdRegisterRef = ref('FL0000000001')
const upstreamUserIdIssueRef = ref('FL0000000001')
const traIdRef = ref('3fab6ee0-96a9-422c-ae56-a59c3bd1552f')
const remarkRef = ref('remark')

const upstreamUserIdRef = ref('FL0000000001')
const appIdRef = ref('z3dmGarJ7KEI354VyctaqJf8NoOVQ0BHe1vkUxDXY')
const appSecretRef = ref('Jtx0suVNtGCb3eF8feJrvYqB5QWXHomKIVlFrqSzw')

const onClickRegister = async () => {
  let store = useConfigStore()
  let { config } = storeToRefs(store)
  config.value.webTraBusinessBaseUrl = import.meta.env.VITE_BUSINESS_BASE_URL

  let upstreamUserId = upstreamUserIdRegisterRef.value
  let appId = appIdOperatorRef.value
  let appSecret = appSecretOperatorRef.value
  try {
    overlay.value = true
    await registerUpstreamUser(upstreamUserId, appId, appSecret)
    snackbar.value = true
    color.value = 'success'
    msg.value = 'Register successfully'
  } catch (err) {
    snackbar.value = true
    color.value = 'error'
    msg.value = err
  } finally {
    overlay.value = false
  }
}

const onClickIssue = async () => {
  let store = useConfigStore()
  let { config } = storeToRefs(store)
  config.value.webTraBusinessBaseUrl = import.meta.env.VITE_BUSINESS_BASE_URL

  let upstreamUserId = upstreamUserIdRegisterRef.value
  let traId = traIdRef.value
  let remark = remarkRef.value
  let appId = appIdOperatorRef.value
  let appSecret = appSecretOperatorRef.value
  try {
    overlay.value = true
    await issueTra(upstreamUserId, traId, remark, appId, appSecret)
    snackbar.value = true
    color.value = 'success'
    msg.value = 'Issue successfully'
  } catch (err) {
    snackbar.value = true
    color.value = 'error'
    msg.value = err
  } finally {
    overlay.value = false
  }
}

const onClickHome = async () => {
  let store = useConfigStore()
  let { config } = storeToRefs(store)
  config.value.webTraBaseUrl = import.meta.env.VITE_END_USER_BASE_URL

  let upstreamUserId = upstreamUserIdRef.value
  let appId = appIdRef.value
  let appSecret = appSecretRef.value
  try {
    overlay.value = true
    let data = await getTokenContext(upstreamUserId, appId, appSecret)
    let { timestamp, signature } = data
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
    snackbar.value = true
    color.value = 'error'
    msg.value = err
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
                <v-col><p class="text-h6">Input your App ID and App Secret</p></v-col>
                <v-text-field v-model="appIdOperatorRef" label="App ID" required></v-text-field>
                <v-text-field
                  v-model="appSecretOperatorRef"
                  label="App Secret"
                  required
                ></v-text-field>
                <p class="text-caption text-error">
                  App ID and App Secret MUST be kept safely and are used to calculate signature
                  being verified by TRA.<br />For Demo purpose, we calculate signature in frontend
                  just for simplicity and intuition
                </p>
              </v-col>
              <v-col cols="12">
                <v-col><p class="text-h6">Register TRA User</p></v-col>
                <v-text-field
                  v-model="upstreamUserIdRegisterRef"
                  label="Upstream User ID"
                  required
                ></v-text-field>
                <v-btn color="primary" @click="onClickRegister">Register</v-btn>
              </v-col>
              <v-col cols="12">
                <v-col><p class="text-h6">Issue TRA</p></v-col>
                <v-text-field
                  v-model="upstreamUserIdIssueRef"
                  label="Upstream User ID"
                  required
                ></v-text-field>
                <v-text-field v-model="traIdRef" label="TRA ID" required></v-text-field>
                <v-text-field v-model="remarkRef" label="Remark" required></v-text-field>
                <v-btn color="primary" @click="onClickIssue">Issue</v-btn>
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

  <v-snackbar v-model="snackbar" :color="color" timeout="3000">
    {{ msg }}
  </v-snackbar>
</template>
