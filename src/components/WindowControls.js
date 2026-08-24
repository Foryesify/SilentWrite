import { ref } from 'vue'

export const windowControls = {
  hidden: ref(false),
  hide() { this.hidden.value = true },
  show() { this.hidden.value = false },
}
