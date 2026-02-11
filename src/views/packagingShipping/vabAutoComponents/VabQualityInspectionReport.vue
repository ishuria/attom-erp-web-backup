<template>
  <div>
    <!-- 质检报告 -->
    <vab-dialog
      v-model="visible"
      class="custom-dialog"
      :draggable="false"
      title="新品质检报告"
      top="3vh"
      width="50%"
      @close="closeQualityInspection"
    >
      <el-form
        ref="qualityInspectionFormRef"
        :inline="true"
        :model="qualityInspectionForm"
        require-asterisk-position="right"
        :rules="qualityInspectionFormRules"
        style="margin-right: 20px; margin-left: 20px"
      >
        <el-divider style="margin-top: 0"><span style="font-size: var(--el-font-size-base)">基础信息</span></el-divider>
        <el-row justify="space-between" style="width: 100%">
          <el-col :span="8">
            <el-form-item label="日期" style="min-width: 95%">
              <el-input v-model="qualityInspectionForm.date" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="产品经理" style="min-width: 95%">
              <el-input v-model="qualityInspectionForm.productManager" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="PO" style="min-width: 100%">
              <el-select
                v-model="qualityInspectionForm.poList"
                collapse-tags
                collapse-tags-tooltip
                :max-collapse-tags="3"
                multiple
                placeholder="请选择合并质检PO"
                @change="handleUpdateInspection"
              >
                <el-option v-for="item in poOption" :key="item" :label="item" :value="item" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row justify="space-between" style="width: 100%">
          <el-col :span="8">
            <el-form-item label="SKU" prop="sku" style="min-width: 95%">
              <el-input v-model="qualityInspectionForm.sku" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="16">
            <el-form-item label="产品名称" prop="productName" style="min-width: 100%">
              <el-input v-model="qualityInspectionForm.productName" disabled />
            </el-form-item>
          </el-col>
        </el-row>
        <el-divider style="margin-top: 10px"><span style="font-size: var(--el-font-size-base)">信息完善</span></el-divider>
        <el-row justify="space-between" style="width: 100%">
          <el-col :span="16" :xs="24">
            <el-form-item inline label="包装尺寸" prop="packingSize" style="min-width: 95%">
              <el-row class="packing-size-row">
                <el-input
                  v-model.trim="qualityInspectionForm.packageLength"
                  class="packing-size-input"
                  placeholder="长"
                  @change="handleUpdateInspection"
                >
                  <template #suffix>
                    <el-icon class="el-input__icon" style="font-style: normal">cm</el-icon>
                  </template>
                </el-input>
                <span class="packing-size-sep">×</span>
                <el-input
                  v-model.trim="qualityInspectionForm.packageWidth"
                  class="packing-size-input"
                  placeholder="宽"
                  @change="handleUpdateInspection"
                >
                  <template #suffix>
                    <el-icon class="el-input__icon" style="font-style: normal">cm</el-icon>
                  </template>
                </el-input>
                <span class="packing-size-sep">×</span>
                <el-input
                  v-model.trim="qualityInspectionForm.packageHeight"
                  class="packing-size-input"
                  placeholder="高"
                  @change="handleUpdateInspection"
                >
                  <template #suffix>
                    <el-icon class="el-input__icon" style="font-style: normal">cm</el-icon>
                  </template>
                </el-input>
              </el-row>
            </el-form-item>
          </el-col>
          <el-col :span="8" :xs="24">
            <el-form-item label="包装重量" prop="packageWeight" style="min-width: 100%">
              <el-input v-model.trim="qualityInspectionForm.packageWeight" placeholder="克" @change="handleUpdateInspection">
                <template #suffix>
                  <el-icon class="el-input__icon" style="font-style: normal">g</el-icon>
                </template>
              </el-input>
              <!-- <el-button type="success">更新SKU尺寸重量</el-button> -->
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="" prop="materialComposition" style="margin-bottom: 10px">
          <template #label>
            材质构成（用于报关，需要精确填写）
            <span style="color: var(--el-color-danger)">*</span>
          </template>
          <el-button type="primary" @click="handleShareWeight">次要零件重量均摊</el-button>
        </el-form-item>
        <el-table
          border
          :cell-class-name="clearPadding"
          :cell-style="componentListCellStyle"
          :data="componentList"
          :header-cell-style="{ textAlign: 'center' }"
          stripe
          @cell-click="changeComponentListInput"
        >
          <el-table-column label="图片" prop="componentImgUrl" width="75">
            <template #default="{ row }">
              <el-image
                :src="row.componentImgUrl"
                style="display: block; width: 75px; height: 75px"
                @click="showPreviewImage(row.componentImgUrl)"
              >
                <template #error><el-icon /></template>
              </el-image>
            </template>
          </el-table-column>
          <el-table-column label="零件名" prop="componentName" :width="flexColumnWidth(componentList, '零件名', 'componentName')" />
          <el-table-column label="材质1名称" prop="material1" :width="flexColumnWidth(componentList, '材质1名称 *', 'material1')">
            <template #header>
              材质1名称
              <span style="margin-left: 4px; color: var(--el-color-danger)">*</span>
            </template>
            <template #default="{ row }">
              <div class="none">
                <el-input
                  v-model="row.material1"
                  @blur="clickComponentListCancel($event, row)"
                  @keyup.enter="clickComponentListCancel($event, row)"
                />
              </div>
              <span>{{ row.material1 }}</span>
            </template>
          </el-table-column>
          <el-table-column label="材质1重量(g)" prop="weight1">
            <template #header>
              材质1重量(g)
              <span style="margin-left: 4px; color: var(--el-color-danger)">*</span>
            </template>
            <template #default="{ row }">
              <div class="none">
                <el-input
                  v-model="row.weight1"
                  @blur="clickComponentListCancel($event, row)"
                  @keyup.enter="clickComponentListCancel($event, row)"
                />
              </div>
              <span>{{ row.weight1 }}</span>
            </template>
          </el-table-column>
          <el-table-column label="材质2名称" prop="material2" :width="flexColumnWidth(componentList, '材质2名称', 'material2')">
            <template #default="{ row }">
              <div class="none">
                <el-input
                  v-model="row.material2"
                  @blur="clickComponentListCancel($event, row)"
                  @keyup.enter="clickComponentListCancel($event, row)"
                />
              </div>
              <span>{{ row.material2 }}</span>
            </template>
          </el-table-column>
          <el-table-column label="材质2重量(g)" prop="weight2">
            <template #default="{ row }">
              <div class="none">
                <el-input
                  v-model="row.weight2"
                  @blur="clickComponentListCancel($event, row)"
                  @keyup.enter="clickComponentListCancel($event, row)"
                />
              </div>
              <span>{{ row.weight2 }}</span>
            </template>
          </el-table-column>
          <el-table-column label="材质3名称" prop="material3" :width="flexColumnWidth(componentList, '材质3名称', 'material3')">
            <template #default="{ row }">
              <div class="none">
                <el-input
                  v-model="row.material3"
                  @blur="clickComponentListCancel($event, row)"
                  @keyup.enter="clickComponentListCancel($event, row)"
                />
              </div>
              <span>{{ row.material3 }}</span>
            </template>
          </el-table-column>
          <el-table-column label="材质3重量(g)" prop="weight3">
            <template #default="{ row }">
              <div class="none">
                <el-input
                  v-model="row.weight3"
                  @blur="clickComponentListCancel($event, row)"
                  @keyup.enter="clickComponentListCancel($event, row)"
                />
              </div>
              <span>{{ row.weight3 }}</span>
            </template>
          </el-table-column>
          <el-table-column label="材质4名称" prop="material4" :width="flexColumnWidth(componentList, '材质4名称', 'material4')">
            <template #default="{ row }">
              <div class="none">
                <el-input
                  v-model="row.material4"
                  @blur="clickComponentListCancel($event, row)"
                  @keyup.enter="clickComponentListCancel($event, row)"
                />
              </div>
              <span>{{ row.material4 }}</span>
            </template>
          </el-table-column>
          <el-table-column label="材质4重量(g)" prop="weight4">
            <template #default="{ row }">
              <div class="none">
                <el-input
                  v-model="row.weight4"
                  @blur="clickComponentListCancel($event, row)"
                  @keyup.enter="clickComponentListCancel($event, row)"
                />
              </div>
              <span>{{ row.weight4 }}</span>
            </template>
          </el-table-column>
        </el-table>
        <el-divider style="margin-top: 30px"><span style="font-size: var(--el-font-size-base)">质检结果</span></el-divider>
        <vab-query-form>
          <vab-query-form-left-panel>
            <el-button type="primary" @click="showPrecautions">修改SKU质检项</el-button>
          </vab-query-form-left-panel>
        </vab-query-form>
        <el-table
          border
          :cell-style="qualityInspectionCellStyle"
          :data="reportDetailList"
          :header-cell-style="{ textAlign: 'center' }"
          stripe
          @cell-click="changeQualityInspectionInput"
        >
          <el-table-column label="质检项目" min-width="330" prop="qualityInspection" />
          <el-table-column label="检查类型" min-width="100" prop="type" />
          <el-table-column label="质检站点" min-width="130" prop="site" />
          <el-table-column label="通过" min-width="50" prop="pass">
            <template #default="{ row }">
              <el-checkbox v-model="row.pass" :false-value="0" :true-value="1" @change="handleUpdatePackageInspectionPass(row)" />
            </template>
          </el-table-column>
          <el-table-column label="备注" min-width="150" prop="remark">
            <template #default="{ row }">
              <div class="none">
                <el-input
                  v-model="row.remark"
                  @blur="clickQualityInspectionCancel($event, row)"
                  @keyup.enter="clickQualityInspectionCancel($event, row)"
                />
              </div>
              <span>{{ row.remark }}</span>
            </template>
          </el-table-column>
        </el-table>
      </el-form>

      <el-form
        ref="inspectionResultsFormRef"
        label-position="left"
        label-width="auto"
        :model="inspectionResultsForm"
        require-asterisk-position="right"
        :rules="inspectionResultsFormRules"
        style="margin: 20px 20px 0 20px"
      >
        <!-- 一条龙拍摄按钮 -->
        <div style="margin-bottom: 20px">
          <el-button type="success" @click="startOneStopPhotoSession">
            <vab-icon icon="camera-line" />
            一条龙质检图片拍摄
          </el-button>
        </div>

        <el-form-item label="基础图片" style="margin-bottom: 50px" validate-position="right">
          <template #label>
            基础图片
            <span style="margin-left: 4px; color: var(--el-color-danger)">*</span>
          </template>
          <div style="display: flex; flex-wrap: wrap; gap: 40px 20px">
            <div v-for="(item, index) in basePictureImgList" :key="item.id || `base-${item.sort}`" class="image-cell">
              <!-- 有图片时显示 -->
              <div v-if="item.imgUrl" class="image-preview">
                <img alt="" :src="item.imgUrl" />
                <div class="image-actions">
                  <el-icon @click="showPreviewImage(item.imgUrl)"><zoom-in /></el-icon>
                  <el-icon @click="handleBaseImageRemove(item.id, item.sort)"><delete /></el-icon>
                </div>
              </div>
              <!-- 无图片时显示 -->
              <div v-else class="upload-placeholder" @click="showBaseUploadDialog(item.sort)">
                <el-icon><plus /></el-icon>
              </div>
              <div class="image-text">
                <div class="title">{{ item.title }}</div>
                <div class="desc">{{ item.desc }}</div>
              </div>
            </div>
          </div>
        </el-form-item>
        <el-form-item label="零件细节">
          <template #label>
            <el-tooltip content="" effect="dark" placement="top">
              <div class="questionIcon">
                零件细节
                <el-icon><question-filled /></el-icon>
                <span style="margin-left: 4px; color: var(--el-color-danger)">*</span>
              </div>
              <template #content>
                <div class="custom-tooltip">展示产品局部细节，重要技术参数细节(尺寸/厚度/重量/粘接处/焊接处/贴边处/表面处理等)</div>
              </template>
            </el-tooltip>
          </template>
          <div style="display: flex; flex-wrap: wrap">
            <!-- 图片预览部分 -->
            <div v-for="(item, index) in componentDetailImgList" :key="index" class="image-cell" style="margin-right: 20px">
              <div v-if="item.imgUrl" class="image-preview">
                <img alt="" :src="item.imgUrl" />
                <div class="image-actions">
                  <el-icon @click="showPreviewImage(item.imgUrl)"><zoom-in /></el-icon>
                  <el-icon @click="handleImageRemove(item.id, index, 1)"><delete /></el-icon>
                </div>
              </div>
            </div>
            <!-- 上传按钮部分 - 始终显示 -->
            <div class="image-cell">
              <div class="upload-placeholder" @click="showUploadDialog(1, 0)">
                <el-icon><plus /></el-icon>
              </div>
            </div>
          </div>
        </el-form-item>
        <el-form-item label="成品组装图">
          <template #label>
            <el-tooltip content="" effect="dark" placement="top">
              <div class="questionIcon">
                成品组装图
                <el-icon><question-filled /></el-icon>
                <span style="margin-left: 4px; color: var(--el-color-danger)">*</span>
              </div>
              <template #content>
                <div class="custom-tooltip">展示产品组装后的图片，多角度拍摄(包含整体正面、侧面、背面、顶部等)</div>
              </template>
            </el-tooltip>
          </template>
          <div style="display: flex; flex-wrap: wrap">
            <!-- 图片预览部分 -->
            <div v-for="(item, index) in finishedImgList" :key="index" class="image-cell" style="margin-right: 20px">
              <div v-if="item.imgUrl" class="image-preview">
                <img alt="" :src="item.imgUrl" />
                <div class="image-actions">
                  <el-icon @click="showPreviewImage(item.imgUrl)"><zoom-in /></el-icon>
                  <el-icon @click="handleImageRemove(item.id, index, 2)"><delete /></el-icon>
                </div>
              </div>
            </div>
            <!-- 上传按钮部分 - 始终显示 -->
            <div class="image-cell">
              <div class="upload-placeholder" @click="showUploadDialog(2, 0)">
                <el-icon><plus /></el-icon>
              </div>
            </div>
          </div>
        </el-form-item>
        <el-form-item label="其他图片">
          <div style="display: flex; flex-wrap: wrap">
            <!-- 图片预览部分 -->
            <div v-for="(item, index) in otherImgList" :key="index" class="image-cell" style="margin-right: 20px">
              <div v-if="item.imgUrl" class="image-preview">
                <img alt="" :src="item.imgUrl" />
                <div class="image-actions">
                  <el-icon @click="showPreviewImage(item.imgUrl)"><zoom-in /></el-icon>
                  <el-icon @click="handleImageRemove(item.id, index, 3)"><delete /></el-icon>
                </div>
              </div>
            </div>
            <!-- 上传按钮部分 - 始终显示 -->
            <div class="image-cell">
              <div class="upload-placeholder" @click="showUploadDialog(3, 0)">
                <el-icon><plus /></el-icon>
              </div>
            </div>
          </div>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <template #label>
            <span style="margin-right: 6px">备注</span>
          </template>
          <el-input
            v-model="inspectionResultsForm.remark"
            placeholder="请输入备注"
            resize="none"
            :rows="2"
            type="textarea"
            @change="handleUpdateInspection"
          />
        </el-form-item>
        <el-form-item label="质检打包数" prop="packageCount">
          <el-input
            v-model.trim="inspectionResultsForm.packageCount"
            clearable
            placeholder="产品经理打包套数"
            style="min-width: 100%"
            @change="handleUpdateInspection"
          />
        </el-form-item>
        <el-form-item label="结论" prop="status">
          <el-radio-group v-model="inspectionResultsForm.status" @change="handleUpdateInspection">
            <el-radio :value="1">通过</el-radio>
            <el-radio :value="0">不通过</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="inspectionResultsForm.status === 0" label="原因" prop="reason">
          <el-input
            v-model="inspectionResultsForm.reason"
            clearable
            placeholder="质检不通过的原因"
            style="min-width: 100%"
            @change="handleUpdateInspection"
          />
        </el-form-item>
        <el-form-item v-if="inspectionResultsForm.status === 0" label="处理方式" prop="processingMethod">
          <el-input
            v-model="inspectionResultsForm.processingMethod"
            clearable
            placeholder="整批售后、打包全检、部分售后等"
            style="min-width: 100%"
            @change="handleUpdateInspection"
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <div style="margin-right: 20px">
          <el-button type="warning" @click="visible = false">退出</el-button>
          <el-button type="success" @click="downloadInspection">下载</el-button>
          <el-button type="success" @click="handleSubmitInspection">提交</el-button>
        </div>
      </template>
    </vab-dialog>
    <el-image-viewer v-if="imagePreviewVisible" hide-on-click-modal :url-list="imagePreviewList" @close="imagePreviewClose" />
    <!-- 上传图片 -->
    <vab-image-upload v-model="imageUploadVisible" @image-upload="uploadImage" />
    <!-- 一条龙质检图片拍摄 -->
    <vab-one-stop-photo-dialog
      v-model="oneStopPhotoVisible"
      :base-picture-img-list="basePictureImgList"
      :component-detail-img-list="componentDetailImgList"
      :finished-img-list="finishedImgList"
      :initial-type="oneStopPhotoInitialType"
      :other-img-list="otherImgList"
      :report-id="reportId"
      @photo-uploaded="handlePhotoUploaded"
    />
    <!-- 打包注意事项 -->
    <vab-packing-precautions v-model="precautionsVisible" :sku-id="props.skuId" @update:model-value="handleUpdateData" />
  </div>
