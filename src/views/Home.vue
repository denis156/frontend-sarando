<script setup lang="ts">
import { computed, h } from 'vue'
import { Motion } from 'motion-v'
import { ChevronLeft, ChevronRight, ChevronUp, ChevronDown, Flag } from 'lucide-vue-next'
import { RouterLink } from 'vue-router'
import DockNav from '@/components/navigation/DockNav.vue'
import type { DockItemData } from '@/components/navigation/DockNav.vue'
import { Button } from '@/components/ui/button'
import Silk from '@/components/ui/background/Silk.vue'
import SubmarkLogo from '@/assets/submark-logo.png'
import { useBreakpoint } from '@/composables/useBreakpoint'
import { useImagePreload } from '@/composables/useImagePreload'
import { useSceneNavigation } from '@/composables/useSceneNavigation'
import type { Scene } from '@/types/scene'

// Composables
const { isMobile } = useBreakpoint(768)
const { isLoaded: isLogoLoaded } = useImagePreload(SubmarkLogo)

const scenes: Scene[] = [
  {
    id: 1,
    title: 'SARANDO',
    subtitle: 'Tradisi Yang, Bertemu Teknologi',
  },
  {
    id: 2,
    title: 'Kami Membangun Tanpa Melupakan Jati Diri',
    subtitle:
      'Teknologi boleh modern, tapi akar budaya tetap kuat. Dari Konawe, kami berkarya dengan bangga menjunjung nilai-nilai leluhur sambil menciptakan solusi digital kelas dunia.',
  },
  {
    id: 3,
    title: 'Karya Nyata, Bukan Sekadar Janji',
    subtitle:
      'Sistem enterprise, aplikasi mobile, platform web - semua dikerjakan dengan standar internasional. Bukti bahwa talenta dari Konawe, Sulawesi Tenggara mampu bersaing di level manapun.',
  },
  {
    id: 4,
    title: 'Proyek Anda, Keahlian Kami',
    subtitle:
      'Dari konsep hingga eksekusi, kami hadirkan solusi digital yang tidak hanya berfungsi, tapi juga bermakna.',
  },
]

// Scene Navigation
const { currentScene, transitionDirection, nextScene, previousScene, goToEnd, goToStart } =
  useSceneNavigation(scenes, 900)

// Animation for content inside scenes (title, subtitle, paragraph, etc)
const contentInitial = computed(() => {
  return isMobile.value ? { opacity: 0, y: 30 } : { opacity: 0, x: 30 }
})

const contentAnimate = computed(() => {
  return isMobile.value ? { opacity: 1, y: 0 } : { opacity: 1, x: 0 }
})

const contentExit = computed(() => {
  if (isMobile.value) {
    return transitionDirection.value === 'next' ? { opacity: 0, y: -30 } : { opacity: 0, y: 30 }
  } else {
    return transitionDirection.value === 'next' ? { opacity: 0, x: -30 } : { opacity: 0, x: 30 }
  }
})

// Button size responsive
const buttonSize = computed(() => {
  return isMobile.value ? 'default' : 'lg'
})

// Dock items - 3 items only: Previous, Finish/Start, Next
const dockItems = computed<DockItemData[]>(() => {
  const isAtEnd = currentScene.value === scenes.length - 1

  return [
    // Previous Button
    {
      icon: () =>
        h(isMobile.value ? ChevronUp : ChevronLeft, {
          size: 20,
          class: 'text-white',
        }),
      label: () => 'Sebelumnya',
      onClick: previousScene,
      className: currentScene.value === 0 ? 'opacity-50 cursor-not-allowed' : '',
    },
    // Finish/Start Button (Dynamic)
    {
      icon: () =>
        h(Flag, {
          size: 20,
          class: 'text-primary',
        }),
      label: () => (isAtEnd ? 'Ke Awal' : 'Ke Akhir'),
      onClick: isAtEnd ? goToStart : goToEnd,
      className: 'ring-2 ring-primary/30',
    },
    // Next Button
    {
      icon: () =>
        h(isMobile.value ? ChevronDown : ChevronRight, {
          size: 20,
          class: 'text-white',
        }),
      label: () => 'Selanjutnya',
      onClick: nextScene,
      className: currentScene.value === scenes.length - 1 ? 'opacity-50 cursor-not-allowed' : '',
    },
  ]
})

