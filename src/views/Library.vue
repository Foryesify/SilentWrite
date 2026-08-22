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
      <div ref="listEl" class="content">
        <div
          v-for="(item, index) in items"
          :key="itemKey(item)"
          class="item"
          :class="{
            dragging: drag.from === index,
            'drag-over':
              drag.active && drag.over === index && drag.from !== index,
            'menu-open': menu.index === index,
          }"
          @click="onItemClick(item)"
        >
          <div class="item-main">
            <div class="item-text">
              <div class="item-title">{{ itemTitle(item) }}</div>
              <svg
                v-if="isFolder(item)"
                class="item-folder"
                viewBox="1.15 3.15 13.1 11.2"
              >
                <path
                  d="M3.5 3.75h2.38c.28 0 .54.12.72.33l.82 1.02H12.5c.97 0 1.75.78 1.75 1.75v5.4c0 .97-.78 1.75-1.75 1.75h-9A1.75 1.75 0 0 1 1.75 12.25v-6.75c0-.97.78-1.75 1.75-1.75z"
                />
              </svg>
              <svg
                v-if="item.password"
                class="item-lock"
                viewBox="2.8 2.6 10.4 11.2"
              >
                <rect x="3.4" y="7.15" width="9.2" height="6.35" rx="1.55" />
                <path d="M5.4 7.15V5.4a2.6 2.6 0 0 1 5.2 0v1.75" />
              </svg>
            </div>
          </div>
          <div
            class="item-handle"
            @pointerdown.stop="onPointerDown($event, index)"
            @click.stop
          >
            <svg viewBox="0 0 16 16">
              <circle cx="6" cy="4" r="1.05" />
              <circle cx="10" cy="4" r="1.05" />
              <circle cx="6" cy="8" r="1.05" />
              <circle cx="10" cy="8" r="1.05" />
              <circle cx="6" cy="12" r="1.05" />
              <circle cx="10" cy="12" r="1.05" />
            </svg>
          </div>
          <button
            class="item-more"
            type="button"
            @pointerdown.stop
            @click.stop="openActions($event, item, index)"
          >
            <svg viewBox="0 0 16 16">
              <circle cx="4" cy="8" r="1.15" />
              <circle cx="8" cy="8" r="1.15" />
              <circle cx="12" cy="8" r="1.15" />
            </svg>
          </button>
        </div>
        <div v-if="!items.length" class="placeholder">
          {{ i18n['library-empty'] }}
        </div>
      </div>
    </div>
    <Teleport to="body">
      <div v-if="menu.index >= 0" class="menu-layer" @mousedown="closeMenu">
        <div
          class="menu-anchor"
          :style="{ top: `${menu.top}px`, left: `${menu.left}px` }"
          @mousedown.stop
        >
          <ActionMenu :items="actionMenu" @action="closeMenu" />
        </div>
      </div>
    </Teleport>
    <MessageBox
      v-model:open="box.open"
      v-model="box.value"
      :title="box.title"
      :message="box.message"
      :input="box.input"
      :type="box.type"
      :placeholder="box.placeholder"
      @confirm="onBoxConfirm"
      @cancel="onBoxCancel"
    />
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

    .item-main {
      flex: 1;
      overflow: hidden;
    }

    .item-text {
      display: flex;
      align-items: center;
      width: fit-content;
      max-width: 100%;
    }

    .item-title {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      color: var(--color-text-bold);
      margin-right: 4px;
    }

    .item-folder,
    .item-lock {
      display: block;
      flex-shrink: 0;
      fill: none;
      stroke: currentColor;
      stroke-width: 1.2;
      stroke-linejoin: round;
      stroke-linecap: round;
    }

    .item-folder {
      width: 16px;
      height: 16px;
      opacity: 0.5;
    }

    .item-lock {
      width: 13px;
      height: 13px;
      opacity: 0.42;
    }

    .item-handle,
    .item-more {
      width: 28px;
      height: 28px;
      flex-shrink: 0;
      display: grid;
      place-items: center;
      border: none;
      border-radius: 6px;
      background: transparent;
      color: inherit;
      opacity: 0;
      transition:
        background 0.15s ease,
        opacity 0.15s ease;

      svg {
        width: 16px;
        height: 16px;
        fill: currentColor;
      }
    }

    .item-handle {
      cursor: grab;
    }

    .item-handle:hover,
    .item-more:hover,
    &.menu-open .item-more {
      background: var(--color-pressed);
    }
  }

  .item:hover,
  .item.menu-open,
  .item.drag-over {
    background: var(--color-hover);
  }

  .item.dragging {
    opacity: 0.38;

    .item-handle {
      cursor: grabbing;
    }
  }

  @media (hover: hover) {
    .item:hover .item-handle,
    .item:hover .item-more,
    .item.menu-open .item-more {
      opacity: 0.55;
    }
  }

  @media (hover: none) {
    .item .item-handle,
    .item .item-more {
      opacity: 0.45;
    }
  }
}

.placeholder {
  min-height: 12rem;
  display: grid;
  place-items: center;
  opacity: 0.5;
}

.menu-layer {
  position: fixed;
  inset: 0;
  z-index: 30;
}

.menu-anchor {
  position: fixed;
}
</style>

<script setup>
import { computed, onBeforeUnmount, reactive, ref } from 'vue'
import { i18n } from '@/user/i18n.js'
import { newEssay, newFolder, openEssay } from '@/user/api.js'
import { library } from '@/user/userdata.js'
import { changePage } from '@/user/session.js'
import ActionMenu from '@/basic/Menu.vue'
import { Menu, MenuItem } from '@/basic/Menu.js'
import MessageBox from '@/basic/MessageBox.vue'

