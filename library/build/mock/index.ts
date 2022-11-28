import { viteMockServe } from 'vite-plugin-mock'

export function createMock() {
  return viteMockServe({
    logger: false,
    ignore: /^index/,
    injectCode: `
      import { setupProdMockServer } from '/mock/index'
      setupProdMockServer()
      `,
  })
}
