<template>
  <div
    class="actions-backdrop"
    :class="{ hidden: menuHidden }"
    @click="menuHidden = true"
  />
  <div
    class="actions-button"
    :style="menuHidden ? {} : { opacity: 1 }"
    @click="menuHidden = !menuHidden"
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
  transition: opacity 0.2s ease-out, visibility 0.2s ease-out;

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
  z-index: 111;
  transition: all 0.2s ease;
  border-radius: 100%;
  opacity: 0;
  position: fixed;
  margin-top: 10px;
  margin-left: 10px;

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
import { computed, ref } from 'vue'
import Menu from '@/basic/Menu.vue'
import { Menu as MenuModel, MenuItem, MenuItemChild } from '@/basic/Menu'
import i18n from '@/i18n'
import { newEssay, openLibrary, saveEssay, saveEssayAs, appwindow } from '@/userfunc'
import { router } from '@/router'

const menuHidden = ref(true)

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
