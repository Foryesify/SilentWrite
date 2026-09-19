<template>
  <Titlebar />
  <div class="app">
    <Home />
  </div>
</template>

<style scoped>
.app > div {
  min-height: 100dvh;
}
</style>

<script setup>
import Titlebar from './components/Titlebar.vue';
import Editor from './views/Editor.vue';
import Home from './views/Home.vue';

</script>
