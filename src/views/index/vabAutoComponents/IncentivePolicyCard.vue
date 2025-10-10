<template>
  <vab-card class="incentive-policy-card">
    <template #header>
      <vab-icon icon="information-line" />
      激励政策
      <div class="right-select">
        <!-- Boss 角色显示下拉框 -->
        <el-select v-if="isBoss" v-model="selectedRole" filterable placeholder="选择角色" @change="handleRoleChange">
          <el-option v-for="role in roleList" :key="role.roleId" :label="role.roleName" :value="role.roleId" />
        </el-select>
        <!-- 其他角色显示角色名称 -->
        <el-tag v-else type="primary">{{ currentRoleName }}</el-tag>
      </div>
    </template>

    <div class="incentive-policy-content">
      <wang-editor-viewer v-if="currentPolicy && currentPolicy.trim()" :content="currentPolicy" />
      <el-empty v-else description="暂无激励政策" />
    </div>
  </vab-card>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue'
import WangEditorViewer from './WangEditorViewer.vue'
import { getAllList } from '/@/api/devlocal/role'
import { ROLE_BOSS_CODE } from '/@/const/role'
import { useAclStore } from '/@/store/modules/acl'
import type { IRoleRes } from '/@/type/role/roleType'

defineOptions({
  name: 'IncentivePolicyCard',
})

const aclStore = useAclStore()

// 角色列表
const roleList = ref<IRoleRes[]>([])
// 选中的角色id
const selectedRole = ref<number>(0)

// 判断是否为 Boss 角色
const isBoss = computed(() => aclStore.getRole.includes(ROLE_BOSS_CODE))

// 当前角色名称
const currentRoleName = computed(() => {
  if (isBoss.value) {
    const role = roleList.value.find((r) => r.roleId === selectedRole.value)
    return role?.roleName || '请选择角色'
  } else {
    // 对于非Boss角色，从roleList中找到对应的角色名称
    const userRoleCode = aclStore.getRole[0]
    const userRole = roleList.value.find((r) => r.roleCode === userRoleCode)
    return userRole?.roleName || '未知角色'
  }
})

// 当前显示的激励政策
const currentPolicy = ref<string>('')

// 获取角色列表
const fetchRoleList = async () => {
  try {
    const { data } = await getAllList({ pageNo: 1, pageSize: 100, role: '' })
    // 过滤掉状态为1的角色
    roleList.value = data.list.filter((r) => r.status === '0' && r.roleCode !== ROLE_BOSS_CODE)

    // 根据用户权限设置默认选中的角色
    if (aclStore.getRole.includes(ROLE_BOSS_CODE)) {
      // Boss 可以看到所有角色，默认显示第一个
      if (roleList.value.length > 0) {
        selectedRole.value = roleList.value[0].roleId
        currentPolicy.value = roleList.value[0].incentivePolicy || ''
      }
    } else {
      // 其他角色只能看到自己的角色
      const userRole = aclStore.getRole[0]
      const currentUserRole = roleList.value.find((r) => r.roleCode === userRole)
      if (currentUserRole) {
        selectedRole.value = currentUserRole.roleId
        currentPolicy.value = currentUserRole.incentivePolicy || ''
      }
    }
  } catch (error) {
    console.error('获取角色列表失败:', error)
  }
}
const handleRoleChange = () => {
  if (!selectedRole.value) return ''

  const role = roleList.value.find((r) => r.roleId === selectedRole.value)
  currentPolicy.value = role?.incentivePolicy || ''
}
// 组件挂载时获取数据
onMounted(() => {
  fetchRoleList()
})
</script>

<style lang="scss" scoped>
.incentive-policy-card {
  height: 478px;
  display: flex;
  flex-direction: column;

  :deep(.el-card__body) {
    padding-top: 0px;
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: scroll;
  }

  .incentive-policy-content {
    height: 100%;
  }
  .right-select {
    position: absolute;
    top: 50%;
    right: 25px;
    width: 140px;
    height: 60px;
    line-height: 60px;
    transform: translateY(-50%);
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 10px;
    z-index: 10;
  }
}
</style>
