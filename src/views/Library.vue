<template>
  <div class="library">
    <div class="library-title"></div>
    <div class="library-subtitle"></div>
    <div class="library-content">
      <div class="library-header">
        <div class="library-header-new-essay"></div>
        <div class="library-header-new-folder"></div>
        <div class="library-header-batch-items"></div>
        <div class="library-header-search"></div>
      </div>
      <div v-for="item in libraryItems" class="library-item" :key="item.id">
        <div class="library-item-title">{{ item.title }}</div>
        <div class="library-item-more"></div>
      </div>
      <div v-if="libraryItems.length === 0" class="library-empty">
        <div class="library-empty-title"></div>
        <div class="library-empty-new-essay"></div>
        <div class="library-empty-new-folder"></div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>

<script setup>
import { ref } from 'vue';

const libraryItems = ref([]);
</script>
