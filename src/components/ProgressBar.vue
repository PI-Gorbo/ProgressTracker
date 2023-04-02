<template>
  <div class="w-full h-12">
    <div class="bg-white w-full h-full rounded-full relative" ref="parentComp">
      <div
        class="absolute text-white mix-blend-difference w-full h-full flex items-center justify-center text-3xl z-50"
      >
        {{ props.percentage }}%
      </div>
      <vue-resizable
        :fitParent="true"
        :active="['r']"
        :width="GetBarWidthFromPercentage(props.percentage)"
        :minWidth="GetBarWidthFromPercentage(0)"
        :height="48"
        @resize:move="
          (payload: ResizePayload) => {
            onResized(payload)
          }
        "
        @resize:end="
        (payload: ResizePayload) => {
          OnResizeEnd(payload)
        }"
        ref="resizableComp"
      >
        <div class="h-full">
          <div
            :class="['hasLinearGradient rounded-full flex items-center justify-center h-full']"
            :style="{ 'background-color': hexColour }"
          ></div>
        </div>
      </vue-resizable>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  computed,
  inject,
  nextTick,
  onMounted,
  onUnmounted,
  ref,
  watch,
  type ComputedRef
} from 'vue'
import VueResizable from 'vue-resizable'
import chroma from 'chroma-js'
import { debounce } from 'lodash'

const emitter = inject('emitter')
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
const resizableComp = ref(null as unknown as VueResizable)

const Config = {
  outputRangeStart: 3,
  outputRangeEnd: 100
}

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
  // Black, Red, Yellow, Green
  const colourFn = chroma
    .scale(['#07080a', '#ea5234', '#fbbd23', '#66cc8a'])
    .domain([0, 25, 75, 100])

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
  const mappedPercentage = mapRange(
    clampedTo0And100,
    0,
    100,
    Config.outputRangeStart,
    Config.outputRangeEnd
  )
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

function ProgressParPercentageToInputPercentage(parentWidth: number, itemWidth: number) {
  // Calculate the percentage
  const widthOfBar = itemWidth
  const widthOfParent = parentWidth
  const percentage = (widthOfBar / widthOfParent) * 100
  let mappedPercentage = mapRange(
    percentage,
    Config.outputRangeStart,
    Config.outputRangeEnd,
    0,
    100
  )
  return mappedPercentage
}

// Lifecycle (https://stackoverflow.com/questions/49380830/vue-js-how-to-get-window-size-whenever-it-changes)
onMounted(() => {
  console.log('mounting')
  window.addEventListener('resize', OnParentResize)
  emitter.on('progressBarResize', () => {
    OnParentResize()
  })
})

onUnmounted(() => {
  console.log('unmounting')
  window.removeEventListener('resize', OnParentResize)
  emitter.off('progressBarResize', () => {
    OnParentResize()
  })
})

// Events
function onResized(payload: ResizePayload) {
  const mappedPercentage = ProgressParPercentageToInputPercentage(
    parentComp.value.clientWidth,
    payload.width
  )
  emit('update:percentage', mappedPercentage)
}

function OnResizeEnd(payload: ResizePayload) {
  const mappedPercentage = ProgressParPercentageToInputPercentage(
    parentComp.value.clientWidth,
    payload.width
  )
  // wrap the number to the nearest 5
  const percentageRoundedToNearest5 = Math.round(mappedPercentage / 5) * 5
  emit('update:percentage', percentageRoundedToNearest5)
}

function OnParentResize() {
  if (!resizableComp.value) {
    return
  }
  // recalculate the width and the min-width of the percentage bars.
  resizableComp.value.w = GetBarWidthFromPercentage(props.percentage)
  resizableComp.value.minW = GetBarWidthFromPercentage(0)
  console.log('triggered')
}
</script>
<style scoped></style>