</template>

<script lang="ts" setup>
import { Delete, Plus, QuestionFilled, ZoomIn } from '@element-plus/icons-vue'
import type { FormInstance } from 'element-plus'
import { isEqual } from 'lodash-es'
import type { CSSProperties } from 'vue'
import { downloadFile } from '/@/api/devlocal/download'
import {
  deletePackageInspectionImage,
  getNewPackageInspection,
  submitPackageInspection,
  updateNewPackageInspection,
  updatePackageInspectionComponent,
  updatePackageInspectionDetail,
  uploadPackageInspectionImage,
} from '/@/api/devlocal/packagingShipping'
import type { IComponentList, PictureImgList, ReportDetailList } from '/@/type/packagingShipping/packagingType'
import { focusAndSelectInput, getRootElement } from '/@/utils/nodeUtils'
import { flexColumnWidth } from '/@/utils/tableColum'

defineOptions({
  name: 'VabQualityInspectionReport',
})

const props = defineProps<{
  modelValue: boolean
  sku: string
  skuId: number
}>()
const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()
const visible = computed({
  get() {
    return props.modelValue
  },
  set(val) {
    emit('update:modelValue', val)
  },
})
watch(
  () => props.modelValue,
  (val) => {
    if (val) {
      fetchData()
    }
  }
)
const handleUpdateData = (val: boolean) => {
  if (val === false) {
    console.log(1)
    fetchData()
  }
}
const precautionsVisible = ref<boolean>(false)
// 一条龙拍摄相关
const oneStopPhotoVisible = ref<boolean>(false)
const oneStopPhotoInitialType = ref<number | undefined>(undefined)
const componentList = ref<IComponentList[]>([])
const reportDetailList = ref<ReportDetailList[]>([])
const poOption = ref<string[]>([])
const basePictureImgList = ref<any[]>([])
const componentDetailImgList = ref<PictureImgList[]>([])
const finishedImgList = ref<PictureImgList[]>([])
const otherImgList = ref<PictureImgList[]>([])
// 图片上传type 0基础图片 1零件细节 2 成品组装图片 3其他图片
const imageUploadType = ref<number>(0)
// 图片上传存储 reportId
const reportId = ref<number>(0)
// 基础图片点击上传的第几个
const imageUploadIndex = ref<number>(0)
const imagePreviewVisible = ref(false)
const imagePreviewList = ref<string[]>([])
const imageUploadVisible = ref(false)
const qualityInspectionForm = reactive<any>({})
const qualityInspectionFormRef = ref<FormInstance>()

