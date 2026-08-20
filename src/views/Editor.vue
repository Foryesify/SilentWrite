<template>
  <div class="editor">
    <div class="back" @click="changePage('Home')">
      ‹
    </div>
  </div>
</template>

<style scoped>
.editor {
  display: flex;
  flex-direction: column;
  min-height: 100dvh;

  .back {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
    width: 15vw;
    height: 15vh;
    padding: 12px 16px;
    opacity: 0;
    font-size: 22px;
    font-weight: bold;
    color: var(--color-text-muted);
    cursor: pointer;
    transition: opacity var(--duration-fast) var(--ease-accelerate);

    &:hover {
      opacity: 1;
    }
  }
}

@keyframes back-show {
  0% {
    opacity: 1;
  }
  80% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
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
import { changePage, page } from '@/router'

let view = null

function onEditorFocused() {}

function onEditorUnfocused() {}

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
          if (update.view.hasFocus) onEditorFocused()
          else onEditorUnfocused()
        }),
      ],
    }),
  })
})

onBeforeUnmount(() => {
  editorSession.file = null
  view = null
})
</script>
