/**
 * @description 路由守卫，目前两种模式：all模式与intelligence模式
 */
import VabProgress from 'nprogress'
import 'nprogress/nprogress.css'
import type { Router } from 'vue-router'
import { authentication, loginInterception, routesWhiteList, supportVisit } from '/@/config'
import { exchangeLarkToken } from '/@/api/lark'
import { createFeishuDoc } from '/@/api/devlocal/ai'
import { useRoutesStore } from '/@/store/modules/routes'
import { useSettingsStore } from '/@/store/modules/settings'
import { useUserStore } from '/@/store/modules/user'
import getPageTitle from '/@/utils/pageTitle'
import { toLoginRoute } from '/@/utils/routes'

export const setupPermissions = (router: Router) => {
  VabProgress.configure({
    easing: 'ease',
    speed: 500,
    trickleSpeed: 200,
    showSpinner: false,
  })
  router.beforeEach(async (to, from, next) => {
    const {
      getTheme: { showProgressBar },
    } = useSettingsStore()
    const { routes, setRoutes } = useRoutesStore()
    const userStore = useUserStore()
    const { token, getUserInfo, setVirtualRoles, resetAll } = userStore

    // 飞书 OAuth 回调形如 http://host/?code=xxx&userid=XXX#/
    // Why: 参数在 # 之前，须从 window.location.search 读取；hash 路由下 to.path 是 '/'。
    // URL 里的 userid 是飞书回填的占位字面量，不可信，user_id 必须取自当前系统登录人。
    const urlParams = new URLSearchParams(window.location.search)
    const code = urlParams.get('code')
    if (code) {
      if (showProgressBar) VabProgress.start()
      // 新开 tab 里 token 已从 localStorage 恢复，但 userId state 可能尚未填充，先拉一次用户信息
      try {
        if (token) await getUserInfo()
      } catch (error) {
        console.error('[路由守卫] 飞书回调拉取用户信息失败:', error)
      }
      const userId = userStore.getUserId
      if (userId) {
        // 把 token 交换隔离在独立 try/catch：即使后端 lark/token/exchange 失败，
        // 也不能影响下面 pending 队列的消费，否则用户会看到"授权成功了但什么都没创建"
        try {
          await exchangeLarkToken({ authorization_code: code, user_id: userId })
        } catch (error) {
          console.error('[路由守卫] 飞书 token 交换失败:', error)
        }
      } else {
        console.error('[路由守卫] 飞书回调缺少当前登录用户 userId，token=', token)
      }
      if (userId) {
        // pending 队列按 userId 命名空间存数组：跨账号天然隔离，本次回调只消费当前用户的项
        const storageKey = `feishu_doc_pending_${userId}`
        const pendingRaw = localStorage.getItem(storageKey)
        console.log('[飞书诊断] 进入消费块，userId=', userId, 'storageKey=', storageKey)
        console.log('[飞书诊断] pendingRaw=', pendingRaw)
        if (pendingRaw) {
          let items: Array<{ conversationId: string; prompt?: string }> = []
          try {
            const parsed = JSON.parse(pendingRaw)
            console.log('[飞书诊断] parsed=', parsed, 'isArray=', Array.isArray(parsed), 'typeof=', typeof parsed)
            if (Array.isArray(parsed)) {
              items = parsed.filter(
                (p): p is { conversationId: string; prompt?: string } => !!p && typeof p === 'object' && p.conversationId != null
              )
            }
          } catch (e) {
            console.error('[路由守卫] 解析飞书文档待处理项失败:', e)
          }
          console.log('[飞书诊断] items.length=', items.length, 'items=', items)
          for (const { conversationId, prompt } of items) {
            console.log('[飞书诊断] 即将调 createFeishuDoc，conversationId=', conversationId, 'prompt=', prompt)
            try {
              const resp = await createFeishuDoc(String(conversationId), typeof prompt === 'string' ? prompt : undefined)
              console.log('[飞书诊断] createFeishuDoc 返回=', resp)
            } catch (e) {
              console.error('[路由守卫] 创建飞书文档失败:', e, (e as Error)?.stack)
            }
          }
          localStorage.removeItem(storageKey)
        } else {
          console.warn('[飞书诊断] pendingRaw 为空，本次回调不会消费任何 pending 项')
        }
      } else {
        console.warn('[飞书诊断] userId 为空，跳过消费 pending 队列')
      }
      // 一次性清理：升级为 per-user key 后，老的全局 key 不再有写入方
      localStorage.removeItem('feishu_doc_pending_conversations')
      document.body.innerHTML = `<div style="display:flex;align-items:center;justify-content:center;height:100vh;font-size:18px;color:#666;">操作完成，请手动关闭此页面</div>`
      if (showProgressBar) VabProgress.done()
      // window.close()
      return next(false)
    }

    if (showProgressBar) VabProgress.start()

    let hasToken = token

    if (!loginInterception) hasToken = true

    if (hasToken) {
      if (routes.length > 0) {
        // 禁止已登录用户返回登录页
        if (to.path === '/login') {
          next({ path: '/' })
          if (showProgressBar) VabProgress.done()
        } else next()
      } else {
        try {
          // config/setting.config.js loginInterception为false(关闭登录拦截时)时，创建虚拟角色
          if (loginInterception) {
            await getUserInfo()
          } else {
            await setVirtualRoles()
          }
          // 根据路由模式获取路由并根据权限过滤
          await setRoutes(authentication)
          next({ ...to, replace: true })
        } catch (error) {
          console.error('vue-shop-vite 错误拦截:', error)
          if (showProgressBar) VabProgress.done()
          await resetAll()
          next(toLoginRoute(to.fullPath))
        }
      }
    } else {
      if (routesWhiteList.includes(to.path)) {
        // 设置游客路由(不需要可以删除)
        if (supportVisit && routes.length === 0) {
          await setRoutes('visit')
          next({ path: to.path, replace: true })
        } else next()
      } else next(toLoginRoute(to.fullPath))
    }
  })
  router.afterEach((to) => {
    if (typeof to.meta.title === 'string') document.title = getPageTitle(to.meta.title)
    if (VabProgress.status) VabProgress.done()
  })

  router.onError((error: any) => {
    console.error('vue-shop-vite 错误拦截:', error.message)
    if (VabProgress.status) VabProgress.done()
  })

  return router
}
