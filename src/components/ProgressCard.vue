<template>
  <div class="card bg-base-300" v-if="card">
    <div class="card-body p-2 flex-row">
      <div class="flex flex-col items-center p-0">
        <div class="handle cursor-grab">
          <font-awesome-icon icon="fa-solid fa-bars" />
        </div>
        <div class="flex-none flex justify-end">
          <button
            class="btn border-base-200 bg-base-200 hover:btn-error flex-none btn-sm"
            @click="emit('DeleteCard')"
          >
            X
          </button>
        </div>
      </div>
      <div class="form-control flex flex-row gap-2 flex-1 items-center">
        <input class="input input-bordered text-2xl w-full" :value="card.title" @change="OnInput" />
      </div>
      <div class="flex items-center flex-1 w-full">
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