const handleShareWeight = async () => {
  if (!qualityInspectionForm.packageWeight) {
    $baseMessage('请先填写包装重量', 'error')
    return
  }
  // 1. 先判断零件的材质1名称是否都已填
  const hasEmptyMaterial = componentList.value.some((item) => !item.material1)
  if (hasEmptyMaterial) {
    $baseMessage('每个零件的 材质1名称 都填写了，才能进行均摊操作', 'error')
    return
  }
  // 2. 找材质名称填了的，但是重量没填的
  let count = 0
  componentList.value.forEach((item) => {
    if (item.material1 && !item.weight1) {
      count++
    }
    if (item.material2 && !item.weight2) {
      count++
    }
    if (item.material3 && !item.weight3) {
      count++
    }
    if (item.material4 && !item.weight4) {
      count++
    }
  })
  if (count === 0) {
    $baseMessage('每个零件的重量都已填写，没有零件可以进行均摊', 'error')
    return
  }
  // 3. 计算已填入的重量
  const totalWeight = componentList.value.reduce(
    (acc, item) => acc + Number(item.weight1 || 0) + Number(item.weight2 || 0) + Number(item.weight3 || 0) + Number(item.weight4 || 0),
    0
  )
  // 4. 比较 已填入的重量 和 0.8 * sku的包装重量，如果已填入的重量小于 0.8 * sku的包装重量，则无法进行均摊
  if (totalWeight < 0.8 * qualityInspectionForm.packageWeight) {
    $baseMessage('已填入的重量小于 sku的包装重量的80%，无法进行均摊', 'error')
    return
  }
  // 5. 满足条件后，获取差值，找到零件的材质名称填了但是重量没填的零件，有几个重量没填就均摊几个
  const diff = qualityInspectionForm.packageWeight - totalWeight
  const diffWeight = Number((diff / count).toFixed(2))
  for (const item of componentList.value) {
    if (item.material1 && !item.weight1) {
      item.weight1 = diffWeight
    }
    if (item.material2 && !item.weight2) {
      item.weight2 = diffWeight
    }
    if (item.material3 && !item.weight3) {
      item.weight3 = diffWeight
    }
    if (item.material4 && !item.weight4) {
      item.weight4 = diffWeight
    }
    await updatePackageInspectionComponent(item)
  }
  $baseMessage('均摊成功', 'success')
}

