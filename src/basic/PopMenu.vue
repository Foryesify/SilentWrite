<template>
  <Overlay :hidden @hide="emit('hide')" />
  <Teleport to="body">
    <div class="popmenu" :class="{ hidden }" :style="pos" ref="el">
      <div v-for="v in items" @click="act(v[1])">{{ v[0] }}</div>
    </div>
  </Teleport>
</template>

<style scoped>
.popmenu {
  position: fixed;
  z-index: 201;
  min-width: 140px;
  padding: 4px;
  border: 1px solid var(--color-border-strong);
  border-radius: 6px;
  background: var(--color-foreground);
  box-shadow: var(--shadow-flyout);
  font-size: 13px;
  font-weight: normal;
  transition: opacity var(--duration-fast) var(--ease-accelerate);

  &.hidden {
    opacity: 0;
    pointer-events: none;
  }

  div {
    display: flex;
    align-items: center;
    height: 32px;
    padding: 0 12px;
    border-radius: 4px;
    cursor: pointer;
    white-space: nowrap;

    &:hover {
      background: var(--color-hover);
    }
  }
}
</style>

<script setup>
import { nextTick, ref, watch } from 'vue'
import Overlay from './Overlay.vue'

const { hidden, items, top, left } = defineProps({
  hidden: Boolean,
  items: Array,
  top: Number,
  left: Number,
})
const emit = defineEmits(['hide'])
const el = ref(null)
const pos = ref({ top: '0px', left: '0px' })

watch(
  () => [hidden, top, left],
  async () => {
    if (hidden) return
    pos.value = { top: top + 'px', left: left + 'px' }
    await nextTick()
    const w = el.value?.offsetWidth ?? 0
    const h = el.value?.offsetHeight ?? 0
    const vw = visualViewport?.width ?? innerWidth
    const vh = visualViewport?.height ?? innerHeight
    let x = left + w > vw ? left - w : left
    let y = top + h > vh ? top - h : top
    pos.value = {
      left: Math.min(Math.max(0, x), Math.max(0, vw - w)) + 'px',
      top: Math.min(Math.max(0, y), Math.max(0, vh - h)) + 'px',
    }
  },
)

function act(action) {
  action()
  emit('hide')
}
</script>
