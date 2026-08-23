<template>
  <div
    class="actions-button"
    :class="{ hidden: actionsButtonHidden, open: !menuHidden }"
    @click="toggle"
  >
    <span></span>
    <span></span>
    <span></span>
  </div>
  <Menu
    :show="!menuHidden"
    :top="at.top"
    :left="at.left"
    :items="appMenu"
    @action="menuHidden = true"
  />
</template>

<style scoped>
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
</style>

<script setup>
import { computed, reactive, ref, watch } from 'vue'
import Menu from '@/basic/Menu.vue'
import { Menu as MenuModel, MenuItem } from '@/basic/Menu.js'
import { i18n } from '@/user/i18n.js'
import { changePage } from '@/user/session.js'
import { actionsButtonHidden } from './ActionsButton.js'

const menuHidden = ref(true)
const at = reactive({ top: 0, left: 0 })

function toggle(event) {
  if (menuHidden.value) {
    at.top = event.clientY
    at.left = event.clientX
  }
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
