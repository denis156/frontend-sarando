<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { Motion, AnimatePresence } from 'motion-v'
import { RouterLink } from 'vue-router'
import { useWindowScroll, useWindowSize, usePreferredReducedMotion } from '@vueuse/core'

import Threads from '@/components/ui/background/Threads.vue'
import SubmarkLogo from '@/assets/submark-logo.png'
import * as LucideIcons from 'lucide-vue-next'
import { ExternalLink, Mail, MapPin } from 'lucide-vue-next'
import { Globe } from '@/components/ui/globe'

import { getFeaturedServices } from '@/api/services'
import type { Service } from '@/types/service'

// --- Constants ---
const SCENE_COUNT = 7 // Hero, Origin, Problem, Solution, Services, Founder, CTA

// --- Composables ---
const { y: scrollY } = useWindowScroll()
const { height: windowHeight } = useWindowSize()
const prefersReducedMotion = usePreferredReducedMotion()

// --- State ---
const featuredServicesList = ref<Service[]>([])

// Get featured services on mount
onMounted(async () => {
  try {
    featuredServicesList.value = await getFeaturedServices()
  } catch (error) {
    console.error('Failed to fetch featured services:', error)
  }
})

// Helper to get dynamic icon
const getIcon = (iconName: string | null) => {
  if (!iconName) return LucideIcons.Box
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (LucideIcons as any)[iconName] || LucideIcons.Box
}

const progress = computed(() => {
  if (windowHeight.value === 0) return 0

  // Calculate raw progress (0 to 1) based on scroll position
  // Max scrollable distance is totalHeight - windowHeight (one viewport)
  // to ensure we can reach the end
  const maxScroll = (SCENE_COUNT - 1) * windowHeight.value
  if (maxScroll <= 0) return 0

  const p = Math.max(0, Math.min(1, scrollY.value / maxScroll))
  return p
})

const currentSceneIndex = computed(() => {
  // Map progress (0-1) to scene index (0 to SCENE_COUNT-1)
  const idx = Math.floor(progress.value * (SCENE_COUNT - 0.01)) // 0.99 ensures we don't jump to next too early
  return Math.min(idx, SCENE_COUNT - 1)
})

// --- Animation Configs ---
// Common transition settings
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const smoothTransition: any = {
  type: 'spring',
  stiffness: 50,
  damping: 20,
  mass: 1,
}

// --- Utils ---
const scrollToScene = (index: number) => {
  window.scrollTo({
    top: index * windowHeight.value,
    behavior: prefersReducedMotion.value ? 'auto' : 'smooth',
  })
}
</script>

