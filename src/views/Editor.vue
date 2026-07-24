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

.codemirror-root :deep(.cm-editor) {
  height: 100%;
  width: 100%;
}
</style>

<script setup>
import { onMounted, onBeforeUnmount, ref, watch } from 'vue'
import { EditorState } from '@codemirror/state'
import { EditorView, placeholder, keymap } from '@codemirror/view'
import { defaultKeymap, history, historyKeymap } from '@codemirror/commands'
import { indentWithTab } from '@codemirror/commands'
import { yamlFrontmatter } from '@codemirror/lang-yaml'
import { searchKeymap } from '@codemirror/search'
import { text } from '@/components/state'
import { markdownTheme } from '@/editor/markdownTheme'
import { markdownLang } from '@/editor/markdownConfig'

const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['update:modelValue'])

const editorRoot = ref(null)
let view = null

onMounted(() => {
  view = new EditorView({
    parent: editorRoot.value,
    state: EditorState.create({
      doc: props.modelValue,
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
        yamlFrontmatter({ content: markdownLang }),
        ...markdownTheme,

        // 更新输入追踪到Vue emits
        EditorView.updateListener.of((update) => {
          if (update.docChanged) {
            emit('update:modelValue', update.state.doc.toString())
          }
        }),
      ],
    }),
  })
})

watch(
  () => props.modelValue,
  (value) => {
    if (!view) return
    const current = view.state.doc.toString()
    if (value === current) return
    view.dispatch({
      changes: { from: 0, to: current.length, insert: value ?? '' },
    })
  },
)

onBeforeUnmount(() => {
  view?.destroy()
  view = null
})
</script>
