<template>
  <div class="comprehensive-table-container auto-height-container">
    <vab-query-form>
      <vab-query-form-left-panel :span="18">
        <el-button type="primary" @click="showBoxNumber">开始装箱</el-button>
        <el-button type="primary" @click="showShippingAmazon">发货(亚马逊)</el-button>
        <el-button type="primary" @click="showShippingWalmart">发货(沃尔玛)</el-button>
        <el-button type="primary" @click="shippingPlanningVisible = true">发货规划</el-button>
        <el-button type="primary" @click="handleUnlockEncasement">解锁</el-button>
        <el-button type="primary" @click="showModifyShippingPlan">修改发货计划</el-button>
        <el-button type="primary" @click="uploadPdfVisible = true">上传pdf插页</el-button>
        <el-button type="primary" @click="uploadSplitVisible = true">上传拆分</el-button>
        <el-select placeholder="请选择打印机" clearable style="margin: 0 10px calc(var(--el-margin) / 2) 0">
          <el-option 
            v-for="item in printerOption"
            :label="item.label"
            :value="item.value"
            :key="item.value"
          />
        </el-select>
      </vab-query-form-left-panel>
      <vab-query-form-right-panel :span="6">
        <el-form inline :model="queryForm" @submit.prevent>
          <el-form-item>
            <el-input v-model.trim="queryForm.keyWord" @input="queryData" @keyup.enter.native="queryData" clearable placeholder="请输入搜索关键词" />
          </el-form-item>
          <el-form-item>
            <el-button :loading="listLoading" :icon="Search" type="primary" native-type="submit" @click="queryData" ></el-button>
          </el-form-item>
        </el-form>
      </vab-query-form-right-panel>
    </vab-query-form>
    <vab-query-form>
      <vab-query-form-left-panel>
        <el-text class="text-center">
          {{ `总箱数：${totalBoxNumber}，总重：${totalWeight.toFixed(2)}(kg)，总体积：${totalVolume.toFixed(2)}(m3)` }}
        </el-text>
      </vab-query-form-left-panel>
    </vab-query-form>
    <el-table
      border 
      class="noneHoveTable"
      :header-cell-style="{ textAlign: 'center' }"
      :row-class-name="stripedRowClass"
      :cell-style="cellStyle"
      :data="list"
      @selection-change="setSelectRows"
      :span-method="objectSpanMethod"
    >
      <el-table-column type="selection" fixed="left"></el-table-column>
      <el-table-column label="发货计划" prop="shipmentPlanDate" min-width="115">
        <template #default="{ row }">
          {{ row.shipmentPlanDate ? row.shipmentPlanDate.split(' ')[0] : '' }}
        </template>
      </el-table-column>
      <el-table-column label="装箱日期" prop="createTime" min-width="115">
        <template #default="{ row }">
          {{ row.createTime ? row.createTime.split(' ')[0] : '' }}
        </template>
      </el-table-column>
      <el-table-column label="毛重(kg)" prop="grossWeight" min-width="100"></el-table-column>
      <el-table-column label="长(cm)" prop="length" min-width="90"></el-table-column>
      <el-table-column label="宽(cm)" prop="width" min-width="90"></el-table-column>
      <el-table-column label="高(cm)" prop="height" min-width="90"></el-table-column>
      <el-table-column label="总重量(kg)" prop="totalWeight" min-width="110"></el-table-column>
      <el-table-column label="总体积(m3)" prop="totalVolume" min-width="110"></el-table-column>
      <el-table-column label="箱规号" prop="encasementNo" min-width="110"></el-table-column>
      <el-table-column label="站点" prop="site" min-width="100"></el-table-column>
      <el-table-column label="SKU" prop="sku" min-width="300" :width="flexColumnWidth(list, 'SKU', 'sku')"></el-table-column>
      <el-table-column label="Description" prop="description" :width="flexColumnWidth(list, 'Description', 'description')"></el-table-column>
      <el-table-column label="箱数" prop="numberOfBoxes" min-width="150">
        <template #default="{ row }">
          <el-input-number 
            v-model="row.numberOfBoxes" 
            @change="(newValue, oldValue) => handleBoxNumberChange(newValue, oldValue, row)" 
            style="width: 100%;" 
            @keydown.prevent="handleKeyDown" 
        />
        </template>
      </el-table-column>
      <el-table-column label="数量" prop="number" min-width="90"></el-table-column>
      <el-table-column label="产品总数" prop="productTotalNumber" min-width="100"></el-table-column>
      <el-table-column label="备注" prop="remarks" min-width="100"></el-table-column>
      <el-table-column label="操作" fixed="right" width="200">
        <template #default="{ row, $index }">
          <el-link type="primary" :underline="false" @click="showModify(row)">修改</el-link>
          <el-link type="primary" :underline="false" @click="showSplit(row)">拆分</el-link>
          <el-link type="danger" :underline="false" @click="handleDelEncasement(row, $index)">删除</el-link>
          <el-link type="primary" :underline="false" @click="showPrint(row)">打印</el-link>
        </template>
      </el-table-column>
      <template #empty>
        <el-empty class="vab-data-empty" description="暂无数据" />
      </template>
    </el-table>
    <vab-pagination 
      :current-page="queryForm.pageNo"
      :page-size="queryForm.pageSize"
      :total="total"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
    />
    <!-- 修改 -->
    <VabModifyDialog 
      :modify-visible="modifyVisible"
      :encasementId="encasementId"
      :_siteList="siteList"
      @update:modify-visible="closeModify"
    />

    <!-- 箱号 -->
    <vab-dialog
      title="箱号"
      :width="dialogWidth"
      v-model="boxNumberVisible"
      class="dialog"
      @close="closeBoxNumber"
    >
      <el-form ref="boxNumberFormRef" :model="boxNumberForm" :rules="boxNumberFormRules" label-position="right" label-width="auto" style=" margin-right: 10px;margin-left: 10px">
        <el-form-item label="箱号" prop="boxNumber">
          <el-input v-model="boxNumberForm.boxNumber" disabled />
        </el-form-item>
        <el-form-item label="站点" prop="site">
          <el-select v-model="boxNumberForm.site" placeholder="请选择站点" >
            <el-option 
              v-for="item in siteList"
              :label="item.label"
              :value="item.id"
              :key="item.id"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <div style="display: flex; justify-content: space-between">
          <div>
            <el-button type="primary" @click="reinsertBoxNumber">回插</el-button>
            <el-button @click="increaseBoxNumber">递增</el-button>
          </div>
          <div>
            <el-button type="primary" @click="showPacking">下一步</el-button>
          </div>
        </div>
      </template>
    </vab-dialog>
    <!-- 装箱 -->
    <VabPackingDialog 
      :packing-visible="packingVisible"
      :site="passSite"
      :encasement-no="encasementNo"
      @update:packing-visible="handlePackingClose"
      @update:finish="handleFinish"
    />
    <!-- 发货（沃尔玛）-->
    <vab-dialog
      title="发货（沃尔玛）"
      width="20%"
      v-model="shippingWalmartVisible"
      class="dialog"
    >
      <el-text >
        {{ `总箱数：${totalBoxNumber}，总重：${totalWeight.toFixed(2)}(kg)，总体积：${totalVolume.toFixed(2)}(m3)` }}
      </el-text>
      <br />
      <el-button type="primary" style="margin-top: 20px" @click="handleEncasementWalmart">生成模板文件</el-button>
    </vab-dialog>
    <!-- 发货（亚马逊）-->
    <vab-dialog
      title="发货（亚马逊）"
      width="25%"
      v-model="shippingAmazonVisible"
      class="dialog"
      top="6vh"
      @close="closeShipmentAmazon"
    >
      <el-form ref="shipmentAmazonFormRef" :model="shipmentAmazonForm" label-position="top">
        <el-form-item style="margin-bottom: 10px">
          <el-text>
            {{ `总箱数：${totalBoxNumber}，总重：${totalWeight.toFixed(2)}(kg)，总体积：${totalVolume.toFixed(2)}(m3)` }}
          </el-text>
        </el-form-item>
        <el-form-item>
          <el-select v-model="shipmentAmazonForm.type" >
            <el-option 
              v-for="item in unitOption"
              :label="item.label"
              :value="item.value"
              :key="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item style="margin-bottom: 10px">
          <el-space >
            <el-button @click="handleGenerateFile1">生成模板文件</el-button>
            <el-button :disabled="file2Disabled" @click="handleDownloadFile">下载模板文件</el-button>
          </el-space>
        </el-form-item>
     
        <el-upload
          class="upload-demo"
          drag
          action="#"
          multiple
          width="100%"
          v-model:file-list="fileList" 
          :show-file-list="true" :auto-upload="true"
          :http-request="UploadRequestHandler"
        >
          <el-icon class="el-icon--upload"><upload-filled /></el-icon>
          <div class="el-upload__text">
            将文件拖拽到此处或 <em>点击上传</em>
          </div>
        </el-upload>
  
        <el-form-item>
          <el-space>
            <el-button :disabled="file3Disabled" @click="handleDownloadEncasementFile">下载装箱文件</el-button>
            <el-button :disabled="file3Disabled" @click="handleGenerateFile3">下载装箱表格</el-button>
          </el-space>
        </el-form-item>
      
        <el-form-item label="合同号" prop="contractNumber">
          <el-input v-model="shipmentAmazonForm.contractNumber" clearable />
        </el-form-item>
        <el-form-item label="SHIPMENT ID" prop="shipmentId">
          <el-input v-model="shipmentAmazonForm.shipmentId" clearable />
        </el-form-item>
        <el-form-item label="站点" prop="site">
          <el-select v-model="shipmentAmazonForm.site" placeholder="请选择站点" >
            <el-option 
              v-for="item in siteList"
              :label="item.label"
              :value="item.id"
              :key="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="货代渠道" prop="channel">
          <el-select v-model="shipmentAmazonForm.channel" clearable placeholder="请选择货代渠道">
            <el-option 
              v-for="item in channelList"
              :label="item.label"
              :value="item.id"
              :key="item.id"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <div style="text-align: center;">
          <el-button type="primary" @click="submitShipmentAmazon">完成</el-button>
        </div>
      </template>
    </vab-dialog>
    <!-- 发货规划 -->
    <vab-dialog
      title="发货规划"
      v-model="shippingPlanningVisible"
      width="20%"
      @close="closeShippingPlanning"
    >
      <el-form ref="shippingPlanningFormRef" :model="shippingPlanningForm" style=" margin-right: 10px;margin-left: 10px" class="noneHoveTable">
        <el-form-item label="发货计划" prop="date">
          <el-date-picker  type="date" placeholder="选择发货计划日期" clearable>
          </el-date-picker>
          
        </el-form-item>
        <el-form-item label="货代渠道">
          <el-input  clearable />
        </el-form-item>
        <el-form-item label="应急补货">
          <el-checkbox></el-checkbox>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="closeShippingPlanning">取消</el-button>
        <el-button type="primary">确认</el-button>
      </template>
    </vab-dialog>
    <!-- 修改发货计划 -->
    <vab-dialog
      title="修改发货计划"
      v-model="modifyPlanVisible"
      width="20%"
      @close="closeShippingPlan"
    >
      <el-form ref="shippingPlanFormRef" :model="shippingPlanForm" :rules="shippingPlanFormRules" style=" margin-right: 10px;margin-left: 10px">
        <el-form-item label="发货计划" prop="date">
          <el-date-picker 
            type="date" 
            placeholder="请选择日期" 
            v-model="shippingPlanForm.date"
            value-format="YYYY-MM-DD"
            clearable
          >
          </el-date-picker>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="closeShippingPlan">取消</el-button>
        <el-button type="primary" @click="confirmShippingPlan">确认</el-button>
      </template>
    </vab-dialog>
    <!-- 上传拆分 -->
    <vab-dialog
      title="上传拆分"
      width="25%"
      v-model="uploadSplitVisible"
      top="10vh"
      @close="closeUploadSplit"
    >
      <el-form ref="uploadSplitFormRef" :model="uploadSplitForm" label-position="top" style=" margin-right: 10px;margin-left: 10px">
        <el-form-item label="日期" prop="date">
          <el-date-picker v-model="uploadSplitForm.date" type="date" value-format="YYYY-MM-DD" clearable style="width: 100%" />
        </el-form-item>
        <el-form-item label="拆分备注" prop="remarks">
          <el-input v-model="uploadSplitForm.remarks" type="textarea" :rows="2" resize="none" />
        </el-form-item>
        <el-upload
          class="upload-demo"
          drag
          action="#"
          multiple
          width="100%"
          v-model:file-list="splitFileList" 
          :show-file-list="true" :auto-upload="true"
          :http-request="uploadSplitFile"
        >
          <el-icon class="el-icon--upload"><upload-filled /></el-icon>
          <div class="el-upload__text">
            将文件拖拽到此处或 <em>点击上传</em>
          </div>
        </el-upload>
      </el-form>
      <template #footer>
        <div style="text-align: center">
          <el-button type="primary" @click="submitSplitCsv">完成</el-button>
        </div>
      </template>
    </vab-dialog>
    <!-- 上传 pdf 插页 -->
    <vab-dialog
      title="上传pdf插页"
      width="25%"
      v-model="uploadPdfVisible"
    >
      <el-upload
        class="upload-demo"
        drag
        action="#"
        multiple
        width="100%"
        v-model:file-list="pdfFileList" 
        :show-file-list="true" :auto-upload="true"
        :http-request="uploadPdf"
      >
        <el-icon class="el-icon--upload"><upload-filled /></el-icon>
        <div class="el-upload__text">
          将文件拖拽到此处或 <em>点击上传</em>
        </div>
      </el-upload>
      <template #footer>
        <div style="text-align: center">
          <el-button type="primary" @click="handleSubmitPdf">完成</el-button>
        </div>
      </template>
    </vab-dialog>
    <!-- 打印 -->
    <vab-dialog
      title="打印"
      width="20%"
      v-model="printVisible"
    >
      <el-form style=" margin-right: 10px;margin-left: 10px;">
        <el-form-item label="打印数量">
          <el-input v-model="printCount" clearable />
        </el-form-item>
      </el-form>
      <template #footer>
        <div style="text-align: center;">
          <el-button type="primary">打印</el-button>
        </div>
      </template>
    </vab-dialog>
    <!-- 拆分 -->
    <vab-dialog
      title="拆分"
      width="20%"
      v-model="splitVisible"
    >
      <el-form ref="splitFormRef" :model="splitForm" :rules="splitFormRules" style=" margin-right: 10px;margin-left: 10px;">
        <el-form-item label="拆分数量" prop="splitCount">
          <el-input v-model="splitForm.splitCount" clearable />
        </el-form-item>
      </el-form>
      <template #footer>
        <div style="text-align: center;">
          <el-button type="primary" @click="confirmSplit">拆分</el-button>
        </div>
      </template>
    </vab-dialog>
  </div>
