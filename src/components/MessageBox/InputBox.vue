<template>
  <MessageBox
    v-model:open="open"
    :title="title"
    :message="message"
    @confirm="emit('confirm')"
    @cancel="emit('cancel')"
  >
    <template #default="{ confirm }">
      <input
        ref="inputEl"
        :type="type"
        :placeholder="placeholder"
        v-model="text"
        @keydown.enter.prevent="confirm"
      />
    </template>
  </MessageBox>
</template>

<style scoped>
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
</style>

<script setup>
import { nextTick, ref, watch } from 'vue'
import MessageBox from '@/basic/MessageBox.vue'

const open = defineModel('open')
const text = defineModel({ default: '' })
defineProps({
  title: String,
  message: String,
  type: { type: String, default: 'text' },
  placeholder: String,
})
const emit = defineEmits(['confirm', 'cancel'])
const inputEl = ref(null)

watch(open, async (isOpen) => {
  if (!isOpen) return
  await nextTick()
  inputEl.value?.focus()
  inputEl.value?.select()
})
</script>
