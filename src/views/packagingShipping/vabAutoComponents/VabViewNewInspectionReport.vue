<template>
  <!-- 质检报告 -->
  <vab-dialog v-model="visible" class="custom-dialog" :draggable="false" title="新品质检报告" top="3vh" width="50%" @close="closeQualityInspection">
    <el-form
      :inline="true"
      :model="qualityInspectionForm"
      require-asterisk-position="right"
      style="margin-right: 20px; margin-left: 20px"
    >
      <el-divider style="margin-top: 0"><span style="font-size: var(--el-font-size-base);">基础信息</span></el-divider>
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
          <el-form-item label="PO" style="min-width: 100%;">
            <el-select 
              v-model="qualityInspectionForm.poList"   
              collapse-tags
              collapse-tags-tooltip
              disabled
              :max-collapse-tags="3"
              multiple
              placeholder="请选择合并质检PO"
            />
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
          <el-form-item label="产品名称" prop="productName" style="min-width: 100%;">
            <el-input v-model="qualityInspectionForm.productName" disabled />
          </el-form-item>
        </el-col>
      </el-row>
      <el-divider style="margin-top: 10px"><span style="font-size: var(--el-font-size-base);">信息完善</span></el-divider>
      <el-row justify="space-between" style="width: 100%">
        <el-col :span="16">
          <el-form-item inline label="包装尺寸" prop="packingSize" style="min-width: 95%">
            <el-row style="display: flex; gap: 1%; align-items: center; width: 100%">
              <el-input v-model.trim="qualityInspectionForm.packageLength" disabled placeholder="长" style="flex: 1; margin-right: 0">
                <template #suffix>
                  <el-icon class="el-input__icon" style="font-style: normal">cm</el-icon>
                </template>
              </el-input>
              <span style="display: inline-block; font-size: 1.5em; text-align: center">×</span>
              <el-input v-model.trim="qualityInspectionForm.packageWidth" disabled placeholder="宽" style="flex: 1; margin-right: 0">
                <template #suffix>
                  <el-icon class="el-input__icon" style="font-style: normal">cm</el-icon>
                </template>
              </el-input>
              <span style="display: inline-block; font-size: 1.5em; text-align: center">×</span>
              <el-input v-model.trim="qualityInspectionForm.packageHeight" disabled placeholder="高" style="flex: 1; margin-right: 0">
                <template #suffix >
                  <el-icon class="el-input__icon" style="font-style: normal">cm</el-icon>
                </template>
              </el-input>
            </el-row>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="包装重量" prop="packageWeight" style="min-width: 100%">
            <el-input v-model.trim="qualityInspectionForm.packageWeight" disabled placeholder="克">
              <template #suffix >
                <el-icon class="el-input__icon" style="font-style: normal">g</el-icon>
              </template>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="" prop="materialComposition" style="margin-bottom: 10px">
        <template #label>
          材质构成（用于报关，需要精确填写）
        </template>
      </el-form-item>
      <el-table 
        border 
        :cell-class-name="clearPadding"
        :cell-style="componentListCellStyle" 
        :data="componentList"
        :header-cell-style="{ textAlign: 'center' }"
        stripe
      >
        <el-table-column label="图片" prop="componentImgUrl" width="75" >        
          <template #default="{ row }">
            <el-image :src="row.componentImgUrl" style="display: block; width: 75px; height: 75px" @click="showPreviewImage(row.componentImgUrl)">
              <template #error><el-icon /></template>
            </el-image>
          </template>
        </el-table-column>
        <el-table-column label="零件名" prop="componentName" :width="flexColumnWidth(componentList, '零件名', 'componentName')" />
        <el-table-column label="材质1名称" prop="material1" :width="flexColumnWidth(componentList, '材质1名称', 'material1')" />
        <el-table-column label="材质1重量(g)" prop="weight1" />
        <el-table-column label="材质2名称" prop="material2" :width="flexColumnWidth(componentList, '材质2名称', 'material2')" />
        <el-table-column label="材质2重量(g)" prop="weight2" />
        <el-table-column label="材质3名称" prop="material3" :width="flexColumnWidth(componentList, '材质3名称', 'material3')"/>
        <el-table-column label="材质3重量(g)" prop="weight3" />
        <el-table-column label="材质4名称" prop="material4" :width="flexColumnWidth(componentList, '材质4名称', 'material4')"/>
        <el-table-column label="材质4重量(g)" prop="weight4" />
      </el-table>
      <el-divider style="margin-top: 30px"><span style="font-size: var(--el-font-size-base);">质检结果</span></el-divider>
      <!-- <vab-query-form>
        <vab-query-form-left-panel>
          <el-button type="primary" @click="showPrecautions">修改SKU质检项</el-button>
        </vab-query-form-left-panel>
      </vab-query-form> -->
      <el-table
        border
        :cell-style="qualityInspectionCellStyle"
        :data="reportDetailList"
        :header-cell-style="{ textAlign: 'center' }"
        stripe
      >
        <el-table-column label="质检项目" min-width="330" prop="qualityInspection" />
        <el-table-column label="检查类型" min-width="100" prop="type" />
        <el-table-column label="质检站点" min-width="130" prop="site" />
        <el-table-column label="通过" min-width="50" prop="pass">
          <template #default="{ row }">
            <el-checkbox v-model="row.pass" disabled :false-value="0" :true-value="1" />
          </template>
        </el-table-column>
        <el-table-column label="备注" min-width="150" prop="remark" />
      </el-table>
    </el-form>
    
    <el-form 
      label-position="left" 
      label-width="auto" 
      require-asterisk-position="right" 
      style="margin: 20px 20px 0 20px"
    >
      <el-form-item label="基础图片" style="margin-bottom: 50px" validate-position="right">
        <div style="display: flex; flex-wrap: wrap; gap: 40px 20px">
          <div v-for="(item, index) in basePictureImgList" :key="index" class="image-cell" >
            <!-- 有图片时显示 -->
            <div v-if="item.imgUrl" class="image-preview">
              <img alt="" :src="item.imgUrl" />
              <div class="image-actions">
                <el-icon @click="showPreviewImage(item.imgUrl)"><zoom-in /></el-icon>
              </div>
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
            <div class="questionIcon">零件细节<el-icon><question-filled /></el-icon></div>
            <template #content>
              <div class="custom-tooltip">展示产品局部细节，重要技术参数细节(尺寸/厚度/重量/粘接处/焊接处/贴边处/表面处理等)</div>
            </template>
          </el-tooltip>
        </template>
        <div style="display: flex; flex-wrap: wrap;">
          <!-- 图片预览部分 -->
          <div v-for="(item, index) in componentDetailImgList" :key="index" class="image-cell" style="margin-right: 20px">
            <div v-if="item.imgUrl" class="image-preview">
              <img alt="" :src="item.imgUrl" />
              <div class="image-actions">
                <el-icon @click="showPreviewImage(item.imgUrl)"><zoom-in /></el-icon>
              </div>
            </div>
          </div>
        </div>
      </el-form-item>
      <el-form-item label="成品组装图">
        <template #label>
          <el-tooltip content="" effect="dark" placement="top">
            <div class="questionIcon">成品组装图<el-icon><question-filled /></el-icon></div>
            <template #content>
              <div class="custom-tooltip">展示产品组装后的图片，多角度拍摄(包含整体正面、侧面、背面、顶部等)</div>
            </template>
          </el-tooltip>
        </template>
        <div style="display: flex; flex-wrap: wrap;">
          <!-- 图片预览部分 -->
          <div v-for="(item, index) in finishedImgList" :key="index" class="image-cell" style="margin-right: 20px">
            <div v-if="item.imgUrl" class="image-preview">
              <img alt="" :src="item.imgUrl" />
              <div class="image-actions">
                <el-icon @click="showPreviewImage(item.imgUrl)"><zoom-in /></el-icon>
              </div>
            </div>
          </div>
        </div>
      </el-form-item>
      <el-form-item label="备注" prop="remark" >
        <template #label>
          <span style="margin-right: 6px">备注</span>
        </template>
        <el-input v-model="qualityInspectionForm.remark" disabled placeholder="请输入备注" resize="none" :rows="2" type="textarea"/>
      </el-form-item>
      <el-form-item label="质检打包数" prop="packageCount" >
        <el-input v-model.trim="qualityInspectionForm.packageCount" clearable disabled placeholder="产品经理打包套数" style="min-width: 100%"/>
      </el-form-item>
      <el-form-item label="结论" prop="status" >
        <el-radio-group v-model="qualityInspectionForm.status" disabled>
          <el-radio :value="1" >通过</el-radio>
          <el-radio :value="0" >不通过</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-if="qualityInspectionForm.status" label="原因" prop="reason"  >
        <el-input v-model="qualityInspectionForm.reason"  clearable disabled placeholder="质检不通过的原因" style="min-width: 100%"/>
      </el-form-item>
      <el-form-item v-if="qualityInspectionForm.status" label="处理方式" prop="processingMethod" >
        <el-input v-model="qualityInspectionForm.processingMethod" clearable disabled placeholder="整批售后、打包全检、部分售后等"  style="min-width: 100%"/>
      </el-form-item>
    </el-form>
    
    <template #footer>
      <!-- <div style="margin-right: 20px">
        <el-button type="warning" @click="closeQualityInspection">取消</el-button>
      </div> -->
    </template>
  </vab-dialog>
  <el-image-viewer v-if="imagePreviewVisible" hide-on-click-modal :url-list="imagePreviewList" @close="imagePreviewClose" />
