<template>
  <WindowControls />
  <div class="app">
    <Home v-show="page === 'Home'" />
    <Editor v-show="page === 'Editor'" />
    <Library v-show="page === 'Library'" />
  </div>
</template>

<style scoped>
.app {
  display: flex;
  flex: 1;
  padding: 0 12px;

  & > * {
    flex: 1;
    min-height: 100dvh;
    background-color: var(--color-background);
  }
}
</style>

<script setup>
import { page } from './user/session.js'
import Editor from './views/Editor.vue'
import Home from './views/Home.vue'
import Library from './views/Library.vue'
import WindowControls from './components/WindowControls.vue'
</script>
