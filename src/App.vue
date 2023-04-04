<template>
    <div class="w-[100vw] h-[100vh]">
        <header>
            <div class="navbar bg-primary">
                <div class="navbar-start">
                    <div class="avatar">
                        <img src="/mountain-32.png" />
                    </div>
                    <div class="prose pl-2"><h2 class="text-white">Kosciuszko</h2></div>
                </div>
                <div class="navbar-center">
                    <div class="form-control">
                        <input
                            class="input input-ghost bg-primary-focus sm:text-xl md:text-2xl lg:text-4xl text-center w-fit text-white"
                            @input="debouncedOnSetTitle"
                            :value="cardStore.title"
                        />
                    </div>
                </div>
                <div class="navbar-end">
                    <button class="btn" @click="OnAddNewGroup">Add New Group</button>
                </div>
            </div>
        </header>
        <ProgressSection class="w-full h-full" />
    </div>
</template>

<script setup lang="ts">
// Imports
import { computed, inject, onMounted, reactive, watch, type ComputedRef } from 'vue'
import ProgressCard from './components/ProgressCard.vue'
import ProgressSection from './components/ProgressSection.vue'
import { useCardStore, type ICard } from './stores/cardStore'
import draggable from 'vuedraggable'
import mitt, { type Emitter, type EventType } from 'mitt'
import _ from 'lodash'

// Store
const cardStore = useCardStore()
const emitter = inject<Emitter<Record<EventType, unknown>>>('emitter') // global event bus

// Events
function OnAddNewGroup() {
    cardStore.addNewGroup()
    emitter?.emit('progressBarResize')
}

const debouncedOnSetTitle = _.debounce(OnSetTitle, 200)
function OnSetTitle(event: Event) {
    cardStore.title = (event.target as HTMLInputElement).value
    cardStore.save()
}
</script>
<style scoped></style>
