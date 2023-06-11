import { viteMockServe as VabMockServe } from 'vite-plugin-mock'

export function createMock() {
  return VabMockServe({
    ignore: /^index/,
    mockPath: 'mock',
    injectCode: `
      import { setupProdMockServer } from '/mock/index'
      setupProdMockServer()
      `,
    logger: false,
  })
}