const showPrecautions = () => {
  precautionsVisible.value = true
}

// 一条龙拍摄功能
const startOneStopPhotoSession = () => {
  oneStopPhotoVisible.value = true
}

// 监听对话框关闭，重置 initialType
watch(oneStopPhotoVisible, (val) => {
  if (!val) {
    oneStopPhotoInitialType.value = undefined
  }
})

// 处理照片上传事件
const handlePhotoUploaded = (data: { type: number; sort: number; imgData: any }) => {
  const { type, sort, imgData } = data

  // 根据类型更新对应的列表
  switch (type) {
    case 0: {
      // 基础图片
      const item = basePictureImgList.value.find((item) => item.sort === sort)
      if (item) {
        item.imgUrl = imgData.imgUrl
        item.id = imgData.id
      }
      break
    }
    case 1: {
      // 零件细节
      componentDetailImgList.value.push({
        ...imgData,
        sort,
      } as any)
      break
    }
    case 2: {
      // 成品组装图
      finishedImgList.value.push({
        ...imgData,
        sort,
      } as any)
      break
    }
    case 3: {
      // 其他图片
      otherImgList.value.push({
        ...imgData,
        sort,
      } as any)
      break
    }
  }
}

const showPreviewImage = (url: string) => {
  imagePreviewVisible.value = true
  imagePreviewList.value = [url]
}
const imagePreviewClose = () => {
  imagePreviewVisible.value = false
}
const closeQualityInspection = () => {
  visible.value = false
}
const inspectionResultsFormRef = ref<FormInstance>()
const inspectionResultsForm = reactive({
  remark: '',
  packageCount: '',
  status: 0,
  reason: '',
  processingMethod: '',
})
const inspectionResultsFormRules = reactive({
  packageCount: [{ required: true, message: '请输入产品经理打包套数', trigger: 'blur' }],
  status: [{ required: true, message: '请选择结论', trigger: 'change' }],
  reason: [
    {
      required: true,
      validator: (rule: any, value: any, callback: any) => {
        if (inspectionResultsForm.status === 0 && !inspectionResultsForm.reason) {
          callback(new Error('请输入原因'))
        } else {
          callback()
        }
      },
      trigger: 'blur',
    },
  ],
  processingMethod: [
    {
      required: true,
      validator: (rule: any, value: any, callback: any) => {
        if (inspectionResultsForm.status === 0 && !inspectionResultsForm.processingMethod) {
          callback(new Error('请输入处理方式'))
        } else {
          callback()
        }
      },
      trigger: 'blur',
    },
  ],
})
const qualityInspectionFormRules = reactive({
  packingSize: [
    {
      validator: (rule: any, value: any, callback: any) => {
        if (!qualityInspectionForm.packageLength || !qualityInspectionForm.packageWidth || !qualityInspectionForm.packageHeight) {
          callback(new Error('请填写完整包装尺寸'))
        } else {
          callback()
        }
      },
      trigger: 'blur',
      required: true,
    },
  ],
  packageWeight: [{ required: true, message: '请输入包装重量', trigger: 'blur' }],
})
// 新品质检修改
const handleUpdateInspection = async () => {
  try {
    await updateNewPackageInspection({
      reportId: reportId.value,
      packageLength: qualityInspectionForm.packageLength,
      packageWidth: qualityInspectionForm.packageWidth,
      packageHeight: qualityInspectionForm.packageHeight,
      packageWeight: qualityInspectionForm.packageWeight,
      packageCount: Number(inspectionResultsForm.packageCount),
      reason: inspectionResultsForm.reason,
      processingMethod: inspectionResultsForm.processingMethod,
      remark: inspectionResultsForm.remark,
      poList: qualityInspectionForm.poList,
      status: inspectionResultsForm.status,
    })
  } catch (error) {
    console.log(error)
  }
}
const uploadImage = async (file: File) => {
  try {
    let uploadImgForm = new FormData() // 每次上传前重置 FormData
    uploadImgForm.append('file', file)
    uploadImgForm.append('reportId', String(reportId.value))
    uploadImgForm.append('type', String(imageUploadType.value))
    uploadImgForm.append('sort', String(imageUploadIndex.value))

    const { data } = await uploadPackageInspectionImage(uploadImgForm)
    if (data) {
      switch (imageUploadType.value) {
        case 0: {
          // 通过 sort 查找对应的项目并更新
          const item = basePictureImgList.value.find((item) => item.sort === imageUploadIndex.value)
          if (item) {
            item.imgUrl = data.imgUrl
            item.id = data.id
          }
          break
        }
        case 1: {
          // 零件细节图片：使用上传时计算的 sort（已在 imageUploadIndex.value 中）
          componentDetailImgList.value.push({
            ...data,
            sort: imageUploadIndex.value, // 使用上传时计算的 sort
          } as any)

          break
        }
        case 2: {
          // 成品组装图片：使用上传时计算的 sort（已在 imageUploadIndex.value 中）
          finishedImgList.value.push({
            ...data,
            sort: imageUploadIndex.value, // 使用上传时计算的 sort
          } as any)

          break
        }
        case 3: {
          // 其他图片：使用上传时计算的 sort（已在 imageUploadIndex.value 中）
          otherImgList.value.push({
            ...data,
            sort: imageUploadIndex.value, // 使用上传时计算的 sort
          } as any)

          break
        }
        // No default
      }
      $baseMessage('图片上传成功！', 'success')
      imageUploadVisible.value = false
    } else {
      $baseMessage('图片上传失败！', 'error')
    }
  } catch (error) {
    console.error(error)
  }
}
// 删除基础图片 - 使用 sort 查找
const handleBaseImageRemove = async (id: number, sort: number) => {
  try {
    $baseConfirm('确定删除图片吗？', null, async () => {
      const { data } = await deletePackageInspectionImage({ id })
      if (data) {
        const item = basePictureImgList.value.find((item) => item.sort === sort)
        if (item) {
          item.imgUrl = ''
          $baseMessage('图片删除成功！', 'success')
        }
      }
    })
  } catch (error) {
    console.error(error)
  }
}

