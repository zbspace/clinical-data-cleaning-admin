<template>
  <!--#region 公司名清洗页面 -->
  <t-card bordered style="height: calc(100vh - 86px);">
    <!-- 页面标题 -->
    <div style="margin-bottom: 16px;">
      <h2 style="margin: 0 0 16px 0; font-size: 18px; font-weight: 600; color: var(--td-text-color-primary);">
        公司名清洗
      </h2>

      <!--#region 搜索表单 -->
      <div style="background: #f8fafc; padding: 16px; border-radius: 12px; border: 1px solid var(--td-border-level-1-color);">
        <t-form
          ref="formRef"
          :data="formData"
          layout="inline"
          label-width="140"
          style="display: flex; gap: 16px 0; flex-wrap: wrap;"
          @submit="onSearch"
        >
          <t-form-item label="公司名(源数据)" name="companyName" style="margin-bottom: 0;">
            <t-input v-model="formData.companyName" placeholder="请输入关键字" clearable style="width: 220px;" />
          </t-form-item>
          <t-form-item label="母公司简称" name="parentCompanyShortName" style="margin-bottom: 0;">
            <t-input v-model="formData.parentCompanyShortName" placeholder="请输入关键字" clearable style="width: 220px;" />
          </t-form-item>
          <t-form-item label="公司类型" name="companyType" style="margin-bottom: 0;">
            <t-select
              v-model="formData.companyType"
              :options="companyTypeOptions"
              placeholder="请选择公司类型"
              clearable
              style="width: 220px;"
            />
          </t-form-item>
          <t-form-item label="清洗状态" name="cleanStatus" style="margin-bottom: 0;">
            <t-select
              v-model="formData.cleanStatus"
              :options="statusOptions"
              placeholder="请选择状态"
              clearable
              style="width: 220px;"
            />
          </t-form-item>
          <div style="display: flex; align-items: center; margin-left: auto;">
            <t-space>
              <t-button theme="default" variant="base" @click="onReset" style="background: #fff;">
                重置条件
              </t-button>
              <t-button theme="primary" type="submit">
                立即查询
              </t-button>
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
      max-height="calc(100vh - 340px)"
      style="white-space: nowrap;"
      :pagination="pagination"
      @page-change="onPageChange"
      @sort-change="onSortChange"
    />
    <!--#endregion-->

    <!--#region 备案号弹窗 -->
    <t-dialog
      v-model:visible="accModalVisible"
      header="相关备案/登记号"
      :footer="false"
      width="600px"
      @close="onAccModalClose"
    >
      <t-table
        :data="accData"
        :columns="accColumns"
        row-key="acceptanceNo"
        :loading="accLoading"
        bordered
        stripe
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
      <t-form ref="editFormRef" :data="editFormData" label-width="140" label-align="left">
        <div style="background-color: #e6f7ff; padding: 16px; border-radius: 4px; margin-bottom: 16px;">
          <!--#region 关联搜索 -->
          <t-form-item label="关联：" name="relationId" style="margin-bottom: 0;">
            <t-select
              v-model="editFormData.relationId"
              :options="relationOptions"
              filterable
              :loading="searchLoading"
              placeholder="请输入搜索标准公司"
              style="width: 360px;"
              @search="onSearchRelation"
              @change="onRelationChange"
            />
          </t-form-item>
          <!--#endregion-->
        </div>
        <div style="background-color: #e6f7ff; padding: 16px; border-radius: 4px;">
          <div style="font-weight: bold; margin-bottom: 16px;">新增：</div>
          <t-form-item label="公司名(标准名称)" name="companyStandardName">
            <t-input v-model="editFormData.companyStandardName" />
          </t-form-item>
          <t-form-item label="公司简称" name="companyShortName">
            <t-input v-model="editFormData.companyShortName" />
          </t-form-item>
          <t-form-item label="公司类型" name="companyType">
            <t-input v-model="editFormData.companyType" />
          </t-form-item>
          <t-form-item label="母公司简称" name="parentCompanyShortName">
            <t-input v-model="editFormData.parentCompanyShortName" />
          </t-form-item>
          <t-form-item label="备注" name="remark">
            <t-textarea v-model="editFormData.remark" />
          </t-form-item>
          <t-button
            theme="primary"
            variant="outline"
            :loading="newCompanyLoading"
            @click="handleAddNewCompany"
          >
            新增
          </t-button>
        </div>
      </t-form>
    </t-dialog>
    <!--#endregion-->
  </t-card>
  <!--#endregion-->
</template>

