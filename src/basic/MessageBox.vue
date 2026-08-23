<template>
  <Overlay :show="open" @close="cancel">
    <div class="box">
      <div class="title">{{ title }}</div>
      <p v-if="message">{{ message }}</p>
      <input
        v-if="input"
        ref="inputEl"
        :type="type"
        :placeholder="placeholder"
        v-model="value"
        @keydown.enter.prevent="confirm"
      />
      <div class="actions">
        <button class="btn-secondary" @click="cancel">
          {{ i18n['msgbox-cancel'] }}
        </button>
        <button class="btn-primary" @click="confirm">
          {{ i18n['msgbox-confirm'] }}
        </button>
      </div>
    </div>
  </Overlay>
</template>

<style scoped>
.box {
  position: fixed;
  inset: 0;
  width: min(360px, calc(100% - 48px));
  height: fit-content;
  margin: auto;
  padding: 20px 20px 16px;
  border-radius: var(--border-radius-large);
  background: var(--color-foreground);
  box-shadow: var(--shadow-standard);
}

.title {
  font-weight: bold;
  color: var(--color-text-bold);
}

p {
  margin-top: 0.4rem;
  opacity: 0.7;
}

input {
  width: 100%;
  height: var(--control-height);
  margin-top: 12px;
  padding: 0 10px;
  border: 1px solid var(--color-border-strong);
  border-radius: var(--border-radius-standard);
  background: var(--color-control);
  color: var(--color-text);
  font: inherit;
  outline: none;
}

input:focus {
  border-color: var(--color-primary);
}

.actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  margin-top: 16px;

  button {
    min-width: 72px;
    height: var(--control-height);
    padding: 0 12px;
  }
}
</style>

<script setup>
import { nextTick, ref, watch } from 'vue'
import { i18n } from '@/user/i18n.js'
import Overlay from './Overlay.vue'

const open = defineModel('open')
const value = defineModel({ default: '' })
const props = defineProps({
  title: String,
  message: String,
  input: Boolean,
  type: { type: String, default: 'text' },
  placeholder: String,
})
const emit = defineEmits(['confirm', 'cancel'])
const inputEl = ref(null)

watch(open, async (isOpen) => {
  if (!isOpen || !props.input) return
  await nextTick()
  inputEl.value?.focus()
  inputEl.value?.select()
})

function confirm() {
  emit('confirm')
  open.value = false
}

function cancel() {
  emit('cancel')
  open.value = false
}
</script>
