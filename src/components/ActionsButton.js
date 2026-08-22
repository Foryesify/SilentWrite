import { ref } from 'vue'

export const actionsButtonHidden = ref(false)

export function hideActionsButton() {
  actionsButtonHidden.value = true
}

export function showActionsButton() {
  actionsButtonHidden.value = false
}
