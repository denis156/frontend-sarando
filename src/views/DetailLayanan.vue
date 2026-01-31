<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import { Motion, AnimatePresence } from 'motion-v'
import {
  ArrowLeft,
  CheckCircle2,
  Mail,
  Loader2,
  AlertCircle,
  ArrowRight,
  ChevronDown,
  ChevronUp,
} from 'lucide-vue-next'
import Threads from '@/components/ui/background/Threads.vue'
import { Badge } from '@/components/ui/badge'
import BorderBeam from '@/components/ui/border-beam/BorderBeam.vue'
import CardSpotlight from '@/components/ui/card-spotlight/CardSpotlight.vue'
import { getServiceBySlug } from '@/api/services'
import type { Service } from '@/types/service'

import { useCurrency } from '@/composables/useCurrency'
import { useScrollAnimation } from '@/composables/useScrollAnimation'
import { useSeoMeta } from '@/composables/useSeoMeta'

const route = useRoute()
const router = useRouter()
const { formatRupiah } = useCurrency()

// Service data - akan di-fetch
const service = ref<Service | null>(null)

// Dynamic SEO Meta - reaktif berdasarkan data service
const seoTitle = computed(() => service.value?.name || 'Detail Layanan')
const seoDescription = computed(() => service.value?.description || null)
const seoImage = computed(() => service.value?.image_path || null)
const seoUrl = computed(() => `https://sarando.site/layanan/${route.params.slug}`)

useSeoMeta({
  title: seoTitle,
  description: seoDescription,
  image: seoImage,
  url: seoUrl,
  type: 'product',
})

// Scroll Animations
const heroText = useScrollAnimation('fadeUp')
const heroDesc = useScrollAnimation('fadeUp', { distance: 30 })
const heroImage = useScrollAnimation('scaleUp')
const ctaAnimation = useScrollAnimation('scaleUp')

const loading = ref(true)
const error = ref<string | null>(null)

// State to track expanded features per price package
const expandedFeatures = ref<Record<number, boolean>>({})

const toggleFeatures = (priceId: number) => {
  expandedFeatures.value[priceId] = !expandedFeatures.value[priceId]
}

const fetchService = async () => {
  const slug = route.params.slug as string
  if (!slug) return

  loading.value = true
  error.value = null

  try {
    service.value = await getServiceBySlug(slug)
  } catch (err) {
    console.error('Failed to fetch service details:', err)
    error.value = 'Gagal memuat detail layanan. Silakan coba lagi.'
  } finally {
    loading.value = false
  }
}

onMounted(fetchService)

// Reload when slug changes (e.g. navigation from one service to another)
watch(() => route.params.slug, fetchService)

// Back function
const goBack = () => {
  router.push('/layanan')
}
</script>

