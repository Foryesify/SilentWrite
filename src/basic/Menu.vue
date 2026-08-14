<template>
  <div class="menu" @mouseleave="openIndex = -1">
    <div
      v-for="(item, index) in items.items"
      :key="index"
      class="item"
      :class="{ open: openIndex === index }"
      @click="collapse(index)"
      @mouseenter="activate(index)"
    >
      {{ item.name }}
    </div>
    <div
      class="submenu"
      :class="{ hidden: openIndex < 0 }"
      :style="{
        marginTop: submenuTop,
        width: submenuWidth,
        height: submenuHeight,
      }"
    >
      <div ref="bodyEl" class="submenu-body">
        <div
          v-for="(child, cIndex) in currentChildren"
          :key="cIndex"
          class="subitem"
          @click.stop="run(child)"
        >
          {{ child.name }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.menu,
.submenu {
  min-width: 140px;
  background: var(--color-background);
  border: 1px solid #8885;
  box-shadow: 0 4px 16px #0002;
  border-radius: 6px;
  font-size: 13px;
}

.menu {
  position: relative;
  padding: 4px;
}

.item,
.subitem {
  display: flex;
  align-items: center;
  height: 32px;
  padding: 0 12px;
  border-radius: 4px;
  cursor: default;
  white-space: nowrap;
  transition: background 0.15s ease;
}

.item:hover,
.item.open,
.subitem:hover {
  background: var(--color-hover);
}

.submenu {
  position: absolute;
  box-sizing: content-box;
  margin-left: calc(100% - 2px);
  top: 0;
  overflow: hidden;
  transition:
    margin-top 0.2s ease,
    width 0.2s ease,
    height 0.2s ease,
    opacity 0.2s ease,
    transform 0.2s ease;
}

.submenu-body {
  padding: 4px;
  width: max-content;
  min-width: 140px;
}

.submenu.hidden {
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
  transform: translateY(-6px);
  transition:
    opacity 0.2s ease,
    visibility 0.2s ease,
    transform 0.2s ease;
}

@media (prefers-color-scheme: dark) {
  .menu,
  .submenu {
    border-color: #fff2;
    box-shadow: 0 6px 20px #0005;
  }
}
</style>

<script setup>
import { computed, nextTick, ref } from 'vue'
import { Menu } from './Menu'

const props = defineProps({ items: Menu })
const emit = defineEmits(['action'])

const ITEM_HEIGHT = 32
const openIndex = ref(-1)
const lastIndex = ref(0)
const submenuTop = ref('0px')
const submenuWidth = ref('140px')
const submenuHeight = ref('0px')
const bodyEl = ref(null)

const currentChildren = computed(
  () => props.items.items[lastIndex.value]?.children ?? [],
)

function follow(index) {
  submenuTop.value = `${index * ITEM_HEIGHT}px`
}

function measure() {
  const el = bodyEl.value
  if (!el) return
  submenuWidth.value = `${el.offsetWidth}px`
  submenuHeight.value = `${el.offsetHeight}px`
}

async function activate(index) {
  const wasClosed = openIndex.value < 0
  follow(index)
  lastIndex.value = index
  await nextTick()
  measure()
  if (wasClosed) await nextTick()
  openIndex.value = index
}

function collapse(index) {
  if (openIndex.value === index) {
    openIndex.value = -1
    return
  }
  activate(index)
}

function run(child) {
  child.action?.()
  openIndex.value = -1
  emit('action')
}
</script>
