<template>
  <!--#region 药品名清洗页面 -->
  <t-card bordered>
    <div ref="searchCardRef" style="margin-bottom: 16px" class="search-card">
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
      :max-height="tableMaxHeight"
      hover
      :pagination="pagination"
      @page-change="onPageChange"
    >
      <template #operation="{ row }">
        <t-button theme="primary" @click="openEdit(row)" style="margin-right: 8px"> 编辑 </t-button>
        <t-button theme="primary" @click="openEditModal(row)"> 关联 </t-button>
      </template>

      <template #cleanStatus="{ row }">
        <t-select
          :value="row.status"
          :options="statusOptions"
          style="width: 100px"
          @change="(val: number) => onCleanStatusChange(row, val)"
        />
      </template>
    </t-table>
    <!--#endregion-->

    <!--#region 相关备案/登记号弹窗 -->
    <t-dialog
      v-model:visible="accModalVisible"
      header="相关备案/登记号"
      width="880px"
      :confirm-btn="{ content: '提交', theme: 'primary', loading: batchSubmitting }"
      @confirm="submitBatchDevelopmentCode"
      @close="onAccModalClose"
    >
      <!--#region 批量修改研发代码表单 -->
      <div style="display: flex; align-items: center; gap: 40px; margin-bottom: 16px">
        <div style="display: flex; align-items: center; gap: 8px">
          <span style="white-space: nowrap">选择相关公司：</span>
          <t-select
            v-model="batchCompanyNames"
            :options="companyOriginOptions"
            multiple
            filterable
            clearable
            placeholder="请选择相关公司"
            style="width: 260px"
          />
        </div>
        <div style="display: flex; align-items: center; gap: 8px">
          <span style="white-space: nowrap">关联研发代号：</span>
          <t-select
            v-model="batchDevelopmentCode"
            :options="developmentCodeOptions"
            :loading="developmentCodeLoading"
            filterable
            remote
            clearable
            placeholder="请输入关键字搜索"
            style="width: 220px"
            @search="onDevelopmentCodeSearch"
          />
        </div>
      </div>
      <!--#endregion-->

      <t-table
        :data="accData"
        :columns="accColumns"
        :loading="accLoading"
        row-key="acceptanceNo"
        bordered
        :pagination="accPagination"
        @page-change="onAccPageChange"
      >
        <template #developmentCode="{ row }">
          <div style="display: flex; gap: 8px; align-items: center">
            <t-input style="width: 120px" v-model="devCodeDraft[row.acceptanceNo]" placeholder="请输入" />
            <t-button v-if="isDevCodeChanged(row)" theme="primary" size="small" @click="onSaveDevelopmentCode(row)">
              保存
            </t-button>
          </div>
        </template>
      </t-table>
    </t-dialog>
    <!--#endregion-->

    <!--#region 编辑弹窗 -->
    <t-dialog
      v-model:visible="basicEditVisible"
      header="编辑"
      width="600px"
      :confirm-btn="{ content: '提交', theme: 'primary', loading: basicEditLoading }"
      @confirm="submitBasicEdit"
      @close="onBasicEditClose"
    >
      <!-- 源数据信息 -->
      <div
        style="
          background-color: #f3f4f6;
          padding: 16px;
          margin-bottom: 20px;
          border-radius: 8px;
          display: flex;
          gap: 40px;
        "
      >
        <p style="margin: 0">
          <strong>药品名（源数据）：</strong>
          {{
            currentBasicEditRow?.drugNickName ||
            currentBasicEditRow?.drugComment ||
            currentBasicEditRow?.drugStandardName ||
            '-'
          }}
        </p>
        <p style="margin: 0">
          <strong>药品类型：</strong>
          {{ currentBasicEditRow?.drugTypeOrigin || currentBasicEditRow?.drugType || '-' }}
        </p>
      </div>

      <t-form :data="basicEditFormData" label-width="140" label-align="left">
        <t-form-item label="药品名（清洗后）" name="cleanedDrugName">
          <t-input v-model="basicEditFormData.cleanedDrugName" placeholder="请输入药品名" />
        </t-form-item>
        <t-form-item label="剂型" name="dosageForm" style="margin-bottom: 0">
          <t-select
            v-model="basicEditFormData.dosageForm"
            :options="dosageFormOptions"
            :loading="dosageFormLoading"
            filterable
            clearable
            placeholder="请选择"
          />
        </t-form-item>
      </t-form>
    </t-dialog>
    <!--#endregion-->

    <!--#region 关联弹窗 -->
    <t-dialog
      v-model:visible="editModalVisible"
      header="编辑"
      width="800px"
      :confirm-btn="{ content: '提交', theme: 'primary', loading: editLoading }"
      @confirm="submitEdit"
      @close="onEditModalClose"
    >
      <div
        style="
          background-color: #f3f4f6;
          padding: 16px;
          margin-bottom: 16px;
          border-radius: 4px;
          display: flex;
          gap: 30px;
        "
      >
        <p style="margin: 0 0 8px 0">
          <strong>药品名（源数据）：</strong>
          {{ currentEditRecord?.drugNickName || currentEditRecord?.drugComment || currentEditRecord?.drugStandardName }}
        </p>
        <p style="margin: 0">
          <strong>药品类型：</strong>
          {{ currentEditRecord?.drugTypeOrigin || '-' }}
        </p>
      </div>
      <t-form ref="editFormRef" :data="editFormData" label-width="180" label-align="left">
        <div style="background-color: #e6f7ff; padding: 16px; border-radius: 4px; margin-bottom: 16px">
          <t-form-item label="关联通用名/研发代号" name="drugStandardId" style="margin-bottom: 10px">
            <t-select
              v-model="editFormData.drugStandardId"
              :options="standardDrugOptions"
              filterable
              :loading="searchLoading"
              placeholder="请搜索选择通用名/研发代号"
              clearable
              @change="onStandardDrugChange"
              @clear="onStandardDrugClear"
              @search="(val: any) => onSearchRelation(val)"
            />
            <t-button theme="primary" style="margin-left: 20px" @click="openAddModal"> 新增 </t-button>
          </t-form-item>
        </div>
        <t-form-item label="通用名（中文）" name="genericNameCn">
          <t-input v-model="editFormData.genericNameCn" disabled />
        </t-form-item>
        <t-form-item label="通用名（英文）" name="genericNameEn">
          <t-input v-model="editFormData.genericNameEn" disabled />
        </t-form-item>
        <t-form-item label="研发代号" name="rdCode">
          <t-input v-model="editFormData.rdCode" disabled />
        </t-form-item>
        <t-form-item
          label="研发代号，同步到此条数据所有“相关受理号/登记号”"
          name="developmentCodeFlag"
          label-width="360"
        >
          <t-radio-group v-model="editFormData.developmentCodeFlag">
            <t-radio :value="true">是</t-radio>
            <t-radio :value="false">否</t-radio>
          </t-radio-group>
        </t-form-item>
        <t-form-item label="其他名（例如结构名称）" name="otherNames">
          <t-input v-model="editFormData.otherNames" disabled />
        </t-form-item>
        <t-form-item label="剂型" name="dosageForm">
          <t-select v-model="editFormData.dosageForm" :options="dosageFormOptions" placeholder="请选择" disabled />
        </t-form-item>
        <t-form-item label="药品类型" name="drugType">
          <t-select v-model="editFormData.drugType" :options="drugTypeOptions" placeholder="请选择" disabled />
        </t-form-item>
      </t-form>
    </t-dialog>
    <!--#endregion-->

    <!-- 新增通用名弹窗 -->
    <t-dialog
      v-model:visible="addModalVisible"
      header="新增通用名"
      width="600px"
      :confirm-btn="{ content: '提交', theme: 'primary', loading: addLoading }"
      @confirm="submitAdd"
    >
      <t-form ref="addFormRef" :data="addFormData" label-width="180" label-align="left">
        <div style="background-color: #e6f7ff; padding: 16px; border-radius: 4px">
          <t-form-item label="通用名（中文）" name="genericNameCn">
            <t-input v-model="addFormData.genericNameCn" />
          </t-form-item>
          <t-form-item label="通用名（英文）" name="genericNameEn">
            <t-input v-model="addFormData.genericNameEn" />
          </t-form-item>
          <t-form-item label="研发代号" name="developmentCode">
            <t-input v-model="addFormData.developmentCode" />
          </t-form-item>
          <t-form-item label="其他名（例如结构名称）" name="otherInfo">
            <t-input v-model="addFormData.otherInfo" />
          </t-form-item>
          <t-form-item label="药品类型" name="drugType">
            <t-select v-model="addFormData.drugType" :options="drugTypeOptions" placeholder="请选择" />
          </t-form-item>
        </div>
      </t-form>
    </t-dialog>
  </t-card>
  <!--#endregion-->
