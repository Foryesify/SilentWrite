<template>
  <div class="home">
    <div class="main">
      <button class="btn-primary" @click="newEssay()">
        {{ i18n['home-new-essay'] }}
      </button>
      <button class="btn-secondary" @click="openLibrary">
        {{ i18n['home-open-library'] }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { i18n } from '@/user/i18n.js'
import { newEssay } from '@/user/api.js'
import { changePage } from '@/user/session.js'

function openLibrary() {
  changePage('Library')
}
</script>

<style scoped>
.home {
  display: grid;
  place-items: center;
  min-height: 100dvh;
}

.main {
  width: min(380px, 100%);
  margin-bottom: 5dvh;

  button {
    width: 100%;
    height: 50px;
    font-size: 18px;
    margin-bottom: 20px;
  }
}
</style>
