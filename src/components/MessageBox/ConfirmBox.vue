<template>
  <MessageBox
    v-model:open="open"
    :title="title"
    :message="message"
    @confirm="emit('confirm')"
    @cancel="emit('cancel')"
  />
</template>

<script setup>
import MessageBox from '@/basic/MessageBox.vue'

defineProps({
  title: String,
  message: String,
})
const open = defineModel('open')
const emit = defineEmits(['confirm', 'cancel'])
</script>
