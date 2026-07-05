<template>
  <!--#region 公司名库管理页面 -->
  <t-card bordered style="height: calc(100vh - 86px)">
    <!-- 页面标题 -->
    <div style="margin-bottom: 16px">
      <h2 style="margin: 0 0 16px 0; font-size: 18px; font-weight: 600; color: var(--td-text-color-primary)">
        公司名库
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
          label-width="120"
          style="display: flex; gap: 16px 0; flex-wrap: wrap"
          @submit="onSearch"
        >
          <t-form-item label="公司名(标准名)" name="companyName" style="margin-bottom: 0">
            <t-input v-model="formData.companyName" placeholder="请输入" clearable style="width: 220px" />
          </t-form-item>
          <t-form-item label="母公司简称" name="parentCompanyShortName" style="margin-bottom: 0">
            <t-input
              v-model="formData.parentCompanyShortName"
              placeholder="请输入"
              :disabled="formData.id !== formData.parentCompanyId"
              clearable
              style="width: 220px"
            />
          </t-form-item>
          <t-form-item label="公司类型" name="companyType" style="margin-bottom: 0">
            <t-select
              v-model="formData.companyType"
              :options="companyTypeOptions"
              placeholder="请选择"
              clearable
              style="width: 220px"
            />
          </t-form-item>
          <div style="display: flex; align-items: center; margin-left: auto">
            <t-space>
              <t-button theme="primary" type="submit"> 搜索 </t-button>
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
      max-height="calc(100vh - 300px)"
      style="white-space: nowrap"
      :pagination="pagination"
      @page-change="onPageChange"
    >
      <template #operation="{ row }">
        <t-button theme="primary" @click="openEditModal(row)"> 编辑 </t-button>
      </template>
    </t-table>
    <!--#endregion-->

    <!--#region 源数据公司名(别名)弹窗 -->
    <t-dialog
      v-model:visible="sourceModalVisible"
      header="源数据公司名(别名)"
      :footer="false"
      width="600px"
      @close="onSourceModalClose"
    >
      <t-table
        :data="sourceData"
        :columns="sourceColumns"
        row-key="originName"
        :loading="sourceLoading"
        bordered
        stripe
        :pagination="sourcePagination"
        @page-change="onSourcePageChange"
      />
    </t-dialog>
    <!--#endregion-->

    <!--#region 编辑弹窗 -->
    <t-dialog
      v-model:visible="editModalVisible"
      :header="currentEditRecord ? '编辑' : '新增'"
      width="500px"
      :confirm-btn="{ content: '保存', theme: 'primary', loading: editLoading }"
      @confirm="submitEdit"
      @close="onEditModalClose"
    >
      <t-form ref="editFormRef" :data="editFormData" label-width="140" label-align="left">
        <t-form-item label="公司名(标准名称)" name="companyStandardName">
          <t-input v-model="editFormData.companyStandardName" />
        </t-form-item>
        <t-form-item label="公司简称" name="companyShortName">
          <t-input v-model="editFormData.companyShortName" />
        </t-form-item>
        <t-form-item label="公司类型" name="companyType">
          <t-select v-model="editFormData.companyType" :options="companyTypeOptions" placeholder="请选择" />
        </t-form-item>
        <!--#region 关联搜索 -->
        <t-form-item label="母公司简称" name="parentCompanyId">
          <t-select
            v-model="editFormData.parentCompanyId"
            :options="relationOptions"
            filterable
            :loading="searchLoading"
            placeholder="请输入搜索标准公司"
            style="width: 360px"
            @search="onSearchRelation"
            @change="onRelationChange"
            @clear="onRelationClear"
            clearable
          />
        </t-form-item>
        <!--#endregion-->
        <t-form-item label="备注" name="remark">
          <t-textarea v-model="editFormData.remark" />
        </t-form-item>
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
import type { StandardCompanyDto } from '@/api/types/company';
//#endregion

//#region Constants
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
const tableData = ref<StandardCompanyDto[]>([]);
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
});

// 源数据弹窗
const sourceModalVisible = ref(false);
const sourceData = ref<{ originName: string }[]>([]);
const sourceLoading = ref(false);
const sourcePagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0,
});
const currentCompanyId = ref<number>();

// 编辑弹窗
const editModalVisible = ref(false);
const editLoading = ref(false);
const currentEditRecord = ref<StandardCompanyDto | null>(null);
const relationOptions = ref<{ label: string; value: number; item: any }[]>([]);
const searchLoading = ref(false);

