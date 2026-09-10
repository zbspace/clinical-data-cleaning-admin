<template>
  <div
    class="auth-page-wrapper"
    style="
      height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    "
  >
    <div style="display: flex; flex-direction: column; align-items: center; margin-bottom: 10vh">
      <el-card
        shadow="never"
        :body-style="{ padding: '0' }"
        style="
          width: 420px;
          padding: 24px;
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(20px);
          border-radius: 24px;
          box-shadow:
            0 20px 40px rgba(15, 23, 42, 0.08),
            0 1px 3px rgba(15, 23, 42, 0.05);
        "
      >
        <div style="text-align: center; margin-bottom: 32px">
          <h1
            style="
              margin: 0;
              font-size: 24px;
              color: var(--el-text-color-primary);
              letter-spacing: -0.02em;
            "
          >
            临床数据清洗系统
          </h1>
          <p style="margin: 8px 0 0 0; color: var(--el-text-color-secondary); font-size: 14px">
            欢迎回来，请输入您的管理员账号
          </p>
        </div>

        <el-form
          ref="formRef"
          :model="formData"
          :rules="formRules"
          label-width="0"
          @submit.prevent="onSubmit"
        >
          <!--#region 账号输入 -->
          <el-form-item prop="username">
            <el-input
              v-model="formData.username"
              size="large"
              placeholder="请输入账号"
              clearable
              :prefix-icon="Monitor"
            >
              <template #prefix>
                <Monitor />
              </template>
            </el-input>
          </el-form-item>
          <!--#endregion-->

          <!--#region 密码输入 -->
          <el-form-item prop="password" style="margin-top: 24px">
            <el-input
              v-model="formData.password"
              size="large"
              type="password"
              placeholder="请输入密码"
              clearable
              :prefix-icon="Lock"
            >
              <template #prefix>
                <Lock />
              </template>
            </el-input>
          </el-form-item>
          <!--#endregion-->

          <!--#region 验证码区域 -->
          <div style="display: flex; gap: 12px">
            <div style="width: 200px">
              <el-form-item prop="captchaCode">
                <el-input
                  v-model="formData.captchaCode"
                  size="large"
                  placeholder="请输入验证码"
                  clearable
                />
              </el-form-item>
            </div>
            <div
              @click="fetchCaptcha"
              title="点击刷新验证码"
              style="
                cursor: pointer;
                height: 40px;
                width: 120px;
                border-radius: 8px;
                overflow: hidden;
                display: flex;
                align-items: center;
                justify-content: center;
                border: 1px solid var(--el-border-color);
                background: #f5f5f5;
              "
            >
              <img
                v-if="captchaImg"
                :src="captchaImg"
                alt="验证码"
                style="width: 100%; height: 100%; object-fit: contain"
              />
              <Refresh v-else />
            </div>
          </div>
          <!--#endregion-->

          <!--#region 登录按钮 -->
          <el-form-item style="margin-top: 32px">
            <el-button
              size="large"
              type="primary"
              native-type="submit"
              class="!w-full"
              :loading="loading"
              style="height: 48px; font-size: 16px"
            >
              登录
            </el-button>
          </el-form-item>
          <!--#endregion-->
        </el-form>
      </el-card>

      <div style="margin-top: 40px; color: var(--el-text-color-placeholder); font-size: 13px">
        &copy; {{ currentYear }} Clinical Data Intelligence
      </div>
    </div>
  </div>
  <!--#endregion-->
</template>

<script setup lang="ts">
defineOptions({ name: 'Login' })

//#region Imports
import { ref, reactive, onMounted, onUnmounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { Monitor, Lock, Refresh } from '@element-plus/icons-vue'
import { authApi } from '@/api'
import { useAuthStore } from '@/store/auth'
//#endregion

//#region State
const router = useRouter()
const authStore = useAuthStore()
const formRef = ref<FormInstance>()
const loading = ref(false)
const captchaKey = ref('')
const captchaImg = ref('')

const formData = reactive({
  username: '',
  password: '',
  captchaCode: '',
})

const formRules: FormRules = {
  username: [{ required: true, message: '请输入账号', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
  captchaCode: [{ required: true, message: '请输入验证码', trigger: 'blur' }],
}

const currentYear = computed(() => new Date().getFullYear())
//#endregion

//#region Captcha
const fetchCaptcha = async () => {
  try {
    const res: any = await authApi.getCaptcha()
    console.log(1111, res)

    const blob = res.data
    const key = res.headers?.['captcha-key'] || res.headers?.['Captcha-Key'] || ''

    if (blob) {
      // 清理旧的 object URL
      if (captchaImg.value) {
        URL.revokeObjectURL(captchaImg.value)
      }
      captchaKey.value = key
      captchaImg.value = URL.createObjectURL(blob)
    }
  } catch (error) {
    console.error('获取验证码失败', error)
  }
}
//#endregion

//#region Lifecycle
onMounted(() => {
  fetchCaptcha()
})

onUnmounted(() => {
  if (captchaImg.value) {
    URL.revokeObjectURL(captchaImg.value)
  }
})
//#endregion

//#region Submit
const onSubmit = async () => {
  // 表单校验不通过则中断提交
  const validateResult = await formRef.value?.validate().catch(() => false)
  if (validateResult !== true) return

  loading.value = true
  try {
    const { username, password, captchaCode } = formData
    const res: any = await authApi.login({
      username,
      password,
      captcha: captchaCode,
      captchaKey: captchaKey.value,
    })

    const token = res.data?.token || res.data || res.token
    if (token) {
      authStore.setToken(typeof token === 'string' ? token : JSON.stringify(token))
    } else {
      authStore.setToken('mock_token_' + new Date().getTime())
    }

    ElMessage.success('登录成功')
    router.push('/overview')
  } catch (error) {
    console.error('登录异常', error)
    // 登录失败刷新验证码
    fetchCaptcha()
  } finally {
    loading.value = false
  }
}
//#endregion
</script>

<style scoped>
.auth-page-wrapper {
  font-family:
    -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}
</style>
