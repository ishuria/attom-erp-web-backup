<template>
    <el-dialog 
        v-model="uploadVisible" 
        list-type="picture" 
        :close-on-click-modal="false" 
        :title="title" 
        width="700px"
        :before-close = "handlerCloseDialog"
    >
        <el-upload
            drag
            action="#"
            :multiple="props.isMultiple"
            :show-file-list="props.fileListFlag"
            style="padding-bottom: 15px;"
            :before-upload="beforeUpload"
            :http-request="props.uploadFile"
        >
            <el-icon class="el-icon--upload"><upload-filled /></el-icon>
            <div class="el-upload__text">
                拖拽上传图片 <em>或点击上传图片</em>
            </div>
        </el-upload>
    </el-dialog>    
</template>

<script lang="ts" setup>

import { UploadFilled } from '@element-plus/icons-vue'
import { UploadProps, UploadRequestOptions } from 'element-plus';
import {iamgeSuffixTypeArr} from '/@/const/image'

defineOptions({
  name: 'VabUpload',
})

// 设置props属性并赋值默认值
let props = withDefaults(defineProps<{
    uploadVisible: boolean
    title:string
    isMultiple:boolean
    fileListFlag:boolean
    dataId:string,
    uploadFile: (options: UploadRequestOptions) => XMLHttpRequest | Promise<unknown>

}>(),{
    uploadVisible: false,
    isMultiple: false,
    fileListFlag: false
});

// 图片上传前的check
const beforeUpload: UploadProps['beforeUpload'] = (rawFile) => {
  if (!iamgeSuffixTypeArr.includes(rawFile.type)) {
    $baseMessage('上传的不是图片类型，只能是image/jpeg、image/jpg、image/png!','error','hey')
    return false
  } else if (rawFile.size / 1024 / 1024 > 2) {
    $baseMessage('图片超过了2MB!','error','hey')
    return false
  }
  return true
}

// 定义事件
const emit = defineEmits<{ 
    (e: 'update:uploadVisible', value: boolean): void
}>()


// 关闭上传文件dialog
const handlerCloseDialog = () =>{
    emit('update:uploadVisible', false);
}

const {
    uploadVisible,
    title,
    } = toRefs(props)

</script>