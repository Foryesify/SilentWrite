<template>
  <div class="home">
    <div class="main">
      <div class="button-primary" @click="newEssay">
        {{ i18n['home-new-essay'] }}
      </div>
      <div class="button-secondary" @click="openLibrary">
        {{ i18n['home-open-library'] }}
      </div>
    </div>
  </div>
</template>

<script setup>
import i18n from '@/i18n'
import { router } from '@/router';

function newEssay() {
  router.push('/editor')
}

function openLibrary() {
  router.push("/library")
}
</script>

<style scoped>
.home {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1.25rem;
  padding: 1.5rem;
}

.title {
  font-size: 1.5rem;
  color: var(--color-bold);
}

.main {
  width: 350px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 15vh;
}

.button-primary,
.button-secondary {
  padding: 10px 0;
  text-align: center;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.button-primary {
  background: var(--color-bold);
  color: var(--color-background);
}

.button-primary:hover {
  opacity: 0.8;
}

.button-secondary {
  border: 1px solid #7775;
}

.button-secondary:hover {
  background: var(--color-hover);
}
</style>
