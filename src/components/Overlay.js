import { ref } from "vue";

export const overlay = {
  hidden: ref(true),
  show() { this.hidden.value = true },
  hide() { this.hidden.value = false },
}
