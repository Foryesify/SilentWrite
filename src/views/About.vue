<template>
  <div class="about">
    <div class="about-passage">
      <h1 class="about-title">{{ text['about-h1'] }}</h1>
      <p class="about-p1">{{ text['about-p1'] }}</p>
      <p class="about-p2">{{ text['about-p2'] }}</p>
      <p class="about-p3">{{ text['about-p3'] }}</p>
      <p class="about-p4">{{ text['about-p4'] }}</p>
      <p class="about-p5">{{ text['about-p5'] }}</p>
      <p class="about-p6">{{ text['about-p6'] }}</p>
      <p class="about-p7">{{ text['about-p7'] }}</p>
      <p class="about-p8">{{ text['about-p8'] }}</p>
      <p class="about-p9">{{ text['about-p9'] }}</p>
      <p class="about-p10">{{ text['about-p10'] }}</p>
      <p class="about-p11">{{ text['about-p11'] }}</p>
      <h2 class="about-h2">{{ text['about-h2'] }}</h2>
      <p class="about-p12">{{ text['about-p12'] }}</p>
      <ul class="about-list">
        <li class="about-li1">{{ text['about-li1'] }}</li>
        <li class="about-li2">{{ text['about-li2'] }}</li>
        <li class="about-li3">{{ text['about-li3'] }}</li>
        <li class="about-li4">{{ text['about-li4'] }}</li>
        <li class="about-li5">{{ text['about-li5'] }}</li>
        <li class="about-li6">{{ text['about-li6'] }}</li>
        <li class="about-li7">{{ text['about-li7'] }}</li>
        <li class="about-li8">{{ text['about-li8'] }}</li>
        <li class="about-li9">{{ text['about-li9'] }}</li>
      </ul>
      <button
        @click="settings.lang = settings.lang == 'en-US' ? 'zh-CN' : 'en-US'"
      >
        change
      </button>
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
import { settings, text } from '@/components/state'
</script>
