<template>
  <Teleport to="body">
    <Transition name="fade" :duration="240">
      <div v-if="show" class="overlay">
        <div class="backdrop" @click="emit('close')" />
        <slot />
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  z-index: 110;
}

.backdrop {
  position: absolute;
  inset: 0;
  background: #8882;
  backdrop-filter: blur(var(--blur));
}

.fade-enter-active .backdrop,
.fade-leave-active .backdrop {
  transition: all var(--duration-fast) var(--ease-accelerate);
}

.fade-enter-from .backdrop,
.fade-leave-to .backdrop {
  background: #0000;
  backdrop-filter: blur(0);
}

.fade-enter-active :slotted(.menu),
.fade-leave-active :slotted(.menu) {
  transition: opacity var(--duration-fast) var(--ease-accelerate);
}

.fade-enter-from :slotted(.menu),
.fade-leave-to :slotted(.menu) {
  opacity: 0;
}
</style>

<script setup>
defineProps({
  show: { type: Boolean, default: true },
})
const emit = defineEmits(['close'])
</script>
