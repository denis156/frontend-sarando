<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Motion } from 'motion-v'
import { RouterLink } from 'vue-router'
import * as LucideIcons from 'lucide-vue-next'
import { ArrowRight } from 'lucide-vue-next'
import TechMarquee from '@/components/ui/TechMarquee.vue'
import Threads from '@/components/ui/background/Threads.vue'
import { getServices } from '@/api/services'
import type { Service } from '@/types/service'

const services = ref<Service[]>([])

onMounted(async () => {
  try {
    services.value = await getServices()
  } catch (error) {
    console.error('Failed to fetch services:', error)
  }
})

// Helper to get dynamic icon
const getIcon = (iconName: string | null) => {
  if (!iconName) return LucideIcons.Box
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (LucideIcons as any)[iconName] || LucideIcons.Box
}

// Dynamic column span for bento grid based on total services count
const getCardColSpan = (index: number): string => {
  const total = services.value.length

  // Pattern for 3 services: [1, 2, 3]
  if (total === 3) {
    if (index === 1) return 'md:col-span-2'
    if (index === 2) return 'md:col-span-3'
    return ''
  }

  // Pattern for 4 services: [1, 2, 2, 1]
  if (total === 4) {
    if (index === 1 || index === 2) return 'md:col-span-2'
    return ''
  }

  // Pattern for 5 services: [1, 1, 1, 2, 1]
  if (total === 5) {
    if (index === 3) return 'md:col-span-2'
    return ''
  }

  // Pattern for 6 services: [1, 1, 1, 1, 2, 3]
  if (total === 6) {
    if (index === 4) return 'md:col-span-2'
    if (index === 5) return 'md:col-span-3'
    return ''
  }

  // Pattern for 7+ services: first 3 = 1 col, then alternating, last = full
  if (total >= 7) {
    if (index < 3) return '' // First 3 are 1 col each
    if (index === total - 1) return 'md:col-span-3' // Last is full width

    // For remaining cards (index 3 to total-2), alternate [1, 2] pattern
    const posInRemaining = index - 3
    if (posInRemaining % 3 === 1) return 'md:col-span-2' // Every 2nd in group of 3 is 2 cols
    return ''
  }

  // Default: 1 or 2 services, all 1 col
  return ''
}

// Process Steps
const processes = [
  {
    title: 'Discovery',
    desc: 'Kami mendalami bisnis Anda, memahami tantangan, dan menetapkan tujuan strategis.',
    icon: 'Search',
  },
  {
    title: 'Design',
    desc: 'Merancang arsitektur sistem dan antarmuka yang estetis, fungsional, dan intuitif.',
    icon: 'PenTool',
  },
  {
    title: 'Develop',
    desc: 'Eksekusi kode presisi tinggi dengan standar industri terbaru untuk performa maksimal.',
    icon: 'Code2',
  },
  {
    title: 'Deploy',
    desc: 'Peluncuran mulus ke publik dengan monitoring ketat untuk memastikan stabilitas.',
    icon: 'Rocket',
  },
]
</script>

