import { ref, type Ref } from 'vue'
import { useScroll, useTransform, type MotionValue } from 'motion-v'

export type ScrollAnimationType = 'fadeUp' | 'fadeDown' | 'fadeLeft' | 'fadeRight' | 'scaleUp'

interface ScrollAnimationOptions {
  distance?: number
  blur?: number
  scale?: number
}

interface ScrollAnimationReturn {
  targetRef: Ref<HTMLElement | null>
  opacity: MotionValue<number>
  x: MotionValue<number>
  y: MotionValue<number>
  scale: MotionValue<number>
  blur: MotionValue<number>
}

const defaultOptions: Required<ScrollAnimationOptions> = {
  distance: 50,
  blur: 10,
  scale: 0.9,
}

export function useScrollAnimation(
  type: ScrollAnimationType,
  options: ScrollAnimationOptions = {},
): ScrollAnimationReturn {
  const opts = { ...defaultOptions, ...options }
  const targetRef = ref<HTMLElement | null>(null)

  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ['start 80%', 'end 20%'] as const,
  })

  // Progress keyframes: [enter-start, enter-end, exit-start, exit-end]
  const progress = [0, 0.3, 0.7, 1]

  // Default values (no animation)
  let opacityValues = [1, 1, 1, 1]
  let xValues = [0, 0, 0, 0]
  let yValues = [0, 0, 0, 0]
  let scaleValues = [1, 1, 1, 1]
  let blurValues = [0, 0, 0, 0]

  switch (type) {
    case 'fadeUp':
      opacityValues = [0, 1, 1, 0]
      yValues = [opts.distance, 0, 0, -opts.distance]
      blurValues = [opts.blur, 0, 0, opts.blur]
      break

    case 'fadeDown':
      opacityValues = [0, 1, 1, 0]
      yValues = [-opts.distance, 0, 0, opts.distance]
      blurValues = [opts.blur, 0, 0, opts.blur]
      break

    case 'fadeLeft':
      opacityValues = [0, 1, 1, 0]
      xValues = [-opts.distance, 0, 0, -opts.distance]
      blurValues = [opts.blur, 0, 0, opts.blur]
      break

    case 'fadeRight':
      opacityValues = [0, 1, 1, 0]
      xValues = [opts.distance, 0, 0, opts.distance]
      blurValues = [opts.blur, 0, 0, opts.blur]
      break

    case 'scaleUp':
      opacityValues = [0, 1, 1, 0]
      yValues = [opts.distance * 0.8, 0, 0, -opts.distance * 0.8]
      scaleValues = [opts.scale, 1, 1, opts.scale]
      blurValues = [opts.blur, 0, 0, opts.blur]
      break
  }

  const opacity = useTransform(scrollYProgress, progress, opacityValues)
  const x = useTransform(scrollYProgress, progress, xValues)
  const y = useTransform(scrollYProgress, progress, yValues)
  const scale = useTransform(scrollYProgress, progress, scaleValues)
  const blur = useTransform(scrollYProgress, progress, blurValues)

  return {
    targetRef,
    opacity,
    x,
    y,
    scale,
    blur,
  }
}
