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

.route-open-enter-active {
  z-index: 2;
  box-shadow: inset 0 0 0 1px var(--color-border-strong);
  animation: route-window-expand 420ms cubic-bezier(0.16, 1, 0.3, 1) both;
}

.route-open-leave-active {
  z-index: 1;
}

.route-close-enter-active {
  z-index: 1;
}

.route-close-leave-active {
  z-index: 2;
  box-shadow: inset 0 0 0 1px var(--color-border-strong);
  animation: route-window-shrink 300ms cubic-bezier(0.4, 0, 1, 1) both;
}

@keyframes route-window-expand {
  from {
    clip-path: inset(30% 26% 30% 26% round 8px);
    opacity: 0;
  }

  14% {
    opacity: 1;
  }

  to {
    clip-path: inset(0 0 0 0 round 0);
    opacity: 1;
  }
}

@keyframes route-window-shrink {
  from {
    clip-path: inset(0 0 0 0 round 0);
    opacity: 1;
  }

  72% {
    opacity: 1;
  }

  to {
    clip-path: inset(30% 26% 30% 26% round 8px);
    opacity: 0;
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