const handleImageRemove = async (id: number, index: number, type: number) => {
  try {
    $baseConfirm('确定删除图片吗？', null, async () => {
      const { data } = await deletePackageInspectionImage({ id })
      if (data) {
        switch (type) {
          case 1: {
            // 通过 id 查找并删除，不依赖 index（因为后端可能按 sort 排序）
            const itemIndex = componentDetailImgList.value.findIndex((item) => item.id === id)
            if (itemIndex !== -1) {
              componentDetailImgList.value.splice(itemIndex, 1)
              $baseMessage('图片删除成功！', 'success')
            }
            break
          }
          case 2: {
            // 通过 id 查找并删除，不依赖 index（因为后端可能按 sort 排序）
            const itemIndex = finishedImgList.value.findIndex((item) => item.id === id)
            if (itemIndex !== -1) {
              finishedImgList.value.splice(itemIndex, 1)
              $baseMessage('图片删除成功！', 'success')
            }
            break
          }
          case 3: {
            // 通过 id 查找并删除其他图片
            const itemIndex = otherImgList.value.findIndex((item) => item.id === id)
            if (itemIndex !== -1) {
              otherImgList.value.splice(itemIndex, 1)
              $baseMessage('图片删除成功！', 'success')
            }
            break
          }
        }
      }
    })
  } catch (error) {
    console.error(error)
  }
}
// 打开基础图片上传弹窗 - 使用 sort
const showBaseUploadDialog = (sort: number) => {
  imageUploadVisible.value = true
  imageUploadType.value = 0
  imageUploadIndex.value = sort
}

