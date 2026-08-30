const MD_TYPES = [
  {
    description: 'Markdown',
    accept: {
      'text/markdown': ['.md', '.markdown'],
      'text/plain': ['.md', '.markdown'],
    },
  },
]

let bound = null
let writeTimer = 0
let writeQueue = Promise.resolve()

const pendingLaunches = []
let launchConsumer = null

export function canPickMarkdown() {
  return typeof window.showOpenFilePicker === 'function'
}

export function boundFile() {
  return bound
}

export function bindHandle(handle, content) {
  const prev = bound
  if (prev && prev.handle !== handle) enqueueWrite(prev.handle, prev.content)
  bound = {
    handle,
    content,
    name: handle.name || 'untitled.md',
    text() {
      return this.content
    },
    setContent(text) {
      this.content = text
      scheduleWrite()
    },
  }
  return bound
}

export function unbindHandle() {
  const prev = bound
  bound = null
  clearTimeout(writeTimer)
  writeTimer = 0
  if (prev?.handle) enqueueWrite(prev.handle, prev.content)
}

export function flushDisk() {
  if (!bound?.handle) return writeQueue
  clearTimeout(writeTimer)
  writeTimer = 0
  return enqueueWrite(bound.handle, bound.content)
}

export async function pickFolderFiles() {
  if (typeof window.showDirectoryPicker === 'function') {
    try {
      const handle = await window.showDirectoryPicker()
      return { name: handle.name, files: await readDirHandle(handle) }
    } catch {
      return null
    }
  }
  const list = await pickFolderInput()
  if (!list?.length) return null
  return filesFromFileList(list)
}

async function readDirHandle(handle, prefix = '') {
  const files = {}
  for await (const child of handle.values()) {
    const name = child.name
    const skip = name === '__MACOSX' || (name.startsWith('.') && name !== '._silentwrite_.json')
    if (skip) continue
    if (child.kind === 'directory') {
      const nested = await readDirHandle(child, `${prefix}${name}/`)
      Object.assign(files, nested)
      if (!Object.keys(nested).length) files[`${prefix}${name}/`] = new Uint8Array()
    } else if (name === '._silentwrite_.json' || /\.(md|markdown)$/i.test(name)) {
      files[`${prefix}${name}`] = new Uint8Array(await (await child.getFile()).arrayBuffer())
    }
  }
  return files
}

function pickFolderInput() {
  return new Promise((resolve) => {
    const input = document.createElement('input')
    input.type = 'file'
    input.webkitdirectory = true
    input.multiple = true
    input.addEventListener('change', () => resolve([...(input.files ?? [])]), { once: true })
    input.addEventListener('cancel', () => resolve([]), { once: true })
    input.click()
  })
}

async function filesFromFileList(list) {
  const files = {}
  let root = ''
  for (const file of list) {
    const parts = (file.webkitRelativePath || file.name).replace(/\\/g, '/').split('/').filter(Boolean)
    if (parts.length >= 2) root ||= parts[0]
    const inner = (parts.length >= 2 ? parts.slice(1) : parts).join('/')
    const base = inner.split('/').pop()
    if (!base || inner.split('/').some((p) => p === '__MACOSX' || (p.startsWith('.') && p !== '._silentwrite_.json'))) {
      continue
    }
    if (base === '._silentwrite_.json' || /\.(md|markdown)$/i.test(base)) {
      files[inner] = new Uint8Array(await file.arrayBuffer())
    }
  }
  return { name: root || 'imported', files }
}

export async function pickMarkdown() {
  if (!canPickMarkdown()) return null
  try {
    const [handle] = await window.showOpenFilePicker({
      types: MD_TYPES,
      multiple: false,
    })
    return handle ?? null
  } catch {
    return null
  }
}

export async function readHandle(handle) {
  return (await handle.getFile()).text()
}

export async function ensureWritePermission(handle) {
  const opts = { mode: 'readwrite' }
  try {
    if (handle.queryPermission && (await handle.queryPermission(opts)) === 'granted') return true
    if (handle.requestPermission && (await handle.requestPermission(opts)) === 'granted') return true
    return !handle.queryPermission
  } catch {
    return false
  }
}

export function listenFileLaunches() {
  if ('launchQueue' in window) {
    window.launchQueue.setConsumer((params) => {
      const handle = params.files?.[0]
      if (!handle) return
      if (launchConsumer) launchConsumer(handle)
      else pendingLaunches.push(handle)
    })
  }
  window.addEventListener('pagehide', () => {
    flushDisk()
  })
}

export function consumeFileLaunches(fn) {
  launchConsumer = fn
  while (pendingLaunches.length) fn(pendingLaunches.shift())
}

function scheduleWrite() {
  clearTimeout(writeTimer)
  writeTimer = window.setTimeout(() => {
    writeTimer = 0
    flushDisk()
  }, 400)
}

function enqueueWrite(handle, content) {
  writeQueue = writeQueue.then(() => writeOnce(handle, content)).catch(() => {})
  return writeQueue
}

async function writeOnce(handle, content) {
  if (!handle) return
  if (!(await ensureWritePermission(handle))) return
  const writable = await handle.createWritable()
  await writable.write(content)
  await writable.close()
}
