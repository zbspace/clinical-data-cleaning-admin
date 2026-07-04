<template>
  <!--#region 总览页面 -->
  <div>
    <h2 style="margin: 0 0 24px 0; font-size: 20px; font-weight: 600; color: var(--td-text-color-primary)">总览</h2>
    <t-row :gutter="[16, 16]">
      <t-col :span="3">
        <t-card bordered header-bordered>
          <t-statistic title="待清洗公司" :value="120" />
        </t-card>
      </t-col>
      <t-col :span="3">
        <t-card bordered header-bordered>
          <t-statistic title="待清洗药品" :value="345" />
        </t-card>
      </t-col>
      <t-col :span="3">
        <t-card bordered header-bordered>
          <t-statistic title="待清洗适应症" :value="56" />
        </t-card>
      </t-col>
      <t-col :span="3">
        <t-card bordered header-bordered>
          <t-statistic title="待清洗研究中心" :value="89" />
        </t-card>
      </t-col>
    </t-row>
  </div>
  <!--#endregion-->
</template>

<script setup lang="ts">
//#region Imports
// 当前页面使用纯静态数据，无需额外导入
//#endregion
</script>
