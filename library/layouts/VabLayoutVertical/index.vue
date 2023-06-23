<!-- 纵向布局 -->
<script lang="ts" setup>
  import { useSettingsStore } from '/@/store/modules/settings'

  defineProps({
    collapse: {
      type: Boolean,
      default() {
        return false
      },
    },
    fixedHeader: {
      type: Boolean,
      default() {
        return true
      },
    },
    showTabs: {
      type: Boolean,
      default() {
        return true
      },
    },
    device: {
      type: String,
      default() {
        return 'desktop'
      },
    },
  })

  const settingsStore = useSettingsStore()
  const { foldSideBar } = settingsStore
</script>

<template>
  <div
    :class="{
      fixed: fixedHeader,
      'no-tabs-bar': !showTabs,
    }"
    class="vab-layout-vertical"
  >
    <vab-side-bar />
    <div
      v-if="device === 'mobile' && !collapse"
      class="v-modal"
      @click="foldSideBar"
    />
    <div
      :class="{
        'is-collapse-main': collapse,
        'is-no-tabs': !showTabs,
      }"
      class="vab-main"
    >
      <div
        :class="{
          'fixed-header': fixedHeader,
          'is-no-tabs': !showTabs,
        }"
        class="vab-layout-header"
      >
        <vab-nav />
        <vab-tabs v-show="showTabs" />
      </div>
      <vab-app-main />
    </div>
  </div>
</template>
