<template>
  <div class="actions-button-container">
    <div class="actions-button" @click="">
      <span></span>
      <span></span>
      <span></span>
    </div>
  </div>
  <div class="actions-menu" v-bind:hidden="menuHidden"></div>
</template>

<style scoped>
.actions-button-container {
  opacity: 0;
  transition: all 0.2s ease;
  position: sticky;
  width: 150px;
  height: 100px;

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
  }

  &:hover {
    opacity: 1;
  }
}
</style>

<script>
import { ref } from 'vue';

const menuHidden = ref(true); 
</script>
