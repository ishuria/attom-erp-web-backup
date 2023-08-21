import { MockMethod } from 'vite-plugin-mock'

const list = [
  {
    path: '/',
    name: 'Root',
    component: 'Layout',
    meta: {
      title: '首页',
      icon: 'home-2-line',
    },
    children: [
      {
        path: 'index',
        name: 'Index',
        component: '/@/views/index/index.vue',
        meta: {
          title: '首页',
          icon: 'home-2-line',
          noClosable: true,
        },
      },
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: '/@/views/index/dashboard.vue',
        meta: {
          title: '看板',
          icon: 'dashboard-2-line',
        },
      },
      {
        path: 'dataScreen',
        name: 'DataScreen',
        component: '/@/views/index/dataScreen.vue',
        meta: {
          title: '数据大屏',
          icon: 'database-2-line',
          target: '_blank',
          badge: 'Hot',
        },
      },
      {
        path: 'application',
        name: 'Application',
        component: '/@/views/index/application.vue',
        meta: {
          title: '客户端',
          icon: 'apps-2-line',
          noKeepAlive: true,
          dot: true,
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
            path: 'defaultIcon',
            name: 'DefaultIcon',
            component: '/@/views/vab/icon/defaultIcon.vue',
            meta: {
              title: '默认图标',
            },
          },
          {
            path: 'iconSelector',
            name: 'IconSelector',
            component: '/@/views/vab/icon/iconSelector.vue',
            meta: {
              title: '图标选择器',
            },
          },
          {
            path: 'customSvg',
            name: 'CustomSvg',
            component: '/@/views/vab/icon/customSvg.vue',
            meta: {
              title: '自定义图标',
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
            path: 'defaultTable',
            name: 'DefaultTable',
            component: '/@/views/vab/table/defaultTable.vue',
            meta: {
              title: '默认表格',
            },
          },
          {
            path: 'columnTable',
            name: 'ColumnTable',
            component: '/@/views/vab/table/columnTable.vue',
            meta: {
              title: '左树右表',
            },
          },
          {
            path: 'tabsTable',
            name: 'TabsTable',
            component: '/@/views/vab/table/tabsTable.vue',
            meta: {
              title: '分类表格',
              dot: true,
            },
          },
          {
            path: 'inlineEditTable',
            name: 'InlineEditTable',
            component: '/@/views/vab/table/inlineEditTable.vue',
            meta: {
              title: '行内编辑表格',
            },
          },
          {
            path: 'customTable',
            name: 'CustomTable',
            component: '/@/views/vab/table/customTable.vue',
            meta: {
              title: '自定义表格',
              badge: 'Hot',
            },
          },
          {
            path: 'splitTable',
            name: 'SplitTable',
            component: '/@/views/vab/table/splitTable.vue',
            meta: {
              title: '分割表格',
            },
          },
          {
            path: 'defaultTableDetail',
            name: 'DefaultTableDetail',
            component: '/@/views/vab/table/defaultTableDetail.vue',
            meta: {
              hidden: true,
              title: '详情页',
              activeMenu: '/vab/table/defaultTable',
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
            component: '/@/views/vab/form/comprehensiveForm.vue',
            meta: {
              title: '综合表单',
            },
          },
          {
            path: 'stepForm',
            name: 'StepForm',
            component: '/@/views/vab/form/stepForm.vue',
            meta: {
              title: '分步表单',
            },
          },
          {
            path: 'button',
            name: 'Button',
            component: '/@/views/vab/form/button.vue',
            meta: {
              title: '按钮',
            },
          },
          {
            path: 'link',
            name: 'Link',
            component: '/@/views/vab/form/link.vue',
            meta: {
              title: '文字链接',
            },
          },
          {
            path: 'radio',
            name: 'Radio',
            component: '/@/views/vab/form/radio.vue',
            meta: {
              title: '单选框',
            },
          },
          {
            path: 'checkbox',
            name: 'Checkbox',
            component: '/@/views/vab/form/checkbox.vue',
            meta: {
              title: '多选框',
            },
          },
          {
            path: 'input',
            name: 'Input',
            component: '/@/views/vab/form/input.vue',
            meta: {
              title: '输入框',
            },
          },
          {
            path: 'inputNumber',
            name: 'InputNumber',
            component: '/@/views/vab/form/inputNumber.vue',
            meta: {
              title: '计数器',
            },
          },
          {
            path: 'select',
            name: 'Select',
            component: '/@/views/vab/form/select.vue',
            meta: {
              title: '选择器',
              dot: true,
            },
          },
          {
            path: 'switch',
            name: 'Switch',
            component: '/@/views/vab/form/switch.vue',
            meta: {
              title: '开关',
            },
          },
          {
            path: 'slider',
            name: 'Slider',
            component: '/@/views/vab/form/slider.vue',
            meta: {
              title: '滑块',
            },
          },
          {
            path: 'timePicker',
            name: 'TimePicker',
            component: '/@/views/vab/form/timePicker.vue',
            meta: {
              title: '时间选择器',
            },
          },
          {
            path: 'datePicker',
            name: 'DatePicker',
            component: '/@/views/vab/form/datePicker.vue',
            meta: {
              title: '日期选择器',
            },
          },
          {
            path: 'dateTimePicker',
            name: 'DateTimePicker',
            component: '/@/views/vab/form/dateTimePicker.vue',
            meta: {
              title: '日期时间选择器',
            },
          },
          {
            path: 'rate',
            name: 'Rate',
            component: '/@/views/vab/form/rate.vue',
            meta: {
              title: '评分',
            },
          },
        ],
      },
      {
        path: 'list',
        name: 'List',
        component: '/@/views/vab/list/index.vue',
        meta: {
          title: '列表',
          guard: ['Admin'],
          icon: 'list-check-2',
        },
      },
      {
        path: 'description',
        name: 'Description',
        component: '/@/views/vab/description/index.vue',
        meta: {
          title: '描述',
          guard: ['Admin'],
          icon: 'slideshow-line',
        },
      },
      {
        path: 'tree',
        name: 'Tree',
        component: '/@/views/vab/tree/index.vue',
        meta: {
          title: '树',
          guard: ['Admin'],
          icon: 'node-tree',
        },
      },
      {
        path: 'upload',
        name: 'Upload',
        component: '/@/views/vab/upload/index.vue',
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
        component: '/@/views/vab/notice/index.vue',
        meta: {
          title: '通知',
          guard: ['Admin'],
          icon: 'message-2-line',
        },
      },
      {
        path: 'progress',
        name: 'Progress',
        component: '/@/views/vab/progress/index.vue',
        meta: {
          title: '进度条',
          guard: ['Admin'],
          icon: 'footprint-line',
        },
      },
      {
        path: 'timeline',
        name: 'Timeline',
        component: '/@/views/vab/timeline/index.vue',
        meta: {
          title: '时间线',
          guard: ['Admin'],
          icon: 'time-line',
        },
      },
      {
        path: 'statistic',
        name: 'Statistic',
        component: '/@/views/vab/statistic/index.vue',
        meta: {
          title: '统计',
          guard: ['Admin'],
          icon: 'bar-chart-2-line',
        },
      },
      {
        path: 'image',
        name: 'Image',
        component: '/@/views/vab/image/index.vue',
        meta: {
          title: '图片',
          guard: ['Admin'],
          icon: 'image-2-line',
        },
      },
      {
        path: 'infiniteScroll',
        name: 'InfiniteScroll',
        component: '/@/views/vab/infiniteScroll/index.vue',
        meta: {
          title: '无限滚动',
          guard: ['Admin'],
          icon: 'align-vertically',
        },
      },
      {
        path: 'drawer',
        name: 'Drawer',
        component: '/@/views/vab/drawer/index.vue',
        meta: {
          title: '抽屉',
          guard: ['Admin'],
          icon: 'archive-drawer-line',
        },
      },
    ],
  },
  {
    path: '/other',
    name: 'Other',
    component: 'Layout',
    meta: {
      title: '其他',
      icon: 'archive-line',
      guard: ['Admin'],
    },
    children: [
      {
        path: 'echarts',
        name: 'ECharts',
        component: '/@/views/other/echarts/index.vue',
        meta: {
          title: '图表',
          guard: ['Admin'],
          icon: 'bubble-chart-line',
        },
      },
      {
        path: 'gantt',
        name: 'Gantt',
        component: '/@/views/other/gantt/index.vue',
        meta: {
          title: '甘特图',
          guard: ['Admin'],
          icon: 'organization-chart',
        },
      },
      {
        path: 'editor',
        name: 'Editor',
        component: 'Layout',
        meta: {
          title: '编辑器',
          icon: 'edit-box-line',
          guard: ['Admin'],
        },
        children: [
          {
            path: 'wangEditor',
            name: 'WangEditor',
            component: '/@/views/other/editor/wangEditor.vue',
            meta: {
              title: '富文本',
              guard: ['Admin'],
            },
          },
          {
            path: 'mdEditor',
            name: 'MdEditor',
            component: '/@/views/other/editor/mdEditor.vue',
            meta: {
              title: 'Markdown',
              guard: ['Admin'],
            },
          },
        ],
      },
      {
        path: 'video',
        name: 'Video',
        component: '/@/views/other/video/index.vue',
        meta: {
          title: '视频播放器',
          guard: ['Admin'],
          icon: 'video-line',
          dot: true,
        },
      },
      {
        path: 'workflow',
        name: 'Workflow',
        component: '/@/views/other/workflow/index.vue',
        meta: {
          title: '工作流',
          guard: ['Admin'],
          icon: 'flow-chart',
        },
      },
      {
        path: 'award',
        name: 'Award',
        component: '/@/views/other/award/index.vue',
        meta: {
          title: '抽奖',
          icon: 'award-line',
          badge: 'New',
        },
      },
      {
        path: 'count',
        name: 'Count',
        component: '/@/views/other/count/index.vue',
        meta: {
          title: '数字自增长',
          guard: ['Admin'],
          icon: 'number-0',
        },
      },
      {
        path: 'signature',
        name: 'Signature',
        component: '/@/views/other/signature/index.vue',
        meta: {
          title: '签名',
          icon: 'edit-2-line',
          guard: ['Admin'],
        },
      },
      {
        path: 'watermark',
        name: 'Watermark',
        component: '/@/views/other/watermark/index.vue',
        meta: {
          title: '水印',
          guard: ['Admin'],
          icon: 'water-flash-line',
        },
      },

      {
        path: 'pdf',
        name: 'PDF',
        component: '/@/views/other/pdf/index.vue',
        meta: {
          title: 'Pdf',
          guard: ['Admin'],
          icon: 'file-pdf-line',
        },
      },
      {
        path: 'print',
        name: 'Print',
        component: '/@/views/other/print/index.vue',
        meta: {
          title: '打印',
          guard: ['Admin'],
          icon: 'printer-line',
        },
      },
      {
        path: 'share',
        name: 'Share',
        component: '/@/views/other/share/index.vue',
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
        component: '/@/views/other/passwordGenerator/index.vue',
        meta: {
          title: '密码生成器',
          guard: ['Admin'],
          icon: 'lock-password-line',
        },
      },
      {
        path: 'amount',
        name: 'Amount',
        component: '/@/views/other/amount/index.vue',
        meta: {
          title: '大写金额转换',
          guard: ['Admin'],
          icon: 'money-cny-box-line',
        },
      },
      {
        path: 'regularExpression',
        name: 'RegularExpression',
        component: '/@/views/other/regularExpression/index.vue',
        meta: {
          title: '正则表达式',
          guard: ['Admin'],
          icon: 'file-copy-2-line',
        },
      },
      {
        path: 'throttleDebounce',
        name: 'ThrottleDebounce',
        component: '/@/views/other/throttleDebounce/index.vue',
        meta: {
          title: '节流防抖',
          guard: ['Admin'],
          icon: 'water-percent-line',
        },
      },
      {
        path: '//github.com/chuzhixin/vue-admin-beautiful?utm_source=gold_browser_extension',
        name: 'ExternalLink',
        meta: {
          title: '外链',
          target: '_blank',
          guard: ['Admin', 'Editor'],
          icon: 'external-link-line',
        },
      },
      {
        path: 'paneSplit',
        name: 'PaneSplit',
        component: '/@/views/other/paneSplit/index.vue',
        meta: {
          title: '面板分割',
          guard: ['Admin'],
          icon: 'split-cells-horizontal',
        },
      },
      {
        path: 'drag',
        name: 'Drag',
        component: '/@/views/other/drag/index.vue',
        meta: {
          title: '拖拽',
          icon: 'drag-drop-line',
        },
      },
      {
        path: 'transition',
        name: 'Transition',
        component: '/@/views/other/transition/index.vue',
        meta: {
          title: '过渡动画',
          icon: 'hand-heart-line',
        },
      },
      {
        path: 'noLayout',
        name: 'NoLayout',
        component: '/@/views/other/noLayout/index.vue',
        meta: {
          title: '全屏',
          guard: ['Admin'],
          icon: 'aspect-ratio-line',
          dot: true,
        },
      },
      {
        path: 'iframe',
        name: 'Iframe',
        meta: {
          title: '内嵌网页',
          guard: ['Admin'],
          icon: 'window-line',
        },
        children: [
          {
            path: 'iframeView',
            name: 'IframeView',
            component: '/@/views/other/iframe/view.vue',
            meta: {
              title: 'Iframe',
              icon: 'window-line',
              dynamicNewTab: true,
              hidden: true,
            },
          },
          {
            path: 'iframeView?url=cn.vuejs.org&title=Vue',
            name: 'Vue',
            meta: {
              title: 'Vue',
            },
          },
          {
            path: 'iframeView?url=cn.vitejs.dev&title=Vite',
            name: 'Vite',
            meta: {
              title: 'Vite',
            },
          },
        ],
      },
    ],
  },
  {
    path: '/operate',
    name: 'Operate',
    component: 'Layout',
    meta: {
      title: '操作',
      icon: 'microscope-line',
    },
    children: [
      {
        path: 'permission',
        name: 'Permission',
        component: '/@/views/operate/permission/index.vue',
        meta: {
          title: '角色权限',
          icon: 'user-3-line',
          badge: 'Hot',
        },
      },
      {
        path: 'tabs',
        name: 'Tabs',
        component: '/@/views/operate/tabs/index.vue',
        meta: {
          title: '多标签',
          guard: ['Admin'],
          icon: 'bank-card-line',
        },
      },
      {
        path: 'dynamicMeta',
        name: 'DynamicMeta',
        component: '/@/views/operate/dynamicMeta/index.vue',
        meta: {
          title: '动态Meta',
          guard: ['Admin'],
          icon: 'notification-badge-line',
          badge: '0',
        },
      },
      {
        path: 'guide',
        name: 'Guide',
        component: '/@/views/operate/guid/index.vue',
        meta: {
          title: '页面引导',
          guard: ['Admin'],
          icon: 'guide-line',
          dot: true,
        },
      },
      {
        path: 'randomTheme',
        name: 'RandomTheme',
        component: '/@/views/operate/randomTheme/index.vue',
        meta: {
          title: '随机换肤',
          guard: ['Admin'],
          icon: 'ai-generate',
        },
      },
      {
        path: 'log',
        name: 'Log',
        component: '/@/views/operate/errorLog/index.vue',
        meta: {
          title: '错误日志',
          guard: ['Admin'],
          icon: 'error-warning-line',
        },
      },
      {
        path: 'dynamicSegment',
        name: 'DynamicSegment',
        meta: {
          title: '动态路径参数',
          guard: ['Admin'],
          icon: 'arrow-left-right-line',
        },
        children: [
          {
            path: 'test1/:id',
            name: 'Test1',
            component: '/@/views/operate/dynamicSegment/test1.vue',
            meta: {
              hidden: true,
              title: 'Params',
              dynamicNewTab: true,
            },
          },
          {
            path: 'test1/1',
            name: 'Test1/1',
            component: '/@/views/operate/dynamicSegment/test1.vue',
            meta: { title: 'Params id=1' },
          },
          {
            path: 'test2',
            name: 'Test2',
            component: '/@/views/operate/dynamicSegment/test2.vue',
            meta: {
              hidden: true,
              title: 'Query',
              dynamicNewTab: true,
            },
          },
          {
            path: 'test2?id=1',
            name: 'Test2?id=1',
            component: '/@/views/operate/dynamicSegment/test2.vue',
            meta: { title: 'Query id=1' },
          },
        ],
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
            path: 'menu11',
            name: 'Menu11',
            meta: {
              title: '路由1.1',
            },
            children: [
              {
                path: 'menu111',
                name: 'Menu111',
                meta: {
                  title: '路由1.1.1',
                },
                children: [
                  {
                    path: 'menu1111',
                    name: 'Menu1111',
                    meta: {
                      title: '路由1.1.1.1',
                    },
                    component: '/@/views/operate/nested/menu1/menu11/menu111/menu1111/index.vue',
                  },
                ],
              },
            ],
          },
        ],
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
        path: 'lllustration',
        name: 'Lllustration',
        component: '/@/views/template/Lllustration.vue',
        meta: {
          title: '插画',
          icon: 'brush-3-line',
          dot: true,
        },
      },
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
        path: 'resume',
        name: 'Resume',
        component: '/@/views/template/Resume.vue',
        meta: {
          title: '简历',
          icon: 'folder-user-line',
        },
      },
      {
        path: '403',
        name: 'Error403',
        component: '/@/views/error/403.vue',
        meta: {
          title: '403',
          icon: 'error-warning-line',
        },
      },
      {
        path: '404',
        name: 'Error404',
        component: '/@/views/error/404.vue',
        meta: {
          title: '404',
          icon: 'error-warning-line',
        },
      },
      {
        path: '500',
        name: 'Error500',
        component: '/@/views/error/500.vue',
        meta: {
          title: '500',
          icon: 'error-warning-line',
        },
      },
      {
        path: '503',
        name: 'Error503',
        component: '/@/views/error/503.vue',
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
        component: '/@/views/setting/personalCenter/index.vue',
        meta: {
          title: '个人中心',
          icon: 'map-pin-user-line',
        },
      },
      {
        path: 'userManagement',
        name: 'UserManagement',
        component: '/@/views/setting/userManagement/index.vue',
        meta: {
          title: '用户管理',
          icon: 'user-3-line',
        },
      },
      {
        path: 'roleManagement',
        name: 'RoleManagement',
        component: '/@/views/setting/roleManagement/index.vue',
        meta: {
          title: '角色管理',
          icon: 'admin-line',
        },
      },
      {
        path: 'departmentManagement',
        name: 'DepartmentManagement',
        component: '/@/views/setting/departmentManagement/index.vue',
        meta: {
          title: '部门管理',
          icon: 'group-line',
        },
      },
      {
        path: 'menuManagement',
        name: 'MenuManagement',
        component: '/@/views/setting/menuManagement/index.vue',
        meta: {
          title: '菜单管理',
          icon: 'menu-2-fill',
        },
      },
      {
        path: 'dictionaryManagement',
        name: 'DictionaryManagement',
        component: '/@/views/setting/dictionaryManagement/index.vue',
        meta: {
          title: '字典管理',
          icon: 'book-2-line',
          dot: true,
        },
      },
      {
        path: 'taskManagement',
        name: 'TaskManagement',
        component: '/@/views/setting/taskManagement/index.vue',
        meta: {
          title: '任务管理',
          icon: 'task-line',
          badge: 'New',
        },
      },
      {
        path: 'systemLog',
        name: 'SystemLog',
        component: '/@/views/setting/systemLog/index.vue',
        meta: {
          title: '系统日志',
          icon: 'file-shield-2-line',
        },
      },
      {
        path: 'websiteSetting',
        name: 'WebsiteSetting',
        component: '/@/views/setting/websiteSetting/index.vue',
        meta: {
          title: '网站设置',
          icon: 'global-line',
        },
      },
    ],
  },
  {
    path: '/noColumn',
    name: 'NoColumn',
    component: 'Layout',
    meta: {
      title: '单栏',
      icon: 'delete-column',
      guard: ['Admin'],
      levelHidden: true,
      breadcrumbHidden: true,
    },
    children: [
      {
        path: 'deleteColumn',
        name: 'DeleteColumn',
        component: '/@/views/noColumn/deleteColumn/index.vue',
        meta: {
          title: '单栏',
          icon: 'delete-column',
          noColumn: true,
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
        component: '/@/views/goods/GoodsManagement.vue',
        meta: {
          title: '商品管理',
          icon: 'shopping-basket-line',
        },
      },
      {
        path: 'goodsTag',
        name: 'GoodsTag',
        component: '/@/views/goods/GoodsTag.vue',
        meta: {
          title: '商品分组',
          icon: 'shopping-basket-2-line',
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
        component: '/@/views/chatGPT/ChatGPT.vue',
        meta: {
          title: 'ChatGPT',
          icon: 'openai-line',
          dot: true,
        },
      },
      {
        path: 'speechSynthesis',
        name: 'SpeechSynthesis',
        component: '/@/views/chatGPT/SpeechSynthesis.vue',
        meta: {
          title: '语音合成',
          icon: 'customer-service-line',
        },
      },
      {
        path: '//claude.ai/chat',
        name: 'Claude',
        meta: {
          title: 'Claude',
          target: '_blank',
          icon: 'brain-line',
        },
      },
      {
        path: '//yiyan.baidu.com',
        name: 'Yiyan',
        meta: {
          title: '文心一言',
          target: '_blank',
          icon: 'baidu-line',
        },
      },
      {
        path: '//qianwen.aliyun.com/chat',
        name: 'Qianwen',
        meta: {
          title: '通义千问',
          target: '_blank',
          icon: 'taobao-line',
        },
      },
    ],
  },
  {
    path: '/portal',
    name: 'Portal',
    component: '/@/views/portal/Portal.vue',
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
    response() {
      return {
        code: 200,
        msg: 'success',
        data: { list },
      }
    },
  },
] as MockMethod[]
