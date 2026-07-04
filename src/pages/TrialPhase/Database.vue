<template>
  <!--#region 试验分期库管理页面 -->
  <t-card bordered>
    <div style="margin-bottom: 16px">
      <h2 style="margin: 0 0 16px 0; font-size: 18px; font-weight: 600; color: var(--td-text-color-primary)">
        试验分期库管理
      </h2>

      <!--#region 搜索与操作栏 -->
      <div style="margin-bottom: 16px; display: flex; justify-content: space-between; align-items: center">
        <t-space>
          <t-input v-model="searchKeyword" placeholder="搜索分期名称" clearable style="width: 220px" />
          <t-button theme="primary" @click="onSearch">搜索</t-button>
        </t-space>
        <t-button theme="primary" @click="handleAdd">新增试验分期</t-button>
      </div>
      <!--#endregion-->
    </div>

    <!--#region 数据表格 -->
    <t-table
      :data="filteredData"
      :columns="columns"
      row-key="id"
      :loading="loading"
      bordered
      stripe
      table-layout="auto"
      hover
      :pagination="pagination"
      @page-change="onPageChange"
    />
    <!--#endregion-->

    <!--#region 编辑/新增弹窗 -->
    <t-dialog
      v-model:visible="editModalVisible"
      :header="isAddMode ? '新增试验分期' : '编辑试验分期'"
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
          <t-tag-input v-model="editFormData.cleanedTrialStagesList" placeholder="输入后回车添加" clearable />
        </t-form-item>
      </t-form>
    </t-dialog>
    <!--#endregion-->
  </t-card>
  <!--#endregion-->
</template>

<script setup lang="ts">
//#region Imports
import { ref, reactive, h, computed, onMounted } from 'vue';
import { MessagePlugin } from 'tdesign-vue-next';
import moment from 'moment';
import { trialStageApi } from '@/api';
import type { CdeTrialStagesMapping } from '@/api/types/trialStage';
//#endregion

//#region State
const editFormRef = ref();
const loading = ref(false);
const dataList = ref<CdeTrialStagesMapping[]>([]);
const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0,
  showJumper: true,
});

const searchKeyword = ref('');
const editModalVisible = ref(false);
const editLoading = ref(false);
const isAddMode = ref(false);
const currentEditRecord = ref<CdeTrialStagesMapping | null>(null);

const editFormData = reactive<Record<string, any>>({
  trialStages: '',
  cleanedTrialStagesList: [],
});

const filteredData = computed(() => {
  const keyword = searchKeyword.value?.toLowerCase() || '';
  if (!keyword) return dataList.value;
  return dataList.value.filter(
    (item) =>
      item.trialStages?.toLowerCase().includes(keyword) || item.cleanedTrialStages?.toLowerCase().includes(keyword),
  );
});
//#endregion

//#region Columns Definition
const columns = [
  { colKey: 'id', title: '序号', width: 80 },
  { colKey: 'trialStages', title: '原始分期', width: 200 },
  {
    colKey: 'cleanedTrialStages',
    title: '清洗后分期',
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
    width: 100,
    fixed: 'right' as const,
    cell: (h: any, { row }: any) =>
      h(
        't-button',
        {
          theme: 'primary',
          variant: 'text',
          onClick: () => openEditModal(row),
        },
        { default: () => '编辑' },
      ),
  },
];
//#endregion

//#region Data Fetching
const fetchData = async (curr = pagination.current, size = pagination.pageSize) => {
  loading.value = true;
  try {
    const res = await trialStageApi.pageData({ pageNum: curr, pageSize: size });
    if (res.code === 0) {
      dataList.value = res.data?.list || [];
      pagination.current = curr;
      pagination.pageSize = size;
      pagination.total = res.data?.total || 0;
    } else {
      MessagePlugin.error(res.msg || '查询失败');
    }
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }
};

const onSearch = () => {
  // computed handles filtering
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
  editFormData.cleanedTrialStagesList = record.cleanedTrialStagesList || [];
  editModalVisible.value = true;
};

const handleAdd = () => {
  isAddMode.value = true;
  currentEditRecord.value = null;
  editFormData.trialStages = '';
  editFormData.cleanedTrialStagesList = [];
  editModalVisible.value = true;
};

const submitEdit = async () => {
  editLoading.value = true;
  try {
    const submitData: CdeTrialStagesMapping = {
      ...currentEditRecord.value,
      trialStages: editFormData.trialStages,
      cleanedTrialStages: (editFormData.cleanedTrialStagesList || []).join('; '),
      cleanedTrialStagesList: editFormData.cleanedTrialStagesList || [],
    };
    const res = await trialStageApi.save(submitData);
    if (res.code === 0) {
      MessagePlugin.success(isAddMode.value ? '新增成功' : '保存成功');
      editModalVisible.value = false;
      fetchData();
    } else {
      MessagePlugin.error(res.msg || '保存失败');
    }
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
