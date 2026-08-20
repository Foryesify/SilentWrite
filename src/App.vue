<template>
  <WindowControls />
  <div class="app">
    <div class="stack" :class="{ revealing: page !== 'Home' }">
      <Home class="home-layer" :class="{ sunk: page !== 'Home' }" />
      <Editor :class="{ inactive: under !== 'Editor' }" />
      <Library :class="{ inactive: under !== 'Library' }" />
    </div>
  </div>
</template>

<style scoped>
.app {
  display: flex;
  flex: 1;
  padding: 0 12px;
}

.stack {
  flex: 1;
  min-height: 100dvh;

  &.revealing > div:not(.home-layer):not(.inactive) {
    animation: page-reveal var(--duration-slow) var(--ease-standard);
  }

  & > div {
    background-color: var(--color-background);

    &.inactive {
      display: none;
    }
  }

  .home-layer {
    position: fixed;
    inset: 0 12px;
    z-index: 2;
    transform-origin: center;
    transition:
      transform var(--duration-slow) var(--ease-standard),
      opacity var(--duration-slow) var(--ease-standard),
      filter var(--duration-slow) var(--ease-standard);

    &.sunk {
      opacity: 0;
      transform: scale(0.84);
      filter: brightness(0.55);
      pointer-events: none;
      transition-timing-function: var(--ease-accelerate);
    }
  }
}

@keyframes page-reveal {
  from {
    filter: brightness(1.2);
  }

  to {
    filter: brightness(1);
  }
}
</style>

<script setup>
import { ref, watch } from 'vue'
import { page } from './router.js'
import Editor from './views/Editor.vue'
import Home from './views/Home.vue'
import Library from './views/Library.vue'
import WindowControls from './components/WindowControls.vue'

const under = ref('')

watch(page, (next) => {
  if (next !== 'Home') under.value = next
})
</script>