</template>

<script setup lang="ts">
//#region Imports
import { ref, reactive, h, onMounted, nextTick } from 'vue';
import { MessagePlugin } from 'tdesign-vue-next';
import moment from 'moment';
import { drugApi, companyApi } from '@/api';
import type { DrugStandardDto, DrugStandardInfo } from '@/api/types/drug';
import { createEnumsToOptions, DRUG_TYPE } from '@/utils/enums';
//#endregion

//#region Constants
const statusOptions = [
  { label: '未清洗', value: 0 },
  { label: '已清洗', value: 1 },
  { label: '不用清洗', value: 2 },
];

const dosageFormOptions = ref<{ label: string; value: string }[]>([]);
const dosageFormLoading = ref(false);

const drugTypeOptions = createEnumsToOptions(DRUG_TYPE);
//#endregion

//#region State
const formRef = ref();
const editFormRef = ref();
const loading = ref(false);

// 表格最大高度，根据 .search-card 动态计算
const tableMaxHeight = ref('calc(100vh - 320px)');
const searchCardRef = ref<HTMLElement | null>(null);

const tableData = ref<any[]>([]);
const pagination = reactive({
  current: 1,
  pageSize: 20,
  total: 0,
  showJumper: true,
  foldedMaxPageBtn: 3,
});