<script setup lang="ts">
//#region Imports
import { ref, reactive, h, onMounted, nextTick } from 'vue';
import { MessagePlugin } from 'tdesign-vue-next';
import moment from 'moment';
import { companyApi } from '@/api';
import type { CleanCompanyDto, CompanyShortDto } from '@/api/types/company';
//#endregion

//#region Constants
const statusOptions = [
  { label: '未清洗', value: 0 },
  { label: '已清洗', value: 1 },
  { label: '不用清洗', value: 2 },
];

const companyTypeOptions = [
  { label: '药企', value: '药企' },
  { label: 'CRO', value: 'CRO' },
  { label: '申办方', value: '申办方' },
  { label: '第三方实验室', value: '第三方实验室' },
  { label: '其他', value: '其他' },
];
//#endregion

//#region State
const formRef = ref();
const editFormRef = ref();
const loading = ref(false);
const tableData = ref<CleanCompanyDto[]>([]);
const pagination = reactive({
  current: 1,
  pageSize: 20,
  total: 0,
  showJumper: true,
});

const formData = reactive<Record<string, any>>({
  companyName: '',
  parentCompanyShortName: '',
  companyType: '',
  cleanStatus: 0,
});

// 备案号弹窗
const accModalVisible = ref(false);
const accData = ref<{ acceptanceNo: string }[]>([]);
const accLoading = ref(false);
const accPagination = reactive({
  current: 1,
  pageSize: 5,
  total: 0,
});
const currentCompanyId = ref<number>();

// 编辑弹窗
const editModalVisible = ref(false);
const editLoading = ref(false);
const currentEditRecord = ref<CleanCompanyDto | null>(null);
const relationOptions = ref<{ label: string; value: number }[]>([]);
const searchLoading = ref(false);
const newCompanyLoading = ref(false);

const editFormData = reactive<Record<string, any>>({
  relationId: undefined,
  companyStandardName: '',
  companyShortName: '',
  companyType: '',
  parentCompanyShortName: '',
  remark: '',
});
//#endregion

