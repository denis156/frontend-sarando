<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { Motion } from 'motion-v'
import { getTechnologies } from '@/api/technologies'
import type { Technology } from '@/types/technology'

const technologies = ref<Technology[]>([])
const loading = ref(true)

onMounted(async () => {
  try {
    technologies.value = await getTechnologies()
  } catch (error) {
    console.error('Failed to fetch technologies:', error)
  } finally {
    loading.value = false
  }
})

// Duplicate list for seamless loop (triple the list to ensure smooth infinite scroll)
const marqueeList = computed(() => {
  if (technologies.value.length === 0) return []
  return [...technologies.value, ...technologies.value, ...technologies.value]
})
</script>

<template>
  <div
    class="relative w-full overflow-hidden bg-background py-8 border-y border-white/5"
    v-if="!loading && technologies.length > 0"
  >
    <!-- Gradient Masks for Fade Effect -->
    <div
      class="absolute inset-y-0 left-0 w-20 md:w-40 z-10 bg-gradient-to-r from-background to-transparent pointer-events-none"
    ></div>
    <div
      class="absolute inset-y-0 right-0 w-20 md:w-40 z-10 bg-gradient-to-l from-background to-transparent pointer-events-none"
    ></div>

    <div class="flex">
      <Motion
        class="flex gap-12 md:gap-20 items-center whitespace-nowrap"
        :animate="{ x: ['0%', '-33.33%'] }"
        :transition="{
          duration: 30,
          ease: 'linear',
          repeat: Infinity,
          repeatType: 'loop',
        }"
      >
        <div
          v-for="(tech, i) in marqueeList"
          :key="i"
          class="text-xl md:text-3xl font-bold uppercase tracking-widest text-white/20 hover:text-white/40 transition-colors cursor-default select-none flex items-center gap-4"
        >
          <!-- Optional: If you want to render icons, add them here. For now keeping text-only as per minimalist design -->
          {{ tech.name }}
        </div>
      </Motion>
    </div>
  </div>
</template>
