<template>
  <MsgBox :hidden @hide="finish(null)">
    <div class="title">{{ title }}</div>
    <input ref="input" :placeholder="placeholder" v-model="text" @keydown.enter="finish(text)" />
    <div class="row">
      <button class="btn-secondary" @click="finish(null)">{{ i18n['msgbox-cancel'] }}</button>
      <button class="btn-primary" @click="finish(text)">
        {{ text.trim() ? i18n['msgbox-confirm'] : i18n['new-skip'] }}
      </button>
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

<script>
export const nameBox = {
  ask: () => Promise.resolve(null),
}
</script>

<script setup>
import { nextTick, ref } from 'vue'
import MsgBox from '@/basic/MsgBox.vue'
import { i18n } from '@/user/i18n.js'

const hidden = ref(true)
const title = ref('')
const placeholder = ref('')
const text = ref('')
const input = ref(null)
let resolve = null

function finish(value) {
  if (hidden.value) return
  hidden.value = true
  resolve?.(value == null ? null : value.trim())
  resolve = null
}

function ask(options) {
  title.value = options.title
  placeholder.value = options.placeholder ?? ''
  text.value = ''
  hidden.value = false
  nextTick(() => input.value?.focus())
  return new Promise((r) => {
    resolve = r
  })
}

nameBox.ask = ask
</script>
