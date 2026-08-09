<template>
  <div class="app">
    <Titlebar />
    <div class="view">
      <RouterView />
    </div>
    <NewEssayMsgbox />
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
import Titlebar from './components/Titlebar.vue'
import NewEssayMsgbox from './components/NewEssayMsgbox.vue'
import { RouterView } from 'vue-router'
</script>
