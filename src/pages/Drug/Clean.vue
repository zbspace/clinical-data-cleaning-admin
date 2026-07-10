<template>
  <!--#region 药品名清洗页面 -->
  <t-card bordered>
    <div style="margin-bottom: 16px">
      <h2 style="margin: 0 0 16px 0; font-size: 18px; font-weight: 600; color: var(--td-text-color-primary)">
        药品名清洗
      </h2>

      <!--#region 搜索表单 -->
      <div
        style="
          background: #f8fafc;
          padding: 16px;
          border-radius: 12px;
          border: 1px solid var(--td-border-level-1-color);
        "
      >
        <t-form
          ref="formRef"
          :data="formData"
          layout="inline"
          label-width="140"
          style="display: flex; gap: 16px 0; flex-wrap: wrap"
          @submit="onSearch"
        >
          <t-form-item label="药品名（清洗后）" name="drugStandardName" style="margin-bottom: 0">
            <t-input v-model="formData.drugStandardName" placeholder="请输入关键字" clearable style="width: 220px" />
          </t-form-item>
          <t-form-item label="清洗状态" name="status" style="margin-bottom: 0">
            <t-select
              v-model="formData.status"
              :options="statusOptions"
              placeholder="请选择状态"
              clearable
              style="width: 220px"
            />
          </t-form-item>
          <t-form-item label="公司名（清洗后）" name="companyId" style="margin-bottom: 0">
            <t-select
              v-model="formData.companyId"
              :options="companyOptions"
              placeholder="请选择公司"
              clearable
              filterable
              style="width: 220px"
              :keys="{ label: 'companyStandardName', value: 'id' }"
            />
          </t-form-item>
          <t-form-item label="母公司" name="parentCompanyId" style="margin-bottom: 0">
            <t-select
              v-model="formData.parentCompanyId"
              :options="companyOptions"
              placeholder="请选择母公司"
              clearable
              filterable
              style="width: 220px"
              :keys="{ label: 'parentCompanyShortName', value: 'parentCompanyId' }"
            />
          </t-form-item>
          <div style="display: flex; align-items: center; margin-left: auto">
            <t-button theme="default" @click="onReset" style="background: #fff; margin-right: 8px"> 重置 </t-button>
            <t-button theme="primary" type="submit"> 查询 </t-button>
          </div>
        </t-form>
      </div>
      <!--#endregion-->
    </div>

    <!--#region 数据表格 -->
    <t-table
      :data="tableData"
      :columns="columns"
      row-key="drugCommentId"
      :loading="loading"
      bordered
      stripe
      table-layout="fixed"
      max-height="calc(100vh - 290px)"
      hover
      :pagination="pagination"
      @page-change="onPageChange"
    >
      <template #operation="{ row }">
        <t-button theme="primary" @click="openEditModal(row)"> 编辑 </t-button>
      </template>
    </t-table>
    <!--#endregion-->

    <!--#region 相关备案/登记号弹窗 -->
    <t-dialog
      v-model:visible="accModalVisible"
      header="相关备案/登记号"
      :footer="false"
      width="880px"
      @close="onAccModalClose"
    >
      <t-table
        :data="accData"
        :columns="accColumns"
        :loading="accLoading"
        row-key="acceptanceNo"
        bordered
        :pagination="accPagination"
        @page-change="onAccPageChange"
      />
    </t-dialog>
    <!--#endregion-->

    <!--#region 编辑弹窗 -->
    <t-dialog
      v-model:visible="editModalVisible"
      header="编辑"
      width="600px"
      :confirm-btn="{ content: '提交', theme: 'primary', loading: editLoading }"
      @confirm="submitEdit"
      @close="onEditModalClose"
    >
      <div style="background-color: #f3f4f6; padding: 16px; margin-bottom: 16px; border-radius: 4px">
        <p style="margin: 0 0 8px 0">
          <strong>药品名（源数据）：</strong>
          {{ currentEditRecord?.drugNickName || currentEditRecord?.drugComment || currentEditRecord?.drugStandardName }}
        </p>
        <p style="margin: 0">
          <strong>药品类型：</strong>
          {{ currentEditRecord?.drugType || '化学药物' }}
        </p>
      </div>
      <t-form ref="editFormRef" :data="editFormData" label-width="180" label-align="left">
        <t-form-item label="药品名（清洗后）" name="cleanedName">
          <t-input v-model="editFormData.cleanedName" />
        </t-form-item>
        <t-form-item label="通用名（中文）" name="genericNameCn">
          <t-input v-model="editFormData.genericNameCn" />
        </t-form-item>
        <t-form-item label="通用名（英文）" name="genericNameEn">
          <t-input v-model="editFormData.genericNameEn" />
        </t-form-item>
        <t-form-item label="研发代号" name="rdCode">
          <t-input v-model="editFormData.rdCode" />
        </t-form-item>
        <t-form-item label="其他名（例如结构名称）" name="otherNames">
          <t-input v-model="editFormData.otherNames" />
        </t-form-item>
        <t-form-item label="剂型" name="dosageForm">
          <t-select v-model="editFormData.dosageForm" :options="dosageFormOptions" placeholder="请选择" />
        </t-form-item>
        <t-form-item label="药品类型" name="drugType">
          <t-select v-model="editFormData.drugType" :options="drugTypeOptions" placeholder="请选择" />
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
import { drugApi, companyApi } from '@/api';
//#endregion

