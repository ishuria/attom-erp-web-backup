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
    path: '/vab',
    name: 'Vab',
    component: 'Layout',
    meta: {
      title: '组件',
      icon: 'code-box-line',
    },
    children: [
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
    path: '/shop',
    name: 'Shop',
    component: 'Layout',
    meta: {
      title: '店铺',
      icon: 'shopping-bag-3-line',
    },
    children: [
      {
        path: 'shop',
        name: 'Shop',
        component: 'views/index/index.vue',
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
        path: 'detail',
        name: 'Detail',
        component: 'views/goods/Detail.vue',
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
        component: 'views/goods/GoodsTag.vue',
        meta: {
          title: '商品分组',
          icon: 'home-2-line',
        },
      },
      {
        path: 'goodsTemplate',
        name: 'GoodsTemplate',
        component: 'views/goods/GoodsTemplate.vue',
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
    path: '/:pathMatch(.*)*',
    redirect: '/404',
    name: 'NotFound',
    meta: {
      hidden: true,
    },
  },
]
module.exports = [
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
