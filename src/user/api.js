import { applyUserdata, library, pathOf } from './userdata.js'
import { changePage, editor } from './session.js'
import { i18n } from './i18n.js'
import { nameBox } from '@/components/Name.vue'
import { packUserdataZip, unpackUserdataZip } from './archive.js'

export const Appwindow = {
  minimize: () => {},
  toggleMaximize: () => {},
  close: () => {},
  toggleFullscreen: () => {},
  isWebsite: () =>
    !(
      window.__TAURI_INTERNALS__ ||
      navigator.userAgent.includes('Electron') ||
      window.__FORYES_APP__
    ),
}

export async function newEssay(parent = library) {
  if (!parent?.appendChild) parent = library
  const name = await nameBox.ask({
    title: i18n.value['new-essay-title'],
    placeholder: i18n.value['new-essay-placeholder'],
  })
  if (name == null) return
  const file = parent.appendChild(name, false)
  editor.file = pathOf(file)
  changePage('Editor')
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
  editor.file = pathOf(file)
  changePage('Editor')
}

export function exportUserdata() {
  const file = library.getFile(editor.file)
  if (file) file.setContent(editor.text())
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
  editor.file = []
  changePage('Home')
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
