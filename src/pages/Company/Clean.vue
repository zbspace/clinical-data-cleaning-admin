<template>
  <!--#region 公司名清洗页面 -->
  <t-card bordered>
    <!-- 页面标题 -->
    <div ref="searchCardRef" style="margin-bottom: 16px" class="search-card">
      <h2 style="margin: 0 0 16px 0; font-size: 18px; font-weight: 600; color: var(--td-text-color-primary)">
        公司名清洗
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
          <t-form-item label="公司名(源数据)" name="companyName" style="margin-bottom: 0">
            <t-input v-model="formData.companyName" placeholder="请输入关键字" clearable style="width: 220px" />
          </t-form-item>
          <t-form-item label="母公司简称" name="parentCompanyShortName" style="margin-bottom: 0">
            <t-input
              v-model="formData.parentCompanyShortName"
              placeholder="请输入关键字"
              clearable
              style="width: 220px"
            />
          </t-form-item>
          <t-form-item label="公司类型" name="companyType" style="margin-bottom: 0">
            <t-select
              v-model="formData.companyType"
              :options="companyTypeOptions"
              placeholder="请选择公司类型"
              clearable
              style="width: 220px"
            />
          </t-form-item>
          <t-form-item label="清洗状态" name="cleanStatus" style="margin-bottom: 0">
            <t-select
              v-model="formData.cleanStatus"
              :options="statusOptions"
              placeholder="请选择状态"
              clearable
              style="width: 220px"
            />
          </t-form-item>
          <div style="display: flex; align-items: center; margin-left: auto">
            <t-space>
              <t-button theme="default" variant="base" @click="onReset" style="background: #fff"> 重置 </t-button>
              <t-button theme="primary" type="submit"> 查询 </t-button>
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
      :max-height="tableMaxHeight"
      style="white-space: nowrap"
      :pagination="pagination"
      @page-change="onPageChange"
      @sort-change="onSortChange"
    >
      <template #operation="{ row }">
        <t-button theme="primary" @click="openEditModal(row)"> 编辑 </t-button>
      </template>
      <template #cleanStatus="{ row }">
        <t-select
          :value="row.cleanStatus"
          :options="statusOptions"
          style="width: 100px"
          @change="(val: number) => onCleanStatusChange(row, val)"
        />
      </template>
    </t-table>
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
        <div style="background-color: #e6f7ff; padding: 16px; border-radius: 4px; margin-bottom: 16px">
          <!--#region 关联搜索 -->
          <t-form-item label="关联：" name="relationId" style="margin-bottom: 0">
            <t-select
              v-model="editFormData.relationId"
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
        </div>
        <div style="background-color: #e6f7ff; padding: 16px; border-radius: 4px">
          <t-form-item label="公司名(标准名称)" name="companyStandardName">
            <t-input v-model="editFormData.companyStandardName" :disabled="!!editFormData.relationId" />
          </t-form-item>
          <t-form-item label="公司简称" name="companyShortName">
            <t-input v-model="editFormData.companyShortName" :disabled="!!editFormData.relationId" />
          </t-form-item>
          <t-form-item label="公司类型" name="companyType">
            <t-select
              v-model="editFormData.companyType"
              :options="companyTypeOptions"
              clearable
              :disabled="!!editFormData.relationId"
            />
          </t-form-item>
          <t-form-item label="母公司简称" name="parentCompanyShortName">
            <t-input v-model="editFormData.parentCompanyShortName" :disabled="!!editFormData.relationId" />
          </t-form-item>
          <t-form-item label="备注" name="remark">
            <t-textarea v-model="editFormData.remark" />
          </t-form-item>
          <t-button theme="primary" variant="outline" v-if="!editFormData.relationId" @click="confirmAddNewCompany">
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
import { MessagePlugin, DialogPlugin } from 'tdesign-vue-next';
import moment from 'moment';
import { companyApi } from '@/api';
import type { CleanCompanyDto, StandardCompanyDto, CompanyShortDto } from '@/api/types/company';
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

// 表格最大高度，根据 .search-card 动态计算
const tableMaxHeight = ref('calc(100vh - 320px)');
const searchCardRef = ref<HTMLElement | null>(null);

