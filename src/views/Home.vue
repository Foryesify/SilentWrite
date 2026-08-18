<template>
  <div class="home">
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
}

.title {
  font-size: 1.5rem;
  color: var(--color-bold);
}

.main {
  width: min(350px, 90%);
  padding-bottom: 100px;

  button {
    width: 100%;
    height: 50px;
    font-size: 18px;
    margin-bottom: 20px;
  }
}

</style>
