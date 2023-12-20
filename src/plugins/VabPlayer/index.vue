<template>
  <div :id="config.id"></div>
</template>

<script lang="ts" setup>
import Player from 'xgplayer'
import 'xgplayer/dist/index.min.css'

defineOptions({
  name: 'VabPlayer',
})

const props = defineProps({
  config: {
    type: Object,
    default() {
      return {
        id: 'mse',
        url: '',
      }
    },
  },
})

const player = ref<any>(null)

const emit = defineEmits(['player'])

const init = () => {
  if (props.config.url && props.config.url !== '') {
    player.value = new Player(props.config)
    emit('player', player.value)
  }
}

watch(
  props.config,
  () => {
    init()
  },
  { deep: true }
)

onMounted(() => {
  init()
})

onBeforeMount(() => {
  player.value && typeof player.value.destroy === 'function' && player.value.destroy()
})
</script>

<style lang="scss">
.xgplayer {
  &-progress-played {
    background: var(--el-color-primary) !important;
  }

  &-progress-btn {
    background: var(--el-color-primary-light-9) !important;
    border: 0.5px solid var(--el-color-primary-light-9) !important;
    box-shadow: 0 0 1px var(--el-color-primary) !important;
  }

  &-progress-btn.active {
    border: 4px solid var(--el-color-primary-light-9) !important;
  }

  &-progress-btn.active:before {
    box-shadow: 0 0 3px var(--el-color-primary) !important;
  }

  .xg-options-list {
    li:hover,
    li.selected {
      color: var(--el-color-primary) !important;
    }
  }

  &-drag {
    background: var(--el-color-primary) !important;
  }
}
</style>
