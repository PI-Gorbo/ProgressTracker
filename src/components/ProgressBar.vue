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
import chroma from 'chroma-js'

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

const hexColour: ComputedRef<string> = computed(() => {
  // Generate colours
  const colourFn = chroma.scale(['#07080a', '#ea5234', '#fbbd23', '#66cc8a']).domain([0, 100])

  return colourFn(props.percentage)
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