//#region Columns Definition
const columns = [
  {
    colKey: 'rowIndex',
    title: '序号',
    width: 60,
    cell: (h: any, { rowIndex }: any) => rowIndex + 1 + (pagination.current - 1) * pagination.pageSize,
  },
  { colKey: 'companyOriginName', title: '公司名(源数据)', width: 280, ellipsis: true },
  {
    colKey: 'cnt',
    title: '相关备案/登记号',
    width: 150,
    align: 'center' as const,
    sortable: true,
    cell: (h: any, { row }: any) =>
      h(
        'span',
        {
          style: { color: '#0052d9', cursor: 'pointer', textDecoration: 'underline' },
          onClick: () => openAccModal(row.id!),
        },
        row.cnt || 0,
      ),
  },
  {
    colKey: 'cleanStatus',
    title: '清洗状态',
    width: 120,
    cell: (h: any, { row }: any) => {
      const item = statusOptions.find((opt) => opt.value === row.cleanStatus);
      return item ? item.label : '-';
    },
  },
  { colKey: 'companyStandardName', title: '清洗后公司名称(标准名)', width: 250 },
  { colKey: 'companyType', title: '公司类型', width: 100 },
  { colKey: 'companyShortName', title: '公司简称', width: 150 },
  { colKey: 'parentCompanyShortName', title: '母公司简称', width: 150 },
  { colKey: 'updater', title: '操作人', width: 100 },
  {
    colKey: 'updateTime',
    title: '更新时间',
    width: 180,
    cell: (h: any, { row }: any) =>
      row.updateTime ? moment(row.updateTime).format('YYYY-MM-DD HH:mm:ss') : '-',
  },
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

const accColumns = [
  {
    colKey: 'rowIndex',
    title: '序号',
    width: 80,
    cell: (h: any, { rowIndex }: any) => rowIndex + 1 + (accPagination.current - 1) * accPagination.pageSize,
  },
  { colKey: 'acceptanceNo', title: '相关登记号/备案号' },
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
    if (params.cleanStatus === 0) delete params.cleanStatus;

    const res = await companyApi.pageData(params);
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
  formData.companyName = '';
  formData.parentCompanyShortName = '';
  formData.companyType = '';
  formData.cleanStatus = 0;
  fetchData(1);
};

const onPageChange = (pageInfo: any) => {
  fetchData(pageInfo.current, pageInfo.pageSize);
};

const onSortChange = (sortInfo: any) => {
  console.log('sortChange', sortInfo);
};
//#endregion

//#region Acceptance Numbers Modal
const fetchAcceptanceNos = async (companyId: number, curr = 1, size = 5) => {
  accLoading.value = true;
  try {
    const res = await companyApi.getAcceptanceNos({ queryId: companyId, pageNum: curr, pageSize: size });
    const mappedList = (res.data?.list || []).map((no: string) => ({ acceptanceNo: no }));
    accData.value = mappedList;
    accPagination.current = curr;
    accPagination.pageSize = size;
    accPagination.total = res.data?.total || 0;
  } catch (e) {
    console.error(e);
  } finally {
    accLoading.value = false;
  }
};

const openAccModal = (id: number) => {
  currentCompanyId.value = id;
  fetchAcceptanceNos(id, 1, 5);
  accModalVisible.value = true;
};

const onAccPageChange = (pageInfo: any) => {
  if (currentCompanyId.value) {
    fetchAcceptanceNos(currentCompanyId.value, pageInfo.current, pageInfo.pageSize);
  }
};

const onAccModalClose = () => {
  accModalVisible.value = false;
};
//#endregion

//#region Edit Modal
const openEditModal = (record: CleanCompanyDto) => {
  currentEditRecord.value = record;
  relationOptions.value = [];
  editFormData.relationId = record.standardId;
  editFormData.companyStandardName = record.companyStandardName || '';
  editFormData.companyShortName = record.companyShortName || '';
  editFormData.companyType = record.companyType || '';
  editFormData.parentCompanyShortName = record.parentCompanyShortName || '';
  editFormData.remark = record.remark || '';
  editModalVisible.value = true;

  if (record.parentCompanyShortName) {
    nextTick(() => {
      onSearchRelation(record.parentCompanyShortName!);
    });
  }
};

const onSearchRelation = async (keyword: string) => {
  if (!keyword) return;
  searchLoading.value = true;
  try {
    const res = await companyApi.queryByName({ searchKey: keyword, pageNum: 1, pageSize: 50, id: null });
    const opts = (res.data?.list || [])
      .filter((item: CompanyShortDto) => item.parentCompanyId != null)
      .map((item: CompanyShortDto) => ({
        label: item.parentCompanyShortName || '',
        value: item.parentCompanyId as number,
        item,
      }));
    relationOptions.value = opts;
  } catch (e) {
    console.error(e);
  } finally {
    searchLoading.value = false;
  }
};

const onRelationChange = (val: any) => {
  const allOpts = relationOptions.value as any;
  const opt = allOpts.find((o: any) => o.value === val);
  if (opt && opt.item) {
    editFormData.companyStandardName = opt.item.companyStandardName || '';
    editFormData.companyShortName = opt.item.companyShortName || '';
    editFormData.companyType = opt.item.companyType || '';
    editFormData.parentCompanyShortName = opt.item.parentCompanyShortName || '';
  }
};

const handleAddNewCompany = async () => {
  if (!currentEditRecord.value) return;
  if (!editFormData.companyStandardName) {
    MessagePlugin.warning('请填写标准名');
    return;
  }
  newCompanyLoading.value = true;
  try {
    const submitData: CleanCompanyDto = {
      ...currentEditRecord.value,
      standardId: editFormData.relationId,
      companyStandardName: editFormData.companyStandardName,
      companyShortName: editFormData.companyShortName,
      companyType: editFormData.companyType,
      parentCompanyShortName: editFormData.parentCompanyShortName,
      remark: editFormData.remark,
      cleanStatus: 3,
    };
    await companyApi.saveClean(submitData);
    MessagePlugin.success('新增成功');

    // 刷新关联选项并选中新增的公司
    const res = await companyApi.queryByName({ searchKey: editFormData.companyStandardName, pageNum: 1, pageSize: 50 });
    const opts = (res.data?.list || [])
      .filter((item: CompanyShortDto) => item.parentCompanyId != null)
      .map((item: CompanyShortDto) => ({
        label: item.parentCompanyShortName || '',
        value: item.parentCompanyId as number,
        item,
      }));
    relationOptions.value = opts;
    const matched = opts.find((o: any) => o.item.companyStandardName === editFormData.companyStandardName);
    if (matched) {
      editFormData.relationId = matched.value;
      onRelationChange(matched.value);
    }
  } catch (e) {
    console.error(e);
  } finally {
    newCompanyLoading.value = false;
  }
};

const submitEdit = async () => {
  if (!currentEditRecord.value) return;
  editLoading.value = true;
  try {
    const submitData: CleanCompanyDto = {
      ...currentEditRecord.value,
      standardId: editFormData.relationId,
      companyStandardName: editFormData.companyStandardName,
      companyShortName: editFormData.companyShortName,
      companyType: editFormData.companyType,
      parentCompanyShortName: editFormData.parentCompanyShortName,
      remark: editFormData.remark,
      cleanStatus: 3,
    };
    await companyApi.saveClean(submitData);
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
