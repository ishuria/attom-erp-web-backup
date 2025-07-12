<template>
    <div class="creative-center-container no-background-container">
        <el-row :gutter="20">
            <el-col :lg="17" :md="12" :sm="24" :xl="17" :xs="24">
                <vab-card>
                    <el-row :gutter="20">
                        <el-col v-for="stat in statistics" :key="stat.title" :lg="8" :md="24" :sm="24" :xl="8" :xs="24">
                            <div class="statistic-card">
                                <el-statistic :value="stat.value">
                                    <template #title>
                                        <vab-icon :icon="stat.icon" />
                                        {{ stat.title }}
                                    </template>
                                </el-statistic>
                                <div class="statistic-footer">
                                    <div v-for="(footer, index) in stat.footer" :key="index" class="footer-item">
                                        <span>{{ footer.label }}</span>
                                        <span :class="footer.color">
                                            {{ footer.value }}
                                            <el-icon>
                                                <component :is="footer.icon" />
                                            </el-icon>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </el-col>

                        <el-col :span="24">
                            <el-timeline>
                                <el-timeline-item v-for="item in timelineData" :key="item.id" placement="top" :timestamp="item.timestamp">
                                    <vab-card>
                                        <el-row :gutter="20">
                                            <el-col class="item-content-wrap" :lg="12" :md="24" :sm="24" :xl="12" :xs="24">
                                                <el-image :src="handelImage()" />
                                                <p>{{ item.title }}</p>
                                            </el-col>
                                            <el-col
                                                v-for="metric in item.metrics"
                                                :key="metric.label"
                                                :lg="3"
                                                :md="6"
                                                :sm="6"
                                                :xl="3"
                                                :xs="6"
                                            >
                                                <h3>{{ metric.value }}</h3>
                                                <p>{{ metric.label }}</p>
                                            </el-col>
                                        </el-row>
                                    </vab-card>
                                </el-timeline-item>
                            </el-timeline>
                        </el-col>
                    </el-row>
                </vab-card>
                <trend />
            </el-col>
            <el-col :lg="7" :md="12" :sm="24" :xl="7" :xs="24">
                <vab-card style="height: 280px">
                    <template #header>
                        <el-tag effect="dark">公告</el-tag>
                        <span class="more">更多</span>
                    </template>
                    <el-scrollbar style="height: 180px">
                        <ul>
                            <li v-for="notice in notices" :key="notice.id">
                                <span>{{ notice.date }}</span>
                                {{ notice.content }}
                            </li>
                        </ul>
                    </el-scrollbar>
                </vab-card>
                <el-carousel height="180px" :interval="6000">
                    <el-carousel-item v-for="item in 4" :key="item">
                        <el-image :src="landscape" />
                    </el-carousel-item>
                </el-carousel>
                <rank-list />
                <vab-card style="height: 280px">
                    <template #header>
                        <vab-icon icon="fire-line" />
                        创做灵感
                        <span class="more">更多</span>
                    </template>
                    <el-scrollbar style="height: 180px">
                        <ul>
                            <li v-for="inspiration in inspirations" :key="inspiration">{{ inspiration }}</li>
                        </ul>
                    </el-scrollbar>
                </vab-card>
            </el-col>
        </el-row>
    </div>
</template>

<script lang="ts" setup>
import { random } from 'lodash-es'
import landscape from '/@/assets/common_images/landscape.jpg'

defineOptions({
    name: 'CreativeCenter',
})

// 统计数据
const statistics = [
    {
        title: '粉丝数',
        value: 98500,
        icon: 'user-heart-line',
        footer: [
            {
                label: '比昨天',
                value: '24%',
                color: 'red',
                icon: 'CaretTop',
            },
        ],
    },
    {
        title: '总阅读量',
        value: 693700,
        icon: 'contacts-book-2-line',
        footer: [
            {
                label: '环比',
                value: '12%',
                color: 'green',
                icon: 'CaretBottom',
            },
        ],
    },
    {
        title: '累计收益',
        value: 72000,
        icon: 'money-cny-circle-line',
        footer: [
            {
                label: '比昨天',
                value: '16%',
                color: 'red',
                icon: 'CaretTop',
            },
            {
                label: '',
                value: '',
                color: '',
                icon: 'ArrowRight',
            },
        ],
    },
]

