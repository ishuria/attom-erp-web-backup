<template>
    <div class="radio-container no-background-container">
        <vab-card>
            <template #header>基础用法</template>
            <el-radio v-model="radio" :value="'1'">备选项1</el-radio>
            <el-radio v-model="radio" :value="'2'">备选项2</el-radio>
        </vab-card>
        <vab-card>
            <template #header>禁用状态</template>
            <el-radio v-model="radio2" disabled :value="'1'">禁用</el-radio>
            <el-radio v-model="radio2" disabled :value="'2'">选中且禁用</el-radio>
        </vab-card>
        <vab-card>
            <template #header>单选框组</template>
            <el-radio-group v-model="radio3">
                <el-radio :value="'1'">备选项1</el-radio>
                <el-radio :value="'2'">备选项2</el-radio>
                <el-radio :value="'3'">备选项3</el-radio>
            </el-radio-group>
        </vab-card>
        <vab-card>
            <template #header>按钮样式</template>
            <el-radio-group v-model="radio4">
                <el-radio-button v-for="city in cities" :key="city" :value="city">{{ city }}</el-radio-button>
            </el-radio-group>
        </vab-card>
        <vab-card>
            <template #header>带有边框</template>
            <el-radio v-model="radio5" border :value="'1'">备选项1</el-radio>
            <el-radio v-model="radio5" border :value="'2'">备选项2</el-radio>
        </vab-card>
    </div>
</template>

<script lang="ts" setup>
defineOptions({
    name: 'Radio',
})

const radio = ref<string>('1')
const radio2 = ref<string>('1')
const radio3 = ref<any>('1')
const cities = ref<any>(['上海', '北京', '广州', '深圳'])
const radio4 = ref<string>('上海')
const radio5 = ref<string>('1')
</script>
