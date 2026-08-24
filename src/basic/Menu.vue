<template>
  <div class="menu">
    <div v-for="v in items" @click="v[1]">{{ v[0] }}</div>
  </div>
</template>

<script setup>
defineProps(items)
</script>
