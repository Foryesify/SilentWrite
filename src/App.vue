<template>
  <WindowControls />
  <main>
    <RouterView />
  </main>
</template>

<style scoped>
main {
  display: flex;
  flex: 1;

  & > * {
    flex: 1;
  }
}
</style>

<script setup>
import { RouterView } from 'vue-router'
import WindowControls from './components/WindowControls.vue'
</script>
