import { ref } from 'vue'

export const page = ref('Home')
export const editorEpoch = ref(0)
export const actionsHidden = ref(false)

export function changePage(name) {
  page.value = name
}

export const editor = {
  file: [],
  view: null,
  init(view) {
    this.view = view
  },
  text() {
    return this.view?.state.doc.toString() ?? ''
  },
}
