<template>
  <el-dialog
    :title="props.title"
    v-model="dflag"
    width="100%"
    :close-on-click-modal="false"
    class="eldialog"
    :before-close = "handlerCloseDialog"
  >
    <div class="wang-editor-container" >
      <toolbar :editor="editorRef" style="border-bottom: 1px solid var(--el-border-color)" />
      <editor :model-value="html" class="wang-editor-content" :default-config="editorConfig" @on-created="handleCreated" @click.stop="handleClick"/>
    </div>
    <template #footer>
      <span>
        <el-button @click="handleCloseDialog">取消</el-button>
        <el-button type="primary" @click.stop="handleConfirmDialog">确认</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import type { IDomEditor } from '@wangeditor/editor'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import '@wangeditor/editor/dist/css/style.css'
import { removeLocalStorage, setLocalStorage } from '/@/utils/localStorage'

defineOptions({
  name: 'WangEditor',
})

let props = defineProps<{
  title: string
  wangEditorVisible: boolean
  progressLog: string
}>();
let { progressLog } = toRefs(props)

const dflag = ref<boolean>(false)
watchEffect(()=>{
    dflag.value = props.wangEditorVisible
  }
)



const editorRef = shallowRef<IDomEditor | undefined>()
const html = ref<any>(
  progressLog
)

const editorConfig = reactive<any>({
  placeholder: '请输入内容...',
  MENU_CONF: {
    uploadImage: {
      server: '', // 您的服务器地址，注意：当前接口格式特殊与其他vab接口不同，请查看vip文档
      fieldName: 'vab-file-name',
      allowedFileTypes: ['image/*'],
      headers: {}, // 如需传递token请写到在这里
    },
  },
}
)

const clearTimer = () => {
  clearInterval(intervalTimer)
  intervalTimer = null
}
let intervalTimer: any = null
clearTimer()
const handleClick = () => {
  const editor = editorRef.value 
  if (!editor) return
  
  if (editor.isFocused()) {
    console.log('editor.isFocused()', editor.isFocused())
    clearTimer()
    intervalTimer = setInterval(() => {
      intervalTimer = setLocalStorage('progressLog', html.value)
      console.log(html.value);
    }, 2000);
  } else {
    clearTimer()
  }
}
// 通过事件,修改父元素的值
const handlerCloseDialog = () =>{
  clearTimer()
  removeLocalStorage('progressLog')
  emit('clickBoolean', false)
  dflag.value = false
}
const handleCreated = (editor: IDomEditor) => {
  editorRef.value = editor
}
const emit = defineEmits(['clickChild', 'clickBoolean'])
/**
 * 当取消时
 */
 const handleCloseDialog = () => {
  
  removeLocalStorage('progressLog')
  emit('clickBoolean', false)
  dflag.value = false
  clearTimer()
}



/**
 * 当确认对话框的时候
 */
const handleConfirmDialog = () => {
  
  
  if(!editorRef.value) return
  emit('clickChild', editorRef.value.getText())
  // console.log(editorRef.value.getText());
  // console.log('html',html.value)
  emit('clickBoolean', false)
  $baseMessage('日志保存成功', 'success', 'hey')
  dflag.value = false
  clearTimer()
  console.log('intervalTimer', intervalTimer); 
  removeLocalStorage('progressLog')
}


onBeforeUnmount(() => {
  clearTimer()
  const editor = editorRef.value
  
  if (!editor) return
  editor.destroy()
  
})
onUnmounted(() => {
  clearTimer()
})
</script>

<style lang="scss">
.wang-editor-container {
  padding: 0 !important;
  margin: -19px -19px 19px -19px;
  overflow: hidden !important;
  background: var(--el-background-color) !important;
  border: 0 !important;
  &.w-e-full-screen-container {
    z-index: 9999 !important;
  }

  .w-e-bar-divider {
    display: none;
  }

  .w-e-toolbar-init {
    border-bottom: 1px solid var(--el-border-color) !important;
  }

  .wang-editor-content {
    width: 70%;
    min-height: calc(var(--el-container-height) - 110px - 72px - 19px - 40px) !important;
    margin: 20px auto 20px auto;
    background-color: var(--el-color-white);
    border: 0;
  }

  #w-e-textarea-1 {
    margin: var(--el-margin) !important;
  }

  .wang-editor-footer {
    width: 70%;
    margin: auto;
  }

  @media (max-width: 768px) {
    .wang-editor-title,
    .wang-editor-content,
    .wang-editor-footer {
      width: 90%;
    }
  }
}

.wang-editor-dialog {
  img {
    max-width: 100%;
  }
}
</style>
