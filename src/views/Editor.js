export const editor = {
  view: null,
  init(view) { this.view = view },
  text() { return view?.state.doc.toString() },
}