const tableData = ref<CleanCompanyDto[]>([]);
const pagination = reactive({
  current: 1,
  pageSize: 20,
  total: 0,
  showJumper: true,
  foldedMaxPageBtn: 3,
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
  {
    colKey: 'companyOriginName',
    title: '公司名(源数据)',
    width: 280,
    ellipsis: true,
  },
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
          style: {
            color: '#0052d9',
            cursor: 'pointer',
          },
          onClick: () => openAccModal(row.id!),
        },
        row.cnt || 0,
      ),
  },
  {
    colKey: 'cleanStatus',
    title: '清洗状态',
    width: 130,
  },
  {
    colKey: 'companyStandardName',
    title: '清洗后公司名称(标准名)',
    width: 250,
  },
  { colKey: 'companyType', title: '公司类型', width: 100 },
  { colKey: 'companyShortName', title: '公司简称', width: 150 },
  { colKey: 'parentCompanyShortName', title: '母公司简称', width: 150 },
  { colKey: 'updater', title: '操作人', width: 100 },
  {
    colKey: 'updateTime',
    title: '更新时间',
    width: 180,
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
  {
    colKey: 'rowIndex',
    title: '序号',
    width: 80,
    cell: (h: any, { rowIndex }: any) => rowIndex + 1 + (accPagination.current - 1) * accPagination.pageSize,
  },
  { colKey: 'acceptanceNo', title: '相关登记号/备案号' },
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
    const params: Record<string, any> = {
      ...formData,
      pageNum: curr,
      pageSize: size,
    };

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

//#region 清洗状态 select 切换
const onCleanStatusChange = async (row: CleanCompanyDto, val: number) => {
  try {
    await companyApi.updateCleanStatus({
      id: row.id!,
      cleanStatus: val,
    });
    MessagePlugin.success('状态已更新');
    fetchData();
  } catch (e) {
    console.error(e);
    fetchData();
  }
};
//#endregion

//#endregion

//#region Acceptance Numbers Modal
const fetchAcceptanceNos = async (companyId: number, curr = 1, size = 5) => {
  accLoading.value = true;
  try {
    const res = await companyApi.getAcceptanceNos({
      queryId: companyId,
      pageNum: curr,
      pageSize: size,
    });
    const mappedList = (res.data?.list || []).map((no: string) => ({
      acceptanceNo: no,
    }));
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
const resetEditForm = () => {
  relationOptions.value = [];
  editFormData.relationId = undefined;
  editFormData.companyStandardName = '';
  editFormData.companyShortName = '';
  editFormData.companyType = '';
  editFormData.parentCompanyShortName = '';
  editFormData.remark = '';
};

const openEditModal = (record: CleanCompanyDto) => {
  resetEditForm();
  editModalVisible.value = true;

  currentEditRecord.value = record;
  editFormData.relationId = record.standardId || undefined;
  editFormData.companyStandardName = record.companyStandardName || '';
  editFormData.companyShortName = record.companyShortName || '';
  editFormData.companyType = record.companyType || '';
  editFormData.parentCompanyShortName = record.parentCompanyShortName || '';
  editFormData.remark = record.remark || '';

  nextTick(() => {
    if (!record.parentCompanyShortName || !record.standardId) return;
    onSearchRelation(record.parentCompanyShortName!);
  });
};

const onSearchRelation = async (keyword: string) => {
  if (!keyword) return;
  searchLoading.value = true;
  try {
    const res = await companyApi.queryStandardWithoutParent({
      searchKey: keyword,
      pageNum: 1,
      pageSize: 50,
      id: null,
    });
    const opts = (res.data?.list || [])
      .filter((item: CompanyShortDto) => item.parentCompanyId != null)
      .map((item: CompanyShortDto) => ({
        label: item.companyStandardName || '',
        // value: item.parentCompanyId as number,
        value: item.standardId as number,
        item,
      }));
    relationOptions.value = opts;
  } catch (e) {
    console.error(e);
  } finally {
    searchLoading.value = false;
  }
};

const onRelationClear = () => {
  editFormData.companyStandardName = '';
  editFormData.companyShortName = '';
  editFormData.companyType = '';
  editFormData.parentCompanyShortName = '';
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

const confirmAddNewCompany = () => {
  if (!editFormData.companyStandardName) {
    MessagePlugin.warning('请填写标准名');
    return;
  }
  DialogPlugin.confirm({
    header: '确认新增',
    body: '确认要新增该公司标准名吗？',
    confirmBtn: '确认新增',
    cancelBtn: '取消',
    onConfirm: () => {
      handleAddNewCompany();
    },
  });
};

const handleAddNewCompany = async () => {
  if (!editFormData.companyStandardName) {
    MessagePlugin.warning('请填写标准名');
    return;
  }
  newCompanyLoading.value = true;
  try {
    const submitData: StandardCompanyDto = {
      companyStandardName: editFormData.companyStandardName,
      companyShortName: editFormData.companyShortName,
      companyType: editFormData.companyType,
      parentCompanyShortName: editFormData.parentCompanyShortName,
      parentCompanyId: editFormData.relationId,
      remark: editFormData.remark,
      status: 0,
    };
    await companyApi.saveStandardCompany(submitData);
    MessagePlugin.success('新增成功');

    // 刷新关联选项并选中新增的公司
    const res = await companyApi.queryByName({
      searchKey: editFormData.companyStandardName,
      pageNum: 1,
      pageSize: 50,
    });
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
