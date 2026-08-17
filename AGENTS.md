# AGENTS

这是一份供 AI 阅读的文档，也是项目的计划书，记录着项目的整体架构和规划。

## 关于这个项目

这是一个 Markdown 编辑器项目，主打简洁和干净的编辑体验，详见 README。项目使用前端技术栈构建，桌面端用 Electron，因为 Webkit 和 Linux 上非 Chromium 系的 Webview 对于某些动画支持是有 bug 的，我这边测试会严重掉帧。

市场上的 Markdown 编辑器功能大多十分强大，这个项目是一个做减法的尝试。

## 项目的数据文件规划

项目分为 Web 端和 App 端，对于 Web 端，采用 IndexedDB 存储数据；对于 App 端，采用文件来存，直接用  `app.getPath('appData')` 就行了。IndexedDB 和 appData 具体内容应该完全相同，都是这样子：

```
userdata.json
essays/
  <user_costom_folder>...
    <essay_id>.json...
  <essay_id>.json...
trash/
  essay_id.json...
```

其中用户的文章用 json 格式存储，因为很多自定义元数据不能直接存储到 Markdown 原文里。

具体文章数据格式如下：

```json
{
  // basic
  version,
  id,
  // essay information
  title,
  author,
  lang,
  date,
  updated,
  // advanced
  password,
}
```

