<template>
  <MsgBox :hidden @hide="finish(null)">
    <div class="title">{{ title }}</div>
    <p v-if="hint">{{ hint }}</p>
    <input
      ref="input"
      type="password"
      :placeholder="i18n['library-password-placeholder']"
      v-model="text"
      @keydown.enter="finish(text)"
    />
    <div class="row">
      <button class="btn-secondary" @click="finish(null)">{{ i18n['msgbox-cancel'] }}</button>
      <button class="btn-primary" @click="finish(text)">{{ i18n['msgbox-confirm'] }}</button>
    </div>
  </MsgBox>
</template>

<style scoped>
.title {
  font-weight: bold;
}
p {
  margin-top: 8px;
  color: var(--color-text-muted);
  font-size: 14px;
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
const hint = ref('')
const text = ref('')
const input = ref(null)
let resolve = null

function finish(value) {
  if (hidden.value) return
  hidden.value = true
  resolve?.(value)
  resolve = null
}

function ask(options) {
  title.value = options.title
  hint.value = options.hint ?? ''
  text.value = options.value ?? ''
  hidden.value = false
  nextTick(() => input.value?.focus())
  return new Promise((r) => {
    resolve = r
  })
}

defineExpose({ ask })
</script>
