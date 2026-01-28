<template>
  <div class="min-h-dvh flex flex-col">
    <PageLoader />
    <TheNavbar />

    <!-- Page Content -->
    <div class="flex-1">
      <router-view />
    </div>

    <!-- Global Footer (Hide on Home page because it has its own footer scene) -->
    <TheFooter v-if="route.path !== '/'" />
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import TheNavbar from '@/components/layout/TheNavbar.vue'
import TheFooter from '@/components/layout/TheFooter.vue'
import PageLoader from '@/components/ui/PageLoader.vue'

const route = useRoute()
</script>
