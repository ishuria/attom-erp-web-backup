<template>
    <div class="goods-sku-container auto-height-container">
        <vab-query-form>
            <vab-query-form-left-panel>
                <el-button :icon="Plus" type="primary" @click="handleAdd">添加</el-button>
                <el-button :icon="Delete" type="danger" @click="handleDelete">删除</el-button>
            </vab-query-form-left-panel>
            <vab-query-form-right-panel>
                <el-form inline :model="queryForm" @submit.prevent>
                    <el-form-item>
                        <el-input v-model="queryForm.skuName" clearable placeholder="请输入SKU名称" />
                    </el-form-item>
                    <el-form-item>
                        <el-button :icon="Search" :loading="loading" native-type="submit" type="primary" @click="handleQuery">
                            查询
                        </el-button>
                    </el-form-item>
                    <el-form-item>
                        <el-button :icon="Refresh" @click="resetQueryForm">重置</el-button>
                    </el-form-item>
                </el-form>
            </vab-query-form-right-panel>
        </vab-query-form>

        <el-table ref="tableRef" v-loading="loading" border :data="tableData" @selection-change="setSelectRows">
            <el-table-column type="selection" width="38" />
            <el-table-column align="center" label="序号" width="55">
                <template #default="{ $index }">
                    {{ $index + 1 }}
                </template>
            </el-table-column>
            <el-table-column align="center" label="SKU编码" min-width="120" prop="skuCode" />
            <el-table-column align="center" label="SKU名称" min-width="200" prop="skuName" />
            <el-table-column align="center" label="规格" min-width="200">
                <template #default="{ row }">
                    <el-tag v-for="spec in row.specifications" :key="spec.key" style="margin: 0 8px 8px 0">
                        {{ spec.key }}: {{ spec.value }}
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column align="center" label="价格" min-width="100" prop="price" sortable>
                <template #default="{ row }">¥{{ row.price }}</template>
            </el-table-column>
            <el-table-column align="center" label="库存" min-width="80" prop="stock" sortable />
            <el-table-column align="center" label="状态" min-width="100" prop="status" sortable>
                <template #default="{ row }">
                    <el-tag effect="dark" :type="row.status === 'active' ? 'success' : 'danger'">
                        {{ row.status === 'active' ? '启用' : '禁用' }}
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column align="center" label="排序" min-width="80" prop="sort" sortable />
            <el-table-column align="center" label="备注" min-width="150" prop="remark" show-overflow-tooltip />
            <el-table-column align="center" label="操作" width="150">
                <template #default="{ row }">
                    <el-button text type="primary" @click="handleEdit(row)">编辑</el-button>
                    <el-button text type="danger" @click="handleDelete(row)">删除</el-button>
                </template>
            </el-table-column>
            <template #empty>
                <el-empty class="vab-data-empty" description="暂无数据" />
            </template>
        </el-table>

        <vab-pagination
            :current-page="pagination.pageNo"
            :page-size="pagination.pageSize"
            :total="pagination.total"
            @current-change="handleCurrentChange"
            @size-change="handleSizeChange"
        />

        <!-- 新增/编辑抽屉 -->
        <el-drawer
            v-model="dialogVisible"
            destroy-on-close
            :size="isSmallScreen ? '95%' : '1000px'"
            :title="dialogType === 'add' ? '新增SKU' : '编辑SKU'"
        >
            <div class="two-column-layout">
                <!-- 左侧基本信息 -->
                <div class="left-column">
                    <el-form ref="formRef" class="sku-form" label-width="100px" :model="form" :rules="rules">
                        <el-form-item label="SKU编码" prop="skuCode">
                            <el-input v-model="form.skuCode" placeholder="请输入SKU编码" />
                        </el-form-item>
                        <el-form-item label="SKU名称" prop="skuName">
                            <el-input v-model="form.skuName" placeholder="请输入SKU名称" />
                        </el-form-item>

                        <!-- 单规格设置 -->
                        <template v-if="skuTable.length === 0">
                            <el-form-item label="价格" prop="price">
                                <el-input-number v-model="form.price" :min="0" :precision="2" />
                            </el-form-item>
                            <el-form-item label="库存" prop="stock">
                                <el-input-number v-model="form.stock" :min="0" :precision="0" />
                            </el-form-item>
                        </template>

                        <el-form-item label="状态" prop="status">
                            <el-radio-group v-model="form.status">
                                <el-radio value="active">启用</el-radio>
                                <el-radio value="inactive">禁用</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item label="排序" prop="sort">
                            <el-input-number v-model="form.sort" :min="0" :precision="0" />
                        </el-form-item>
                        <el-form-item label="备注" prop="remark">
                            <el-input v-model="form.remark" placeholder="请输入备注信息" :rows="3" type="textarea" />
                        </el-form-item>
                    </el-form>
                </div>

                <!-- 右侧规格设置 -->
                <div class="right-column">
                    <el-card header="规格设置" shadow="never">
                        <!-- 多规格多属性设置 -->
                        <div class="spec-setting-section">
                            <!-- 规格项添加区域 -->
                            <div class="spec-header">
                                <el-alert
                                    :closable="false"
                                    style="width: 100%"
                                    title="添加规格（如颜色、尺码、材质等），每个规格可以包含多个规格值"
                                    type="info"
                                />
                            </div>

                            <!-- 规格列表 -->
                            <div v-for="(spec, specIndex) in specList" :key="specIndex" class="spec-item">
                                <div class="spec-title">规格 {{ specIndex + 1 }}</div>
                                <div class="spec-content">
                                    <div class="spec-name-values-row">
                                        <div class="spec-name-container">
                                            <div class="input-label">规格名称：</div>
                                            <el-input v-model="spec.name" placeholder="规格名，如颜色、尺码等" />
                                        </div>
                                        <div class="input-container">
                                            <div class="input-label">添加规格值：</div>
                                            <el-input
                                                v-model="spec.input"
                                                placeholder="输入规格值后按回车添加"
                                                @keyup.enter="addSpecValue(specIndex)"
                                            >
                                                <template #append>
                                                    <el-button @click="addSpecValue(specIndex)">添加</el-button>
                                                </template>
                                            </el-input>
                                        </div>
                                    </div>

                                    <div class="tag-container">
                                        <div v-if="spec.values.length > 0" class="tag-label">已添加规格值：</div>
                                        <div class="tag-list">
                                            <el-tag
                                                v-for="(val, valIndex) in spec.values"
                                                :key="valIndex"
                                                closable
                                                style="margin: 0 8px 8px 0"
                                                @close="removeSpecValue(specIndex, valIndex)"
                                            >
                                                {{ val }}
                                            </el-tag>
                                        </div>
                                        <div v-if="spec.values.length === 0" class="empty-tip">暂无规格值，请在上方添加</div>
                                    </div>

                                    <div class="spec-action">
                                        <el-button type="danger" @click="removeSpec(specIndex)">删除规格</el-button>
                                    </div>
                                </div>
                            </div>

                            <!-- 添加规格按钮 -->
                            <el-button class="btn-gap" style="margin-top: 16px" type="primary" @click="addSpec">
                                <vab-icon icon="add-line" />
                                添加规格
                            </el-button>
                        </div>

                        <!-- SKU列表 -->
                        <div v-if="skuTable.length > 0" class="sku-table-wrapper">
                            <el-card class="sku-card" header="SKU列表" shadow="never">
                                <el-alert
                                    :closable="false"
                                    style="margin-bottom: 16px"
                                    title="以下是根据规格组合生成的SKU列表，请为每个SKU设置价格和库存"
                                    type="success"
                                />

                                <div class="table-responsive">
                                    <el-table border :data="skuTable" max-height="350px" style="width: 100%">
                                        <el-table-column
                                            v-for="(spec, i) in specList"
                                            :key="i"
                                            align="center"
                                            :label="spec.name || `规格${i + 1}`"
                                        >
                                            <template #default="{ row }">
                                                {{ row.specs[i] }}
                                            </template>
                                        </el-table-column>
                                        <el-table-column align="center" label="价格" width="180">
                                            <template #default="{ row }">
                                                <el-input-number v-model="row.price" :min="0" :precision="2" :step="1" step-strictly />
                                            </template>
                                        </el-table-column>
                                        <el-table-column align="center" label="库存" width="180">
                                            <template #default="{ row }">
                                                <el-input-number v-model="row.stock" :min="0" :precision="0" :step="1" step-strictly />
                                            </template>
                                        </el-table-column>
                                    </el-table>
                                </div>

                                <!-- 批量设置 -->
                                <div class="batch-setting">
                                    <el-row :gutter="20">
                                        <el-col :span="12">
                                            <div class="flex-center">
                                                <el-input-number v-model="batchPrice" :min="0" placeholder="批量价格" :precision="2" />
                                                <el-button style="margin-left: 12px" type="primary" @click="setBatchPrice">
                                                    批量设置价格
                                                </el-button>
                                            </div>
                                        </el-col>
                                        <el-col :span="12">
                                            <div class="flex-center">
                                                <el-input-number v-model="batchStock" :min="0" placeholder="批量库存" :precision="0" />
                                                <el-button style="margin-left: 12px" type="primary" @click="setBatchStock">
                                                    批量设置库存
                                                </el-button>
                                            </div>
                                        </el-col>
                                    </el-row>
                                </div>
                            </el-card>
                        </div>
                    </el-card>
                </div>
            </div>

            <template #footer>
                <div class="drawer-footer">
                    <el-button @click="dialogVisible = false">取消</el-button>
                    <el-button type="primary" @click="handleSubmit">确定</el-button>
                </div>
            </template>
        </el-drawer>
    </div>
