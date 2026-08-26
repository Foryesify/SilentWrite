import { strFromU8, strToU8, unzipSync, zipSync } from 'fflate'
import { library, snapshot } from './userdata.js'

const META = '._silentwrite_.json'

export function packUserdataZip() {
  const files = { [META]: strToU8(JSON.stringify(snapshot(), null, 2)) }
  addFiles(library, '', new Set(), files)
  return zipSync(files)
}

export function unpackUserdataZip(bytes) {
  let files
  try {
    files = unzipSync(bytes)
  } catch {
    return null
  }
  const key = Object.keys(files).find((k) => k.replace(/\\/g, '/').split('/').pop() === META)
  if (key) try { return JSON.parse(strFromU8(files[key])) } catch {}
  return treeFromFiles(files)
}

function addFiles(folder, prefix, used, files) {
  for (const child of folder.children) {
    if (child.children) {
      const name = takeName(used, child.name)
      if (!child.children.length) files[`${prefix}${name}/`] = new Uint8Array()
      else addFiles(child, `${prefix}${name}/`, new Set(), files)
    } else {
      files[`${prefix}${takeName(used, child.title)}.md`] = strToU8(child.content ?? '')
    }
  }
}

function treeFromFiles(files) {
  const root = { type: 'folder', name: 'library', password: '', children: [] }
  for (const [key, data] of Object.entries(files)) {
    const slash = key.replace(/\\/g, '/')
    const parts = slash.replace(/\/$/, '').split('/').filter(Boolean)
    if (!parts.length || parts.some((p) => p === '__MACOSX' || p.startsWith('.'))) continue
    const isFile = parts.at(-1).toLowerCase().endsWith('.md')
    if (!isFile && !slash.endsWith('/')) continue
    let node = root
    for (const part of isFile ? parts.slice(0, -1) : parts) {
      let next = node.children.find((c) => c.children && c.name === part)
      if (!next) {
        next = { type: 'folder', name: part, password: '', children: [] }
        node.children.push(next)
      }
      node = next
    }
    if (isFile) {
      node.children.push({ type: 'file', title: parts.at(-1).slice(0, -3), content: strFromU8(data), password: '' })
    }
  }
  sortTree(root)
  return { library: root }
}

function sortTree(node) {
  const name = (item) => item.name ?? item.title
  node.children.sort((a, b) => name(a).localeCompare(name(b), undefined, { numeric: true }))
  for (const child of node.children) if (child.children) sortTree(child)
}

function takeName(used, raw) {
  let name = String(raw ?? '')
    .replace(/[<>:"/\\|?*\x00-\x1f]/g, '')
    .replace(/[. ]+$/g, '')
    .trim()
  if (!name || name === '.' || name === '..') name = 'untitled'
  let next = name
  for (let i = 2; used.has(next.toLowerCase()); i++) next = `${name} ${i}`
  used.add(next.toLowerCase())
  return next
}
