<template>
  <div class="home">
    <div class="title">{{ ui['home-title'] }}</div>
    <div class="buttons">
      <div class="button-primary">{{ ui['home-new-essay'] }}</div>
      <div class="button-secondary">{{ ui['home-open-linrary'] }}</div>
    </div>
  </div>
</template>

<script setup>
import { ui } from '@/components/state'
</script>
