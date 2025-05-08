import { createApp } from 'vue'
import App from './App.vue'
import './style.css'
import VueKonva from 'vue-konva'

const app = createApp(App)

app.use(VueKonva) // Register vue-konva globally

app.mount('#app')