<template>
  <main class="relative bg-background text-foreground min-h-screen">
    <!-- 1. HERO SECTION -->
    <section class="relative h-screen flex flex-col items-center justify-center overflow-hidden">
      <!-- Background Elements -->
      <div class="absolute inset-0 z-0 opacity-40">
        <Threads :color="[1, 1, 1]" :amplitude="1" :scale="0.8" />
      </div>
      <div
        class="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background z-10"
      ></div>

      <!-- Content -->
      <div class="relative z-20 text-center px-4 max-w-5xl mx-auto space-y-8">
        <Motion
          :initial="{ opacity: 0, y: 30 }"
          :animate="{ opacity: 1, y: 0 }"
          :transition="{ duration: 0.8, ease: 'easeOut' }"
        >
          <h1
            class="text-6xl md:text-8xl lg:text-9xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white to-neutral-500 uppercase"
          >
            Expertise
          </h1>
        </Motion>

        <Motion
          :initial="{ opacity: 0, y: 30 }"
          :animate="{ opacity: 1, y: 0 }"
          :transition="{ duration: 0.8, delay: 0.2, ease: 'easeOut' }"
        >
          <p
            class="text-xl md:text-2xl text-muted-foreground font-light max-w-2xl mx-auto leading-relaxed"
          >
            Membangun infrastruktur digital masa depan dengan
            <span class="text-primary font-medium">presisi</span> dan
            <span class="text-secondary font-medium">estetika</span>.
          </p>
        </Motion>
      </div>

      <!-- Scroll Indicator -->
      <Motion
        class="absolute bottom-10 z-20 flex flex-col items-center gap-2 text-muted-foreground/50 text-xs uppercase tracking-[0.2em]"
        :animate="{ y: [0, 10, 0] }"
        :transition="{ duration: 2, repeat: Infinity }"
      >
        <span>Explore</span>
        <div class="w-px h-12 bg-gradient-to-b from-foreground/50 to-transparent"></div>
      </Motion>
    </section>

    <!-- 2. TECH MARQUEE -->
    <TechMarquee />

    <!-- 3. PROCESS TIMELINE -->
    <section class="py-24 md:py-32 px-4 relative z-10 overflow-hidden">
      <div class="max-w-5xl mx-auto relative">
        <div class="mb-16 md:mb-24 text-center">
          <h2 class="text-sm font-bold text-primary tracking-[0.5em] uppercase mb-4">
            Bagaimana Kami Bekerja
          </h2>
          <h3 class="text-3xl md:text-5xl font-bold">The Sarando Way</h3>
        </div>

        <div class="relative flex flex-col gap-12 md:gap-24">
          <Motion
            v-for="(step, index) in processes"
            :key="index"
            class="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-0"
            :initial="{ opacity: 0, y: 30 }"
            :whileInView="{ opacity: 1, y: 0 }"
            :transition="{ delay: index * 0.1, duration: 0.6 }"
            viewport="{ once: true, margin: '-10% 0px -10% 0px' }"
          >
            <!-- Connector Line to Next Item (Except Last) -->
            <!--
                 Logic:
                 - Mobile (default): Left-aligned line (left-8).
                 - Desktop (md): Center-aligned line (left-1/2).
                 - Height: Spans from center of current node to center of next node.
                   Since we have gaps, we approximate the height. gap-12 = 3rem, gap-24 = 6rem.
                   We make it slightly longer to ensure overlap.
               -->
            <div
              v-if="index !== processes.length - 1"
              class="absolute left-8 md:left-1/2 top-12 w-px bg-white/10 -translate-x-1/2 md:translate-x-0 z-0 h-[calc(100%+48px)] md:h-[calc(100%+96px)]"
            >
              <!-- Progress Fill for Segment -->
              <Motion
                class="w-full bg-primary origin-top"
                style="height: 100%"
                :initial="{ scaleY: 0 }"
                :whileInView="{ scaleY: 1 }"
                :transition="{ duration: 1.5, ease: 'easeInOut' }"
                viewport="{ once: true, amount: 0.5 }"
              />
            </div>

            <!-- Left Side -->
            <div class="order-2 md:order-1 flex items-center md:justify-end md:pr-12 pl-24 md:pl-0">
              <!-- Desktop Even Text -->
              <div v-if="index % 2 === 0" class="hidden md:block text-right">
                <h4 class="text-2xl font-bold mb-2 text-foreground">{{ step.title }}</h4>
                <p class="text-muted-foreground text-base leading-relaxed">{{ step.desc }}</p>
              </div>

              <!-- Mobile Text: Always rendered here on mobile -->
              <div class="md:hidden text-left">
                <h4 class="text-2xl font-bold mb-2 text-foreground">{{ step.title }}</h4>
                <p class="text-muted-foreground text-base leading-relaxed">{{ step.desc }}</p>
              </div>
            </div>

            <!-- Center Node (Absolute: Left on Mobile, Center on Desktop) -->
            <div
              class="absolute left-8 md:left-1/2 top-0 -translate-x-1/2 w-12 h-12 flex items-center justify-center z-20"
            >
              <div
                class="w-full h-full bg-background rounded-full border border-white/10 flex items-center justify-center shadow-[0_0_20px_rgba(0,0,0,0.5)] group hover:border-primary transition-colors duration-300 relative z-30"
              >
                <component
                  :is="(LucideIcons as any)[step.icon]"
                  class="w-5 h-5 text-primary group-hover:scale-110 transition-transform"
                />
              </div>
            </div>

            <!-- Right Side -->
            <div class="order-2 md:order-2 flex items-center md:pl-12 pl-24 md:pl-0">
              <!-- Desktop Odd Text -->
              <div v-if="index % 2 !== 0" class="hidden md:block text-left">
                <h4 class="text-2xl font-bold mb-2 text-foreground">{{ step.title }}</h4>
                <p class="text-muted-foreground text-base leading-relaxed">{{ step.desc }}</p>
              </div>
            </div>
          </Motion>
        </div>
      </div>
    </section>

    <!-- 4. SERVICES BENTO GRID -->
    <section class="py-24 md:py-32 px-4 bg-secondary/5 relative overflow-hidden">
      <!-- Decor -->
      <div
        class="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none"
      ></div>

      <div class="max-w-7xl mx-auto relative z-10">
        <div class="mb-16 md:mb-24 text-center md:text-left">
          <h2 class="text-sm font-bold text-primary tracking-[0.5em] uppercase mb-4">
            Kapabilitas Kami
          </h2>
          <h3 class="text-3xl md:text-5xl font-bold">Solusi Tanpa Batas</h3>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px]">
          <Motion
            v-for="(service, i) in services"
            :key="service.id"
            :class="[
              'group relative rounded-3xl overflow-hidden border border-white/5 bg-card/20 backdrop-blur-md transition-all duration-500 hover:border-primary/30 hover:shadow-[0_0_30px_rgba(49,105,78,0.1)]',
              getCardColSpan(i),
            ]"
            :initial="{ opacity: 0, scale: 0.95 }"
            :whileInView="{ opacity: 1, scale: 1 }"
            :transition="{ delay: i * 0.05, duration: 0.5 }"
            viewport="{ once: true }"
          >
            <!-- Background Image -->
            <img
              v-if="service.image_path"
              :src="service.image_path"
              :alt="service.name"
              class="absolute inset-0 w-full h-full object-cover z-0 opacity-40 group-hover:opacity-60 transition-all duration-700 group-hover:scale-110"
            />

            <!-- Dark Overlay for Readability -->
            <div
              class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-black/30 z-10"
            ></div>

            <!-- Content -->
            <div class="absolute inset-0 p-8 flex flex-col justify-between z-20">
              <div class="space-y-4">
                <div
                  class="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-500 group-hover:bg-primary/30"
                >
                  <component :is="getIcon(service.icon)" class="w-6 h-6" />
                </div>
                <h4
                  class="text-2xl md:text-3xl font-bold text-white group-hover:text-primary transition-colors"
                >
                  {{ service.name }}
                </h4>
                <p
                  class="text-white/70 text-sm md:text-base line-clamp-3 group-hover:text-white/90 transition-colors"
                >
                  {{ service.description }}
                </p>
              </div>

              <div
                class="flex items-center gap-2 text-sm font-bold text-secondary opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300"
              >
                <span>Selengkapnya</span>
                <ArrowRight class="w-4 h-4" />
              </div>
            </div>

            <!-- Hover Gradient Accent -->
            <div
              class="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-15"
            ></div>
          </Motion>
        </div>
      </div>
    </section>

    <!-- 5. CTA -->
    <section class="py-24 md:py-32 px-4 text-center">
      <div class="max-w-3xl mx-auto space-y-8">
        <h2 class="text-4xl md:text-6xl font-bold tracking-tighter">
          Mulai Transformasi Digital Anda
        </h2>
        <p class="text-xl text-muted-foreground">Diskusikan kebutuhan Anda dengan tim ahli kami.</p>

        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <RouterLink
            to="/kontak"
            class="inline-flex h-14 items-center justify-center rounded-full bg-primary px-8 text-lg font-medium text-white shadow transition-colors hover:bg-primary/90"
          >
            Hubungi Kami
          </RouterLink>
          <RouterLink
            to="/proyek"
            class="inline-flex h-14 items-center justify-center rounded-full border border-input bg-transparent px-8 text-lg font-medium text-foreground shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            Lihat Portofolio
          </RouterLink>
        </div>
      </div>
    </section>
  </main>
</template>
