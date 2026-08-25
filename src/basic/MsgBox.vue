<template>
  <Overlay :hidden @hide="emit('hide')" />
  <Teleport to="body">
    <div class="msgbox" :class="{ hidden }"><slot /></div>
  </Teleport>
</template>

<style scoped>
.msgbox {
  position: fixed;
  z-index: 201;
  inset: 0 0 5vh;
  width: min(360px, calc(100% - 32px));
  height: fit-content;
  margin: auto;
  padding: 20px 20px 16px;
  border-radius: var(--border-radius-large);
  background: var(--color-foreground);
  box-shadow: var(--shadow-standard);

  &.hidden {
    opacity: 0;
    pointer-events: none;
  }
}
</style>

<script setup>
import Overlay from './Overlay.vue'

const { hidden } = defineProps({
  hidden: { type: Boolean, default: true },
})
const emit = defineEmits(['hide'])
</script>
