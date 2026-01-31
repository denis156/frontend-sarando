<script setup lang="ts">
import ComingSoon from '@/components/ui/ComingSoon.vue'
import { useSeoMeta } from '@/composables/useSeoMeta'

// SEO Meta
useSeoMeta({
  title: 'Proyek Kami',
  description:
    'Koleksi karya dan portofolio terbaik dari Sarando. Solusi digital yang telah kami bangun untuk berbagai klien di Indonesia.',
  url: 'https://sarando.site/proyek',
})
</script>

<template>
  <main class="pt-24 min-h-dvh bg-background text-foreground">
    <ComingSoon
      title="Proyek Kami"
      subtitle="Koleksi karya terbaik anak bangsa sedang kami kurasi."
    />
  </main>
</template>
