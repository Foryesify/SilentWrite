<template>
  <div class="app">
    <WindowControls />
    <ActionsButton />
    <div class="view">
      <RouterView />
    </div>
  </div>
</template>

<style scoped>
.app {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.view {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.view > * {
  flex: 1;
}
</style>

<script setup>
import { RouterView } from 'vue-router'
import WindowControls from './components/WindowControls.vue'
import ActionsButton from './components/ActionsButton.vue'
</script>
