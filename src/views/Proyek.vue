<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Motion } from 'motion-v'
import { RouterLink } from 'vue-router'
import { ArrowUpRight, Mail } from 'lucide-vue-next'
import { useSeoMeta } from '@/composables/useSeoMeta'
import { useScrollAnimation } from '@/composables/useScrollAnimation'
import Threads from '@/components/ui/background/Threads.vue'
import { getProjects } from '@/api/projects'
import type { Project, ProjectImage } from '@/types/project'

// SEO Meta
useSeoMeta({
  title: 'Proyek Kami',
  description:
    'Koleksi karya dan portofolio terbaik dari Sarando. Solusi digital yang telah kami bangun untuk berbagai klien di Indonesia.',
  url: 'https://sarando.site/proyek',
})

// State
const projects = ref<Project[]>([])
const isLoading = ref(true)
const error = ref<string | null>(null)

// Fetch projects from API
onMounted(async () => {
  try {
    projects.value = await getProjects()
  } catch (err) {
    console.error('Failed to fetch projects:', err)
    error.value = 'Gagal memuat data proyek'
  } finally {
    isLoading.value = false
  }
})

// Helper: Get thumbnail image from project images
const getThumbnail = (images?: ProjectImage[]): string | null => {
  if (!images || images.length === 0) return null
  const thumbnail = images.find((img) => img.is_thumbnail)
  return thumbnail?.image_path || images[0]?.image_path || null
}

// Scroll Animations
const heroTitle = useScrollAnimation('fadeUp')
const heroDesc = useScrollAnimation('fadeUp', { distance: 30 })
const gridAnim = useScrollAnimation('fadeUp', { distance: 50 })
const ctaAnim = useScrollAnimation('scaleUp')
</script>

