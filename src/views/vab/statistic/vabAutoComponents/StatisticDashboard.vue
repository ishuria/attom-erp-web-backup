<template>
    <div class="statistic-dashboard">
        <!-- 顶部KPI指标 -->
        <el-row class="mb-20" :gutter="20">
            <el-col :lg="6" :md="12" :sm="24" :xl="6" :xs="24">
                <div class="kpi-card primary">
                    <div class="kpi-icon">
                        <el-icon :size="32">
                            <trend-charts />
                        </el-icon>
                    </div>
                    <div class="kpi-content">
                        <div class="kpi-value">
                            <vab-count :end-value="kpiData.revenue" :start-value="0" />
                        </div>
                        <div class="kpi-label">总收入</div>
                        <div class="kpi-trend up">
                            <el-icon :size="14">
                                <arrow-up />
                            </el-icon>
                            <span>+{{ kpiData.revenueGrowth }}%</span>
                        </div>
                    </div>
                    <div class="kpi-chart">
                        <div class="mini-chart">
                            <div
                                v-for="(point, index) in kpiData.revenueChart"
                                :key="index"
                                class="chart-bar"
                                :style="{ height: point + '%' }"
                            ></div>
                        </div>
                    </div>
                </div>
            </el-col>
            <el-col :lg="6" :md="12" :sm="24" :xl="6" :xs="24">
                <div class="kpi-card success">
                    <div class="kpi-icon">
                        <el-icon :size="32">
                            <shopping-bag />
                        </el-icon>
                    </div>
                    <div class="kpi-content">
                        <div class="kpi-value">
                            <vab-count :end-value="kpiData.orders" :start-value="0" />
                        </div>
                        <div class="kpi-label">总订单</div>
                        <div class="kpi-trend up">
                            <el-icon :size="14">
                                <arrow-up />
                            </el-icon>
                            <span>+{{ kpiData.ordersGrowth }}%</span>
                        </div>
                    </div>
                    <div class="kpi-chart">
                        <div class="mini-chart">
                            <div
                                v-for="(point, index) in kpiData.ordersChart"
                                :key="index"
                                class="chart-bar"
                                :style="{ height: point + '%' }"
                            ></div>
                        </div>
                    </div>
                </div>
            </el-col>
            <el-col :lg="6" :md="12" :sm="24" :xl="6" :xs="24">
                <div class="kpi-card warning">
                    <div class="kpi-icon">
                        <el-icon :size="32">
                            <user />
                        </el-icon>
                    </div>
                    <div class="kpi-content">
                        <div class="kpi-value">
                            <vab-count :end-value="kpiData.users" :start-value="0" />
                        </div>
                        <div class="kpi-label">活跃用户</div>
                        <div class="kpi-trend down">
                            <el-icon :size="14">
                                <arrow-down />
                            </el-icon>
                            <span>-{{ kpiData.usersDecline }}%</span>
                        </div>
                    </div>
                    <div class="kpi-chart">
                        <div class="mini-chart">
                            <div
                                v-for="(point, index) in kpiData.usersChart"
                                :key="index"
                                class="chart-bar"
                                :style="{ height: point + '%' }"
                            ></div>
                        </div>
                    </div>
                </div>
            </el-col>
            <el-col :lg="6" :md="12" :sm="24" :xl="6" :xs="24">
                <div class="kpi-card danger">
                    <div class="kpi-icon">
                        <el-icon :size="32">
                            <monitor />
                        </el-icon>
                    </div>
                    <div class="kpi-content">
                        <div class="kpi-value">
                            <vab-count :end-value="kpiData.views" :start-value="0" />
                        </div>
                        <div class="kpi-label">页面访问</div>
                        <div class="kpi-trend up">
                            <el-icon :size="14">
                                <arrow-up />
                            </el-icon>
                            <span>+{{ kpiData.viewsGrowth }}%</span>
                        </div>
                    </div>
                    <div class="kpi-chart">
                        <div class="mini-chart">
                            <div
                                v-for="(point, index) in kpiData.viewsChart"
                                :key="index"
                                class="chart-bar"
                                :style="{ height: point + '%' }"
                            ></div>
                        </div>
                    </div>
                </div>
            </el-col>
        </el-row>

        <!-- 中间图表区域 -->
        <!--
        <el-row :gutter="20" class="mb-20">
            <el-col :lg="16" :md="24" :sm="24" :xl="16" :xs="24">
                <vab-card>
                    <template #header>
                        <div class="chart-header">
                            <span>销售趋势</span>
                            <div class="chart-controls">
                                <el-radio-group v-model="chartPeriod" size="small">
                                    <el-radio-button label="week">周</el-radio-button>
                                    <el-radio-button label="month">月</el-radio-button>
                                    <el-radio-button label="quarter">季</el-radio-button>
                                    <el-radio-button label="year">年</el-radio-button>
                                </el-radio-group>
                            </div>
                        </div>
                    </template>
                    <div class="chart-container">
                        <div class="chart-stats">
                            <div class="chart-stat-item">
                                <div class="stat-number">{{ formatNumber(salesTrend.total) }}</div>
                                <div class="stat-label">总销售额</div>
                            </div>
                            <div class="chart-stat-item">
                                <div class="stat-number">{{ salesTrend.avg }}</div>
                                <div class="stat-label">平均日销</div>
                            </div>
                            <div class="chart-stat-item">
                                <div class="stat-number">{{ salesTrend.peak }}</div>
                                <div class="stat-label">峰值日销</div>
                            </div>
                        </div>
                        <div class="chart-placeholder">
                            <div class="placeholder-text">图表区域 - 可集成 ECharts 或其他图表库</div>
                            <div class="placeholder-desc">这里可以展示销售趋势的折线图、柱状图等</div>
                        </div>
                    </div>
                </vab-card>
            </el-col>
            <el-col :lg="8" :md="24" :sm="24" :xl="8" :xs="24">
                <vab-card>
                    <template #header>实时监控</template>
                    <div class="monitor-panel">
                        <div class="monitor-item">
                            <div class="monitor-header">
                                <span>系统状态</span>
                                <el-tag type="success" size="small">正常</el-tag>
                            </div>
                            <div class="monitor-metrics">
                                <div class="metric-item">
                                    <span class="metric-label">CPU使用率</span>
                                    <el-progress :percentage="systemStatus.cpu" :color="getProgressColor(systemStatus.cpu)" />
                                </div>
                                <div class="metric-item">
                                    <span class="metric-label">内存使用率</span>
                                    <el-progress :percentage="systemStatus.memory" :color="getProgressColor(systemStatus.memory)" />
                                </div>
                                <div class="metric-item">
                                    <span class="metric-label">磁盘使用率</span>
                                    <el-progress :percentage="systemStatus.disk" :color="getProgressColor(systemStatus.disk)" />
                                </div>
                                <div class="metric-item">
                                    <span class="metric-label">网络延迟</span>
                                    <span class="metric-value">{{ systemStatus.network }}ms</span>
                                </div>
                            </div>
                        </div>
                        <div class="monitor-item">
                            <div class="monitor-header">
                                <span>在线用户</span>
                                <el-tag type="info" size="small">{{ onlineUsers.length }}</el-tag>
                            </div>
                            <div class="online-users">
                                <div v-for="user in onlineUsers.slice(0, 5)" :key="user.id" class="user-item">
                                    <el-avatar :size="24" :src="user.avatar" />
                                    <span class="user-name">{{ user.name }}</span>
                                    <span class="user-status" :class="user.status">{{ user.statusText }}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </vab-card>
            </el-col>
        </el-row>
        -->
    </div>
