<template>
  <div>
    <vab-dialog v-model="visible" title="SP-ST-Share 文件上传" top="7vh" width="20%">
      <el-form style="margin-bottom: 20px">
        <el-form-item label="目标ACOS">
          <el-input v-model="initialAcos" placeholder="请输入目标ACOS" style="width: 100%" type="number" @change="handleAcosChange">
            <template #append>%</template>
          </el-input>
        </el-form-item>
      </el-form>
      <el-table border :data="siteList" :header-cell-style="{ textAlign: 'center' }" stripe>
        <el-table-column align="center" label="站点" prop="label" width="150" />
        <el-table-column align="center" label="SP-ST-Share">
          <template #default="{ row }">
            <el-button plain type="primary" @click="openUploadDialog(row)">上传</el-button>
          </template>
        </el-table-column>
      </el-table>
      <template #footer>
        <div style="text-align: center">
          <el-button @click="handleCancel">关闭</el-button>
          <el-button :loading="uploadLoading" type="primary" @click="handleCalculate">确定</el-button>
        </div>
      </template>
    </vab-dialog>

    <!-- 上传文件弹窗 -->
    <vab-dialog v-model="uploadDialogVisible" :title="`${currentSite?.label || ''} - 文件上传`" width="30%">
      <el-upload v-model:file-list="currentFileList" :auto-upload="false" class="upload-demo" drag multiple>
        <el-icon class="el-icon--upload"><upload-filled /></el-icon>
        <div class="el-upload__text">
          将文件拖拽至此处或
          <em>点击上传</em>
        </div>
      </el-upload>

      <template #footer>
        <div style="text-align: center">
          <el-button @click="closeUploadDialog">取消</el-button>
          <el-button :loading="uploadLoading" type="primary" @click="handleUploadConfirm">确定上传</el-button>
        </div>
      </template>
    </vab-dialog>
  </div>
</template>

<script lang="ts" setup>
import { UploadFilled } from '@element-plus/icons-vue'
import type { UploadFiles } from 'element-plus'
import { calculateSpAds, queryInitialAcos, updateInitialAcos, uploadSpFile } from '/@/api/devlocal/productAnalysis'
defineOptions({
  name: 'SpFileUpload',
})

interface IProps {
  siteList: { label: string; id: number }[]
}
const props = withDefaults(defineProps<IProps>(), {
  siteList: () => [],
})

const visible = defineModel<boolean>('visible', {
  required: true,
})

// 上传弹窗相关
const uploadDialogVisible = ref<boolean>(false)
const currentSite = ref<{ label: string; id: number } | null>(null)
const currentFileList = ref<UploadFiles>([])

// 上传加载状态
const uploadLoading = ref<boolean>(false)

// 初始ACOS
const initialAcos = ref<string>('')

// 监听弹窗打开，查询初始ACOS值
watch(
  () => visible.value,
  async (val) => {
    if (val) {
      await fetchInitialAcos()
    }
  }
)

// 查询初始ACOS
const fetchInitialAcos = async () => {
  try {
    const { data } = await queryInitialAcos()
    if (data !== null && data !== undefined) {
      initialAcos.value = String(data)
    }
  } catch (error) {
    console.error('查询初始ACOS失败:', error)
  }
}

// 处理ACOS输入框变化
const handleAcosChange = async (value: string) => {
  if (!value || value.trim() === '') {
    return
  }
  const acosValue = parseFloat(value)
  if (!isNaN(acosValue)) {
    try {
      const { data } = await updateInitialAcos(acosValue)
      if (data) {
        $baseMessage('更新目标ACOS成功', 'success')
      }
    } catch (error) {
      console.error('更新目标ACOS失败:', error)
      $baseMessage('更新目标ACOS失败，请重试', 'error')
    }
  }
}

// 打开上传弹窗
const openUploadDialog = (row: { label: string; id: number }) => {
  currentSite.value = row
  uploadDialogVisible.value = true
}

// 关闭上传弹窗
const closeUploadDialog = () => {
  uploadDialogVisible.value = false
  currentSite.value = null
  currentFileList.value = []
}

// 取消主弹窗
const handleCancel = () => {
  visible.value = false
}

// 确定上传（上传弹窗中的确定按钮）
const handleUploadConfirm = async () => {
  if (currentFileList.value.length === 0) {
    $baseMessage('请至少选择一个文件', 'warning')
    return
  }

  uploadLoading.value = true
  try {
    const formData = new FormData()
    formData.append('siteId', currentSite.value?.id.toString() || '0')
    // 添加多个文件
    currentFileList.value.forEach((file) => {
      formData.append('files', file.raw as Blob)
    })

    const { data } = await uploadSpFile(formData)
    // 先关闭弹窗，提升用户体验
    closeUploadDialog()
    if (data) {
      $baseMessage('上传成功', 'success')
    }
  } catch (error) {
    console.error('上传失败:', error)
    $baseMessage('上传失败，请重试', 'error')
  } finally {
    uploadLoading.value = false
  }
}
const handleCalculate = async () => {
  try {
    uploadLoading.value = true
    const { data } = await calculateSpAds()
    if (data) {
      $baseMessage('计算成功', 'success')
      visible.value = false
    }
  } catch (error) {
    console.error('计算失败:', error)
    $baseMessage('计算失败，请重试', 'error')
  } finally {
    uploadLoading.value = false
  }
}
</script>

<style lang="scss" scoped>
.upload-demo {
  width: 100%;
  margin-bottom: 20px;

  :deep(.el-upload) {
    width: 100%;
  }

  :deep(.el-upload-dragger) {
    width: 100%;
  }
}

.file-list {
  margin-top: 20px;
  padding: 15px;
  background-color: var(--el-fill-color-lighter);
  border-radius: 4px;

  .file-list-title {
    margin-bottom: 10px;
    font-size: 14px;
    font-weight: 600;
    color: var(--el-text-color-primary);
  }

  .file-item {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px;
    margin-bottom: 8px;
    background-color: var(--el-bg-color);
    border-radius: 4px;
    transition: background-color 0.3s;

    &:hover {
      background-color: var(--el-fill-color);
    }

    &:last-child {
      margin-bottom: 0;
    }

    .el-icon {
      color: var(--el-color-primary);
      font-size: 18px;
    }

    .file-name {
      flex: 1;
      font-size: 14px;
      color: var(--el-text-color-primary);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .file-size {
      font-size: 12px;
      color: var(--el-text-color-secondary);
    }
  }
}
</style>
