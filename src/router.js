import { ref } from 'vue';

export const page = ref('Home')
export function changePage(name) {
  page.value = name
}