</template>

<script lang="ts" setup>
import { ArrowDown, ArrowUp, Monitor, ShoppingBag, TrendCharts, User } from '@element-plus/icons-vue'
import { ref } from 'vue'

// KPI数据
const kpiData = ref({
    revenue: 1256789,
    revenueGrowth: 15.2,
    revenueChart: [65, 78, 45, 89, 67, 82, 91],
    orders: 3456,
    ordersGrowth: 8.7,
    ordersChart: [45, 67, 34, 78, 56, 89, 67],
    users: 2847,
    usersDecline: 2.1,
    usersChart: [78, 65, 89, 67, 45, 78, 56],
    views: 12543,
    viewsGrowth: 12.5,
    viewsChart: [89, 67, 78, 45, 67, 89, 78],
})

// 图表周期
const chartPeriod = ref('month')

// 销售趋势
const salesTrend = ref({
    total: 1256789,
    avg: 45678,
    peak: 89234,
})

// 系统状态
const systemStatus = ref({
    cpu: 45,
    memory: 67,
    disk: 23,
    network: 12,
})

// 在线用户
const onlineUsers = ref([
    { id: 1, name: '张三', avatar: '', status: 'online', statusText: '在线' },
    { id: 2, name: '李四', avatar: '', status: 'away', statusText: '离开' },
    { id: 3, name: '王五', avatar: '', status: 'online', statusText: '在线' },
    { id: 4, name: '赵六', avatar: '', status: 'busy', statusText: '忙碌' },
    { id: 5, name: '钱七', avatar: '', status: 'online', statusText: '在线' },
])