//#region Constants
const statusOptions = [
  { label: '未清洗', value: 0 },
  { label: '已清洗', value: 1 },
  { label: '不用清洗', value: 2 },
];

const dosageFormOptions = [
  { label: '注射液', value: '注射液' },
  { label: '片剂', value: '片剂' },
  { label: '胶囊', value: '胶囊' },
  { label: '颗粒', value: '颗粒' },
];

const drugTypeOptions = [
  { label: '化学药物', value: '化学药物' },
  { label: '生物制品', value: '生物制品' },
  { label: '中药', value: '中药' },
];
//#endregion

//#region State
const formRef = ref();
const editFormRef = ref();
const loading = ref(false);
const tableData = ref<any[]>([]);
const pagination = reactive({
  current: 1,
  pageSize: 20,
  total: 0,
  showJumper: true,
});

const formData = reactive({
  drugStandardName: '',
  status: undefined as number | undefined,
  companyId: undefined as number | undefined,
  parentCompanyId: undefined as number | undefined,
});

// 公司选项
const companyOptions = ref<{ id?: number; companyStandardName?: string }[]>([]);

// 备案号弹窗
const accModalVisible = ref(false);
const accData = ref<any[]>([]);
const accLoading = ref(false);
const currentAccDrugId = ref<number | undefined>(undefined);
const accPagination = reactive({ current: 1, pageSize: 20, total: 0 });

// 编辑弹窗
const editModalVisible = ref(false);
const editLoading = ref(false);
const currentEditRecord = ref<any>(null);

