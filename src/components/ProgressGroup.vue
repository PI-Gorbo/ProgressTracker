<template>
  <div class="p-2">
    <div class="flex flex-row gap-2">
      <div class="flex-none">
        <button class="btn btn-primary" @click="OnAddCard">Add Card</button>
      </div>
      <div class="form-control flex-1">
        <input
          type="text "
          placeholder="Enter group name..."
          :value="group.groupTitle"
          class="input input-md text-2xl text-center"
          @change="OnSetGroupName"
        />
      </div>
      <div class="flex-none flex justify-end">
        <button class="btn btn-error" @click="OnRemoveGroup">Delete Group</button>
      </div>
    </div>
    <draggableComponent v-model="group.cards" group="people" item-key="id" handle=".handle">
      <template #item="{ element, index }">
        <div class="py-1">
          <div class="flex items-center gap-2">
            <ProgressCard
              :group-index="props.groupIndex"
              :card-index="index"
              class="flex-auto"
              @delete-card="() => OnRemoveCardAtIndex(index)"
            />
          </div>
        </div>
      </template>
    </draggableComponent>
  </div>
</template>
<script setup lang="ts">
import { useCardStore, type ICard, type IGroup } from '@/stores/cardStore'
import { computed, type ComputedRef } from 'vue'
import ProgressCard from './ProgressCard.vue'
import draggableComponent from 'vuedraggable'

// Store
const cardStore = useCardStore()

// Props
const props = withDefaults(
  defineProps<{
    groupIndex: number
  }>(),
  {}
)

const group: ComputedRef<IGroup> = computed(() => {
  return cardStore.groups[props.groupIndex]
})

// Events
function OnRemoveCardAtIndex(index: number) {
  cardStore.removeCard(props.groupIndex, index)
}

function OnAddCard() {
  cardStore.addCard(props.groupIndex)
}

function OnRemoveGroup() {
  cardStore.removeGroup(props.groupIndex)
}

function OnSetGroupName(event: Event) {
  cardStore.groups[props.groupIndex].groupTitle = (event.target as HTMLInputElement).value
  cardStore.save()
}
</script>
