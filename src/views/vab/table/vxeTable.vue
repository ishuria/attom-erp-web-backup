<template>
  <div class="vxe-table-container global-animation-disabled">
    <div class="hidden-sm-and-up">
      <el-alert :closable="false" title="手机端不支持低代码表格演示" type="error" />
    </div>
    <div class="hidden-xs-only">
      <vxe-grid ref="xGrid" min-height="665" v-bind="gridOptions" v-on="gridEvent" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { VxeGridInstance, VxeGridListeners, VxeGridProps } from 'vxe-table'
import XEUtils from 'xe-utils'

defineOptions({
  name: 'VxeTable',
})

interface RowVO {
  [key: string]: any
}
// 真实接口已注释请自行对接
//const serveApiUrl = 'https://api.vxetable.cn/demo'
const xGrid = ref<VxeGridInstance<RowVO>>()

// 模拟分页接口
const findPageList = (currentPage: number, pageSize: number) => {
  return new Promise<{
    page: {
      total: number
    }
    result: RowVO[]
  }>((resolve) => {
    setTimeout(() => {
      const list = [
        { id: 10001, name: 'Test1', nickname: 'T1', role: 'Develop', sex: 'Man', age: 28, address: '深圳' },
        { id: 10002, name: 'Test2', nickname: 'T2', role: 'Test', sex: 'Women', age: 22, address: '广州' },
        { id: 10003, name: 'Test3', nickname: 'T3', role: 'PM', sex: 'Man', age: 32, address: '上海' },
        { id: 10004, name: 'Test4', nickname: 'T4', role: 'Designer', sex: 'Women', age: 23, address: '深圳' },
        { id: 10005, name: 'Test5', nickname: 'T5', role: 'Develop', sex: 'Women', age: 30, address: '上海' },
        { id: 10006, name: 'Test6', nickname: 'T6', role: 'Designer', sex: 'Women', age: 21, address: '深圳' },
        { id: 10007, name: 'Test7', nickname: 'T7', role: 'Test', sex: 'Man', age: 29, address: '深圳' },
        { id: 10008, name: 'Test8', nickname: 'T8', role: 'Develop', sex: 'Man', age: 35, address: '深圳' },
        { id: 10009, name: 'Test9', nickname: 'T9', role: 'Develop', sex: 'Man', age: 35, address: '深圳' },
        { id: 100010, name: 'Test10', nickname: 'T10', role: 'Develop', sex: 'Man', age: 35, address: '深圳' },
        { id: 100011, name: 'Test11', nickname: 'T11', role: 'Test', sex: 'Women', age: 26, address: '深圳' },
        { id: 100012, name: 'Test12', nickname: 'T12', role: 'Develop', sex: 'Man', age: 34, address: '上海' },
        { id: 100013, name: 'Test13', nickname: 'T13', role: 'Test', sex: 'Women', age: 22, address: '上海' },
      ]
      resolve({
        page: {
          total: list.length,
        },
        result: list.slice((currentPage - 1) * pageSize, currentPage * pageSize),
      })
    }, 100)
  })
}

