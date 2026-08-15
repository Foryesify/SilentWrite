<template>
  <div class="menu" :class="{ flat: isFlat }" @mouseleave="onMouseLeave">
    <div
      v-for="(item, index) in items.items"
      :key="index"
      class="item"
      :class="{ leaf: isLeaf(item) }"
      @click="onItemClick(index)"
      @mouseenter="onItemEnter(index)"
    >
      {{ item.name }}
    </div>
    <div
      v-if="!isFlat"
      class="submenu"
      :class="{ hidden: openIndex < 0 }"
      :style="{
        marginTop: submenuTop,
        width: submenuWidth,
        height: submenuHeight,
      }"
    >
      <div class="submenu-clip">
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
  </div>
</template>

<style scoped>
.menu,
.submenu {
  min-width: 140px;
  background: var(--color-background);
  border: 1px solid #8885;
  border-radius: 6px;
  font-size: 13px;
}

.menu {
  position: relative;
  padding: 4px;
  box-shadow: 0 4px 16px #0002;
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

.item.leaf {
  cursor: pointer;
}

@media (hover: hover) {
  .item:hover,
  .subitem:hover {
    background: var(--color-hover);
  }
}

.submenu {
  position: absolute;
  box-sizing: content-box;
  left: calc(100% - 2px);
  top: 0;
  box-shadow: 0 8px 24px #0003;
  transition:
    margin-top 0.2s ease,
    width 0.2s ease,
    height 0.2s ease,
    opacity 0.2s ease,
    transform 0.2s ease;
}

.submenu-clip {
  overflow: hidden;
  width: 100%;
  height: 100%;
  border-radius: inherit;
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
  }

  .menu {
    box-shadow: 0 6px 20px #0005;
  }

  .submenu {
    box-shadow: 0 10px 32px #0008;
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
const hoverLocked = ref(false)
const submenuTop = ref('0px')
const submenuWidth = ref('140px')
const submenuHeight = ref('0px')
const bodyEl = ref(null)

function isLeaf(item) {
  return !item?.children?.length
}

const isFlat = computed(() => props.items.items.every(isLeaf))

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

async function open(index) {
  const wasClosed = openIndex.value < 0
  follow(index)
  lastIndex.value = index
  await nextTick()
  measure()
  if (wasClosed) await nextTick()
  openIndex.value = index
}

function activate(index) {
  if (hoverLocked.value) return
  open(index)
}

function collapse(index) {
  if (openIndex.value === index && hoverLocked.value) {
    openIndex.value = -1
    hoverLocked.value = false
    return
  }
  hoverLocked.value = true
  if (openIndex.value !== index) open(index)
}

function onItemEnter(index) {
  if (isFlat.value || isLeaf(props.items.items[index])) {
    if (!hoverLocked.value) openIndex.value = -1
    return
  }
  activate(index)
}

function onItemClick(index) {
  const item = props.items.items[index]
  if (isLeaf(item)) {
    run(item)
    return
  }
  collapse(index)
}

function onMouseLeave() {
  if (hoverLocked.value) return
  openIndex.value = -1
}

function run(item) {
  item.action?.()
  openIndex.value = -1
  hoverLocked.value = false
  emit('action')
}
</script>
