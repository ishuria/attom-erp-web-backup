<template>
  <vab-colorful-card class="page-header" :style="style">
    <el-avatar class="page-header-avatar hidden-xs-only" :src="avatar" />
    <div class="page-header-tip">
      <p class="page-header-tip-title">
        {{ handleTips() }}
      </p>
      <p class="page-header-tip-description" v-html="description"></p>
    </div>
  </vab-colorful-card>
</template>

<script lang="ts" setup>
import { getList } from '/@/api/description'
import { useUserStore } from '/@/store/modules/user'

const userStore = useUserStore()
const { avatar, username } = storeToRefs(userStore)

const description = ref<string>('')

const handleTips = () => {
  const hour = new Date().getHours()
  return hour < 8
    ? `早上好 ${username.value}，又是元气满满的一天。`
    : hour <= 11
    ? `上午好 ${username.value}，看到您我好开心。`
    : hour <= 13
    ? `中午好 ${username.value}，忙碌了一上午，记得吃午饭哦。`
    : hour < 18
    ? `下午好 ${username.value}，您一定有些累了，喝杯咖啡提提神。`
    : `晚上好 ${username.value}，愿您天黑有灯，下雨有伞。`
}
const fetchData = async () => {
  const { data } = await getList()
  description.value = data.description
}

onBeforeMount(() => {
  fetchData()
})

const colorFrom = ref<string>('var(--el-color-primary-light-9)')
const colorTo = ref<string>('var(--el-color-white)')
const style = {
  background: `${colorTo.value} linear-gradient(120deg, ${colorFrom.value} 10%, ${colorTo.value}) no-repeat`,
}
</script>

<style lang="scss" scoped>
.page-header {
  min-height: 135px;
  transition: none;

  :deep() {
    * {
      transition: none;
    }

    .el-card__body {
      display: flex;
      align-items: center;
      padding-top: 10px;
    }
  }

  &-avatar {
    width: 60px;
    height: 60px;
    padding: 12px;
    margin-right: 20px;
    border-radius: 50%;
  }

  &-tip {
    flex: auto;
    width: calc(100% - 200px);
    min-width: 300px;

    &-title {
      margin-bottom: 12px;
      font-size: 20px;
      font-weight: bold;
      color: #3c4a54;
    }

    &-description {
      min-height: 20px;
      font-size: var(--el-font-size-default);
      color: #808695;
    }
  }
}
</style>