const gridOptions = reactive<VxeGridProps<RowVO>>({
  border: true,
  showHeaderOverflow: true,
  showOverflow: true,
  keepSource: true,
  id: 'full_edit_1',
  height: 600,
  rowConfig: {
    keyField: 'id',
    isHover: true,
  },
  columnConfig: {
    resizable: true,
  },
  customConfig: {
    storage: true,
    checkMethod({ column }) {
      if (['nickname', 'role'].includes(column.field)) {
        return false
      }
      return true
    },
  },
  printConfig: {
    columns: [{ field: 'name' }, { field: 'nickname' }, { field: 'age' }],
  },
  sortConfig: {
    trigger: 'cell',
    remote: true,
  },
  filterConfig: {
    remote: true,
  },
  pagerConfig: {
    enabled: true,
    pageSize: 10,
    pageSizes: [5, 10, 15, 20, 50, 100, 200, 500, 1000],
  },
  formConfig: {
    titleWidth: 100,
    titleAlign: 'right',
    items: [
      {
        field: 'name',
        title: '名称',
        span: 8,
        titlePrefix: { message: '请输入用户名', icon: 'vxe-icon-question-circle-fill' },
        itemRender: { name: '$input', props: { placeholder: '请输入名称' } },
      },
      { field: 'nickname', title: '昵称', span: 8, itemRender: { name: '$input', props: { placeholder: '请输入昵称' } } },
      { field: 'role', title: '角色', span: 8, folding: true, itemRender: { name: '$input', props: { placeholder: '请输入角色' } } },
      {
        field: 'sex',
        title: '性别',
        span: 8,
        folding: true,
        titleSuffix: { message: '注意，必填信息！', icon: 'vxe-icon-question-circle-fill' },
        itemRender: { name: '$select', options: [] },
      },
      {
        field: 'age',
        title: '年龄',
        span: 8,
        folding: true,
        itemRender: { name: '$input', props: { type: 'number', min: 1, max: 120, placeholder: '请输入年龄' } },
      },
      {
        span: 8,
        align: 'left',
        collapseNode: true,
        itemRender: {
          name: '$buttons',
          children: [{ props: { type: 'submit', content: '搜索', status: 'primary' } }, { props: { type: 'reset', content: '重置' } }],
        },
      },
    ],
  },
  toolbarConfig: {
    buttons: [
      { code: 'insert_actived', name: '新增' },
      { code: 'delete', name: '直接删除' },
      { code: 'mark_cancel', name: '删除/取消' },
      { code: 'save', name: '保存', status: 'success' },
    ],
    refresh: true, // 显示刷新按钮
    import: true, // 显示导入按钮
    export: true, // 显示导出按钮
    print: true, // 显示打印按钮
    zoom: true, // 显示全屏按钮
    custom: true, // 显示自定义列按钮
  },
  proxyConfig: {
    seq: true, // 启用动态序号代理，每一页的序号会根据当前页数变化
    sort: true, // 启用排序代理，当点击排序时会自动触发 query 行为
    filter: true, // 启用筛选代理，当点击筛选时会自动触发 query 行为
    form: true, // 启用表单代理，当点击表单提交按钮时会自动触发 reload 行为
    props: {
      // 对应响应结果 Promise<{ result: [], page: { total: 100 } }>
      result: 'result', // 配置响应结果列表字段
      total: 'page.total', // 配置响应结果总页数字段
    },
    // 只接收Promise，具体实现自由发挥
    ajax: {
      // 当点击工具栏查询按钮或者手动提交指令 query或reload 时会被触发
      query: ({ page, sorts, filters, form }) => {
        const queryParams: any = Object.assign({}, form)
        // 处理排序条件
        const firstSort = sorts[0]
        if (firstSort) {
          queryParams.sort = firstSort.field
          queryParams.order = firstSort.order
        }
        // 处理筛选条件
        filters.forEach(({ field, values }) => {
          queryParams[field] = values.join(',')
        })

        // return fetch(`${serveApiUrl}/api/pub/page/list/${page.pageSize}/${page.currentPage}?${XEUtils.serialize(queryParams)}`).then(
        //   (response) => response.json()
        return findPageList(page.currentPage, page.pageSize)
      },
      // 当点击工具栏删除按钮或者手动提交指令 delete 时会被触发
      delete: (/* { body } */) => {
        return '' as any
        // return fetch(`${serveApiUrl}/api/pub/save`, {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(body),
        // }).then((response) => response.json())
      },
      // 当点击工具栏保存按钮或者手动提交指令 save 时会被触发
      save: (/* { body } */) => {
        // return fetch(`${serveApiUrl}/api/pub/save`, {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(body),
        // }).then((response) => response.json())
        return '' as any
      },
    },
  },
  columns: [
    { type: 'checkbox', title: 'ID', width: 120 },
    {
      field: 'name',
      title: '名称',
      sortable: true,
      titlePrefix: { message: '名称必须填写！' },
      editRender: { name: 'input', attrs: { placeholder: '请输入名称' } },
    },
    {
      field: 'role',
      title: '角色',
      sortable: true,
      titlePrefix: { useHTML: true, content: '点击链接：<a class="link" href="https://vxetable.cn" target="_blank">vxe-table官网</a>' },
      filters: [
        { label: '前端开发', value: '前端' },
        { label: '后端开发', value: '后端' },
        { label: '测试', value: '测试' },
        { label: '程序员鼓励师', value: '程序员鼓励师' },
      ],
      filterMultiple: false,
      editRender: { name: 'input', attrs: { placeholder: '请输入角色' } },
    },
    { field: 'nickname', title: '昵称', editRender: { name: 'input', attrs: { placeholder: '请输入昵称' } } },
    {
      field: 'sex',
      title: '性别',
      filters: [
        { label: '男', value: '1' },
        { label: '女', value: '0' },
      ],
      editRender: { name: '$select', options: [], props: { placeholder: '请选择性别' } },
    },
    {
      field: 'age',
      title: '年龄',
      visible: false,
      sortable: true,
      editRender: { name: '$input', props: { type: 'number', min: 1, max: 120 } },
    },
    {
      field: 'updateDate',
      title: '更新时间',
      width: 160,
      visible: false,
      sortable: true,
      formatter({ cellValue }) {
        return XEUtils.toDateString(cellValue, 'yyyy-MM-dd HH:ss:mm')
      },
    },
    {
      field: 'createDate',
      title: '创建时间',
      width: 160,
      visible: false,
      sortable: true,
      formatter({ cellValue }) {
        return XEUtils.toDateString(cellValue, 'yyyy-MM-dd')
      },
    },
  ],
  importConfig: {
    remote: true,
    types: ['xlsx'],
    modes: ['insert'],
    // 自定义服务端导入
    importMethod(/* { file } */) {
      // const $grid = xGrid.value
      // const formBody = new FormData()
      // formBody.append('file', file)
      // return fetch(`${serveApiUrl}/api/pub/import`, { method: 'POST', body: formBody })
      //   .then((response) => response.json())
      //   .then((data) => {
      //     VXETable.modal.message({ content: `成功导入 ${data.result.insertRows} 条记录！`, status: 'success' })
      //     // 导入完成，刷新表格
      //     if ($grid) {
      //       $grid.commitProxy('query')
      //     }
      //   })
      //   .catch(() => {
      //     VXETable.modal.message({ content: '导入失败，请检查数据是否正确！', status: 'error' })
      //   })
      return '' as any
    },
  },
  exportConfig: {
    remote: true,
    types: ['xlsx'],
    modes: ['current', 'selected', 'all'],
    // 自定义服务端导出
    exportMethod(/* { options } */) {
      const $grid = xGrid.value
      if ($grid) {
        //const proxyInfo = $grid.getProxyInfo()
        // 传给服务端的参数
        // const body = {
        //   filename: options.filename,
        //   sheetName: options.sheetName,
        //   isHeader: options.isHeader,
        //   original: options.original,
        //   mode: options.mode,
        //   pager: proxyInfo ? proxyInfo.pager : null,
        //   ids: options.mode === 'selected' ? options.data.map((item) => item.id) : [],
        //   fields: options.columns.map((column) => {
        //     return {
        //       field: column.field,
        //       title: column.title,
        //     }
        //   }),
        // }
        // 开始服务端导出
        // return fetch(`${serveApiUrl}/api/pub/export`, {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(body),
        // })
        //   .then((response) => response.json())
        //   .then((data) => {
        //     if (data.id) {
        //       VXETable.modal.message({ content: '导出成功，开始下载', status: 'success' })
        //       // 读取路径，请求文件
        //       fetch(`${serveApiUrl}/api/pub/export/download/${data.id}`).then((response) => {
        //         response.blob().then((blob) => {
        //           // 开始下载
        //           VXETable.saveFile({ filename: '导出数据', type: 'xlsx', content: blob })
        //         })
        //       })
        //     }
        //   })
        //   .catch(() => {
        //     VXETable.modal.message({ content: '导出失败！', status: 'error' })
        //   })
      }
      return Promise.resolve()
    },
  },
  checkboxConfig: {
    labelField: 'id',
    reserve: true,
    highlight: true,
    range: true,
  },
  editRules: {
    name: [
      { required: true, message: 'app.body.valid.rName' },
      { min: 3, max: 50, message: '名称长度在 3 到 50 个字符' },
    ],
    role: [{ required: true, message: '角色必须填写' }],
  },
  editConfig: {
    trigger: 'click',
    mode: 'row',
    showStatus: true,
  },
})

const gridEvent: VxeGridListeners<RowVO> = {
  proxyQuery() {
    console.log('数据代理查询事件')
  },
  proxyDelete() {
    console.log('数据代理删除事件')
  },
  proxySave() {
    console.log('数据代理保存事件')
  },
}

onMounted(() => {
  const sexList = [
    { label: '女', value: '0' },
    { label: '男', value: '1' },
  ]
  const { formConfig, columns } = gridOptions
  if (columns) {
    const sexColumn = columns[5]
    if (sexColumn && sexColumn.editRender) {
      sexColumn.editRender.options = sexList
    }
  }
  if (formConfig && formConfig.items) {
    const sexItem = formConfig.items[4]
    if (sexItem && sexItem.itemRender) {
      sexItem.itemRender.options = sexList
    }
  }
})
</script>

<style lang="scss">
.vxe-grid.is--maximize,
.vxe-modal--wrapper {
  z-index: var(--el-z-index) !important;
}
</style>