const formData = reactive({
  drugStandardName: '',
  status: 0 as number | undefined,
});

// 公司选项
const companyOptions = ref<{ id?: number; companyStandardName?: string }[]>([]);

// 备案号弹窗
const accModalVisible = ref(false);
const accData = ref<any[]>([]);
const accLoading = ref(false);
// 研发代码编辑草稿，key 为 acceptanceNo
const devCodeDraft = reactive<Record<string, string>>({});
const currentAccDrugId = ref<number | undefined>(undefined);
const accPagination = reactive({ current: 1, pageSize: 20, total: 0 });

// 批量修改研发代码
const batchCompanyNames = ref<string[]>([]);
const batchDevelopmentCode = ref('');
const companyOriginOptions = ref<{ label: string; value: string }[]>([]);
const developmentCodeOptions = ref<{ label: string; value: string }[]>([]);
const developmentCodeLoading = ref(false);
const batchSubmitting = ref(false);

// 编辑弹窗
const editModalVisible = ref(false);
const addModalVisible = ref(false);
const editLoading = ref(false);
const currentEditRecord = ref<any>(null);
const searchLoading = ref(false);
const addLoading = ref(false);

// 标准药品名选项
const standardDrugOptions = ref<any[]>([]);

const editFormData = reactive<Record<string, any>>({
  drugStandardId: undefined,
  genericNameCn: '',
  genericNameEn: '',
  rdCode: '',
  otherNames: '',
  dosageForm: '',
  drugType: '',
  // 研发代号是否同步到此条数据所有“相关受理号/登记号”
  developmentCodeFlag: false,
});

const addFormData = reactive<Record<string, any>>({
  drugStandardId: undefined,
  cleanedName: '',
  genericNameCn: '',
  genericNameEn: '',
  rdCode: '',
  otherNames: '',
  drugType: '',
});