<template>
  <main class="relative bg-background text-foreground min-h-dvh">
    <!-- 1. HERO SECTION -->
    <section class="relative h-dvh flex flex-col items-center justify-center overflow-hidden">
      <!-- Background Elements -->
      <div class="fixed inset-0 z-0 pointer-events-none">
        <div class="absolute inset-0 opacity-20">
          <Threads :color="[1, 1, 1]" :amplitude="1.5" />
        </div>
        <div
          class="absolute inset-0 bg-linear-to-b from-background via-transparent to-background"
        ></div>
      </div>

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
            class="text-6xl md:text-8xl lg:text-9xl font-bold tracking-tighter text-transparent bg-clip-text bg-linear-to-br from-white to-neutral-500 uppercase"
          >
            Karya Kami
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
            Jejak digital yang kami ukir dengan
            <span class="text-primary font-medium">dedikasi</span>. Perpaduan estetika, fungsi, dan
            teknologi untuk solusi masa depan.
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
        <div class="w-px h-12 bg-linear-to-b from-foreground/50 to-transparent"></div>
      </Motion>
    </section>

    <!-- 2. PROJECTS GRID -->
    <section class="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
      <!-- Loading State -->
      <div v-if="isLoading" class="flex justify-center items-center min-h-[400px]">
        <div class="flex flex-col items-center gap-4">
          <div
            class="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin"
          ></div>
          <span class="text-muted-foreground">Memuat proyek...</span>
        </div>
      </div>

      <!-- Error State -->
      <div
        v-else-if="error"
        class="flex justify-center items-center min-h-[400px] text-center text-muted-foreground"
      >
        <p>{{ error }}</p>
      </div>

      <!-- Empty State -->
      <div
        v-else-if="projects.length === 0"
        class="flex justify-center items-center min-h-[400px] text-center text-muted-foreground"
      >
        <p>Belum ada proyek yang tersedia.</p>
      </div>

      <!-- Projects Grid -->
      <Motion
        v-else
        :ref="(el) => (gridAnim.targetRef.value = el as HTMLElement)"
        :style="{
          opacity: gridAnim.opacity,
          y: gridAnim.y,
        }"
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
      >
        <Motion
          v-for="project in projects"
          :key="project.id"
          class="group relative bg-card/40 border border-border/50 rounded-2xl overflow-hidden hover:border-primary/50 transition-colors duration-500 backdrop-blur-xs flex flex-col h-full"
        >
          <!-- Project Image -->
          <div class="aspect-video w-full overflow-hidden bg-muted/20 relative">
            <template v-if="getThumbnail(project.images)">
              <img
                :src="getThumbnail(project.images)!"
                :alt="project.title"
                class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />
              <div
                class="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors duration-500"
              ></div>
            </template>
            <div
              v-else
              class="w-full h-full flex items-center justify-center text-muted-foreground"
            >
              <span class="text-sm">No Image Available</span>
            </div>

            <!-- Overlay Button (Desktop) -->
            <div
              class="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            >
              <RouterLink
                :to="`/proyek/${project.slug}`"
                class="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white border border-white/20 hover:bg-white/20 transition-colors"
                aria-label="Lihat Detail Proyek"
              >
                <ArrowUpRight class="w-5 h-5" />
              </RouterLink>
            </div>
          </div>

          <!-- Content -->
          <div class="p-6 flex flex-col flex-1">
            <div class="mb-4">
              <h3
                class="text-xl font-bold text-white mb-2 group-hover:text-primary transition-colors duration-300 line-clamp-1"
              >
                {{ project.title }}
              </h3>
              <!-- Tech Stack Tags -->
              <div class="flex flex-wrap gap-2 mb-3">
                <span
                  v-for="tech in project.technologies?.slice(0, 3)"
                  :key="tech.id"
                  class="border border-white/20 text-white/70 backdrop-blur-sm px-2 py-1 rounded-md uppercase tracking-wider text-[10px] bg-white/5"
                >
                  {{ tech.name }}
                </span>
                <span
                  v-if="project.technologies && project.technologies.length > 3"
                  class="text-[10px] px-2 py-1 text-muted-foreground"
                >
                  +{{ project.technologies.length - 3 }}
                </span>
              </div>
              <p class="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                {{ project.description }}
              </p>
            </div>

            <div class="mt-auto pt-4 border-t border-white/5 flex items-center justify-between">
              <span class="text-xs text-muted-foreground/60 font-mono">
                {{ project.started_at ? new Date(project.started_at).getFullYear() : '2025' }}
              </span>
              <RouterLink
                :to="`/proyek/${project.slug}`"
                class="text-xs text-primary/80 font-medium group-hover:underline cursor-pointer flex items-center gap-1"
              >
                Lihat Detail <ArrowUpRight class="w-3 h-3" />
              </RouterLink>
            </div>
          </div>

          <!-- Full Card Link Overlay -->
          <RouterLink
            :to="`/proyek/${project.slug}`"
            class="absolute inset-0 z-10"
            aria-label="Lihat Detail Proyek"
          ></RouterLink>
        </Motion>
      </Motion>
      <div class="mt-16 text-center text-muted-foreground/60 italic max-w-2xl mx-auto px-4">
        Masih banyak lagi proyek yang telah kami kerjakan namun tidak dapat kami tampilkan karena
        <span class="text-secondary">Non-Disclosure Agreement</span> (Perjanjian Kerahasiaan) dengan
        klien kami.
      </div>
    </section>

    <!-- 3. CTA SECTION -->
    <section class="py-24 md:py-32 px-4 text-center border-t border-white/5 bg-secondary/5">
      <Motion
        :ref="(el) => (ctaAnim.targetRef.value = el as HTMLElement)"
        :style="{
          opacity: ctaAnim.opacity,
          scale: ctaAnim.scale,
          y: ctaAnim.y,
          filter: `blur(${ctaAnim.blur}px)`,
        }"
        class="max-w-3xl mx-auto space-y-8"
      >
        <h2 class="text-4xl md:text-6xl font-bold tracking-tighter">Punya Proyek Impian?</h2>
        <p class="text-xl text-muted-foreground">
          Kami siap membantu mewujudkan visi digital Anda dengan kualitas terbaik.
        </p>

        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <RouterLink
            to="/kontak"
            class="inline-flex h-14 items-center justify-center gap-2 rounded-full bg-primary px-8 text-lg font-medium text-white shadow transition-colors hover:bg-primary/90"
          >
            <Mail class="w-5 h-5" />
            Mulai Konsultasi
          </RouterLink>
          <RouterLink
            to="/layanan"
            class="inline-flex h-14 items-center justify-center rounded-full border border-input bg-transparent px-8 text-lg font-medium text-foreground shadow-sm transition-colors hover:bg-secondary hover:text-secondary-foreground"
          >
            Lihat Layanan
          </RouterLink>
        </div>
      </Motion>
    </section>
  </main>
</template>
