<template>
  <div>
    <GardenSetup v-if="!dimensionsSet" @start="setDimensions" />
    <GardenEditor v-else :width="width" :length="length" />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import GardenSetup from './components/GardenSetup.vue'
import GardenEditor from './components/GardenEditor.vue'

const width = ref(null)
const length = ref(null)

const dimensionsSet = computed(() => width.value && length.value)

function setDimensions({ width: w, length: l }) {
  width.value = w
  length.value = l
}
</script>
