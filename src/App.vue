<template>
  <Titlebar />
  <div class="view">
    <RouterView />
  </div>
</template>

<style scoped>
.view {
  display: flex;
}

.view > * {
  flex: 1;
}
</style>

<script setup>
import Titlebar from './components/Titlebar.vue'
import { RouterView } from 'vue-router'
</script>
