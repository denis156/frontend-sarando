<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { Motion } from 'motion-v'
import { RouterLink } from 'vue-router'
import * as LucideIcons from 'lucide-vue-next'
import { ArrowRight, Mail } from 'lucide-vue-next'
import TechMarquee from '@/components/ui/TechMarquee.vue'
import { Timeline } from '@/components/ui/timeline'
import Threads from '@/components/ui/background/Threads.vue'
import { getServices } from '@/api/services'
import type { Service } from '@/types/service'
import { useScrollAnimation } from '@/composables/useScrollAnimation'

const services = ref<Service[]>([])

// Scroll-linked animations
const heroTitle = useScrollAnimation('fadeUp')
const heroDesc = useScrollAnimation('fadeUp')
const processHeader = useScrollAnimation('fadeLeft')
const servicesHeader = useScrollAnimation('fadeRight')
const cta = useScrollAnimation('scaleUp')

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
    title: 'Penelusuran',
    desc: 'Kami memulainya dengan duduk bersama, mendengarkan setiap keluhan dan aspirasi Anda layaknya keluarga. Kami menggali akar masalah sistem Anda, bukan sekadar permukaannya.',
    icon: 'Search',
  },
  {
    title: 'Perancangan',
    desc: 'Solusi lahir dari pemahaman mendalam. Kami merancang arsitektur yang menjawab titik lemah sistem lama Anda dengan pendekatan yang manusiawi, fungsional, dan estetik.',
    icon: 'PenTool',
  },
  {
    title: 'Pembangunan',
    desc: 'Setiap baris kode kami tulis dengan niat untuk menyempurnakan. Kami membangun sistem yang tidak hanya canggih, tapi juga menutup celah kekurangan masa lalu untuk masa depan yang lebih baik.',
    icon: 'Code2',
  },
  {
    title: 'Peluncuran',
    desc: 'Karya ini kami persembahkan untuk Anda. Melalui pengujian ketat, kami pastikan sistem berjalan mulus, membawa ketenangan pikiran dan lembaran baru bagi usaha Anda.',
    icon: 'Rocket',
  },
]

const timelineData = computed(() =>
  processes.map((step, index) => ({
    id: `step-${index}`,
    label: step.title,
    desc: step.desc,
    icon: step.icon,
  })),
)
</script>

