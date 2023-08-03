<template>
  <div class="list-container table-auto-height">
    <vab-query-form>
      <vab-query-form-top-panel :span="24">
        <el-form inline :model="queryForm" @submit.prevent>
          <el-form-item>
            <el-input
              v-model.trim="queryForm.title"
              clearable
              placeholder="请输入标题"
            />
          </el-form-item>
          <el-form-item>
            <el-button
              :icon="Search"
              :loading="listLoading"
              type="primary"
              @click="queryData"
            >
              查询
            </el-button>
          </el-form-item>
        </el-form>
      </vab-query-form-top-panel>
    </vab-query-form>
    <el-empty
      v-if="emptyShow"
      class="vab-data-empty el-table"
      description="暂无数据"
    />
    <ul v-loading="listLoading" class="vab-auto-box">
      <li v-for="(item, index) in list" :key="index" class="list-item">
        <div class="list-item-meta">
          <div class="list-item-meta-avatar">
            <el-image :src="item.image" />
          </div>
          <div class="list-item-meta-content hidden-xs-only">
            <div class="list-item-meta-title">
              {{ item.title }}
            </div>
            <div class="list-item-meta-description hidden-xs-only">
              {{ item.description }}
            </div>
          </div>
          <div class="list-item-meta-content">
            <el-progress :percentage="item.percentage" />
          </div>
          <div class="list-item-meta-content">
            <div class="list-item-meta-item">
              <span>时间</span>
              <p>{{ item.datetime }}</p>
            </div>
          </div>
        </div>
      </li>
    </ul>
    <el-pagination
      background
      :current-page="queryForm.pageNo"
      :layout="layout"
      :page-size="queryForm.pageSize"
      :total="total"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
    />
  </div>
</template>

<script lang="ts" setup>
  import { Search } from '@element-plus/icons-vue'
  import { getList } from '/@/api/table'

  defineOptions({
    name: 'List',
  })

  const list = ref<any>([])
  const total = ref<any>(0)
  const queryForm = reactive<any>({
    pageNo: 1,
    pageSize: 20,
    title: '',
  })
  const layout = ref<string>('total, sizes, prev, pager, next, jumper')
  const listLoading = ref<boolean>(true)
  const emptyShow = ref<boolean>(true)

  const fetchData = async () => {
    listLoading.value = true
    const { data } = await getList(queryForm)
    list.value = data.list
    total.value = data.total
    listLoading.value = false
    if (data.total > 0) emptyShow.value = false
    else emptyShow.value = true
  }

  const handleSizeChange = (value: number) => {
    queryForm.pageNo = 1
    queryForm.pageSize = value
    fetchData()
  }

  const handleCurrentChange = (value: number) => {
    queryForm.pageNo = value
    fetchData()
  }

  const queryData = () => {
    queryForm.pageNo = 1
    fetchData()
  }

  onMounted(() => {
    fetchData()
  })
</script>

<style lang="scss" scoped>
  .list-container {
    ul {
      padding: 0;
      margin: 0;
      list-style: none;
      outline: none;

      .list-item {
        padding: var(--el-padding);
        border-bottom: 1px solid var(--el-border-color);

        &-meta {
          display: flex;
          flex: 1 1;
          align-items: flex-start;

          &-avatar {
            margin-right: 16px;

            :deep() {
              .el-image {
                width: 61px;
                height: 61px;
              }
            }
          }

          &-content {
            flex: 1 0;
            width: 0;
            color: rgba(0, 0, 0, 0.85);
          }

          &-title {
            margin-top: 11px;
            margin-bottom: 4px;
            font-size: var(--el-font-size-default);
            color: var(--el-color-black);
          }

          &-description {
            font-size: var(--el-font-size-default);
            color: var(--el-color-grey);
          }

          &-item {
            display: inline-block;
            height: 61px;
            margin-left: 40px;
            font-size: var(--el-font-size-default);
            color: var(--el-color-grey);
            vertical-align: middle;

            > span {
              line-height: 30px;
            }

            > p {
              margin-top: 4px;
              margin-bottom: 0;
            }
          }

          :deep() {
            .el-progress {
              margin-top: 21px;
            }
          }
        }
      }
    }
  }
</style>
