import { ref } from 'vue'
import type { Scene, TransitionDirection } from '@/types/scene'

/**
 * Composable untuk scene navigation dengan transition
 * @param scenes - Array of scenes
 * @param transitionDuration - Duration transisi dalam ms (default: 900)
 * @returns Object dengan state dan methods untuk navigation
 */
export function useSceneNavigation(scenes: Scene[], transitionDuration: number = 900) {
  const currentScene = ref(0)
  const isTransitioning = ref(false)
  const transitionDirection = ref<TransitionDirection>('next')

  const changeScene = (newScene: number, direction: TransitionDirection) => {
    if (isTransitioning.value) return
    if (newScene < 0 || newScene >= scenes.length) return
    if (newScene === currentScene.value) return

    isTransitioning.value = true
    transitionDirection.value = direction
    currentScene.value = newScene

    // Unlock after transition
    setTimeout(() => {
      isTransitioning.value = false
    }, transitionDuration)
  }

  const nextScene = () => {
    if (currentScene.value < scenes.length - 1 && !isTransitioning.value) {
      changeScene(currentScene.value + 1, 'next')
    }
  }

  const previousScene = () => {
    if (currentScene.value > 0 && !isTransitioning.value) {
      changeScene(currentScene.value - 1, 'prev')
    }
  }

  const goToEnd = () => {
    if (currentScene.value !== scenes.length - 1 && !isTransitioning.value) {
      changeScene(scenes.length - 1, 'next')
    }
  }

  const goToStart = () => {
    if (currentScene.value !== 0 && !isTransitioning.value) {
      changeScene(0, 'prev')
    }
  }

  return {
    currentScene,
    isTransitioning,
    transitionDirection,
    changeScene,
    nextScene,
    previousScene,
    goToEnd,
    goToStart
  }
}
