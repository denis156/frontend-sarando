<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import { Motion } from 'motion-v'
import {
  ArrowLeft,
  Calendar,
  Code2,
  Building2,
  AlertCircle,
  ArrowUpRight,
  Mail,
} from 'lucide-vue-next'
import MarkdownIt from 'markdown-it'
import Threads from '@/components/ui/background/Threads.vue'
import BorderBeam from '@/components/ui/border-beam/BorderBeam.vue'
import ExpandableGallery from '@/components/ui/expandable-gallery/ExpandableGallery.vue'
import { getProjectBySlug } from '@/api/projects'
import type { Project } from '@/types/project'
import { useScrollAnimation } from '@/composables/useScrollAnimation'
import { useSeoMeta } from '@/composables/useSeoMeta'

const route = useRoute()
const router = useRouter()
const md = new MarkdownIt({ html: true, breaks: true })

// Data
const project = ref<Project | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)

// Computed
const hasLink = computed(() => !!project.value?.project_url)
const hasRepo = computed(() => !!project.value?.repository_url)
const mainImage = computed(() => {
  if (!project.value?.images || project.value.images.length === 0) return null
  return project.value.images.find((img) => img.is_thumbnail) || project.value.images[0]
})
const galleryImages = computed(() => {
  if (!project.value?.images) return []
  return project.value.images.filter((img) => img.id !== mainImage.value?.id)
})
const renderedContent = computed(() => {
  if (!project.value?.content) return ''
  return md.render(project.value.content)
})

// Scroll Animations
const heroText = useScrollAnimation('fadeUp')
const heroImage = useScrollAnimation('scaleUp')
const ctaAnim = useScrollAnimation('scaleUp')

// SEO
const seoTitle = computed(() => project.value?.title || 'Detail Proyek')
const seoDescription = computed(() => project.value?.description || null)
const seoImage = computed(() => mainImage.value?.image_path || null)
const seoUrl = computed(() => `https://sarando.site/proyek/${route.params.slug}`)

useSeoMeta({
  title: seoTitle,
  description: seoDescription,
  image: seoImage,
  url: seoUrl,
  type: 'article',
})

const fetchProject = async () => {
  loading.value = true
  error.value = null
  const slug = route.params.slug as string

  try {
    project.value = await getProjectBySlug(slug)
  } catch (err) {
    console.error('Failed to fetch project:', err)
    project.value = null
    error.value = 'Gagal memuat data proyek'
  } finally {
    loading.value = false
  }
}

onMounted(fetchProject)
watch(() => route.params.slug, fetchProject)

const goBack = () => router.push('/proyek')

const formatDate = (dateStr: string | null) => {
  if (!dateStr) return '-'
  const date = new Date(dateStr)
  return new Intl.DateTimeFormat('id-ID', { month: 'long', year: 'numeric' }).format(date)
}
</script>

