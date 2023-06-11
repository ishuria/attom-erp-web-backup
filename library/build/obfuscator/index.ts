import obfuscatorPlugin from 'rollup-plugin-javascript-obfuscator'

export function createObfuscator(nodeEnv: string) {
  if (nodeEnv == 'development') return []
  return obfuscatorPlugin({
    compact: true,
  })
}
