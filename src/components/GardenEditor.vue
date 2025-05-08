<template>
  <div class="editor">
    <!-- Toolbar -->
    <div class="toolbar">
      <button @click="addBed">Add Raised Bed</button>
      <button @click="addPath">Add Path</button>
      <button @click="addPlant">Add Plant</button>
      <button @click="addGreenhouse">Add Greenhouse</button>
    </div>

    <!-- Viewport -->
    <div class="viewport">
      <GardenCanvas :width="width" :length="length" :canvasWidth="canvasWidth" :canvasHeight="canvasHeight" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import GardenCanvas from './GardenCanvas.vue';

const props = defineProps({
  width: Number, // Garden width in feet
  length: Number // Garden length in feet
});

const canvasWidth = ref(window.innerWidth); // Full screen width
const canvasHeight = ref(0); // Dynamically calculated height

// Update canvas size dynamically
const updateCanvasSize = () => {
  const headerHeight = document.querySelector('.editor h2')?.offsetHeight || 0;
  const availableHeight = window.innerHeight - headerHeight - 20; // Leave some padding
  canvasWidth.value = window.innerWidth;
  canvasHeight.value = availableHeight;
};

onMounted(() => {
  updateCanvasSize();
  window.addEventListener('resize', updateCanvasSize);
});

onUnmounted(() => {
  window.removeEventListener('resize', updateCanvasSize);
});

const addBed = () => {
  console.log('Add Raised Bed');
};

const addPath = () => {
  console.log('Add Path');
};

const addPlant = () => {
  console.log('Add Plant');
};

const addGreenhouse = () => {
  console.log('Add Greenhouse');
};
</script>

<style scoped>
.editor {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.toolbar {
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: 50px;
  background-color: #f4f4f4;
  border-bottom: 1px solid #ccc;
}

.viewport {
  flex: 1;
  overflow: hidden;
  position: relative;
  background-color: #eefee0;
}

h2 {
  margin-bottom: 10px;
}

.canvas-container {
  width: 100%;
  /* Full width */
  overflow: hidden;
  /* Prevent overflow */
}
</style>