<template>
  <main class="relative text-foreground min-h-dvh pt-24 pb-12">
    <!-- Background Decor -->
    <div class="fixed inset-0 z-[-1] pointer-events-none">
      <div class="absolute inset-0 opacity-50">
        <Threads :color="[1, 1, 1]" :amplitude="1" :scale="0.8" />
      </div>
      <div
        class="absolute inset-0 bg-linear-to-b from-background via-background/80 to-background/95"
      ></div>
    </div>

    <div class="relative z-10 container mx-auto px-4 max-w-6xl space-y-16">
      <!-- LOADING STATE -->
      <div v-if="loading" class="h-[60vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 class="w-12 h-12 animate-spin text-primary" />
        <p class="text-muted-foreground animate-pulse">Memuat layanan...</p>
      </div>

      <!-- ERROR STATE -->
      <div
        v-else-if="error || !service"
        class="h-[60vh] flex flex-col items-center justify-center space-y-6 text-center"
      >
        <div
          class="w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center text-destructive"
        >
          <AlertCircle class="w-10 h-10" />
        </div>
        <h2 class="text-2xl font-bold">Layanan Tidak Ditemukan</h2>
        <p class="text-muted-foreground">{{ error ?? 'Layanan yang Anda cari tidak tersedia.' }}</p>
        <button
          @click="goBack"
          class="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-white/10 hover:bg-white/5 transition-colors"
        >
          <ArrowLeft class="w-4 h-4" />
          Kembali ke Layanan
        </button>
      </div>

      <!-- CONTENT STATE -->
      <div v-else class="space-y-16">
        <!-- 1. HERO SECTION (2 Columns) -->
        <header
          class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center text-center lg:text-left"
        >
          <!-- Left: Text Content -->
          <div class="flex flex-col items-center lg:items-start text-center lg:text-left space-y-6">
            <Motion
              :ref="(el) => (heroText.targetRef.value = el as HTMLElement)"
              :style="{
                opacity: heroText.opacity,
                y: heroText.y,
                filter: `blur(${heroText.blur}px)`,
              }"
              class="flex flex-col items-center lg:items-start"
            >
              <Badge
                v-if="service.category_name"
                variant="outline"
                class="mb-6 border-white/20 text-white/70 backdrop-blur-sm px-4 py-1.5 uppercase tracking-wider text-[10px] bg-white/5"
              >
                {{ service.category_name }}
              </Badge>

              <h1
                class="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter text-transparent bg-clip-text bg-linear-to-br from-white via-white to-white/50 leading-[1.1]"
              >
                {{ service.name }}
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
              <p class="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-xl">
                {{ service.description }}
              </p>
            </Motion>
          </div>

          <!-- Right: Service Image -->
          <Motion
            v-if="service.image_path"
            :ref="(el) => (heroImage.targetRef.value = el as HTMLElement)"
            :style="{
              opacity: heroImage.opacity,
              scale: heroImage.scale,
              filter: `blur(${heroImage.blur}px)`,
            }"
            class="relative"
          >
            <div
              class="relative w-full aspect-[4/3] rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-card/20 backdrop-blur-sm"
            >
              <img
                :src="service.image_path"
                :alt="service.name"
                class="w-full h-full object-cover"
              />
              <!-- Inner Shadow Overlay -->
              <div
                class="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent"
              ></div>

              <BorderBeam
                :size="250"
                :duration="12"
                :delay="9"
                :border-width="2"
                color-from="var(--color-primary)"
                color-to="var(--color-secondary)"
              />
            </div>

            <!-- Decorative Element behind image -->
            <div
              class="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-primary/10 blur-[80px] rounded-full pointer-events-none"
            ></div>
          </Motion>
        </header>

        <!-- 2. PRICING PACKAGES -->
        <section v-if="service.prices && service.prices.length > 0">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10 items-start">
            <Motion
              v-for="(price, index) in service.prices"
              :key="price.id"
              :initial="{ opacity: 0, y: 50 }"
              :animate="{ opacity: 1, y: 0 }"
              :transition="{ duration: 0.5, delay: 0.3 + index * 0.1 }"
              class="h-full"
            >
              <CardSpotlight
                class="h-full flex flex-col p-8 rounded-3xl transition-all duration-500 !bg-card/5 backdrop-blur-md border"
                :class="[
                  price.is_active
                    ? 'border-primary/50 shadow-[0_0_40px_rgba(var(--primary-rgb),0.1)] md:scale-105 z-10'
                    : 'border-white/5 z-0',
                ]"
                gradient-color="#10b981"
                :gradient-opacity="0.15"
              >
                <!-- Content -->
                <div class="relative z-10 flex-1 space-y-6">
                  <!-- Header -->
                  <div class="space-y-2">
                    <h3
                      class="text-xl font-medium text-white/80 group-hover:text-white transition-colors"
                    >
                      {{ price.package_name }}
                    </h3>
                    <div
                      class="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-linear-to-r from-primary to-emerald-300"
                    >
                      {{ formatRupiah(price.price) }}
                    </div>
                    <p
                      v-if="price.description"
                      class="text-sm text-muted-foreground leading-relaxed"
                    >
                      {{ price.description }}
                    </p>
                  </div>

                  <hr class="border-white/10" />

                  <!-- Features List -->
                  <!-- Service Image (If available) -->

                  <!-- Features List -->
                  <div v-if="price.features && price.features.length">
                    <ul class="space-y-4">
                      <!-- Always visible first 5 items -->
                      <li
                        v-for="(feature, idx) in price.features.slice(0, 5)"
                        :key="idx"
                        class="flex items-start gap-3 text-sm text-white/70 group-hover:text-white/90 transition-colors"
                      >
                        <CheckCircle2 class="w-5 h-5 text-primary shrink-0" />
                        <span>{{ feature }}</span>
                      </li>
                    </ul>

                    <!-- Collapsible remaining items -->
                    <AnimatePresence>
                      <Motion
                        v-if="expandedFeatures[price.id]"
                        :initial="{ opacity: 0, height: 0 }"
                        :animate="{ opacity: 1, height: 'auto' }"
                        :exit="{ opacity: 0, height: 0 }"
                        :transition="{ duration: 0.3, ease: 'easeInOut' }"
                        class="overflow-hidden"
                      >
                        <ul class="space-y-4 pt-4">
                          <li
                            v-for="(feature, idx) in price.features.slice(5)"
                            :key="idx + 5"
                            class="flex items-start gap-3 text-sm text-white/70 group-hover:text-white/90 transition-colors"
                          >
                            <CheckCircle2 class="w-5 h-5 text-primary shrink-0" />
                            <span>{{ feature }}</span>
                          </li>
                        </ul>
                      </Motion>
                    </AnimatePresence>

                    <!-- Toggle Button if more than 5 features -->
                    <button
                      v-if="price.features.length > 5"
                      @click="toggleFeatures(price.id)"
                      class="mt-4 flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors font-medium"
                    >
                      <span v-if="!expandedFeatures[price.id]">
                        ... {{ price.features.length - 5 }} fitur lainnya
                      </span>
                      <span v-else>Sembunyikan</span>

                      <component
                        :is="expandedFeatures[price.id] ? ChevronUp : ChevronDown"
                        class="w-4 h-4"
                      />
                    </button>
                  </div>
                </div>

                <!-- Action Button -->
                <div class="relative z-10 mt-8 pt-4">
                  <RouterLink
                    :to="{
                      path: '/kontak',
                      query: { service: service.name, package: price.package_name },
                    }"
                    class="w-full inline-flex items-center justify-center gap-2 py-4 rounded-xl font-semibold transition-all duration-300"
                    :class="[
                      price.is_active
                        ? 'bg-primary text-white hover:bg-primary/90 shadow-lg'
                        : 'bg-white/5 text-white hover:bg-white/10 hover:text-primary border border-white/5',
                    ]"
                  >
                    <span>Pilih Paket</span>
                    <ArrowRight class="w-4 h-4" />
                  </RouterLink>
                </div>
              </CardSpotlight>
            </Motion>
          </div>
        </section>

        <!-- Empty State for Prices -->
        <div
          v-else
          class="text-center py-12 border border-dashed border-white/10 rounded-2xl bg-white/5"
        >
          <p class="text-muted-foreground">Informasi paket belum tersedia untuk layanan ini.</p>
        </div>

        <!-- 3. SECONDARY CTA -->
        <section class="py-24 md:py-32 text-center border-t border-white/5">
          <Motion
            :ref="(el) => (ctaAnimation.targetRef.value = el as HTMLElement)"
            :style="{
              opacity: ctaAnimation.opacity,
              scale: ctaAnimation.scale,
              y: ctaAnimation.y,
              filter: `blur(${ctaAnimation.blur}px)`,
            }"
            class="max-w-3xl mx-auto space-y-8"
          >
            <h2 class="text-4xl md:text-6xl font-bold tracking-tighter">
              Butuh Spesifikasi Khusus?
            </h2>
            <p class="text-xl text-muted-foreground max-w-2xl mx-auto">
              Jika paket standar kami belum memenuhi kebutuhan unik bisnis Anda, kami siap
              mendiskusikan solusi custom yang lebih personal.
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
                <span>Kembali ke Layanan</span>
              </button>
            </div>
          </Motion>
        </section>
      </div>
    </div>
  </main>
</template>
