import { strFromU8, strToU8, unzipSync, zipSync } from 'fflate'
import { snapshot } from './userdata.js'

export const META_NAME = '._silentwrite_.json'

const INVALID_NAME = /[<>:"/\\|?*\u0000-\u001f]/g

export function packUserdataZip(library) {
  const files = { [META_NAME]: strToU8(JSON.stringify(snapshot(), null, 2)) }
  addFolderFiles(library, '', new Set(), files)
  return zipSync(files)
}

export function unpackUserdataZip(bytes) {
  let files
  try {
    files = unzipSync(bytes)
  } catch {
    return null
  }
  const meta = readMeta(files)
  if (meta) return meta
  return treeFromFiles(files)
}

function addFolderFiles(folder, prefix, used, files) {
  for (const child of folder.children) {
    if (Array.isArray(child.children)) {
      const name = uniqueName(used, safeName(child.name, 'folder'))
      if (!child.children.length) files[`${prefix}${name}/`] = new Uint8Array(0)
      else addFolderFiles(child, `${prefix}${name}/`, new Set(), files)
    } else {
      const filename = uniqueName(used, safeName(child.title, 'untitled'), '.md')
      files[`${prefix}${filename}`] = strToU8(child.content ?? '')
    }
  }
}

function readMeta(files) {
  for (const [key, data] of Object.entries(files)) {
    if (normalizePath(key) !== META_NAME) continue
    try {
      return JSON.parse(strFromU8(data))
    } catch {
      return null
    }
  }
  return null
}

function treeFromFiles(files) {
  const root = { type: 'folder', name: 'library', password: '', children: [] }
  for (const [key, data] of Object.entries(files)) {
    const path = normalizePath(key)
    if (!path || shouldSkip(path)) continue
    if (path.endsWith('/')) {
      ensureFolder(root, splitPath(path.slice(0, -1)))
      continue
    }
    if (!path.toLowerCase().endsWith('.md')) continue
    const parts = splitPath(path)
    const filename = parts.pop()
    const parent = ensureFolder(root, parts)
    parent.children.push({
      type: 'file',
      title: filename.slice(0, -3),
      content: strFromU8(data),
      password: '',
    })
  }
  sortTree(root)
  return { version: 1, library: root }
}

function ensureFolder(root, parts) {
  let node = root
  for (const name of parts) {
    let child = node.children.find((item) => item.type === 'folder' && item.name === name)
    if (!child) {
      child = { type: 'folder', name, password: '', children: [] }
      node.children.push(child)
    }
    node = child
  }
  return node
}

function sortTree(node) {
  node.children.sort((a, b) => itemName(a).localeCompare(itemName(b), undefined, { numeric: true, sensitivity: 'base' }))
  for (const child of node.children) {
    if (child.type === 'folder') sortTree(child)
  }
}

function itemName(item) {
  return item.type === 'folder' ? item.name : item.title
}

function shouldSkip(path) {
  if (path === META_NAME) return true
  return path.split('/').some((part) => part === '__MACOSX' || part === '.DS_Store' || part.startsWith('._'))
}

function normalizePath(path) {
  return String(path)
    .replace(/\\/g, '/')
    .replace(/^\.?\//, '')
}

function splitPath(path) {
  return path.split('/').filter(Boolean)
}

function safeName(name, fallback) {
  const cleaned = String(name ?? '')
    .replace(INVALID_NAME, '')
    .replace(/[. ]+$/g, '')
    .trim()
  if (!cleaned || cleaned === '.' || cleaned === '..') return fallback
  return cleaned
}

function uniqueName(used, base, ext = '') {
  let stem = base
  let i = 2
  while (used.has((stem + ext).toLowerCase())) stem = `${base} ${i++}`
  used.add((stem + ext).toLowerCase())
  return stem + ext
}
