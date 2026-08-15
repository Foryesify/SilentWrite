<template>
  <div class="library">
    <div class="header">
      <div class="title" :class="{ link: trail.length }" @click="goBack">
        <span v-if="trail.length" class="back">‹</span>
        {{ currentTitle }}
      </div>
      <div class="side-buttons">
        <div class="button-primary" @click="createEssay">
          {{ i18n['library-new'] }}
        </div>
        <div class="button-secondary" @click="createFolder">
          {{ i18n['library-new-folder'] }}
        </div>
        <div class="button-secondary" @click="batchItems">
          {{ i18n['library-batch'] }}
        </div>
      </div>
    </div>
    <div class="main">
      <div
        v-for="item in current.children"
        :key="itemKey(item)"
        class="item"
        :class="{ folder: isFolder(item) }"
        @click="openItem(item)"
      >
        <div class="item-body">
          <div class="item-title">{{ itemTitle(item) }}</div>
          <div class="item-meta">{{ itemMeta(item) }}</div>
        </div>
        <div v-if="item.password" class="item-lock" aria-hidden="true"></div>
      </div>
      <div v-if="!current.children.length" class="placeholder">
        <div class="placeholder-title">{{ i18n['library-empty'] }}</div>
        <div class="placeholder-subtitle"></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.library {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 42em;
  margin: 0 auto;
  padding: 3.5rem 1.5rem 2rem;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
  margin-bottom: 1.25rem;
}

.title {
  font-size: 1.5rem;
  color: var(--color-bold);
  display: flex;
  align-items: center;
  gap: 0.35rem;
}

.title.link {
  cursor: pointer;
}

.title.link:hover {
  opacity: 0.7;
}

.back {
  font-size: 1.6rem;
  line-height: 1;
  margin-top: -0.15em;
}

.side-buttons {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.button-primary,
.button-secondary {
  padding: 0.3rem 0.7rem;
  text-align: center;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.875rem;
}

.button-primary {
  background: var(--color-bold);
  color: var(--color-background);
}

.button-primary:hover {
  opacity: 0.7;
}

.button-secondary {
  border: 1px solid #7775;
}

.button-secondary:hover {
  background: var(--color-hover);
}

.main {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  flex: 1;
}

.item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.7rem 0.8rem;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.15s ease;
}

.item:hover {
  background: var(--color-hover);
}

.item.folder .item-title::before {
  content: '';
  display: inline-block;
  width: 0.7rem;
  height: 0.5rem;
  margin-right: 0.45rem;
  border: 1.5px solid currentColor;
  border-radius: 1px 2px 1px 1px;
  opacity: 0.45;
  vertical-align: 0.1em;
}

.item-body {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
}

.item-title {
  color: var(--color-bold);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.item-meta {
  font-size: 0.8rem;
  opacity: 0.55;
}

.item-lock {
  width: 0.7rem;
  height: 0.85rem;
  flex-shrink: 0;
  border: 1.5px solid currentColor;
  border-radius: 3px 3px 2px 2px;
  opacity: 0.4;
  position: relative;
}

.item-lock::before {
  content: '';
  position: absolute;
  left: 50%;
  top: -0.35rem;
  width: 0.38rem;
  height: 0.35rem;
  border: 1.5px solid currentColor;
  border-bottom: none;
  border-radius: 4px 4px 0 0;
  transform: translateX(-50%);
}

.placeholder {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 12rem;
  opacity: 0.5;
}

.placeholder-title {
  font-size: 1rem;
}
</style>

<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import i18n from '@/i18n'
import { library, File, Folder, settings } from '@/userdata'
import { newEssay, createFolder as addFolder } from '@/userfunc'

const router = useRouter()
const trail = ref([])

const current = computed(() => trail.value.at(-1) ?? library)

const currentTitle = computed(() =>
  trail.value.length ? folderName(current.value) : i18n.value['library-title'],
)

function isFolder(item) {
  return item instanceof Folder
}

function itemKey(item) {
  return item.id
}

function folderName(folder) {
  return folder.name?.trim() || i18n.value['library-untitled-folder']
}

function fileTitle(file) {
  return (
    file.title?.trim() ||
    file.content
      ?.split(/\r?\n/)
      .find((line) => line.trim())
      ?.trim() ||
    i18n.value['library-untitled']
  )
}

function itemTitle(item) {
  return isFolder(item) ? folderName(item) : fileTitle(item)
}

function formatDate(iso) {
  if (!iso) return ''
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return ''
  return date.toLocaleDateString(settings.lang, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

function itemMeta(item) {
  if (isFolder(item)) {
    return i18n.value['library-folder-count'].replace(
      '{n}',
      String(item.children.length),
    )
  }
  return formatDate(item.updated || item.date)
}

function openItem(item) {
  if (isFolder(item)) {
    trail.value = [...trail.value, item]
    return
  }
  if (item instanceof File) {
    router.push({ name: 'Editor', params: { id: item.id } })
  }
}

function goBack() {
  if (!trail.value.length) return
  trail.value = trail.value.slice(0, -1)
}

function createEssay() {
  newEssay(current.value)
}

function createFolder() {
  addFolder('', current.value)
}

function batchItems() {}
</script>
