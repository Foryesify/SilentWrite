<template>
  <div class="window-controls" v-if="!Appwindow.isWebsite()">
    <div class="window-button" @click="Appwindow.minimize">
      <svg viewBox="0 0 10 10">
        <path stroke="currentColor" d="M1 5h8" />
      </svg>
    </div>
    <div class="window-button" @click="Appwindow.toggleMaximize">
      <svg viewBox="0 0 10 10">
        <path d="M1.5 1.5h7v7h-7z" fill="none" stroke="currentColor" />
      </svg>
    </div>
    <div class="window-button" @click="Appwindow.close">
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
  top: 0;
  right: 0;
  z-index: 100;
}

.window-button {
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
</style>

<script setup>
import { Appwindow } from '@/api';

</script>
