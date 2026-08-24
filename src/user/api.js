import { reactive } from 'vue'
import { library } from './userdata.js'
import { changePage } from './session.js'

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

export const Session = reactive({
  editor: {
    fileid: null,
  },
})

export const Userdata = {
  newFile(name = '', parent = library) {
    return parent.appendChild(name, false)
  },
  newFolder(name = '', parent = library) {
    return parent.appendChild(name, true)
  },
}

export function newEssay(parent = library) {
  if (!parent?.appendChild) parent = library
  Session.editor.fileid = Userdata.newFile('', parent)
  changePage('Editor')
}

export function newFolder(name = '', parent = library) {
  return Userdata.newFolder(name, parent)
}

export function openEssay(file) {
  Session.editor.fileid = file
  changePage('Editor')
}
