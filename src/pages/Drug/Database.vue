<template>
  <!--#region 通用名库管理页面 -->
  <t-card bordered>
    <div style="margin-bottom: 16px">
      <h2 style="margin: 0 0 16px 0; font-size: 18px; font-weight: 600; color: var(--td-text-color-primary)">
        通用名库管理
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
          <t-form-item label="通用名（中文）" name="genericNameCn" style="margin-bottom: 0">
            <t-input v-model="formData.genericNameCn" placeholder="请输入关键字" clearable style="width: 220px" />
          </t-form-item>
          <t-form-item label="研发代号" name="developmentCode" style="margin-bottom: 0">
            <t-input v-model="formData.developmentCode" placeholder="请输入关键字" clearable style="width: 220px" />
          </t-form-item>
          <t-form-item label="研发代号首次出现年份" name="year" label-width="170" style="margin-bottom: 0">
            <t-select
              v-model="formData.year"
              :options="yearOptions"
              placeholder="请选择"
              clearable
              style="width: 140px"
            />
          </t-form-item>
          <t-form-item label="待跟进状态" name="followStatus" style="margin-bottom: 0">
            <t-select
              v-model="formData.followStatus"
              :options="followUpOptions"
              placeholder="请选择"
              style="width: 140px"
            />
          </t-form-item>
          <div style="display: flex; align-items: center; margin-left: auto">
            <t-button theme="default" @click="onReset" style="background: #fff; margin-right: 8px"> 重置 </t-button>
            <t-button theme="primary" type="submit"> 查询 </t-button>
          </div>
          <div style="display: flex; align-items: center; margin-left: auto">
            <t-space>
              <t-button theme="primary" variant="outline" @click="handleAdd"> 新增 </t-button>
            </t-space>
          </div>
        </t-form>
      </div>
      <!--#endregion-->
    </div>

    <!--#region 数据表格 -->
    <t-table
      :data="tableData"
      :columns="columns"
      row-key="id"
      :loading="loading"
      bordered
      stripe
      table-layout="fixed"
      max-height="calc(100vh - 290px)"
      style="white-space: nowrap"
      hover
      :pagination="pagination"
      @page-change="onPageChange"
    >
      <template #operation="{ row }">
        <t-button theme="primary" @click="openEditModal(row)" style="margin-right: 8px"> 编辑 </t-button>
        <t-button theme="primary" variant="outline" @click="openMergeModal(row)"> 合并 </t-button>
      </template>
      <template #followStatus="{ row }">
        <t-select
          :value="row.followStatus ?? ''"
          :options="followStatusOptions"
          placeholder="请选择"
          style="width: 100px"
          @change="(val: any) => onFollowStatusChange(row, val)"
        />
      </template>
    </t-table>
    <!--#endregion-->

    <!--#region 药品别名弹窗 -->
    <t-dialog
      v-model:visible="aliasModalVisible"
      header="药品别名"
      :footer="false"
      width="600px"
      @close="onAliasModalClose"
    >
      <t-table
        :data="aliasData"
        :columns="aliasColumns"
        row-key="aliasName"
        :loading="aliasLoading"
        bordered
        stripe
        :pagination="aliasPagination"
        @page-change="onAliasPageChange"
      />
    </t-dialog>
    <!--#endregion-->

    <!--#region 编辑弹窗 -->
    <t-dialog
      v-model:visible="editModalVisible"
      :header="currentEditRecord ? '编辑' : '新增'"
      width="600px"
      :confirm-btn="{ content: '提交', theme: 'primary', loading: editLoading }"
      @confirm="submitEdit"
      @close="onEditModalClose"
    >
      <t-form ref="editFormRef" :data="editFormData" label-width="180" label-align="left">
        <div style="background-color: #e6f7ff; padding: 16px; border-radius: 4px">
          <t-form-item label="通用名（中文）" name="genericNameCn">
            <t-input v-model="editFormData.genericNameCn" />
          </t-form-item>
          <t-form-item label="通用名（英文）" name="genericNameEn">
            <t-input v-model="editFormData.genericNameEn" />
          </t-form-item>
          <t-form-item label="其他名（例如结构名称）" name="otherInfo">
            <t-input v-model="editFormData.otherInfo" />
          </t-form-item>
          <t-form-item label="药品类型" name="drugType">
            <t-select v-model="editFormData.drugType" :options="drugTypeOptions" placeholder="请选择" />
          </t-form-item>
          <t-form-item label="靶点" name="drugTarget">
            <t-input v-model="editFormData.drugTarget" />
          </t-form-item>
          <t-form-item label="药物模态" name="drugMode">
            <t-input v-model="editFormData.drugMode" />
          </t-form-item>
        </div>
      </t-form>
    </t-dialog>
    <!--#endregion-->

    <!--#region 合并弹窗 -->
    <t-dialog
      v-model:visible="mergeModalVisible"
      header="合并"
      width="600px"
      :confirm-btn="{ content: '提交', theme: 'primary', loading: mergeLoading }"
      @confirm="submitMerge"
      @close="onMergeModalClose"
    >
      <t-form label-width="120" label-align="left">
        <t-form-item label="通用名">
          <t-input :value="currentMergeRecord?.genericNameCn || '-'" disabled />
        </t-form-item>
        <t-form-item label="合并到">
          <t-select
            v-model="mergeTargetId"
            :options="mergeOptions"
            :loading="mergeOptionsLoading"
            filterable
            remote
            clearable
            placeholder="请输入关键字搜索"
            @search="onMergeSearch"
          />
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
import { drugApi } from '@/api';
import type { DrugStandardDto, DrugStandardInfo } from '@/api/types/drug';
import { DRUG_TYPE, createEnumsToOptions } from '@/utils/enums';

