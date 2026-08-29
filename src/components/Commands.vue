<template>
  <PopMenu :top="15" :left="10" :hidden :items @hide="emit('hide')" />
</template>

<script setup>
import { computed } from 'vue'
import PopMenu from '@/basic/PopMenu.vue'
import { i18n, toggleLang } from '@/user/i18n.js'
import { page } from '@/user/session.js'
import { isDiskDoc } from '@/user/document.js'
import { canPickMarkdown, exportUserdata, importUserdata, openMarkdown, saveMarkdown } from '@/user/api.js'

const { hidden } = defineProps({ hidden: Boolean })
const emit = defineEmits(['hide'])
const canOpenFile = canPickMarkdown()
const items = computed(() => [
  ...(page.value !== 'Home' ? [[i18n.value['editor-return-home'], () => { page.value = 'Home' }]] : []),
  ...(canOpenFile ? [[i18n.value['editor-open-file'], openMarkdown]] : []),
  ...(isDiskDoc.value ? [[i18n.value['editor-save-file'], saveMarkdown]] : []),
  [i18n.value['editor-export'], exportUserdata],
  [i18n.value['editor-import'], importUserdata],
  [i18n.value['editor-language'], toggleLang],
])
</script>
