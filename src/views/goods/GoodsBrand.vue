<template>
    <div class="goods-brand-container auto-height-container">
        <vab-query-form>
            <vab-query-form-left-panel>
                <el-button type="primary" @click="openDialog('add')">添加品牌</el-button>
            </vab-query-form-left-panel>
            <vab-query-form-right-panel>
                <el-form :inline="true" :model="queryForm" @submit.prevent>
                    <el-form-item>
                        <el-input v-model="queryForm.name" clearable placeholder="品牌名称" @keyup.enter="handleSearch" />
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="handleSearch">搜索</el-button>
                    </el-form-item>
                </el-form>
            </vab-query-form-right-panel>
        </vab-query-form>

        <el-table border :data="pagedList" style="width: 100%; margin-top: 16px">
            <el-table-column align="center" label="ID" prop="id" width="80" />
            <el-table-column align="center" label="品牌名称" min-width="120" prop="name" />
            <el-table-column align="center" label="品牌Logo" prop="logo" width="120">
                <template #default="{ row }">
                    <el-image v-if="row.logo" :src="row.logo" style="width: 48px; height: 48px; object-fit: contain" />
                    <span v-else style="color: #ccc">无</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="品牌描述" min-width="180" prop="desc" />
            <el-table-column align="center" label="状态" prop="status" width="100">
                <template #default="{ row }">
                    <el-tag :type="row.status === '启用' ? 'success' : 'info'">{{ row.status }}</el-tag>
                </template>
            </el-table-column>
            <el-table-column align="center" label="操作" type="actions" width="160">
                <template #default="{ row }">
                    <el-button size="small" text type="primary" @click="openDialog('edit', row)">编辑</el-button>
                    <el-button size="small" text type="danger" @click="deleteBrand(row.id)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <vab-pagination
            :current-page="queryForm.pageNo"
            :page-size="queryForm.pageSize"
            :total="total"
            @current-change="handleCurrentChange"
            @size-change="handleSizeChange"
        />

        <el-dialog v-model="dialogVisible" :title="dialogMode === 'add' ? '添加品牌' : '编辑品牌'" width="500px">
            <el-form ref="formRef" label-position="top" label-width="100px" :model="form" :rules="rules">
                <el-form-item label="品牌名称" prop="name">
                    <el-input v-model="form.name" placeholder="请输入品牌名称" />
                </el-form-item>
                <el-form-item label="品牌Logo" prop="logo">
                    <el-upload
                        v-if="!form.logo"
                        accept="image/*"
                        action="#"
                        :before-upload="beforeUpload"
                        class="brand-logo-upload"
                        drag
                        :limit="1"
                        :on-change="handleLogoChange"
                        :show-file-list="false"
                    >
                        <el-icon class="el-icon--upload"><plus /></el-icon>
                        <div class="el-upload__text">
                            将Logo拖拽至此处或
                            <em>点击上传</em>
                        </div>
                        <template #tip>
                            <div class="el-upload__tip">支持 jpg/png/gif，大小不超过2MB</div>
                        </template>
                    </el-upload>
                    <div v-if="form.logo" class="logo-preview">
                        <img alt="Logo预览" :src="form.logo" />
                        <el-button size="small" type="danger" @click="form.logo = ''">删除</el-button>
                    </div>
                </el-form-item>
                <el-form-item label="品牌描述" prop="desc">
                    <el-input v-model="form.desc" placeholder="请输入品牌描述" type="textarea" />
                </el-form-item>
                <el-form-item label="状态" prop="status">
                    <el-select v-model="form.status">
                        <el-option label="启用" value="启用" />
                        <el-option label="禁用" value="禁用" />
                    </el-select>
                </el-form-item>
            </el-form>
            <template #footer>
                <el-button @click="dialogVisible = false">取消</el-button>
                <el-button type="primary" @click="submitForm">确定</el-button>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import { Plus } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { computed, nextTick, reactive, ref, watch } from 'vue'
import { doBrandDelete, doBrandEdit, getBrandList } from '/@/api/goodsBrand'

interface Brand {
    id: number
    name: string
    logo: string
    desc: string
    status: string
}

const queryForm = reactive({
    pageNo: 1,
    pageSize: 10,
    name: '',
})
const total = ref(0)
const brandList = ref<Brand[]>([])
const loading = ref(false)

const pagedList = computed(() => brandList.value)

async function fetchList() {
    loading.value = true
    const { data } = await getBrandList({ pageNo: queryForm.pageNo, pageSize: queryForm.pageSize, name: queryForm.name })
    brandList.value = data.list
    total.value = data.total
    loading.value = false
}

watch([() => queryForm.pageNo, () => queryForm.pageSize], fetchList, { immediate: true })

const dialogVisible = ref(false)
const dialogMode = ref<'add' | 'edit'>('add')
const form = reactive<Brand>({ id: 0, name: '', logo: '', desc: '', status: '启用' })
const formRef = ref()

const rules = {
    name: [{ required: true, message: '请输入品牌名称', trigger: 'blur' }],
    logo: [{ required: true, message: '请上传品牌Logo', trigger: 'change' }],
    desc: [{ required: true, message: '请输入品牌描述', trigger: 'blur' }],
    status: [{ required: true, message: '请选择状态', trigger: 'change' }],
}

function openDialog(mode: 'add' | 'edit', row?: Brand) {
    dialogMode.value = mode
    dialogVisible.value = true
    if (mode === 'edit' && row) {
        Object.assign(form, row)
    } else {
        Object.assign(form, { id: 0, name: '', logo: '', desc: '', status: '启用' })
    }
    nextTick(() => formRef.value?.clearValidate())
}

function submitForm() {
    formRef.value.validate(async (valid: boolean) => {
        if (!valid) return
        await doBrandEdit(form)
        $baseMessage(dialogMode.value === 'add' ? '添加成功' : '编辑成功', 'success', 'hey')
        dialogVisible.value = false
        fetchList()
    })
}

async function deleteBrand(id: number) {
    await doBrandDelete({ id })
    $baseMessage('删除成功', 'success', 'hey')
    // 删除后如果当前页没数据自动跳到上一页
    if (brandList.value.length === 1 && queryForm.pageNo > 1) {
        queryForm.pageNo--
    } else {
        fetchList()
    }
}

function beforeUpload(file: File) {
    const isImage = file.type.startsWith('image/')
    if (!isImage) ElMessage.error('只能上传图片文件')
    return isImage
}

function handleLogoChange(file: any) {
    // 只做本地预览
    const reader = new FileReader()
    reader.addEventListener('load', (e) => {
        form.logo = e.target?.result as string
    })
    reader.readAsDataURL(file.raw)
}

function handleSizeChange(val: number) {
    queryForm.pageNo = 1
    queryForm.pageSize = val
    fetchList()
}
function handleCurrentChange(val: number) {
    queryForm.pageNo = val
    fetchList()
}

function handleSearch() {
    queryForm.pageNo = 1
    fetchList()
}
</script>

<style scoped>
.goods-brand-container {
    padding: 24px;
}
.brand-logo-upload {
    width: 100%;
}
.logo-preview {
    display: flex;
    gap: 10px;
    align-items: center;
    margin-top: 10px;
}
.logo-preview img {
    width: 48px;
    height: 48px;
    object-fit: contain;
    border: 1px solid #eee;
    border-radius: 6px;
}
</style>