</template>

<script lang="ts" setup>
import { Search, UploadFilled } from '@element-plus/icons-vue'
import { FormInstance, FormRules } from 'element-plus'
import { CSSProperties } from 'vue'
import { printerOption, unitOption } from '../constantOption'
import { downloadFile } from '/@/api/devlocal/download'
import { confirmEncasementShipments, delEncasement, doLockEncasement, generateTemplateFile1, generateTemplateFile3, generateWalmartShipment, getChannelList, getEncasementList, getIncrementBoxNo, getReinsertionBoxNo, insertPdf, plusEncasementCount, reduceEncasementCount, splitEncasement, splitEncasementCsv, unlockEncasement, updateEncasementShipmentDate, uploadEncasementFile, uploadGenerateTemplateFile2 } from '/@/api/devlocal/encasement'
import { getPackageSiteList } from '/@/api/devlocal/packagingShipping'
import { IBoxNumberForm, IEncasementList, IGetEncasementListReq, ISiteOption, OptionType } from '/@/type/packagingShipping/shippedType'
import { flexColumnWidth } from '/@/utils/tableColum'

const listLoading = ref<boolean>(false)
const list = ref<IEncasementList[]>([])
const total = ref<number>(0)
const queryForm = reactive<IGetEncasementListReq>({
  keyWord: '',
  pageNo: 1,
  pageSize: 20
})
// 修改可见
const modifyVisible = ref<boolean>(false)
// 传递给装箱的site
const passSite = ref<number>()
// 传递给装箱的装箱号
const encasementNo = ref<number>(0)
// 箱号可见
const boxNumberVisible = ref<boolean>(false)
// 装箱可见
const packingVisible = ref<boolean>(false)
// 上传拆分可见
const uploadSplitVisible = ref<boolean>(false)
// 上传pdf可见
const uploadPdfVisible = ref<boolean>(false)
// 打印可见
const printVisible = ref<boolean>(false)
const printCount = ref<number | undefined>(undefined)
// 拆分可见
const splitVisible = ref<boolean>(false)
const splitForm = reactive<{ splitCount: number | undefined }>({
  splitCount: undefined
})
const splitFormRef = ref<FormInstance>()
const splitFormRules = reactive<FormRules<{ splitCount: number | undefined }>>({
  splitCount: [{ required: true, message: '请输入拆分数量', trigger: 'blur' }]
})

