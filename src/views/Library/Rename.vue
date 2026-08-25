<template>
  <MsgBox :hidden @hide="hidden = true">
    <div class="title">{{ title }}</div>
    <input ref="input" v-model="text" @keydown.enter="ok" />
    <div class="row">
      <button class="btn-secondary" @click="hidden = true">{{ i18n['msgbox-cancel'] }}</button>
      <button class="btn-primary" @click="ok">{{ i18n['msgbox-confirm'] }}</button>
    </div>
  </MsgBox>
</template>

<style scoped>
.title {
  font-weight: bold;
}
input {
  width: 100%;
  height: var(--control-height);
  margin: 12px 0;
  padding: 0 10px;
  border: 1px solid var(--color-border-strong);
  border-radius: var(--border-radius-standard);
  background: var(--color-control);
  color: var(--color-text);
  font: inherit;
  outline: none;
}
.row {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}
button {
  height: var(--control-height);
  padding: 0 12px;
}
</style>

<script setup>
import { nextTick, ref } from 'vue'
import MsgBox from '@/basic/MsgBox.vue'
import { i18n } from '@/user/i18n.js'

const hidden = ref(true)
const title = ref('')
const text = ref('')
const input = ref(null)
let target = null

function open(item) {
  target = item
  title.value = i18n.value[item.children ? 'library-rename-folder-prompt' : 'library-rename-prompt']
  text.value = (item.children ? item.name : item.title) ?? ''
  hidden.value = false
  nextTick(() => {
    input.value?.focus()
    input.value?.select()
  })
}

function ok() {
  if (target.children) target.name = text.value
  else target.title = text.value
  hidden.value = true
}

defineExpose({ open })
</script>
