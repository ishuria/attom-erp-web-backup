import { isCheck } from '~/library/plugins/vab'

const createProdMockServer = async (mockList: any[]) => {
  const Mock: any = await import('mockjs')
  const { pathToRegexp } = await import('path-to-regexp')
  Mock.XHR.prototype.__send = Mock.XHR.prototype.send
  Mock.XHR.prototype.send = function () {
    if (!isCheck()) this.custom.xhr.responseType = ''
    if (this.custom.xhr) {
      this.custom.xhr.withCredentials = this.withCredentials || false
      if (this.responseType === 'arraybuffer') return
      if (this.responseType) this.custom.xhr.responseType = this.responseType
      debugger
    }
    if (this.custom.requestHeaders) {
      const headers: any = {}
      for (const k in this.custom.requestHeaders) {
        headers[k.toString().toLowerCase()] = this.custom.requestHeaders[k]
      }
      this.custom.options = Object.assign({}, this.custom.options, { headers })
    }
    // eslint-disable-next-line prefer-spread, prefer-rest-params
    this.__send.apply(this, arguments)
  }

  Mock.XHR.prototype.proxy_open = Mock.XHR.prototype.open

  Mock.XHR.prototype.open = function () {
    const responseType = this.responseType
    // eslint-disable-next-line prefer-rest-params
    this.proxy_open(...arguments)
    if (this.custom.xhr) if (responseType) this.custom.xhr.responseType = responseType
  }

  for (const { url, method, response, timeout } of mockList) {
    setupMock(Mock, timeout)
    Mock.mock(pathToRegexp(url, undefined, { end: false }), method || 'get', XHR2ExpressReqWrapper(Mock, response))
  }
}

const param2Obj = (url: string) => {
  const search = url.split('?')[1]
  if (!search) return {}
  return JSON.parse(`{"${decodeURIComponent(search).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"').replace(/\+/g, ' ')}"}`)
}

const XHR2ExpressReqWrapper = (_Mock: any, handle: (d: any) => any) => {
  return function (options: any) {
    let result = null
    if (typeof handle === 'function') {
      const { body, type, url, headers } = options
      let b = body
      try {
        b = JSON.parse(body)
      } catch {
        /* empty */
      }
      result = handle({
        method: type,
        body: b,
        query: param2Obj(url),
        headers,
      })
    } else result = handle
    return _Mock.mock(result)
  }
}

const setupMock = (mock: any, timeout = 0) => {
  timeout &&
    mock.setup({
      timeout,
    })
}

const modules = import.meta.glob('./**/*.ts', { eager: true })
const mockModules: any[] = []
Object.keys(modules).forEach((key) => {
  if (key.includes('/_')) return
  if (key.includes('/index.ts')) return

  const module: any = modules[key]
  mockModules.push(...module.default)
})

export const setupProdMockServer = () => {
  createProdMockServer(mockModules)
}
