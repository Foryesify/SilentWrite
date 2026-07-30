<template>
  <div class="library">
    <div class="header">
      <div class="title">{{ ui['library-title'] }}</div>
      <div class="side-buttons">
        <div class="button-primary" @click="newEssay"></div>
        <div class="button-secondary" @click="newFolder"></div>
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
import { ui } from '@/components/state'

function newEssay() {}
function newFolder() {}
function batchItems() {}

</script>
