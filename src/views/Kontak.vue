<script setup lang="ts">
import ComingSoon from '@/components/ui/ComingSoon.vue'
import { useSeoMeta } from '@/composables/useSeoMeta'

// SEO Meta
useSeoMeta({
  title: 'Hubungi Kami',
  description:
    'Hubungi tim Sarando untuk konsultasi gratis tentang kebutuhan digital bisnis Anda. Kami siap membantu dari Konawe, Sulawesi Tenggara.',
  url: 'https://sarando.site/kontak',
})
</script>

<template>
  <main class="pt-24 min-h-dvh bg-background text-foreground">
    <ComingSoon
      title="Hubungi Kami"
      subtitle="Jalur komunikasi sedang dibangun agar kami bisa mendengar aspirasi Anda lebih baik."
    />
  </main>
</template>
