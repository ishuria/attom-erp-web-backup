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
        flex-direction: row;
        align-items: center;
        height: 168px;
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
                    gap: 8px;
                    align-items: center;
                    margin-bottom: 8px;

                    :deep(.el-avatar) {
                        padding: 5px;
                        background: var(--el-bg-color-page);
                        border: 1px solid var(--el-border-color-lighter);
                    }

                    .user-name {
                        flex: 1;
                        font-size: 14px;
                        color: var(--el-text-color-primary);
                    }

                    .user-status {
                        padding: 2px 6px;
                        font-size: 12px;
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
