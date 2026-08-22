<template>
  <div
    class="window-controls"
    v-if="!Appwindow.isWebsite()"
    :class="{ hidden: windowControlsHidden }"
  >
    <div class="window-button" v-html="iconMin" @click="Appwindow.minimize" />
    <div
      class="window-button"
      v-html="iconMax"
      @click="Appwindow.toggleMaximize"
    />
    <div class="window-button" v-html="iconClose" @click="Appwindow.close" />
  </div>
</template>

<style scoped>
.window-controls {
  display: flex;
  position: fixed;
  top: 0;
  right: 0;
  z-index: 100;
  opacity: 1;
  transition: opacity 0.2s ease;

  &.hidden {
    opacity: 0;
  }

  &:hover {
    opacity: 1;
  }
}

.window-button {
  display: grid;
  place-items: center;
  height: var(--control-height);
  aspect-ratio: 1.5;
  transition: background-color var(--duration-fast) var(--ease-accelerate);

  :deep(svg) {
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
import { windowControlsHidden } from './WindowControls.js'
import iconMin from '@/assets/window-min.svg?raw'
import iconMax from '@/assets/window-max.svg?raw'
import iconClose from '@/assets/window-close.svg?raw'

</script>