const keys = new WeakMap()
let keySeq = 0
function itemKey(item) {
  let key = keys.get(item)
  if (!key) keys.set(item, (key = ++keySeq))
  return key
}

const trail = ref([])
const listEl = ref(null)
const drag = reactive({ active: false, from: -1, over: -1, moved: false })
const menu = reactive({ index: -1, item: null, top: 0, left: 0 })
const unlocked = new WeakSet()
const box = reactive({
  open: false,
  title: '',
  message: '',
  input: false,
  type: 'text',
  placeholder: '',
  value: '',
})

let boxResolve = null
let startY = 0

const current = computed(() => trail.value.at(-1) ?? library)
const items = computed(() => current.value.children)
const currentTitle = computed(() =>
  trail.value.length
    ? itemTitle(trail.value.at(-1))
    : i18n.value['library-title'],
)
const actionMenu = computed(
  () =>
    new Menu([
      new MenuItem(i18n.value['library-delete'], () => runAction(removeItem)),
      new MenuItem(i18n.value['library-rename'], () => runAction(renameItem)),
      new MenuItem(i18n.value['library-password'], () =>
        runAction(passwordItem),
      ),
    ]),
)

function isFolder(item) {
  return Boolean(item?.children)
}

function itemTitle(item) {
  const raw = isFolder(item) ? item.name : item.title
  return (
    raw?.trim() ||
    i18n.value[isFolder(item) ? 'library-untitled-folder' : 'library-untitled']
  )
}

function onItemClick(item) {
  if (drag.moved) {
    drag.moved = false
    return
  }
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
  newFolder('', current.value)
}

function openActions(event, item, index) {
  const rect = event.currentTarget.getBoundingClientRect()
  menu.index = index
  menu.item = item
  menu.top = rect.bottom + 4
  menu.left = Math.min(rect.right - 148, window.innerWidth - 156)
}

function closeMenu() {
  menu.index = -1
  menu.item = null
}

function runAction(fn) {
  const { item, index } = menu
  closeMenu()
  if (item) fn(item, index)
}

function ask(options) {
  Object.assign(box, {
    open: true,
    title: '',
    message: '',
    input: false,
    type: 'text',
    placeholder: '',
    value: '',
    ...options,
  })
  return new Promise((resolve) => {
    boxResolve = resolve
  })
}

async function unlock(item) {
  if (!item.password || unlocked.has(item)) return true
  let wrong = false
  while (true) {
    const input = await ask({
      title: i18n.value['library-password-unlock'],
      message: wrong ? i18n.value['library-password-wrong'] : '',
      input: true,
      type: 'password',
      placeholder: i18n.value['library-password-placeholder'],
    })
    if (input == null) return false
    if (input === item.password) {
      unlocked.add(item)
      return true
    }
    wrong = true
  }
}

function onBoxConfirm() {
  boxResolve?.(box.input ? box.value : true)
  boxResolve = null
}

function onBoxCancel() {
  boxResolve?.(null)
  boxResolve = null
}

async function renameItem(item) {
  if (!(await unlock(item))) return
  const next = await ask({
    title:
      i18n.value[
        isFolder(item)
          ? 'library-rename-folder-prompt'
          : 'library-rename-prompt'
      ],
    input: true,
    value: (isFolder(item) ? item.name : item.title) ?? '',
  })
  if (next == null) return
  if (isFolder(item)) item.name = next
  else item.title = next
}

async function passwordItem(item) {
  if (!(await unlock(item))) return
  const next = await ask({
    title: i18n.value['library-password-prompt'],
    message: item.password ? i18n.value['library-password-hint'] : '',
    input: true,
    type: 'password',
    placeholder: i18n.value['library-password-placeholder'],
  })
  if (next == null) return
  item.setPassword?.(next)
  item.password = next
  if (next) unlocked.add(item)
  else unlocked.delete(item)
}

async function removeItem(item, index) {
  if (!(await unlock(item))) return
  const ok = await ask({
    title: i18n.value['library-delete-confirm'].replace(
      '{title}',
      itemTitle(item),
    ),
  })
  if (ok) items.value.splice(index, 1)
}

function indexFromY(y) {
  const nodes = listEl.value?.querySelectorAll('.item')
  if (!nodes?.length) return -1
  for (let i = 0; i < nodes.length; i++) {
    const rect = nodes[i].getBoundingClientRect()
    if (y < rect.top + rect.height / 2) return i
  }
  return nodes.length - 1
}

function listenDrag(on) {
  const fn = on ? 'addEventListener' : 'removeEventListener'
  window[fn]('pointermove', onPointerMove, on ? { passive: false } : undefined)
  window[fn]('pointerup', onPointerUp)
}

function onPointerDown(event, index) {
  if (event.pointerType === 'mouse' && event.button !== 0) return
  drag.from = index
  startY = event.clientY
  listenDrag(true)
}

function onPointerMove(event) {
  if (drag.from < 0) return
  if (!drag.active) {
    if (Math.abs(event.clientY - startY) < 8) return
    drag.active = true
    drag.over = drag.from
    drag.moved = true
    closeMenu()
  }
  event.preventDefault()
  const over = indexFromY(event.clientY)
  if (over >= 0) drag.over = over
}

function onPointerUp() {
  if (drag.active && drag.over >= 0 && drag.over !== drag.from) {
    const list = items.value
    const [moved] = list.splice(drag.from, 1)
    list.splice(drag.over, 0, moved)
  }
  drag.active = false
  drag.from = -1
  drag.over = -1
  listenDrag(false)
}

onBeforeUnmount(() => listenDrag(false))
</script>
