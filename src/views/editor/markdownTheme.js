import { drawSelection, highlightActiveLine } from '@codemirror/view'
import { headingHang } from './headingHang'
import { frontmatterYamlStyle, highlightStyle } from './highlightStyle'
import { theme } from './theme'

export const markdownTheme = [
  drawSelection({ cursorBlinkRate: 0 }),
  highlightActiveLine(),
  theme(),
  highlightStyle(),
  frontmatterYamlStyle(),
  headingHang(),
]
