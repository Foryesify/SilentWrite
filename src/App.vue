<template>
  <WindowControls />
  <Name />
  <Actions />
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
  display: flex;
  flex: 1;
  overflow: hidden;

  & > * {
    flex: 1;
  }
}

.nav-forward-enter-active,
.nav-forward-leave-active,
.nav-back-enter-active,
.nav-back-leave-active {
  transition: all var(--duration-normal) var(--ease-accelerate);
}

.nav-forward-leave-active,
.nav-back-leave-active {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.nav-forward-enter-from {
  opacity: 0;
  transform: translateX(28px);
}

.nav-forward-leave-to {
  opacity: 0;
  transform: translateX(-12px);
}

.nav-back-enter-from {
  opacity: 0;
  transform: translateX(-28px);
}

.nav-back-leave-to {
  opacity: 0;
  transform: translateX(12px);
}
</style>

<script setup>
import { navName, page } from './user/session.js'
import Editor from './views/Editor.vue'
import Home from './views/Home.vue'
import Library from './views/Library.vue'
import WindowControls from './components/WindowControls.vue'
import Name from './components/Name.vue'
import Actions from './components/Actions.vue'
</script>