// 编辑（基础信息）弹窗
const basicEditVisible = ref(false);
const basicEditLoading = ref(false);
const currentBasicEditRow = ref<any>(null);
const basicEditFormData = reactive({
  cleanedDrugName: '',
  dosageForm: '',
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
            currentAccDrugId.value = row.drugCommentId;
            accPagination.current = 1;
            // 重置批量修改表单
            batchCompanyNames.value = [];
            batchDevelopmentCode.value = '';
            companyOriginOptions.value = [];
            fetchDevelopmentCodeOptions();
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
    width: 130,
  },

  {
    colKey: 'cleanedDrugName',
    title: '药品名（清洗后）',
    width: 180,
    cell: (h: any, { row }: any) => row.cleanedDrugName || '-',
    ellipsis: true,
  },
  {
    colKey: 'drugGenericNameCn',
    title: '通用名(中)',
    width: 150,
    cell: (h: any, { row }: any) => row.drugGenericNameCn || '-',
  },
  {
    colKey: 'drugGenericNameEn',
    title: '通用名(英)',
    width: 150,
    cell: (h: any, { row }: any) => row.drugGenericNameEn || '-',
  },
  // { colKey: 'drugCode', title: '研发代号', width: 100, cell: (h: any, { row }: any) => row.drugCode || '-' },
  {
    colKey: 'otherComment',
    title: '其他名（如结构描述）',
    width: 200,
    cell: (h: any, { row }: any) => row.otherComment || '-',
    ellipsis: true,
  },

  { colKey: 'dosageForm', title: '剂型', width: 100, cell: (h: any, { row }: any) => row.dosageForm || '-' },
  {
    colKey: 'drugTypeOrigin',
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
    width: 170,
    fixed: 'right' as const,
  },
];

const accColumns = [
  { colKey: 'rowIndex', title: '序号', width: 80, cell: (h: any, { rowIndex }: any) => rowIndex + 1 },
  { colKey: 'acceptanceNo', title: '相关登记号/备案号', width: 160 },
  { colKey: 'developmentCode', title: '研发代码', width: 200 },
  { colKey: 'companyNameOrigin', title: '相关公司（源数据）', width: 180, ellipsis: true },
  { colKey: 'registrationCategoryOrigin', title: '注册分类（源数据）', width: 160 },
  { colKey: 'registrationCategoryCleaned', title: '注册分类（清洗后）', width: 160 },
];
//#endregion

//#region 动态表格高度
const updateTableHeight = () => {
  const card = searchCardRef.value;
  if (!card) return;
  const rect = card.getBoundingClientRect();
  // 剩余高度 = 视口高度 - search-card 底部位置 - 固定偏移（card 内边距 + 表格头部 + 分页 + 留白）
  const availableHeight = window.innerHeight - rect.bottom - 106;
  tableMaxHeight.value = `${Math.max(200, Math.floor(availableHeight))}px`;
};
//#endregion

