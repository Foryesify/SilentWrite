<template>
  <div class="backdrop" :class="{ hidden: menuHidden }" @click="toggle" />
  <div class="button" :style="menuHidden ? {} : { opacity: 1 }" @click="toggle">
    <span></span>
    <span></span>
    <span></span>
  </div>
  <div class="menu" :class="{ hidden: menuHidden }">
    <Menu v-if="!menuHidden" :items="appMenu" @action="menuHidden = true" />
  </div>
</template>

<style scoped>
.backdrop {
  position: fixed;
  top: -10vw;
  height: -10vh;
  width: 120vw;
  height: 120vh;
  z-index: 101;
  background: #0008;
  transition: all 0.2s ease-out;

  &.hidden {
    opacity: 0;
    visibility: hidden;
    pointer-events: none;
  }
}

.button {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 3px;
  width: 48px;
  height: 32px;
  cursor: pointer;
  z-index: 100;
  transition: all 0.2s ease;
  position: fixed;

  span {
    display: block;
    border-radius: 100%;
    width: 4px;
    aspect-ratio: 1;
    background: var(--color-text);
  }

  &:hover {
    background-color: var(--color-hover);
    opacity: 1;
  }
}

.menu {
  position: fixed;
  margin-top: 15px;
  margin-left: 10px;
  z-index: 102;
  transition: all 0.2s ease-out;

  &.hidden {
    opacity: 0;
    visibility: hidden;
    pointer-events: none;
  }
}
</style>

<script setup>
import { computed, ref } from 'vue'
import Menu from '@/basic/Menu.vue'
import { Menu as MenuModel, MenuItem, MenuItemChild } from '@/basic/Menu'
import i18n from '@/i18n'
import {
  newEssay,
  openLibrary,
  saveEssay,
  saveEssayAs,
  appwindow,
} from '@/userfunc'
import { router } from '@/router'

const menuHidden = ref(true)

function toggle() {
  menuHidden.value = !menuHidden.value
}
const appMenu = computed(
  () =>
    new MenuModel([
      new MenuItem(i18n.value['titlebar-file'], [
        new MenuItemChild(i18n.value['titlebar-file1'], newEssay),
        new MenuItemChild(i18n.value['titlebar-file2']),
        new MenuItemChild(i18n.value['titlebar-file4'], openLibrary),
        new MenuItemChild(i18n.value['titlebar-file-save'], saveEssay),
        new MenuItemChild(i18n.value['titlebar-file5'], saveEssayAs),
      ]),
      new MenuItem(i18n.value['titlebar-edit'], [
        new MenuItemChild(i18n.value['titlebar-edit1']),
        new MenuItemChild(i18n.value['titlebar-edit2']),
        new MenuItemChild(i18n.value['titlebar-edit3']),
        new MenuItemChild(i18n.value['titlebar-edit4']),
        new MenuItemChild(i18n.value['titlebar-edit5']),
        new MenuItemChild(i18n.value['titlebar-edit6']),
      ]),
      new MenuItem(i18n.value['titlebar-view'], [
        new MenuItemChild(i18n.value['titlebar-view1'], () =>
          appwindow.toggleFullscreen(),
        ),
        new MenuItemChild(i18n.value['titlebar-view2']),
      ]),
      new MenuItem(i18n.value['titlebar-settings'], [
        new MenuItemChild(i18n.value['titlebar-settings1'], () =>
          router.push({ name: 'Settings' }),
        ),
        new MenuItemChild(i18n.value['titlebar-settings2']),
      ]),
      new MenuItem(i18n.value['titlebar-help'], [
        new MenuItemChild(i18n.value['titlebar-help1']),
        new MenuItemChild(i18n.value['titlebar-help2']),
        new MenuItemChild(i18n.value['titlebar-help3']),
        new MenuItemChild(i18n.value['titlebar-help4']),
        new MenuItemChild(i18n.value['titlebar-help5']),
        new MenuItemChild(i18n.value['titlebar-help6']),
      ]),
    ]),
)
</script>
