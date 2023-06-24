import { MockMethod } from 'vite-plugin-mock'

const list = [
  {
    path: '/',
    name: 'Root',
    component: 'Layout',
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
        component: 'views/index/index.vue',
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
    component: 'Layout',
    meta: {
      title: 'GPT',
      icon: 'chat-1-line',
    },
    children: [
      {
        path: 'chatGPT',
        name: 'ChatGPT',
        component: 'views/chatGPT/ChatGPT.vue',
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
    component: 'Layout',
    meta: {
      title: '模板',
      icon: 'clipboard-line',
    },
    children: [
      {
        path: 'qRLogin',
        name: 'QRLogin',
        component: '/@/views/template/QRLogin.vue',
        meta: {
          title: '二维码登录',
          icon: 'qr-scan-2-line',
        },
      },
      {
        path: 'award',
        name: 'Award',
        component: '/@/views/template/Award.vue',
        meta: {
          title: '抽奖',
          icon: 'award-line',
        },
      },
      {
        path: 'lllustration',
        name: 'Lllustration',
        component: '/@/views/template/Lllustration.vue',
        meta: {
          title: '插画',
          icon: 'brush-3-line',
        },
      },
      {
        path: '403',
        name: 'Error403',
        component: '/@/views/403.vue',
        meta: {
          title: '403',
          icon: 'error-warning-line',
        },
      },
      {
        path: '404',
        name: 'Error404',
        component: '/@/views/404.vue',
        meta: {
          title: '404',
          icon: 'error-warning-line',
        },
      },
      {
        path: '500',
        name: 'Error500',
        component: '/@/views/500.vue',
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
    component: 'Layout',
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
            component: 'views/vab/icon/remixIcon.vue',
            meta: {
              title: '小清新图标',
            },
          },
          {
            path: 'iconSelector',
            name: 'IconSelector',
            component: 'views/vab/icon/iconSelector.vue',
            meta: {
              title: '图标选择器',
            },
          },
          {
            path: 'customSvg',
            name: 'CustomSvg',
            component: 'views/vab/icon/customSvg.vue',
            meta: {
              title: '自定义图标',
            },
          },
        ],
      },
      {
        path: 'permission',
        name: 'Permission',
        component: 'views/vab/permission/index.vue',
        meta: {
          title: '角色权限',
          icon: 'user-3-line',
        },
      },
      {
        path: 'list',
        name: 'List',
        component: 'views/vab/list/index.vue',
        meta: {
          title: '列表',
          guard: ['Admin'],
          icon: 'list-check-2',
        },
      },
      {
        path: 'description',
        name: 'Description',
        component: 'views/vab/description/index.vue',
        meta: {
          title: '描述',
          guard: ['Admin'],
          icon: 'slideshow-line',
        },
      },
      {
        path: 'wangEditor',
        name: 'WangEditor',
        component: 'views/vab/editor/wangEditor.vue',
        meta: {
          title: '富文本',
          guard: ['Admin'],
          dot: true,
        },
      },
      {
        path: 'notice',
        name: 'Notice',
        component: 'views/vab/notice/index.vue',
        meta: {
          title: '通知',
          guard: ['Admin'],
          icon: 'message-2-line',
        },
      },
      {
        path: 'timeline',
        name: 'Timeline',
        component: 'views/vab/timeline/index.vue',
        meta: {
          title: '时间线',
          guard: ['Admin'],
          icon: 'time-line',
        },
      },
      {
        path: 'watermark',
        name: 'Watermark',
        component: 'views/vab/watermark/index.vue',
        meta: {
          title: '水印',
          guard: ['Admin'],
          icon: 'water-flash-line',
          dot: true,
        },
      },
      {
        path: 'echarts',
        name: 'Echarts',
        component: 'views/vab/echarts/index.vue',
        meta: {
          title: '图表',
          guard: ['Admin'],
          icon: 'bubble-chart-line',
        },
      },
      {
        path: 'dynamicMeta',
        name: 'DynamicMeta',
        component: 'views/vab/dynamicMeta/index.vue',
        meta: {
          title: '动态Meta',
          guard: ['Admin'],
          icon: 'notification-badge-line',
          badge: '0',
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
                    component:
                      'views/vab/nested/menu1/menu1-1/menu1-1-1/menu1-1-1-1/index.vue',
                  },
                ],
              },
            ],
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
            component: () => 'views/vab/table/comprehensiveTable.vue',
            meta: {
              title: '综合表格',
            },
          },
          {
            path: 'comprehensiveTableDetail',
            name: 'ComprehensiveTableDetail',
            component: () => 'views/vab/table/comprehensiveTableDetail.vue',
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
            component: 'views/vab/form/comprehensiveForm.vue',
            meta: {
              title: '综合表单',
            },
          },
          {
            path: 'stepForm',
            name: 'StepForm',
            component: 'views/vab/form/stepForm.vue',
            meta: {
              title: '分步表单',
            },
          },
          {
            path: 'button',
            name: 'Button',
            component: 'views/vab/form/button.vue',
            meta: {
              title: '按钮',
            },
          },
          {
            path: 'link',
            name: 'Link',
            component: 'views/vab/form/link.vue',
            meta: {
              title: '文字链接',
            },
          },
          {
            path: 'radio',
            name: 'Radio',
            component: 'views/vab/form/radio.vue',
            meta: {
              title: '单选框',
            },
          },
          {
            path: 'checkbox',
            name: 'Checkbox',
            component: 'views/vab/form/checkbox.vue',
            meta: {
              title: '多选框',
            },
          },
          {
            path: 'input',
            name: 'Input',
            component: 'views/vab/form/input.vue',
            meta: {
              title: '输入框',
            },
          },
          {
            path: 'inputNumber',
            name: 'InputNumber',
            component: 'views/vab/form/inputNumber.vue',
            meta: {
              title: '计数器',
            },
          },
          {
            path: 'select',
            name: 'Select',
            component: 'views/vab/form/select.vue',
            meta: {
              title: '选择器',
              dot: true,
            },
          },
          {
            path: 'switch',
            name: 'Switch',
            component: 'views/vab/form/switch.vue',
            meta: {
              title: '开关',
            },
          },
          {
            path: 'slider',
            name: 'Slider',
            component: 'views/vab/form/slider.vue',
            meta: {
              title: '滑块',
            },
          },
          {
            path: 'timePicker',
            name: 'TimePicker',
            component: 'views/vab/form/timePicker.vue',
            meta: {
              title: '时间选择器',
            },
          },
          {
            path: 'datePicker',
            name: 'DatePicker',
            component: 'views/vab/form/datePicker.vue',
            meta: {
              title: '日期选择器',
            },
          },
          {
            path: 'dateTimePicker',
            name: 'DateTimePicker',
            component: 'views/vab/form/dateTimePicker.vue',
            meta: {
              title: '日期时间选择器',
            },
          },
          {
            path: 'rate',
            name: 'Rate',
            component: 'views/vab/form/rate.vue',
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
    component: 'Layout',
    meta: {
      title: '配置',
      icon: 'user-settings-line',
      guard: ['Admin'],
    },
    children: [
      {
        path: 'personalCenter',
        name: 'PersonalCenter',
        component: 'views/setting/personalCenter/index.vue',
        meta: {
          title: '个人中心',
          icon: 'map-pin-user-line',
        },
      },
      {
        path: 'userManagement',
        name: 'UserManagement',
        component: 'views/setting/userManagement/index.vue',
        meta: {
          title: '用户管理',
          icon: 'user-3-line',
        },
      },
      {
        path: 'roleManagement',
        name: 'RoleManagement',
        component: 'views/setting/roleManagement/index.vue',
        meta: {
          title: '角色管理',
          icon: 'admin-line',
        },
      },
      {
        path: 'departmentManagement',
        name: 'DepartmentManagement',
        component: 'views/setting/departmentManagement/index.vue',
        meta: {
          title: '部门管理',
          icon: 'group-line',
        },
      },
      {
        path: 'menuManagement',
        name: 'MenuManagement',
        component: 'views/setting/menuManagement/index.vue',
        meta: {
          title: '菜单管理',
          icon: 'menu-2-fill',
        },
      },
      {
        path: 'dictionaryManagement',
        name: 'DictionaryManagement',
        component: 'views/setting/dictionaryManagement/index.vue',
        meta: {
          title: '字典管理',
          icon: 'book-2-line',
          dot: true,
        },
      },
      {
        path: 'taskManagement',
        name: 'TaskManagement',
        component: 'views/setting/taskManagement/index.vue',
        meta: {
          title: '任务管理',
          icon: 'task-line',
          badge: 'New',
        },
      },
      {
        path: 'systemLog',
        name: 'SystemLog',
        component: 'views/setting/systemLog/index.vue',
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
    component: 'Layout',
    meta: {
      title: '数据',
      icon: 'line-chart-line',
    },
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: 'views/statcenter/Dashboard.vue',
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
    component: 'Layout',
    meta: {
      title: '商品',
      icon: 'shopping-bag-3-line',
    },
    children: [
      {
        path: 'goodsManagement',
        name: 'GoodsManagement',
        component: 'views/goods/GoodsManagement.vue',
        meta: {
          title: '商品管理',
          icon: 'home-2-line',
        },
      },
      {
        path: 'goodsTag',
        name: 'GoodsTag',
        component: 'views/goods/GoodsTag.vue',
        meta: {
          title: '商品分组',
          icon: 'home-2-line',
        },
      },
      {
        path: 'parameterDictionary',
        name: 'ParameterDictionary',
        component: 'views/goods/ParameterDictionary.vue',
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
    component: 'views/portal/Portal.vue',
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
export default [
  {
    url: '/router/getList',
    method: 'get',
    response: () => {
      return {
        code: 200,
        msg: 'success',
        data: { list },
      }
    },
  },
] as MockMethod[]
