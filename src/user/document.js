import { ref } from 'vue'
import { editor, editorEpoch, changePage } from './session.js'
import { library, pathOf } from './userdata.js'
import { bindHandle, boundFile, ensureWritePermission, readHandle, unbindHandle } from './diskFile.js'

export const isDiskDoc = ref(false)

export function currentDoc() {
  return boundFile() ?? library.getFile(editor.file)
}

export function openLibraryDoc(file) {
  unbindHandle()
  isDiskDoc.value = false
  editor.file = pathOf(file) ?? []
  revealEditor()
}

export async function openDiskDoc(handle) {
  await ensureWritePermission(handle)
  const text = await readHandle(handle)
  editor.file = []
  bindHandle(handle, text)
  isDiskDoc.value = true
  revealEditor()
}

export function closeDocument() {
  unbindHandle()
  isDiskDoc.value = false
  editor.file = []
}

export function leaveEditor() {
  closeDocument()
}

function revealEditor() {
  editorEpoch.value += 1
  changePage('Editor')
}
