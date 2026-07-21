<template>
  <div class="home">
    <div class="home-title">{{ homeTitle }}</div>
    <div class="home-subtitle">{{ homeSubtitle }}</div>
    <div class="home-new-essay">{{ homeNewEssay }}</div>
    <div class="home-open-library">{{ homeOpenLibrary }}</div>
  </div>
</template>

<style scoped></style>

<script setup>
import i18n from '@/assets/i18n.json'
import { settings } from '@/components/state'
import { computed } from 'vue'

const homeTitle = computed(() => i18n[settings.lang]['home-title'])
const homeSubtitle = computed(() => i18n[settings.lang]['home-subtitle'])
const homeNewEssay = computed(() => i18n[settings.lang]['home-new-essay'])
const homeOpenLibrary = computed(() => i18n[settings.lang]['home-open-library'])
</script>
