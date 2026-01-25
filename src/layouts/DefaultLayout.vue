<template>
  <!-- Staggered Menu -->
  <div class="fixed inset-0 w-full h-dvh z-50" style="pointer-events: none;">
    <StaggeredMenu
      position="right"
      :items="MENU_ITEMS"
      :social-items="SOCIAL_ITEMS"
      :display-socials="true"
      :display-item-numbering="true"
      menu-button-color="#f0e491"
      open-menu-button-color="#31694e"
      :change-menu-color-on-open="true"
      :colors="['#bbc863', '#31694e']"
      logo-url="/src/assets/submark-logo.png"
      accent-color="#31694e"
      @menu-open="handleMenuOpen"
      @menu-close="handleMenuClose"
    />
  </div>

  <!-- Page Content -->
  <router-view />
</template>

<script setup lang="ts">
import StaggeredMenu from '@/components/navigation/StaggeredMenu.vue'
import { MENU_ITEMS, SOCIAL_ITEMS } from '@/constants/navigation'

const handleMenuOpen = () => console.log('Menu opened')
const handleMenuClose = () => console.log('Menu closed')
</script>

<style scoped>
/* Override pointer-events untuk StaggeredMenu */
:deep(.staggered-menu-wrapper) {
  pointer-events: none;
}

:deep(.staggered-menu-header),
:deep(.staggered-menu-panel) {
  pointer-events: auto;
}
</style>
