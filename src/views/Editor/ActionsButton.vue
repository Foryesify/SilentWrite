<template>
  <Commands :hidden="!showCommands" @hide="showCommands = false" />
  <div class="actions-button" :class="{ hidden }" @click="showCommands = !showCommands">
    <span></span>
    <span></span>
    <span></span>
  </div>
</template>

<style scoped>
.actions-button {
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
  top: 10px;
  left: 10px;

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
import { ref } from 'vue'
import Commands from '@/components/Commands.vue'

defineProps({
  hidden: Boolean,
})

const showCommands = ref(false)
</script>
