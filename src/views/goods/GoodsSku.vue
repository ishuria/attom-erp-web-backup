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
                    <el-tag v-for="spec in row.specifications" :key="spec.key" size="small" style="margin-right: 5px">
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

        <!-- 新增/编辑对话框 -->
        <el-dialog v-model="dialogVisible" :title="dialogType === 'add' ? '新增SKU' : '编辑SKU'" width="600px">
            <el-form ref="formRef" label-width="100px" :model="form" :rules="rules">
                <el-form-item label="SKU编码" prop="skuCode">
                    <el-input v-model="form.skuCode" placeholder="请输入SKU编码" />
                </el-form-item>
                <el-form-item label="SKU名称" prop="skuName">
                    <el-input v-model="form.skuName" placeholder="请输入SKU名称" />
                </el-form-item>
                <el-form-item label="规格配置" prop="specifications">
                    <div v-for="(spec, index) in form.specifications" :key="index" class="spec-item">
                        <el-row :gutter="10">
                            <el-col :span="10">
                                <el-input v-model="spec.key" placeholder="规格名称" />
                            </el-col>
                            <el-col :span="10">
                                <el-input v-model="spec.value" placeholder="规格值" />
                            </el-col>
                            <el-col :span="4">
                                <el-button link type="danger" @click="removeSpec(index)">
                                    <vab-icon icon="delete-bin-line" />
                                </el-button>
                            </el-col>
                        </el-row>
                    </div>
                    <el-button link type="primary" @click="addSpec">
                        <vab-icon icon="add-line" />
                        添加规格
                    </el-button>
                </el-form-item>
                <el-form-item label="价格" prop="price">
                    <el-input-number v-model="form.price" :min="0" :precision="2" />
                </el-form-item>
                <el-form-item label="库存" prop="stock">
                    <el-input-number v-model="form.stock" :min="0" :precision="0" />
                </el-form-item>
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
            <template #footer>
                <el-button @click="dialogVisible = false">取消</el-button>
                <el-button type="primary" @click="handleSubmit">确定</el-button>
            </template>
        </el-dialog>
    </div>
</template>

<script lang="ts" setup>
import { Delete, Plus, Refresh, Search } from '@element-plus/icons-vue'
import type { TableInstance } from 'element-plus'
import { addSku, deleteSku, editSku, getSkuList } from '/@/api/goodsSku'

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

defineOptions({
    name: 'GoodsSku',
})

const tableRef = ref<TableInstance>()
const selectRows = ref<any>([])

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
const form = reactive<SkuItem>({
    id: '',
    skuCode: '',
    skuName: '',
    specifications: [],
    price: 0,
    stock: 0,
    status: 'active',
    sort: 0,
    remark: '',
})

// 表单验证规则
const rules = {
    skuCode: [{ required: true, message: '请输入SKU编码', trigger: 'blur' }],
    skuName: [{ required: true, message: '请输入SKU名称', trigger: 'blur' }],
    price: [{ required: true, message: '请输入价格', trigger: 'blur' }],
    stock: [{ required: true, message: '请输入库存', trigger: 'blur' }],
}

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
    Object.assign(form, row)
    dialogVisible.value = true
}

// 删除SKU
const handleDelete = (row: any) => {
    if (row.id) {
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
    })
}

// 添加规格
const addSpec = () => {
    form.specifications.push({ key: '', value: '' })
}

// 删除规格
const removeSpec = (index: number) => {
    form.specifications.splice(index, 1)
}

// 提交表单
const handleSubmit = async () => {
    try {
        if (dialogType.value === 'edit') {
            // 编辑模式
            const response = await editSku(form)
            $baseMessage(response.data.msg, 'success', 'hey')
            dialogVisible.value = false
            fetchSkuList()
        } else {
            // 新增模式
            const response = await addSku(form)
            $baseMessage(response.data.msg, 'success', 'hey')
            dialogVisible.value = false
            fetchSkuList()
        }
    } catch (error) {
        console.error('操作失败:', error)
        $baseMessage('操作失败', 'error', 'hey')
    }
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
</script>

<style lang="scss" scoped>
.goods-sku-container {
    .spec-item {
        margin-bottom: 10px;
    }
}
</style>
