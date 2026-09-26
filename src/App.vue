<template>
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
import Titlebar from './components/Titlebar.vue'
import Editor from './views/Editor.vue'
import { EditorManager, Session } from './user/api'

onMounted(() => {
  window.dismissStartupCover?.()

  if (!('launchQueue' in window)) return

  window.launchQueue.setConsumer(async ({ files }) => {
    const fileHandle = files[0]
    if (!fileHandle) return

    try {
      const file = await fileHandle.getFile()
      const content = await file.text()

      Session.fileHandle = fileHandle
      Session.isLoading = true
      try {
        EditorManager.fillText(content)
      } finally {
        Session.isLoading = false
      }
    } catch (error) {
      console.error('Failed to open the launched file:', error)
    }
  })
})
</script>
