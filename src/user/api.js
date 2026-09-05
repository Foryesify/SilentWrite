import { applyUserdata, importLibraryTree, library } from './userdata.js'
import { changePage, editor } from './session.js'
import { closeDocument, currentDoc, openDiskDoc, openLibraryDoc } from './document.js'
import { canPickMarkdown, consumeFileLaunches, flushDisk, listenFileLaunches, pickFolderFiles, pickMarkdown } from './diskFile.js'
import { i18n } from './i18n.js'
import { nameBox } from '@/components/Name.vue'
import { packUserdataZip, unpackUserdataFiles, unpackUserdataZip } from './archive.js'

export { Appwindow } from './appwindow.js'

export async function newEssay(parent = library) {
  if (!parent?.appendChild) parent = library
  const name = await nameBox.ask({
    title: i18n.value['new-essay-title'],
    placeholder: i18n.value['new-essay-placeholder'],
  })
  if (name == null) return
  const file = parent.appendChild(name, false)
  openLibraryDoc(file)
}

export async function newFolder(parent = library) {
  if (!parent?.appendChild) parent = library
  const name = await nameBox.ask({
    title: i18n.value['new-folder-title'],
    placeholder: i18n.value['new-folder-placeholder'],
  })
  if (name == null) return
  return parent.appendChild(name, true)
}

export function openEssay(file) {
  openLibraryDoc(file)
}

export { canPickMarkdown, listenFileLaunches }

export async function openMarkdown(handle) {
  try {
    currentDoc()?.setContent(editor.text())
    const file = handle ?? (await pickMarkdown())
    if (!file) return
    await openDiskDoc(file)
  } catch {}
}

export function saveMarkdown() {
  return flushDisk()
}

export function bindFileLaunches() {
  consumeFileLaunches((handle) => {
    openMarkdown(handle)
  })
}

export function exportUserdata() {
  currentDoc()?.setContent(editor.text())
  const a = document.createElement('a')
  a.href = URL.createObjectURL(new Blob([packUserdataZip()], { type: 'application/zip' }))
  a.download = `${new Date().toLocaleDateString('en-CA')}.zip`
  a.click()
  URL.revokeObjectURL(a.href)
}

export async function importUserdata() {
  const file = await pickZipFile()
  if (!file) return
  if (!applyUserdata(unpackUserdataZip(new Uint8Array(await file.arrayBuffer())))) return
  closeDocument()
  changePage('Home')
}

export async function importFolder() {
  try {
    const picked = await pickFolderFiles()
    if (!picked) return
    const data = unpackUserdataFiles(picked.files)
    if (!data?.library?.children.length) return
    const name = String(picked.name ?? '').trim() || 'imported'
    const folder = library.appendChild(name, true)
    if (!importLibraryTree(data.library, folder)) return
    closeDocument()
    changePage('Library')
  } catch {}
}

function pickZipFile() {
  return new Promise((resolve) => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'application/zip,.zip'
    input.addEventListener('change', () => resolve(input.files?.[0] ?? null), { once: true })
    input.click()
  })
}
