# 主题草案：暖纸 / 夜灯

这次改过一版视觉，但决定先不落地。当前界面保持原样；「主题」作为可选项，留到之后开发。

首页只保留两个按钮，不要字标或装饰线。

## 意图

- 浅色：暖纸，不是冷灰白。奶油底、暖墨字、深褐主按钮。
- 深色：暖褐分层，不是一片平灰。深褐黑底、顶部琥珀灯晕、暖金主按钮。
- 写作工具，安静即可，不要花哨。

## 接入时建议

- 在 `settings` 里加主题字段，和 `lang` 一样持久化。
- 用 `html[data-theme]` 或 class 切换 token，不要只靠 `prefers-color-scheme`；系统跟随可以做成其中一个选项。
- 菜单里的「主题」以后再加，这次不要改 `Commands.vue`。
- 编辑器颜色在 `src/editor/theme.js`，需要跟同一套主题走。
- 浏览器 / PWA 的 `theme-color`、`background_color` 也要跟着换。

## 界面 token

原有变量名尽量沿用。下面是这版提案。

### 共用

```css
--border-radius-standard: 7px;
--border-radius-large: 12px;
```

### 浅色（暖纸）

```css
color-scheme: light;
--color-primary: #4a3728;
--color-primary-hover: #5c4533;
--color-danger: #c24a32;
--color-text: #2c2418;
--color-text-bold: #241c12;
--color-text-muted: #7a6d5c;
--color-text-on-accent: #faf4ea;
--color-background: #f4efe6;
--color-foreground: #fffaf3;
--color-layer: #faf6ee;
--color-overlay: #fffaf3;
--color-control: #fffdf8;
--color-hover: #eee4d4;
--color-pressed: #e4d8c4;
--color-border: #e8dcc8;
--color-border-strong: #d4c4a8;
--color-focus-ring: #4a372829;
--color-backdrop: #3a2a1840;
--bg-glow:
  radial-gradient(ellipse 80% 50% at 50% -8%, #fff8ee 0%, transparent 58%),
  radial-gradient(ellipse 42% 32% at 100% 108%, #efe4d0 0%, transparent 55%);
--shadow-card: 0 1px 2px #3a2a180f, 0 2px 8px #3a2a1814;
--shadow-flyout: 0 4px 10px #3a2a1814, 0 12px 24px #3a2a181f;
--shadow-standard: 0 8px 16px #3a2a181a, 0 20px 40px #3a2a1826;
```

### 深色（夜灯）

```css
color-scheme: dark;
--color-primary: #e8c9a0;
--color-primary-hover: #f0d8b6;
--color-danger: #e06a52;
--color-text: #f0e6d6;
--color-text-bold: #faf3e8;
--color-text-muted: #b8a894;
--color-text-on-accent: #1c1610;
--color-background: #16110d;
--color-foreground: #241e18;
--color-layer: #1e1914;
--color-overlay: #2a241c;
--color-control: #2a231c;
--color-hover: #332b22;
--color-pressed: #3d3428;
--color-border: #3d3428;
--color-border-strong: #564a3a;
--color-focus-ring: #e8c9a033;
--color-backdrop: #08060480;
--bg-glow:
  radial-gradient(ellipse 80% 52% at 50% -8%, #4a3420 0%, transparent 55%),
  radial-gradient(ellipse 52% 40% at 90% 110%, #2e1d12 0%, transparent 58%);
--shadow-card: 0 0 0 1px #e8c9a00f, 0 8px 20px #00000066;
--shadow-flyout: 0 0 0 1px #e8c9a014, 0 12px 32px #00000080;
--shadow-standard: 0 0 0 1px #e8c9a01a, 0 20px 48px #00000099;
```

`body` 用 `--color-background` 打底，再叠 `--bg-glow`，`background-attachment: fixed`。

遮罩用 `--color-backdrop`，不要写死 `#7774`。

## 编辑器

浅色：

```js
--cm-fg: '#2c2418'
--cm-heading: '#241c12'
--cm-muted: '#a89880'
--cm-selection: '#ebe0cc'
--cm-caret: '#4a3728'
--cm-placeholder: '#8a7b68'
--cm-link: '#6b4f32'
--cm-link-underline: '#c4b198'
```

深色：

```js
--cm-fg: '#efe6d6'
--cm-heading: '#f7efe3'
--cm-muted: 'rgba(232, 201, 160, 0.48)'
--cm-selection: '#3d3428'
--cm-caret: '#e8c9a0'
--cm-placeholder: 'rgba(240, 230, 214, 0.32)'
--cm-link: '#e8c9a0'
--cm-link-underline: 'rgba(232, 201, 160, 0.45)'
```

## 组件

- 主按钮带一点卡片阴影；次按钮用前景底 + 描边，不要只用 hover 色当底。
- 输入框 focus 用 `--color-primary` 描边，外加 `--color-focus-ring`。
- 弹层、菜单用 `--color-overlay`。
- 文库列表可以垫一层纸卡片（前景底、细边、卡片阴影），首页不要。
- 标题字重用 `650` 即可。

## 外壳颜色

- 浅色 `theme-color`：`#f4efe6`
- 深色 `theme-color`：`#16110d`
- PWA `background_color` / `theme_color`：先跟深色 `#16110d`，以后按所选主题写。

## 原主题里顺手能修的问题

- 深色 `--color-text-muted` 写了两次，后面的 `#5d5d5d` 把前面盖掉了，暗色次要文字几乎看不见。
- `highlightStyle.js` 用了 `--cm-link` / `--cm-link-underline`，编辑器主题里没定义。
- `.card` 的 `border` 少了宽度和样式，写成 `border: var(--color-border)` 不会出边。

## 会动到的文件

- `src/style.css`
- `src/editor/theme.js`
- `src/basic/Overlay.vue`
- `src/basic/MsgBox.vue`
- `src/basic/PopMenu.vue`
- `src/views/Library.vue`
- `src/components/Name.vue`
- `src/views/Library/Password.vue`
- `src/views/Library/Rename.vue`
- `index.html`
- `vite.config.js`
- 以后还要动 `src/user/userdata.js`、`src/user/i18n.js`、`src/components/Commands.vue`
