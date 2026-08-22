<template>
  <div class="editor">
    <div class="back" @click="goBack">‹</div>
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
</style>

<script setup>
import { onBeforeUnmount, onMounted, watch } from 'vue'
import { EditorState } from '@codemirror/state'
import { EditorView, placeholder, keymap } from '@codemirror/view'
import { defaultKeymap, history, historyKeymap } from '@codemirror/commands'
import { indentWithTab } from '@codemirror/commands'
import { markdown } from '@codemirror/lang-markdown'
import { yamlFrontmatter } from '@codemirror/lang-yaml'
import { cm6ThemeSilent } from './editor/cm6ThemeSilent'
import { Session } from '@/user/api.js'
import { i18n } from '@/user/i18n.js'
import { changePage, page } from '@/user/session.js'

const SAVE_WAIT = 400

let view
let loaded = null
let saveTimer = 0

function extensions() {
  return [
    history(),
    placeholder(i18n.value['editor-placeholder']),
    EditorView.lineWrapping,
    ...cm6ThemeSilent,
    keymap.of([indentWithTab, ...defaultKeymap, ...historyKeymap]),
    yamlFrontmatter({ content: markdown() }),
    EditorView.updateListener.of((update) => {
      if (update.docChanged) queueSave()
    }),
  ]
}

function fileText() {
  return Session.editor.fileid?.getContent?.() ?? ''
}

function loadCurrent() {
  const file = Session.editor.fileid
  if (!view || file === loaded) return
  loaded = file
  view.setState(
    EditorState.create({
      doc: fileText(),
      extensions: extensions(),
    }),
  )
}

function queueSave() {
  clearTimeout(saveTimer)
  saveTimer = window.setTimeout(flushSave, SAVE_WAIT)
}

function flushSave() {
  clearTimeout(saveTimer)
  if (view && Session.editor.fileid) {
    Session.editor.save(view.state.doc.toString())
  }
}

function goBack() {
  flushSave()
  changePage('Home')
}

function onHidden() {
  if (document.hidden) flushSave()
}

onMounted(() => {
  view = new EditorView({
    parent: document.querySelector('.editor'),
    state: EditorState.create({
      doc: fileText(),
      extensions: extensions(),
    }),
  })
  loaded = Session.editor.fileid
  document.addEventListener('visibilitychange', onHidden)
})

watch([page, () => Session.editor.fileid], () => {
  if (page.value === 'Editor') loadCurrent()
  else flushSave()
})

onBeforeUnmount(() => {
  flushSave()
  document.removeEventListener('visibilitychange', onHidden)
  view?.destroy()
})
</script>
