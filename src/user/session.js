import { ref } from 'vue'

export const page = ref('Home')
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
