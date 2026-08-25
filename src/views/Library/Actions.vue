<template>
  <PopMenu :hidden :items :top :left @hide="hidden = true" />
  <Rename ref="rename" />
  <Password ref="password" />
</template>

<script setup>
import { ref } from 'vue'
import PopMenu from '@/basic/PopMenu.vue'
import { i18n } from '@/user/i18n.js'
import Rename from './Rename.vue'
import Password from './Password.vue'

const { folder, unlock } = defineProps({
  folder: Object,
  unlock: Function,
})

const hidden = ref(true)
const top = ref(0)
const left = ref(0)
const rename = ref(null)
const password = ref(null)
let target = null
let index = -1

const items = [
  [i18n.value['library-rename'], doRename],
  [i18n.value['library-password'], doPassword],
  [i18n.value['library-delete'], doDelete],
]

function open(event, item, i) {
  target = item
  index = i
  top.value = event.clientY
  left.value = event.clientX
  hidden.value = false
}

async function doRename() {
  hidden.value = true
  if (!(await unlock(target))) return
  rename.value.open(target)
}

async function doPassword() {
  hidden.value = true
  if (!(await unlock(target))) return
  const next = await password.value.ask({
    title: i18n.value['library-password-prompt'],
    hint: target.password ? i18n.value['library-password-hint'] : '',
  })
  if (next == null) return
  target.setPassword(next)
}

async function doDelete() {
  hidden.value = true
  if (!(await unlock(target))) return
  folder.deleteChild(index)
}

defineExpose({ open })
</script>
