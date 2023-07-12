<template>
  <el-dialog
    v-model="needRefresh"
    append-to-body
    class="vab-update"
    draggable
    width="410px"
    @close="close"
  >
    <template #header></template>
    <div class="vab-update-icon">
      <vab-icon icon="upload-cloud-2-fill" />
    </div>
    <vab-icon class="vab-update-cup" icon="cup-line" />
    <h3>版本更新：</h3>
    <p>
      {{ title }}
      V{{ version }}
    </p>
    <p>更新时间：最近更新</p>
    <template #footer>
      <el-button v-loading="loading" type="primary" @click="save">
        {{ button }}
      </el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
  import { version } from '~/package.json'
  import { useRegisterSW } from 'virtual:pwa-register/vue'
  import { useSettingsStore } from '/@/store/modules/settings'

  defineOptions({
    name: 'VabUpdate',
  })

  const { getTitle: title } = useSettingsStore()
  const { needRefresh, updateServiceWorker } = useRegisterSW()
  const button = ref<string>('立即升级')
  const loading = ref<boolean>(false)

  const save = async () => {
    button.value = '正在更新'
    loading.value = true
    await updateServiceWorker()
    loading.value = false
  }

  const close = async () => {
    needRefresh.value = true
  }

  onMounted(() => {
    setTimeout(() => {
      save()
    }, 1000 * 3)
  })
</script>

<style lang="scss" scoped>
  .vab-update {
    position: relative;

    &-icon {
      position: absolute;
      top: -50px;
      left: 50%;
      width: 100px;
      height: 100px;
      line-height: 100px;
      text-align: center;
      background: linear-gradient(
        50deg,
        var(--el-color-primary),
        var(--el-color-primary-light-7)
      );
      border-radius: 50%;
      transform: translateX(-50%);

      i {
        font-size: 50px;
        color: var(--el-color-white);
      }
    }

    &-cup {
      position: absolute;
      right: 20px;
      bottom: 70px;
      font-size: 80px;
      -webkit-text-fill-color: transparent;
      background-image: linear-gradient(
        var(--el-color-primary-light-7),
        var(--el-color-primary-light-9)
      );
      background-clip: text;
    }
  }
</style>

<style lang="scss">
  .vab-update {
    &.el-dialog {
      margin-top: 30vh !important;
      border-radius: 15px;

      .el-dialog__body {
        margin: 0 40px 0 40px;
      }

      .el-dialog__footer {
        text-align: center !important;

        .el-button {
          width: 200px;
          margin-bottom: 20px;
          background: linear-gradient(
            50deg,
            var(--el-color-primary-light-3),
            var(--el-color-primary)
          );
          border: 0;
          border-radius: 20px;
        }
      }
    }
  }
</style>
