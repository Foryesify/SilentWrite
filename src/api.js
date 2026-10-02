import { ref } from 'vue'
import { getCurrentWindow, Effect } from '@tauri-apps/api/window'

/** 应用窗口接口，负责应用端的Tauri窗口操作 */
export const AppWindow = {
  /**
   * 窗口操作是否可用
   * @returns {boolean} 窗口操作可用则为true，否则为false
   */
  available() { return !!(window.__TAURI_INTERNALS__ || window.__DEBUG__) },
  /** 最小化窗口 */
  minimize() { getCurrentWindow().minimize() },
  /** 最大化或还原窗口 */
  toggleMaximize() { getCurrentWindow().toggleMaximize() },
  /** 关闭窗口 */
  close() { getCurrentWindow().close() },
  /** 切换全屏 */
  toggleFullscreen() {
    const window = getCurrentWindow()
    window.isFullscreen().then((fullscreen) => window.setFullscreen(!fullscreen))
  },
  /**
   * 设置窗口的模糊透明效果
   * @param {number} transparency 透明度大小，100则设置为禁用
   */
  acrylic(transparency) {
    const root = document.documentElement
    const window = getCurrentWindow()
    if (transparency >= 100) {
      window.clearEffects()
      root.classList.remove('acrylic')
      return
    }

    const hex = getComputedStyle(root).getPropertyValue('--bg').trim().slice(1)
    const [r, g, b] = hex.match(/[\da-f]{2}/gi)?.map((part) => Number.parseInt(part, 16)) ?? [128, 128, 128]
    window.setEffects({ effects: [Effect.Acrylic], color: { r, g, b, a: Math.round((100 - transparency) * 2.55) } })
    root.classList.add('acrylic')
  }
}

/** 编辑器接口，用于外部直接访问和设置编辑器组件 */
export const EditorManager = {
  /** @type {EditorView} 全局编辑器对象，一个EditorView */
  editorObject: null,
  focus: ref(false),
  /**
   * 初始化全局编辑器对象
   * @param {EditorView} editorObject 一个CodeMirror6的EditorView类
   */
  init(editorObject, doc = '') {
    this.editorObject = editorObject
    this.fillText(doc)
  },
  /**
   * 设置当前是否有焦点
   */
  setFocus() {
    this.focus.value = this.editorObject.hasFocus
  },
  /**
   * 保存文件
   */
  saveDoc() {
    const fileHandle = Session.fileHandle
    if (!fileHandle || Session.isLoading) return Promise.resolve()

    const content = this.readText()
    Session.saveQueue = Session.saveQueue.then(async () => {
      const writable = await fileHandle.createWritable()
      try {
        await writable.write(content)
        await writable.close()
      } catch (error) {
        await writable.abort()
        throw error
      }
    }).catch((error) => {
      console.error('Failed to save the opened file:', error)
    })
    return Session.saveQueue
  },
  /**
   * 获取编辑器文字内容
   * @returns {string} 编辑器内的文字内容
   */
  readText() {
    return this.editorObject?.state.doc.toString() ?? ''
  },
  /**
   * 抛弃当前编辑器的内容并填入文字
   * @param {string} text 要填入的文字
   */
  fillText(text) {
    const obj = this.editorObject, len = obj?.state.doc.length
    obj?.dispatch({ changes: { from: 0, to: len, insert: text, }, })
  }
}

/** 会话接口，记录此次临时全局变量 */
export const Session = {
  fileHandle: null,
  isLoading: false,
  saveQueue: Promise.resolve(),
}
