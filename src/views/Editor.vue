<template>
  <div class="editor"></div>
</template>

<style scoped>
.editor {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  min-width: 0;
}
</style>

<script setup>
import { onMounted, onBeforeUnmount } from 'vue'
import { EditorState } from '@codemirror/state'
import { EditorView, placeholder, keymap } from '@codemirror/view'
import { defaultKeymap, history, historyKeymap } from '@codemirror/commands'
import { indentWithTab } from '@codemirror/commands'
import { searchKeymap } from '@codemirror/search'
import { markdown } from '@codemirror/lang-markdown'
import { yamlFrontmatter } from '@codemirror/lang-yaml'
import { markdownTheme } from '@/views/editor/markdownTheme'
import { ui } from '@/components/state'

let view = null

onMounted(() => {
  view = new EditorView({
    parent: document.querySelector(".editor"),
    state: EditorState.create({
      extensions: [
        history(),
        placeholder(ui.value['editor-placeholder']),
        EditorView.lineWrapping,
        keymap.of([
          indentWithTab,
          ...defaultKeymap,
          ...historyKeymap,
          ...searchKeymap,
        ]),
        yamlFrontmatter({ content: markdown() }),
        ...markdownTheme,
      ],
    }),
  })
})

onBeforeUnmount(() => {
  view?.destroy()
})
</script>
