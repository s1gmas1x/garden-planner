<template>
    <div class="stage-container">
        <v-stage :config="{
            width: canvasWidth,
            height: canvasHeight,
        }" @wheel="handleZoom" ref="stageRef">
            <v-layer ref="layerRef">
                <!-- Draggable Garden Group -->
                <v-group :draggable="isPanningEnabled" :config="{
                    x: gardenPosition.x,
                    y: gardenPosition.y,
                }">
                    <!-- Render the garden -->
                    <v-rect :config="{
                        x: 0,
                        y: 0,
                        width: props.width * gridSize,
                        height: props.length * gridSize,
                        fill: '#e2fef3',
                        stroke: 'black',
                        strokeWidth: stageScale.value ? 2 / stageScale.value : 2,
                    }" />

                    <!-- Feet Grid -->
                    <v-line v-for="(line, index) in gridLines" :key="index" :config="{
                        ...line,
                        listening: false,
                    }" />

                    <!-- Inch Grid -->
                    <v-line v-if="showInchGrid" v-for="(line, index) in inchGridLines" :key="'inch-' + index" :config="{
                        ...line,
                        listening: false,
                    }" />

                    <!-- Beds -->
                    <v-group v-for="(bed, index) in beds" :key="bed.id" :config="{
                        x: bed.x,
                        y: bed.y,
                        draggable: !isPanningEnabled, // Beds are draggable only when panning is disabled
                    }">
                        <!-- Bed Rectangle -->
                        <v-rect :config="{
                            x: 0,
                            y: 0,
                            width: bed.width,
                            height: bed.height,
                            fill: bed.fill,
                            stroke: 'black',
                            strokeWidth: 1,

                        }" />

                        <!-- Feet Grid -->
                        <v-line v-for="(line, index) in generateBedFeetGridLines(bed)" :key="'feet-' + index" :config="{
                            ...line,
                            stroke: '#999',
                            strokeWidth: 0.125,
                            listening: false, // Ensure the grid doesn't block interactions
                        }" />

                        <!-- Inches Grid -->
                        <v-line v-if="showInchGrid" v-for="(line, index) in generateBedInchGridLines(bed)"
                            :key="'inches-' + index" :config="{
                                ...line,
                                stroke: '#ccc',
                                strokeWidth: 0.025,
                                listening: false, // Ensure the grid doesn't block interactions
                            }" />
                    </v-group>
                </v-group>
            </v-layer>
        </v-stage>

        <!-- Buttons -->
        <button @click="addBed" style="position: absolute; top: 20px; left: 20px; z-index: 10;">
            Add Bed
        </button>

        <button @click="isPanningEnabled = !isPanningEnabled"
            style="position: absolute; top: 60px; left: 20px; z-index: 10;">
            {{ isPanningEnabled ? 'Disable Panning' : 'Enable Panning' }}
        </button>

        <div class="zoom-controls">
            <button @click="zoomOut">-</button>
            <button @click="zoomIn">+</button>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue';
import throttle from 'lodash/throttle';

const props = defineProps({
    width: { type: Number, required: true, default: 10 },
    length: { type: Number, required: true, default: 10 },
    canvasWidth: { type: Number, required: true, default: 800 },
    canvasHeight: { type: Number, required: true, default: 600 },
});

const stageRef = ref(null);
const gridSize = 20;
const stageScale = ref(1);
const gardenPosition = reactive({ x: 0, y: 0 });
const isPanningEnabled = ref(false);

const beds = ref([]);
const addBed = () => {
    const defaultWidth = 4 * gridSize;
    const defaultHeight = 8 * gridSize;
    const x = Math.random() * (props.width * gridSize - defaultWidth);
    const y = Math.random() * (props.length * gridSize - defaultHeight);
    beds.value.push({
        x,
        y,
        width: defaultWidth,
        height: defaultHeight,
        fill: '#1c130f',
        id: 'bed-' + Date.now(),
    });
};

const zoomLevels = [0.5, 0.75, 1, 2, 3, 5, 10, 15, 20];
const handleZoom = throttle((e) => {
    e.evt.preventDefault();
    const stage = stageRef.value.getStage();
    const oldScale = stage.scaleX();
    const pointer = stage.getPointerPosition();
    const scaleBy = e.evt.deltaY > 0 ? -1 : 1;
    const currentIndex = zoomLevels.indexOf(oldScale);
    let newIndex = currentIndex + scaleBy;
    newIndex = Math.max(0, Math.min(newIndex, zoomLevels.length - 1));
    const newScale = zoomLevels[newIndex];
    stageScale.value = newScale;
    const mousePointTo = {
        x: (pointer.x - stage.x()) / oldScale,
        y: (pointer.y - stage.y()) / oldScale,
    };
    const newPos = {
        x: pointer.x - mousePointTo.x * newScale,
        y: pointer.y - mousePointTo.y * newScale,
    };
    stage.scale({ x: newScale, y: newScale });
    stage.position(newPos);
    stage.batchDraw();
}, 50);

const gridLines = computed(() => {
    const lines = [];
    for (let x = 0; x <= props.width * gridSize; x += gridSize) {
        lines.push({ points: [x, 0, x, props.length * gridSize], stroke: '#999', strokeWidth: 0.125 });
    }
    for (let y = 0; y <= props.length * gridSize; y += gridSize) {
        lines.push({ points: [0, y, props.width * gridSize, y], stroke: '#999', strokeWidth: 0.125 });
    }
    return lines;
});

const inchGridLines = computed(() => {
    const lines = [];
    const inchSpacing = gridSize / 12;
    for (let x = 0; x <= props.width * gridSize; x += inchSpacing) {
        lines.push({ points: [x, 0, x, props.length * gridSize], stroke: '#aaa', strokeWidth: 0.025 });
    }
    for (let y = 0; y <= props.length * gridSize; y += inchSpacing) {
        lines.push({ points: [0, y, props.width * gridSize, y], stroke: '#aaa', strokeWidth: 0.025 });
    }
    return lines;
});

const showInchGrid = computed(() => stageScale.value > 3);

const generateBedFeetGridLines = (bed) => {
    const lines = [];
    for (let x = 0; x <= bed.width; x += gridSize) {
        lines.push({ points: [x, 0, x, bed.height] });
    }
    for (let y = 0; y <= bed.height; y += gridSize) {
        lines.push({ points: [0, y, bed.width, y] });
    }
    return lines;
};

const generateBedInchGridLines = (bed) => {
    const lines = [];
    const inchSpacing = gridSize / 12;
    for (let x = 0; x <= bed.width; x += inchSpacing) {
        lines.push({ points: [x, 0, x, bed.height] });
    }
    for (let y = 0; y <= bed.height; y += inchSpacing) {
        lines.push({ points: [0, y, bed.width, y] });
    }
    return lines;
};
</script>

<style scoped>
.stage-container {
    width: 100%;
    height: 100%;
    overflow: hidden;
}

.zoom-controls {
    position: absolute;
    top: 20px;
    right: 20px;
    z-index: 10;
}
</style>
