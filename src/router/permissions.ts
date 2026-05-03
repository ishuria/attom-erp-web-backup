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
      try {
        // 新开 tab 里 token 已从 localStorage 恢复，但 userId state 可能尚未填充，先拉一次用户信息
        if (token && !userStore.getUserId) {
          await getUserInfo()
        }
        const userId = userStore.getUserId
        if (userId) {
          await exchangeLarkToken({ authorization_code: code, user_id: userId })
        } else {
          console.error('[路由守卫] 飞书回调缺少当前登录用户 userId，token=', token)
        }
        const pendingConversationId = localStorage.getItem('feishu_doc_conversation_id')
        if (pendingConversationId) {
          try {
            await createFeishuDoc(pendingConversationId)
          } catch (e) {
            console.error('[路由守卫] 创建飞书文档失败:', e)
          }
          localStorage.removeItem('feishu_doc_conversation_id')
        }
        document.body.innerHTML = `<div style="display:flex;align-items:center;justify-content:center;height:100vh;font-size:18px;color:#666;">操作完成，请手动关闭此页面</div>`
      } catch (error) {
        console.error('[路由守卫] 飞书 token 交换失败:', error)
      }
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