//#endregion

//#region State
const formRef = ref();
const editFormRef = ref();
const loading = ref(false);
const tableData = ref<DrugStandardDto[]>([]);
const pagination = reactive({
  current: 1,
  pageSize: 20,
  total: 0,
  showJumper: true,
  foldedMaxPageBtn: 3,
});

const formData = reactive({
  genericNameCn: '',
  developmentCode: '',
  year: '',
  followStatus: '' as number | '',
});

// 近10年
const currentYear = new Date().getFullYear();
const yearOptions = Array.from({ length: 10 }, (_, i) => {
  const year = String(currentYear - i);
  return { label: year, value: year };
});

// 待跟进状态（人工维护）
const followUpOptions = [
  { label: '全部', value: '' },
  { label: '是', value: 1 },
  { label: '否', value: 0 },
];

// 表格内待跟进状态下拉
const followStatusOptions = [
  { label: '是', value: 1 },
  { label: '否', value: 0 },
];

// 别名弹窗
const aliasModalVisible = ref(false);
const aliasData = ref<{ aliasName: string }[]>([]);
const aliasLoading = ref(false);
const aliasPagination = reactive({ current: 1, pageSize: 5, total: 0 });
const currentDrugId = ref<number>();

// 编辑弹窗
const editModalVisible = ref(false);
const editLoading = ref(false);
const currentEditRecord = ref<DrugStandardDto | null>(null);

const editFormData = reactive<Record<string, any>>({
  id: undefined,
  genericNameCn: '',
  genericNameEn: '',
  developmentCode: '',
  otherInfo: '',
  drugType: '',
  drugTarget: '',
  drugMode: '',
  companyName: '',
});

// 合并弹窗
const mergeModalVisible = ref(false);
const mergeLoading = ref(false);
const mergeTargetId = ref<number | undefined>(undefined);
const currentMergeRecord = ref<DrugStandardDto | null>(null);
const mergeOptions = ref<{ label: string; value: number }[]>([]);
const mergeOptionsLoading = ref(false);

//#endregion

