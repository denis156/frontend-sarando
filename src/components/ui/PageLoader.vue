<script setup lang="ts">
import { Motion, AnimatePresence } from 'motion-v'
import { usePageLoader } from '@/composables/usePageLoader'
import TextType from '@/components/ui/TextType/TextType.vue'
import SubmarkLogo from '@/assets/submark-logo.png'

const { isLoading } = usePageLoader()

// We use a local state to control the exit animation sequence
// When global isLoading becomes false, we trigger the exit animation locally.
</script>

<template>
  <AnimatePresence>
    <Motion
      v-if="isLoading"
      class="fixed inset-0 z-100 flex flex-col items-center justify-center bg-background pointer-events-none overflow-hidden"
      :initial="{ y: '0%' }"
      :exit="{
        y: '-100%',
        transition: {
          duration: 0.8,
          ease: [0.76, 0, 0.24, 1], // Custom bezier for smooth 'curtain' effect
        },
      }"
    >
      <!-- Ambient Background Glow -->
      <div class="absolute inset-0 bg-background z-0"></div>
      <div
        class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 bg-secondary/5 rounded-full blur-[100px] z-0 pointer-events-none animate-pulse"
      ></div>

      <div class="relative z-10 flex flex-col items-center gap-10">
        <!-- Logo Container with breathing effect -->
        <Motion
          :initial="{ opacity: 0, scale: 0.8, filter: 'blur(10px)' }"
          :animate="{ opacity: 1, scale: 1, filter: 'blur(0px)' }"
          :transition="{ duration: 0.8, ease: 'easeOut' }"
          class="relative"
        >
          <div class="absolute inset-0 bg-primary/20 rounded-full blur-2xl opacity-50"></div>
          <img
            :src="SubmarkLogo"
            alt="Sarando"
            class="w-20 h-20 md:w-24 md:h-24 object-contain relative z-10 drop-shadow-[0_0_15px_rgba(49,105,78,0.3)]"
          />
        </Motion>

        <!-- Loading Content -->
        <div class="flex flex-col items-center gap-4">
          <!-- Text Type with Cinematic Styling -->
          <div
            class="text-secondary text-xs md:text-sm font-bold tracking-[0.3em] uppercase opacity-80"
          >
            <TextType
              text="Memuat Halaman..."
              :typing-speed="40"
              cursor-character=""
              :start-on-visible="true"
            />
          </div>

          <!-- Sleek Progress Line -->
          <Motion
            class="h-0.5 bg-secondary/30 rounded-full overflow-hidden w-48 md:w-64"
            :initial="{ opacity: 0 }"
            :animate="{ opacity: 1 }"
            :transition="{ delay: 0.2 }"
          >
            <Motion
              class="h-full bg-secondary"
              :initial="{ width: '0%' }"
              :animate="{ width: '100%' }"
              :transition="{ duration: 1.5, ease: 'easeInOut', repeat: Infinity }"
            />
          </Motion>
        </div>
      </div>
    </Motion>
  </AnimatePresence>
</template>
