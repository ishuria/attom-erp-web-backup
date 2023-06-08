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
    path: '/redirect',
    name: 'Redirect',
    component: () => import('/@/views/redirect/Redirect.vue'),
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
    path: '/chat',
    name: 'Chat',
    component: Layout,
    meta: {
      title: 'GPT',
      icon: 'chat-1-line',
    },
    children: [
      {
        path: 'chatGPT',
        name: 'ChatGPT',
        component: () => import('/@/views/chatGPT/ChatGPT.vue'),
        meta: {
          title: 'chatGPT',
          icon: 'chat-3-line',
        },
      },
    ],
  },
  {
    path: '/template',
    name: 'Template',
    component: Layout,
    meta: {
      title: '模板',
      icon: 'clipboard-line',
    },
    children: [
      {
        path: 'qRLogin',
        name: 'QRLogin',
        component: () => import('../views/template/QRLogin.vue'),
        meta: {
          title: '二维码登录',
          icon: 'qr-scan-2-line',
        },
      },
      {
        path: 'award',
        name: 'Award',
        component: () => import('../views/template/Award.vue'),
        meta: {
          title: '抽奖',
          icon: 'award-line',
        },
      },
      {
        path: 'lllustration',
        name: 'Lllustration',
        component: () => import('../views/template/Lllustration.vue'),
        meta: {
          title: '插画',
          icon: 'brush-3-line',
        },
      },
      {
        path: '403',
        name: 'Error403',
        component: () => import('../views/403.vue'),
        meta: {
          title: '403',
          icon: 'error-warning-line',
        },
      },
      {
        path: '404',
        name: 'Error404',
        component: () => import('../views/404.vue'),
        meta: {
          title: '404',
          icon: 'error-warning-line',
        },
      },
      {
        path: '500',
        name: 'Error500',
        component: () => import('../views/500.vue'),
        meta: {
          title: '500',
          icon: 'error-warning-line',
        },
      },
    ],
  },
  {
    path: '/vab',
    name: 'Vab',
    component: Layout,
    meta: {
      title: '组件',
      icon: 'code-box-line',
    },
    children: [
      {
        path: 'icon',
        name: 'Icon',
        meta: {
          title: '图标',
          icon: 'remixicon-line',
        },
        children: [
          {
            path: 'remixIcon',
            name: 'RemixIcon',
            component: () => import('/@/views/vab/icon/remixIcon.vue'),
            meta: {
              title: '小清新图标',
            },
          },
          {
            path: 'iconSelector',
            name: 'IconSelector',
            component: () => import('/@/views/vab/icon/iconSelector.vue'),
            meta: {
              title: '图标选择器',
            },
          },
          {
            path: 'customSvg',
            name: 'CustomSvg',
            component: () => import('/@/views/vab/icon/customSvg.vue'),
            meta: {
              title: '自定义图标',
            },
          },
        ],
      },
      {
        path: 'permission',
        name: 'Permission',
        component: () => import('/@/views/vab/permission/index.vue'),
        meta: {
          title: '角色权限',
          icon: 'user-3-line',
        },
      },
      {
        path: 'list',
        name: 'List',
        component: () => import('/@/views/vab/list/index.vue'),
        meta: {
          title: '列表',
          guard: ['Admin'],
          icon: 'list-check-2',
        },
      },
      {
        path: 'description',
        name: 'Description',
        component: () => import('/@/views/vab/description/index.vue'),
        meta: {
          title: '描述',
          guard: ['Admin'],
          icon: 'slideshow-line',
        },
      },
      {
        path: 'wangEditor',
        name: 'WangEditor',
        component: () => import('/@/views/vab/editor/wangEditor.vue'),
        meta: {
          title: '富文本编辑器',
          guard: ['Admin'],
          dot: true,
        },
      },
      {
        path: 'notice',
        name: 'Notice',
        component: () => import('/@/views/vab/notice/index.vue'),
        meta: {
          title: '通知',
          guard: ['Admin'],
          icon: 'message-2-line',
        },
      },
      {
        path: 'timeline',
        name: 'Timeline',
        component: () => import('/@/views/vab/timeline/index.vue'),
        meta: {
          title: '时间线',
          guard: ['Admin'],
          icon: 'time-line',
        },
      },
      {
        path: 'watermark',
        name: 'Watermark',
        component: () => import('/@/views/vab/watermark/index.vue'),
        meta: {
          title: '水印',
          guard: ['Admin'],
          icon: 'water-flash-line',
          dot: true,
        },
      },
      {
        path: 'form',
        name: 'Form',
        meta: {
          title: '表单',
          guard: ['Admin'],
          icon: 'file-list-2-line',
        },
        children: [
          {
            path: 'comprehensiveForm',
            name: 'ComprehensiveForm',
            component: () => import('/@/views/vab/form/comprehensiveForm.vue'),
            meta: {
              title: '综合表单',
            },
          },
          {
            path: 'stepForm',
            name: 'StepForm',
            component: () => import('/@/views/vab/form/stepForm.vue'),
            meta: {
              title: '分步表单',
            },
          },
          {
            path: 'button',
            name: 'Button',
            component: () => import('/@/views/vab/form/button.vue'),
            meta: {
              title: '按钮',
            },
          },
          {
            path: 'link',
            name: 'Link',
            component: () => import('/@/views/vab/form/link.vue'),
            meta: {
              title: '文字链接',
            },
          },
          {
            path: 'radio',
            name: 'Radio',
            component: () => import('/@/views/vab/form/radio.vue'),
            meta: {
              title: '单选框',
            },
          },
          {
            path: 'checkbox',
            name: 'Checkbox',
            component: () => import('/@/views/vab/form/checkbox.vue'),
            meta: {
              title: '多选框',
            },
          },
          {
            path: 'input',
            name: 'Input',
            component: () => import('/@/views/vab/form/input.vue'),
            meta: {
              title: '输入框',
            },
          },
          {
            path: 'inputNumber',
            name: 'InputNumber',
            component: () => import('/@/views/vab/form/inputNumber.vue'),
            meta: {
              title: '计数器',
            },
          },
          {
            path: 'select',
            name: 'Select',
            component: () => import('/@/views/vab/form/select.vue'),
            meta: {
              title: '选择器',
              dot: true,
            },
          },
          {
            path: 'switch',
            name: 'Switch',
            component: () => import('/@/views/vab/form/switch.vue'),
            meta: {
              title: '开关',
            },
          },
          {
            path: 'slider',
            name: 'Slider',
            component: () => import('/@/views/vab/form/slider.vue'),
            meta: {
              title: '滑块',
            },
          },
          {
            path: 'timePicker',
            name: 'TimePicker',
            component: () => import('/@/views/vab/form/timePicker.vue'),
            meta: {
              title: '时间选择器',
            },
          },
          {
            path: 'datePicker',
            name: 'DatePicker',
            component: () => import('/@/views/vab/form/datePicker.vue'),
            meta: {
              title: '日期选择器',
            },
          },
          {
            path: 'dateTimePicker',
            name: 'DateTimePicker',
            component: () => import('/@/views/vab/form/dateTimePicker.vue'),
            meta: {
              title: '日期时间选择器',
            },
          },
          {
            path: 'rate',
            name: 'Rate',
            component: () => import('/@/views/vab/form/rate.vue'),
            meta: {
              title: '评分',
            },
          },
        ],
      },
    ],
  },
  {
    path: '/setting',
    name: 'PersonnelManagement',
    component: Layout,
    meta: {
      title: '配置',
      icon: 'user-settings-line',
      guard: ['Admin'],
    },
    children: [
      {
        path: 'personalCenter',
        name: 'PersonalCenter',
        component: () => import('/@/views/setting/personalCenter/index.vue'),
        meta: {
          title: '个人中心',
          icon: 'map-pin-user-line',
        },
      },
      {
        path: 'userManagement',
        name: 'UserManagement',
        component: () => import('/@/views/setting/userManagement/index.vue'),
        meta: {
          title: '用户管理',
          icon: 'user-3-line',
        },
      },
      {
        path: 'roleManagement',
        name: 'RoleManagement',
        component: () => import('/@/views/setting/roleManagement/index.vue'),
        meta: {
          title: '角色管理',
          icon: 'admin-line',
        },
      },
      {
        path: 'departmentManagement',
        name: 'DepartmentManagement',
        component: () =>
          import('/@/views/setting/departmentManagement/index.vue'),
        meta: {
          title: '部门管理',
          icon: 'group-line',
        },
      },
      {
        path: 'menuManagement',
        name: 'MenuManagement',
        component: () => import('/@/views/setting/menuManagement/index.vue'),
        meta: {
          title: '菜单管理',
          icon: 'menu-2-fill',
        },
      },
      {
        path: 'dictionaryManagement',
        name: 'DictionaryManagement',
        component: () =>
          import('/@/views/setting/dictionaryManagement/index.vue'),
        meta: {
          title: '字典管理',
          icon: 'book-2-line',
          dot: true,
        },
      },
      {
        path: 'taskManagement',
        name: 'TaskManagement',
        component: () => import('/@/views/setting/taskManagement/index.vue'),
        meta: {
          title: '任务管理',
          icon: 'task-line',
          badge: 'New',
        },
      },
      {
        path: 'systemLog',
        name: 'SystemLog',
        component: () => import('/@/views/setting/systemLog/index.vue'),
        meta: {
          title: '系统日志',
          icon: 'file-shield-2-line',
        },
      },
    ],
  },
  {
    path: '/statcenter',
    name: 'Statcenter',
    component: Layout,
    meta: {
      title: '数据',
      icon: 'line-chart-line',
    },
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('/@/views/statcenter/Dashboard.vue'),
        meta: {
          title: '数据概况',
          icon: 'pie-chart-line',
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
        component: () => import('/@/views/goods/Detail.vue'),
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
    path: '/portal',
    name: 'Portal',
    component: () => import('/@/views/portal/Portal.vue'),
    meta: {
      title: '门户',
      icon: 'user-heart-line',
      target: '_blank',
    },
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
