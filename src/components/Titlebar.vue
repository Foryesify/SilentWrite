<template>
  <div class="titlebar" :class="{ shadow: scrolled }">
    <div class="titlebar-left">
      <div class="titlebar-title">SilentWrite</div>
      <div class="titlebar-menu">
        <span v-for="item in titlebarMenuItems">
          {{ item.name }}
        </span>
      </div>
    </div>
    <div class="titlebar-right">
      <div @click="minimize">
        <svg viewBox="0 0 10 10">
          <path stroke="currentColor" d="M1 5h8" />
        </svg>
      </div>
      <div @click="toggle">
        <svg viewBox="0 0 10 10">
          <path d="M1.5 1.5h7v7h-7z" fill="none" stroke="currentColor" />
        </svg>
      </div>
      <div @click="close">
        <svg viewBox="0 0 10 10">
          <path stroke="currentColor" d="M1.5 1.5l7 7M8.5 1.5l-7 7" />
        </svg>
      </div>
    </div>
  </div>
</template>

<style scoped>
.titlebar {
  height: 32px;
  background: var(--color-background);
  user-select: none;
  display: flex;
  position: sticky;
  top: 0;
  z-index: 100;
  transition: box-shadow 0.2s;
}

.titlebar-left {
  flex: 1;
  height: 32px;
  display: flex;
  align-items: center;
  padding-left: 16px;
  gap: 24px;
}

.titlebar-title {
  font-size: 16px;
  font-weight: 500;
}

.titlebar-menu {
  font-size: 13px;
}

.titlebar-menu > span {
  margin-top: 1.5px;
  cursor: pointer;
  padding: 5px 8px;
  line-height: 32px;
  border-radius: 4px;
  transition: background 0.2s, color 0.2s;
}

.titlebar-menu > span:hover {
  background: var(--color-hover);
}

.titlebar-right {
  flex: 0;
  height: 100%;
  display: flex;
}

.titlebar-right > div {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 32px;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
}

.titlebar-right > div:hover {
  background: var(--color-hover);
}

.titlebar-right >div:last-child:hover {
  background: #b22;
  color: #fff;
}

.titlebar-right svg {
  width: 12px;
  height: 12px;
}

.shadow {
  box-shadow: 0 7px 10px #7775;
}
</style>

<script setup>
import i18n from '@/assets/i18n.json'
import { lang } from './state'
import { computed, onMounted, ref } from 'vue'
function minimize() {}
function toggle() {}
function close() {}

const titlebarMenuItems = [
  {
    name: computed(() => i18n[lang.value]['titlebarFile']),
    children: [
      {
        name: computed(() => i18n[lang.value]['titlebarFile1']),
        action: () => {},
      },
      {
        name: computed(() => i18n[lang.value]['titlebarFile2']),
        action: () => {},
      },
      {
        name: computed(() => i18n[lang.value]['titlebarFile3']),
        action: () => {},
      },
    ],
  },
  {
    name: computed(() => i18n[lang.value]['titlebarEdit']),
    children: [
      {
        name: computed(() => i18n[lang.value]['titlebarEdit1']),
        action: () => {},
      },
      {
        name: computed(() => i18n[lang.value]['titlebarEdit2']),
        action: () => {},
      },
      {
        name: computed(() => i18n[lang.value]['titlebarEdit3']),
        action: () => {},
      },
      {
        name: computed(() => i18n[lang.value]['titlebarEdit4']),
        action: () => {},
      },
      {
        name: computed(() => i18n[lang.value]['titlebarEdit5']),
        action: () => {},
      },
    ],
  },
  {
    name: computed(() => i18n[lang.value]['titlebarView']),
    children: [
      {
        name: computed(() => i18n[lang.value]['titlebarView1']),
        action: () => {},
      },
      {
        name: computed(() => i18n[lang.value]['titlebarView2']),
        action: () => {},
      },
    ],
  },
  {
    name: computed(() => i18n[lang.value]['titlebarSettings']),
    children: [
      {
        name: computed(() => i18n[lang.value]['titlebarSettings1']),
        action: () => {},
      },
      {
        name: computed(() => i18n[lang.value]['titlebarSettings2']),
        action: () => {},
      },
    ],
  },
  {
    name: computed(() => i18n[lang.value]['titlebarHelp']),
    children: [
      {
        name: computed(() => i18n[lang.value]['titlebarHelp1']),
        action: () => {},
      },
      {
        name: computed(() => i18n[lang.value]['titlebarHelp2']),
        action: () => {},
      },
      {
        name: computed(() => i18n[lang.value]['titlebarHelp3']),
        action: () => {},
      },
      {
        name: computed(() => i18n[lang.value]['titlebarHelp4']),
        action: () => {},
      },
      {
        name: computed(() => i18n[lang.value]['titlebarHelp5']),
        action: () => {},
      },
      {
        name: computed(() => i18n[lang.value]['titlebarHelp6']),
        action: () => {},
      },
    ],
  },
]

const scrolled = ref(false);

onMounted(() => {
  window.addEventListener('scroll', () => {
    scrolled.value = window.scrollY > 0
  })
})
</script>
