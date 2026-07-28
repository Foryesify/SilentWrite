<template>
  <div class="editor">
    <div class="codemirror-root" ref="editorRoot"></div>
  </div>
</template>

<style scoped>
.editor {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  min-width: 0;
}

.codemirror-root {
  flex: 1;
  width: 100%;
  min-width: 0;
  min-height: 0;
  height: 100%;
}
</style>

<script setup>
import { onMounted, onBeforeUnmount, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { EditorState } from '@codemirror/state'
import { EditorView, placeholder, keymap } from '@codemirror/view'
import { defaultKeymap, history, historyKeymap } from '@codemirror/commands'
import { indentWithTab } from '@codemirror/commands'
import { markdown } from '@codemirror/lang-markdown'
import { yamlFrontmatter } from '@codemirror/lang-yaml'
import { searchKeymap } from '@codemirror/search'
import { text } from '@/components/state'
import { markdownTheme } from '@/views/editor/markdownTheme'
import { createEssay, getEssay, updateEssay } from '@/library/store'

const route = useRoute()
const router = useRouter()
const editorRoot = ref(null)

let view = null
let essayId = null
let saveTimer = null
let applyingExternal = false

function persist(content) {
  if (!essayId) return
  updateEssay(essayId, { content })
}

function scheduleSave(content) {
  clearTimeout(saveTimer)
  saveTimer = setTimeout(() => persist(content), 280)
}

function setDoc(content) {
  if (!view) return
  const current = view.state.doc.toString()
  if (content === current) return
  applyingExternal = true
  view.dispatch({
    changes: { from: 0, to: current.length, insert: content ?? '' },
  })
  applyingExternal = false
}

function ensureEssay() {
  const id = typeof route.params.id === 'string' ? route.params.id : ''
  if (id) {
    const essay = getEssay(id)
    if (essay) {
      essayId = essay.id
      return essay
    }
    router.replace('/library')
    return null
  }

  const essay = createEssay()
  essayId = essay.id
  router.replace(`/editor/${essay.id}`)
  return essay
}

onMounted(() => {
  const essay = ensureEssay()
  if (!essay || !editorRoot.value) return

  view = new EditorView({
    parent: editorRoot.value,
    state: EditorState.create({
      doc: essay.content,
      extensions: [
        history(),
        placeholder(text.value['editor-placeholder']),
        EditorView.lineWrapping,
        keymap.of([
          indentWithTab,
          ...defaultKeymap,
          ...historyKeymap,
          ...searchKeymap,
        ]),
        yamlFrontmatter({ content: markdown() }),
        ...markdownTheme,
        EditorView.updateListener.of((update) => {
          if (!update.docChanged || applyingExternal) return
          scheduleSave(update.state.doc.toString())
        }),
      ],
    }),
  })
})

watch(
  () => route.params.id,
  (id) => {
    if (!view || typeof id !== 'string' || !id) return
    if (id === essayId) return

    const essay = getEssay(id)
    if (!essay) {
      router.replace('/library')
      return
    }

    if (essayId) {
      persist(view.state.doc.toString())
    }

    essayId = essay.id
    setDoc(essay.content)
  },
)

onBeforeUnmount(() => {
  clearTimeout(saveTimer)
  if (view && essayId) {
    persist(view.state.doc.toString())
  }
  view?.destroy()
  view = null
})
</script>
