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
            :before-upload="beforeAvatarUpload"
            :http-request="uploadFile"
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
import { uploadFileBoBakend } from '/@/api/devlocal/evaluation'
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
    dataId:string
}>(),{
    uploadVisible: false,
    isMultiple: false,
    fileListFlag: false
});

// 定义事件
const emit = defineEmits<{ 
    (e: 'update:uploadVisible', value: boolean): void 
    (e: 'obtain:imageRes', value: string): void
}>()


// 图片上传前的check
const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
  if (!iamgeSuffixTypeArr.includes(rawFile.type)) {
    $baseMessage('上传的不是图片类型，只能是image/jpeg、image/jpg、image/png!','error','hey')
    return false
  } else if (rawFile.size / 1024 / 1024 > 2) {
    $baseMessage('图片超过了2MB!','error','hey')
    return false
  }
  return true
}

// 上传文件
const uploadFile = async (options: UploadRequestOptions) => {

  const formdata = new FormData()
  formdata.append('file', options.file)
  formdata.append('type', "1")
  formdata.append('id', props.dataId)

  try{
    const {data} = await uploadFileBoBakend(formdata);
    if (data){
        $baseMessage("产品成本核算图片上传成功！","success","hey")
        emit('obtain:imageRes',data)
        handlerCloseDialog()
    }
  }catch(err){
    const error = err as Error;
    console.error(error)
    $baseMessage("产品成本核算图片上传失败！","error","hey")
  }

}

// 关闭上传文件dialog
const handlerCloseDialog = () =>{
    emit('update:uploadVisible', false);
}

const {
    uploadVisible,
    title,
    } = toRefs(props)

</script>