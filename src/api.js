import { library } from "./userdata"

export const Appwindow = {
  minimize: () => { },
  toggleMaximize: () => { },
  close: () => { },
  toggleFullscreen: () => { },
  isWebsite: () => !(
    window.__TAURI_INTERNALS__ ||
    navigator.userAgent.includes('Electron') ||
    window.__FORYES_APP__
  ),
}

export const Session = {
  editor: {
    file: null
  }
}

export const Userdata = {
  newFile: (name) => {
    library.appendChild(File("name"))
  },
  newFolder: (name) => {
  }
}
