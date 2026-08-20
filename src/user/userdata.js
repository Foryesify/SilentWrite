import { reactive } from 'vue'

class Folder {
  name = ''
  password = ''
  children = []

  constructor(name) {
    this.name = name
  }

  setPassword(password) {
    this.password = password
  }

  appendChild(name, isFolder) {
    this.children.push(new (isFolder ? Folder : File)(name))
  }

  deleteChild(i) {
    this.children.splice(i, 1)
  }

  adjustOrder(i1, i2) {
    const _ = this.children[i1]
    this.children[i1] = this.children[i2]
    this.children[i2] = 0
  }

  findFile(index_arr, i = 0) {
    return (this.children[index_arr[i]].children) ?
      this.findFile(index_arr, i + 1) :
      this.children[index_arr[i]]
  }
}

class File {
  title = ''
  content = ''
  password = ''

  constructor(title) {
    this.title = title
  }

  setPassword(password) {
    this.password = password
  }

  setContent(content) {
    this.content = content
  }

  getContent() {
    return this.content
  }
}

export const settings = reactive({
  autohideDistraction: true,
  cursorBlinking: true,
  cursorMoveAnimation: true,
  lang: 'zh-CN',
})

export const library = new Folder('library')