// 箱号表单
const boxNumberForm = reactive<IBoxNumberForm>({
  boxNumber: undefined,
  site: undefined
})
const boxNumberFormRef = ref<FormInstance>()
const boxNumberFormRules = reactive<FormRules<IBoxNumberForm>>({
  site: [{ required: true, message: '请选择站点', trigger: 'change' }]
})

// 站点列表
const siteList = ref<ISiteOption[]>([])
// 传递给装箱的判断是UPC还是FNSKU
const upcOrFnSku = ref<string>('FNSKU')
// 多选的行
const selectRows = ref<any>([])
// 总箱数
const totalBoxNumber = computed<number>(() => {
  return selectRows.value.reduce((total: number, item: IEncasementList) => {
    return total + item.numberOfBoxes!;  // 累加每个 item.numberOfBoxes
  }, 0); // 初始值为 0
});
// 总重
const totalWeight = computed<number>(() => {
  return selectRows.value.reduce((total: number, item: IEncasementList) => {
    return total + item.totalWeight!;  
  }, 0); // 初始值为 0
})
// 总体积
const totalVolume = computed<number>(() => {
  return selectRows.value.reduce((total: number, item: IEncasementList) => {
    return total + item.totalVolume!;  
  }, 0); // 初始值为 0
})
// 发货（沃尔玛）可见
const shippingWalmartVisible = ref<boolean>(false)
// 发货（亚马逊）可见
const shippingAmazonVisible = ref<boolean>(false)
// 发货亚马逊表单
const shipmentAmazonForm = reactive<any>({
  type: 1
})
const shipmentAmazonFormRef = ref<FormInstance>()
// 发货亚马逊文件上传
const fileList = ref<any>([])
// 上传拆分文件
const splitFileList = ref<any>([])
// 修改发货计划可见
const modifyPlanVisible = ref<boolean>(false)
// 发货计划表单
const shippingPlanForm = reactive<any>({})
const shippingPlanFormRules = reactive<any>({
  date: [{ required: true, message: '请选择发货计划日期', trigger: 'change' }]
})
const shippingPlanFormRef = ref<FormInstance>()
// 发货规划可见
const shippingPlanningVisible = ref<boolean>(false)
// 发货规划表单
const shippingPlanningForm = reactive<any>({})
const shippingPlanningFormRef = ref<FormInstance>()
const shippingPlanningFormRules = reactive<any>({

})
// 上传拆分表单
const uploadSplitForm = reactive<any>({})
const uploadSplitFormRef = ref<FormInstance>()
// 禁止下载模板文件
const file2Disabled = ref<boolean>(true)
// 禁止下载装箱文件和装箱表格
const file3Disabled = ref<boolean>(true)
// 修改箱数
const handleBoxNumberChange = async (currentValue: number | undefined, oldValue: number | undefined, row: IEncasementList) => {
  if (currentValue! > oldValue!) {
    try {
      const { data } = await plusEncasementCount({
        encasementId: row.id!
      })
      if (data) {
        fetchData()
      }
    } catch (error) {
      // 还原回原来的值
      row.numberOfBoxes = oldValue
    }
  } else if (currentValue! < oldValue!) {
    try {
      const { data } = await reduceEncasementCount({
        encasementId: row.id!
      })
      if (data) {
        fetchData()
      }
    } catch (error) {
      row.numberOfBoxes = oldValue
    }
  }
}
// 不许编辑箱数
const handleKeyDown = () => { }
// 解锁
const handleUnlockEncasement = async () => {
  const { data } = await unlockEncasement()
  if (data) {
    $baseMessage('解锁成功', 'success')
  }
}
// 文件名 
const fileName = ref<string>('')
// 发货亚马逊生成模板文件
const handleGenerateFile1 = async () => {
  const encasementIds = selectRows.value.map((item: IEncasementList) => item.id).join(',')
  const { data } = await generateTemplateFile1({
    encasementIds: encasementIds,
    type: shipmentAmazonForm.type
  })
  fileName.value = data
  file2Disabled.value = false
}
// 下载模板文件
const handleDownloadFile = async () => {
  await downloadFile('/encasement/download', {
    fileName: fileName.value
  }).then((res) => {
    console.log(res);
  }).catch((error) => {
    console.log(error);
  })
}
// 发货沃尔玛 生成模板文件
const handleEncasementWalmart = async () => {
  const encasementIds = selectRows.value.map((item: IEncasementList) => item.id).join(',')
  const { data } = await generateWalmartShipment({
    encasementIds: encasementIds
  })
  await downloadFile('/encasement/download', {
    fileName: data
  }).then((res) => {
    console.log(res);
  }).catch((error) => {
    console.log(error);
  })
}
// 发货亚马逊 文件上传的fileName
const fileName2 = ref<string>('')
// 发货亚马逊 文件上传
const UploadRequestHandler = async () => {
  let formData = new FormData()
  fileList.value.forEach((item: any) => {
    formData.append('file', item.raw)
  })
  const encasementIds = selectRows.value.map((item: IEncasementList) => item.id).join(',')
  formData.append('encasementIds', encasementIds)
  formData.append('type', shipmentAmazonForm.type)
  const { data } = await uploadGenerateTemplateFile2(formData)
  fileName2.value = data
  file3Disabled.value = false
}
// 下载装箱文件
const handleDownloadEncasementFile = async () => {
  await downloadFile('/encasement/download', {
    fileName: fileName2.value
  }).then((res) => {
    console.log(res);
  }).catch((error) => {
    console.log(error);
  })
}
// 上传拆分的文件名
const splitFileName = ref<string>('')
// 上传拆分文件
const uploadSplitFile = async () => {
  let formData = new FormData()
  splitFileList.value.forEach((item: any) => {
    formData.append('file', item.raw)
  })
  const { data } = await uploadEncasementFile(formData)
  splitFileName.value = data

}
// 完成上传拆分
const submitSplitCsv = async () => {
  const { data } = await splitEncasementCsv({
    fileName: splitFileName.value,
    date: uploadSplitForm.date,
    remarks: uploadSplitForm.remarks
  })
  if (data) {
    $baseMessage('上传拆分成功', 'success')
    closeUploadSplit()
  }
}
// 生成装箱表格文件的fileName
const fileName3 = ref<string>('')
// 生成装箱表格文件和下载
const handleGenerateFile3 = async () => {
  const encasementIds = selectRows.value.map((item: IEncasementList) => item.id).join(',')
  const { data } = await generateTemplateFile3({
    encasementIds: encasementIds
  })
  fileName3.value = data
  await downloadFile('/encasement/download', {
    fileName: fileName3.value
  }).then((res) => {
    console.log(res);
  }).catch((error) => {
    console.log(error);
  })
}
// 关闭 发货（亚马逊）
const closeShipmentAmazon = () => {
  shipmentAmazonFormRef.value?.resetFields()
  shippingAmazonVisible.value = false
}
// 完成 发货（亚马逊）
const submitShipmentAmazon = async () => {
  const encasementIds = selectRows.value.map((item: IEncasementList) => item.id).join(',')
  // 发货亚马逊前置上锁请求
  const { data } = await doLockEncasement({
    encasementIds: encasementIds
  })
  if (data) {
    const { data: res } = await confirmEncasementShipments({
      encasementIds: encasementIds,
      type: shipmentAmazonForm.type,
      templateFile1Name: fileName.value,
      templateFile2Name: fileName2.value,
      templateFile3Name: fileName3.value,
      contractNumber: shipmentAmazonForm.contractNumber,
      shipmentId: shipmentAmazonForm.shipmentId,
      site: shipmentAmazonForm.site,
      channel: shipmentAmazonForm.channel
    })
    if (res) {
      $baseMessage('发货（亚马逊）提交成功', 'success')
      closeShipmentAmazon()
    }
  }
}
const pdfFileList = ref<any>([])
const pdfFileName = ref<string>('')
// 上传pdf
const uploadPdf = async () => {
  let formData = new FormData()
  pdfFileList.value.forEach((item: any) => {
    formData.append('file', item.raw)
  })
  const { data } = await uploadEncasementFile(formData)
  pdfFileName.value = data
}
// 完成pdf
const handleSubmitPdf = async () => {
  const { data } = await insertPdf({
    fileName: pdfFileName.value
  })
  if (data) {
    $baseMessage('上传pdf插页成功', 'success')
    uploadPdfVisible.value = false
  }
}
// 关闭拆分
const closeUploadSplit = () => {
  uploadSplitFormRef.value?.resetFields()
  uploadSplitVisible.value = false
}
// 确认拆分
const confirmSplit = async () => {
  splitFormRef.value?.validate(async (isValid: boolean) => {
    if (isValid) {
      const { data } = await splitEncasement({
        encasementId: copyRow.value.id,
        splitCount: splitForm.splitCount!
      })
      if (data) {
        $baseMessage('拆分成功', 'success')
        closeUploadSplit()
        fetchData()
      }
    }
  })
}
// 关闭发货计划
const closeShippingPlan = () => {
  shippingPlanFormRef.value?.resetFields()
  modifyPlanVisible.value = false
}
// 确认修改发货计划
const confirmShippingPlan = async () => {
  const encasementIds = selectRows.value.map((item: IEncasementList) => item.id).join(',')
  const { data } = await updateEncasementShipmentDate({
    encasementIds: encasementIds,
    shipmentPlanDate: shippingPlanForm.date
  })
  if (data) {
    $baseMessage('修改发货计划成功', 'success')
    closeShippingPlan()
    fetchData()
  }
}
// 关闭发货规划
const closeShippingPlanning = () => {
  shippingPlanningFormRef.value?.resetFields()
  shippingPlanningVisible.value = false
}
// 传递给修改的encasementId
const encasementId = ref<number>(0)
// 展示修改
const showModify = (row: IEncasementList) => {
  encasementId.value = row.id!
  modifyVisible.value = true
}
// 关闭修改
const closeModify = (value: boolean) => {
  modifyVisible.value = value
  fetchData()
}

