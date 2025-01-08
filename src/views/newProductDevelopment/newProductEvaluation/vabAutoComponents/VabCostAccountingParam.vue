
<template>
    <vab-dialog 
      v-model="zflag" 
      title="成本核算默认参数" width="500"
      :before-close = "handlerCloseDialog"
    >
      <el-form label-position="top" label-width="auto" style="max-width: 600px">
        <div class="cost-accountinge-param">
          <el-form-item label="目标毛利率">
            <el-input v-model="costAccountingFrom.rateMargin" />
          </el-form-item>
          <el-form-item label="目标ROI">
            <el-input v-model="costAccountingFrom.rateRoi" />
          </el-form-item>
        </div>
        <div class="cost-accountinge-param">
          <el-form-item label="关税比例">
            <el-input v-model="costAccountingFrom.tariffRatio" />
          </el-form-item>
          <el-form-item label="额外FBA Fulfillment($)">
            <el-input v-model="costAccountingFrom.extraFulfillment" />
          </el-form-item>
        </div>

        <div class="cost-accountinge-param">
          <el-form-item label="最近一次汇率">
            <el-input v-model="costAccountingFrom.exchangeRate" />
          </el-form-item>
          <el-form-item label="装箱体积系数">
            <el-input v-model="costAccountingFrom.volumeFactor" />
          </el-form-item>
        </div>

        <div class="cost-accountinge-param">
          <el-form-item label="装箱重量系数">
            <el-input v-model="costAccountingFrom.weightFactor" />
          </el-form-item>
          <el-form-item label="运输方式">
            <el-input v-model="costAccountingFrom.shippingType" />
          </el-form-item>
        </div>

        <div class="cost-accountinge-param">
          <el-form-item label="仓储费单价($/ft3/月)">
            <el-input v-model="costAccountingFrom.savePrice" />
          </el-form-item>
          <el-form-item label="人工费">
            <el-input v-model="costAccountingFrom.laborCost" />
          </el-form-item>
        </div>

        <div class="cost-accountinge-param">
          <el-form-item label="海运(RMB/M3)">
            <el-input v-model="costAccountingFrom.oceanShipping" />
          </el-form-item>
          <el-form-item label="空运(RMB/KG)">
            <el-input v-model="costAccountingFrom.airTransport" />
          </el-form-item>
        </div>

        <div class="cost-accountinge-param">
          <el-form-item label="重量系数">
            <el-input v-model="costAccountingFrom.weightRate" />
          </el-form-item>
          <el-form-item label="体积系数">
            <el-input v-model="costAccountingFrom.volumeRate" />
          </el-form-item>
        </div>

        <div style="display: flex;padding-left: 5px;">
          <el-form-item label="燃油附加费">
            <el-input v-model="costAccountingFrom.fuelCost" />
          </el-form-item>
        </div>
      </el-form>

      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="commitUpdateCostParam">
            提交修改
          </el-button>
        </div>
      </template>
    </vab-dialog>
</template>

<script lang="ts" setup>

import {
  ICostAccounting,
} from '/@/type/evaluation/evaluationType'

import {
  updateEvaluationCostParams,
} from '/@/api/devlocal/evaluation'

defineOptions({
    name: 'VabCostAccountingParam',
})

let props = defineProps<{
    flag: boolean
    data: ICostAccounting
}>();

const zflag = ref<boolean>(false)
watchEffect(()=>{
  zflag.value = props.flag
})

const emit = defineEmits<{ (e: 'update:visibleValue', value: boolean): void }>()

let costAccountingFrom:ICostAccounting = reactive(props.data)

// 修改成本核算默认参数
const commitUpdateCostParam = () => {
  $baseConfirm('您确定要提交修改吗', null, async () => {
    const { data } = await updateEvaluationCostParams({ ...costAccountingFrom })
    if (data == true) {
      $baseMessage("成本核算默认参数修改成功!", "success", "hey")
    }
    emit('update:visibleValue', false);
    zflag.value = false
  })
}

// 通过事件,修改父元素的值
const handlerCloseDialog = () =>{
    zflag.value = false
    emit('update:visibleValue', false);
}


</script>

<style lang="scss" scoped>

.cost-accountinge-param {
    display: flex;
    justify-content: space-around;
}
</style>