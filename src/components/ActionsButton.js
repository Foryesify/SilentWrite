import { ref } from 'vue'

export const actionsButton = {
  hidden: ref(false),
  hide() { this.hidden.value = true },
  show() { this.hidden.value = false },
}