<template>
  <main class="relative bg-background text-foreground selection:bg-primary selection:text-white">
    <!-- 1. Scroll Container (Invisible driver) -->
    <!-- We use a calculated height to force the browser to show a scrollbar -->
    <div
      :style="{ height: `${SCENE_COUNT * 100}dvh` }"
      class="absolute top-0 left-0 w-full z-0 pointer-events-none"
    ></div>

    <!-- 2. Sticky Viewport (The Stage) -->
    <div
      class="fixed top-0 left-0 w-full h-dvh overflow-hidden z-10 flex items-center justify-center"
    >
      <!-- Background Layer -->
      <div class="absolute inset-0 z-0">
        <!-- Threads Background: Visible nicely in Scene 0, subtle elsewhere -->
        <div
          class="absolute inset-0 transition-opacity duration-1000 ease-in-out"
          :class="[currentSceneIndex === 0 ? 'opacity-50' : 'opacity-20']"
        >
          <Threads :color="[1, 1, 1]" :amplitude="1.5" />
        </div>

        <!-- Gradient overlay -->
        <div
          class="absolute inset-0 bg-linear-to-b from-background/50 via-background/80 to-background transition-opacity duration-700"
          :class="[currentSceneIndex === 0 ? 'opacity-0' : 'opacity-100']"
        ></div>

        <!-- Persistent World Map Layer (Desktop & Mobile - Fixes lag by mounting once) -->
        <div
          class="absolute inset-0 flex items-end justify-center transition-opacity duration-700 ease-in-out pointer-events-none"
          :class="[currentSceneIndex === 2 ? 'opacity-100' : 'opacity-0']"
        >
          <!-- Map Container - Full Width, Bottom Aligned, No Border/Background -->
          <!-- Globe Container -->
          <div
            class="w-full h-[60dvh] md:h-[80dvh] relative overflow-hidden flex items-end justify-center perspective-1000"
          >
            <Globe
              class="translate-y-[60%] md:translate-y-[75%] opacity-90 scale-125 md:scale-110"
            />

            <!-- Radial overlay to focus on center -->
            <div
              class="absolute inset-0 bg-[radial-gradient(circle_at_50%_100%,transparent_30%,var(--background)_90%)] pointer-events-none opacity-80"
            ></div>
          </div>
        </div>
      </div>

      <!-- Content Layer -->
      <div
        class="relative z-10 w-full h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center"
      >
        <!-- SCENE 1: HERO -->
        <AnimatePresence>
          <Motion
            v-if="currentSceneIndex === 0"
            :initial="{ opacity: 0, y: 20 }"
            :animate="{ opacity: 1, y: 0 }"
            :exit="{ opacity: 0, y: -50, filter: 'blur(10px)' }"
            :transition="smoothTransition"
            class="absolute inset-0 flex flex-col items-center justify-center text-center"
          >
            <div class="space-y-8">
              <Motion
                :animate="{
                  y: [0, -10, 0],
                  filter: ['brightness(1)', 'brightness(1.2)', 'brightness(1)'],
                }"
                :transition="{ duration: 4, repeat: Infinity, ease: 'easeInOut' }"
              >
                <img
                  :src="SubmarkLogo"
                  alt="Sarando Logo"
                  class="w-24 h-24 md:w-48 md:h-48 object-contain mx-auto drop-shadow-[0_0_30px_rgba(255,255,255,0.2)]"
                />
              </Motion>

              <div class="space-y-4 max-w-3xl px-4">
                <h1
                  class="text-6xl md:text-8xl lg:text-9xl font-bold tracking-tighter text-transparent bg-clip-text bg-linear-to-br from-white to-neutral-500 uppercase"
                >
                  SARANDO
                </h1>
                <p
                  class="text-xl md:text-2xl text-muted-foreground font-light max-w-2xl mx-auto leading-relaxed"
                >
                  <span class="text-primary font-medium">Adat yang bertemu teknologi.</span> Merakit
                  solusi digital berstandar global dengan jiwa kearifan lokal dari
                  <span class="text-secondary font-medium">Konawe, Sulawesi Tenggara</span>.
                </p>
              </div>

              <!-- Scroll Hint -->
              <Motion
                class="absolute bottom-12 md:bottom-16 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 text-muted-foreground/70 text-xs uppercase tracking-[0.3em] font-light"
                :animate="{ y: [0, 10, 0], opacity: [0.5, 1, 0.5] }"
                :transition="{ duration: 2, repeat: Infinity }"
              >
                <span>Jelajahi</span>
                <div class="w-px h-16 bg-linear-to-b from-white/50 to-transparent"></div>
              </Motion>
            </div>
          </Motion>
        </AnimatePresence>

        <!-- SCENE 2: ORIGIN STORY -->
        <AnimatePresence>
          <Motion
            v-if="currentSceneIndex === 1"
            class="absolute inset-0 flex flex-col items-center justify-center text-center p-6"
            :initial="{ opacity: 0, scale: 0.9 }"
            :animate="{ opacity: 1, scale: 1 }"
            :exit="{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }"
            :transition="smoothTransition"
          >
            <div class="max-w-4xl space-y-8 md:space-y-12">
              <div class="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-0">
                <div
                  class="text-center md:text-right flex-1 md:border-r border-border md:pr-10 py-2 md:py-4"
                >
                  <h2
                    class="text-5xl md:text-8xl font-bold tracking-tighter text-transparent bg-clip-text bg-linear-to-br from-white to-neutral-500 uppercase"
                  >
                    SARA
                  </h2>
                  <p class="text-muted-foreground mt-2 text-base md:text-lg">
                    Adat & Tradisi Leluhur
                  </p>
                </div>
                <!-- Mobile Divider -->
                <div class="w-16 h-px bg-border md:hidden"></div>
                <div class="text-center md:text-left flex-1 md:pl-10 py-2 md:py-4">
                  <h2
                    class="text-5xl md:text-8xl font-bold tracking-tighter text-transparent bg-clip-text bg-linear-to-br from-white to-neutral-500 uppercase"
                  >
                    NDO
                  </h2>
                  <p class="text-muted-foreground mt-2 text-base md:text-lg">Kebersamaan Kita</p>
                </div>
              </div>

              <p class="text-lg md:text-3xl text-muted-foreground leading-relaxed font-light px-4">
                "Kami menyatukan kearifan lokal dengan inovasi digital.
                <span class="text-primary font-medium">Bukan sekadar menulis kode,</span>
                tapi merakit masa depan dari tanah Konawe, Sulawesi Tenggara."
              </p>
            </div>
          </Motion>
        </AnimatePresence>

        <!-- SCENE 3: THE PROBLEM -->
        <AnimatePresence>
          <Motion
            v-if="currentSceneIndex === 2"
            class="absolute inset-0 flex flex-col items-center justify-center p-6 text-center"
            :initial="{ opacity: 0, y: 30 }"
            :animate="{ opacity: 1, y: 0 }"
            :exit="{ opacity: 0, y: -30 }"
            :transition="smoothTransition"
          >
            <div class="max-w-5xl space-y-6 md:space-y-8 relative z-20">
              <h2 class="text-3xl md:text-5xl font-bold leading-tight">
                Stigma Daerah
                <div
                  class="text-xl md:text-2xl text-accent font-mono font-bold my-1 md:my-2 opacity-80 flex items-center justify-center gap-4"
                >
                  <span class="w-8 md:w-12 h-px bg-accent/50"></span>
                  VS
                  <span class="w-8 md:w-12 h-px bg-accent/50"></span>
                </div>
                Kualitas Dunia
              </h2>
              <p class="text-sm md:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
                Seringkali potensi daerah dipandang sebelah mata. Padahal, inovasi tidak mengenal
                batas geografis. Kami membuktikan bahwa talenta dari
                <strong class="text-primary">Konawe, Sulawesi Tenggara</strong> mampu melahirkan
                solusi teknologi berstandar global yang presisi, tangguh, dan estetik.
              </p>
            </div>

            <!-- Map moves to persistent layer below, filling bottom screen -->
          </Motion>
        </AnimatePresence>

        <!-- SCENE 4: THE SOLUTION -->
        <AnimatePresence>
          <Motion
            v-if="currentSceneIndex === 3"
            class="absolute inset-0 flex items-center justify-center p-6 text-center"
            :initial="{ opacity: 0, y: 50 }"
            :animate="{ opacity: 1, y: 0 }"
            :exit="{ opacity: 0, y: -50 }"
            :transition="smoothTransition"
          >
            <div class="max-w-4xl space-y-6 md:space-y-8 px-4">
              <h2 class="text-xs md:text-sm font-bold tracking-[0.5em] text-primary uppercase">
                Misi Kami
              </h2>
              <h3 class="text-3xl md:text-6xl font-bold leading-tight">
                Membuktikan Bahwa
                <span class="text-white border-b-2 border-primary">Putra Daerah</span>
                <br />
                Mampu Mendunia
              </h3>
              <p class="text-base md:text-xl text-muted-foreground max-w-2xl mx-auto">
                Kami hadir untuk menjawab keraguan dengan karya nyata. Berbekal disiplin tinggi dan
                semangat "SARANDO", kami menghadirkan teknologi yang tidak hanya canggih, tapi juga
                bernilai.
              </p>
            </div>
          </Motion>
        </AnimatePresence>

        <!-- SCENE 5: SERVICES -->
        <AnimatePresence>
          <Motion
            v-if="currentSceneIndex === 4"
            class="absolute inset-0 flex flex-col items-center justify-center p-6"
            :initial="{ opacity: 0 }"
            :animate="{ opacity: 1 }"
            :exit="{ opacity: 0 }"
            :transition="smoothTransition"
          >
            <div class="w-full max-w-6xl px-4">
              <h2 class="text-xl md:text-4xl font-bold mb-6 md:mb-12 text-center">
                Solusi & Layanan
              </h2>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-6">
                <Motion
                  v-for="(service, i) in featuredServicesList"
                  :key="i"
                  :initial="{ opacity: 0, y: 20 }"
                  :animate="{ opacity: 1, y: 0 }"
                  :transition="{ delay: i * 0.1 + 0.3 }"
                  class="group relative bg-card/50 border border-border hover:border-primary/50 p-4 md:p-8 rounded-xl transition-colors duration-300 flex flex-col items-center text-center"
                >
                  <div
                    class="text-2xl md:text-4xl mb-3 md:mb-6 bg-secondary/10 w-10 h-10 md:w-16 md:h-16 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
                  >
                    <component
                      :is="getIcon(service.icon)"
                      class="w-5 h-5 md:w-8 md:h-8 text-foreground group-hover:text-primary transition-colors"
                    />
                  </div>
                  <h3
                    class="text-base md:text-xl font-semibold mb-2 md:mb-3 group-hover:text-primary transition-colors"
                  >
                    {{ service.name }}
                  </h3>
                  <p
                    class="text-muted-foreground text-[10px] md:text-sm leading-relaxed line-clamp-3"
                  >
                    {{ service.description }}
                  </p>
                </Motion>
              </div>
              <div class="mt-8 md:mt-12 text-center">
                <RouterLink
                  to="/layanan"
                  class="inline-flex items-center gap-2 text-neutral-400 hover:text-white transition-colors border-b border-transparent hover:border-white pb-1 text-xs md:text-base"
                >
                  Eksplorasi Semua Layanan <ExternalLink class="w-3 h-3 md:w-4 md:h-4" />
                </RouterLink>
              </div>
            </div>
          </Motion>
        </AnimatePresence>

        <!-- SCENE 6: FOUNDER/TEAM -->
        <AnimatePresence>
          <Motion
            v-if="currentSceneIndex === 5"
            class="absolute inset-0 flex items-center justify-center p-6"
            :initial="{ opacity: 0, scale: 0.95 }"
            :animate="{ opacity: 1, scale: 1 }"
            :exit="{ opacity: 0, scale: 1.05 }"
            :transition="smoothTransition"
          >
            <div
              class="flex flex-col md:flex-row items-center gap-6 md:gap-12 max-w-5xl bg-card/30 p-6 md:p-12 rounded-3xl border border-border backdrop-blur-sm mx-4"
            >
              <div
                class="w-24 h-24 md:w-48 md:h-48 rounded-full overflow-hidden border-2 border-border shrink-0"
              >
                <!-- Placeholder for Founder Image if not available separately, using a robust generic avatar or gradient for now -->
                <div
                  class="w-full h-full bg-linear-to-br from-secondary/20 to-primary/20 flex items-center justify-center text-2xl md:text-4xl text-foreground font-bold"
                >
                  D
                </div>
              </div>
              <div class="space-y-4 md:space-y-6 text-center md:text-left">
                <div>
                  <h2 class="text-2xl md:text-3xl font-bold text-white">Denis Djodian Ardika</h2>
                  <p class="text-primary font-medium text-sm md:text-base">
                    Pendiri & Lead Developer
                  </p>
                </div>
                <p class="text-muted-foreground leading-relaxed italic text-sm md:text-base">
                  "Walaupun Sarando baru berdiri tahun 2026, pengalaman saya selama lebih dari 4
                  tahun di industri IT menjadi fondasi tim ini. Bersama Sarana Digital Anandonia,
                  kami siap membantu Anda dengan sistem yang kami bangun—membuktikan bahwa dedikasi
                  putra daerah mampu memberikan solusi berkelas dunia."
                </p>
                <div
                  class="flex flex-wrap gap-4 justify-center md:justify-start text-xs md:text-sm text-muted-foreground"
                >
                  <div class="flex items-center gap-1">
                    <MapPin class="w-3 h-3 md:w-4 md:h-4" /> Konawe, Sulawesi Tenggara
                  </div>
                  <div class="flex items-center gap-1">Est. 2026</div>
                </div>
              </div>
            </div>
          </Motion>
        </AnimatePresence>

        <!-- SCENE 7: CTA -->
        <AnimatePresence>
          <Motion
            v-if="currentSceneIndex === 6"
            class="absolute inset-0 flex items-center justify-center p-6"
            :initial="{ opacity: 0 }"
            :animate="{ opacity: 1 }"
            :exit="{ opacity: 0 }"
            :transition="smoothTransition"
          >
            <div class="text-center space-y-8 md:space-y-10 max-w-3xl px-4">
              <h2 class="text-4xl md:text-7xl font-bold tracking-tighter">Siap Berkolaborasi?</h2>
              <p class="text-lg md:text-xl text-neutral-400 max-w-2xl mx-auto">
                Jangan biarkan jarak membatasi inovasi Anda. Mari kita bangun sesuatu yang hebat
                bersama.
              </p>

              <div
                class="flex flex-col sm:flex-row gap-4 justify-center pt-4 md:pt-8 w-full max-w-sm mx-auto sm:max-w-none"
              >
                <RouterLink
                  to="/kontak"
                  class="inline-flex h-12 md:h-14 items-center justify-center gap-2 rounded-full bg-primary px-8 text-base md:text-lg font-medium text-white shadow transition-colors hover:bg-primary/90 w-full sm:w-auto"
                >
                  <Mail class="w-5 h-5" />
                  Hubungi Kami
                </RouterLink>
                <RouterLink
                  to="/layanan"
                  class="inline-flex h-12 md:h-14 items-center justify-center rounded-full border border-input bg-transparent px-8 text-base md:text-lg font-medium text-foreground shadow-sm transition-colors hover:bg-secondary hover:text-secondary-foreground w-full sm:w-auto"
                >
                  Pelajari Layanan
                </RouterLink>
              </div>

              <footer
                class="absolute bottom-4 md:bottom-8 left-0 w-full text-center text-neutral-600 text-xs md:text-sm px-4"
              >
                &copy; 2026 PT Sarana Digital Andonia. All rights reserved.
              </footer>
            </div>
          </Motion>
        </AnimatePresence>
      </div>

      <!-- 3. Navigation / Progress Indicators -->
      <div class="fixed right-6 top-1/2 -translate-y-1/2 z-50 hidden md:flex flex-col gap-4">
        <button
          v-for="i in SCENE_COUNT"
          :key="i"
          @click="scrollToScene(i - 1)"
          class="w-3 h-3 rounded-full transition-all duration-300"
          :class="[
            currentSceneIndex === i - 1
              ? 'bg-primary scale-125'
              : 'bg-neutral-700 hover:bg-neutral-500',
          ]"
          :aria-label="`Go to scene ${i}`"
        />
      </div>

      <!-- Mobile Progress Bar -->
      <div
        class="fixed bottom-0 left-0 h-1 bg-primary z-50 md:hidden transition-all duration-100 ease-out"
        :style="{ width: `${progress * 100}%` }"
      ></div>
    </div>
  </main>
</template>

<style scoped>
/* Ensure smooth transitions for specialized elements */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
