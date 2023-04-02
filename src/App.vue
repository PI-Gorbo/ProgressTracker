<template>
  <div class="w-[100vw] h-[100vh]">
    <header>
      <div class="navbar bg-primary">
        <div class="navbar-start">
          <div class="avatar">
            <img src="/mountain-32.png" />
          </div>
          <div class="prose pl-2"><h2>Kosciuszko</h2></div>
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
import mitt from 'mitt'

// Store
const cardStore = useCardStore()

// global store
const emitter = inject('emitter')

// Events
function OnAddNewGroup() {
  cardStore.addNewGroup()
}
</script>
<style scoped></style>