</template>

<script lang="ts" setup>
import { Delete, Plus, Refresh, Search } from '@element-plus/icons-vue'
import type { TableInstance } from 'element-plus'
import { onMounted, onUnmounted, reactive, ref, watch } from 'vue'
import { addSku, deleteSku, editSku, getSkuList } from '/@/api/goodsSku'
import { $baseConfirm, $baseMessage } from '/@/hooks'

// 定义SKU接口
interface SkuItem {
    id: string
    skuCode: string
    skuName: string
    specifications: Array<{ key: string; value: string }>
    price: number
    stock: number
    status: string
    sort: number
    remark: string
}

// 定义规格属性接口
interface SpecItem {
    name: string
    values: string[]
    input: string
}

// 定义SKU组合接口
interface SkuCombination {
    specs: string[]
    price: number
    stock: number
}

defineOptions({
    name: 'GoodsSku',
})

const tableRef = ref<TableInstance>()
const selectRows = ref<any>([])
const formRef = ref()

// 查询表单
const queryForm = reactive({
    pageNo: 1,
    pageSize: 20,
    skuName: '',
    status: '',
})

// 列表数据
const loading = ref(false)
const tableData = ref<SkuItem[]>([])
const pagination = reactive({
    pageNo: 1,
    pageSize: 20,
    total: 0,
})