const editFormData = reactive<Record<string, any>>({
  cleanedName: '',
  genericNameCn: '',
  genericNameEn: '',
  rdCode: '',
  otherNames: '',
  dosageForm: '',
  drugType: '',
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
  {
    colKey: 'originalName',
    title: '药品名（源数据）',
    width: 180,
    cell: (h: any, { row }: any) => row.drugNickName || row.drugComment || row.drugStandardName || '-',
  },
  {
    colKey: 'acceptanceCount',
    title: '相关受理号/登记号',
    width: 160,
    cell: (h: any, { row }: any) =>
      h(
        'span',
        {
          style: {
            color: '#0052d9',
            cursor: 'pointer',
          },
          onClick: () => {
            currentAccDrugId.value = row.drugStandardId;
            accPagination.current = 1;
            fetchAccData();
            accModalVisible.value = true;
          },
        },
        { default: () => row.acceptanceCount || '-' },
      ),
  },
  {
    colKey: 'cleanStatus',
    title: '清洗状态',
    width: 120,
    cell: (h: any, { row }: any) => {
      const item = statusOptions.find((opt) => opt.value === row.status || opt.value === row.cleanStatus);
      return item ? item.label : '-';
    },
  },

  {
    colKey: 'drugStandardName',
    title: '药品名（清洗后）',
    width: 180,
    cell: (h: any, { row }: any) => row.drugStandardName || row.drugStandardName || '-',
    ellipsis: true,
  },
  {
    colKey: 'genericNameCn',
    title: '通用名(中)',
    width: 150,
    cell: (h: any, { row }: any) => row.drugGoodsNameCn || row.genericNameCn || '-',
  },
  {
    colKey: 'genericNameEn',
    title: '通用名(英)',
    width: 150,
    cell: (h: any, { row }: any) => row.drugGoodsNameEn || row.genericNameEn || '-',
  },
  { colKey: 'drugCode', title: '研发代号', width: 100, cell: (h: any, { row }: any) => row.drugCode || '-' },
  {
    colKey: 'otherComment',
    title: '其他名（如结构描述）',
    width: 200,
    cell: (h: any, { row }: any) => row.otherComment || '-',
    ellipsis: true,
  },

  { colKey: 'dosageForm', title: '剂型', width: 100, cell: (h: any, { row }: any) => row.dosageForm || '-' },
  {
    colKey: 'drugType',
    title: '药品类型',
    width: 150,
    cell: (h: any, { row }: any) => row.drugType || row.drugTypeOrigin || '-',
    ellipsis: true,
  },

  { colKey: 'updateUser', title: '操作人', width: 100, cell: (h: any, { row }: any) => row.updateUser || '-' },
  {
    colKey: 'updateTime',
    title: '更新时间',
    width: 170,
    cell: (h: any, { row }: any) => (row.updateTime ? moment(row.updateTime).format('YYYY-MM-DD HH:mm:ss') : '-'),
  },
  {
    colKey: 'operation',
    title: '操作',
    width: 100,
    fixed: 'right' as const,
  },
];

const accColumns = [
  { colKey: 'rowIndex', title: '序号', width: 80, cell: (h: any, { rowIndex }: any) => rowIndex + 1 },
  { colKey: 'acceptanceNo', title: '相关登记号/备案号', width: 180 },
  { colKey: 'companyNameOrigin', title: '相关公司（源数据）', width: 180 },
  { colKey: 'registrationCategoryOrigin', title: '注册分类（源数据）', width: 180 },
  { colKey: 'registrationCategoryCleaned', title: '注册分类（清洗后）', width: 180 },
];
//#endregion

//#region Data Fetching
const fetchData = async (curr = pagination.current, size = pagination.pageSize) => {
  loading.value = true;
  try {
    const res = await drugApi.cleanPageData({
      pageNum: curr,
      pageSize: size,
      drugStandardName: formData.drugStandardName || undefined,
      status: formData.status !== undefined ? Number(formData.status) : undefined,
      companyId: formData.companyId || undefined,
      parentCompanyId: formData.parentCompanyId || undefined,
    });
    tableData.value = res.data?.list || [];
    pagination.current = curr;
    pagination.pageSize = size;
    pagination.total = res.data?.total || 0;
  } catch (e) {
    console.error('Fetch data failed:', e);
  } finally {
    loading.value = false;
  }
};

const onSearch = () => fetchData(1);

const onReset = () => {
  formData.drugStandardName = '';
  formData.status = undefined;
  formData.companyId = undefined;
  formData.parentCompanyId = undefined;
  fetchData(1);
};

const onPageChange = (pageInfo: any) => {
  fetchData(pageInfo.current, pageInfo.pageSize);
};
//#endregion

//#region Edit Modal
const openEditModal = (record: any) => {
  currentEditRecord.value = record;
  editFormData.cleanedName = record.drugStandardName || record.cleanedName || '';
  editFormData.genericNameCn = record.drugNormalNameCn || record.genericNameCn || '';
  editFormData.genericNameEn = record.drugNormalNameEn || record.genericNameEn || '';
  editFormData.rdCode = record.drugCode || record.rdCode || '';
  editFormData.otherNames = record.otherComment || record.otherNames || '';
  editFormData.dosageForm = record.dosageForm || '';
  editFormData.drugType = record.drugType || '';
  editModalVisible.value = true;
};

const submitEdit = async () => {
  editLoading.value = true;
  try {
    if (currentEditRecord.value) {
      const submitData = {
        ...currentEditRecord.value,
        drugStandardName: editFormData.cleanedName,
        drugNormalNameCn: editFormData.genericNameCn,
        drugNormalNameEn: editFormData.genericNameEn,
        drugCode: editFormData.rdCode,
        otherComment: editFormData.otherNames,
        dosageForm: editFormData.dosageForm,
        drugType: editFormData.drugType,
      };
      await drugApi.saveRelation(submitData);
      MessagePlugin.success('保存成功');
      editModalVisible.value = false;
      fetchData();
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

//#region Acc Modal
const fetchAccData = async (curr = accPagination.current, size = accPagination.pageSize) => {
  accLoading.value = true;
  try {
    const res = await drugApi.acceptanceNoList({
      id: currentAccDrugId.value,
      pageNum: curr,
      pageSize: size,
    });
    accData.value = res.data?.list || [];
    accPagination.current = curr;
    accPagination.pageSize = size;
    accPagination.total = res.data?.total || 0;
  } catch (e) {
    console.error('Fetch acceptance data failed:', e);
    accData.value = [];
  } finally {
    accLoading.value = false;
  }
};

const onAccPageChange = (pageInfo: any) => {
  fetchAccData(pageInfo.current, pageInfo.pageSize);
};

const onAccModalClose = () => {
  accModalVisible.value = false;
};
//#endregion

//#region Lifecycle
onMounted(async () => {
  // 获取公司选项
  try {
    const res = await companyApi.queryStandardList({ pageNum: 1, pageSize: 1000 });
    companyOptions.value = res.data?.list || [];
  } catch (e) {
    console.error(e);
  }
  fetchData();
});
//#endregion
</script>
