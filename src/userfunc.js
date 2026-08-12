import { library, File } from '@/userdata'
import { router } from '@/router'

export function newEssay() {
  router.push({ name: 'Editor' })
}

export function createEssay(title) {
  const file = new File(title)
  library.appendChild(file)
  return file
}

export function openLibrary() {
  router.push({ name: 'Library' })
}

export const appwindow = {
  toggleFullscreen() { },
  minimize() { },
  toggleMaximize() { },
  close() { },
}