// 对话框
const dialogVisible = ref(false)
const dialogType = ref<'add' | 'edit'>('add')

// SKU表单
const form = reactive<SkuItem & { specs?: string[] }>({
    id: '',
    skuCode: '',
    skuName: '',
    specifications: [],
    price: 0,
    stock: 0,
    status: 'active',
    sort: 0,
    remark: '',
    specs: [], // 添加specs属性用于临时存储规格值
})

// 表单验证规则
const rules = {
    skuCode: [{ required: true, message: '请输入SKU编码', trigger: 'blur' }],
    skuName: [{ required: true, message: '请输入SKU名称', trigger: 'blur' }],
    price: [{ required: true, message: '请输入价格', trigger: 'blur' }],
    stock: [{ required: true, message: '请输入库存', trigger: 'blur' }],
    specs: [
        {
            validator: (rule: any, value: any, callback: any) => {
                // 如果有多规格设置，则检查规格是否有效
                if (specList.value.length > 0) {
                    // 检查每个规格是否都有名称和至少一个规格值
                    const isValid = specList.value.every((spec) => spec.name && spec.values.length > 0)
                    if (isValid) {
                        // 检查SKU表格中的价格和库存是否有效
                        if (skuTable.value.length > 0) {
                            const hasPriceStock = skuTable.value.every((sku) => sku.price >= 0 && sku.stock >= 0)
                            if (hasPriceStock) {
                                callback()
                            } else {
                                callback(new Error('每个SKU组合必须设置价格和库存'))
                            }
                        } else {
                            callback()
                        }
                    } else {
                        callback(new Error('每个规格必须有名称和至少一个规格值'))
                    }
                } else {
                    callback()
                }
            },
            trigger: 'change',
        },
    ],
}

