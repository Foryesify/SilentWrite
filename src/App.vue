<template>
  <WindowControls />
  <Name />
  <Actions :hidden="actionsHidden" />
  <div class="app">
    <Transition :name="navName">
      <Home v-if="page === 'Home'" key="Home" />
      <Editor v-else-if="page === 'Editor'" key="Editor" />
      <Library v-else-if="page === 'Library'" key="Library" />
    </Transition>
  </div>
</template>

<style scoped>
.app {
  display: grid;
  grid-template: 1fr / 1fr;
  flex: 1;
  padding: 0 12px;
  overflow: hidden;

  & > * {
    grid-area: 1 / 1;
    min-width: 0;
    min-height: 0;
    overflow: auto;
  }
}
</style>

<script setup>
import { actionsHidden, navName, page } from './user/session.js'
import Editor from './views/Editor.vue'
import Home from './views/Home.vue'
import Library from './views/Library.vue'
import WindowControls from './components/WindowControls.vue'
import Name from './components/Name.vue'
import Actions from './components/Actions.vue'
</script>
