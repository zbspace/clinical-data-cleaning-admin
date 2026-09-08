<template>
  <!-- #region FormTip 提示图标 -->
  <el-tooltip :content="content" :placement="placement" :effect="effect">
    <el-icon class="cursor-pointer align-middle c-red">
      <QuestionFilled />
    </el-icon>
  </el-tooltip>
  <!-- #endregion -->
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    content: string
    placement?: 'top' | 'bottom' | 'left' | 'right'
    effect?: 'dark' | 'light'
  }>(),
  {
    placement: 'top',
    effect: 'dark',
  },
)
</script>

<style scoped>
.el-icon {
  margin-left: 4px;
  color: #909399;
}
</style>
