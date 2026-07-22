<template>
  <div class="home">
    <div class="home-title">{{ text['home-title'] }}</div>
    <div class="home-subtitle">{{ text['home-subtitle'] }}</div>
    <div class="home-new-essay">{{ text['home-new-essay'] }}</div>
    <div class="home-open-library">{{ text['home-open-library'] }}</div>
  </div>
</template>

<style scoped></style>

<script setup>
import { text } from '@/components/state'
</script>
