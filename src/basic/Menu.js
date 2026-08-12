export class Menu {
  items = []
  constructor(items) {
    this.items = items
  }
}

export class MenuItem {
  name = ""
  children = []
  constructor(name, children) {
    this.name = name
    this.children = children
  }
}

export class MenuItemChild {
  name = ""
  action = () => {}
  constructor(name, action) {
    this.name = name
    this.action = action
  }
}
