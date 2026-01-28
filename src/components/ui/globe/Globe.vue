<script lang="ts" setup>
import type { COBEOptions } from 'cobe'
import createGlobe from 'cobe'
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { useSpring } from 'vue-use-spring'

interface GlobeProps {
  class?: string
  config?: Partial<COBEOptions>
  mass?: number
  tension?: number
  friction?: number
  precision?: number
}

const props = withDefaults(defineProps<GlobeProps>(), {
  mass: 1,
  tension: 280,
  friction: 100,
  precision: 0.001,
})

const DEFAULT_CONFIG: COBEOptions = {
  width: 800,
  height: 800,
  onRender: () => {},
  devicePixelRatio: 2,
  phi: 0,
  theta: 0.3,
  dark: 0,
  diffuse: 0.4,
  mapSamples: 16000,
  mapBrightness: 1.2,
  baseColor: [1, 1, 1],
  markerColor: [35 / 255, 110 / 255, 95 / 255], // Match --accent (Dark Teal)
  glowColor: [1.2, 1.2, 1.2],
  markers: [
    // Asia & Pacific
    { location: [-3.9722, 122.5146], size: 0.12 }, // Kendari, Sulawesi Tenggara (Origin)
    { location: [-6.2088, 106.8456], size: 0.1 }, // Jakarta, Indonesia (Main Focus)
    { location: [14.5995, 120.9842], size: 0.03 }, // Manila
    { location: [19.076, 72.8777], size: 0.08 }, // Mumbai
    { location: [23.8103, 90.4125], size: 0.05 }, // Dhaka
    { location: [30.0444, 31.2357], size: 0.07 }, // Cairo
    { location: [39.9042, 116.4074], size: 0.08 }, // Beijing
    { location: [34.6937, 135.5022], size: 0.05 }, // Osaka
    { location: [35.6762, 139.6503], size: 0.08 }, // Tokyo
    { location: [1.3521, 103.8198], size: 0.08 }, // Singapore
    { location: [-33.8688, 151.2093], size: 0.06 }, // Sydney

    // Americas
    { location: [-23.5505, -46.6333], size: 0.1 }, // São Paulo
    { location: [19.4326, -99.1332], size: 0.1 }, // Mexico City
    { location: [40.7128, -74.006], size: 0.1 }, // New York
    { location: [34.0522, -118.2437], size: 0.08 }, // Los Angeles
    { location: [37.7749, -122.4194], size: 0.08 }, // San Francisco (Silicon Valley)
    { location: [43.6532, -79.3832], size: 0.06 }, // Toronto

    // Europe & Africa
    { location: [41.0082, 28.9784], size: 0.06 }, // Istanbul
    { location: [51.5074, -0.1278], size: 0.08 }, // London
    { location: [48.8566, 2.3522], size: 0.08 }, // Paris
    { location: [52.52, 13.405], size: 0.06 }, // Berlin
    { location: [-1.2921, 36.8219], size: 0.06 }, // Nairobi
    { location: [6.5244, 3.3792], size: 0.07 }, // Lagos
  ],
}

const globeCanvasRef = ref<HTMLCanvasElement>()
const phi = ref(0)
const width = ref(0)
const pointerInteracting = ref()
const pointerInteractionMovement = ref()

let globe: ReturnType<typeof createGlobe> | null = null

const spring = useSpring(
  {
    r: 0,
  },
  {
    mass: props.mass,
    tension: props.tension,
    friction: props.friction,
    precision: props.precision,
  },
)

function updatePointerInteraction(clientX: number | null) {
  if (clientX !== null) {
    pointerInteracting.value = clientX - (pointerInteractionMovement.value ?? clientX)
  } else {
    pointerInteracting.value = null
  }

  if (globeCanvasRef.value) {
    globeCanvasRef.value.style.cursor = clientX ? 'grabbing' : 'grab'
  }
}

function updateMovement(clientX: number) {
  if (pointerInteracting.value !== null) {
    const delta = clientX - (pointerInteracting.value ?? clientX)
    pointerInteractionMovement.value = delta
    spring.r = delta / 200
  }
}

function onRender(state: Record<string, unknown>) {
  if (!pointerInteracting.value) {
    phi.value += 0.005
  }

  state.phi = phi.value + spring.r
  state.width = width.value * 2
  state.height = width.value * 2
}

function onResize() {
  if (globeCanvasRef.value) {
    width.value = globeCanvasRef.value.offsetWidth
  }
}

function createGlobeOnMounted() {
  const config = { ...DEFAULT_CONFIG, ...props.config }

  globe = createGlobe(globeCanvasRef.value!, {
    ...config,
    width: width.value * 2,
    height: width.value * 2,
    onRender,
  })
}

onMounted(() => {
  window.addEventListener('resize', onResize)
  onResize()
  createGlobeOnMounted()

  setTimeout(() => (globeCanvasRef.value!.style.opacity = '1'))
})

onBeforeUnmount(() => {
  globe?.destroy()
  window.removeEventListener('resize', onResize)
})
</script>

<template>
  <div class="absolute inset-0 mx-auto aspect-[1/1] w-full max-w-[600px]" :class="[$props.class]">
    <canvas
      ref="globeCanvasRef"
      class="size-full opacity-0 transition-opacity duration-1000 ease-in-out [contain:layout_paint_size]"
      @pointerdown="(e) => updatePointerInteraction(e.clientX)"
      @pointerup="updatePointerInteraction(null)"
      @pointerout="updatePointerInteraction(null)"
      @mousemove="(e) => updateMovement(e.clientX)"
      @touchmove="(e) => e.touches[0] && updateMovement(e.touches[0].clientX)"
    />
  </div>
</template>