// 时间线数据
const timelineData = [
    {
        id: 1,
        timestamp: '2023/10/14',
        title: '绝佳的 vue3 + vite7 前端框架',
        metrics: [
            { label: '展现量', value: 6999 },
            { label: '阅读量', value: 899 },
            { label: '评论量', value: 19 },
            { label: '点赞', value: 189 },
        ],
    },
    {
        id: 2,
        timestamp: '2023/10/13',
        title: 'TypeScript 高级类型系统详解',
        metrics: [
            { label: '展现量', value: 1999 },
            { label: '阅读量', value: 499 },
            { label: '评论量', value: 9 },
            { label: '点赞', value: 29 },
        ],
    },
    {
        id: 3,
        timestamp: '2023/10/12',
        title: '微前端架构设计与实践指南',
        metrics: [
            { label: '展现量', value: 1999 },
            { label: '阅读量', value: 499 },
            { label: '评论量', value: 9 },
            { label: '点赞', value: 29 },
        ],
    },
    {
        id: 4,
        timestamp: '2023/10/11',
        title: 'React 18 新特性深度解析',
        metrics: [
            { label: '展现量', value: 1999 },
            { label: '阅读量', value: 499 },
            { label: '评论量', value: 9 },
            { label: '点赞', value: 29 },
        ],
    },
]

// 公告数据
const notices = [
    { id: 1, date: '10-15', content: '关于打击网络暴力言论的公告' },
    { id: 2, date: '10-14', content: '系统维护通知：今晚22:00-24:00进行系统升级' },
    { id: 3, date: '10-13', content: '新功能上线：支持视频内容创作' },
    { id: 4, date: '10-12', content: '关于优化用户体验的重要更新' },
    { id: 5, date: '10-11', content: '创作者激励计划正式启动' },
    { id: 6, date: '10-10', content: '关于内容审核标准的调整说明' },
    { id: 7, date: '10-09', content: '平台安全防护升级完成' },
    { id: 8, date: '10-08', content: '关于数据隐私保护的重要提醒' },
    { id: 9, date: '10-07', content: '创作者认证功能正式开放' },
    { id: 10, date: '10-06', content: '关于违规内容处理规则的更新' },
    { id: 11, date: '10-05', content: '平台算法优化公告' },
    { id: 12, date: '10-04', content: '关于用户反馈处理机制的改进' },
]

// 灵感数据
const inspirations = [
    '#程序员未来的出路在哪里？#',
    '#前端开发技术趋势分析#',
    '#Vue3生态圈最新动态#',
    '#人工智能在编程中的应用#',
    '#远程办公时代的团队协作#',
    '#开源项目的商业模式探索#',
    '#低代码平台的发展前景#',
    '#Web3.0技术架构解析#',
]

const handelImage = () => {
    return `https://gcore.jsdelivr.net/gh/zxwk1998/image/table/vab-image-${random(1, 38)}.jpg`
}
</script>

<style lang="scss" scoped>
.creative-center-container {
    .item-content-wrap {
        display: flex;
        align-items: center;
        justify-items: center;

        :deep() {
            .el-image {
                width: 80px;
                margin-right: 15px;
                border-radius: var(--el-border-radius-base);
            }
        }
    }

    .el-statistic {
        --el-statistic-content-font-size: 28px;
    }

    .statistic-card {
        height: 100%;
        padding: var(--el-padding);
        background-color: var(--el-bg-color-overlay);
        border-radius: 4px;

        :deep() {
            .el-statistic__head {
                margin-bottom: var(--el-margin);

                [class*='ri'] {
                    margin-top: -1.5px;
                    margin-right: 3px;
                }

                .ri-user-heart-line {
                    color: var(--el-color-danger);
                }

                .ri-contacts-book-2-line {
                    color: var(--el-color-primary);
                }

                .ri-money-cny-circle-line {
                    color: var(--el-color-warning);
                }
            }

            .el-statistic__head,
            .el-statistic__content {
                display: flex;
                flex-wrap: wrap;
                align-items: center;
                justify-content: center;
            }
        }

        .statistic-footer {
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            justify-content: center;
            margin-top: var(--el-margin);
            font-size: var(--el-font-size-extra-small);
            color: var(--el-text-color-regular);

            .footer-item {
                display: flex;
                align-items: center;
                justify-content: center;

                span:last-child {
                    display: inline-flex;
                    align-items: center;
                    margin-left: 4px;
                }
            }

            .green {
                color: var(--el-color-success);
            }

            .red {
                color: var(--el-color-error);
            }
        }
    }

    :deep() {
        .el-card {
            ul {
                padding: 0;
                margin: 0;
                line-height: 30px;
                list-style: none;

                span {
                    color: var(--el-color-grey);
                }
            }

            .el-card__header {
                .more {
                    position: absolute;
                    right: var(--el-margin);
                    cursor: pointer;
                }
            }
        }

        .el-carousel {
            margin-bottom: 20px;
            border-radius: var(--el-border-radius-base);

            &__item {
                .el-image {
                    width: 100%;
                    object-fit: fill;
                }
            }
        }
    }
}
</style>
