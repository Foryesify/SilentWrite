<template>
  <Teleport to="body">
    <div class="overlay" :class="{ hidden }">
      <div class="backdrop" :class="{ hidden }" @click="emit('hide')"></div>
    </div>
  </Teleport>
</template>

<style scoped>
.overlay {
  position: fixed;
  z-index: 200;
  left: -50vw;
  top: -50vh;
  width: 200vw;
  height: 200vh;

  &.hidden {
    pointer-events: none;
  }
}

.backdrop {
  display: grid;
  place-items: center;
  width: 100%;
  height: 100%;
  background-color: #7776;
  transition: all var(--duration-fast) var(--ease-accelerate);

  &.hidden {
    opacity: 0;
  }
}
</style>

<script setup>
const { hidden } = defineProps({
  hidden: { type: Boolean, default: true },
})
const emit = defineEmits(['hide'])
</script>
