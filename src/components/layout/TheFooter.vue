<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { MENU_ITEMS, SOCIAL_ITEMS } from '@/constants/navigation'
import SubmarkLogo from '@/assets/submark-logo.png'
</script>

<template>
  <footer class="bg-card border-t border-border py-16 md:py-24">
    <div class="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
      <!-- Brand -->
      <div class="col-span-1 md:col-span-2 space-y-6">
        <RouterLink to="/" class="flex items-center gap-3">
          <img :src="SubmarkLogo" alt="Sarando" class="w-12 h-12 object-contain" />
          <span class="text-2xl font-bold tracking-tight text-foreground">SARANDO</span>
        </RouterLink>
        <p class="text-muted-foreground max-w-sm leading-relaxed">
          Membangun masa depan digital dengan integritas adat dan kualitas global. Dari Konawe untuk
          Dunia.
        </p>
      </div>

      <!-- Navigation -->
      <div class="space-y-6">
        <h4 class="text-lg font-semibold text-foreground">Menu</h4>
        <ul class="space-y-4">
          <li v-for="item in MENU_ITEMS" :key="item.link">
            <RouterLink
              :to="item.link"
              class="text-muted-foreground hover:text-primary transition-colors block"
            >
              {{ item.label }}
            </RouterLink>
          </li>
        </ul>
      </div>

      <!-- Socials / Contact -->
      <div class="space-y-6">
        <h4 class="text-lg font-semibold text-foreground">Sosial</h4>
        <ul class="space-y-4">
          <li v-for="social in SOCIAL_ITEMS" :key="social.link">
            <a
              :href="social.link"
              target="_blank"
              class="text-muted-foreground hover:text-primary transition-colors block"
            >
              {{ social.label }}
            </a>
          </li>
        </ul>
      </div>
    </div>

    <!-- Bottom -->
    <div
      class="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground"
    >
      <p>&copy; {{ new Date().getFullYear() }} SARANDO. All rights reserved.</p>
      <div class="flex gap-6">
        <a href="#" class="hover:text-foreground">Privacy Policy</a>
        <a href="#" class="hover:text-foreground">Terms of Service</a>
      </div>
    </div>
  </footer>
</template>
