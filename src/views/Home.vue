<template>
  <div class="home">
    <div class="home-inner">
      <h1 class="home-title">{{ text['home-title'] }}</h1>
      <div class="home-actions">
        <div class="home-button-primary" @click="router.push('/editor')">
          {{ text['home-new-essay'] }}
        </div>
        <div class="home-button-secondary" @click="router.push('/library')">
          {{ text['home-open-library'] }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.home {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 1.5rem 18vh;
  color: var(--color-text);
}

.home-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  margin-top: -4vh;
}

.home-title {
  margin-bottom: 1rem;
  font-size: 3rem;
  font-weight: 600;
  letter-spacing: -0.03em;
  text-align: center;
  color: var(--color-heading);
}

.home-actions {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 1rem;
  width: 100%;
}

.home-button-primary,
.home-button-secondary {
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.7em 1.35em;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  background: transparent;
  color: var(--color-text);
  cursor: pointer;
  transition: all 0.15s ease-in;
  width: min(70%, 20rem);
}

.home-button-primary {
  background: var(--color-heading);
  border-color: var(--color-heading);
  color: var(--color-background);
}

.home-button-primary:hover {
  opacity: 0.8;
}

.home-button-secondary:hover {
  background: var(--color-background-soft);
  border-color: var(--color-border-hover);
}
</style>

<script setup>
import { useRouter } from 'vue-router'
import { text } from '@/components/state'

const router = useRouter()
</script>
