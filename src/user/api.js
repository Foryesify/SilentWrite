import { library, pathOf } from './userdata.js'
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