<template>
  <main class="relative text-foreground min-h-dvh pt-24 pb-20">
    <!-- Background Decor -->
    <div class="fixed inset-0 z-[-1] pointer-events-none">
      <div class="absolute inset-0 opacity-50">
        <Threads :color="[1, 1, 1]" :amplitude="1" :scale="0.8" />
      </div>
      <div
        class="absolute inset-0 bg-linear-to-b from-background via-background/80 to-background/95"
      ></div>
    </div>

    <!-- Content -->
    <div class="relative z-10 container mx-auto px-4 max-w-6xl space-y-12">
      <!-- Loading State -->
      <div v-if="loading" class="h-[60vh] flex justify-center items-center">
        <div class="flex flex-col items-center gap-4">
          <div
            class="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin"
          ></div>
          <span class="text-muted-foreground">Memuat proyek...</span>
        </div>
      </div>

      <!-- Not Found / Error -->
      <div
        v-else-if="!project || error"
        class="h-[60vh] flex flex-col items-center justify-center space-y-6 text-center"
      >
        <div
          class="w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center text-destructive"
        >
          <AlertCircle class="w-10 h-10" />
        </div>
        <h2 class="text-2xl font-bold">Proyek Tidak Ditemukan</h2>
        <p class="text-muted-foreground">
          {{ error || 'Proyek yang Anda cari tidak tersedia atau telah dihapus.' }}
        </p>
        <button
          @click="goBack"
          class="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-white/10 hover:bg-white/5 transition-colors"
        >
          <ArrowLeft class="w-4 h-4" />
          Lihat Karya Lain
        </button>
      </div>

      <div v-else class="space-y-16">
        <!-- Hero Section -->
        <header class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <div class="space-y-8 order-2 lg:order-1">
            <Motion
              :ref="(el) => (heroText.targetRef.value = el as HTMLElement)"
              :style="{
                opacity: heroText.opacity,
                y: heroText.y,
                filter: `blur(${heroText.blur}px)`,
              }"
              class="space-y-6"
            >
              <h1
                class="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter text-transparent bg-clip-text bg-linear-to-br from-white via-white to-white/50 leading-tight"
              >
                {{ project.title }}
              </h1>

              <p class="text-lg text-muted-foreground leading-relaxed">
                {{ project.description }}
              </p>

              <!-- CTAs -->
              <div class="flex flex-wrap gap-4 pt-4">
                <a
                  v-if="hasLink"
                  :href="project.project_url!"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-primary px-8 text-base font-medium text-white shadow transition-transform hover:scale-105 hover:bg-primary/90"
                >
                  <span>Kunjungi Website</span>
                  <ArrowUpRight class="w-4 h-4" />
                </a>
                <div
                  v-else
                  class="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-white/5 border border-white/10 px-8 text-base font-medium text-muted-foreground cursor-not-allowed opacity-70"
                >
                  <AlertCircle class="w-4 h-4" />
                  <span>Proyek Privat</span>
                </div>
                <a
                  v-if="hasRepo"
                  :href="project.repository_url!"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-8 text-base font-medium text-foreground transition-colors hover:bg-white/10"
                >
                  <Code2 class="w-4 h-4" />
                  <span>Repository</span>
                </a>
              </div>
            </Motion>

            <!-- Sidebar Info for Mobile (Hidden on Desktop, shown here for structure flow) -> Actually better in a sidebar on desktop. Let's do a sidebar layout below header or mixed.
                 Design choice: Let's put detailed metrics in a grid below on mobile, or side on desktop.
                 Let's stick to the 2-col header layout. -->

            <div class="grid grid-cols-2 gap-6 pt-8 border-t border-white/5">
              <div class="space-y-1">
                <div class="flex items-center gap-2 text-muted-foreground text-sm mb-1">
                  <Building2 class="w-4 h-4" /> Client
                </div>
                <p class="font-medium text-white">{{ project.client?.name || '-' }}</p>
              </div>
              <div class="space-y-1">
                <div class="flex items-center gap-2 text-muted-foreground text-sm mb-1">
                  <Calendar class="w-4 h-4" /> Release
                </div>
                <p class="font-medium text-white">{{ formatDate(project.completed_at) }}</p>
              </div>
            </div>
          </div>

          <!-- Right: Hero Image -->
          <Motion
            :ref="(el) => (heroImage.targetRef.value = el as HTMLElement)"
            :style="{
              opacity: heroImage.opacity,
              scale: heroImage.scale,
              filter: `blur(${heroImage.blur}px)`,
            }"
            class="order-1 lg:order-2 relative"
          >
            <div
              class="aspect-video w-full rounded-2xl overflow-hidden border border-white/10 bg-card/50 backdrop-blur-sm relative group"
            >
              <img
                v-if="mainImage"
                :src="mainImage.image_path"
                :alt="mainImage.title || project.title"
                class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div
                v-else
                class="w-full h-full flex items-center justify-center text-muted-foreground bg-secondary/5"
              >
                <span class="text-sm">No Preview Available</span>
              </div>

              <BorderBeam
                :size="300"
                :duration="12"
                :border-width="2"
                color-from="var(--color-primary)"
                color-to="var(--color-secondary)"
              />
            </div>
          </Motion>
        </header>

        <!-- Tech Stack Marquee -->
        <div
          v-if="project.technologies && project.technologies.length > 0"
          class="w-screen relative left-1/2 -translate-x-1/2 py-12 border-y border-white/5 bg-background/50 backdrop-blur-sm overflow-hidden mb-12"
        >
          <!-- Gradient Masks -->
          <div
            class="absolute inset-y-0 left-0 w-20 md:w-40 z-10 bg-linear-to-r from-background to-transparent pointer-events-none"
          ></div>
          <div
            class="absolute inset-y-0 right-0 w-20 md:w-40 z-10 bg-linear-to-l from-background to-transparent pointer-events-none"
          ></div>

          <div class="flex">
            <Motion
              class="flex gap-12 md:gap-20 items-center whitespace-nowrap"
              :animate="{ x: ['0%', '-5%'] }"
              :transition="{
                duration: project.technologies.length * 2,
                ease: 'linear',
                repeat: Infinity,
                repeatType: 'loop',
              }"
            >
              <div
                v-for="(tech, i) in Array(20).fill(project.technologies).flat()"
                :key="i"
                class="text-xl md:text-3xl font-bold uppercase tracking-widest text-white/20 hover:text-white/40 transition-colors cursor-default select-none flex items-center gap-4"
              >
                {{ tech.name }}
              </div>
            </Motion>
          </div>
        </div>

        <!-- Content Details -->
        <div class="space-y-16">
          <div class="max-w-4xl mx-auto">
            <!-- Markdown Content -->
            <div
              v-if="project.content"
              class="prose prose-invert prose-lg max-w-none"
              v-html="renderedContent"
            ></div>

            <!-- Placeholder if no content (Optional, can be removed if not needed) -->
            <div
              v-else
              class="text-center italic text-muted-foreground/50 border-t border-white/5 pt-8"
            >
              <p>Detail konten proyek belum tersedia.</p>
            </div>
          </div>

          <!-- Expandable Gallery Section -->
          <div v-if="galleryImages.length > 0" class="space-y-8">
            <div class="text-center space-y-2">
              <h3 class="font-bold text-white text-2xl">Galeri Proyek</h3>
              <p class="text-muted-foreground">Cuplikan antarmuka dan fitur unggulan</p>
            </div>

            <div class="px-4 md:px-0">
              <ExpandableGallery :images="galleryImages.map((img) => img.image_path)" />
            </div>
          </div>
        </div>

        <!-- 3. SECONDARY CTA -->
        <section class="py-24 md:py-32 text-center border-t border-white/5">
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
            <h2 class="text-4xl md:text-6xl font-bold tracking-tighter">
              Tertarik membuat proyek serupa?
            </h2>
            <p class="text-xl text-muted-foreground max-w-2xl mx-auto">
              Mari diskusikan ide Anda dan wujudkan solusi digital yang unik dan berdampak.
            </p>
            <div class="flex flex-col sm:flex-row gap-4 justify-center">
              <RouterLink
                to="/kontak"
                class="inline-flex h-14 items-center justify-center gap-2 rounded-full bg-primary px-8 text-lg font-medium text-white shadow transition-colors hover:bg-primary/90"
              >
                <Mail class="w-5 h-5" />
                <span>Hubungi Kami</span>
              </RouterLink>

              <button
                @click="goBack"
                class="inline-flex h-14 items-center justify-center gap-2 rounded-full border border-input bg-transparent px-8 text-lg font-medium text-foreground shadow-sm transition-colors hover:bg-secondary hover:text-secondary-foreground"
              >
                <ArrowLeft class="w-5 h-5" />
                <span>Kembali ke Karya</span>
              </button>
            </div>
          </Motion>
        </section>
      </div>
    </div>
  </main>
</template>
