<template>
  <PopMenu :top="50" :left="10" :hidden :items @hide="emit('hide')" />
</template>

<script setup>
import PopMenu from '@/basic/PopMenu.vue'
import { i18n } from '@/user/i18n';
import { page } from '@/user/session';

const { hidden } = defineProps({ hidden: Boolean })
const emit = defineEmits(['hide'])
const items = [
  [i18n.value['editor-return-home'], () => page.value = "Home"],
  
]
</script>