// Logo initial state
const logoInitialState = computed(() => ({
  opacity: 0,
  scale: 0.5,
  y: isMobile.value ? '-20dvh' : '-30dvh',
  x: '-50%',
}))

// Logo animation based on current scene and transitions
const logoAnimation = computed(() => {
  const baseTransition = {
    duration: 0.8,
    ease: 'easeInOut' as const,
  }

  // Define target states for each scene
  const sceneStates = {
    0: {
      // Scene 1: Logo normal di atas
      y: isMobile.value ? '-20dvh' : '-40dvh',
      scale: isMobile.value ? 1.0 : 1.0,
      opacity: 1,
      filter: 'grayscale(0%) brightness(100%)',
      zIndex: 15,
      x: '-50%',
    },
    1: {
      // Scene 2: Logo di tengah sebagai background
      y: '-60%',
      scale: isMobile.value ? 2.5 : 2.5,
      opacity: 0.25,
      filter: 'grayscale(100%) brightness(50%)',
      zIndex: 5,
      x: '-50%',
    },
    2: {
      // Scene 3: Logo tetap di background
      y: '-60%',
      scale: isMobile.value ? 2.5 : 2.5,
      opacity: 0.25,
      filter: 'grayscale(100%) brightness(50%)',
      zIndex: 5,
      x: '-50%',
    },
    3: {
      // Scene 4: Logo kembali ke atas
      y: isMobile.value ? '-20dvh' : '-40dvh',
      scale: isMobile.value ? 1.0 : 1.0,
      opacity: 1,
      filter: 'grayscale(0%) brightness(100%)',
      zIndex: 15,
      x: '-50%',
    },
  }

  const currentState = sceneStates[currentScene.value as keyof typeof sceneStates]

  return {
    animate: currentState,
    transition: baseTransition,
  }
})
</script>

