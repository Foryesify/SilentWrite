<template>
  <div class="about">
    <div class="about-passage">
      <h1 class="about-title">{{ aboutH1 }}</h1>
      <p class="about-p1">{{ aboutP1 }}</p>
      <p class="about-p2">{{ aboutP2 }}</p>
      <p class="about-p3">{{ aboutP3 }}</p>
      <p class="about-p4">{{ aboutP4 }}</p>
      <p class="about-p5">{{ aboutP5 }}</p>
      <p class="about-p6">{{ aboutP6 }}</p>
      <p class="about-p7">{{ aboutP7 }}</p>
      <p class="about-p8">{{ aboutP8 }}</p>
      <p class="about-p9">{{ aboutP9 }}</p>
      <p class="about-p10">{{ aboutP10 }}</p>
      <p class="about-p11">{{ aboutP11 }}</p>
      <h2 class="about-h2">{{ aboutH2 }}</h2>
      <p class="about-p12">{{ aboutP12 }}</p>
      <ul class="about-list">
        <li class="about-li1">{{ aboutLi1 }}</li>
        <li class="about-li2">{{ aboutLi2 }}</li>
        <li class="about-li3">{{ aboutLi3 }}</li>
        <li class="about-li4">{{ aboutLi4 }}</li>
        <li class="about-li5">{{ aboutLi5 }}</li>
        <li class="about-li6">{{ aboutLi6 }}</li>
        <li class="about-li7">{{ aboutLi7 }}</li>
        <li class="about-li8">{{ aboutLi8 }}</li>
        <li class="about-li9">{{ aboutLi9 }}</li>
      </ul>
  <button @click="lang = lang == 'en-US' ? 'zh-CN' : 'en-US'">change</button>
    </div>
    <div class="about-items"></div>
  </div>
</template>

<style scoped>
.about {
  color: var(--color-text);
  overflow-y: auto;
  padding: 2em 3em;
}

.about-passage {
  max-width: 52em;
  font-size: 16px;
  line-height: 1.7;
  word-wrap: break-word;
  margin: 0 auto;
}

.about-title {
  margin: 0 0 1rem;
  padding-bottom: 0.4em;
  border-bottom: 1px solid var(--color-border);
  font-size: 2em;
  font-weight: 600;
  line-height: 1.25;
  color: var(--color-heading);
}

.about-h2 {
  margin: 1.75em 0 1rem;
  padding-bottom: 0.35em;
  border-bottom: 1px solid var(--color-border);
  font-size: 1.5em;
  font-weight: 600;
  line-height: 1.25;
  color: var(--color-heading);
}

.about-passage > p {
  margin: 0 0 1em;
}

.about-list {
  margin: 0 0 1em;
  padding-left: 2em;
  list-style: disc;
}

.about-list > li {
  margin: 0.35em 0;
}

.about-list > li::marker {
  color: var(--color-text);
}

.about > button {
  margin-top: 2rem;
  padding: 0.4em 0.85em;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  background: var(--color-background-soft);
  color: var(--color-text);
  font: inherit;
  font-size: 0.875rem;
  cursor: pointer;
}

.about > button:hover {
  background: var(--color-background-mute);
  border-color: var(--color-border-hover);
}
</style>

<script setup>
import i18n from '@/assets/i18n.json'
import { lang } from '@/components/state'
import { computed } from 'vue'

const aboutH1 = computed(() => i18n[lang.value]['about-h1'])
const aboutP1 = computed(() => i18n[lang.value]['about-p1'])
const aboutP2 = computed(() => i18n[lang.value]['about-p2'])
const aboutP3 = computed(() => i18n[lang.value]['about-p3'])
const aboutP4 = computed(() => i18n[lang.value]['about-p4'])
const aboutP5 = computed(() => i18n[lang.value]['about-p5'])
const aboutP6 = computed(() => i18n[lang.value]['about-p6'])
const aboutP7 = computed(() => i18n[lang.value]['about-p7'])
const aboutP8 = computed(() => i18n[lang.value]['about-p8'])
const aboutP9 = computed(() => i18n[lang.value]['about-p9'])
const aboutP10 = computed(() => i18n[lang.value]['about-p10'])
const aboutP11 = computed(() => i18n[lang.value]['about-p11'])
const aboutH2 = computed(() => i18n[lang.value]['about-h2'])
const aboutP12 = computed(() => i18n[lang.value]['about-p12'])
const aboutLi1 = computed(() => i18n[lang.value]['about-li1'])
const aboutLi2 = computed(() => i18n[lang.value]['about-li2'])
const aboutLi3 = computed(() => i18n[lang.value]['about-li3'])
const aboutLi4 = computed(() => i18n[lang.value]['about-li4'])
const aboutLi5 = computed(() => i18n[lang.value]['about-li5'])
const aboutLi6 = computed(() => i18n[lang.value]['about-li6'])
const aboutLi7 = computed(() => i18n[lang.value]['about-li7'])
const aboutLi8 = computed(() => i18n[lang.value]['about-li8'])
const aboutLi9 = computed(() => i18n[lang.value]['about-li9'])
</script>
