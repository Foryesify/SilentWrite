<template>
  <Titlebar />
  <div class="app">
    <Editor />
  </div>
</template>

<style scoped>
.app > div {
  min-height: 100dvh;
}
</style>

<script setup>
import { onMounted } from 'vue'
import Titlebar from './Titlebar.vue'
import Editor from './Editor.vue'
import { EditorManager, Session } from './api.js'

</script>
