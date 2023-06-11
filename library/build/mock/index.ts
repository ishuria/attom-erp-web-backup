import { viteMockServe } from 'vite-plugin-mock'

export function createMock() {
  return viteMockServe({
    logger: false,
    ignore: /^index/,
    mockPath: './mock',
    enable: true,
  })
}
