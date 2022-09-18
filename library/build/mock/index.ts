import { viteMockServe } from 'vite-plugin-mock'

export function createMock() {
  return viteMockServe({
    ignore: /^index/,
    mockPath: 'mock',
    injectCode: `
      import { setupProdMockServer } from '/mock/index'
      setupProdMockServer()
      `,
  })
}
