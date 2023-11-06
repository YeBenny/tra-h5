<script setup>
import { onMounted, ref, toRefs } from 'vue'
import LazyImage from './LazyImage.vue'
import { getTraDetail } from '../axios'

const props = defineProps({
  redemption: {
    type: Object
  }
})

const { redemption } = toRefs(props)
const traInfos = ref([])

const emits = defineEmits(['onClickRedeem'])
function onClickRedeem(redemption) {
  emits('onClickRedeem', redemption)
}

const show = ref(false)

onMounted(async () => {
  const getData = async () => {
    for (let redemptionTraInfo of redemption.value.redemptionTraInfos) {
      try {
        let result = await getTraDetail(redemptionTraInfo.traId)
        traInfos.value.push({ ...redemptionTraInfo, ...result })
      } catch (error) {
        console.log(error)
      }
    }
  }

  await getData()
})
</script>

<template>
  <v-card>
    <LazyImage
      bg-color="bg-white"
      :src="redemption.redemptionRule.image"
      :max-height="120"
      contain
    />
    <v-card-title>{{ redemption.redemptionRule.title }}</v-card-title>
    <v-card-subtitle>{{ redemption.redemptionRule.description }}</v-card-subtitle>

    <v-card-actions>
      <v-btn color="orange-lighten-2" variant="text" @click="onClickRedeem(redemption)"
        >Redeem</v-btn
      >
      <v-spacer></v-spacer>
      <v-btn :icon="show ? 'mdi-chevron-up' : 'mdi-chevron-down'" @click="show = !show"></v-btn>
    </v-card-actions>

    <v-expand-transition>
      <div v-show="show">
        <v-divider></v-divider>
        <v-table>
          <thead>
            <tr>
              <th class="text-center">TRA Cover</th>
              <th class="text-center">TRA Name</th>
              <th class="text-center">Quantity</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="traInfo in traInfos" :key="traInfo.id">
              <td class="text-center">
                <LazyImage bg-color="bg-white" :src="traInfo.image" :max-height="48" contain />
              </td>
              <td class="text-center">{{ traInfo.title }}</td>
              <td class="text-center">{{ traInfo.quantity }}</td>
            </tr>
          </tbody>
        </v-table>
      </div>
    </v-expand-transition>
  </v-card>
</template>
