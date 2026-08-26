<template>
  <PopMenu :top="15" :left="10" :hidden :items @hide="emit('hide')" />
</template>

<script setup>
import { computed } from 'vue'
import PopMenu from '@/basic/PopMenu.vue'
import { i18n, toggleLang } from '@/user/i18n.js'
import { page } from '@/user/session.js'
import { exportUserdata, importUserdata } from '@/user/api.js'

const { hidden } = defineProps({ hidden: Boolean })
const emit = defineEmits(['hide'])
const items = computed(() => [
  [i18n.value['editor-return-home'], () => { page.value = 'Home' }],
  [i18n.value['editor-export'], exportUserdata],
  [i18n.value['editor-import'], importUserdata],
  [i18n.value['editor-language'], toggleLang],
])
</script>
