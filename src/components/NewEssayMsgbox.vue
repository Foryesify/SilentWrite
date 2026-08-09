<template>
  <Teleport to="body">
    <Transition name="msgbox-fade">
      <div v-if="newEssayMsgbox.visible" class="overlay" @click.self="close">
        <div class="panel" role="dialog" aria-modal="true">
          <div class="title">{{ ui['new-essay-title'] }}</div>

          <input ref="inputRef" v-model="name" class="input" :placeholder="ui['new-essay-placeholder']"
            @keydown.enter="confirm" />

          <div class="footer">
            <div class="btn btn-secondary" @click="close">
              {{ ui['msgbox-cancel'] }}
            </div>
            <div class="btn btn-primary" @click="confirm">
              {{ confirmLabel }}
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { computed, ref, watch, nextTick } from 'vue'
import { ui, newEssayMsgbox } from '@/components/state'
import { createEssay } from '@/components/methods'
import { router } from '@/router'

const inputRef = ref(null)
const name = ref('')

const confirmLabel = computed(() =>
  name.value.trim()
    ? ui.value['msgbox-confirm']
    : ui.value['new-essay-skip'],
)

watch(
  () => newEssayMsgbox.visible,
  async (visible) => {
    if (!visible) return
    name.value = ''
    await nextTick()
    inputRef.value?.focus()
  },
)

function close() {
  newEssayMsgbox.visible = false
}

function confirm() {
  const title = name.value.trim() || ui.value['library-untitled']
  const file = createEssay(title)
  close()
  router.push({ name: 'Editor', params: { id: file.id } })
}
</script>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #0006;
  backdrop-filter: blur(4px);
}

.panel {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 18rem;
  padding: 1.25rem;
  border-radius: 8px;
  background: var(--color-background);
  color: var(--color-text);
  box-shadow: 0 8px 32px #0004;
}

.title {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--color-bold);
}

.input {
  padding: 0.4rem 0.6rem;
  border: 1px solid #7775;
  border-radius: 4px;
  background: transparent;
  color: inherit;
}

.footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
}

.btn {
  padding: 0.35rem 0.85rem;
  border-radius: 4px;
  cursor: pointer;
  user-select: none;
}

.btn-primary {
  border: none;
  background: var(--color-bold);
  color: var(--color-background);
}

.btn-secondary {
  background: transparent;
  border: 1px solid #7775;
}

.msgbox-fade-enter-active,
.msgbox-fade-leave-active {
  transition: opacity 0.15s ease;
}

.msgbox-fade-enter-from,
.msgbox-fade-leave-to {
  opacity: 0;
}
</style>
