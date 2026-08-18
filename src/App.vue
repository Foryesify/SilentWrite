<template>
  <WindowControls />
  <main>
    <RouterView v-slot="{ Component }">
      <Transition :name="transitionName">
        <div v-if="Component" class="route-frame" :key="route.name">
          <component :is="Component" />
        </div>
      </Transition>
    </RouterView>
  </main>
</template>

<style scoped>
main {
  position: relative;
  display: flex;
  flex: 1;
}

.route-frame {
  position: absolute;
  inset: 0;
  display: flex;
  background: var(--color-background);
  transform-origin: center;

  & > * {
    flex: 1;
    animation: window-open var(--duration-normal) var(--ease-accelerate);
  }
}

.route-open-enter-active,
.route-open-leave-active,
.route-close-enter-active,
.route-close-leave-active {
  pointer-events: none;
}

.route-open-enter-active,
.route-close-leave-active {
  overflow: hidden;
  will-change: transform, opacity;
  backface-visibility: hidden;
}

.route-open-enter-active {
  z-index: 2;
  animation: route-window-expand var(--duration-slow) var(--ease-accelerate)
    both;
}

.route-open-leave-active {
  z-index: 1;
}

.route-close-enter-active {
  z-index: 1;
}

.route-close-leave-active {
  z-index: 2;
  animation: route-window-shrink var(--duration-normal) var(--ease-accelerate);
}

@keyframes route-window-expand {
  from {
    transform: translateZ(0) scale(0.6, 0.6);
    border-radius: 8px;
    opacity: 0;
    background-color: var(--color-window-loading);
    box-shadow: 0 0 0 1px var(--color-border-strong);
  }

  14% {
    opacity: 1;
  }

  to {
    transform: translateZ(0) scale(1);
    border-radius: 0;
    opacity: 1;
    background-color: var(--color-background);
    box-shadow: 0 0 0 1px transparent;
  }
}

@keyframes route-window-shrink {
  from {
    transform: translateZ(0) scale(1);
    border-radius: 0;
    opacity: 1;
    background-color: var(--color-background);
    box-shadow: 0 0 0 1px var(--color-border-strong);
  }

  72% {
    opacity: 1;
  }

  to {
    transform: translateZ(0) scale(0.6, 0.6);
    border-radius: 8px;
    opacity: 0;
    background-color: var(--color-window-loading);
    box-shadow: 0 0 0 1px var(--color-border-strong);
  }
}

@media (prefers-reduced-motion: reduce) {
  .route-open-enter-active,
  .route-close-leave-active {
    animation: none;
  }
}
</style>

<script setup>
import { ref } from 'vue'
import { RouterView, useRoute, useRouter } from 'vue-router'
import WindowControls from './components/WindowControls.vue'

const route = useRoute()
const router = useRouter()
const transitionName = ref('route-none')

router.beforeEach((to, from) => {
  if (!from.name) {
    transitionName.value = 'route-none'
    return
  }

  const toDepth = to.meta.depth ?? 1
  const fromDepth = from.meta.depth ?? 1
  transitionName.value = toDepth >= fromDepth ? 'route-open' : 'route-close'
})
</script>
