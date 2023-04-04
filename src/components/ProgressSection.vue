<template>
    <div v-if="cardGroups.length > 0" class="flex flex-row flex-wrap justify-center p-2">
        <div
            v-for="(group, index) in cardGroups"
            :key="index"
            class="flex-1 min-w-[50%] max-w-[75%] h-fit"
        >
            <ProgressGroup :groupIndex="index" class="bg-grey-400" />
        </div>
    </div>
</template>
<script setup lang="ts">
import { useCardStore, type ICard, type IGroup } from '@/stores/cardStore'
import { computed, inject, nextTick, onMounted, watch, type ComputedRef, type Ref } from 'vue'
import ProgressGroup from './ProgressGroup.vue'
const cardStore = useCardStore()
const emitter = inject('emitter')

// Initalize the card Store
onMounted(() => {
    cardStore.init()
})

const cardGroups: Ref<IGroup[]> = computed(() => {
    return cardStore.groups
})
</script>
