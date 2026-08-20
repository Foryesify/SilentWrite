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

export const Userdata = {
  newEssay: (name) => {
    
  }
}
