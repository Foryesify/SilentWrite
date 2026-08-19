<template>
  <div class="home">
    <WindowControls />
    <div class="main">
      <button class="btn-primary" @click="newEssay">
        {{ i18n['home-new-essay'] }}
      </button>
      <button class="btn-secondary" @click="openLibrary">
        {{ i18n['home-open-library'] }}
      </button>
    </div>
  </div>
</template>

<script setup>
import WindowControls from '@/components/WindowControls.vue'
import i18n from '@/i18n'
import { changePage } from '@/router';

function newEssay() {
  changePage('Editor')
}

function openLibrary() {
  changePage('Library')
}
</script>

<style scoped>
.home {
  display: grid;
  place-items: center;
  background-color: var(--color-foreground);
}

.main {
  width: min(380px, 100%);
  margin-bottom: 8dvh;

  button {
    width: 100%;
    height: 50px;
    font-size: 18px;
    margin-bottom: 20px;
  }
}
</style>
