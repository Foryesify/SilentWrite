import { newEssayMsgbox } from '@/components/state'
import { library, File } from '@/components/usrdata'
import { router } from '@/router'

export function newEssay() {
  newEssayMsgbox.visible = true
}

export function createEssay(title) {
  const file = new File(title)
  library.appendChild(file)
  return file
}

export function openLibrary() {
  router.push({ name: 'Library' })
}
