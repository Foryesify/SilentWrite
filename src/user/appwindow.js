const BG = { dark: '#202020', light: '#f3f3f3' }

const win = window.__TAURI_INTERNALS__
  ? import('@tauri-apps/api/window').then((m) => m.getCurrentWindow())
  : null

function call(name, ...args) {
  win?.then((w) => w[name](...args))
}

function paint(theme) {
  const dark = theme === 'dark'
  const color = dark ? BG.dark : BG.light
  document.documentElement.style.backgroundColor = color
  document.documentElement.style.colorScheme = dark ? 'dark' : 'light'
  return color
}

export const Appwindow = {
  minimize: () => call('minimize'),
  toggleMaximize: () => call('toggleMaximize'),
  close: () => call('close'),
  toggleFullscreen() {
    win?.then((w) => w.isFullscreen().then((full) => w.setFullscreen(!full)))
  },
  isWebsite: () => !window.__TAURI_INTERNALS__ && !navigator.userAgent.includes('Electron'),
  reveal() {
    win?.then((w) => {
      const apply = (theme) => call('setBackgroundColor', paint(theme))
      w.theme().then(apply)
      w.onThemeChanged(({ payload }) => apply(payload))
      requestAnimationFrame(() => requestAnimationFrame(() => call('show')))
    })
  },
}

if (win) {
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'F11') return
    e.preventDefault()
    Appwindow.toggleFullscreen()
  })
}