</template>

<script lang="ts" setup>
import { QuestionFilled, ZoomIn } from '@element-plus/icons-vue'
import type { CSSProperties } from 'vue'
import type { IComponentList, PictureImgList, ReportDetailList } from '/@/type/packagingShipping/packagingType'
import { flexColumnWidth } from '/@/utils/tableColum'

defineOptions({
  name: 'VabViewNewInspectionReport',
})

const props = defineProps<{
  modelValue: boolean
  reportData: any
}>()
const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()
const visible = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  }
})
watch(() => props.modelValue, (value) => {
  if (value) {
    initData()
  }
})
const initData = () => {
  console.log(props.reportData)
  Object.assign(qualityInspectionForm, props.reportData)
  componentList.value = props.reportData.componentList
  reportDetailList.value = props.reportData.reportDetailList
  
  qualityInspectionForm.date = qualityInspectionForm.date ? qualityInspectionForm.date.split(' ')[0] : ''
  qualityInspectionForm.poList = qualityInspectionForm.poList[0].split(',')
  qualityInspectionForm.basePictureImgList.forEach((item: any, index: number) => {
    if (item.imgUrl) {
      basePictureImgList.value[index].imgUrl = item.imgUrl
      basePictureImgList.value[index].id = item.id
    }
  })
  componentDetailImgList.value = props.reportData.componentPictureImgList
  finishedImgList.value = props.reportData.assemblyDrawingPictureImgList
}

