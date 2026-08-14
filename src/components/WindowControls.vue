<template>
  <div class="window-controls">
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
  opacity: 0;
  transition: all 0.2s ease;

  div {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 48px;
    height: 32px;
    transition: all 0.15s ease-in;

    svg {
      width: 12px;
    }

    &:hover {
      background: var(--color-hover);
    }

    &:last-child:hover {
      background: #c22;
      color: #fff;
    }

    div {
      position: fixed;
      top: 34px;
      width: 48px;
      height: 32px;
    }
  }

  &:hover {
    opacity: 1;
  }
}
</style>

<script setup>
import { appwindow } from '@/userfunc.js'
</script>
