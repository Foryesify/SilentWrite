import { ref } from 'vue'

/** 应用窗口接口，负责应用端的Tauri窗口操作 */
export const AppWindow = {
  /**
   * 窗口操作是否可用
   * @returns {boolean} 窗口操作可用则为true，否则为false
   */
  available() {
    return !!(window.__TAURI_INTERNALS__ || window.__DEBUG__)
  },
  /** 
   * 最小化窗口，若不可用则静默失败
   */
  minimize() {

  },
  /** 
   * 最大化或还原窗口，若不可用则静默失败
   */
  toggleMaximize() {

  },
  /** 
   * 关闭窗口，若不可用则静默失败
   */
  close() {

  },
  /** 
   * 切换全屏，若不可用则静默失败 
   */
  toggleFullscreen() {

  },
  /**
   * 设置窗口的模糊透明效果（如果可用）
   * @param {number} transparency 透明度大小，100则设置为禁用
   */
  acrylic(transparency) { }
}

/** 文件存储接口，应用端根目录为本地数据，移动端根目录为IndexedDB root */
export const FileStorage = {
  /**
   * 创建文件，path的最后一个项目为文件名
   * @param {string} path 路径，最后一个项目为文件名，若目录不存在则创建
   */
  createFile(path) {

  },
  /**
   * 创建目录
   * @param {string} path 路径，若目录不存在则创建
   */
  createFolder(path) {

  },
  /**
   * 读取文件
   * @param {string} path 路径
   */
  read(path) {

  },
  /**
   * 写入文件
   * @param {string} path 路径
   * @param {string} content 写入的内容
   */
  write(path, content) {

  },
  /**
   * 删除一个文件或目录
   * @param {string} path 路径名，若为目录则删除目录
   */
  delete(path) {

  },
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

/** 文件类，用于文件存储 */
export class File {
  /** @type {string} 文件名 */
  name = ""
  /** @type {string} 文件密码 */
  password = ""
  /** @type {string} 文件内容  */
  content = ""
  /**
   * 初始化一个文件
   * @param {string} name 文件名或文件对象
   */
  constructor(name) { }
  /**
   * 获取文件内文字内容
   * @returns {string} 编辑器内的文字内容
   */
  readText() {
    return this.content
  }
  /**
   * 抛弃当前文件内容并填入文字
   * @param {string} text 要填入的文字
   */
  fillText(text) {
    this.content = text
  }
  /**
   * 设置文件名
   * @param {string} name 文件名
   */
  setName(name) {
    this.name = name
  }
  /**
   * 设置密码
   * @param {string} password 密码
   */
  setPassword(password) {
    this.password = password
  }
}

/** 文件夹类，用于文件存储 */
export class Folder {
  /** @type {string} 文件夹名 */
  name = ""
  /** @type {string} 密码 */
  password = ""
  /** @type {Object<string, File|Folder>} 所有子文件或子文件夹 */
  children = null
  /**
   * 初始化一个文件
   * @param {string} name 文件名或文件对象
   */
  constructor(name) {
    this.name = name
  }
  /**
   * 在当前目录下创建一个文件或者文件夹
   * @param {File|Folder} child 子节点
   */
  newChild(child) {
    this.children[child.name] = child
  }
  /**
   * 删除一个文件或文件夹
   * @param {string} name 文件或文件夹的名字
   */
  deleteChild(name) {
    delete this.children[name]
  }
  /**
   * 设置文件名
   * @param {string} name 文件名
   */
  setName(name) {
    this.name = name
  }
  /**
   * 设置密码
   * @param {string} password 密码
   */
  setPassword(password) {
    this.password = password
  }
}

/** 文件库接口，用于用户管理文件 */
export const LibraryManager = {
  /** @type {Folder} 根目录文件夹 */
  library: new Folder('/')
  // TODO:
}

/** 会话接口，记录此次临时全局变量 */
export const Session = {
  fileHandle: null,
  isLoading: false,
  saveQueue: Promise.resolve(),
}
