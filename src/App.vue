<template>
  <WindowControls />
  <div class="app">
    <Editor />
  </div>
</template>

<style scoped>
.app {
  display: flex;
  flex: 1;
  padding: 0 12px;
  
  & > div {
    flex: 1;
  }
}
</style>

<script setup>
import WindowControls from './components/WindowControls.vue'
import Editor from './views/Editor.vue';
import Home from './views/Home.vue'
import Library from './views/Library.vue';
</script>
