<template>
  <Overlay :show="show" @close="emit('action')">
    <div
      ref="el"
      class="menu"
      :style="{ top: `${pos.top}px`, left: `${pos.left}px` }"
    >
      <div v-for="v in items.items" class="item" @click="run(v)">
        {{ v.name }}
      </div>
    </div>
  </Overlay>
</template>

<style scoped>
.menu {
  position: fixed;
  min-width: 140px;
  padding: 4px;
  background: var(--color-background);
  border: 1px solid #8885;
  border-radius: 6px;
  font-size: 13px;
  box-shadow: 0 4px 16px #0002;
}

.item {
  display: flex;
  align-items: center;
  height: 32px;
  padding: 0 12px;
  border-radius: 4px;
  cursor: pointer;
  white-space: nowrap;
  transition: background var(--duration-fast) var(--ease-accelerate);
}

@media (hover: hover) {
  .item:hover {
    background: var(--color-hover);
  }
}

@media (prefers-color-scheme: dark) {
  .menu {
    border-color: #fff2;
    box-shadow: 0 6px 20px #0005;
  }
}
</style>

<script setup>
import { nextTick, reactive, ref, watch } from 'vue'
import Overlay from './Overlay.vue'
import { Menu } from './Menu'

const props = defineProps({
  items: Menu,
  show: { type: Boolean, default: true },
  top: Number,
  left: Number,
})
const emit = defineEmits(['action'])
const el = ref(null)
const pos = reactive({ top: props.top ?? 0, left: props.left ?? 0 })

const PAD = 8

function fit() {
  const box = el.value
  if (!box) return
  const w = box.offsetWidth
  const h = box.offsetHeight
  const maxL = window.innerWidth - PAD - w
  const maxT = window.innerHeight - PAD - h
  let left = props.left
  let top = props.top
  if (left > maxL) left = props.left - w
  if (top > maxT) top = props.top - h
  pos.left = Math.min(Math.max(left, PAD), Math.max(PAD, maxL))
  pos.top = Math.min(Math.max(top, PAD), Math.max(PAD, maxT))
}

watch(
  () => [props.show, props.top, props.left],
  () => {
    pos.top = props.top ?? 0
    pos.left = props.left ?? 0
    if (props.show) nextTick(fit)
  },
  { immediate: true },
)

function run(item) {
  item.action?.()
  emit('action')
}
</script>
