import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'

import './assets/main.css'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faBars, faXmark } from '@fortawesome/free-solid-svg-icons'
import mitt, { type Emitter, type EventType } from 'mitt'
import type { WatchEventType } from 'fs'

const app = createApp(App)
app.use(createPinia())
library.add(faBars)
library.add(faXmark)

const emitter = mitt()
app.provide<Emitter<Record<EventType, unknown>>>('emitter', emitter)
app.mount('#app')
