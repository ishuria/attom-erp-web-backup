<template>
  <div>
    <vab-dialog v-model="visible" title="文件上传" width="20%">
      <el-table border :data="siteList" :header-cell-style="{ textAlign: 'center' }" stripe>
        <el-table-column align="center" label="站点" prop="label" />
        <el-table-column align="center" label="SP-ST-Share">
          <template #default="{ row }">
            <!-- <el-upload v-model:file-list="fileList" class="upload-demo" :http-request="uploadExcelFile" :limit="1" :show-file-list="false">
              <el-button type="primary" underline="never">上传</el-button>
            </el-upload> -->
          </template>
        </el-table-column>
      </el-table>
    </vab-dialog>
  </div>
</template>

<script lang="ts" setup>
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
</script>

<style lang="scss" scoped></style>
