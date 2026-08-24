<template>
  <Teleport to="body">
    <!-- 为了展示出场动画，每个东西都加一个:class hidden就行 -->
    <div class="overlay" :class="hidden">
      <div class="backdrop" :class="hidden" @click="overlay.hide()">
        <div class="content" :class="hidden">
          <slot v-if="!hidden"/>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.overlay {
  position: fixed;
  left: -50vw;
  top: -50vh;
  width: 200vw;
  height: 200vh;

  &.hidden {
    pointer-events: none;
  }
}

.backdrop {
  z-index: 200;
  display: grid;
  place-items: center;
  width: 100%;
  height: 100%;
  background-color: #7772;
  transition: all var(--duration-fast) var(--ease-accelerate);

  &.hidden {
    opacity: 0;
  }
}

.content {
  z-index: 201;
  margin-bottom: 3vh;
  transition: all var(--duration-fast) var(--ease-accelerate);
  
  &.hidden {
    opacity: 0;
    transform: scale(0.8);
  }
}
</style>

<script setup>
import { computed } from 'vue'
import { overlay } from './Overlay.js'

const hidden = computed(() => {
  return overlay.hidden ? 'hidden' : ''
})
</script>