// 批量设置
const batchPrice = ref(0)
const batchStock = ref(0)

// 多规格多属性相关
const specList = ref<SpecItem[]>([]) // 规格列表
const skuTable = ref<SkuCombination[]>([]) // SKU组合表

// 监听规格变化自动生成SKU组合
watch(
    specList,
    () => {
        generateSkuTable()
    },
    { deep: true }
)

onActivated(() => {
    tableRef.value?.doLayout()
})

// 获取SKU列表
const fetchSkuList = async () => {
    loading.value = true
    try {
        const params = {
            pageNo: pagination.pageNo,
            pageSize: pagination.pageSize,
            skuName: queryForm.skuName,
            status: queryForm.status,
        }
        const { data } = await getSkuList(params)
        tableData.value = data.list
        pagination.total = data.total
    } catch (error) {
        console.error('获取SKU列表失败:', error)
        $baseMessage('获取SKU列表失败', 'error', 'hey')
    } finally {
        loading.value = false
    }
}

// 查询数据
const handleQuery = () => {
    pagination.pageNo = 1
    fetchSkuList()
}

// 分页处理
const handleCurrentChange = (page: number) => {
    pagination.pageNo = page
    fetchSkuList()
}

const handleSizeChange = (size: number) => {
    pagination.pageSize = size
    pagination.pageNo = 1
    fetchSkuList()
}

const setSelectRows = (value: string) => {
    selectRows.value = value
}

// 新增SKU
const handleAdd = () => {
    dialogType.value = 'add'
    resetForm()
    dialogVisible.value = true
}

// 编辑SKU
const handleEdit = (row: SkuItem) => {
    dialogType.value = 'edit'
    resetForm()

    // 填充基本信息
    Object.assign(form, row)

    // 处理规格信息
    if (row.specifications && row.specifications.length > 0) {
        // 映射规格到specList
        const specMap = new Map()

        row.specifications.forEach((spec) => {
            if (!specMap.has(spec.key)) {
                specMap.set(spec.key, [])
            }
            specMap.get(spec.key).push(spec.value)
        })

        specList.value = Array.from(specMap.entries()).map(([name, values]) => ({
            name,
            values: values as string[],
            input: '',
        }))

        // 生成SKU表格
        generateSkuTable()

        // 如果有SKU组合，设置价格和库存
        if (skuTable.value.length === 1) {
            skuTable.value[0].price = row.price
            skuTable.value[0].stock = row.stock
        }

        // 将当前的规格值填充到form.specs中以供显示
        if (row.specifications.length > 0) {
            form.specs = specList.value.map((_, index) => {
                const spec = row.specifications.find((s) => s.key === specList.value[index].name)
                return spec ? spec.value : ''
            })
        }
    }

    dialogVisible.value = true
}

// 删除SKU
const handleDelete = (row?: any) => {
    if (row?.id) {
        $baseConfirm('您确定要删除当前项吗', null, async () => {
            try {
                const response = await deleteSku({ id: row.id })
                $baseMessage(response.data.msg, 'success', 'hey')
                fetchSkuList()
            } catch (error) {
                console.error('删除失败:', error)
                $baseMessage('删除失败', 'error', 'hey')
            }
        })
    } else {
        if (selectRows.value.length > 0) {
            const ids = selectRows.value.map((item: { id: any }) => item.id).join(',')
            $baseConfirm('您确定要删除选中项吗', null, async () => {
                try {
                    const response = await deleteSku({ ids })
                    $baseMessage(response.data.msg, 'success', 'hey')
                    fetchSkuList()
                } catch (error) {
                    console.error('删除失败:', error)
                    $baseMessage('删除失败', 'error', 'hey')
                }
            })
        } else {
            $baseMessage('您未选中任何行', 'warning', 'hey')
        }
    }
}

