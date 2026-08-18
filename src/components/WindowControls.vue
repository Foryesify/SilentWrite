<template>
  <div class="window-controls" v-if="showWindowControls">
    <div @click="appwindow.minimize">
      <svg viewBox="0 0 10 10">
        <path stroke="currentColor" d="M1 5h8" />
      </svg>
    </div>
    <div @click="appwindow.toggleMaximize">
      <svg viewBox="0 0 10 10">
        <path d="M1.5 1.5h7v7h-7z" fill="none" stroke="currentColor" />
      </svg>
    </div>
    <div @click="appwindow.close">
      <svg viewBox="0 0 10 10">
        <path stroke="currentColor" d="M1.5 1.5l7 7M8.5 1.5l-7 7" />
      </svg>
    </div>
  </div>
</template>

<style scoped>
.window-controls {
  display: flex;
  position: fixed;
  right: 0;
  z-index: 100;

  div {
    display: grid;
    place-items: center;
    height: var(--control-height);
    aspect-ratio: 1.5;
    transition: background-color var(--duration-fast) var(--ease-accelerate);

    svg {
      width: 12px;
    }

    &:hover {
      background-color: var(--color-hover);
    }

    &:last-child:hover {
      background-color: var(--color-danger);
      color: #fff;
    }
  }
}
</style>

<script setup>
import { appwindow } from '@/userfunc.js'

const showWindowControls = (
  window.__TAURI_INTERNALS__ ||
  navigator.userAgent.includes('Electron') ||
  window.__FORYES_APP__ || true
)

</script>
