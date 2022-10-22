/**
 * @description router全局配置，如有必要可分文件抽离，其中asyncRoutes只有在intelligence模式下才会用到，pro版只支持remixIcon图标，具体配置请查看vip群文档
 */
import type { VabRouteRecordRaw } from './types'
import type { RouteRecordRaw } from 'vue-router'
import type { App } from 'vue'
import {
  createRouter,
  createWebHashHistory,
  createWebHistory,
  RouteRecordName,
} from 'vue-router'
import Layout from '/@vab/layouts/index.vue'
import setting from '/@/config'
import { setupPermissions } from '/@/router/permissions'
const { authentication, isHashRouterMode, publicPath } = setting

export const constantRoutes: VabRouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('/@/views/login/index.vue'),
    meta: {
      hidden: true,
    },
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('/@/views/register/index.vue'),
    meta: {
      hidden: true,
    },
  },
  {
    path: '/403',
    name: '403',
    component: () => import('/@/views/403.vue'),
    meta: {
      hidden: true,
    },
  },
  {
    path: '/404',
    name: '404',
    component: () => import('/@/views/404.vue'),
    meta: {
      hidden: true,
    },
  },
]

export const asyncRoutes: VabRouteRecordRaw[] = [
  {
    path: '/',
    name: 'Root',
    component: Layout,
    meta: {
      title: '首页',
      icon: 'home-2-line',
      breadcrumbHidden: true,
    },
    children: [
      {
        path: 'index',
        name: 'Index',
        component: () => import('/@/views/index/index.vue'),
        meta: {
          title: '首页',
          icon: 'home-2-line',
          noClosable: true,
        },
      },
    ],
  },
  {
    path: '/shop',
    name: 'Shop',
    component: Layout,
    meta: {
      title: '店铺',
      icon: 'shopping-bag-3-line',
    },
    children: [
      {
        path: 'shop',
        name: 'Shop',
        component: () => import('/@/views/index/index.vue'),
        meta: {
          title: '首页',
          icon: 'home-2-line',
        },
      },
    ],
  },
  {
    path: '/goods',
    name: 'Goods',
    component: Layout,
    meta: {
      title: '商品',
      icon: 'shopping-bag-3-line',
    },
    children: [
      {
        path: 'goodsManagement',
        name: 'GoodsManagement',
        component: () => import('/@/views/goods/GoodsManagement.vue'),
        meta: {
          title: '商品管理',
          icon: 'home-2-line',
        },
      },
      {
        path: 'detail',
        name: 'Detail',
        component: () => import('@/views/goods/Detail.vue'),
        meta: {
          hidden: true,
          title: '详情页',
          activeMenu: '/goods/goodsManagement',
          dynamicNewTab: true, //详情页根据id传参不同可打开多个
        },
      },
      {
        path: 'goodsTag',
        name: 'GoodsTag',
        component: () => import('/@/views/goods/GoodsTag.vue'),
        meta: {
          title: '商品分组',
          icon: 'home-2-line',
        },
      },
      {
        path: 'goodsTemplate',
        name: 'GoodsTemplate',
        component: () => import('/@/views/goods/GoodsTemplate.vue'),
        meta: {
          title: '商品分组',
          icon: 'home-2-line',
        },
      },
      {
        path: 'parameterDictionary',
        name: 'ParameterDictionary',
        component: () => import('/@/views/goods/ParameterDictionary.vue'),
        meta: {
          title: '参数字典',
          icon: 'home-2-line',
        },
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/404',
    name: 'NotFound',
    meta: {
      hidden: true,
    },
  },
]

const router = createRouter({
  history: isHashRouterMode
    ? createWebHashHistory(publicPath)
    : createWebHistory(publicPath),
  routes: constantRoutes as RouteRecordRaw[],
})

function fatteningRoutes(routes: VabRouteRecordRaw[]): VabRouteRecordRaw[] {
  return routes.flatMap((route) => {
    return route.children ? fatteningRoutes(route.children) : route
  })
}

function addRouter(routes: VabRouteRecordRaw[]) {
  routes.forEach((route: VabRouteRecordRaw) => {
    if (!router.hasRoute(route.name)) router.addRoute(route as RouteRecordRaw)
    if (route.children) addRouter(route.children)
  })
}

export function resetRouter(routes: VabRouteRecordRaw[] = constantRoutes) {
  routes.map((route: VabRouteRecordRaw) => {
    if (route.children) {
      route.children = fatteningRoutes(route.children)
    }
  })
  router.getRoutes().forEach((route) => {
    if (route.name) {
      const routeName: RouteRecordName = route.name
      router.hasRoute(routeName) && router.removeRoute(routeName)
    }
  })
  addRouter(routes)
}

export function setupRouter(app: App<Element>) {
  if (authentication === 'intelligence') addRouter(asyncRoutes)
  setupPermissions(router)
  app.use(router)
  return router
}

export default router
