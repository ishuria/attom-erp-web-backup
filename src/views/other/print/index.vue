<template>
  <div class="print-container">
    <el-button type="primary" @click="print('imageRef')">
      <vab-icon icon="printer-line" />
      打印图片
    </el-button>
    <el-button type="primary" @click="print('tableRef')">
      <vab-icon icon="printer-line" />
      打印表格
    </el-button>
    <el-button type="primary" @click="remotePrint">
      <vab-icon icon="printer-line" />
      自定义打印
    </el-button>
    <img
      ref="imageRef"
      :src="
        'https://fastly.jsdelivr.net/gh/' +
        'chuzh' +
        'ixin/image' +
        '/table/vab-im' +
        'age-1.jpg'
      "
      style="display: block; width: 520px; margin-top: 15px"
    />
    <br />
    <el-table ref="tableRef" :data="tableData" style="width: 520px">
      <el-table-column label="姓名" prop="name" width="120px" />
      <el-table-column label="地址" prop="address" />
    </el-table>
  </div>
</template>

<script lang="ts" setup>
  import { ElMessageBox } from 'element-plus'
  import VabPrint from '/@/plugins/VabPrint'

  defineOptions({
    name: 'Print',
  })

  const imageRef = ref(null)
  const tableRef = ref(null)
  const tableData = ref([
    {
      name: '马云',
      address: '上海市普陀区金沙江路',
    },
    {
      name: '马化腾',
      address: '上海市普陀区金沙江路',
    },
    {
      name: '李彦宏',
      address: '上海市普陀区金沙江路',
    },
    {
      name: '刘强东',
      address: '上海市普陀区金沙江路',
    },
  ])

  const print = async (value: any) => {
    switch (value) {
      case 'imageRef':
        await VabPrint(imageRef.value)
        break
      case 'tableRef':
        await VabPrint(tableRef.value)
        break
    }
  }
  const remotePrint = () => {
    ElMessageBox.prompt('', '自定义打印', {
      inputType: 'textarea',
      inputValue: `<h1>Vue Shop Vite</h1><p>vue-admin-beautiful.com/shop-vite</p>`,
      inputErrorMessage: 'Invalid Email',
      confirmButtonText: '打印',
    })
      .then(({ value }) => {
        VabPrint(value)
      })
      .catch(() => {})
  }
</script>
