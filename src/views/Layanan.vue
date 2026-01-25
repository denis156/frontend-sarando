<template>
  <main class="relative min-h-dvh">
    <!-- Hero Section - 2 Grid Columns -->
    <section
      class="relative min-h-dvh flex items-start lg:items-center justify-center pt-20 pb-20 bg-accent overflow-hidden"
    >
      <!-- Noise Background -->
      <Noise :pattern-alpha="15" mix-blend-mode="overlay" />

      <!-- Light Rays Background -->
      <div class="absolute inset-0 w-full h-full">
        <LightRays
          rays-origin="top-center"
          rays-color="#f4e4ba"
          :rays-speed="1.5"
          :light-spread="1"
          :ray-length="1.2"
          :follow-mouse="true"
          :mouse-influence="1"
          :noise-amount="0.1"
          :distortion="0.05"
        />
      </div>

      <!-- Card Swap Layanan (Mobile) - Absolute positioning di paling bawah -->
      <div class="absolute -bottom-18 left-1/2 -translate-x-1/2 lg:hidden">
        <CardSwap
          :width="300"
          :height="280"
          :card-distance="40"
          :vertical-distance="50"
          :delay="5000"
          :skew-amount="4"
          easing="elastic"
          :pause-on-hover="false"
          :items="popularServices"
          @card-click="handleCardClick"
        >
          <template
            v-for="(service, index) in popularServices"
            :key="service.id"
            #[`card-${index}`]="{ item }"
          >
            <div class="relative w-full h-full overflow-hidden rounded-xl">
              <!-- Image Background -->
              <img
                :src="item.image"
                :alt="item.title"
                class="absolute inset-0 w-full h-full object-cover"
              />
              <!-- Overlay -->
              <div class="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-transparent"></div>
              <!-- Content -->
              <div class="absolute top-0 left-0 right-0 p-3">
                <div class="flex items-center">
                  <component :is="getIcon(item.icon)" class="mr-2 w-5 h-5 text-secondary" />
                  <span class="text-secondary text-base font-semibold">{{ item.title }}</span>
                </div>
              </div>
            </div>
          </template>
        </CardSwap>
      </div>

      <div class="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <!-- Kolom Kiri - Hero Content -->
          <div class="space-y-6">
            <Motion
              :initial="{ opacity: 0, x: -30 }"
              :animate="{ opacity: 1, x: 0 }"
              :transition="{ duration: 0.8, ease: 'easeOut' }"
            >
              <h1
                class="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-secondary text-center lg:text-left"
              >
                Layanan Kami
              </h1>
            </Motion>

            <Motion
              :initial="{ opacity: 0, x: -30 }"
              :animate="{ opacity: 1, x: 0 }"
              :transition="{ duration: 0.8, delay: 0.2, ease: 'easeOut' }"
            >
              <p
                class="text-lg sm:text-xl lg:text-2xl text-white/70 leading-relaxed text-center lg:text-left"
              >
                Kami menyediakan solusi digital lengkap yang dirancang khusus untuk kebutuhan bisnis
                Anda. Dari konsep hingga implementasi, tim kami siap membantu mewujudkan visi
                digital Anda dengan teknologi terkini dan sentuhan budaya lokal yang kuat.
              </p>
            </Motion>
          </div>

          <!-- Card Swap Layanan (Desktop) - Absolute positioning -->
          <div class="absolute top-14 -right-14 hidden lg:block">
            <CardSwap
              :width="700"
              :height="600"
              :card-distance="80"
              :vertical-distance="120"
              :delay="5000"
              :skew-amount="6"
              easing="elastic"
              :pause-on-hover="false"
              :items="popularServices"
              @card-click="handleCardClick"
            >
              <template
                v-for="(service, index) in popularServices"
                :key="service.id"
                #[`card-${index}`]="{ item }"
              >
                <div class="relative w-full h-full overflow-hidden rounded-xl">
                  <!-- Image Background -->
                  <img
                    :src="item.image"
                    :alt="item.title"
                    class="absolute inset-0 w-full h-full object-cover"
                  />
                  <!-- Overlay -->
                  <div class="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-transparent"></div>
                  <!-- Content -->
                  <div class="absolute top-0 left-0 right-0 p-6">
                    <div class="flex items-center">
                      <component :is="getIcon(item.icon)" class="mr-3 w-8 h-8 text-secondary" />
                      <span class="text-secondary text-2xl font-semibold">{{ item.title }}</span>
                    </div>
                  </div>
                </div>
              </template>
            </CardSwap>
          </div>
        </div>
      </div>
    </section>

    <!-- List Layanan Section - Nanti dibuat -->
    <section class="relative py-20 h-dvh bg-primary z-20">
      <div class="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Card layanan akan ditambahkan di sini -->
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Motion } from 'motion-v'
import * as LucideIcons from 'lucide-vue-next'
import CardSwap from '@/components/ui/CardSwap.vue'
import Noise from '@/components/ui/background/Noise.vue'
import LightRays from '@/components/ui/background/LightRays.vue'
import { SERVICES } from '@/constants/services'

// Filter hanya layanan populer untuk CardSwap
const popularServices = computed(() => {
  return SERVICES.filter(service => service.isPopular)
})

// Helper untuk get icon component dari lucide
const getIcon = (iconName: string) => {
  return (LucideIcons as Record<string, unknown>)[iconName] || LucideIcons.Box
}

// Handle card click
const handleCardClick = (index: number) => {
  const service = popularServices.value[index]
  if (service) {
    console.log(`Card ${index} (${service.title}) clicked`)
  }
}
</script>
