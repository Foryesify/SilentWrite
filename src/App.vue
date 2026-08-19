<template>
  <div class="app">
    <div class="stack" :class="{ revealing: page !== 'Home' }">
      <Editor :class="{ inactive: under !== 'Editor' }" />
      <Library :class="{ inactive: under !== 'Library' }" />
      <Home class="home-layer" :class="{ sunk: page !== 'Home' }" />
    </div>
  </div>
</template>

<style scoped>
.app {
  display: flex;
  flex: 1;
  min-height: 0;
  padding: 0 12px;

  .stack {
    position: relative;
    flex: 1;
    overflow: hidden;

    &.revealing > div:not(.home-layer):not(.inactive) {
      animation: page-reveal var(--duration-slow) var(--ease-standard);
    }

    & > div {
      position: absolute;
      inset: 0;
      background-color: var(--color-background);

      &.inactive {
        display: none;
      }
    }

    .home-layer {
      z-index: 2;
      transform-origin: center center;
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

const under = ref('')

watch(page, (next) => {
  if (next !== 'Home') under.value = next
})
</script>
