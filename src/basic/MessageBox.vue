<template>
  <Teleport to="body">
    <div
      v-if="open"
      class="msgbox-root"
      @mousedown.self="onCancel"
    >
      <div
        class="msgbox"
        role="dialog"
        aria-modal="true"
        @keydown.esc.prevent="onCancel"
      >
        <div class="msgbox-title">{{ title }}</div>
        <p v-if="message" class="msgbox-message">{{ message }}</p>
        <input
          v-if="input"
          ref="inputEl"
          class="msgbox-input"
          :type="type"
          :placeholder="placeholder"
          :value="modelValue"
          @input="$emit('update:modelValue', $event.target.value)"
          @keydown.enter.prevent="onConfirm"
        />
        <div class="msgbox-actions">
          <button class="btn-secondary" type="button" @click="onCancel">
            {{ i18n['msgbox-cancel'] }}
          </button>
          <button class="btn-primary" type="button" @click="onConfirm">
            {{ i18n['msgbox-confirm'] }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.msgbox-root {
  position: fixed;
  inset: 0;
  z-index: 40;
  display: grid;
  place-items: center;
  background: #0004;
  padding: 24px;
}

.msgbox {
  width: min(360px, 100%);
  padding: 20px 20px 16px;
  border-radius: var(--border-radius-large);
  background: var(--color-foreground);
  box-shadow: var(--shadow-standard);
}

.msgbox-title {
  font-weight: bold;
  color: var(--color-text-bold);
}

.msgbox-message {
  margin-top: 0.4rem;
  opacity: 0.7;
}

.msgbox-input {
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

.msgbox-input:focus {
  border-color: var(--color-primary);
}

.msgbox-actions {
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

@media (prefers-color-scheme: dark) {
  .msgbox-root {
    background: #0008;
  }
}
</style>

<script setup>
import { nextTick, ref, watch } from 'vue'
import { i18n } from '@/user/i18n.js'

const props = defineProps({
  open: Boolean,
  title: { type: String, default: '' },
  message: { type: String, default: '' },
  input: Boolean,
  type: { type: String, default: 'text' },
  placeholder: { type: String, default: '' },
  modelValue: { type: String, default: '' },
})

const emit = defineEmits(['update:open', 'update:modelValue', 'confirm', 'cancel'])
const inputEl = ref(null)

watch(
  () => props.open,
  async (open) => {
    if (!open || !props.input) return
    await nextTick()
    inputEl.value?.focus()
    inputEl.value?.select()
  },
)

function onConfirm() {
  emit('confirm')
  emit('update:open', false)
}

function onCancel() {
  emit('cancel')
  emit('update:open', false)
}
</script>
