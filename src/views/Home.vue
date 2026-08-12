<template>
  <div class="home">
    <div class="title">{{ i18n['home-title'] }}</div>
    <div class="buttons">
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
import i18n from '@/i18n';
import { newEssay, openLibrary } from '@/userfunc'
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

.buttons {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 14rem;
  margin-bottom: 15dvh;
}

.button-primary,
.button-secondary {
  padding: 0.4rem 0.75rem;
  text-align: center;
  border-radius: 4px;
  cursor: pointer;transition: all 0.2s ease;
}

.button-primary {
  background: var(--color-bold);
  color: var(--color-background);
}

.button-primary:hover {
  opacity: 0.7;
}

.button-secondary {
  border: 1px solid #7775;
}

.button-secondary:hover {
  background: var(--color-hover);
}
</style>