<template>
  <main class="relative bg-background text-foreground min-h-dvh">
    <!-- 1. HERO SECTION -->
    <section class="relative h-dvh flex flex-col items-center justify-center overflow-hidden">
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
          :ref="(el) => (heroTitle.targetRef.value = el as HTMLElement)"
          :style="{
            opacity: heroTitle.opacity,
            y: heroTitle.y,
            filter: `blur(${heroTitle.blur}px)`,
          }"
        >
          <h1
            class="text-6xl md:text-8xl lg:text-9xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white to-neutral-500 uppercase"
          >
            Dedikasi
          </h1>
        </Motion>

        <Motion
          :ref="(el) => (heroDesc.targetRef.value = el as HTMLElement)"
          :style="{
            opacity: heroDesc.opacity,
            y: heroDesc.y,
            filter: `blur(${heroDesc.blur}px)`,
          }"
        >
          <p
            class="text-xl md:text-2xl text-muted-foreground font-light max-w-2xl mx-auto leading-relaxed"
          >
            Membangun ekosistem digital dengan sentuhan
            <span class="text-primary font-medium">hati</span> dan
            <span class="text-secondary font-medium">keunggulan teknologi</span>.
          </p>
        </Motion>
      </div>

      <!-- Scroll Indicator -->
      <Motion
        class="absolute bottom-10 z-20 flex flex-col items-center gap-2 text-muted-foreground/50 text-xs uppercase tracking-[0.2em]"
        :animate="{ y: [0, 10, 0] }"
        :transition="{ duration: 2, repeat: Infinity }"
      >
        <span>Jelajahi</span>
        <div class="w-px h-12 bg-gradient-to-b from-foreground/50 to-transparent"></div>
      </Motion>
    </section>

    <!-- 2. TECH MARQUEE -->
    <TechMarquee />

    <!-- 3. PROCESS TIMELINE -->
    <div class="relative z-0 py-24 md:py-32">
      <!-- Custom Header -->
      <div class="max-w-5xl mx-auto relative px-4 text-left mb-12">
        <Motion
          :ref="(el) => (processHeader.targetRef.value = el as HTMLElement)"
          :style="{
            opacity: processHeader.opacity,
            x: processHeader.x,
            filter: `blur(${processHeader.blur}px)`,
          }"
        >
          <h2 class="text-sm font-bold text-primary tracking-[0.5em] uppercase mb-4">
            Proses & Metode
          </h2>
          <h3 class="text-3xl md:text-5xl font-bold mb-6">Filosofi Kerja Sarando</h3>
          <p class="text-muted-foreground text-lg max-w-2xl">
            Nilai-nilai luhur yang kami pegang teguh dalam setiap baris kode yang kami tulis,
            memastikan kualitas terbaik untuk Anda.
          </p>
        </Motion>
      </div>

      <Timeline :items="timelineData">
        <template v-for="item in timelineData" :key="item.id" #[item.id]>
          <div class="relative w-full pr-4 pl-20 md:pl-4">
            <!-- Mobile Title (Hidden on desktop because label is on the left) -->
            <h3 class="mb-4 block text-left text-2xl font-bold text-foreground md:hidden">
              {{ item.label }}
            </h3>

            <div class="flex flex-col gap-6">
              <!-- Description -->
              <p class="text-base md:text-lg font-normal text-muted-foreground leading-relaxed">
                {{ item.desc }}
              </p>
            </div>
          </div>
        </template>
      </Timeline>
    </div>

    <!-- 4. SERVICES BENTO GRID -->
    <section class="py-24 md:py-32 px-4 bg-secondary/5 relative overflow-hidden">
      <!-- Decor -->
      <div
        class="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none"
      ></div>

      <div class="max-w-7xl mx-auto relative z-10">
        <div class="mb-16 md:mb-24 text-right flex flex-col items-end">
          <Motion
            :ref="(el) => (servicesHeader.targetRef.value = el as HTMLElement)"
            class="text-right flex flex-col items-end"
            :style="{
              opacity: servicesHeader.opacity,
              x: servicesHeader.x,
              filter: `blur(${servicesHeader.blur}px)`,
            }"
          >
            <h2 class="text-sm font-bold text-primary tracking-[0.5em] uppercase mb-4">
              Kapabilitas Kami
            </h2>
            <h3 class="text-3xl md:text-5xl font-bold">Solusi Tanpa Batas</h3>
            <p class="mt-6 text-muted-foreground text-lg max-w-2xl leading-relaxed">
              Dari pengembangan website hingga sistem terintegrasi yang kompleks, kami meramu
              teknologi terkini untuk mewujudkan visi digital Anda. Tak ada batasan, hanya
              kemungkinan.
            </p>
          </Motion>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px]">
          <div
            v-for="(service, i) in services"
            :key="service.id"
            :class="[
              'group relative rounded-3xl overflow-hidden border border-white/5 bg-card/20 backdrop-blur-md transition-all duration-500 hover:border-primary/30 hover:shadow-[0_0_30px_rgba(49,105,78,0.1)]',
              getCardColSpan(i),
            ]"
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
          </div>
        </div>
      </div>
    </section>

    <!-- 5. CTA -->
    <section class="py-24 md:py-32 px-4 text-center">
      <Motion
        :ref="(el) => (cta.targetRef.value = el as HTMLElement)"
        class="max-w-3xl mx-auto space-y-8"
        :style="{
          opacity: cta.opacity,
          scale: cta.scale,
          y: cta.y,
          filter: `blur(${cta.blur}px)`,
        }"
      >
        <h2 class="text-4xl md:text-6xl font-bold tracking-tighter">Mari Wujudkan Ide Bersama</h2>
        <p class="text-xl text-muted-foreground">Diskusikan kebutuhan Anda dengan tim ahli kami.</p>

        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <RouterLink
            to="/kontak"
            class="inline-flex h-14 items-center justify-center gap-2 rounded-full bg-primary px-8 text-lg font-medium text-white shadow transition-colors hover:bg-primary/90"
          >
            <Mail class="w-5 h-5" />
            Hubungi Kami
          </RouterLink>
          <RouterLink
            to="/proyek"
            class="inline-flex h-14 items-center justify-center rounded-full border border-input bg-transparent px-8 text-lg font-medium text-foreground shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            Lihat Portofolio
          </RouterLink>
        </div>
      </Motion>
    </section>
  </main>
</template>
