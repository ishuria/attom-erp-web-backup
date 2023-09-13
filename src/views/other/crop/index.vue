<template>
  <div class="crop-container global-animation-disabled">
    <el-row :gutter="20">
      <el-col :lg="8" :md="24" :sm="24" :xl="8" :xs="24">
        <el-form label-position="top" label-width="80px">
          <el-form-item label="操作">
            <el-button type="primary" @click="visible = !visible">图片裁剪</el-button>
            <el-button type="danger" @click="handleReset">重置</el-button>
          </el-form-item>

          <el-form-item label="裁剪比例">
            <el-select v-model="aspectRatio" @change="handleChange">
              <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>

          <el-form-item label="裁剪后的图片">
            <el-image :lazy="true" :src="cropData">
              <template #error>
                <div class="image-slot"></div>
              </template>
            </el-image>
          </el-form-item>

          <el-form-item label="裁剪后的base64">
            <el-input v-model="cropData" clearable :rows="18" show-word-limit type="textarea" />
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <tiny-crop
      ref="cropRef"
      :aspect-ratio="aspectRatio"
      :auto-crop-area="autoCropArea"
      :cropvisible="visible"
      :src="imgUrl"
      @cropdata="cropdata"
      @update:cropvisible="visible = $event"
    />
  </div>
</template>

<script lang="ts" setup>
import { Crop as TinyCrop } from '@opentiny/vue'

defineOptions({
  name: 'Crop',
})

const cropRef = ref<any>(null)
const $baseConfirm: any = inject('$baseConfirm')
const visible = ref<boolean>(false)
const autoCropArea = ref<number>(0.5)
const aspectRatio = ref<number>(16 / 9)
const imgUrl = ref<string>(`https://res.hc-cdn.com/tiny-vue-web-doc/3.10.5.20230903162611/static/images/mountain.png`)
const cropData = ref<any>('')

const options = [
  {
    value: 16 / 9,
    label: '16/9',
  },
  {
    value: 4 / 3,
    label: '4/3',
  },
  {
    value: 1 / 1,
    label: '1/1',
  },
]

const cropdata = (data: any) => {
  cropData.value = data

  $baseConfirm('裁剪完成，您是否要关闭弹窗？', null, () => {
    cropRef.value.closeCrop()
  })
}

const handleReset = () => {
  cropData.value = ''
}

const handleChange = (value: any) => {
  cropRef.value.setAspectRatio(value)
}
</script>

<style lang="scss" scoped>
.crop-container {
  :deep() {
    .tiny-croppreview {
      z-index: calc(var(--el-z-index) + 3);

      [class*='croppreview'] {
        background: var(--el-color-white);
        border-radius: var(--el-border-radius-base);
      }
    }
    .tiny-crop {
      z-index: calc(var(--el-z-index) + 2);
      background-color: rgba(0, 0, 0, 0.25);
      backdrop-filter: blur(2.5px);
      opacity: 1;

      .tiny-crop__dialog {
        background: var(--el-color-white);
        border-radius: var(--el-border-radius-base);

        &-cropper {
          border-top-left-radius: var(--el-border-radius-base);
          border-top-right-radius: var(--el-border-radius-base);
        }

        &-content {
          &__crop {
            margin: 0 0 var(--el-margin) 0;
            background: var(--el-color-white);
            background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAQMAAAAlPW0iAAAAA3NCSVQICAjb4U/gAAAABlBMVEXMzMz////TjRV2AAAACXBIWXMAAArrAAAK6wGCiw1aAAAAHHRFWHRTb2Z0d2FyZQBBZG9iZSBGaXJld29ya3MgQ1M26LyyjAAAABFJREFUCJlj+M/AgBVhF/0PAH6/D/HkDxOGAAAAAElFTkSuQmCC);
            border: 1px solid var(--el-border-color);
            border-radius: var(--el-border-radius-base);

            img {
              width: auto;
              height: 90%;
              border-radius: var(--el-border-radius-base);
            }

            h1 {
              font-size: 20px;
              font-weight: 400;
              color: var(--el-color-black);
            }
          }

          &__handle {
            margin: var(--el-margin) 0 var(--el-margin);
          }
        }
      }
    }

    .el-image {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 212px;
      height: 120px;
      font-size: var(--el-font-size-bigger);
      color: var(--el-text-color-secondary);
      background: var(--el-fill-color-light);
      background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAQMAAAAlPW0iAAAAA3NCSVQICAjb4U/gAAAABlBMVEXMzMz////TjRV2AAAACXBIWXMAAArrAAAK6wGCiw1aAAAAHHRFWHRTb2Z0d2FyZQBBZG9iZSBGaXJld29ya3MgQ1M26LyyjAAAABFJREFUCJlj+M/AgBVhF/0PAH6/D/HkDxOGAAAAAElFTkSuQmCC);
      border: 1px solid var(--el-border-color);
      border-radius: var(--el-border-radius-base);

      img {
        width: auto;
        height: 90%;
        border-radius: var(--el-border-radius-base);
      }
    }
  }
}
</style>
