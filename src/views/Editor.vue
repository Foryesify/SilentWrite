<template>
  <div class="editor" @click="onEditorClick"></div>
</template>

<style scoped>
.editor {
  padding: 48px 0;
}
</style>

<script setup>
import i18n from '@/i18n'
import { onMounted, onBeforeUnmount } from 'vue'
import { EditorState } from '@codemirror/state'
import { EditorView, placeholder, keymap } from '@codemirror/view'
import { defaultKeymap, history, historyKeymap } from '@codemirror/commands'
import { indentWithTab } from '@codemirror/commands'
import { searchKeymap } from '@codemirror/search'
import { markdown } from '@codemirror/lang-markdown'
import { yamlFrontmatter } from '@codemirror/lang-yaml'
import { cm6ThemeSilent } from './editor/cm6ThemeSilent'
import { editorSession } from '@/userdata'

const HOME_TAP_COUNT = 5
const HOME_TAP_GAP = 450

let view = null
let homeTapCount = 0
let homeTapTimer = 0

function onEditorClick() {
  homeTapCount += 1
  clearTimeout(homeTapTimer)
  if (homeTapCount >= HOME_TAP_COUNT) {
    homeTapCount = 0
    return
  }
  homeTapTimer = window.setTimeout(() => {
    homeTapCount = 0
  }, HOME_TAP_GAP)
}

function onEditorFocus() {
  
}

function onEditorBlur() {
}

onMounted(() => {
  view = new EditorView({
    parent: document.querySelector('.editor'),
    state: EditorState.create({
      doc: editorSession.file?.content ?? '',
      extensions: [
        history(),
        placeholder(i18n.value['editor-placeholder']),
        EditorView.lineWrapping,
        keymap.of([
          indentWithTab,
          ...defaultKeymap,
          ...historyKeymap,
          ...searchKeymap,
        ]),
        yamlFrontmatter({ content: markdown() }),
        ...cm6ThemeSilent,
        EditorView.updateListener.of((update) => {
          if (!update.focusChanged) return
          if (update.view.hasFocus) onEditorFocus()
          else onEditorBlur()
        }),
      ],
    }),
  })
})

onBeforeUnmount(() => {
  clearTimeout(homeTapTimer)
  editorSession.file = null
  view = null
})
</script>
