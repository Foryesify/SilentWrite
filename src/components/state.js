import { computed, reactive } from 'vue'
import i18n from '@/assets/i18n.json'

export const settings = reactive({
  titlebarAutoHideDisabled: false,
  lang: 'zh-CN',
})

export const ui = computed(() => i18n[settings.lang])

export const newEssayMsgbox = reactive({
  visible: false,
})