const editFormData = reactive<Record<string, any>>({
  companyStandardName: '',
  companyShortName: '',
  companyType: '',
  parentCompanyShortName: '',
  parentCompanyId: undefined,
  remark: '',
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
  { colKey: 'companyStandardName', title: '公司名(标准名称)', width: 280 },
  {
    colKey: 'cnt',
    title: '相关备案/登记号',
    width: 120,
    align: 'center' as const,
    cell: (h: any, { row }: any) =>
      h(
        'span',
        {
          style: { color: '#0052d9', cursor: 'pointer', textDecoration: 'underline' },
          onClick: () => openSourceModal(row.id!),
        },
        row.cnt || 0,
      ),
  },
  { colKey: 'companyType', title: '公司类型', width: 100 },
  { colKey: 'companyShortName', title: '公司简称', width: 180, ellipsis: true },
  { colKey: 'parentCompanyShortName', title: '母公司简称', width: 180, ellipsis: true },
  { colKey: 'updater', title: '操作人', width: 100 },
  {
    colKey: 'updateTime',
    title: '更新时间',
    width: 170,
    cell: (h: any, { row }: any) => (row.updateTime ? moment(row.updateTime).format('YYYY-MM-DD HH:mm:ss') : '-'),
  },
  {
    colKey: 'operation',
    title: '编辑修正',
    width: 100,
    fixed: 'right' as const,
    // cell: (h: any, { row }: any) =>
    //   h(
    //     't-button',
    //     {
    //       theme: 'primary',
    //       variant: 'text',
    //       onClick: () => openEditModal(row),
    //     },
    //     { default: () => '编辑' },
    //   ),
  },
];

const sourceColumns = [
  {
    colKey: 'rowIndex',
    title: '序号',
    width: 80,
    cell: (h: any, { rowIndex }: any) => rowIndex + 1 + (sourcePagination.current - 1) * sourcePagination.pageSize,
  },
  { colKey: 'originName', title: '公司别名(源数名称)' },
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
    const res = await companyApi.queryStandardList(params);
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
const onPageChange = (pageInfo: any) => {
  fetchData(pageInfo.current, pageInfo.pageSize);
};
//#endregion

//#region Source Modal
const fetchSourceData = async (companyId: number, curr = 1, size = 10) => {
  sourceLoading.value = true;
  try {
    const res = await companyApi.getOriginCompanies({ queryId: companyId, pageNum: curr, pageSize: size });
    const mappedList = (res.data?.list || []).map((name: string) => ({ originName: name }));
    sourceData.value = mappedList;
    sourcePagination.current = curr;
    sourcePagination.pageSize = size;
    sourcePagination.total = res.data?.total || 0;
  } catch (e) {
    console.error(e);
  } finally {
    sourceLoading.value = false;
  }
};

const openSourceModal = (id: number) => {
  currentCompanyId.value = id;
  fetchSourceData(id, 1, 10);
  sourceModalVisible.value = true;
};

const onSourcePageChange = (pageInfo: any) => {
  if (currentCompanyId.value) {
    fetchSourceData(currentCompanyId.value, pageInfo.current, pageInfo.pageSize);
  }
};

const onSourceModalClose = () => {
  sourceModalVisible.value = false;
};
//#endregion

//#region Edit Modal
const onSearchRelation = async (keyword: string) => {
  if (!keyword) return;
  searchLoading.value = true;
  try {
    const res = await companyApi.queryByName({ searchKey: keyword, pageNum: 1, pageSize: 50, id: null });
    const opts = (res.data?.list || [])
      .filter((item: any) => item.parentCompanyId != null)
      .map((item: any) => ({
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
  const opt = relationOptions.value.find((o) => o.value === val);
  if (opt && opt.item) {
    editFormData.parentCompanyShortName = opt.item.parentCompanyShortName;
  }
};

const onRelationClear = () => {
  editFormData.companyStandardName = '';
  editFormData.companyShortName = '';
  editFormData.companyType = '';
  editFormData.parentCompanyShortName = '';
};

const openEditModal = async (record?: StandardCompanyDto) => {
  if (record && record.id) {
    relationOptions.value = [];
    editLoading.value = true;
    currentEditRecord.value = record;
    editModalVisible.value = true;
    try {
      const res = await companyApi.getStandardCompany(record.id);
      const data = res.data;
      currentEditRecord.value = data;
      editFormData.companyStandardName = data.companyStandardName || '';
      editFormData.companyShortName = data.companyShortName || '';
      editFormData.companyType = data.companyType || '';
      editFormData.parentCompanyShortName =
        data.parentCompanyShortName != null ? String(data.parentCompanyShortName) : '';
      editFormData.parentCompanyId = data.parentCompanyId || undefined;
      editFormData.remark = data.remark || '';
      if (data.parentCompanyShortName != null) {
        nextTick(() => onSearchRelation(String(data.parentCompanyShortName)));
      }
    } catch (e) {
      console.error(e);
      editModalVisible.value = false;
    } finally {
      editLoading.value = false;
    }
  } else {
    currentEditRecord.value = null;
    editFormData.companyStandardName = '';
    editFormData.companyShortName = '';
    editFormData.companyType = '';
    editFormData.parentCompanyShortName = '';
    editFormData.remark = '';
    editModalVisible.value = true;
  }
};

const submitEdit = async () => {
  editLoading.value = true;
  try {
    const submitData: StandardCompanyDto = {
      ...currentEditRecord.value,
      companyStandardName: editFormData.companyStandardName,
      companyShortName: editFormData.companyShortName,
      companyType: editFormData.companyType,
      parentCompanyShortName: editFormData.parentCompanyShortName,
      parentCompanyId: editFormData.parentCompanyId,
      remark: editFormData.remark,
    };
    await companyApi.saveStandardCompany(submitData);
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
