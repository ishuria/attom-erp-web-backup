<script lang="ts" setup>
  import { getList } from '/@/api/area'

  defineOptions({
    name: 'Select',
  })

  const options1 = ref<any>([
    { value: '选项1', label: '黄金糕' },
    { value: '选项2', label: '双皮奶' },
    { value: '选项3', label: '蚵仔煎' },
    { value: '选项4', label: '龙须面' },
    { value: '选项5', label: '北京烤鸭' },
  ])

  const value1 = ref<string>('')
  const options2 = ref<any>([
    { value: '选项1', label: '黄金糕' },
    { value: '选项2', label: '双皮奶', disabled: true },
    { value: '选项3', label: '蚵仔煎' },
    { value: '选项4', label: '龙须面' },
    { value: '选项5', label: '北京烤鸭' },
  ])
  const value2 = ref<string>('')
  const value3 = ref<any>([])
  const area = ref<any>([])
  const treeValue = ref<string>('')
  const areaOptions = ref<any>([])
  const treeData = ref<any>([
    {
      value: '1',
      label: '一级 1',
      children: [
        {
          value: '1-1',
          label: '二级 1-1',
          children: [
            {
              value: '1-1-1',
              label: '三级 1-1-1',
            },
          ],
        },
      ],
    },
    {
      value: '2',
      label: '一级 2',
      children: [
        {
          value: '2-1',
          label: '二级 2-1',
          children: [
            {
              value: '2-1-1',
              label: '三级 2-1-1',
            },
          ],
        },
        {
          value: '2-2',
          label: '二级 2-2',
          children: [
            {
              value: '2-2-1',
              label: '三级 2-2-1',
            },
          ],
        },
      ],
    },
    {
      value: '3',
      label: '一级 3',
      children: [
        {
          value: '3-1',
          label: '二级 3-1',
          children: [
            {
              value: '3-1-1',
              label: '三级 3-1-1',
            },
          ],
        },
        {
          value: '3-2',
          label: '二级 3-2',
          children: [
            {
              value: '3-2-1',
              label: '三级 3-2-1',
            },
          ],
        },
      ],
    },
  ])

  const fetchData = async () => {
    const {
      data: { list },
    } = await getList()
    areaOptions.value = list
  }

  onMounted(() => {
    fetchData()
  })
</script>

<template>
  <div class="select-container no-background-container">
    <vab-card>
      <template #header>
        <span>行政区划</span>
        <el-tag class="card-header-tag" type="danger">New</el-tag>
      </template>
      <el-cascader
        v-model="area"
        clearable
        filterable
        :options="areaOptions"
        :props="{ label: 'name', value: 'code' }"
      />
    </vab-card>
    <vab-card>
      <template #header>
        <span>树选择</span>
        <el-tag class="card-header-tag" type="danger">New</el-tag>
      </template>
      <el-tree-select
        v-model="treeValue"
        :data="treeData"
        multiple
        show-checkbox
      />
    </vab-card>
    <vab-card>
      <template #header>
        <span>基础用法</span>
      </template>
      <el-select v-model="value1" placeholder="请选择">
        <el-option
          v-for="item in options1"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </vab-card>
    <vab-card>
      <template #header>
        <span>有禁用选项</span>
      </template>
      <el-select v-model="value2" placeholder="请选择">
        <el-option
          v-for="item in options2"
          :key="item.value"
          :disabled="item.disabled"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </vab-card>
    <vab-card>
      <template #header>
        <span>禁用状态</span>
      </template>
      <el-select v-model="value1" disabled placeholder="请选择">
        <el-option
          v-for="item in options1"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </vab-card>
    <vab-card>
      <template #header>
        <span>可清空单选</span>
      </template>
      <el-select v-model="value1" clearable placeholder="请选择">
        <el-option
          v-for="item in options1"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </vab-card>
    <vab-card>
      <template #header>
        <span>基础多选</span>
      </template>
      <el-select v-model="value3" multiple placeholder="请选择">
        <el-option
          v-for="item in options1"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </vab-card>
    <vab-card>
      <template #header>
        <span>可搜索</span>
      </template>
      <el-select v-model="value1" filterable placeholder="请选择">
        <el-option
          v-for="item in options1"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </vab-card>
  </div>
</template>
