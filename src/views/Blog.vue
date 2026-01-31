<script setup lang="ts">
import ComingSoon from '@/components/ui/ComingSoon.vue'
import { useSeoMeta } from '@/composables/useSeoMeta'

// SEO Meta
useSeoMeta({
  title: 'Blog & Wawasan',
  description:
    'Artikel dan cerita inspiratif seputar teknologi, bisnis digital, dan kearifan lokal dari tim Sarando di Konawe, Sulawesi Tenggara.',
  url: 'https://sarando.site/blog',
})
</script>

<template>
  <main class="pt-24 min-h-dvh bg-background text-foreground">
    <ComingSoon
      title="Blog & Wawasan"
      subtitle="Artikel dan cerita inspiratif dari Konawe untuk dunia sedang ditulis."
    />
  </main>
</template>