// 重置表单
const resetForm = () => {
    Object.assign(form, {
        id: '',
        skuCode: '',
        skuName: '',
        specifications: [],
        price: 0,
        stock: 0,
        status: 'active',
        sort: 0,
        remark: '',
        specs: [],
    })

    // 清空规格列表和SKU表格
    specList.value = []
    skuTable.value = []

    // 清空批量设置
    batchPrice.value = 0
    batchStock.value = 0
}

// 添加规格
const addSpec = () => {
    specList.value.push({ name: '', values: [], input: '' })
}

// 删除规格
const removeSpec = (index: number) => {
    specList.value.splice(index, 1)
}

// 添加规格值
const addSpecValue = (specIndex: number) => {
    const spec = specList.value[specIndex]
    if (!spec) return

    const val = spec.input?.trim()
    if (val && !spec.values.includes(val)) {
        spec.values.push(val)
        spec.input = ''
    } else if (val) {
        $baseMessage('该规格值已存在', 'warning', 'hey')
        spec.input = ''
    } else {
        $baseMessage('规格值不能为空', 'warning', 'hey')
    }
}

// 删除规格值
const removeSpecValue = (specIndex: number, valIndex: number) => {
    if (specList.value[specIndex]) {
        specList.value[specIndex].values.splice(valIndex, 1)
    }
}

// 笛卡尔积生成所有SKU组合
const generateSkuTable = () => {
    // 检查是否有有效的规格
    if (specList.value.length === 0 || specList.value.some((s) => !s.name || s.values.length === 0)) {
        skuTable.value = []
        return
    }

    // 提取所有规格值数组
    const specValues = specList.value.map((s) => s.values)

    // 计算笛卡尔积
    const cartesian = (...arrays: any[]): any[] => {
        return arrays.reduce((acc: any[], curr: any[]) => acc.flatMap((combo: any) => curr.map((item: any) => [...combo, item])), [[]])
    }

    // 生成所有组合
    const combinations = cartesian(...specValues)

    // 创建SKU表格数据
    skuTable.value = combinations.map((specs) => ({
        specs,
        price: form.price || 0,
        stock: form.stock || 0,
    }))
}

// 批量设置价格
const setBatchPrice = () => {
    if (skuTable.value.length > 0) {
        skuTable.value.forEach((sku) => {
            sku.price = batchPrice.value
        })
        $baseMessage('批量设置价格成功', 'success', 'hey')
    }
}

// 批量设置库存
const setBatchStock = () => {
    if (skuTable.value.length > 0) {
        skuTable.value.forEach((sku) => {
            sku.stock = batchStock.value
        })
        $baseMessage('批量设置库存成功', 'success', 'hey')
    }
}

