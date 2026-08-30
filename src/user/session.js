import { ref } from 'vue'

export const page = ref('Home')
export const editorEpoch = ref(0)
export const actionsHidden = ref(false)
export const navName = ref('nav-forward')

const PAGE_DEPTH = { Home: 0, Library: 1, Editor: 2 }

export function changePage(name) {
  if (name === page.value) return
  navName.value = (PAGE_DEPTH[name] ?? 0) < (PAGE_DEPTH[page.value] ?? 0) ? 'nav-back' : 'nav-forward'
  page.value = name
}

export const editor = {
  file: [],
  view: null,
  focused: ref(false),
  init(view) { this.view = view, this.focused.value = !!view?.hasFocus },
  text() { return this.view?.state.doc.toString() ?? '' },
}
