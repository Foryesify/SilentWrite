<template>
  <div class="menu">
    <div
      v-for="(item, index) in items.items"
      :key="index"
      class="item"
      :class="{ open: openIndex === index }"
      @click="collapse(index)"
    >
      {{ item.name }}
      <div v-if="openIndex === index" class="submenu">
        <div
          v-for="(child, cIndex) in item.children"
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
  padding: 4px;
  background: var(--color-background);
  border: 1px solid #8885;
  box-shadow: 0 4px 16px #0002;
  border-radius: 6px;
  font-size: 13px;
}

.item,
.subitem {
  position: relative;
  display: flex;
  align-items: center;
  height: 32px;
  padding: 0 12px;
  border-radius: 4px;
  cursor: default;
}

.item:hover,
.item.open,
.subitem:hover {
  background: var(--color-hover);
}

.submenu {
  position: absolute;
  left: calc(100% - 2px);
  top: -4px;
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
import { ref } from 'vue'
import { Menu } from './Menu'

defineProps({ items: Menu })

const openIndex = ref(-1)

function collapse(index) {
  openIndex.value = openIndex.value === index ? -1 : index
}

function run(child) {
  child.action?.()
  openIndex.value = -1
}
</script>
