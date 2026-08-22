<template>
  <div class="editor">
    <ActionsButton />
  </div>
</template>

<style scoped>
.editor {
  display: flex;
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
import { cm6ThemeSilent } from '@/editor/cm6ThemeSilent'
import { Session } from '@/user/api.js'
import { i18n } from '@/user/i18n.js'
import { page } from '@/user/session.js'
import ActionsButton from '@/components/ActionsButton.vue'
import {
  hideActionsButton,
  showActionsButton,
} from '@/components/ActionsButton.js'
import {
  hideWindowControls,
  showWindowControls,
} from '@/components/WindowControls.js'

const SAVE_WAIT = 400

let view
let loaded = null
let saveTimer = 0

function extensions() {
  return [
    ...cm6ThemeSilent, // my theme
    yamlFrontmatter({ content: markdown() }),  // language

    history(), // history undos
    placeholder(i18n.value['editor-placeholder']), // placeholder
    EditorView.lineWrapping, // line autowrap
    keymap.of([indentWithTab, ...defaultKeymap, ...historyKeymap]), // keymap
    EditorView.updateListener.of((update) => {
      if (update.docChanged) queueSave()
      if (update.focusChanged) syncChrome(update.view)
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

function syncChrome(editor = view) {
  if (editor?.hasFocus) {
    hideActionsButton()
    hideWindowControls()
  } else {
    showActionsButton()
    showWindowControls()
  }
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
  syncChrome()
  document.addEventListener('visibilitychange', onHidden)
})

watch([page, () => Session.editor.fileid], () => {
  if (page.value === 'Editor') {
    loadCurrent()
    syncChrome()
  } else {
    flushSave()
    showActionsButton()
    showWindowControls()
  }
})

onBeforeUnmount(() => {
  flushSave()
  document.removeEventListener('visibilitychange', onHidden)
  view?.destroy()
})
</script>
