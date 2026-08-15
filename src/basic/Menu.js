export class Menu {
  items = []
  constructor(items) {
    this.items = items
  }
}

export class MenuItem {
  name = ''
  children = []
  action = null
  constructor(name, childrenOrAction = []) {
    this.name = name
    if (typeof childrenOrAction === 'function') {
      this.action = childrenOrAction
    } else {
      this.children = childrenOrAction
    }
  }
}

export class MenuItemChild {
  name = ''
  action = () => {}
  constructor(name, action = () => {}) {
    this.name = name
    this.action = action
  }
}
