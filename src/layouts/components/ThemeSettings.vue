<template>
  <div class="theme-settings">
    <el-switch
      :model-value="appStore.darkMode"
      @change="appStore.toggleDarkMode()"
      :active-icon="Moon"
      :inactive-icon="Sunny"
      inline-prompt
    />
    <!-- <el-tooltip content="主题设置" placement="bottom">
      <el-icon class="theme-btn" :size="18" @click="visible = !visible">
        <MagicStick />
      </el-icon>
    </el-tooltip>

    <el-dialog
      v-model="visible"
      title="主题设置"
      width="380px"
      top="30vh"
      :close-on-click-modal="false"
      destroy-on-close
    >
      <div class="theme-content">
        <div class="theme-item">
          <div class="theme-item__label">
            <el-icon><MoonNight /></el-icon>
            <span>深色模式</span>
          </div>
          <el-switch :model-value="appStore.darkMode" @change="appStore.toggleDarkMode()" />
        </div>

        <el-divider />

        <div class="theme-item">
          <div class="theme-item__label">
            <el-icon><Brush /></el-icon>
            <span>主题色</span>
          </div>
          <div class="color-list">
            <div
              v-for="color in themeColors"
              :key="color.value"
              class="color-item"
              :class="{ active: appStore.primaryColor === color.value }"
              :style="{ backgroundColor: color.value }"
              :title="color.name"
              @click="appStore.setPrimaryColor(color.value)"
            >
              <el-icon v-if="appStore.primaryColor === color.value" class="color-item__check">
                <Check />
              </el-icon>
            </div>
          </div>
        </div>
      </div>
    </el-dialog> -->
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAppStore, themeColors } from '@/store'
import { Sunny, Moon } from '@element-plus/icons-vue'

const appStore = useAppStore()
const visible = ref(false)
</script>

<style scoped lang="scss">
.theme-btn {
  cursor: pointer;
  color: var(--el-text-color-secondary);
  transition: all 0.3s;
  padding: 6px;
  border-radius: 6px;

  &:hover {
    color: var(--el-color-primary);
    background-color: var(--el-color-primary-light-9);
  }
}

.theme-content {
  padding: 4px 0;
}

.theme-item {
  display: flex;
  align-items: center;
  justify-content: space-between;

  &__label {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    color: var(--el-text-color-primary);
  }
}

.color-list {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.color-item {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  cursor: pointer;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  transition:
    transform 0.2s,
    box-shadow 0.2s;
  border: 2px solid transparent;

  &:hover {
    transform: scale(1.15);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  }

  &.active {
    border-color: var(--el-color-primary);
    box-shadow:
      0 0 0 2px rgba(255, 255, 255, 0.8),
      0 0 0 4px currentColor;
  }

  &__check {
    color: #fff;
    font-size: 16px;
    font-weight: 700;
  }
}
</style>