// 打开上传图片弹窗
const showUploadDialog = (type: number, index: number) => {
  // 零件细节、成品组装图、其他图片使用一条龙拍摄对话框
  if (type === 1 || type === 2 || type === 3) {
    oneStopPhotoInitialType.value = type // 设置初始类型
    oneStopPhotoVisible.value = true
    return
  }

  imageUploadVisible.value = true
  imageUploadType.value = type
  imageUploadIndex.value = index
}
const validate = async () => {
  try {
    // 校验上面的表单
    const formValid = await qualityInspectionFormRef.value?.validate()
    if (!formValid) return false

    // 校验表格数据
    const hasEmptyMaterial = componentList.value.some((item) => !item.material1 || !item.weight1)
    if (hasEmptyMaterial) {
      $baseMessage('材质1名称和材质1重量(g)不能为空', 'error')
      return false
    }

    // 校验基础图片是否全部上传
    const hasAllBaseImages = basePictureImgList.value.every((item) => item.imgUrl)
    if (!hasAllBaseImages) {
      $baseMessage('请上传完整的基础图片', 'error')
      return false
    }

    // 校验零件细节图片
    if (componentDetailImgList.value.length === 0) {
      $baseMessage('请上传零件细节图片', 'error')
      return false
    }

    // 校验成品组装图片
    if (finishedImgList.value.length === 0) {
      $baseMessage('请上传成品组装图片', 'error')
      return false
    }

    // 校验下面的表单
    const resultsFormValid = await inspectionResultsFormRef.value?.validate()
    if (!resultsFormValid) return false

    return true
  } catch (error) {
    console.error('校验失败:', error)
    return false
  }
}
// 质检报告提交
const handleSubmitInspection = async () => {
  // 校验
  const isValid = await validate()
  if (isValid) {
    const { data } = await submitPackageInspection({
      reportId: reportId.value,
      type: 0,
    })
    if (data) {
      $baseMessage('质检报告提交成功', 'success')
      visible.value = false
    }
  }
}

