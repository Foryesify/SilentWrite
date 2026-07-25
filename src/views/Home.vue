<template>
  <div class="home">
    <div class="home-inner">
      <h1 class="home-title" v-html="text['home-title']"></h1>
      <p class="home-subtitle">{{ text['home-subtitle'] }}</p>
      <div class="home-actions">
        <button class="home-new-essay" @click="router.push('/editor')">
          {{ text['home-new-essay'] }}
        </button>
        <button class="home-open-library" @click="router.push('/library')">
          {{ text['home-open-library'] }}
        </button>
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
  width: 100%;
  margin-top: -4vh;
  text-align: center;
}

.home-title {
  margin: 0;
  font-size: clamp(2.25rem, 5vw, 3.25rem);
  font-weight: 600;
  line-height: 1.5;
  letter-spacing: -0.03em;
  color: var(--color-heading);
}

.home-subtitle {
  margin: 1.1rem 0 0;
  font-size: clamp(1.125rem, 2.2vw, 1.375rem);
  line-height: 1.5;
  color: var(--cm-muted, rgba(28, 28, 28, 0.5));
}

.home-actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.85rem 1.5rem;
  margin-top: 2.75rem;
}

.home-new-essay,
.home-open-library {
  appearance: none;
  margin: 0;
  padding: 0.7em 1.35em;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  background: transparent;
  color: var(--color-text);
  font: inherit;
  font-size: 1.0625rem;
  cursor: pointer;
  transition:
    background 0.15s ease,
    border-color 0.15s ease,
    color 0.15s ease;
}

.home-new-essay {
  background: var(--color-heading);
  border-color: var(--color-heading);
  color: var(--color-background);
}

.home-new-essay:hover {
  opacity: 0.88;
}

.home-open-library:hover {
  background: var(--color-background-soft);
  border-color: var(--color-border-hover);
}
</style>

<script setup>
import { useRouter } from 'vue-router'
import { text } from '@/components/state'

const router = useRouter()
</script>