// 提交表单
const handleSubmit = async () => {
    if (!formRef.value) return

    await formRef.value.validate(async (valid: boolean) => {
        if (valid) {
            try {
                // 构建提交数据
                let submitData: any = { ...form }

                // 处理多规格多属性
                if (skuTable.value.length > 0) {
                    // 如果有多规格，则生成specifications数组
                    const specifications: any[] = []

                    skuTable.value.forEach((item) => {
                        const specObj: any = {}

                        // 将每个SKU组合的规格值与规格名关联
                        item.specs.forEach((value, index) => {
                            if (specList.value[index]) {
                                const key = specList.value[index].name
                                specObj[key] = value
                            }
                        })

                        // 为每种规格组合创建一个SKU记录
                        const skuData = {
                            skuCode: `${submitData.skuCode}_${item.specs.join('_')}`, // 自动生成不同的SKU编码
                            skuName: submitData.skuName,
                            specifications: Object.entries(specObj).map(([key, value]) => ({ key, value })),
                            price: item.price,
                            stock: item.stock,
                            status: submitData.status,
                            sort: submitData.sort,
                            remark: submitData.remark,
                        }

                        specifications.push(skuData)
                    })

                    // 如果是编辑模式且有ID，则保留
                    if (dialogType.value === 'edit' && submitData.id) {
                        specifications[0].id = submitData.id
                    }

                    submitData = {
                        bulkOperation: true,
                        skuList: specifications,
                    }
                } else {
                    // 单规格模式，保持原样
                    if (dialogType.value === 'add') {
                        delete submitData.id
                    }
                }

                console.log('提交数据:', JSON.stringify(submitData))

                let message = '操作成功'
                if (dialogType.value === 'edit') {
                    // 编辑模式
                    const response: any = await editSku(submitData)
                    console.log('编辑返回数据:', response)
                    // API响应可能直接返回或包含在data属性中
                    if (response) {
                        if (typeof response === 'object' && response.msg) {
                            message = response.msg
                        } else if (response.data && response.data.msg) {
                            message = response.data.msg
                        }
                    }
                } else {
                    // 新增模式
                    const response: any = await addSku(submitData)
                    console.log('新增返回数据:', response)
                    // API响应可能直接返回或包含在data属性中
                    if (response) {
                        if (typeof response === 'object' && response.msg) {
                            message = response.msg
                        } else if (response.data && response.data.msg) {
                            message = response.data.msg
                        }
                    }
                }

                $baseMessage(message, 'success', 'hey')
                dialogVisible.value = false
                fetchSkuList()
            } catch (error: any) {
                console.error('操作失败:', error)
                let errorMsg = '操作失败'
                if (error.message) {
                    errorMsg += `: ${error.message}`
                }
                if (error.response && error.response.data) {
                    console.error('错误响应数据:', error.response.data)
                    if (error.response.data.msg) {
                        errorMsg = error.response.data.msg
                    }
                } else if (typeof error === 'object' && error.msg) {
                    errorMsg = error.msg
                }
                $baseMessage(errorMsg, 'error', 'hey')
            }
        } else {
            $baseMessage('请正确填写表单信息', 'warning', 'hey')
            return false
        }
    })
}

const resetQueryForm = () => {
    ;(Object.keys(queryForm) as (keyof typeof queryForm)[]).forEach((key) => {
        if (key !== 'pageNo' && key !== 'pageSize') queryForm[key] = '' as never
    })
    pagination.pageNo = 1
    fetchSkuList()
}

onBeforeMount(() => {
    fetchSkuList()
})

// 响应式判断屏幕大小
const isSmallScreen = ref(window.innerWidth <= 768)

// 监听窗口大小变化
const handleResize = () => {
    isSmallScreen.value = window.innerWidth <= 768
}

// 添加和移除事件监听器
onMounted(() => {
    window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
    window.removeEventListener('resize', handleResize)
})
</script>

