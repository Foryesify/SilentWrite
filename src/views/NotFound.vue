<template>
  <div class="notfound-title">{{ notfoundTitle }}</div>
  <div class="notfound-subtitle">{{ notfoundSubtitle }}</div>
  <div class="notfound-back">{{ notfoundBack }}</div>
</template>

<style scoped></style>

<script setup>
import { computed } from 'vue'
import i18n from '@/assets/i18n.json'
import {settings} from '@/components/state.js'
const notfoundTitle = computed(() => i18n[settings.lang]['notfound-title'])
const notfoundSubtitle = computed(() => i18n[settings.lang]['notfound-subtitle'])
const notfoundBack = computed(() => i18n[settings.lang]['notfound-back'])
</script>
