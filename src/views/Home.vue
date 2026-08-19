<template>
  <div class="home">
    <div class="main">
      <button class="btn-primary">
        {{ i18n['home-new-essay'] }}
      </button>
      <button class="btn-secondary">
        {{ i18n['home-open-library'] }}
      </button>
    </div>
  </div>
</template>

<script setup>
import i18n from '@/i18n'
</script>

<style scoped>
.home {
  display: grid;
  place-items: center;
}

.main {
  width: min(380px, 100%);
  margin-bottom: 8dvh;

  button {
    width: 100%;
    height: 50px;
    font-size: 18px;
    margin-bottom: 20px;
  }
}

</style>
