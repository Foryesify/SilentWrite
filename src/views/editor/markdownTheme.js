import { drawSelection, highlightActiveLine } from '@codemirror/view'
import { headingHang } from './headingHang'
import { highlightStyle } from './highlightStyle'
import { theme } from './theme'

export const markdownTheme = [
  drawSelection({ cursorBlinkRate: 1050 }),
  highlightActiveLine(),
  theme(),
  highlightStyle(),
  headingHang(),
]