//#region Data Fetching
const fetchData = async (curr = pagination.current, size = pagination.pageSize) => {
  loading.value = true;
  try {
    const res = await drugApi.cleanPageData({
      pageNum: curr,
      pageSize: size,
      drugComment: formData.drugStandardName || undefined,
      status: formData.status !== undefined ? Number(formData.status) : undefined,
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
  fetchData(1);
};

const onPageChange = (pageInfo: any) => {
  fetchData(pageInfo.current, pageInfo.pageSize);
};
//#endregion

//#region 剂型选项查询
const onSearchDosageForm = async (keyword = '') => {
  dosageFormLoading.value = true;
  try {
    const res = await drugApi.dosageFormList({ pageNum: 1, pageSize: 1000, searchKey: keyword });
    dosageFormOptions.value = (res.data?.list || []).map((name: string) => ({ label: name, value: name }));
  } catch (e) {
    console.error(e);
  } finally {
    dosageFormLoading.value = false;
  }
};
//#endregion

//#region 清洗状态 select 切换
const onCleanStatusChange = async (row: any, val: number) => {
  try {
    await drugApi.updateCleanStatus({
      id: row.drugCommentId!,
      cleanStatus: val,
    } as any);
    MessagePlugin.success('状态已更新');
    fetchData();
  } catch (e) {
    console.error(e);
    fetchData();
  }
};
//#endregion

//#region 编辑弹窗（基础信息）
const openEdit = (record: any) => {
  currentBasicEditRow.value = record;
  basicEditFormData.cleanedDrugName = record.drugStandardName || record.cleanedDrugName || record.cleanedName || '';
  basicEditFormData.dosageForm = record.dosageForm || '';
  basicEditVisible.value = true;
};

const onBasicEditClose = () => {
  basicEditVisible.value = false;
  currentBasicEditRow.value = null;
};

// 提交编辑
const submitBasicEdit = async () => {
  if (!currentBasicEditRow.value) return;
  basicEditLoading.value = true;
  try {
    await drugApi.updateDrugInfo({
      drugCommentId: currentBasicEditRow.value.drugCommentId,
      cleanedDrugName: basicEditFormData.cleanedDrugName,
      dosageForm: basicEditFormData.dosageForm,
      drugComment:
        currentBasicEditRow.value.drugNickName ||
        currentBasicEditRow.value.drugComment ||
        currentBasicEditRow.value.drugStandardName ||
        '',
    });
    MessagePlugin.success('保存成功');
    basicEditVisible.value = false;
    fetchData();
  } catch (e) {
    console.error(e);
  } finally {
    basicEditLoading.value = false;
  }
};
//#endregion

//#region Edit Modal
const onSearchRelation = async (keyword = '', id?: number) => {
  searchLoading.value = true;
  try {
    const res = await drugApi.standardPageData({
      genericNameCn: keyword || '',
      pageNum: 1,
      pageSize: 50,
      standardId: id || undefined,
    });
    const opts = (res.data?.list || [])
      .filter((item: DrugStandardDto) => item.standardId != null)
      .map((item: DrugStandardDto) => ({
        // 下拉列表及选中后均展示：通用名（中文） （研发代号），研发代号为空时展示“无”
        label: `${item.genericNameCn || item.drugStandardName || ''} （${item.developmentCode || '无'}）`,
        value: item.standardId as number,
        item,
      }));
    standardDrugOptions.value = opts;
  } catch (e) {
    console.error(e);
  } finally {
    searchLoading.value = false;
  }
};

const openEditModal = (record: any) => {
  currentEditRecord.value = record;
  editFormData.drugStandardId = record.drugStandardId || record.standardId || undefined;
  editFormData.genericNameCn = record.drugNormalNameCn || record.genericNameCn || '';
  editFormData.genericNameEn = record.drugNormalNameEn || record.genericNameEn || '';
  editFormData.rdCode = record.drugCode || record.rdCode || '';
  editFormData.otherNames = record.otherComment || record.otherNames || '';
  editFormData.dosageForm = record.dosageForm || '';
  editFormData.drugType = record.drugType || '';
  editFormData.developmentCodeFlag = false;
  editModalVisible.value = true;

  nextTick(() => {
    if (editFormData.drugStandardId) {
      onSearchRelation('', editFormData.drugStandardId);
    }
  });
};

const onStandardDrugChange = (val: number | undefined) => {
  if (!val) return;
  const selected = standardDrugOptions.value.find((o) => o.value === val);
  if (!selected) return;
  editFormData.genericNameCn = selected.item.genericNameCn || '';
  editFormData.genericNameEn = selected.item.genericNameEn || '';
  editFormData.rdCode = selected.item.developmentCode || '';
  editFormData.otherNames = selected.item.otherInfo || '';
  editFormData.dosageForm = selected.item.dosageForm || '';
  editFormData.drugType = selected.item.drugType || '';
};

const onStandardDrugClear = () => {
  editFormData.drugStandardId = undefined;
};

const submitEdit = async () => {
  editLoading.value = true;
  try {
    if (currentEditRecord.value) {
      const submitData = {
        drugCommentId: currentEditRecord.value.drugCommentId!,
        drugStandardId: editFormData.drugStandardId,
        // 1-同步全部，2-取消全部
        developmentCodeFlag: editFormData.developmentCodeFlag ? 1 : 2,
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
  standardDrugOptions.value = [];
};

const openAddModal = () => {
  addFormData.genericNameCn = '';
  addFormData.genericNameEn = '';
  addFormData.developmentCode = '';
  addFormData.otherInfo = '';
  addFormData.drugType = '';
  addFormData.companyName = '';
  addFormData.id = undefined;
  addModalVisible.value = true;
};

const submitAdd = async () => {
  addLoading.value = true;
  try {
    const submitData: DrugStandardInfo = {
      id: addFormData.id || undefined,
      cleanedDrugName: addFormData.genericNameCn,
      genericNameCn: addFormData.genericNameCn,
      genericNameEn: addFormData.genericNameEn,
      developmentCode: addFormData.developmentCode,
      otherInfo: addFormData.otherInfo,
      drugType: addFormData.drugType,
      status: currentEditRecord.value?.status ?? 0,
    };
    await drugApi.standardSave(submitData);
    MessagePlugin.success('新增成功');
    addModalVisible.value = false;

    // 刷新关联下拉选项，命中则自动选中新增的标准公司
    await onSearchRelation(addFormData.genericNameCn);
    const matched = (standardDrugOptions.value as any).find(
      (o: any) => o.item?.genericNameCn === addFormData.genericNameCn,
    );
    if (matched) {
      editFormData.drugStandardId = matched.value;
      onStandardDrugChange(matched.value);
    }
  } catch (e) {
    console.error(e);
  } finally {
    addLoading.value = false;
  }
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
    accData.value.forEach((row: any) => {
      if (row.acceptanceNo) devCodeDraft[row.acceptanceNo] = row.developmentCode ?? '';
      // 收集相关公司（源数据）选项
      if (row.companyNameOrigin && !companyOriginOptions.value.some((o) => o.value === row.companyNameOrigin)) {
        companyOriginOptions.value.push({ label: row.companyNameOrigin, value: row.companyNameOrigin });
      }
    });
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

// 研发代码是否发生变动
const isDevCodeChanged = (row: any) => {
  const draft = devCodeDraft[row.acceptanceNo] ?? '';
  return draft.trim() !== (row.developmentCode ?? '');
};

// 保存研发代码
const onSaveDevelopmentCode = async (row: any) => {
  const key = row.acceptanceNo;
  const newVal = (devCodeDraft[key] ?? '').trim();
  if (newVal === (row.developmentCode ?? '')) return;
  try {
    await drugApi.editDevelopmentCode({
      indDrugRelId: row.indDrugRelId,
      developmentCode: newVal,
      drugCommentId: currentAccDrugId.value,
    });
    row.developmentCode = newVal;
    devCodeDraft[key] = newVal;
    MessagePlugin.success('保存成功');
  } catch (e) {
    console.error(e);
    fetchAccData();
  }
};

const onAccModalClose = () => {
  accModalVisible.value = false;
};

// 查询研发代号选项（按关键字实时查询）
const fetchDevelopmentCodeOptions = async (keyword = '') => {
  developmentCodeLoading.value = true;
  try {
    const res = await drugApi.queryDevelopmentCode({ pageNum: 1, pageSize: 99, searchKey: keyword || undefined });
    developmentCodeOptions.value = (res.data?.list || []).map((code: string) => ({ label: code, value: code }));
  } catch (e) {
    console.error(e);
  } finally {
    developmentCodeLoading.value = false;
  }
};

let developmentCodeSearchTimer: ReturnType<typeof setTimeout> | null = null;
const onDevelopmentCodeSearch = (keyword: string) => {
  if (developmentCodeSearchTimer) clearTimeout(developmentCodeSearchTimer);
  developmentCodeSearchTimer = setTimeout(() => {
    fetchDevelopmentCodeOptions(keyword.trim());
  }, 300);
};

// 批量修改研发代码（按公司）
const submitBatchDevelopmentCode = async () => {
  if (!batchCompanyNames.value.length) {
    MessagePlugin.warning('请选择相关公司');
    return;
  }
  batchSubmitting.value = true;
  try {
    await drugApi.editDevelopmentCodeByCompany({
      companyNameOriginList: batchCompanyNames.value,
      developmentCode: batchDevelopmentCode.value,
      drugCommentId: currentAccDrugId.value,
    });
    MessagePlugin.success('修改成功');
    batchCompanyNames.value = [];
    batchDevelopmentCode.value = '';
    fetchAccData();
    fetchData();
  } catch (e) {
    console.error(e);
  } finally {
    batchSubmitting.value = false;
  }
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

  // 获取剂型选项
  await onSearchDosageForm();

  fetchData();

  // 初始化表格高度 + 监听 resize + 监听 search-card 尺寸变化
  updateTableHeight();
  window.addEventListener('resize', updateTableHeight);
  const card = searchCardRef.value;
  if (card) {
    const observer = new ResizeObserver(updateTableHeight);
    observer.observe(card);
  }
});
//#endregion
</script>
