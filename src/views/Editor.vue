<template>
  <div class="editor"></div>
</template>

<style scoped>
.editor {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding-top: 48px;
}

</style>

<script setup>
import i18n from '@/i18n'
import { onMounted, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { EditorState } from '@codemirror/state'
import { EditorView, placeholder, keymap } from '@codemirror/view'
import { defaultKeymap, history, historyKeymap } from '@codemirror/commands'
import { indentWithTab } from '@codemirror/commands'
import { searchKeymap } from '@codemirror/search'
import { markdown } from '@codemirror/lang-markdown'
import { yamlFrontmatter } from '@codemirror/lang-yaml'
import { cm6ThemeSilent } from './editor/cm6ThemeSilent'
import { library, editorSession } from '@/userdata'
import { createEssay, saveEssay } from '@/userfunc'

const route = useRoute()
const router = useRouter()

let view = null

function bindFile() {
  const id = route.params.id
  let file = typeof id === 'string' && id ? library.findFile(id) : null
  if (!file) {
    file = createEssay('')
    router.replace({ name: 'Editor', params: { id: file.id } })
  }
  editorSession.file = file
  editorSession.getContent = () => view?.state.doc.toString() ?? file.content
  return file
}

onMounted(() => {
  const file = bindFile()
  view = new EditorView({
    parent: document.querySelector('.editor'),
    state: EditorState.create({
      doc: file.content,
      extensions: [
        history(),
        placeholder(i18n.value['editor-placeholder']),
        EditorView.lineWrapping,
        keymap.of([
          {
            key: 'Mod-s',
            preventDefault: true,
            run: () => {
              saveEssay()
              return true
            },
          },
          indentWithTab,
          ...defaultKeymap,
          ...historyKeymap,
          ...searchKeymap,
        ]),
        yamlFrontmatter({ content: markdown() }),
        ...cm6ThemeSilent,
      ],
    }),
  })
  window.addEventListener('pagehide', saveEssay)
})

onBeforeUnmount(() => {
  window.removeEventListener('pagehide', saveEssay)
  saveEssay()
  editorSession.file = null
  editorSession.getContent = () => ''
  view?.destroy()
  view = null
})
</script>
