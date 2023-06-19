<script lang="ts" setup>
  import clip from '/@/utils/clipboard'

  const lllustrationsArray: string[] = []

  const files: any = import.meta.glob('../../icon/lllustration/*.svg', {
    eager: true,
  })

  for (const key in files) {
    const _key = key.slice(11)
    lllustrationsArray.push(_key.substring(0, _key.length - 4))
  }

  const handleCopyIcon = (item: any) => {
    clip(
      `<vab-icon style="width:100%;height:300px" icon="${item}" is-custom-svg/>`
    )
  }
</script>

<template>
  <div class="lllustration-container no-background-container">
    <el-row :gutter="15">
      <el-col>
        <vab-card shadow="hover">
          <el-form :inline="true" class="demo-form-inline">
            <el-form-item label="换肤">
              <vab-color-picker />
            </el-form-item>
          </el-form>
        </vab-card>
      </el-col>
      <el-col
        v-for="(item, index) in lllustrationsArray"
        :key="index"
        :lg="4"
        :md="8"
        :sm="8"
        :xl="4"
        :xs="12"
      >
        <vab-card shadow="hover" @click="handleCopyIcon(item)">
          <vab-icon :icon="item" class="vab-lllustration" is-custom-svg />
        </vab-card>
      </el-col>
    </el-row>
  </div>
</template>

<style lang="scss" scoped>
  .lllustration-container {
    .vab-lllustration {
      width: 100%;
      height: 100%;
      cursor: pointer;
    }

    :deep() {
      .el-form-item {
        margin-bottom: 0px;
      }
    }
  }
</style>
