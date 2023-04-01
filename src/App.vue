<template>
  <header>
    <div class="navbar bg-primary">
      <div class="navbar-start">
        <div class="avatar">
          <img src="/mountain-32.png" />
        </div>
        <div class="prose pl-2"><h2>Kosciuszko</h2></div>
      </div>
      <div class="navbar-end">
        <div class="btn mx-1" @click="OnAddCard">Add!</div>
        <div class="btn btn-warning mx-1" @click="OnClearAllCards">Clear</div>
      </div>
    </div>
  </header>
  <section class="flex flex-col items-center justify-center gap-2 py-2">
    <div v-for="(card, index) in cardStore.cards" :key="index" class="flex flex-row gap-2">
      <ProgressCard :card-index="index" class="p-2" />
      <div class="p-2 flex items-center">
        <div class="btn btn-error" @click="() => OnRemoveCardAtIndex(index)">X</div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
// Imports
import { onMounted, reactive } from 'vue'
import ProgressCard from './components/ProgressCard.vue'
import { useCardStore } from './stores/cardStore'

// Store
const cardStore = useCardStore()

onMounted(() => {
  cardStore.init()
})

// Events
function OnAddCard() {
  cardStore.addCard({
    title: null,
    progress: 0
  })
}

function OnClearAllCards() {
  cardStore.clearAllCards()
}

function OnRemoveCardAtIndex(index: number) {
  cardStore.removeCard(index)
}
</script>
<style scoped></style>
