<template>
  <div class="titlebar" :class="{ shadow: scrolled }">
    <div class="titlebar-left">
      <div class="titlebar-title" @click="router.push('/')">SilentWrite</div>
      <div class="titlebar-menu">
        <span v-for="item in titlebarMenuItems">
          {{ text[item.name] }}
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
  transition:
    box-shadow 0.2s,
    opacity 0.3s;
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
  transition: all 0.3s;
}

.titlebar-title:hover {
  color: var(--color-white);
  cursor: pointer;
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
  transition:
    background 0.2s,
    color 0.2s;
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
  transition:
    background 0.2s,
    color 0.2s;
}

.titlebar-right > div:hover {
  background: var(--color-hover);
}

.titlebar-right > div:last-child:hover {
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
import { onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { settings, text } from './state'

const router = useRouter()
const route = useRoute()

function minimize() {}
function toggle() {}
function close() {}

const titlebarMenuItems = [
  {
    name: 'titlebar-file',
    children: [
      { name: 'titlebar-file1', action: () => {} },
      { name: 'titlebar-file2', action: () => {} },
      { name: 'titlebar-file3', action: () => {} },
    ],
  },
  {
    name: 'titlebar-edit',
    children: [
      { name: 'titlebar-edit1', action: () => {} },
      { name: 'titlebar-edit2', action: () => {} },
      { name: 'titlebar-edit3', action: () => {} },
      { name: 'titlebar-edit4', action: () => {} },
      { name: 'titlebar-edit5', action: () => {} },
    ],
  },
  {
    name: 'titlebar-view',
    children: [
      { name: 'titlebar-view1', action: () => {} },
      { name: 'titlebar-view2', action: () => {} },
    ],
  },
  {
    name: 'titlebar-settings',
    children: [
      { name: 'titlebar-settings1', action: () => {} },
      { name: 'titlebar-settings2', action: () => {} },
    ],
  },
  {
    name: 'titlebar-help',
    children: [
      { name: 'titlebar-help1', action: () => {} },
      { name: 'titlebar-help2', action: () => {} },
      { name: 'titlebar-help3', action: () => {} },
      { name: 'titlebar-help4', action: () => {} },
      { name: 'titlebar-help5', action: () => {} },
      { name: 'titlebar-help6', action: () => {} },
    ],
  },
]

// Auto-Hide
const scrolled = ref(false)
onMounted(() => {
  let hover = false
  window.addEventListener('scroll', () => {
    scrolled.value = window.scrollY > 0
  })
  const element = document.querySelector('.titlebar')
  element.addEventListener('mouseenter', (e) => {
    if (settings.titlebarAutohideDisabled) return;
    if (route.fullPath != '/') {
      e.target.style.opacity = '1'
    }
    hover = true
  })
  element.addEventListener('mouseleave', (e) => {
    if (settings.titlebarAutohideDisabled) return;
    hover = false
    setTimeout(() => {
      if (!hover && route.fullPath != '/') {
        e.target.style.opacity = '0'
      }
    }, 700)
  })
  watch(
    () => route.fullPath + settings.titlebarAutohideDisabled,
    () => {
      element.style.opacity = '1'
    },
  )
})
</script>
