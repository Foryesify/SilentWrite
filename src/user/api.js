import { library, pathOf } from './userdata.js'
import { changePage, editor } from './session.js'

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

export function newEssay(parent = library) {
  if (!parent?.appendChild) parent = library
  const file = parent.appendChild('', false)
  editor.file = pathOf(file)
  changePage('Editor')
}

export function newFolder(name = '', parent = library) {
  return parent.appendChild(name, true)
}

export function openEssay(file) {
  editor.file = pathOf(file)
  changePage('Editor')
}
