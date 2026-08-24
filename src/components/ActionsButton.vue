<template>
  <div :class="{ hidden }" @click="actionsMenu.show">
    <span></span>
    <span></span>
    <span></span>
  </div>
  <ActionsMenu />
</template>

<style scoped>
div {
  z-index: 100;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 3px;
  width: 40px;
  height: 40px;
  border-radius: 100%;
  transition: all 0.2s ease;
  position: absolute;
  margin-left: 10px;
  margin-top: 10px;

  &.hidden {
    opacity: 0;
  }

  &:hover {
    opacity: 1;
    background-color: var(--color-hover);
  }
}

span {
  display: block;
  border-radius: 100%;
  width: 4px;
  aspect-ratio: 1;
  background: var(--color-text);
}
</style>

<script setup>
import { actionsButton } from './ActionsButton.js'
import ActionsMenu from './Menu/ActionsMenu.vue'
import { actionsMenu } from './Menu/ActionsMenu.js'

const hidden = actionsButton.hidden
</script>
