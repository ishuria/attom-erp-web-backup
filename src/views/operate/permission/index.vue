<template>
  <div class="permission-container">
    <el-alert
      v-if="!loginInterception"
      :closable="false"
      show-icon
      title="检测到您当前的登录拦截已关闭，无法模拟切换角色功能，请在src/config/setting.config.js中配置loginInterception为true，开启登录拦截"
      type="success"
    />
    <el-alert
      :closable="false"
      :title="`当前路由模式为：${
        authentication === 'all' ? '后端路由' : '前端路由'
      } ，是否开启角色权限控制功能：${rolesControl === 'true' ? '是' : '否'}`"
    />

    <el-form label-position="top" label-width="140px" :model="form">
      <el-form-item label="账号切换">
        <el-radio-group v-model="form.account" @change="handleChangeRole">
          <el-radio-button label="admin">admin</el-radio-button>
          <el-radio-button label="editor">editor</el-radio-button>
          <el-radio-button label="test">test</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="当前账号">
        <el-descriptions border :column="3" direction="vertical">
          <el-descriptions-item>
            <template #label>角色</template>
            <el-tag>{{ JSON.stringify(role) }}</el-tag>
          </el-descriptions-item>
          <el-descriptions-item>
            <template #label>权限点</template>
            <el-tag>{{ JSON.stringify(permission) }}</el-tag>
          </el-descriptions-item>
          <el-descriptions-item>
            <template #label>token</template>
            <el-tag>{{ token }}</el-tag>
          </el-descriptions-item>
        </el-descriptions>
      </el-form-item>
      <el-form-item label="按钮级角色">
        <el-button v-permissions="['Admin']" type="primary">
          拥有["Admin"]的按钮
        </el-button>
        <el-button
          v-permissions="{ role: ['Admin'], mode: 'except' }"
          type="danger"
        >
          未拥有["Admin"]的按钮
        </el-button>
        <el-button v-permissions="['Editor']" type="primary">
          拥有["Editor"]的按钮
        </el-button>
        <el-button
          v-permissions="{ role: ['Editor'], mode: 'except' }"
          type="danger"
        >
          未拥有["Editor"]的按钮
        </el-button>
        <el-button
          v-permissions="{ role: ['Admin', 'Editor'], mode: 'allOf' }"
          type="primary"
        >
          同时拥有["Admin","Editor"]的按钮
        </el-button>
        <el-button v-permissions="['Test']" type="primary">
          拥有["Test"]的按钮
        </el-button>
      </el-form-item>
      <!--  注意其中roles-代表组件name，这样可以区分到具体页面 -->
      <el-form-item label="按钮级权限点">
        <el-button
          v-permissions="{ permission: ['read:system'] }"
          type="primary"
        >
          拥有["read:system"]的按钮
        </el-button>
        <el-button
          v-permissions="{ permission: ['read:system'], mode: 'except' }"
          type="danger"
        >
          未拥有["'read:system'"]的按钮
        </el-button>
        <el-button
          v-permissions="{ permission: ['write:system'] }"
          type="primary"
        >
          拥有["write:system"]的按钮
        </el-button>
        <el-button
          v-permissions="{ permission: ['write:system'], mode: 'except' }"
          type="danger"
        >
          未拥有["write:system"]的按钮
        </el-button>
        <el-button
          v-permissions="{ permission: ['delete:system'] }"
          type="primary"
        >
          拥有["delete:system"]的按钮
        </el-button>
        <el-button
          v-permissions="{ permission: ['delete:system'], mode: 'except' }"
          type="danger"
        >
          未拥有["delete:system"]的按钮
        </el-button>
      </el-form-item>
      <el-form-item label="按钮级角色&权限点">
        <el-button
          v-permissions="{ role: ['Admin'], permission: ['delete:system'] }"
          type="primary"
        >
          拥有["Admin"]或["delete:system"]的按钮
        </el-button>
        <el-button
          v-permissions="{
            role: ['Editor'],
            permission: ['read:system'],
            mode: 'allOf',
          }"
          type="primary"
        >
          拥有["Editor"]和["read:system"]的按钮
        </el-button>
        <el-button
          v-permissions="{
            role: ['Admin'],
            permission: ['delete:system'],
            mode: 'except',
          }"
          type="danger"
        >
          未拥有["Admin"]和["delete:system"]的按钮
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts" setup>
  import { useAclStore } from '/@/store/modules/acl'
  import { useUserStore } from '/@/store/modules/user'
  import {
    authentication,
    loginInterception,
    rolesControl,
    tokenTableName,
  } from '/@/config'
  import { uuid } from '/@/utils'

  defineOptions({
    name: 'Permission',
  })

  const $baseLoading = inject<any>('$baseLoading')
  const aclStore = useAclStore()
  const { role, permission } = storeToRefs(aclStore)
  const userStore = useUserStore()
  const { username, token } = storeToRefs(userStore)

  const form = reactive<any>({
    account: username.value,
  })

  const handleChangeRole = async () => {
    $baseLoading('正在切换账号请稍后...')
    await localStorage.setItem(
      tokenTableName,
      `${form.account}-token-${uuid()}-${new Date().getTime()}`
    )
    await location.reload()
  }
</script>

<style lang="scss" scoped>
  :deep() {
    .el-button {
      margin-right: 10px;
    }

    .el-button + .el-button {
      margin-right: 10px;
      margin-left: 0;
    }

    .el-form-item {
      margin-bottom: 0;

      .el-form-item__content {
        > * {
          margin-bottom: 10px;
        }
      }
    }
  }
</style>
