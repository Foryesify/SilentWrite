import { ref } from 'vue'

export const windowControlsHidden = ref(false)

export function hideWindowControls() {
  windowControlsHidden.value = true
}

export function showWindowControls() {
  windowControlsHidden.value = false
}
