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
import { lang } from '@/components/state'
import { ref } from 'vue'

const homeTitle = ref(i18n[lang.value]['home-title'])
const homeSubtitle = ref(i18n[lang.value]['home-subtitle'])
const homeNewEssay = ref(i18n[lang.value]['home-new-essay'])
const homeOpenLibrary = ref(i18n[lang.value]['home-open-library'])
</script>
