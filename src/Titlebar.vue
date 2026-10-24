<template>
  <div class="titlebar" :class="{ showBorder, hide }" v-if="AppWindow.available()">
    <div class="center-draggable" data-tauri-drag-region></div>
    <div class="window-controls">
      <div>
        <svg class="big" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <rect x="4" y="2.5" width="16" height="19" rx="2.5" fill="none" />
          <path d="M8 8h8M8 12h8M8 16h5" />
        </svg>
      </div>
      <div @click="AppWindow.minimize">
        <svg viewBox="0 0 10 10">
          <path fill="none" stroke="currentColor" d="M1 5h8" />
        </svg>
      </div>
      <div @click="AppWindow.toggleMaximize">
        <svg viewBox="0 0 10 10" fill="none">
          <rect x="1.5" y="1.5" width="7" height="7" rx="1" stroke="currentColor" />
        </svg>
      </div>
      <div class="danger" @click="AppWindow.close">
        <svg viewBox="0 0 10 10">
          <path fill="none" stroke="currentColor" d="M1.5 1.5l7 7M8.5 1.5l-7 7" />
        </svg>
      </div>
    </div>
  </div>
</template>

<style scoped>
.titlebar {
  display: flex;
  position: fixed;
  z-index: 1000;
  user-select: none;
  width: 100%;
  height: 32px;
  background-color: var(--bg);
  color: var(--text);
  transition: opacity var(--fast) ease-in;

  &.showBorder {
    border-bottom: 1px solid var(--border);
    box-shadow: var(--shadow-light);
  }

  &.hide {
    opacity: 0;
  }

  &:hover {
    opacity: 1 !important;
  }
}

.center-draggable {
  flex: 1;
  height: 100%;
}

.window-controls {
  flex: 0;
  display: flex;

  div {
    width: 48px;
    height: 32px;
    color: var(--text);
    display: grid;
    place-items: center;
    transition: all var(--fast) ease-in;

    &:hover {
      background-color: var(--hover);
    }

    &:last-child:hover {
      background-color: var(--danger);
      color: white;
    }
  }

  svg {
    height: 14px;

    &.big {
      height: 16px;
    }
  }
}
</style>

<script setup>
import { ref, computed } from 'vue'
import { AppWindow, EditorManager } from './api.js'

const showBorder = ref(false)
addEventListener('scroll', () => (showBorder.value = scrollY != 0))

const hide = computed(() => EditorManager.focus.value)
</script>
