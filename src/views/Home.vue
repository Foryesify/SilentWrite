<template>
  <div class="home">
    <div class="title">{{ ui['home-title'] }}</div>
    <div class="buttons">
      <div class="button-primary" @click="newEssay">
        {{ ui['home-new-essay'] }}
      </div>
      <div class="button-secondary" @click="openLibrary">
        {{ ui['home-open-library'] }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ui } from '@/components/state'
import { newEssay, openLibrary } from '@/components/methods'
</script>

<style scoped>
.title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
}

.buttons {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
</style>
