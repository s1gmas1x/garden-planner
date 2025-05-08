<template>
  <div class="setup">
    <h1>Plan Your Garden 🌱</h1>
    <form @submit.prevent="submitForm">
      <label>Width:</label>
      <input type="number" v-model.number="width" required /> ft
      <br/>
      <label>Length:</label>
      <input type="number" v-model.number="length" required /> ft
      <br/>
      <button type="submit">Start Planning</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const emit = defineEmits(['start'])

const width = ref('')
const length = ref('')

function submitForm() {
  emit('start', {
    width: width.value,
    length: length.value,
  })
}
</script>

<style scoped>
.setup {
  text-align: center;
  margin-top: 50px;
}
</style>