// 最近交易
const recentTransactions = ref([
    {
        id: 'TX001',
        customer: '张三',
        product: 'iPhone 15 Pro',
        amount: 8999,
        status: 'completed',
        statusText: '已完成',
        date: '2024-01-15 14:30:25',
    },
    {
        id: 'TX002',
        customer: '李四',
        product: 'MacBook Air',
        amount: 12999,
        status: 'pending',
        statusText: '处理中',
        date: '2024-01-15 14:25:18',
    },
    {
        id: 'TX003',
        customer: '王五',
        product: 'AirPods Pro',
        amount: 1999,
        status: 'completed',
        statusText: '已完成',
        date: '2024-01-15 14:20:42',
    },
    {
        id: 'TX004',
        customer: '赵六',
        product: 'iPad Air',
        amount: 4999,
        status: 'cancelled',
        statusText: '已取消',
        date: '2024-01-15 14:15:33',
    },
    {
        id: 'TX005',
        customer: '钱七',
        product: 'Apple Watch',
        amount: 2999,
        status: 'completed',
        statusText: '已完成',
        date: '2024-01-15 14:10:15',
    },
])

// 格式化数字
const formatNumber = (num: number) => {
    return num.toString().replaceAll(/\B(?=(\d{3})+(?!\d))/g, ',')
}

// 获取进度条颜色
const getProgressColor = (percentage: number) => {
    if (percentage < 50) return 'var(--el-color-success)'
    if (percentage < 80) return 'var(--el-color-warning)'
    return 'var(--el-color-danger)'
}

// 获取状态类型
const getStatusType = (status: string) => {
    const statusMap: Record<string, string> = {
        completed: 'success',
        pending: 'warning',
        cancelled: 'danger',
    }
    return statusMap[status] || 'info'
}
</script>