// 展示箱号
const showBoxNumber = async () => {
  const { data } = await getIncrementBoxNo()
  if (data) {
    boxNumberForm.boxNumber = data
    boxNumberVisible.value = true
  }
}
// 点击递增
const increaseBoxNumber = async () => {
  const { data } = await getIncrementBoxNo()
  if (data) {
    boxNumberForm.boxNumber = data
    $baseMessage('递增获取箱号成功', 'success')
  }
}
// 点击回插
const reinsertBoxNumber = async () => {
  const { data } = await getReinsertionBoxNo()
  if (data) {
    boxNumberForm.boxNumber = data
    $baseMessage('回插获取箱号成功', 'success')
  }
}
// 关闭箱号
const closeBoxNumber = () => {
  boxNumberFormRef.value?.resetFields()
  boxNumberVisible.value = false
}
// 箱号的下一步，展示装箱
const showPacking = () => {
  boxNumberFormRef.value?.validate((isValid: boolean) => {
    if (isValid) {  
      boxNumberVisible.value = false
      packingVisible.value = true
      passSite.value = boxNumberForm.site
      encasementNo.value = boxNumberForm.boxNumber!
    }
  })
}
// 装箱的关闭
const handlePackingClose = (value: boolean) => {
  packingVisible.value = value
}
const handleFinish = () => {
  queryData()
}
const setSelectRows = (value: IEncasementList[]) => {
  // 使用 Map 来去重，因为 Map 会根据键值唯一性自动去重
  const uniqueRows = Array.from(
    new Map(value.map(item => [item.id, item])).values()
  );

  // 更新 selectRows 为去重后的数组
  selectRows.value = uniqueRows;
}
// 货代渠道列表
const channelList = ref<OptionType[]>([])
// 展示发货亚马逊
const showShippingAmazon = async () => {
  if (selectRows.value.length === 0) {
    $baseMessage('您未选中任何行', 'error')
    return
  }
  // 判断箱数是否大于500
  if (totalBoxNumber.value > 500) {
    $baseMessage('总箱数不能大于500，请重新勾选', 'error')
    return
  }
  const { data } = await getChannelList()
  channelList.value = data
  file2Disabled.value = true
  file3Disabled.value = true
  shippingAmazonVisible.value = true
}
// 展示发货沃尔玛
const showShippingWalmart = () => {
  if (selectRows.value.length === 0) {
    $baseMessage('您未选中任何行', 'error')
    return
  }
  // 判断箱数是否大于500
  shippingWalmartVisible.value = true
}
// 展示修改发货计划
const showModifyShippingPlan = () => {
  if (selectRows.value.length === 0) {
    $baseMessage('您未选中任何行', 'error')
    return
  }
  modifyPlanVisible.value = true
}
// 展示打印
const showPrint = (row: any) => {
  printCount.value = undefined
  printVisible.value = true
}
const copyRow = ref<any>()
// 展示拆分
const showSplit= (row: any) => {
  copyRow.value = row
  splitVisible.value = true
}
// 删除装箱
const handleDelEncasement = async (row: any, index: number) => {
  $baseConfirm('确定删除本条装箱信息吗？', null, async () => {
    const { data } = await delEncasement({
      encasementId: row.id
    })
    if (data) {
      $baseMessage('删除本条装箱信息成功', 'success')
      list.value.splice(index, 1)
    }
  })
}
const queryData = () => {
  queryForm.pageNo = 1
  fetchData()
}
const handleCurrentChange = (value: number) => {
  queryForm.pageNo = value
  fetchData()
}
const handleSizeChange = (value: number) => {
  queryForm.pageNo = 1
  queryForm.pageSize = value
  fetchData()
}
const cellStyle = (data: { row: any, column: any, rowIndex: number, columnIndex: number }): CSSProperties => {
  if (data.columnIndex !== 11 && data.columnIndex !== 12) {
    return {
      textAlign: 'center'
    }
  }
  return {
    textAlign: 'left'
  }
}
let previous: any = null; 
let currentGroupIndex = 0; // 当前组索引

