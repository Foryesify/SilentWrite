<template>
  <div class="window-controls" v-if="!Appwindow.isWebsite()" :class="{ hidden: editor.focused }">
    <div class="window-button" @click="Appwindow.minimize">
      <svg width="12" height="12" viewBox="0 0 10 10">
        <path fill="none" stroke="currentColor" d="M1 5h8" />
      </svg>
    </div>
    <div class="window-button" @click="Appwindow.toggleMaximize">
      <svg width="12" height="12" viewBox="0 0 10 10">
        <path d="M1.5 1.5h7v7h-7z" fill="none" stroke="currentColor" />
      </svg>
    </div>
    <div class="window-button" @click="Appwindow.close">
      <svg width="12" height="12" viewBox="0 0 10 10">
        <path fill="none" stroke="currentColor" d="M1.5 1.5l7 7M8.5 1.5l-7 7" />
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
  transition: opacity 0.2s ease;

  &.hidden {
    opacity: 0;
  }
}

.window-button {
  display: grid;
  place-items: center;
  height: var(--control-height);
  aspect-ratio: 1.5;
  transition: all var(--duration-fast) var(--ease-accelerate);

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
import { Appwindow } from '@/user/api'
import { editor } from '@/user/session.js'
</script>
