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
          <button class="btn-secondary" @click="batchItems">
            {{ i18n['library-batch'] }}
          </button>
        </div>
      </div>
      <div ref="listEl" class="content">
        <div
          v-for="(item, index) in items"
          :key="item._key"
          class="item"
          :class="{
            folder: isFolder(item),
            dragging: drag.from === index,
            'drag-over': drag.active && drag.over === index && drag.from !== index,
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
                aria-hidden="true"
              >
                <path
                  d="M3.5 3.75h2.38c.28 0 .54.12.72.33l.82 1.02H12.5c.97 0 1.75.78 1.75 1.75v5.4c0 .97-.78 1.75-1.75 1.75h-9A1.75 1.75 0 0 1 1.75 12.25v-6.75c0-.97.78-1.75 1.75-1.75z"
                />
              </svg>
              <svg
                v-if="item.password"
                class="item-lock"
                viewBox="2.8 2.6 10.4 11.2"
                aria-hidden="true"
              >
                <rect x="3.4" y="7.15" width="9.2" height="6.35" rx="1.55" />
                <path d="M5.4 7.15V5.4a2.6 2.6 0 0 1 5.2 0v1.75" />
              </svg>
            </div>
          </div>
          <div
            class="item-handle"
            aria-label="Reorder"
            @pointerdown.stop="onPointerDown($event, index)"
            @click.stop
          >
            <svg viewBox="0 0 16 16" aria-hidden="true">
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
            aria-label="Actions"
            @pointerdown.stop
            @click.stop="openActions($event, item, index)"
          >
            <svg viewBox="0 0 16 16" aria-hidden="true">
              <circle cx="4" cy="8" r="1.15" />
              <circle cx="8" cy="8" r="1.15" />
              <circle cx="12" cy="8" r="1.15" />
            </svg>
          </button>
        </div>
        <div v-if="!items.length" class="placeholder">
          <div class="placeholder-title">{{ i18n['library-empty'] }}</div>
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
  flex: 1;

  .item {
    display: flex;
    align-items: center;
    justify-content: space-between;
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

    .item-more {
      cursor: pointer;
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
  }

  .item.dragging .item-handle {
    cursor: grabbing;
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
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 12rem;
  opacity: 0.5;

  .placeholder-title {
    font-size: 1rem;
  }
}
</style>

<style>
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
import { changePage } from '@/user/session.js'
import ActionMenu from '@/basic/Menu.vue'
import { Menu, MenuItem } from '@/basic/Menu.js'
import MessageBox from '@/basic/MessageBox.vue'

let seq = 0
function uid() {
  return `item-${++seq}`
}

const rootItems = ref([
  { _key: uid(), title: '窗边' },
  {
    _key: uid(),
    name: '2026',
    children: [{ _key: uid(), title: '八月随笔' }],
  },
  { _key: uid(), title: '夜航船', password: '*' },
  { _key: uid(), title: '一篇标题稍微长一点的随笔，用来看看省略号啊啊啊啊号啊啊啊啊号啊啊啊啊号啊啊啊啊号啊啊啊啊啊啊啊' },
])

const trail = ref([])
const listEl = ref(null)
const didDrag = ref(false)
const drag = reactive({
  active: false,
  from: -1,
  over: -1,
})
const menu = reactive({
  index: -1,
  item: null,
  top: 0,
  left: 0,
})
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
let pendingDrag = null

const items = computed(
  () => trail.value.at(-1)?.children ?? rootItems.value,
)
const currentTitle = computed(() =>
  trail.value.length
    ? folderName(trail.value.at(-1))
    : i18n.value['library-title'],
)
const actionMenu = computed(
  () =>
    new Menu([
      new MenuItem(i18n.value['library-delete'], () =>
        runAction(removeItem),
      ),
      new MenuItem(i18n.value['library-rename'], () =>
        runAction(renameItem),
      ),
      new MenuItem(i18n.value['library-password'], () =>
        runAction(passwordItem),
      ),
    ]),
)

function isFolder(item) {
  return Boolean(item?.children)
}

function folderName(folder) {
  return folder.name?.trim() || i18n.value['library-untitled-folder']
}

function fileTitle(file) {
  return file.title?.trim() || i18n.value['library-untitled']
}

function itemTitle(item) {
  return isFolder(item) ? folderName(item) : fileTitle(item)
}

function onItemClick(item) {
  if (didDrag.value) {
    didDrag.value = false
    return
  }
  if (isFolder(item)) {
    trail.value = [...trail.value, item]
    return
  }
  changePage('Editor')
}

function goBack() {
  if (trail.value.length) {
    trail.value = trail.value.slice(0, -1)
    return
  }
  changePage('Home')
}

function createEssay() {
  items.value.push({ _key: uid(), title: '' })
}

function createFolder() {
  items.value.push({ _key: uid(), name: '', children: [] })
}

function batchItems() {}

function openActions(event, item, index) {
  const rect = event.currentTarget.getBoundingClientRect()
  const width = 148
  menu.index = index
  menu.item = item
  menu.top = rect.bottom + 4
  menu.left = Math.min(rect.right - width, window.innerWidth - width - 8)
}

function closeMenu() {
  menu.index = -1
  menu.item = null
}

function runAction(fn) {
  const item = menu.item
  const index = menu.index
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

function onBoxConfirm() {
  boxResolve?.(box.input ? box.value : true)
  boxResolve = null
}

function onBoxCancel() {
  boxResolve?.(null)
  boxResolve = null
}

async function renameItem(item) {
  const next = await ask({
    title: isFolder(item)
      ? i18n.value['library-rename-folder-prompt']
      : i18n.value['library-rename-prompt'],
    input: true,
    value: isFolder(item) ? item.name ?? '' : item.title ?? '',
  })
  if (next == null) return
  if (isFolder(item)) item.name = next
  else item.title = next
}

async function passwordItem(item) {
  const next = await ask({
    title: i18n.value['library-password-prompt'],
    input: true,
    type: 'password',
    placeholder: i18n.value['library-password-placeholder'],
    value: '',
  })
  if (next == null) return
  if (item.setPassword) item.setPassword(next)
  else item.password = next
}

async function removeItem(item, index) {
  const ok = await ask({
    title: i18n.value['library-delete-confirm'].replace(
      '{title}',
      itemTitle(item),
    ),
  })
  if (!ok) return
  items.value.splice(index, 1)
}

function indexFromY(clientY) {
  const nodes = listEl.value?.querySelectorAll('.item')
  if (!nodes?.length) return -1
  for (let i = 0; i < nodes.length; i++) {
    const rect = nodes[i].getBoundingClientRect()
    if (clientY < rect.top + rect.height / 2) return i
  }
  return nodes.length - 1
}

function moveItem(from, to) {
  if (from === to || from < 0 || to < 0) return
  const list = items.value
  const [moved] = list.splice(from, 1)
  list.splice(to, 0, moved)
}

function onPointerDown(event, index) {
  if (event.pointerType === 'mouse' && event.button !== 0) return
  pendingDrag = { index, y: event.clientY }
  window.addEventListener('pointermove', onPointerMove, { passive: false })
  window.addEventListener('pointerup', onPointerUp)
}

function onPointerMove(event) {
  if (!pendingDrag && !drag.active) return
  if (drag.active) event.preventDefault()
  if (pendingDrag) {
    if (Math.abs(event.clientY - pendingDrag.y) < 8) return
    drag.active = true
    drag.from = pendingDrag.index
    drag.over = pendingDrag.index
    didDrag.value = true
    pendingDrag = null
    closeMenu()
  }
  const over = indexFromY(event.clientY)
  if (over >= 0) drag.over = over
}

function onPointerUp() {
  if (drag.active) moveItem(drag.from, drag.over)
  drag.active = false
  drag.from = -1
  drag.over = -1
  pendingDrag = null
  window.removeEventListener('pointermove', onPointerMove)
  window.removeEventListener('pointerup', onPointerUp)
}

onBeforeUnmount(() => {
  window.removeEventListener('pointermove', onPointerMove)
  window.removeEventListener('pointerup', onPointerUp)
})
</script>
