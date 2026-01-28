<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { Motion, AnimatePresence } from 'motion-v'
import { RouterLink } from 'vue-router'
import { useWindowScroll, useWindowSize, usePreferredReducedMotion } from '@vueuse/core'
import { Button } from '@/components/ui/button'
import Threads from '@/components/ui/background/Threads.vue'
import SubmarkLogo from '@/assets/submark-logo.png'
import * as LucideIcons from 'lucide-vue-next'
import { ArrowDown, ExternalLink, Mail, MapPin } from 'lucide-vue-next'
import WorldMap from '@/components/ui/world-map/WorldMap.vue'
import { getFeaturedServices } from '@/api/services'
import type { Service } from '@/types/service'

// --- Map Config ---
const mapDots = [
  {
    start: {
      lat: 121.9729,
      lng: -3.7672,
    }, // Alaska (Fairbanks)
    end: {
      lat: 34.0522,
      lng: -118.2437,
    }, // Los Angeles
  },
  {
    start: { lat: 121.9729, lng: -3.7672 }, // Alaska (Fairbanks)
    end: { lat: -15.7975, lng: -47.8919 }, // Brazil (Brasília)
  },
  {
    start: { lat: -15.7975, lng: -47.8919 }, // Brazil (Brasília)
    end: { lat: 38.7223, lng: -9.1393 }, // Lisbon
  },
  {
    start: { lat: 51.5074, lng: -0.1278 }, // London
    end: { lat: 28.6139, lng: 77.209 }, // New Delhi
  },
  {
    start: { lat: 28.6139, lng: 77.209 }, // New Delhi
    end: { lat: 43.1332, lng: 131.9113 }, // Vladivostok
  },
  {
    start: { lat: 28.6139, lng: 77.209 }, // New Delhi
    end: { lat: -1.2921, lng: 36.8219 }, // Nairobi
  },
]

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
        <!-- Threads Background: Only visible in scene 0, but we can keep it subtle throughout or fade it -->
        <div
          class="absolute inset-0 transition-opacity duration-1000 ease-in-out"
          :class="[currentSceneIndex === 0 ? 'opacity-100' : 'opacity-20']"
        >
          <Threads :color="[1, 1, 1]" :amplitude="1.5" :scale="currentSceneIndex === 0 ? 1 : 0.5" />
        </div>

        <!-- Gradient overlay for better text readability on other scenes -->
        <div
          class="absolute inset-0 bg-gradient-to-b from-background/50 via-background/80 to-background transition-opacity duration-700"
          :class="[currentSceneIndex === 0 ? 'opacity-0' : 'opacity-100']"
        ></div>

        <!-- Persistent World Map Layer (Fixes lag by mounting once) -->
        <div
          class="absolute inset-0 flex items-center justify-center transition-opacity duration-700 ease-in-out pointer-events-none"
          :class="[currentSceneIndex === 2 ? 'opacity-100' : 'opacity-0']"
        >
          <div
            class="w-full max-w-6xl px-4 md:px-8 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12"
          >
            <!-- Spacer for text column -->
            <div class="hidden md:block"></div>

            <!-- Map Container Positioned to match Scene 3 layout -->
            <div
              class="relative h-[250px] md:h-[400px] w-full bg-card/50 rounded-2xl overflow-hidden border border-border backdrop-blur-sm flex items-center justify-center"
            >
              <WorldMap
                :dots="mapDots"
                line-color="var(--primary)"
                map-color="#FFFFFF40"
                map-bg-color="transparent"
                class="w-full h-full"
              />
            </div>
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
                  class="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-white mix-blend-overlay"
                >
                  SARANDO
                </h1>
                <p class="text-lg md:text-2xl text-secondary font-light tracking-wide">
                  Adat yang bertemu teknologi
                </p>
              </div>

              <!-- Scroll Hint -->
              <Motion
                :animate="{ y: [0, 10, 0], opacity: [0.5, 1, 0.5] }"
                :transition="{ duration: 2, repeat: Infinity }"
                class="absolute bottom-12 md:bottom-24 left-1/2 -translate-x-1/2"
              >
                <div
                  class="flex flex-col items-center gap-2 text-neutral-500 text-sm uppercase tracking-widest"
                >
                  <span>Scroll</span>
                  <ArrowDown class="w-4 h-4" />
                </div>
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
                    class="text-5xl md:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-secondary to-primary"
                  >
                    Sara
                  </h2>
                  <p class="text-muted-foreground mt-2 text-base md:text-lg">Adat / Tradisi</p>
                </div>
                <!-- Mobile Divider -->
                <div class="w-16 h-px bg-border md:hidden"></div>
                <div class="text-center md:text-left flex-1 md:pl-10 py-2 md:py-4">
                  <h2
                    class="text-5xl md:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-bl from-secondary to-primary"
                  >
                    Ndo
                  </h2>
                  <p class="text-muted-foreground mt-2 text-base md:text-lg">Kita / Orang Kita</p>
                </div>
              </div>

              <p class="text-lg md:text-3xl text-muted-foreground leading-relaxed font-light px-4">
                "Kami membawa nilai leluhur ke dalam era digital.
                <span class="text-primary font-medium">Bukan sekadar kode,</span>
                tapi dedikasi untuk tanah air."
              </p>
            </div>
          </Motion>
        </AnimatePresence>

        <!-- SCENE 3: THE PROBLEM -->
        <AnimatePresence>
          <Motion
            v-if="currentSceneIndex === 2"
            class="absolute inset-0 flex items-center justify-center p-6"
            :initial="{ opacity: 0, x: 50 }"
            :animate="{ opacity: 1, x: 0 }"
            :exit="{ opacity: 0, x: -50 }"
            :transition="smoothTransition"
          >
            <div
              class="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 max-w-6xl items-center w-full"
            >
              <div class="space-y-4 md:space-y-6 order-2 md:order-1">
                <div class="border-l-4 border-accent pl-4 md:pl-6 py-2">
                  <h2 class="text-3xl md:text-5xl font-bold leading-tight">
                    Stigma Daerah
                    <div
                      class="text-xl md:text-2xl text-accent font-mono font-bold my-1 md:my-2 opacity-80 flex items-center gap-4"
                    >
                      <span class="w-8 md:w-12 h-px bg-accent/50"></span>
                      VS
                      <span class="w-8 md:w-12 h-px bg-accent/50"></span>
                    </div>
                    Kualitas Dunia
                  </h2>
                </div>
                <p
                  class="text-sm md:text-lg text-muted-foreground leading-relaxed pl-4 md:pl-6 border-l-4 border-transparent"
                >
                  Seringkali talenta dari daerah dipandang sebelah mata. Ada anggapan bahwa solusi
                  IT berkualitas hanya datang dari kota besar atau luar negeri. Padahal, potensi
                  anak bangsa di Konawe tak kalah bersaing.
                </p>
              </div>

              <!-- Placeholder for layout spacing, actual map is in persistent background layer -->
              <div class="h-[250px] md:h-[400px] w-full order-1 md:order-2 invisible">
                <!-- Invisible spacer to keep layout grid intact -->
              </div>
            </div>
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
                Membuktikan bahwa <span class="text-white border-b-2 border-primary">Konawe</span>
                <br />
                Bisa Mendunia
              </h3>
              <p class="text-base md:text-xl text-muted-foreground max-w-2xl mx-auto">
                Kami hadir untuk menutup celah kepercayaan itu. Dengan standar pengembangan software
                modern, kedisiplinan tinggi, dan semangat "SARA", kami memberikan hasil yang
                melampaui ekspektasi.
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
                Layanan Unggulan
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
                  Lihat semua layanan <ExternalLink class="w-3 h-3 md:w-4 md:h-4" />
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
                  class="w-full h-full bg-gradient-to-br from-secondary/20 to-primary/20 flex items-center justify-center text-2xl md:text-4xl text-foreground font-bold"
                >
                  D
                </div>
              </div>
              <div class="space-y-4 md:space-y-6 text-center md:text-left">
                <div>
                  <h2 class="text-2xl md:text-3xl font-bold text-white">Denis Djodian Ardika</h2>
                  <p class="text-primary font-medium text-sm md:text-base">
                    Founder & Lead Developer
                  </p>
                </div>
                <p class="text-muted-foreground leading-relaxed italic text-sm md:text-base">
                  "Saya mendirikan SARANDO pada tahun 2026 dengan satu keyakinan: Teknologi adalah
                  alat untuk mengangkat martabat daerah. Dengan pengalaman 4 tahun di industri, saya
                  ingin membuktikan bahwa anak daerah bisa menjadi pemain global."
                </p>
                <div
                  class="flex flex-wrap gap-4 justify-center md:justify-start text-xs md:text-sm text-muted-foreground"
                >
                  <div class="flex items-center gap-1">
                    <MapPin class="w-3 h-3 md:w-4 md:h-4" /> Konawe, Sultra
                  </div>
                  <div class="flex items-center gap-1">Since 2026</div>
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
                <Button
                  size="lg"
                  class="px-8 text-base md:text-lg h-12 md:h-14 bg-primary hover:bg-primary/90 text-white rounded-full w-full sm:w-auto"
                >
                  <RouterLink to="/kontak" class="flex items-center justify-center gap-2 w-full">
                    <Mail class="w-5 h-5" /> Hubungi Kami
                  </RouterLink>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  class="px-8 text-base md:text-lg h-12 md:h-14 rounded-full border-border hover:bg-secondary/10 text-white w-full sm:w-auto"
                >
                  <RouterLink to="/proyek" class="flex items-center justify-center w-full">
                    Lihat Portofolio
                  </RouterLink>
                </Button>
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
