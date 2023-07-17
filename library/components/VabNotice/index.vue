<script lang="ts" setup>
  import { useSettingsStore } from '/@/store/modules/settings'
  import { translateTitle } from '/@/utils/i18n'
  import { getList } from '/@/api/notice'

  defineOptions({
    name: 'VabNotice',
  })

  const $baseMessage = inject<any>('$baseMessage')
  const settingsStore = useSettingsStore()
  const { theme } = storeToRefs(settingsStore)
  const activeName = ref<string>('notice')
  const notices = ref<Array<any>>([])
  const badge = ref<any>(undefined)

  const fetchData = async () => {
    const { data } = await getList()
    notices.value = data.list
    badge.value = data.total === 0 ? undefined : data.total
  }

  const handleClick = () => {
    fetchData()
  }

  const handleClearNotice = () => {
    badge.value = ''
    notices.value = []
    $baseMessage('清空消息成功', 'success', 'hey')
  }

  onMounted(() => {
    if (theme.value.showNotice) fetchData()
  })
</script>

<template>
  <el-badge v-if="theme.showNotice" type="danger" :value="badge">
    <el-popover placement="bottom" trigger="hover" :width="305">
      <template #reference>
        <vab-icon icon="notification-2-line" />
      </template>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane :label="translateTitle('通知')" name="notice">
          <div class="notice-list">
            <el-scrollbar>
              <ul v-if="badge">
                <li v-for="(item, index) in notices" :key="index">
                  <el-avatar :size="45" :src="item.image" />
                  <span v-html="item.notice" />
                </li>
              </ul>
              <el-empty v-else description="暂无数据" />
            </el-scrollbar>
          </div>
        </el-tab-pane>
        <el-tab-pane :label="translateTitle('邮件')" name="email">
          <div class="notice-list">
            <el-scrollbar>
              <ul v-if="badge">
                <li v-for="(item, index) in notices" :key="index">
                  <el-avatar :size="45" :src="item.image" />
                  <span>{{ item.email }}</span>
                </li>
              </ul>
              <el-empty v-else description="暂无数据" />
            </el-scrollbar>
          </div>
        </el-tab-pane>
      </el-tabs>
      <div class="notice-clear" @click="handleClearNotice">
        <el-button text>
          <vab-icon icon="close-circle-line" />
          <span>{{ translateTitle('清空消息') }}</span>
        </el-button>
      </div>
    </el-popover>
  </el-badge>
</template>

<style lang="scss" scoped>
  :deep() {
    .el-tabs__active-bar {
      min-width: 28px;
    }
  }

  .notice-list {
    height: 24vh;

    ul {
      padding: 0 15px 0 0;
      margin: 0;

      li {
        display: flex;
        align-items: center;
        padding: 10px 0 10px 0;

        :deep() {
          .el-avatar {
            flex-shrink: 0;
            width: 50px;
            height: 50px;
            border-radius: 50%;
          }
        }

        span {
          margin-left: 10px;
        }
      }
    }
  }

  .notice-clear {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 10px 0 0 0;
    font-size: var(--el-font-size-default);
    text-align: center;
    cursor: pointer;
    border-top: 1px solid var(--el-border-color);
  }
</style>