//#region Columns Definition
const columns = [
  {
    colKey: 'rowIndex',
    title: '序号',
    width: 60,
    cell: (h: any, { rowIndex }: any) => rowIndex + 1 + (pagination.current - 1) * pagination.pageSize,
  },
  // { colKey: 'drugStandardName', title: '药品名（清洗后）', width: 180, ellipsis: true },
  {
    colKey: 'genericNameCn',
    title: '通用名（中文）',
    width: 250,
    ellipsis: true,
    cell: (h: any, { row }: any) => row.genericNameCn || '-',
  },
  {
    colKey: 'genericNameEn',
    title: '通用名(英文)',
    width: 250,
    ellipsis: true,
    cell: (h: any, { row }: any) => row.genericNameEn || '-',
  },
  {
    colKey: 'developmentCode',
    title: '研发代码',
    width: 120,
    cell: (h: any, { row }: any) => row.developmentCode || '-',
  },
  {
    colKey: 'otherInfo',
    title: '其他（例如药物结构描述）',
    width: 220,
    cell: (h: any, { row }: any) => row.otherInfo || '-',
  },
  // { colKey: 'dosageForm', title: '剂型', width: 100 },
  { colKey: 'firstTime', title: '研发代号首次出现时间', width: 180 },
  { colKey: 'drugType', title: '药品类型', width: 140 },
  { colKey: 'drugTarget', title: '靶点', width: 140 },
  { colKey: 'drugMode', title: '药物模态', width: 140 },
  { colKey: 'followStatus', title: '待跟进状态', width: 140 },
  // {
  //   colKey: 'companyName',
  //   title: '相关公司',
  //   width: 200,
  //   cell: (h: any, { row }: any) => row.companyName || '-',
  // },
  // {
  //   colKey: 'parentCompanyName',
  //   title: '相关母公司',
  //   width: 200,
  //   cell: (h: any, { row }: any) => row.parentCompanyName || '-',
  // },
  {
    colKey: 'statisticCount',
    title: '源数据药品名（别名）',
    width: 170,
    align: 'center' as const,
    cell: (h: any, { row }: any) =>
      h(
        'span',
        {
          style: { color: '#0052d9', cursor: 'pointer' },
          onClick: () => openAliasModal(row.standardId!),
        },
        row.statisticCount || 0,
      ),
  },
  {
    colKey: 'status',
    title: '状态',
    width: 80,
    cell: (h: any, { row }: any) => {
      const statusMap: Record<number, string> = { 0: '无冲突', 1: '待确认', 2: '已确认' };
      return statusMap[row.status] ?? '-';
    },
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
    width: 160,
    fixed: 'right' as const,
  },
];

const aliasColumns = [
  {
    colKey: 'rowIndex',
    title: '序号',
    width: 80,
    cell: (h: any, { rowIndex }: any) => rowIndex + 1 + (aliasPagination.current - 1) * aliasPagination.pageSize,
  },
  { colKey: 'aliasName', title: '源数据药品名（别名）' },
];
//#endregion

