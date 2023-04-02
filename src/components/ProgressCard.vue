<template>
  <div class="card bg-slate-200" v-if="card">
    <div class="card-body p-2">
      <div class="form-control m-2 flex flex-row gap-2">
        <input class="input input-bordered text-xl flex-1" :value="card.title" @change="OnInput" />
        <div class="flex-none flex justify-end">
          <button class="btn btn-error flex-none" @click="emit('DeleteCard')">X</button>
        </div>
        <div class="flex items-center">
          <div class="handle cursor-grab">
            <FontAwesomeIcon icon="fa-solid fa-grip-lines" />
          </div>
        </div>
      </div>
      <div class="flex items-center">
        <ProgressBar
          colour="black"
          :rounded="true"
          :percentage="card.progress"
          @update:percentage="
            (val) => {
              cardStore.modifyCard(props.groupIndex, props.cardIndex, { progress: val })
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
import { computed, ref, watch, type Ref } from 'vue'
import ProgressBar from './ProgressBar.vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

// Store
const cardStore = useCardStore()

// emits
const emit = defineEmits<{
  (e: 'DeleteCard'): void
}>()

// Props
const props = withDefaults(
  defineProps<{
    groupIndex: number
    cardIndex: number
  }>(),
  {}
)

const card = computed(() => {
  return cardStore.groups[props.groupIndex].cards[props.cardIndex]
})

// Events
function OnInput(event: Event) {
  cardStore.modifyCard(props.groupIndex, props.cardIndex, {
    title: (event.target as HTMLInputElement).value
  })
}
</script>
