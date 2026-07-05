<template>
  <!--#region 试验分期库管理页面 -->
  <t-card bordered style="height: calc(100vh - 86px)">
    <!-- 页面标题 -->
    <div style="margin-bottom: 16px">
      <h2 style="margin: 0 0 16px 0; font-size: 18px; font-weight: 600; color: var(--td-text-color-primary)">
        试验分期库管理
      </h2>

      <!--#region 搜索表单 -->
      <div
        style="
          background: #f8fafc;
          padding: 16px;
          border-radius: 12px;
          border: 1px solid var(--td-border-level-1-color);
          margin-bottom: 16px;
        "
      >
        <t-form
          ref="formRef"
          :data="formData"
          layout="inline"
          label-width="120"
          style="display: flex; gap: 16px 0; flex-wrap: wrap"
          @submit="onSearch"
        >
          <t-form-item label="分期名称" name="searchKey" style="margin-bottom: 0">
            <t-input
              v-model="formData.searchKey"
              placeholder="请输入原始分期或清洗后分期"
              clearable
              style="width: 280px"
            />
          </t-form-item>
          <div style="display: flex; align-items: center; margin-left: auto">
            <t-space>
              <t-button theme="default" variant="base" @click="onReset" style="background: #fff"> 重置 </t-button>
              <t-button theme="primary" type="submit"> 搜索 </t-button>
            </t-space>
          </div>
        </t-form>
      </div>
      <!--#endregion-->
    </div>

    <!--#region 数据表格 -->
    <t-table
      :data="dataList"
      :columns="columns"
      row-key="id"
      :loading="loading"
      bordered
      stripe
      table-layout="fixed"
      max-height="calc(100vh - 290px)"
      style="white-space: nowrap"
      :pagination="pagination"
      @page-change="onPageChange"
    >
      <template #operation="{ row }">
        <t-button theme="primary" @click="openEditModal(row)"> 编辑 </t-button>
      </template>
    </t-table>
    <!--#endregion-->

    <!--#region 编辑/新增弹窗 -->
    <t-dialog
      v-model:visible="editModalVisible"
      header="编辑试验分期"
      width="600px"
      :confirm-btn="{ content: '保存', theme: 'primary', loading: editLoading }"
      @confirm="submitEdit"
      @close="onEditModalClose"
    >
      <t-form ref="editFormRef" :data="editFormData" label-width="140" label-align="left">
        <t-form-item label="原始分期" name="trialStages">
          <t-input v-model="editFormData.trialStages" placeholder="请输入原始分期，如 I期" />
        </t-form-item>
        <t-form-item label="清洗后分期" name="cleanedTrialStages">
          <t-input v-model="editFormData.cleanedTrialStages" placeholder="多个分期用;分隔，如 I期;II期" />
        </t-form-item>
      </t-form>
    </t-dialog>
    <!--#endregion-->
  </t-card>
  <!--#endregion-->
</template>

<script setup lang="ts">
//#region Imports
import { ref, reactive, h, onMounted } from 'vue';
import { MessagePlugin } from 'tdesign-vue-next';
import moment from 'moment';
import { trialStageApi } from '@/api';
import type { CdeTrialStagesMapping } from '@/api/types/trialStage';
//#endregion

//#region State
const formRef = ref();
const editFormRef = ref();
const loading = ref(false);
const dataList = ref<CdeTrialStagesMapping[]>([]);
const pagination = reactive({
  current: 1,
  pageSize: 20,
  total: 0,
  showJumper: true,
});

const formData = reactive<Record<string, any>>({
  searchKey: '',
});

const editModalVisible = ref(false);
const editLoading = ref(false);
const isAddMode = ref(false);
const currentEditRecord = ref<CdeTrialStagesMapping | null>(null);

const editFormData = reactive<Record<string, any>>({
  trialStages: '',
  cleanedTrialStages: '',
});
//#endregion

//#region Columns Definition
const columns = [
  {
    colKey: 'rowIndex',
    title: '序号',
    width: 80,
    cell: (h: any, { rowIndex }: any) => rowIndex + 1 + (pagination.current - 1) * pagination.pageSize,
  },
  { colKey: 'trialStages', title: '原试验期（源数据）', width: 200 },
  {
    colKey: 'cleanedTrialStages',
    title: '试验分期（清洗后）',
    width: 300,
    cell: (h: any, { row }: any) => row.cleanedTrialStages || '-',
  },
  {
    colKey: 'updateTime',
    title: '更新时间',
    width: 170,
    cell: (h: any, { row }: any) => (row.updateTime ? moment(row.updateTime).format('YYYY-MM-DD HH:mm:ss') : '-'),
  },
  { colKey: 'updateUser', title: '操作人', width: 100, cell: (h: any, { row }: any) => row.updateUser || '-' },
  {
    colKey: 'operation',
    title: '操作',
    width: 80,
    fixed: 'right' as const,
  },
];
//#endregion

//#region Data Fetching
const fetchData = async (curr = pagination.current, size = pagination.pageSize) => {
  loading.value = true;
  try {
    const params: Record<string, any> = {
      ...formData,
      pageNum: curr,
      pageSize: size,
    };
    const res = await trialStageApi.pageData(params);
    dataList.value = res.data?.list || [];
    pagination.current = curr;
    pagination.pageSize = size;
    pagination.total = res.data?.total || 0;
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }
};

const onSearch = () => fetchData(1);

const onReset = () => {
  formData.searchKey = '';
  fetchData(1);
};

const onPageChange = (pageInfo: any) => {
  fetchData(pageInfo.current, pageInfo.pageSize);
};
//#endregion

//#region Edit Modal
const openEditModal = (record: CdeTrialStagesMapping) => {
  isAddMode.value = false;
  currentEditRecord.value = { ...record };
  editFormData.trialStages = record.trialStages || '';
  editFormData.cleanedTrialStages = record.cleanedTrialStages || '';
  editModalVisible.value = true;
};

const handleAdd = () => {
  isAddMode.value = true;
  currentEditRecord.value = null;
  editFormData.trialStages = '';
  editFormData.cleanedTrialStages = '';
  editModalVisible.value = true;
};

const submitEdit = async () => {
  editLoading.value = true;
  try {
    const submitData: CdeTrialStagesMapping = {
      ...currentEditRecord.value,
      trialStages: editFormData.trialStages,
      cleanedTrialStages: editFormData.cleanedTrialStages,
      cleanedTrialStagesList: editFormData.cleanedTrialStages.split('; '),
    };
    await trialStageApi.save(submitData);
    MessagePlugin.success('保存成功');
    editModalVisible.value = false;
    fetchData();
  } catch (e) {
    console.error(e);
  } finally {
    editLoading.value = false;
  }
};

const onEditModalClose = () => {
  editModalVisible.value = false;
  currentEditRecord.value = null;
};
//#endregion

//#region Lifecycle
onMounted(() => {
  fetchData();
});
//#endregion
</script>
