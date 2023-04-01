<template>
  <div class="w-full h-full">
    <div class="bg-white w-full h-full rounded-full" ref="parentComp">
      <vue-resizable
        :fitParent="true"
        :active="['r']"
        :width="GetBarWidthFromPercentage(props.percentage)"
        :minWidth="GetBarWidthFromPercentage(0)"
        @resize:move="
          (payload: ResizePayload) => {
            onResized(payload)
          }
        "
      >
        <!--:class="[`w-[${props.percentage}%]`]"-->
        <div
          :class="['hasLinearGradient rounded-full flex items-center justify-center h-full']"
          :style="{ 'background-color': hexColour }"
        >
          <span class="text-white"> {{ props.percentage }}% </span>
        </div>
      </vue-resizable>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, ref, type ComputedRef } from 'vue'
import VueResizable from 'vue-resizable'

const emit = defineEmits<{
  (e: 'update:percentage', percentage: number): void
}>()

// Custom types
interface ResizePayload {
  eventName: string
  left: number
  top: number
  width: number
  height: number
}

const parentComp = ref(null as unknown as HTMLDivElement)

const props = withDefaults(
  defineProps<{
    percentage: number
    rounded: boolean
  }>(),
  {
    rounded: true
  }
)
const colours = [
  '#29303e',
  '#2a333f',
  '#2a3740',
  '#2b3a41',
  '#2b3e42',
  '#2c4143',
  '#2c4544',
  '#2d4846',
  '#2d4c47',
  '#2e4f48',
  '#2e5349',
  '#2f564a',
  '#2f5a4b',
  '#305d4c',
  '#30614d',
  '#31644e',
  '#31684f',
  '#326b50',
  '#326f51',
  '#337252',
  '#337654',
  '#347955',
  '#347d56',
  '#358057',
  '#358458',
  '#368759',
  '#368b5a',
  '#378e5b',
  '#37925c',
  '#38955d',
  '#38995e',
  '#399c5f',
  '#39a060',
  '#3aa362',
  '#3aa763',
  '#3baa64',
  '#3bae65',
  '#3cb166',
  '#3cb567',
  '#3db868'
]

const hexColour: ComputedRef<string> = computed(() => {
  // Map the current percentage to an interger between 0 - 40
  const mappedValue = Math.round(mapRange(props.percentage, 0, 100, 0, colours.length - 1))
  return colours[mappedValue]
})

// Helpers
//https://webtips.dev/webtips/javascript/how-to-clamp-numbers-in-javascript
function clamp(num: number, min: number, max: number) {
  return Math.min(Math.max(num, min), max)
}
//https://stackoverflow.com/questions/5731863/mapping-a-numeric-range-onto-another
function mapRange(
  inputNumber: number,
  inputRangeStart: number,
  inputRangeEnd: number,
  outputRangeStart: number,
  outputRangeEnd: number
) {
  const slope = (outputRangeEnd - outputRangeStart) / (inputRangeEnd - inputRangeStart)
  return outputRangeStart + Math.round(slope * (inputNumber - inputRangeStart))
}

function mapInputPercentageRelativeToProgressBar(inputPercentage: number) {
  // The progress bar 'looks best' when it starts about 20% through its parent, and goes to 100%.
  // This means, we need to make the input percentage (a number between 0 and 100)
  // to a percentage from 20-100%.
  // The best way to do this is to map the percentage to a number between 0 and 80 and then add 20

  const clampedTo0And100 = clamp(inputPercentage, 0, 100)
  const mappedPercentage = mapRange(clampedTo0And100, 0, 100, 20, 100)
  return mappedPercentage
}

function GetBarWidthFromPercentage(percentage: number) {
  function _getBarWidthFromPercentage(percentage: number) {
    const percentageRelativeToProgressBar = mapInputPercentageRelativeToProgressBar(percentage)
    const barWidth = Math.round(
      parentComp.value.clientWidth * (percentageRelativeToProgressBar / 100)
    )

    return barWidth
  }

  if (parentComp.value == null) {
    nextTick(() => {
      return _getBarWidthFromPercentage(percentage)
    })
  } else {
    return _getBarWidthFromPercentage(percentage)
  }
}

// Events
function onResized(payload: ResizePayload) {
  // Calculate the percentage
  const widthOfBar = payload.width
  const widthOfParent = parentComp.value.clientWidth
  const percentage = (widthOfBar / widthOfParent) * 100
  let mappedPercentage = mapRange(percentage, 20, 100, 0, 100)
  emit('update:percentage', mappedPercentage)
}
</script>
<style scoped></style>