<style lang="scss" scoped>
.goods-sku-container {
    box-sizing: border-box;
    width: 100%;

    .two-column-layout {
        display: flex;
        gap: 20px;
        width: 100%;
        height: 100%;

        @media (max-width: 768px) {
            flex-direction: column;
        }

        .left-column {
            width: 35%;
            min-width: 300px;

            @media (max-width: 768px) {
                width: 100%;
                min-width: 100%;
            }
        }

        .right-column {
            flex: 1;
            overflow-y: auto;

            @media (max-width: 768px) {
                width: 100%;
                margin-top: 20px;
            }
        }
    }

    .sku-table-wrapper {
        margin-top: 20px;

        .table-responsive {
            width: 100%;
            overflow-x: auto;

            @media (max-width: 768px) {
                -webkit-overflow-scrolling: touch;
                margin-bottom: 15px;
            }
        }

        :deep(.el-table) {
            width: 100% !important;

            .el-table__body {
                width: 100% !important;
            }

            @media (max-width: 768px) {
                .el-input-number {
                    width: 120px;
                    min-width: 120px;
                }
            }
        }

        .el-alert {
            margin-bottom: 16px;
        }
    }

    :deep(.el-card) {
        border-radius: var(--el-border-radius-base);

        .el-card__header {
            padding: 15px 20px;
            font-weight: 600;
            border-bottom: 1px solid var(--el-border-color-light);
        }

        .el-card__body {
            padding: 20px;
        }
    }

    .sku-form {
        box-sizing: border-box;
        width: 100%;
        padding: 10px;

        .el-form-item {
            width: 100%;
            margin-bottom: 22px;

            &:last-child {
                margin-bottom: 0;
            }

            :deep(.el-form-item__content) {
                flex: 1;
                width: calc(100% - 100px);
            }
        }

        .spec-form-item,
        .sku-table-form-item {
            display: block !important;
            width: 100% !important;
            margin-bottom: 30px;

            :deep(.el-form-item__content) {
                display: flex;
                flex-direction: column;
                width: 100% !important;
                max-width: 100% !important;
                margin-left: 0 !important;
            }
        }

        :deep(.el-form-item__label) {
            width: 100px !important;
            padding-right: 20px;
            text-align: right;
        }
    }

    .spec-item {
        padding: 18px;
        margin-bottom: 16px;
        background-color: var(--el-fill-color-light);
        border: 1px solid var(--el-border-color-lighter);
        border-radius: var(--el-border-radius-base);
    }

    .spec-title {
        padding-bottom: 12px;
        margin-bottom: 16px;
        font-size: 16px;
        font-weight: 600;
        color: var(--el-text-color-primary);
        border-bottom: 1px solid var(--el-border-color-light);
    }

    .spec-content {
        display: flex;
        flex-direction: column;
        gap: 16px;
        width: 100%;
    }

    .spec-name-values-row {
        display: flex;
        gap: 20px;
        width: 100%;

        @media (max-width: 576px) {
            flex-direction: column;
            gap: 10px;
        }
    }

    .spec-name-container {
        width: 40%;

        @media (max-width: 576px) {
            width: 100%;
        }
    }

    .input-container {
        width: 60%;

        @media (max-width: 576px) {
            width: 100%;
        }
    }

    .input-label,
    .tag-label {
        margin-bottom: 5px;
    }

    .spec-setting-section,
    .sku-table-section {
        width: 100%;
    }

    .spec-header {
        margin-bottom: 16px;
    }

    :deep(.el-input) {
        width: 100%;

        .el-input__wrapper {
            box-shadow: 0 0 0 1px var(--el-border-color) inset;
        }
    }

    .tag-container {
        display: flex;
        flex-direction: column;
        gap: 8px;
        min-height: 32px;
        padding: 4px 0;
        padding-top: 10px;
        margin-bottom: 0;
        border-top: 1px dashed var(--el-border-color);
    }

    .tag-list {
        display: flex;
        flex-wrap: wrap;
        gap: 0;
        padding: 4px;
        margin: -4px;
    }

    .empty-tip {
        padding: 4px 0;
        font-style: italic;
        color: var(--el-text-color-secondary);
    }

    .spec-action {
        display: flex;
        justify-content: flex-end;
        padding-top: var(--el-margin);
        border-top: 1px dashed var(--el-border-color);
    }

    :deep(.el-tag) {
        max-width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .batch-setting {
        padding: 16px;
        margin-top: 16px;
        background-color: var(--el-fill-color-light);
        border: 1px solid var(--el-border-color-lighter);
        border-radius: var(--el-border-radius-base);

        @media (max-width: 768px) {
            .el-row {
                :deep(.el-col) {
                    width: 100%;
                    margin-bottom: 10px;

                    &:last-child {
                        margin-bottom: 0;
                    }
                }
            }

            .flex-center {
                flex-direction: column;
                align-items: flex-start;

                .el-input-number {
                    width: 100%;
                }

                .el-button {
                    width: 100%;
                    margin-top: 10px;
                    margin-left: 0 !important;
                }
            }
        }
    }

    .btn-gap {
        margin-right: 10px;
    }

    .flex-center {
        display: flex;
        align-items: center;
    }

    .drawer-footer {
        display: flex;
        justify-content: flex-end;
        margin-top: -1px;
    }

    :deep(.el-input-number) {
        width: 150px;
    }

    :deep(.el-drawer) {
        .el-drawer__header {
            padding: 20px;
            margin-bottom: 0;
            border-bottom: 1px solid var(--el-border-color-lighter);
        }

        .el-drawer__body {
            width: 100%;
            height: calc(100% - 60px);
            padding: 16px;
            overflow-y: auto;
        }
    }
}
</style>
