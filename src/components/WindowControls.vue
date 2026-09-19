<template>
  <div class="window-controls" v-if="AppWindow.available()">
    <div @click="AppWindow.minimize">
      <svg viewBox="0 0 10 10">
        <path fill="none" stroke="currentColor" d="M1 5h8" />
      </svg>
    </div>
    <div @click="AppWindow.toggleMaximize">
      <svg viewBox="0 0 10 10">
        <path d="M1.5 1.5h7v7h-7z" fill="none" stroke="currentColor" />
      </svg>
    </div>
    <div class="danger" @click="AppWindow.close">
      <svg viewBox="0 0 10 10">
        <path fill="none" stroke="currentColor" d="M1.5 1.5l7 7M8.5 1.5l-7 7" />
      </svg>
    </div>
  </div>
</template>

<style scoped>
.window-controls {
  display: flex;
  height: 100%;

  div {
    aspect-ratio: 1.5;
    height: 100%;
    color: var(--text);
    display: grid;
    place-items: center;
    transition:
      background-color var(--fast) ease-in,
      color var(--fast) ease-in;
  }

  div:hover {
    background-color: var(--hover);
  }

  div.danger:hover {
    background-color: var(--danger);
    color: white;
  }

  svg {
    height: 40%;
  }
}
</style>

<script setup>
import { AppWindow } from '@/user/api'
</script>