<style lang="scss" scoped>
.statistic-dashboard {
    .mb-20 {
        margin-bottom: 20px;
    }

    // KPI卡片
    .kpi-card {
        position: relative;
        display: flex;
        align-items: center;
        padding: 24px;
        overflow: hidden;
        background: var(--el-bg-color-overlay);
        border-radius: 12px;
        box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
        transition: all 0.3s ease;

        &:hover {
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
            transform: translateY(-4px);
        }

        &.primary {
            color: white;
            background: var(--el-color-primary);

            .kpi-icon {
                background: rgba(255, 255, 255, 0.15);
                backdrop-filter: blur(10px);
            }
        }

        &.success {
            color: white;
            background: var(--el-color-success);

            .kpi-icon {
                background: rgba(255, 255, 255, 0.15);
                backdrop-filter: blur(10px);
            }
        }

        &.warning {
            color: white;
            background: var(--el-color-warning);

            .kpi-icon {
                background: rgba(255, 255, 255, 0.15);
                backdrop-filter: blur(10px);
            }
        }

        &.danger {
            color: white;
            background: var(--el-color-info);

            .kpi-icon {
                background: rgba(255, 255, 255, 0.15);
                backdrop-filter: blur(10px);
            }
        }

        .kpi-icon {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 60px;
            height: 60px;
            margin-right: 16px;
            border-radius: 12px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            transition: all 0.3s ease;

            &:hover {
                box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
                transform: scale(1.05);
            }
        }

        .kpi-content {
            flex: 1;

            .kpi-value {
                font-size: 28px;
                font-weight: 700;
                line-height: 1.2;
            }

            .kpi-label {
                margin-top: 4px;
                font-size: 14px;
                opacity: 0.9;
            }

            .kpi-trend {
                display: flex;
                align-items: center;
                margin-top: 8px;
                font-size: 12px;
                font-weight: 600;

                &.up {
                    color: rgba(255, 255, 255, 0.9);
                }

                &.down {
                    color: rgba(255, 255, 255, 0.7);
                }

                .el-icon {
                    margin-right: 4px;
                }
            }
        }

        .kpi-chart {
            position: absolute;
            right: 16px;
            bottom: 16px;
            width: 80px;
            height: 40px;

            .mini-chart {
                display: flex;
                gap: 2px;
                align-items: end;
                height: 100%;

                .chart-bar {
                    flex: 1;
                    background: rgba(255, 255, 255, 0.3);
                    border-radius: 2px;
                    transition: all 0.3s ease;
                }
            }
        }
    }

    // 图表头部
    .chart-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
    }

    // 图表容器
    .chart-container {
        .chart-stats {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 20px;
            margin-bottom: 20px;

            .chart-stat-item {
                padding: 16px;
                text-align: center;
                background: var(--el-bg-color-page);
                border-radius: 8px;

                .stat-number {
                    font-size: 20px;
                    font-weight: 600;
                    color: var(--el-text-color-primary);
                }

                .stat-label {
                    margin-top: 4px;
                    font-size: 12px;
                    color: var(--el-text-color-regular);
                }
            }
        }

        .chart-placeholder {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 300px;
            background: var(--el-bg-color-page);
            border-radius: 8px;

            .placeholder-text {
                font-size: 18px;
                font-weight: 600;
                color: var(--el-text-color-primary);
            }

            .placeholder-desc {
                margin-top: 8px;
                font-size: 14px;
                color: var(--el-text-color-regular);
            }
        }
    }

    // 监控面板
    .monitor-panel {
        .monitor-item {
            margin-bottom: 20px;

            &:last-child {
                margin-bottom: 0;
            }

            .monitor-header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin-bottom: 12px;
                font-size: 14px;
                font-weight: 500;
                color: var(--el-text-color-primary);
            }

            .monitor-metrics {
                .metric-item {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    margin-bottom: 8px;

                    &:last-child {
                        margin-bottom: 0;
                    }

                    .metric-label {
                        font-size: 12px;
                        color: var(--el-text-color-regular);
                    }

                    .metric-value {
                        font-size: 12px;
                        font-weight: 600;
                        color: var(--el-text-color-primary);
                    }

                    .el-progress {
                        width: 120px;
                    }
                }
            }

            .online-users {
                .user-item {
                    display: flex;
                    align-items: center;
                    margin-bottom: 8px;

                    &:last-child {
                        margin-bottom: 0;
                    }

                    .user-name {
                        flex: 1;
                        margin-left: 8px;
                        font-size: 12px;
                        color: var(--el-text-color-primary);
                    }

                    .user-status {
                        padding: 2px 6px;
                        font-size: 10px;
                        border-radius: 10px;

                        &.online {
                            color: var(--el-color-success);
                            background: var(--el-color-success-light-9);
                        }

                        &.away {
                            color: var(--el-color-warning);
                            background: var(--el-color-warning-light-9);
                        }

                        &.busy {
                            color: var(--el-color-danger);
                            background: var(--el-color-danger-light-9);
                        }
                    }
                }
            }
        }
    }

    // 金额样式
    .amount {
        font-weight: 600;
        color: var(--el-color-primary);
    }
}
</style>
