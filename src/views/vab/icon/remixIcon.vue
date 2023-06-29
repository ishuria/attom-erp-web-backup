<template>
  <div class="remix-icon-container">
    <el-row :gutter="20">
      <el-col :span="24">
        <el-form inline label-width="80px" @submit.prevent>
          <el-form-item label="图标名称">
            <el-input v-model="queryForm.title" />
          </el-form-item>
          <el-form-item label-width="0">
            <el-button native-type="submit" type="primary" @click="queryData">
              查询
            </el-button>

            <el-form-item label="文字大小">
              <el-input-number
                v-model="queryForm.num"
                :max="40"
                :min="12"
                style="width: 120px; margin-right: 10px"
              />
              px
            </el-form-item>
            <el-form-item :label-width="0">
              <el-checkbox
                v-model="queryForm.colorful"
                label="多彩图标"
                @change="queryData"
              />
            </el-form-item>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col v-if="emptyShow" :span="24">
        <el-empty class="vab-data-empty" description="暂无数据" />
      </el-col>
      <el-col
        v-for="(item, index) in queryIcon"
        :key="index"
        :lg="2"
        :md="3"
        :sm="8"
        :xl="2"
        :xs="6"
      >
        <vab-card shadow="hover" @click="handleCopyIcon(item.icon)">
          <vab-icon
            :icon="item.icon"
            :style="{
              color: queryForm.colorful ? item.color : 'var(--el-color-grey)',
              fontSize: queryForm.num + 'px',
            }"
          />
        </vab-card>
        <div class="icon-text" @click="handleCopyText(item.icon)">
          {{ item.icon }}
        </div>
      </el-col>
      <el-col :span="24">
        <el-pagination
          background
          :current-page="queryForm.pageNo"
          :layout="layout"
          :page-size="queryForm.pageSize"
          :page-sizes="[72, 144, 216, 288]"
          :total="total"
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
        />
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts" setup>
  import _ from 'lodash'
  import { getIconList } from '/@/api/icon'
  import clip from '/@/utils/clipboard'
  defineOptions({
    name: 'RemixIcon',
  })

  const queryIcon: any = ref([])
  const total = ref(0)
  const queryForm = reactive({
    pageNo: 1,
    pageSize: 72,
    title: '',
    colorful: false,
    num: 28,
  })
  const layout = ref('total, sizes, prev, pager, next, jumper')
  const emptyShow = ref(true)

  const fetchData = async () => {
    const { data } = await getIconList(queryForm)
    queryIcon.value = data.list.map((icon: any) => {
      return { icon, color: randomHexColor() }
    })
    total.value = data.total
    if (data.total > 0) emptyShow.value = false
    else emptyShow.value = true
  }
  const handleSizeChange = (value: number) => {
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
  const handleCopyText = (item: string) => {
    clip(item)
  }
  const handleCopyIcon = (item: any) => {
    clip(`<vab-icon icon="${item}" />`)
  }
  const randomHexColor = () => {
    return _.shuffle([
      '#1890FF',
      '#36CBCB',
      '#4ECB73',
      '#FBD437',
      '#F2637B',
      '#975FE5',
    ])
  }
  onMounted(() => {
    fetchData()
  })
</script>

<style lang="scss" scoped>
  .remix-icon-container {
    :deep() {
      .el-form--inline {
        .el-form-item {
          margin-right: 10px;
        }
      }

      .el-card__body {
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        min-height: 60px;
        max-height: 60px;
        padding: #{calc($base-padding / 1.4)};
        cursor: pointer;

        i {
          font-size: 28px;
          color: var(--el-color-grey);
          text-align: center;
          pointer-events: none;
          cursor: pointer;
          transition: var(--el-transition);
        }

        &::after {
          position: absolute;
          bottom: -30px;
          width: 100%;
          padding: 4px 0;
          font-size: var(--el-font-size-small);
          color: rgb(255, 255, 255);
          text-align: center;
          content: '点击复制';
          background-color: var(--el-color-primary);
          transition: var(--el-transition);
        }

        &:hover {
          i {
            margin-top: -#{calc($base-margin / 1.2)};
          }

          &::after {
            bottom: 0;
          }
        }
      }
    }

    .icon-text {
      height: 30px;
      margin-top: -15px;
      overflow: hidden;
      font-size: var(--el-font-size-small);
      line-height: 30px;
      text-align: center;
      text-overflow: ellipsis;
      white-space: nowrap;
      cursor: pointer;
    }
  }
</style>
