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
import { authentication, isHashRouterMode, base } from '/@/config'
import { setupPermissions } from '/@/router/permissions'

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
    component: () => import('/@/views/error/403.vue'),
    meta: {
      hidden: true,
    },
  },
  {
    path: '/404',
    name: '404',
    component: () => import('/@/views/error/404.vue'),
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
      levelHidden: true,
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
          dot: true,
        },
      },
      {
        path: 'speechSynthesis',
        name: 'SpeechSynthesis',
        component: () => import('/@/views/chatGPT/SpeechSynthesis.vue'),
        meta: {
          title: '语音合成',
          icon: 'customer-service-line',
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
      {
        path: 'table',
        name: 'Table',
        meta: {
          title: '表格',
          // 非editor角色的用户可见
          guard: {
            role: ['Editor'],
            mode: 'except',
          },
          icon: 'table-2',
        },
        children: [
          {
            path: 'comprehensiveTable',
            name: 'ComprehensiveTable',
            component: () =>
              import('/@/views/vab/table/comprehensiveTable.vue'),
            meta: {
              title: '综合表格',
            },
          },
          {
            path: 'comprehensiveTableDetail',
            name: 'ComprehensiveTableDetail',
            component: () =>
              import('/@/views/vab/table/comprehensiveTableDetail.vue'),
            meta: {
              hidden: true,
              title: '详情页',
              activeMenu: '/vab/table/comprehensiveTable',
              dynamicNewTab: true, //详情页根据id传参不同可打开多个
            },
          },
        ],
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
        path: 'tree',
        name: 'Tree',
        component: () => import('/@/views/vab/tree/index.vue'),
        meta: {
          title: '树',
          guard: ['Admin'],
          icon: 'node-tree',
        },
      },
      {
        path: 'upload',
        name: 'Upload',
        component: () => import('/@/views/vab/upload/index.vue'),
        meta: {
          title: '上传',
          icon: 'upload-cloud-2-line',
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
        path: 'dynamicMeta',
        name: 'DynamicMeta',
        component: () => import('/@/views/vab/dynamicMeta/index.vue'),
        meta: {
          title: '动态Meta',
          guard: ['Admin'],
          icon: 'notification-badge-line',
          badge: '0',
        },
      },
      {
        path: 'tabs',
        name: 'Tabs',
        component: () => import('/@/views/vab/tabs/index.vue'),
        meta: {
          title: '多标签',
          guard: ['Admin'],
          icon: 'bank-card-line',
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
        path: 'menu1',
        name: 'Menu1',
        meta: {
          title: '多级路由缓存',
          guard: ['Admin'],
          icon: 'route-line',
        },
        children: [
          {
            path: 'menu1-1',
            name: 'Menu11',
            meta: {
              title: '多级路由1-1',
            },
            children: [
              {
                path: 'menu1-1-1',
                name: 'Menu111',
                meta: {
                  title: '多级路由1-1-1',
                },
                children: [
                  {
                    path: 'menu1-1-1-1',
                    name: 'Menu1111',
                    meta: {
                      title: '多级路由1-1-1-1',
                    },
                    component: () =>
                      import(
                        '/@/views/vab/nested/menu1/menu1-1/menu1-1-1/menu1-1-1-1/index.vue'
                      ),
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        path: 'statistic',
        name: 'Statistic',
        component: () => import('/@/views/vab/statistic/index.vue'),
        meta: {
          title: '统计',
          guard: ['Admin'],
          icon: 'bar-chart-2-line',
        },
      },
    ],
  },
  {
    path: '/other',
    name: 'Other',
    component: Layout,
    meta: {
      title: '其他',
      icon: 'archive-line',
      guard: ['Admin'],
    },
    children: [
      {
        path: 'echarts',
        name: 'Echarts',
        component: () => import('/@/views/other/echarts/index.vue'),
        meta: {
          title: '图表',
          guard: ['Admin'],
          icon: 'bubble-chart-line',
          noKeepAlive: true,
        },
      },
      {
        path: 'wangEditor',
        name: 'WangEditor',
        component: () => import('/@/views/other/editor/wangEditor.vue'),
        meta: {
          title: '富文本',
          icon: 'edit-box-line',
          guard: ['Admin'],
          dot: true,
        },
      },
      {
        path: 'video',
        name: 'Video',
        component: () => import('/@/views/other/video/index.vue'),
        meta: {
          title: '视频播放器',
          guard: ['Admin'],
          icon: 'video-line',
        },
      },
      {
        path: 'award',
        name: 'Award',
        component: () => import('/@/views/other/award/index.vue'),
        meta: {
          title: '抽奖',
          icon: 'award-line',
        },
      },
      {
        path: 'count',
        name: 'Count',
        component: () => import('/@/views/other/count/index.vue'),
        meta: {
          title: '数字自增长',
          guard: ['Admin'],
          icon: 'number-0',
        },
      },
      {
        path: 'signature',
        name: 'Signature',
        component: () => import('/@/views/other/signature/index.vue'),
        meta: {
          title: '签名',
          icon: 'edit-2-line',
          guard: ['Admin'],
          badge: 'New',
        },
      },
      {
        path: 'watermark',
        name: 'Watermark',
        component: () => import('/@/views/other/watermark/index.vue'),
        meta: {
          title: '水印',
          guard: ['Admin'],
          icon: 'water-flash-line',
          dot: true,
        },
      },

      {
        path: 'pdf',
        name: 'PDF',
        component: () => import('/@/views/other/pdf/index.vue'),
        meta: {
          title: 'PDF',
          guard: ['Admin'],
          icon: 'file-pdf-line',
        },
      },
      {
        path: 'print',
        name: 'Print',
        component: () => import('/@/views/other/print/index.vue'),
        meta: {
          title: '打印',
          guard: ['Admin'],
          icon: 'printer-line',
        },
      },
      {
        path: 'share',
        name: 'Share',
        component: () => import('/@/views/other/share/index.vue'),
        meta: {
          title: '分享',
          guard: ['Admin'],
          icon: 'share-line',
          dot: true,
        },
      },
      {
        path: 'passwordGenerator',
        name: 'PasswordGenerator',
        component: () => import('/@/views/other/passwordGenerator/index.vue'),
        meta: {
          title: '密码生成器',
          guard: ['Admin'],
          icon: 'lock-password-line',
          dot: true,
        },
      },
      {
        path: 'throttleDebounce',
        name: 'ThrottleDebounce',
        component: () => import('/@/views/other/throttleDebounce/index.vue'),
        meta: {
          title: '节流防抖',
          guard: ['Admin'],
          icon: 'water-percent-line',
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
        path: 'lllustration',
        name: 'Lllustration',
        component: () => import('/@/views/template/Lllustration.vue'),
        meta: {
          title: '插画',
          icon: 'brush-3-line',
          dot: true,
        },
      },
      {
        path: 'qRLogin',
        name: 'QRLogin',
        component: () => import('/@/views/template/QRLogin.vue'),
        meta: {
          title: '二维码登录',
          icon: 'qr-scan-2-line',
        },
      },
      {
        path: 'resume',
        name: 'Resume',
        component: () => import('/@/views/template/Resume.vue'),
        meta: {
          title: '简历',
          icon: 'folder-user-line',
        },
      },
      {
        path: '403',
        name: 'Error403',
        component: () => import('/@/views/error/403.vue'),
        meta: {
          title: '403',
          icon: 'error-warning-line',
        },
      },
      {
        path: '404',
        name: 'Error404',
        component: () => import('/@/views/error/404.vue'),
        meta: {
          title: '404',
          icon: 'error-warning-line',
        },
      },
      {
        path: '500',
        name: 'Error500',
        component: () => import('/@/views/error/500.vue'),
        meta: {
          title: '500',
          icon: 'error-warning-line',
        },
      },
      {
        path: '503',
        name: 'Error503',
        component: () => import('/@/views/error/503.vue'),
        meta: {
          title: '503',
          icon: 'error-warning-line',
        },
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
        path: 'goodsTag',
        name: 'GoodsTag',
        component: () => import('/@/views/goods/GoodsTag.vue'),
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
    ? createWebHashHistory(base)
    : createWebHistory(base),
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
