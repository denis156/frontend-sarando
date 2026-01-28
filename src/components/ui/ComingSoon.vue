<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { Motion } from 'motion-v'
import SubmarkLogo from '@/assets/submark-logo.png'
// Assuming Button component exists based on Home.vue usage,
// otherwise we can fallback to standard styles.
// But let's stick to standard Tailwind for simplicity and zero-dependency in this specific component if needed,
// or cleaner: just use semantic HTML for the link.
// actually, let's make it self-contained with Tailwind classes for the button to avoid circular dep issues if Button has logic.

interface Props {
  title?: string
  subtitle?: string
}

withDefaults(defineProps<Props>(), {
  title: 'Halaman Ini',
  subtitle: 'Sedang dalam tahap pengembangan dan penyempurnaan.',
})
</script>

<template>
  <div
    class="min-h-[80dvh] flex flex-col items-center justify-center text-center px-4 relative overflow-hidden"
  >
    <!-- Background Elements -->
    <div class="absolute inset-0 bg-background z-0"></div>
    <div
      class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none"
    ></div>

    <div class="relative z-10 flex flex-col items-center gap-8 max-w-lg">
      <!-- Logo Animation -->
      <Motion
        :initial="{ opacity: 0, scale: 0.8, y: 20 }"
        :animate="{ opacity: 1, scale: 1, y: 0 }"
        :transition="{ duration: 0.8, ease: 'easeOut' }"
        class="relative"
      >
        <div class="absolute inset-0 bg-secondary/20 rounded-full blur-xl animate-pulse"></div>
        <img
          :src="SubmarkLogo"
          alt="Sarando"
          class="w-24 h-24 md:w-32 md:h-32 object-contain relative z-10"
        />
      </Motion>

      <!-- Text Content -->
      <div class="space-y-4">
        <Motion
          :initial="{ opacity: 0, y: 20 }"
          :animate="{ opacity: 1, y: 0 }"
          :transition="{ delay: 0.3, duration: 0.6 }"
        >
          <h1
            class="text-4xl md:text-6xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white to-neutral-500"
          >
            Segera Hadir
          </h1>
        </Motion>

        <Motion
          :initial="{ opacity: 0, y: 20 }"
          :animate="{ opacity: 1, y: 0 }"
          :transition="{ delay: 0.5, duration: 0.6 }"
        >
          <p class="text-lg text-muted-foreground leading-relaxed">
            <span class="text-primary font-medium">{{ title }}</span> <br />
            {{ subtitle }}
          </p>
        </Motion>
      </div>

      <!-- Action -->
      <Motion
        :initial="{ opacity: 0, y: 20 }"
        :animate="{ opacity: 1, y: 0 }"
        :transition="{ delay: 0.7, duration: 0.6 }"
      >
        <RouterLink
          to="/"
          class="inline-flex items-center justify-center px-8 py-3 rounded-full border border-border bg-card/50 text-foreground hover:bg-secondary/10 hover:border-secondary/50 transition-all duration-300 backdrop-blur-sm group"
        >
          <span class="mr-2 group-hover:-translate-x-1 transition-transform">←</span>
          Kembali ke Beranda
        </RouterLink>
      </Motion>
    </div>
  </div>
</template>