const stripedRowClass = (_row: any) => {
  const { row } = _row;
  const currentId = row.id;
  // 检查当前行是否与上一行不同
  if (currentId !== previous) {
    previous = currentId; 
    currentGroupIndex++; 
  }
  // 根据当前组索引设置条纹样式
  return currentGroupIndex % 2 === 0 ? 'el-table__row--striped' : '';
};
// 装箱合并方法
const objectSpanMethod = ({
    row,
    column,
    rowIndex,
    columnIndex,
}: any) => {
  // 设置需要合并的列
  if (columnIndex !== 11 && columnIndex !== 12 && columnIndex !== 14 && columnIndex !== 15) {
    // 获取当前row的零件id
    const id = row.id;
    // 默认不跨行
    let rowspan = 1;
    // 遍历后端返回的数据
    for (let i = rowIndex + 1; i < list.value.length; i++) {
      // 如果零件id一样需要合并
      if (list.value[i].id === id) {
        rowspan++;
      } else {
        break;
      }
    }
    // 如果是第一次出现的行，则返回 rowspan, 否则隐藏行
    if (rowIndex === 0 || list.value[rowIndex - 1].id !== id) {
      return { rowspan, colspan: 1 };
    } else {
      return { rowspan: 0, colspan: 0 };
    }
  }
}
// 获取站点信息
const fetchSiteData = async () => {
  const { data } = await getPackageSiteList()
  siteList.value = data
}
const dialogWidth = computed<string>(() => {
  // 获取屏幕宽度并根据不同设备返回宽度
  const screenWidth = window.innerWidth;
  if (screenWidth <= 768) {
        return '80%';  // 手机设备
  } else if (screenWidth <= 1024) {
    return '60%';  // 小型平板设备
  } else if (screenWidth <= 1200) {
    return '50%';  // 中型平板设备
  } else {
    return '20%';  // 大屏设备
  }
})
const fetchData = async () => {
  listLoading.value = true
  const { data } = await getEncasementList(queryForm)
  total.value = data.total
  list.value = data.list
  listLoading.value = false
}
onBeforeMount(() => {
  fetchSiteData()
  fetchData()
})
</script>

<style lang="scss" scoped>
.noneHoveTable :deep(.el-checkbox) {
  transform: scale(1.2);
  transform-origin: center;
}
:deep(.dialog .el-dialog__body) {
  padding-top: 5px;
}
.text-center {
  margin: 0 10px calc(var(--el-margin) / 2) 0;
}

/* 取消没有条纹的行的悬停背景色 */
:deep(.noneHoveTable .el-table__body tr.hover-row:not(.el-table__row--striped) > td.el-table__cell) {
  background-color: #fff !important; /* 透明背景色，取消悬停颜色 */
}

/* 保留带条纹行的原有颜色，确保悬停时不会被覆盖 */
:deep(.noneHoveTable .el-table__body tr.el-table__row--striped > td.el-table__cell) {
  background-color: #fafafa !important; /* 保持原有条纹颜色 */
}
</style>