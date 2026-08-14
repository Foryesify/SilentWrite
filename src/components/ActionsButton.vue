<template>
  <div class="actions-button" 
  :style="menuHidden ? {} : { opacity: 1 }"
   @click="menuHidden = !menuHidden">
    <span></span>
    <span></span>
    <span></span>
  </div>
  <div class="actions-menu" :class="{ hidden: menuHidden }"></div>
</template>

<style scoped>
.actions-button {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 3px;
  width: 40px;
  height: 40px;
  margin-top: 8px;
  margin-left: 8px;
  cursor: pointer;
  z-index: 100;
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
  }

  &:active {
    background-color: var(--color-hover-darker);
  }

  &:hover {
    opacity: 1;
  }
}

.actions-menu {
  position: fixed;
  margin-top: 55px;
  margin-left: 10px;
  width: 100px;
  height: 100px;
  z-index: 100;
  transition: all 0.2s ease-out;

  &.hidden {
    opacity: 0;
    visibility: hidden;
    pointer-events: none;
  }
}
</style>

<script setup>
import { ref } from 'vue'

const menuHidden = ref(true)
</script>