<template>
  <main class="relative min-h-dvh bg-foreground">
    <!-- Silk Background - Fixed Position -->
    <div class="fixed inset-0 w-full h-dvh pointer-events-none z-0">
      <Silk
        :speed="5"
        :scale="1"
        color="#658c58"
        :noise-intensity="1.5"
        :rotation="0"
        class="w-full h-full"
      />
    </div>

    <!-- Animated Logo with Absolute Positioning -->
    <Motion
      v-if="isLogoLoaded"
      :initial="logoInitialState"
      :animate="logoAnimation.animate"
      :transition="logoAnimation.transition"
      :style="{
        position: 'fixed',
        left: '50%',
        top: '50%',
        zIndex: logoAnimation.animate.zIndex,
        pointerEvents: 'none',
      }"
      class="w-32 sm:w-48 lg:w-64"
    >
      <img
        :src="SubmarkLogo"
        alt="Sarando Submark Logo"
        loading="eager"
        decoding="async"
        class="w-full h-auto object-contain drop-shadow-2xl"
      />
    </Motion>

    <!-- Content Container -->
    <section class="relative h-dvh flex items-center justify-center">
      <div class="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl w-full">
        <!-- Scene 1: SARANDO -->
        <section
          v-if="currentScene === 0 && scenes[0]"
          class="text-center mt-12 md:mt-6 lg:mt-0 space-y-2 pt-32 sm:pt-40 lg:pt-48"
        >
          <Motion
            :initial="{ opacity: 0, scale: 0.95 }"
            :animate="{ opacity: 1, scale: 1 }"
            :exit="contentExit"
            :transition="{ duration: 0.8, delay: 0.5, ease: 'easeOut' }"
          >
            <h2
              class="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight uppercase text-secondary"
            >
              {{ scenes[0]?.title }}
            </h2>
          </Motion>
          <Motion
            :initial="{ opacity: 0, scale: 0.95 }"
            :animate="{ opacity: 1, scale: 1 }"
            :exit="contentExit"
            :transition="{ duration: 0.7, delay: 0.8, ease: 'easeOut' }"
          >
            <p
              class="text-xl sm:text-2xl lg:text-3xl text-white/70 max-w-3xl mx-auto leading-relaxed"
            >
              {{ scenes[0]?.subtitle }}
            </p>
          </Motion>
        </section>

        <!-- Scene 2: Problem -->
        <section v-if="currentScene === 1 && scenes[1]" class="text-center space-y-2">
          <Motion
            :initial="contentInitial"
            :animate="contentAnimate"
            :exit="contentExit"
            :transition="{ duration: 0.7, ease: 'easeOut' }"
          >
            <h2 class="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-secondary">
              {{ scenes[1]?.title }}
            </h2>
          </Motion>
          <Motion
            :initial="contentInitial"
            :animate="contentAnimate"
            :exit="contentExit"
            :transition="{ duration: 0.7, delay: 0.4, ease: 'easeOut' }"
          >
            <p
              class="text-base sm:text-lg lg:text-xl text-white/70 max-w-3xl mx-auto leading-relaxed"
            >
              {{ scenes[1]?.subtitle }}
            </p>
          </Motion>
        </section>

        <!-- Scene 3: Realization -->
        <section v-if="currentScene === 2 && scenes[2]" class="text-center space-y-2">
          <Motion
            :initial="contentInitial"
            :animate="contentAnimate"
            :exit="contentExit"
            :transition="{ duration: 0.7, ease: 'easeOut' }"
          >
            <h2 class="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-secondary">
              {{ scenes[2]?.title }}
            </h2>
          </Motion>
          <Motion
            :initial="contentInitial"
            :animate="contentAnimate"
            :exit="contentExit"
            :transition="{ duration: 0.7, delay: 0.4, ease: 'easeOut' }"
          >
            <p
              class="text-base sm:text-lg lg:text-xl text-white/70 max-w-3xl mx-auto leading-relaxed"
            >
              {{ scenes[2]?.subtitle }}
            </p>
          </Motion>
        </section>

        <!-- Scene 4: CTA -->
        <section
          v-if="currentScene === 3 && scenes[3]"
          class="text-center mt-12 md:mt-6 lg:mt-0 space-y-2 pt-32 sm:pt-40 lg:pt-48"
        >
          <!-- Title -->
          <Motion
            :initial="contentInitial"
            :animate="contentAnimate"
            :exit="contentExit"
            :transition="{ duration: 0.7, delay: 0.3, ease: 'easeOut' }"
          >
            <h2 class="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-secondary">
              {{ scenes[3]?.title }}
            </h2>
          </Motion>

          <!-- Subtitle/Description -->
          <Motion
            :initial="contentInitial"
            :animate="contentAnimate"
            :exit="contentExit"
            :transition="{ duration: 0.7, delay: 0.6, ease: 'easeOut' }"
          >
            <p
              class="text-base sm:text-lg lg:text-xl text-white/70 max-w-3xl mx-auto leading-relaxed"
            >
              {{ scenes[3]?.subtitle }}
            </p>
          </Motion>

          <!-- CTA Buttons -->
          <Motion
            :initial="contentInitial"
            :animate="contentAnimate"
            :exit="contentExit"
            :transition="{ duration: 0.7, delay: 0.9, ease: 'easeOut' }"
          >
            <div class="flex flex-row gap-4 justify-center items-center mt-8">
              <Button as-child :size="buttonSize" variant="default">
                <RouterLink to="/layanan"> Lihat Layanan Kami </RouterLink>
              </Button>
              <Button as-child :size="buttonSize" variant="outline">
                <RouterLink to="/proyek"> Jelajahi Proyek </RouterLink>
              </Button>
            </div>
          </Motion>
        </section>
      </div>
    </section>

    <!-- Dock Navigation -->
    <Motion
      :initial="{ opacity: 0, y: 20 }"
      :animate="{ opacity: 1, y: 0 }"
      :transition="{ duration: 0.6, delay: 0.5 }"
      class="fixed bottom-0 left-0 right-0 z-20 pointer-events-none"
    >
      <div class="pointer-events-auto">
        <DockNav
          :items="dockItems"
          :baseItemSize="48"
          :magnification="68"
          :distance="120"
          :panelHeight="64"
          className="bg-neutral-900/90 backdrop-blur-xl shadow-2xl"
        />
      </div>
    </Motion>
  </main>
</template>
