<script lang="ts" setup>
import type { HTMLAttributes } from 'vue'
import { ref, onMounted, nextTick } from 'vue'
import { Motion, useScroll, useTransform } from 'motion-v'

interface Props {
  containerClass?: HTMLAttributes['class']
  class?: HTMLAttributes['class']
  items?: {
    id: string
    label: string
  }[]
  title?: string
  description?: string
}

const props = withDefaults(defineProps<Props>(), {
  items: () => [],
})

const timelineContainerRef = ref<HTMLElement | null>(null)
const timelineRef = ref<HTMLElement | null>(null)
const height = ref(0)

onMounted(async () => {
  await nextTick()
  if (timelineRef.value) {
    const rect = timelineRef.value.getBoundingClientRect()
    height.value = rect.height
  }
})

const { scrollYProgress } = useScroll({
  target: timelineRef,
  offset: ['start 10%', 'end 50%'],
})

const opacityTransform = useTransform(scrollYProgress, [0, 0.1], [0, 1])
// Use function mapper so height.value is reactive
const heightTransform = useTransform(scrollYProgress, (progress) => progress * height.value)
</script>

<template>
  <div ref="timelineContainerRef" class="relative w-full font-sans md:px-10">
    <div ref="timelineRef" class="relative z-0 mx-auto max-w-7xl pb-20">
      <div
        v-for="(item, index) in props.items"
        :key="item.id + index"
        class="flex justify-start pt-10 md:gap-10 md:pt-40"
      >
        <div
          class="flex max-w-xs flex-col items-center self-start md:sticky md:top-40 z-40 md:w-full md:flex-row lg:max-w-sm"
        >
          <div
            class="absolute left-3 flex size-10 items-center justify-center rounded-full bg-black border border-white/10 md:left-3"
          >
            <div class="size-4 rounded-full border border-neutral-700 bg-neutral-800 p-2" />
          </div>
          <h3
            class="hidden text-xl font-bold text-neutral-500 md:block md:pl-20 md:text-5xl dark:text-neutral-500"
          >
            {{ item.label }}
          </h3>
        </div>
        <slot :name="item.id" />
      </div>
      <div
        :style="{
          height: `${height}px`,
        }"
        class="absolute top-0 left-8 w-[2px] overflow-hidden bg-[linear-gradient(to_bottom,var(--tw-gradient-stops))] from-transparent from-0% via-neutral-200 to-transparent to-[99%] [mask-image:linear-gradient(to_bottom,transparent_0%,black_10%,black_90%,transparent_100%)] md:left-8 dark:via-neutral-700"
      >
        <Motion
          as="div"
          :style="{
            height: heightTransform,
            opacity: opacityTransform,
          }"
          class="absolute inset-x-0 top-0 w-[2px] rounded-full bg-linear-to-t from-primary from-0% via-primary via-10% to-transparent"
        />
      </div>
    </div>
  </div>
</template>
