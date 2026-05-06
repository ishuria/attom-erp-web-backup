<template>
  <el-dialog v-model="visible" align-center title="提示词负责人管理" top="6vh" width="780px">
    <el-form class="owner-search" inline>
      <el-form-item label="提示词功能" style="width: 50%">
        <el-input v-model.trim="searchName" clearable placeholder="按功能名搜索" @input="fetchList" @keyup.enter="fetchList" />
      </el-form-item>
      <el-form-item>
        <el-button :icon="Search" :loading="listLoading" type="primary" @click="fetchList">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table v-loading="listLoading" border :data="list" :header-cell-style="{ textAlign: 'center' }" max-height="60vh">
      <el-table-column align="left" label="提示词功能" min-width="220" prop="functionName" show-overflow-tooltip />
      <el-table-column align="center" label="负责人" min-width="220">
        <template #default="{ row }">
          <el-select
            v-model="row.ownerUserId"
            clearable
            :disabled="!!row._saving"
            filterable
            placeholder="留空表示无负责人"
            style="width: 100%"
            @change="(value) => handleOwnerChange(row, value)"
          >
            <el-option v-for="item in userList" :key="item.userId" :label="item.userName" :value="item.userId" />
          </el-select>
        </template>
      </el-table-column>
      <template #empty>
        <el-empty class="vab-data-empty" description="暂无数据" />
      </template>
    </el-table>
    <template #footer></template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { Search } from '@element-plus/icons-vue'
import { debounce } from 'lodash-es'
import { getFlowComponentOwnerList, updatePromptConfigOwner } from '/@/api/devlocal/aiPrompt'

interface UserOption {
  userId: number
  userName: string
}

interface Props {
  modelValue: boolean
  userList: UserOption[]
}

const props = defineProps<Props>()
const visible = defineModel<boolean>({ default: false })

const list = ref<any[]>([])
const listLoading = ref<boolean>(false)
const searchName = ref<string>('')

const fetchList = async () => {
  try {
    listLoading.value = true
    const { data } = await getFlowComponentOwnerList({ functionName: searchName.value })
    // _prevOwnerUserId 缓存上一次成功值，下拉变更失败时回滚 v-model
    list.value = (data || []).map((item: any) => ({
      ...item,
      _prevOwnerUserId: item.ownerUserId ?? null,
      _saving: false,
    }))
  } catch (error) {
    console.error('获取提示词功能列表失败:', error)
  } finally {
    listLoading.value = false
  }
}

const debouncedFetchList = debounce(fetchList, 500)

// 下拉选中即提交：成功更新本地行 + 通知父组件刷新主列表，失败回滚到原值
const handleOwnerChange = async (row: any, newValue: number | null) => {
  if (!row?.id) return
  const oldValue = row._prevOwnerUserId ?? null
  row._saving = true
  try {
    await updatePromptConfigOwner({
      flowComponentId: row.id,
      ownerUserId: newValue ?? null,
    })
    const matched = props.userList.find((u) => u.userId === newValue)
    row.ownerUserName = matched?.userName ?? ''
    row._prevOwnerUserId = newValue ?? null
    $baseMessage('修改成功', 'success')
  } catch (error) {
    row.ownerUserId = oldValue
    console.error('修改负责人失败:', error)
  } finally {
    row._saving = false
  }
}

// 弹窗打开时拉数据并清空搜索条件
watch(
  () => props.modelValue,
  (open) => {
    if (open) {
      searchName.value = ''
      fetchList()
    }
  }
)
</script>

<style lang="scss" scoped>
.owner-search {
  width: 100%;
}
</style>
