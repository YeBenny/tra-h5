<script setup>
import { ref } from 'vue'
import Loading from '../components/Loading.vue'
import { registerUpstreamUser, issueTra, getTokenContext } from '../axios'

const title = ref('Demo')
const overlay = ref(false)
const snackbar = ref(false)
const color = ref()
const msg = ref()
const tab = ref(null)

const appIdOperatorRef = ref('Jw3bzwipoywMSKykNilAHlmquWz6oMU7X46pFW8')
const appSecretOperatorRef = ref('niZcSMrShWvvIchL3xzWOQ2DRJKsj2ii4RMFmmOs')

const upstreamUserIdRegisterRef = ref('FL0000000001')
const upstreamUserIdIssueRef = ref('FL0000000001')
const traIdRef = ref('4bd7fe2d-4182-4749-8fbc-b3df76f50c0c')
const remarkRef = ref('remark')

const upstreamUserIdRef = ref('FL0000000001')
const appIdRef = ref('Jw3bzwipoywMSKykNilAHlmquWz6oMU7X46pFW8')
const appSecretRef = ref('niZcSMrShWvvIchL3xzWOQ2DRJKsj2ii4RMFmmOs')

const onClickRegister = async () => {
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
  let upstreamUserId = upstreamUserIdIssueRef.value
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
  let endUserDomain = import.meta.env.VITE_END_USER_DOMAIN
  let webTraBaseUrl = import.meta.env.VITE_END_USER_BASE_URL
  let upstreamUserId = upstreamUserIdRef.value
  let appId = appIdRef.value
  let appSecret = appSecretRef.value
  try {
    overlay.value = true
    let data = await getTokenContext(upstreamUserId, appId, appSecret)
    let { timestamp, signature } = data
    window.location.href = `${endUserDomain}/#/?webTraBaseUrl=${encodeURIComponent(
      webTraBaseUrl
    )}&upstreamUserId=${encodeURIComponent(upstreamUserId)}&appId=${encodeURIComponent(
      appId
    )}&timestamp=${encodeURIComponent(timestamp)}&signature=${encodeURIComponent(signature)}`
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
