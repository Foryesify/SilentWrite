<template>
  <div class="titlebar" :class="{ showBorder, hide }" v-if="AppWindow.available()">
    <div class="left">
      <div class="actions">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
    <div class="center">
      <div class="draggable" data-tauri-drag-region></div>
    </div>
    <div class="window-controls right">
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
  </div>
</template>

<style scoped>
.titlebar {
  box-sizing: content-box;
  position: fixed;
  z-index: 1000;
  user-select: none;
  width: 100%;
  height: 32px;
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  background-color: var(--bg);
  border-bottom: 1px solid transparent;
  transition: all ease-in var(--fast);
  color: var(--text);

  .draggable {
    -webkit-app-region: drag;
    flex: 1;
    height: 100%;
  }

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

.left {
  height: 100%;
  
  .actions {
    width: 48px;
    height: 100%;
    display: flex;
    gap: 3px;
    justify-content: center;
    align-items: center;
    transition: all var(--fast) ease-in;

    span {
      margin-top: 2px;
      width: 4px;
      aspect-ratio: 1;
      border-radius: 100%;
      background-color: var(--text-secondary);
    }

    &:hover {
      background-color: var(--hover);
    }
  }
}

.center {
  display: flex;
  height: 100%;
}

.window-controls {
  display: flex;
  height: 100%;

  div {
    aspect-ratio: 1.5;
    height: 100%;
    color: var(--text-secondary);
    display: grid;
    place-items: center;
    transition: all var(--fast) ease-in;
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
import { ref, computed } from 'vue'
import { AppWindow, EditorManager } from './api.js'

const showBorder = ref(false)
addEventListener('scroll', () => (showBorder.value = scrollY != 0))

const hide = computed(() => EditorManager.focus.value)
</script>
