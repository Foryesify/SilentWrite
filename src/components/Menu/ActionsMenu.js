import { ref } from 'vue'

export const actionsMenu = {
  hidden: ref(true),
  show() {
    this.hidden.value = false
  },
  hide() {
    this.hidden.value = true
  },
}
