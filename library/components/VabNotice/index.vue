<template>
    <el-badge type="danger" :value="badge">
        <el-popover placement="bottom" popper-class="vab-notice-popper" :width="305">
            <template #reference>
                <vab-icon icon="notification-2-line" />
            </template>
            <el-tabs v-model="activeName" @tab-click="handleClick">
                <el-tab-pane :label="translate('通知')" name="notice">
                    <div class="notice-list">
                        <el-scrollbar>
                            <ul v-if="badge">
                                <li v-for="(item, index) in notices" :key="index">
                                    <div v-if="item.icon" class="notice-list-left">
                                        <vab-icon :icon="item.icon" />
                                    </div>
                                    <el-avatar v-else :size="45" :src="item.image" />
                                    <div class="notice-list-right">
                                        <div v-html="item.notice"></div>
                                        <div class="notice-time" v-html="item.datetime"></div>
                                    </div>
                                </li>
                            </ul>
                            <el-empty v-else description="暂无数据" />
                        </el-scrollbar>
                    </div>
                </el-tab-pane>
                <el-tab-pane :label="translate('待办')" name="done">
                    <div class="notice-list">
                        <el-scrollbar>
                            <ul v-if="badge">
                                <li v-for="(item, index) in notices" :key="index">
                                    <div v-if="item.icon" class="notice-list-left">
                                        <vab-icon :icon="item.icon" />
                                    </div>
                                    <el-avatar v-else :size="45" :src="item.image" />
                                    <div class="notice-list-right">
                                        <div v-html="item.notice"></div>
                                        <div class="notice-time" v-html="item.datetime"></div>
                                    </div>
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
                    <span>{{ translate('清空消息') }}</span>
                </el-button>
            </div>
        </el-popover>
    </el-badge>
</template>

<script lang="ts" setup>
import { getList } from '/@/api/notice'
import { translate } from '/@/i18n'
import { useSettingsStore } from '/@/store/modules/settings'

defineOptions({
    name: 'VabNotice',
})

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

onBeforeMount(() => {
    if (theme.value.showNotice) fetchData()
})
</script>

<style lang="scss" scoped>
:deep() {
    .el-tabs__active-bar {
        min-width: 28px;
    }
}

.notice-list {
    height: 275px;

    ul {
        padding: 0;
        margin: 0;

        li {
            display: flex;
            align-items: center;
            padding: 10px;

            > .notice-list-left {
                i {
                    display: inline-block;
                    width: 45px;
                    height: 45px;
                    font-size: 20px;
                    line-height: 45px;
                    color: var(--el-color-primary);
                    background: var(--el-color-primary-light-9);
                    border-radius: var(--el-border-radius-base);
                }
            }

            > .notice-list-right {
                margin-left: calc(var(--el-margin) / 2);

                .notice-time {
                    font-size: var(--el-font-size-small);
                    color: var(--el-color-info);
                }
            }

            &:hover {
                background-color: var(--el-color-primary-light-9);
                border-radius: var(--el-border-radius-base);
            }

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
    font-size: var(--el-font-size-base);
    text-align: center;
    cursor: pointer;
    border-top: 1px solid var(--el-border-color);
}
</style>
