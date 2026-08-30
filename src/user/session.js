import { ref, shallowReactive } from 'vue'

export const page = ref('Home')
export const editorEpoch = ref(0)
export const navName = ref('nav-forward')

const PAGE_DEPTH = { Home: 0, Library: 1, Editor: 2 }

export function changePage(name) {
  if (name === page.value) return
  navName.value = (PAGE_DEPTH[name] ?? 0) < (PAGE_DEPTH[page.value] ?? 0) ? 'nav-back' : 'nav-forward'
  page.value = name
}

export const editor = shallowReactive({
  file: [],
  view: null,
  focused: false,
  init(view) {
    this.view = view
    this.focused = !!view?.hasFocus
  },
  text() { return this.view?.state.doc.toString() ?? '' },
})
