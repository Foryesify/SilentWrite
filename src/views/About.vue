<template>
  <div class="about">
    <div class="passage" v-html="passageHtml"></div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { settings } from '@/components/state'
import aboutZh from '@/assets/about-zh.html?raw'
import aboutEn from '@/assets/about-en.html?raw'

const passageHtml = computed(() =>
  settings.lang.startsWith('zh') ? aboutZh : aboutEn,
)
</script>

<style scoped>
.about {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.passage {
  max-width: 42rem;
  overflow: auto;
}
</style>
