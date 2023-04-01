<template>
  <div class="card bg-slate-200" v-if="card">
    <div class="card-body p-2 flex flex-row gap-2">
      <div class="flex-auto form-control m-2 min-w-[40vw]">
        <input class="input input-ghost input-md text-xl" :value="card.title" @change="OnInput" />
      </div>
      <div class="flex-auto min-w-[40vw]">
        <ProgressBar
          colour="black"
          :rounded="true"
          :percentage="card.progress"
          @update:percentage="
            (val) => {
              cardStore.cards[props.cardIndex].progress = val
            }
          "
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Imports

import { useCardStore } from '@/stores/cardStore'
import { computed } from 'vue'
import ProgressBar from './ProgressBar.vue'

// Store
const cardStore = useCardStore()

// Props
const props = withDefaults(
  defineProps<{
    cardIndex: number
  }>(),
  {}
)

const card = computed(() => {
  return cardStore.cards[props.cardIndex]
})

// Events
function OnInput(event: Event) {
  cardStore.modifyCard(props.cardIndex, { title: (event.target as HTMLInputElement).value })
}
</script>