const imagePreviewVisible = ref<boolean>(false)
const imagePreviewList = ref<string[]>([])
const componentList = ref<IComponentList[]>([])
const reportDetailList = ref<ReportDetailList[]>([])
const basePictureImgList = ref<any[]>([
  { title: '产品零件图', desc: '展示所有零件及对应数量' },
  { title: '产品包装图', desc: '展示包装完后的外包装' },
  { title: '包装测量图(长)', desc: '展示实际测量尺的刻度' },
  { title: '包装测量图(宽)', desc: '展示实际测量尺的刻度' },
  { title: '包装测量图(高)', desc: '展示实际测量尺的刻度' },
  { title: '包装测量图(重量)', desc: '展示出称的读数' }
])
const componentDetailImgList = ref<PictureImgList[]>([])
const finishedImgList = ref<PictureImgList[]>([])
const closeQualityInspection = () => {
  visible.value = false
}
const imagePreviewClose = () => {
  imagePreviewVisible.value = false
}
const showPreviewImage = (imgUrl: string) => {
  imagePreviewList.value = [imgUrl]
  imagePreviewVisible.value = true
}
const qualityInspectionForm = reactive<any>({})

const clearPadding = (data: { row: any; column: any; rowIndex: number; columnIndex: number }) => {
  if (data.columnIndex === 0) {
    return 'clear-padding'
  }
  return ''
}
const componentListCellStyle = (data: { row: any; column: any; rowIndex: number; columnIndex: number }): CSSProperties => {
  if (data.columnIndex !== 1) {
    return {
      textAlign: 'center',
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
    }
  } else {
    return {
      textAlign: 'left',
    }
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
      background: rgba(0, 0, 0, 0.45);  // 悬停时的背景色
      opacity: 1;  // 悬停时完全显示
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
.custom-tooltip {
  max-width: 430px;
  font-size: var(--el-font-size-base);
  white-space: pre-wrap;
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
.el-table :deep(.clear-padding .cell) {
  padding-right: 0px;
  padding-left: 0px;
}
.el-table :deep(.clear-padding) {
  padding-top: 0px;
  padding-bottom: 0px;
}
// 选中且不被禁用的样式
:deep(.el-checkbox__input.is-checked .el-checkbox__inner) {
  background-color: var(--el-checkbox-checked-bg-color);
  border-color: var(--el-checkbox-checked-input-border-color);
}

// 选中且被禁用的样式
:deep(.el-checkbox__input.is-disabled.is-checked .el-checkbox__inner) {
  background: var(--el-checkbox-checked-bg-color);
  border-color: var(--el-checkbox-checked-input-border-color);
}

// 选中后中间的 “✔” 的样式
:deep(.el-checkbox__input.is-disabled.is-checked .el-checkbox__inner::after) {
  border-color: #fff;
}
</style>