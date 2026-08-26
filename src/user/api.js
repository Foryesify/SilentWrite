import { applyUserdata, library, pathOf, snapshot } from './userdata.js'
import { changePage, editor } from './session.js'
import { i18n } from './i18n.js'
import { nameBox } from '@/components/Name.vue'

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

export function exportUserdataJson() {
  const file = library.getFile(editor.file)
  if (file) file.setContent(editor.text())
  const blob = new Blob([JSON.stringify(snapshot(), null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'silentwrite.json'
  a.click()
  URL.revokeObjectURL(url)
}

export async function importUserdataJson() {
  const file = await pickJsonFile()
  if (!file) return
  let data
  try {
    data = JSON.parse(await file.text())
  } catch {
    return
  }
  if (!applyUserdata(data)) return
  editor.file = []
  changePage('Home')
}

function pickJsonFile() {
  return new Promise((resolve) => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'application/json,.json'
    input.addEventListener('change', () => resolve(input.files?.[0] ?? null), { once: true })
    input.click()
  })
}
