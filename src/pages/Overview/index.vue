<template>
  <!--#region 总览页面 -->
  <div>
    <h2 style="margin: 0 0 24px 0; font-size: 20px; font-weight: 600; color: var(--td-text-color-primary)">总览</h2>
    <t-row :gutter="[16, 16]">
      <t-col :span="3">
        <t-card bordered header-bordered>
          <t-statistic title="待清洗公司" :value="statData.company.pendingTotal ?? 0" />
        </t-card>
      </t-col>
      <t-col :span="3">
        <t-card bordered header-bordered>
          <t-statistic title="待清洗药品" :value="statData.drug.pendingTotal ?? 0" />
        </t-card>
      </t-col>
      <t-col :span="3">
        <t-card bordered header-bordered>
          <t-statistic title="待清洗适应症" :value="statData.indication.pendingTotal ?? 0" />
        </t-card>
      </t-col>
      <t-col :span="3">
        <t-card bordered header-bordered>
          <t-statistic title="待清洗研究中心" :value="statData.hospital.pendingTotal ?? 0" />
        </t-card>
      </t-col>
    </t-row>
  </div>
  <!--#endregion-->
</template>

<script setup lang="ts">
//#region Imports
import { reactive, onMounted } from 'vue';
import { companyApi, drugApi, hospitalApi, indicationApi } from '@/api';
import type { StatDataDto } from '@/api/types/company';
//#endregion

//#region State
const statData = reactive({
  company: {} as StatDataDto,
  drug: {} as StatDataDto,
  indication: {} as StatDataDto,
  hospital: {} as StatDataDto,
});
//#endregion

//#region Data Fetching
const fetchStats = async () => {
  try {
    const [companyRes, drugRes, indicationRes, hospitalRes] = await Promise.all([
      companyApi.getStatData({}),
      drugApi.getStatData({}),
      indicationApi.getStatData({}),
      hospitalApi.getStatData({}),
    ]);
    statData.company = companyRes.data || {};
    statData.drug = drugRes.data || {};
    statData.indication = indicationRes.data || {};
    statData.hospital = hospitalRes.data || {};
  } catch (e) {
    console.error('获取统计数据失败', e);
  }
};
//#endregion

//#region Lifecycle
onMounted(() => {
  fetchStats();
});
//#endregion
</script>
