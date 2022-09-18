import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import path from 'path'

export function createSvgIcons() {
  return createSvgIconsPlugin({
    iconDirs: [path.resolve(process.cwd(), 'src/icon')],
    symbolId: 'vab-icon-[name]',
  })
}
