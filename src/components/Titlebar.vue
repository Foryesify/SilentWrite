<template>
  <div class="titlebar" :class="{ showBorder: showBorder }">
    <div class="left"></div>
    <div class="center">
      <div class="draggable" data-tauri-drag-region></div>
    </div>
    <WindowControls class="right" />
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
  transition: box-shadow ease var(--fast);

  .draggable {
    -webkit-app-region: drag;
    flex: 1;
    height: 100%;
  }

  &.showBorder {
    border-bottom: 1px solid var(--border);
    box-shadow: var(--shadow-light);
  }
}

.left {
  display: block;
}

.center {
  display: flex;
  height: 100%;
}
</style>

<script setup>
import { ref } from 'vue'
import WindowControls from './WindowControls.vue'

const showBorder = ref(false)
addEventListener('scroll', () => (showBorder.value = scrollY != 0))
</script>