//#region Data Fetching
const fetchData = async (curr = pagination.current, size = pagination.pageSize) => {
  loading.value = true;
  try {
    const params: Record<string, any> = {
      pageNum: curr,
      pageSize: size,
      genericNameCn: formData.genericNameCn || undefined,
      developmentCode: formData.developmentCode || undefined,
      year: formData.year || undefined,
      followStatus: formData.followStatus === '' ? undefined : formData.followStatus,
    };
    const res = await drugApi.standardPageData(params);
    tableData.value = res.data?.list || [];
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
  formData.genericNameCn = '';
  formData.developmentCode = '';
  formData.year = '';
  formData.followStatus = '';
  fetchData(1);
};

const onPageChange = (pageInfo: any) => {
  fetchData(pageInfo.current, pageInfo.pageSize);
};
//#endregion

//#region 待跟进状态（人工维护）
const onFollowStatusChange = async (row: DrugStandardDto, val: number) => {
  try {
    await drugApi.standardSave({
      id: row.standardId,
      genericNameCn: row.genericNameCn,
      genericNameEn: row.genericNameEn,
      otherInfo: row.otherInfo,
      drugType: row.drugType,
      drugTarget: row.drugTarget,
      drugMode: row.drugMode,
      developmentCode: row.developmentCode,
      firstTime: row.firstTime,
      status: row.status,
      followStatus: val,
    });
    row.followStatus = val;
    MessagePlugin.success('保存成功');
    fetchData();
  } catch (e) {
    console.error(e);
    fetchData();
  }
};
//#endregion

//#region Alias Modal
const fetchAliasNos = async (drugId: number, curr = 1, size = 5) => {
  aliasLoading.value = true;
  try {
    const res = await drugApi.commentDrugPageData({ id: drugId, pageNum: curr, pageSize: size });
    const mappedList = (res.data?.list || []).map((name: string) => ({ aliasName: name }));
    aliasData.value = mappedList;
    aliasPagination.current = curr;
    aliasPagination.pageSize = size;
    aliasPagination.total = res.data?.total || 0;
  } catch (e) {
    console.error(e);
  } finally {
    aliasLoading.value = false;
  }
};

const openAliasModal = (id: number) => {
  currentDrugId.value = id;
  fetchAliasNos(id, 1, 5);
  aliasModalVisible.value = true;
};

const onAliasPageChange = (pageInfo: any) => {
  if (currentDrugId.value) {
    fetchAliasNos(currentDrugId.value, pageInfo.current, pageInfo.pageSize);
  }
};

const onAliasModalClose = () => {
  aliasModalVisible.value = false;
};
//#endregion

//#region Edit Modal
const drugTypeOptions = createEnumsToOptions(DRUG_TYPE);

const openEditModal = (record: DrugStandardDto) => {
  currentEditRecord.value = record;
  editFormData.genericNameCn = record.genericNameCn || '';
  editFormData.genericNameEn = record.genericNameEn || '';
  editFormData.developmentCode = record.developmentCode || '';
  editFormData.otherInfo = record.otherInfo || '';
  editFormData.drugType = record.drugType || '';
  editFormData.drugTarget = record.drugTarget || '';
  editFormData.drugMode = record.drugMode || '';
  editFormData.companyName = record.companyName || '';
  editFormData.id = record.standardId || '';
  editModalVisible.value = true;
};

const handleAdd = () => {
  currentEditRecord.value = null;
  editFormData.genericNameCn = '';
  editFormData.genericNameEn = '';
  editFormData.developmentCode = '';
  editFormData.otherInfo = '';
  editFormData.drugType = '';
  editFormData.drugTarget = '';
  editFormData.drugMode = '';
  editFormData.companyName = '';
  editFormData.id = undefined;
  editModalVisible.value = true;
};

const submitEdit = async () => {
  editLoading.value = true;
  try {
    const submitData: DrugStandardInfo = {
      id: editFormData.id || undefined,
      cleanedDrugName: editFormData.genericNameCn,
      genericNameCn: editFormData.genericNameCn,
      genericNameEn: editFormData.genericNameEn,
      developmentCode: editFormData.developmentCode,
      otherInfo: editFormData.otherInfo,
      drugType: editFormData.drugType,
      drugTarget: editFormData.drugTarget,
      drugMode: editFormData.drugMode,
      followStatus: currentEditRecord.value?.followStatus,
      status: currentEditRecord.value?.status ?? 0,
    };
    await drugApi.standardSave(submitData);
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

//#region 合并弹窗
// 查询可合并的通用名选项（按关键字实时查询，排除当前记录）
const fetchMergeOptions = async (keyword = '', excludeId?: number) => {
  mergeOptionsLoading.value = true;
  try {
    const res = await drugApi.standardPageData({
      pageNum: 1,
      pageSize: 50,
      genericNameCn: keyword || undefined,
    });
    mergeOptions.value = (res.data?.list || [])
      .filter((item: DrugStandardDto) => item.standardId !== excludeId)
      .map((item: DrugStandardDto) => {
        const name = item.genericNameCn || item.drugStandardName || '-';
        return {
          label: item.developmentCode ? `${name}（${item.developmentCode}）` : name,
          value: item.standardId!,
        };
      });
  } catch (e) {
    console.error(e);
  } finally {
    mergeOptionsLoading.value = false;
  }
};

let mergeSearchTimer: ReturnType<typeof setTimeout> | null = null;
const onMergeSearch = (keyword: string) => {
  if (mergeSearchTimer) clearTimeout(mergeSearchTimer);
  mergeSearchTimer = setTimeout(() => {
    fetchMergeOptions(keyword.trim(), currentMergeRecord.value?.standardId);
  }, 300);
};

const openMergeModal = (record: DrugStandardDto) => {
  currentMergeRecord.value = record;
  mergeTargetId.value = undefined;
  mergeOptions.value = [];
  fetchMergeOptions('', record.standardId);
  mergeModalVisible.value = true;
};

const submitMerge = async () => {
  if (!mergeTargetId.value) {
    MessagePlugin.warning('请选择合并到的通用名');
    return;
  }
  mergeLoading.value = true;
  try {
    await drugApi.drugMerge({
      sourceStandardId: currentMergeRecord.value?.standardId,
      targetStandardId: mergeTargetId.value,
    });
    MessagePlugin.success('合并成功');
    mergeModalVisible.value = false;
    fetchData();
  } catch (e) {
    console.error(e);
  } finally {
    mergeLoading.value = false;
  }
};

const onMergeModalClose = () => {
  mergeModalVisible.value = false;
  currentMergeRecord.value = null;
  mergeTargetId.value = undefined;
};
//#endregion

//#region Lifecycle
onMounted(() => {
  fetchData();
});
//#endregion
</script>
