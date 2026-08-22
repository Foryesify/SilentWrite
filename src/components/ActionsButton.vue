<template>
  <div class="actions-backdrop" :class="{ hidden: menuHidden }" @click="toggle" />
  <div
    class="actions-button"
    :class="{ hidden: actionsButtonHidden, open: !menuHidden }"
    @click="toggle"
  >
    <span></span>
    <span></span>
    <span></span>
  </div>
  <div class="actions-menu" :class="{ hidden: menuHidden }">
    <Menu v-if="!menuHidden" :items="appMenu" @action="menuHidden = true" />
  </div>
</template>

<style scoped>
.actions-backdrop {
  position: fixed;
  inset: 0;
  z-index: 110;
  background: #0008;
  transition: all var(--duration-normal) var(--ease-accelerate);

  &.hidden {
    opacity: 0;
    visibility: hidden;
    pointer-events: none;
  }
}

.actions-button {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 3px;
  width: 40px;
  height: 40px;
  cursor: pointer;
  z-index: 100;
  transition: all 0.2s ease;
  border-radius: 100%;
  opacity: 1;
  position: fixed;
  margin-top: 10px;

  span {
    display: block;
    border-radius: 100%;
    width: 4px;
    aspect-ratio: 1;
    background: var(--color-text);
  }

  &.hidden {
    opacity: 0;
  }

  &:hover,
  &.open {
    opacity: 1;
    background-color: var(--color-hover);
  }

  &:active {
    background-color: var(--color-hover-darker);
  }
}

.actions-menu {
  position: fixed;
  margin-top: 55px;
  margin-left: 10px;
  z-index: 111;
  transition: all 0.2s ease-out;

  &.hidden {
    opacity: 0;
    visibility: hidden;
    pointer-events: none;
  }
}
</style>

<script setup>
import { computed, ref, watch } from 'vue'
import Menu from '@/basic/Menu.vue'
import { Menu as MenuModel, MenuItem } from '@/basic/Menu.js'
import { i18n } from '@/user/i18n.js'
import { changePage } from '@/user/session.js'
import { actionsButtonHidden } from './ActionsButton.js'

const menuHidden = ref(true)

function toggle() {
  menuHidden.value = !menuHidden.value
}

watch(actionsButtonHidden, (hidden) => {
  if (hidden) menuHidden.value = true
})

const appMenu = computed(
  () =>
    new MenuModel([
      new MenuItem(i18n.value['editor-return-home'], () => changePage('Home')),
    ]),
)
</script>