// 质检报告下载
const downloadInspection = async () => {
  await downloadFile('/package/inspection/download', {
    reportId: reportId.value,
  })
}
let _row1: any
let _row2: any
const changeComponentListInput = async (row: any, column: any, cell: HTMLTableCellElement) => {
  const firstChild = cell?.children[0]?.children[0]
  const secondChild = cell?.children[0]?.children[1]

  if (!firstChild || !secondChild || !firstChild.classList || !secondChild.classList) {
    return
  }

  _row1 = JSON.parse(JSON.stringify(row))

  if (firstChild.classList.contains('none')) {
    firstChild.classList.remove('none')
    secondChild.classList.add('none')

    focusAndSelectInput(cell)
  }
}
// 质检报告修改
const changeQualityInspectionInput = async (row: any, column: any, cell: HTMLTableCellElement) => {
  const firstChild = cell?.children[0]?.children[0]
  const secondChild = cell?.children[0]?.children[1]

  if (!firstChild || !secondChild || !firstChild.classList || !secondChild.classList) {
    return
  }

  _row2 = JSON.parse(JSON.stringify(row))

  if (firstChild.classList.contains('none')) {
    firstChild.classList.remove('none')
    secondChild.classList.add('none')

    focusAndSelectInput(cell)
  }
}
const clickComponentListCancel = async (event: any, value: any) => {
  const rootElement = getRootElement(event.srcElement, '.cell')

  if (rootElement) {
    const t1 = rootElement.children[0]
    const t2 = rootElement.children[1]

    if (t1 && t1.classList[0] !== 'el-select') {
      t1.classList.add('none')
    }
    if (t2) t2.classList.remove('none')
  }
  if (isEqual(_row1, value)) {
    return
  }

  if (event.type === 'blur') {
    try {
      await updatePackageInspectionComponent(value)
    } catch {
      Object.assign(value, _row1)
    }
  }
}
// 质检报告修改输入失焦事件
const clickQualityInspectionCancel = async (event: any, value: any) => {
  const rootElement = getRootElement(event.srcElement, '.cell')

  if (rootElement) {
    const t1 = rootElement.children[0]
    const t2 = rootElement.children[1]

    if (t1 && t1.classList[0] !== 'el-select') {
      t1.classList.add('none')
    }
    if (t2) t2.classList.remove('none')
  }
  if (isEqual(_row2, value)) {
    return
  }

  if (event.type === 'blur') {
    try {
      await updatePackageInspectionDetail({
        id: value.id,
        pass: value.pass,
        remark: value.remark,
      })
    } catch {
      Object.assign(value, _row2)
    }
  }
}
// 质检报告pass修改
const handleUpdatePackageInspectionPass = async (row: any) => {
  await updatePackageInspectionDetail({
    id: row.id,
    pass: row.pass,
    remark: row.remark,
  })
}
const componentListCellStyle = (data: { row: any; column: any; rowIndex: number; columnIndex: number }): CSSProperties => {
  if (data.columnIndex !== 1) {
    return {
      textAlign: 'center',
      cursor: 'pointer',
    }
  }
  return {
    textAlign: 'left',
  }
}
// 质检报告cellStyle
const qualityInspectionCellStyle = (data: { row: any; column: any; rowIndex: number; columnIndex: number }): CSSProperties => {
  const index = data.columnIndex
  if (index === 1 || index === 2 || index === 3) {
    return {
      textAlign: 'center',
    }
  } else if (index === 4) {
    return {
      textAlign: 'left',
      cursor: 'pointer',
    }
  } else {
    return {
      textAlign: 'left',
    }
  }
}
const clearPadding = (data: { row: any; column: any; rowIndex: number; columnIndex: number }) => {
  if (data.columnIndex === 0) {
    return 'clear-padding'
  }
  return ''
}

// 重置所有数据
const resetAllData = () => {
  // 重置图片列表 - 保持标题和描述信息，并添加 sort 字段
  basePictureImgList.value = [
    { title: '产品零件图', desc: '展示所有零件及对应数量', sort: 0 },
    { title: '产品包装图', desc: '展示包装完后的外包装', sort: 1 },
    { title: '包装测量图(长)', desc: '展示实际测量尺的刻度', sort: 2 },
    { title: '包装测量图(宽)', desc: '展示实际测量尺的刻度', sort: 3 },
    { title: '包装测量图(高)', desc: '展示实际测量尺的刻度', sort: 4 },
    { title: '包装测量图(重量)', desc: '展示出称的读数', sort: 5 },
  ]
  componentDetailImgList.value = []
  finishedImgList.value = []
  otherImgList.value = []

  // 重置列表数据
  componentList.value = []
  reportDetailList.value = []
  poOption.value = []

  // 重置报告ID
  reportId.value = 0

  // 重置表单数据
  Object.keys(qualityInspectionForm).forEach((key) => {
    if (typeof qualityInspectionForm[key] === 'string') {
      qualityInspectionForm[key] = ''
    }
  })

  // 重置质检结果表单
  inspectionResultsForm.remark = ''
  inspectionResultsForm.packageCount = ''
  inspectionResultsForm.status = 0
  inspectionResultsForm.reason = ''
  inspectionResultsForm.processingMethod = ''

  // 重置图片相关状态
  imageUploadType.value = 0
  imageUploadIndex.value = 0
  imagePreviewVisible.value = false
  imagePreviewList.value = []
  imageUploadVisible.value = false
}

