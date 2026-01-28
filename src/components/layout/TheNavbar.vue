<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import { Motion, AnimatePresence } from 'motion-v'
import { Menu, X } from 'lucide-vue-next'
import { MENU_ITEMS, SOCIAL_ITEMS } from '@/constants/navigation'
import SubmarkLogo from '@/assets/submark-logo.png'

const isOpen = ref(false)

const toggleMenu = () => {
  isOpen.value = !isOpen.value
}

// Animation variants
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const menuVariants: any = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.3, ease: 'easeOut' },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: { duration: 0.2, ease: 'easeIn' },
  },
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const itemVariants: any = {
  hidden: { y: 20, opacity: 0 },
  visible: (i: number) => ({
    y: 0,
    opacity: 1,
    transition: {
      delay: i * 0.1 + 0.2,
      duration: 0.4,
      ease: 'easeOut',
    },
  }),
}
</script>

<template>
  <nav class="fixed top-0 left-0 w-full z-50 pointer-events-none">
    <div class="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
      <!-- Logo -->
      <RouterLink
        to="/"
        class="pointer-events-auto flex items-center gap-3 transition-opacity hover:opacity-80"
      >
        <img :src="SubmarkLogo" alt="Sarando" class="w-10 h-10 object-contain" />
        <span class="hidden md:block text-xl font-bold tracking-tight text-foreground"
          >SARANDO</span
        >
      </RouterLink>

      <!-- Hamburger Button (Visible only when menu is CLOSED) -->
      <button
        v-if="!isOpen"
        @click="toggleMenu"
        class="pointer-events-auto relative w-12 h-12 rounded-full flex items-center justify-center bg-secondary/10 hover:bg-secondary/20 text-secondary backdrop-blur-md border border-secondary/20 transition-all duration-300 group"
        aria-label="Open Menu"
      >
        <Menu class="w-6 h-6 group-hover:scale-110 transition-transform" />
      </button>
    </div>

    <!-- Full Screen Menu Overlay -->
    <AnimatePresence>
      <div
        v-if="isOpen"
        class="fixed inset-0 w-full h-dvh bg-background/95 backdrop-blur-xl z-50 pointer-events-auto flex flex-col"
      >
        <!-- Inside Header: Logo + Close Button -->
        <div class="max-w-7xl mx-auto px-6 py-6 w-full flex justify-between items-center">
          <RouterLink to="/" @click="toggleMenu" class="flex items-center gap-3">
            <img :src="SubmarkLogo" alt="Sarando" class="w-10 h-10 object-contain" />
            <span class="hidden md:block text-xl font-bold tracking-tight text-foreground"
              >SARANDO</span
            >
          </RouterLink>

          <!-- Close Button (Same position as Hamburger) -->
          <button
            @click="toggleMenu"
            class="relative w-12 h-12 rounded-full flex items-center justify-center bg-secondary/10 hover:bg-secondary/20 text-secondary border border-secondary/20 transition-all duration-300 group"
            aria-label="Close Menu"
          >
            <X class="w-6 h-6 group-hover:scale-110 transition-transform" />
          </button>
        </div>

        <!-- Menu Content -->
        <div class="flex-1 flex flex-col items-center justify-center">
          <Motion
            class="flex flex-col items-center space-y-8"
            initial="hidden"
            animate="visible"
            exit="exit"
            :variants="menuVariants"
          >
            <Motion
              v-for="(item, i) in MENU_ITEMS"
              :key="item.link"
              :custom="i"
              :variants="itemVariants"
            >
              <RouterLink
                :to="item.link"
                class="text-4xl md:text-6xl font-bold transition-colors tracking-tight relative group"
                :class="[
                  $route.path === item.link ? 'text-primary' : 'text-foreground hover:text-primary',
                ]"
                @click="toggleMenu"
              >
                {{ item.label }}
                <!-- Underline effect -->
                <span
                  class="absolute -bottom-2 left-0 h-1 bg-secondary transition-all duration-300 group-hover:w-full"
                  :class="[$route.path === item.link ? 'w-full' : 'w-0']"
                ></span>
              </RouterLink>
            </Motion>
          </Motion>

          <!-- Socials -->
          <Motion
            class="mt-16 flex gap-8"
            :initial="{ opacity: 0, y: 20 }"
            :animate="{ opacity: 1, y: 0 }"
            :transition="{ delay: 0.6 }"
          >
            <a
              v-for="social in SOCIAL_ITEMS"
              :key="social.link"
              :href="social.link"
              target="_blank"
              class="text-muted-foreground hover:text-white transition-colors text-sm uppercase tracking-widest"
            >
              {{ social.label }}
            </a>
          </Motion>
        </div>
      </div>
    </AnimatePresence>
  </nav>
</template>
