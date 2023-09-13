<template>
  <div class="scroll-text-container global-animation-disabled">
    <tiny-scroll-text direction="left" :time="25"><div v-html="text"></div></tiny-scroll-text>
    <tiny-scroll-text direction="right" :time="25"><div v-html="text"></div></tiny-scroll-text>
    <tiny-scroll-text direction="up" :time="3">
      <div style="text-overflow: ellipsis; word-break: break-all; white-space: nowrap" v-html="text"></div>
    </tiny-scroll-text>
    <tiny-scroll-text direction="down" :time="3">
      <div style="text-overflow: ellipsis; word-break: break-all; white-space: nowrap" v-html="text"></div>
    </tiny-scroll-text>
  </div>
</template>

<script lang="ts" setup>
import { ScrollText as TinyScrollText } from '@opentiny/vue'
import { getList } from '/@/api/description'

defineOptions({
  name: 'ScrollText',
})

const text = ref<string>('')

const fetchData = async () => {
  const { data } = await getList()
  text.value = data.description
}

onBeforeMount(() => {
  fetchData()
})
</script>

<style lang="scss" scoped>
.scroll-text-container {
  :deep() {
    .tiny-scroll-text {
      width: 100%;
      color: var(--el-color-primary);
      background-color: var(--el-color-primary-light-9);
      border: 1px solid var(--el-color-primary);
      border-radius: var(--el-border-radius-base);

      &__wrapper {
        margin-bottom: var(--el-margin);
      }
    }
  }
}
</style>
