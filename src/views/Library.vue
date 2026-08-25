<template>
  <div class="library">
    <div class="main">
      <div class="header">
        <div class="title" @click="goBack">‹ {{ currentTitle }}</div>
        <div class="side-buttons">
          <button class="btn-primary" @click="createEssay">
            {{ i18n['library-new'] }}
          </button>
          <button class="btn-secondary" @click="createFolder">
            {{ i18n['library-new-folder'] }}
          </button>
        </div>
      </div>
      <div class="content">
        <div
          v-for="(v, i) in items"
          class="item"
          @click="onItemClick(v)"
          @contextmenu.prevent.stop="openActions($event, v, i)"
        >
          <div class="item-text">
            <div class="item-title">{{ itemTitle(v) }}</div>
            <span v-if="itemIcon(v)" v-html="itemIcon(v)" />
          </div>
          <div class="item-more" @click.stop="openActions($event, v, i)">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
        <div v-if="!items.length" class="placeholder">
          {{ i18n['library-empty'] }}
        </div>
      </div>
    </div>
    <Actions ref="actions" :folder="current" :unlock="unlock" />
    <Password ref="passwordBox" />
  </div>
</template>

<style scoped>
.library {
  width: 100%;
  overflow-x: hidden;
  min-height: 100%;
}

.main {
  max-width: 42em;
  width: 100%;
  margin: 48px auto;
  overflow: hidden;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
  margin-bottom: 1.25rem;

  .title {
    font-size: 22px;
    font-weight: bold;
    color: var(--color-text-bold);
    cursor: pointer;
  }

  .side-buttons {
    display: flex;
    gap: 0.5rem;

    button {
      padding: 5px 8px;
    }
  }
}

.content {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;

  .item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    width: 100%;
    overflow: hidden;
    padding: 10px 8px 10px 14px;
    border-radius: 6px;
    cursor: pointer;
    transition: background 0.15s ease;

    .item-text {
      flex: 1;
      overflow: hidden;
      display: flex;
      align-items: center;
    }

    .item-title {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      color: var(--color-text-bold);
      margin-right: 4px;
    }

    .item-text span {
      display: block;
      flex: none;
      overflow: hidden;
      line-height: 0;
      width: 16px;
      height: 16px;
      opacity: 0.5;

      :deep(svg) {
        display: block;
        width: 100%;
        height: 100%;
      }
    }

    .item-more {
      width: 28px;
      height: 28px;
      flex: none;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 3px;
      border-radius: 6px;
      opacity: 0.45;
      transition: background 0.15s ease;

      span {
        width: 3px;
        height: 3px;
        border-radius: 50%;
        background: currentColor;
      }

      &:hover {
        background: var(--color-pressed);
      }
    }
  }

  .item:hover {
    background: var(--color-hover);
  }
}

.placeholder {
  min-height: 12rem;
  display: grid;
  place-items: center;
  opacity: 0.5;
}
</style>

<script setup>
import { computed, ref } from 'vue'
import iconFolder from '@/assets/folder.svg?raw'
import iconFolderLock from '@/assets/folder-lock.svg?raw'
import iconLock from '@/assets/lock.svg?raw'
import { i18n } from '@/user/i18n.js'
import { newEssay, newFolder, openEssay } from '@/user/api.js'
import { library } from '@/user/userdata.js'
import { changePage } from '@/user/session.js'
import Actions from './Library/Actions.vue'
import Password from './Library/Password.vue'

const trail = ref([])
const actions = ref(null)
const passwordBox = ref(null)
const unlocked = new WeakSet()

const current = computed(() => trail.value.at(-1) ?? library)
const items = computed(() => current.value.children)
const currentTitle = computed(() =>
  trail.value.length
    ? itemTitle(trail.value.at(-1))
    : i18n.value['library-title'],
)

function isFolder(item) {
  return Boolean(item?.children)
}

function itemIcon(item) {
  if (isFolder(item) && item.password) return iconFolderLock
  if (isFolder(item)) return iconFolder
  if (item.password) return iconLock
  return ''
}

function itemTitle(item) {
  const raw = isFolder(item) ? item.name : item.title
  return (
    raw?.trim() ||
    i18n.value[isFolder(item) ? 'library-untitled-folder' : 'library-untitled']
  )
}

function onItemClick(item) {
  unlock(item).then((ok) => {
    if (!ok) return
    if (isFolder(item)) trail.value.push(item)
    else openEssay(item)
  })
}

function goBack() {
  if (trail.value.length) trail.value.pop()
  else changePage('Home')
}

function createEssay() {
  newEssay(current.value)
}

function createFolder() {
  newFolder(current.value)
}

function openActions(event, item, index) {
  actions.value?.open(event, item, index)
}

async function unlock(item) {
  if (!item.password || unlocked.has(item)) return true
  let wrong = false
  while (true) {
    const input = await passwordBox.value.ask({
      title: i18n.value['library-password-unlock'],
      hint: wrong ? i18n.value['library-password-wrong'] : '',
    })
    if (input == null) return false
    if (input === item.password) {
      unlocked.add(item)
      return true
    }
    wrong = true
  }
}
</script>
