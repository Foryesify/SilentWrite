import { drawSelection, highlightActiveLine } from '@codemirror/view'
import { headingHang } from './headingHang'
import { frontmatterYamlStyle, highlightStyle } from './highlightStyle'
import { theme } from './theme'

export const cm6ThemeSilent = [
  drawSelection({ cursorBlinkRate: 1000 }),
  highlightActiveLine(),
  theme(),
  highlightStyle(),
  frontmatterYamlStyle(),
  headingHang(),
]
