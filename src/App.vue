<template>
  <WindowControls />
  <div class="app">
    <Home v-if="page === 'Home'" />
    <Editor v-if="page === 'Editor'" />
    <Library v-if="page === 'Library'"/>
    <Settings v-if="page === 'Settings'" />
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
import { ref } from 'vue'
import WindowControls from './components/WindowControls.vue'
import Editor from './views/Editor.vue'
import Home from './views/Home.vue'
import Library from './views/Library.vue'
import Settings from './views/Settings.vue'

const page = ref('Home')
</script>
