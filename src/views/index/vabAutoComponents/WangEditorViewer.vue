<template>
  <div class="wang-editor-viewer">
    <div v-if="content && content.trim()" class="editor-container" @click="handleImageClick">
      <editor v-model="html" class="wang-editor-content" :default-config="editorConfig" mode="default" @on-created="handleCreated" />
    </div>
    <el-empty v-else description="暂无内容" />

    <!-- 图片点击放大预览 -->
    <el-image-viewer
      v-if="showViewer"
      hide-on-click-modal
      :initial-index="viewerIndex"
      :url-list="viewerList"
      @close="showViewer = false"
    />
  </div>
</template>

<script lang="ts" setup>
import type { IDomEditor } from '@wangeditor/editor'
import { Editor } from '@wangeditor/editor-for-vue'
import '@wangeditor/editor/dist/css/style.css'

defineOptions({
  name: 'WangEditorViewer',
})

const props = defineProps<{
  content: string
}>()

const editorRef = shallowRef<IDomEditor | undefined>()
const html = ref<string>(props.content || '')

// 编辑器配置
const editorConfig = {
  placeholder: '请输入内容...',
  readOnly: true, // 设置为只读模式
  MENU_CONF: {
    // 禁用所有工具栏
    toolbarKeys: [],
  },
}

// 监听内容变化
watch(
  () => props.content,
  (newContent) => {
    if (newContent !== undefined) {
      html.value = newContent
      // 如果编辑器已创建，同步更新内容
      if (editorRef.value) {
        editorRef.value.setHtml(newContent)
      }
    }
  },
  { immediate: true }
)

// 编辑器创建回调
const handleCreated = (editor: IDomEditor) => {
  editorRef.value = Object.seal(editor) // 一定要用 Object.seal() ，否则会报错
}

// 图片点击放大
const showViewer = ref(false)
const viewerList = ref<string[]>([])
const viewerIndex = ref(0)

const handleImageClick = (e: MouseEvent) => {
  const target = e.target as HTMLElement
  if (target.tagName === 'IMG') {
    const src = (target as HTMLImageElement).src
    if (src) {
      const container = e.currentTarget as HTMLElement
      const allImgs = Array.from(container.querySelectorAll('img'))
      const urls = allImgs.map((img) => img.src).filter(Boolean)
      viewerList.value = urls
      viewerIndex.value = Math.max(urls.indexOf(src), 0)
      showViewer.value = true
    }
  }
}

onBeforeUnmount(() => {
  const editor = editorRef.value
  if (editor) editor.destroy()
})
</script>

<style lang="scss" scoped>
.wang-editor-viewer {
  .editor-container {
    :deep(.w-e-text-container) {
      border: none !important;
      box-shadow: none !important;
      background: transparent !important;
    }

    :deep(.w-e-text) {
      border: none !important;
      box-shadow: none !important;
      background: transparent !important;
      padding: 0 !important;
      min-height: auto !important;
    }

    // 隐藏工具栏
    :deep(.w-e-toolbar) {
      display: none !important;
    }

    // 图片可点击提示
    :deep(img) {
      cursor: zoom-in;
    }
  }
}
</style>