const fetchData = async () => {
  // 重置所有数据
  resetAllData()

  // 获取质检报告
  const { data } = await getNewPackageInspection({
    sku: props.sku,
  })

  if (data) {
    // 设置报告ID
    reportId.value = data.reportId

    // 处理日期格式
    const processedData = {
      ...data,
      date: data.date ? data.date.split(' ')[0] : '',
    }

    // 处理PO列表 - 过滤空字符串
    if (data.poList && data.poList.length > 0 && data.poList[0] === '') {
      poOption.value = []
      processedData.poList = []
    } else if (data.poList && data.poList.length > 0) {
      const poArray = data.poList[0].split(',').filter((po) => po.trim() !== '')
      if (poArray.length > 0) {
        poOption.value = poArray
        processedData.poList = poArray
      }
    }

    // 处理图片列表 - 按 sort 字段匹配后端数据
    if (data.basePictureImgList && data.basePictureImgList.length > 0) {
      const serverList = data.basePictureImgList as any[]
      basePictureImgList.value = basePictureImgList.value.map((localItem: any) => {
        // 通过 sort 字段查找对应的后端数据
        const serverItem = serverList.find((item: any) => (item as any).sort === localItem.sort)

        if (serverItem) {
          // 找到匹配的后端数据，保留本地的 title 和 desc，更新图片和 id
          return {
            title: localItem.title, // 保留本地的标题
            desc: localItem.desc, // 保留本地的描述
            imgUrl: (serverItem as any).imgUrl || '',
            id: (serverItem as any).id || '',
            sort: (serverItem as any).sort ?? localItem.sort, // 优先使用后端的 sort
          }
        }

        // 如果没有找到匹配的后端数据，保留本地数据
        return {
          ...localItem,
          sort: localItem.sort,
        }
      })
    }

    // 加载零件细节图片 - 后端已按 sort 排序
    componentDetailImgList.value =
      data.componentPictureImgList?.map((item: any) => ({
        imgUrl: item.imgUrl || '',
        id: item.id || '',
        sort: (item as any).sort ?? 0, // 保存 sort 字段
      })) || []

    // 加载成品组装图片 - 后端已按 sort 排序
    finishedImgList.value =
      data.assemblyDrawingPictureImgList?.map((item: any) => ({
        imgUrl: item.imgUrl || '',
        id: item.id || '',
        sort: (item as any).sort ?? 0, // 保存 sort 字段
      })) || []

    // 加载其他图片 - 后端已按 sort 排序
    otherImgList.value =
      (data as any).otherPictureImgList?.map((item: any) => ({
        imgUrl: item.imgUrl || '',
        id: item.id || '',
        sort: (item as any).sort ?? 0, // 保存 sort 字段
      })) || []

    // 设置组件列表和报告详情
    componentList.value = data.componentList || []
    reportDetailList.value = data.reportDetailList || []

    // 更新表单数据
    Object.assign(qualityInspectionForm, processedData)
    Object.assign(inspectionResultsForm, processedData)
  }
}
</script>

<style lang="scss" scoped>
// 图片样式
.image-cell {
  width: 135px;
  height: 135px;

  // 有图片时的样式
  .image-preview {
    position: relative;
    width: 100%;
    height: 100%;

    img {
      width: 100%;
      height: 100%;
      cursor: pointer;
      object-fit: fill;
    }

    .image-actions {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      display: flex;
      gap: 8px;
      align-items: center;
      justify-content: center;
      background: rgba(0, 0, 0, 0);
      opacity: 0;
      transition: all 0.3s ease;

      .el-icon {
        font-size: 20px;
        color: #fff;
        cursor: pointer;

        &:hover {
          transform: scale(1.1);
        }
      }
    }

    &:hover .image-actions {
      background: rgba(0, 0, 0, 0.45); // 悬停时的背景色
      opacity: 1; // 悬停时完全显示
    }
  }
  // 没图片时的样式
  .upload-placeholder {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    cursor: pointer;
    border: 1px dashed var(--el-border-color);

    &:hover {
      border-color: var(--el-color-primary);
      .el-icon {
        color: var(--el-color-primary);
      }
    }

    .el-icon {
      font-size: 20px;
      color: #999;
    }
  }
}
.questionIcon {
  display: flex;
  align-items: center;
  justify-content: center;

  .el-icon {
    margin-left: 3px;
  }
}
.image-text {
  margin-top: 2px;
  line-height: 1.2;
  text-align: center;
  .title {
    font-size: 14px;
  }
  .desc {
    margin-top: 1px;
    font-size: 12px;
    color: #999;
  }
}
.el-checkbox {
  transform: scale(1.3);
}
.none {
  display: none;
}
.el-table :deep(.clear-padding .cell) {
  padding-right: 0px;
  padding-left: 0px;
}
.el-table :deep(.clear-padding) {
  padding-top: 0px;
  padding-bottom: 0px;
}

// 包装尺寸输入框 - 移动端优化
.packing-size-row {
  display: flex;
  gap: 1%;
  align-items: center;
  width: 100%;
  flex-wrap: wrap;

  .packing-size-input {
    flex: 1;
    min-width: 0;
  }

  .packing-size-sep {
    display: inline-block;
    font-size: 1.5em;
    text-align: center;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 8px;
    align-items: stretch;

    .packing-size-input {
      flex: none;
      width: 100%;
      :deep(.el-input__inner) {
        font-size: 16px; // 避免 iOS 自动缩小
        min-height: 44px; // 提升移动端点击区域
      }
    }

    .packing-size-sep {
      display: none;
    }
  }
}
</style>
