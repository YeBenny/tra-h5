import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useConfigStore = defineStore(
  'config',
  () => {
    const config = ref({})
    function setConfig(data) {
      config.value = data
    }
    return { config, setConfig }
  },
  {
    persist: true
  }
)
