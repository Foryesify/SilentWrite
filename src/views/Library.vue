<template>
  <div class="library">
    <div class="header">
      <div class="title">{{ i18n['library-title'] }}</div>
      <div class="side-buttons">
        <div class="button-primary" @click="createEssay"></div>
        <div class="button-secondary" @click="createFolder"></div>
        <div class="button-secondary" @click="batchItems"></div>
      </div>
    </div>
    <div class="main">
      <div class="item"></div>
      <div class="placeholder">
        <div class="placeholder-title"></div>
        <div class="placeholder-subtitle"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import i18n from '@/i18n';

function createEssay() {}
function createFolder() {}
function batchItems() {}

</script>
