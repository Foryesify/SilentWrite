import { reactive, watch } from 'vue'

const DB_NAME = 'silentwrite'
const STORE = 'userdata'

class Folder {
  name = ''
  password = ''
  children = []

  constructor(name) {
    this.name = name
  }

  setPassword(password) {
    this.password = password
  }

  appendChild(name, isFolder) {
    this.children.push(new (isFolder ? Folder : File)(name))
    return this.children.at(-1)
  }

  deleteChild(i) {
    this.children.splice(i, 1)
  }

  adjustOrder(i1, i2) {
    const _ = this.children[i1]
    this.children[i1] = this.children[i2]
    this.children[i2] = 0
  }

  getFile(index_arr, i = 0) {
    if (!index_arr?.length) return null
    const child = this.children[index_arr[i]]
    if (!child) return null
    return child.children ? child.getFile(index_arr, i + 1) : child
  }
}

export function pathOf(item, folder = library, trail = []) {
  const i = folder.children.indexOf(item)
  if (i >= 0) return [...trail, i]
  for (let j = 0; j < folder.children.length; j++) {
    const child = folder.children[j]
    if (!child.children) continue
    const found = pathOf(item, child, [...trail, j])
    if (found) return found
  }
}

class File {
  title = ''
  content = ''
  password = ''

  constructor(title) {
    this.title = title
  }

  setPassword(password) {
    this.password = password
  }

  setContent(content) {
    this.content = content
  }

  text() {
    return this.content
  }
}

export const settings = reactive({
  autohideDistraction: true,
  cursorMoveAnimation: true,
  cursorBlinking: true,
  lang: 'zh-CN',
})

export const library = reactive(new Folder('library'))

function dumpItem(item) {
  if (Array.isArray(item.children)) {
    return {
      type: 'folder',
      name: item.name,
      password: item.password,
      children: item.children.map(dumpItem),
    }
  }
  return {
    type: 'file',
    title: item.title,
    content: item.content,
    password: item.password,
  }
}

function loadItem(data, parent) {
  if (data.type === 'folder') {
    const folder = parent.appendChild(data.name ?? '', true)
    folder.password = data.password ?? ''
    for (const child of data.children ?? []) loadItem(child, folder)
    return
  }
  const file = parent.appendChild(data.title ?? '', false)
  file.password = data.password ?? ''
  file.content = data.content ?? ''
}

function snapshot() {
  return {
    version: 1,
    settings: { ...settings },
    library: dumpItem(library),
  }
}

function openDb() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1)
    req.onupgradeneeded = () => req.result.createObjectStore(STORE)
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })
}

async function persist() {
  try {
    const db = await openDb()
    await new Promise((resolve, reject) => {
      const tx = db.transaction(STORE, 'readwrite')
      tx.objectStore(STORE).put(snapshot(), 'current')
      tx.oncomplete = resolve
      tx.onerror = () => reject(tx.error)
    })
  } catch {}
}

async function restore() {
  try {
    const db = await openDb()
    const saved = await new Promise((resolve, reject) => {
      const req = db.transaction(STORE).objectStore(STORE).get('current')
      req.onsuccess = () => resolve(req.result)
      req.onerror = () => reject(req.error)
    })
    if (!saved) return
    if (saved.settings) Object.assign(settings, saved.settings)
    if (saved.library) {
      library.password = saved.library.password ?? ''
      for (const child of saved.library.children ?? []) {
        loadItem(child, library)
      }
    }
  } catch {}
}

export async function initUserdata() {
  await restore()
  let timer = 0
  watch([library, settings], () => {
    clearTimeout(timer)
    timer = window.setTimeout(persist, 200)
  }, { deep: true })
  window.addEventListener('pagehide', persist)
}
