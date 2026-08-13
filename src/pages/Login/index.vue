<template>
  <!--#region 登录页面 -->
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
      <!-- Logo/Brand Icon -->
      <!--#region Logo区域 -->
      <div
        style="
          width: 64px;
          height: 64px;
          border-radius: 16px;
          background: linear-gradient(135deg, var(--td-brand-color-4), var(--td-brand-color-7));
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          margin-bottom: 24px;
          box-shadow: 0 8px 24px rgba(3, 105, 161, 0.25);
        "
      >
        <DesktopIcon size="32px" />
      </div>
      <!--#endregion-->

      <t-card
        bordered
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
          <h1 style="margin: 0; font-size: 24px; color: var(--td-text-color-primary); letter-spacing: -0.02em">
            临床数据清洗系统
          </h1>
          <p style="margin: 8px 0 0 0; color: var(--td-text-color-secondary); font-size: 14px">
            欢迎回来，请输入您的管理员账号
          </p>
        </div>

        <t-form ref="formRef" :data="formData" :rules="formRules" @submit="onSubmit" label-width="0">
          <!--#region 账号输入 -->
          <t-form-item name="username">
            <t-input v-model="formData.username" size="large" placeholder="请输入账号" clearable>
              <template #prefix-icon>
                <DesktopIcon />
              </template>
            </t-input>
          </t-form-item>
          <!--#endregion-->

          <!--#region 密码输入 -->
          <t-form-item name="password" style="margin-top: 24px">
            <t-input v-model="formData.password" size="large" type="password" placeholder="请输入密码" clearable>
              <template #prefix-icon>
                <LockOnIcon />
              </template>
            </t-input>
          </t-form-item>
          <!--#endregion-->

          <!--#region 验证码区域 -->
          <div style="display: flex; gap: 12px">
            <div style="width: 200px">
              <t-form-item name="captchaCode">
                <t-input v-model="formData.captchaCode" size="large" placeholder="请输入验证码" clearable />
              </t-form-item>
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
                border: 1px solid var(--td-border-level-1-color);
                background: #f5f5f5;
              "
            >
              <img
                v-if="captchaImg"
                :src="captchaImg"
                alt="验证码"
                style="width: 100%; height: 100%; object-fit: contain"
              />
              <RefreshIcon v-else />
            </div>
          </div>
          <!--#endregion-->

          <!--#region 登录按钮 -->
          <t-form-item style="margin-top: 32px">
            <t-button
              size="large"
              theme="primary"
              type="submit"
              block
              :loading="loading"
              style="height: 48px; font-size: 16px"
            >
              登录
            </t-button>
          </t-form-item>
          <!--#endregion-->
        </t-form>
      </t-card>

      <div style="margin-top: 40px; color: var(--td-text-color-placeholder); font-size: 13px">
        &copy; {{ currentYear }} Clinical Data Intelligence
      </div>
    </div>
  </div>
  <!--#endregion-->
</template>

<script setup lang="ts">
//#region Imports
import { ref, reactive, onMounted, onUnmounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { MessagePlugin } from 'tdesign-vue-next';
import { DesktopIcon, LockOnIcon, RefreshIcon } from 'tdesign-icons-vue-next';
import { authApi } from '@/api';
import { useAuthStore } from '@/store/auth';
//#endregion

//#region State
const router = useRouter();
const authStore = useAuthStore();
const formRef = ref();
const loading = ref(false);
const captchaKey = ref('');
const captchaImg = ref('');

const formData = reactive({
  username: '',
  password: '',
  captchaCode: '',
});

const formRules = {
  username: [{ required: true, message: '请输入账号', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
  captchaCode: [{ required: true, message: '请输入验证码', trigger: 'blur' }],
};

const currentYear = computed(() => new Date().getFullYear());
//#endregion

//#region Captcha
const fetchCaptcha = async () => {
  try {
    const res: any = await authApi.getCaptcha();
    console.log(1111, res);

    const blob = res.data;
    const key = res.headers?.['captcha-key'] || res.headers?.['Captcha-Key'] || '';

    if (blob) {
      // 清理旧的 object URL
      if (captchaImg.value) {
        URL.revokeObjectURL(captchaImg.value);
      }
      captchaKey.value = key;
      captchaImg.value = URL.createObjectURL(blob);
    }
  } catch (error) {
    console.error('获取验证码失败', error);
  }
};
//#endregion

//#region Lifecycle
onMounted(() => {
  fetchCaptcha();
});

onUnmounted(() => {
  if (captchaImg.value) {
    URL.revokeObjectURL(captchaImg.value);
  }
});
//#endregion

//#region Submit
const onSubmit = async ({ validateResult }: any, context: any) => {
  if (validateResult !== true) return;

  loading.value = true;
  try {
    const { username, password, captchaCode } = formData;
    const res: any = await authApi.login({
      username,
      password,
      captcha: captchaCode,
      captchaKey: captchaKey.value,
    });

    const token = res.data?.token || res.data || res.token;
    if (token) {
      authStore.setToken(typeof token === 'string' ? token : JSON.stringify(token));
    } else {
      authStore.setToken('mock_token_' + new Date().getTime());
    }

    await MessagePlugin.success('登录成功');
    router.push('/overview');
  } catch (error) {
    console.error('登录异常', error);
    // 登录失败刷新验证码
    fetchCaptcha();
  } finally {
    loading.value = false;
  }
};
//#endregion
</script>

<style scoped>
.auth-page-wrapper {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}
</style>
