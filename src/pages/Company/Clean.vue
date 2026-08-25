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
              :options="statusOptions.map((item) => ({ ...item, disabled: false }))"
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
        <t-space size="4">
          <t-button theme="primary" @click="openEditModal(row)"> 关联 </t-button>
          &emsp;
          <t-button theme="primary" @click="openSplitModal(row)"> 拆分 </t-button>
        </t-space>
      </template>
      <template #cleanStatus="{ row }">
        <t-select
          :value="row.cleanStatus"
          :options="statusOptions"
          :disabled="row.cleanStatus === 3"
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

    <!--#region 关联弹窗 -->
    <t-dialog
      v-model:visible="editModalVisible"
      header="关联"
      width="600px"
      :confirm-btn="{ content: '提交', theme: 'primary', loading: editLoading }"
      @confirm="submitEdit"
      @close="onEditModalClose"
    >
      <t-form ref="editFormRef" :data="editFormData" label-width="120px" label-align="left">
        <div style="background-color: #e6f7ff; padding: 16px; border-radius: 4px; margin-bottom: 16px">
          <!--#region 关联搜索 -->
          <t-form-item label="关联：" name="relationId" style="margin-bottom: 10px">
            <t-select
              v-model="editFormData.relationId"
              :options="relationOptions"
              filterable
              :loading="searchLoading"
              placeholder="请输入搜索标准公司"
              style="width: 360px"
              @search="(val: any) => onSearchRelation(val)"
              @change="onRelationChange"
              @clear="onRelationClear"
              clearable
            />
            <t-button theme="primary" style="margin-left: 20px" @click="openAddModal"> 新增 </t-button>
          </t-form-item>
          <!--#endregion-->
        </div>
        <div style="background-color: #e6f7ff; padding: 16px; border-radius: 4px">
          <t-form-item label="公司名(标准名称)" name="companyStandardName">
            <t-input v-model="editFormData.companyStandardName" disabled />
          </t-form-item>
          <t-form-item label="公司简称" name="companyShortName">
            <t-input v-model="editFormData.companyShortName" disabled />
          </t-form-item>
          <t-form-item label="公司类型" name="companyType">
            <t-select v-model="editFormData.companyType" :options="companyTypeOptions" clearable disabled />
          </t-form-item>
          <t-form-item label="母公司简称" name="parentCompanyShortName">
            <t-input v-model="editFormData.parentCompanyShortName" disabled />
          </t-form-item>
          <t-form-item label="备注" name="remark">
            <t-textarea v-model="editFormData.remark" />
          </t-form-item>
        </div>
      </t-form>
    </t-dialog>
    <!--#endregion-->

    <!--#region 新增标准名公司弹窗 -->
    <t-dialog
      v-model:visible="addModalVisible"
      header="新增标准名公司"
      width="600px"
      :confirm-btn="{ content: '保存', theme: 'primary', loading: addLoading }"
      @confirm="submitAddCompany"
    >
      <t-form :data="addFormData" label-width="120px" label-align="left" style="padding: 8px 0">
        <t-form-item label="公司名(标准名称)" name="companyStandardName">
          <t-input v-model="addFormData.companyStandardName" placeholder="请输入标准名称" clearable />
        </t-form-item>
        <t-form-item label="公司简称" name="companyShortName">
          <t-input v-model="addFormData.companyShortName" placeholder="请输入公司简称" clearable />
        </t-form-item>
        <t-form-item label="公司类型" name="companyType">
          <t-select
            v-model="addFormData.companyType"
            :options="companyTypeOptions"
            placeholder="请选择公司类型"
            clearable
          />
        </t-form-item>
        <t-form-item label="母公司简称" name="parentCompanyShortName">
          <!-- <t-input v-model="addFormData.parentCompanyShortName" placeholder="请输入母公司简称" clearable /> -->
          <t-select
            v-model="addFormData.parentCompanyId"
            :options="relationParentOptions"
            filterable
            :loading="searchLoading"
            placeholder="请输入搜索母公司"
            style="width: 360px"
            @search="(keyword: string) => onSearchParentRelation(keyword, undefined)"
            clearable
          />
          <t-button theme="primary" style="margin-left: 20px" @click="openParentModal"> 新增母公司 </t-button>
        </t-form-item>
        <t-form-item label="备注" name="remark">
          <t-textarea v-model="addFormData.remark" placeholder="请输入备注" :maxlength="200" show-word-limit />
        </t-form-item>
      </t-form>
    </t-dialog>
    <!--#endregion-->

    <!--#region 新增母公司弹窗 -->
    <t-dialog
      v-model:visible="parentModalVisible"
      header="新增母公司"
      width="480px"
      :confirm-btn="{ content: '保存', theme: 'primary', loading: parentLoading }"
      @confirm="submitParentCompany"
    >
      <t-form :data="parentFormData" label-width="100px" label-align="left" style="padding: 8px 0">
        <t-form-item label="母公司简称" name="parentCompanyShortName">
          <t-input v-model="parentFormData.parentCompanyShortName" placeholder="请输入母公司简称" clearable />
        </t-form-item>
        <t-form-item label="公司类型" name="companyType">
          <t-select
            v-model="parentFormData.companyType"
            :options="companyTypeOptions"
            placeholder="请选择公司类型"
            clearable
          />
        </t-form-item>
      </t-form>
    </t-dialog>
    <!--#endregion-->

    <!--#region 拆分弹窗 -->
    <t-dialog
      v-model:visible="splitModalVisible"
      header="源名称拆分"
      width="600px"
      :confirm-btn="{ content: '保存', theme: 'primary', loading: splitLoading }"
      @confirm="submitSplit"
      @close="onSplitModalClose"
    >
      <t-form label-width="120px" label-align="left" style="padding: 8px 0">
        <t-form-item label="公司名(源数据)" name="companyOriginName">
          <t-input v-model="splitFormData.companyOriginName" disabled />
        </t-form-item>
        <t-form-item label="拆分公司名称" name="spiltNames" style="align-items: flex-start">
          <div style="width: 100%">
            <div
              v-for="(item, index) in splitFormData.spiltNames"
              :key="index"
              style="display: flex; gap: 8px; margin-bottom: 8px"
            >
              <t-input v-model="item.companyOriginName" placeholder="请输入拆分后的公司名称" style="flex: 1" />
              <t-button theme="danger" variant="text" @click="removeSplitName(index)">
                <template #icon><t-icon name="delete" /></template>
                删除
              </t-button>
            </div>
            <t-button theme="primary" variant="outline" @click="addSplitName">
              <template #icon><t-icon name="add" /></template>
              增加
            </t-button>
          </div>
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
import type {
  CleanCompanyDto,
  StandardCompanyDto,
  CompanyShortDto,
  SplitCompanyDto,
  ParentCompanyDto,
} from '@/api/types/company';
import { COMPANY_TYPE, createEnumsToOptions, CLEANING_STATUS } from '@/utils/enums';
//#endregion

//#region Constants
const statusOptions = createEnumsToOptions(CLEANING_STATUS, [CLEANING_STATUS.已拆分]);

const companyTypeOptions = createEnumsToOptions(COMPANY_TYPE);
//#endregion

//#region State
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
const relationParentOptions = ref<{ label: string; value: number }[]>([]);
const searchLoading = ref(false);

const editFormData = reactive<Record<string, any>>({
  relationId: undefined,
  companyStandardName: '',
  companyShortName: '',
  companyType: '',
  parentCompanyShortName: '',
  remark: '',
});

// 新增标准名公司弹窗
const addModalVisible = ref(false);
const addLoading = ref(false);
const addFormData = reactive<Record<string, any>>({
  companyStandardName: '',
  companyShortName: '',
  companyType: '',
  parentCompanyShortName: '',
  parentCompanyId: '',
  remark: '',
});

// 新增母公司弹窗
const parentModalVisible = ref(false);
const parentLoading = ref(false);
const parentFormData = reactive<Record<string, any>>({
  parentCompanyShortName: '',
  companyType: '',
});

// 拆分弹窗
const splitModalVisible = ref(false);
const splitLoading = ref(false);
const splitFormData = reactive<{
  id?: number;
  companyOriginName: string;
  spiltNames: { companyOriginName: string }[];
}>({
  id: undefined,
  companyOriginName: '',
  spiltNames: [{ companyOriginName: '' }],
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
    width: 160,
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
  relationParentOptions.value = [];
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
    if (!record.standardId) return;
    onSearchRelation('', record.standardId);
  });
};

const onSearchRelation = async (keyword = '', id?: number) => {
  searchLoading.value = true;
  try {
    const res = await companyApi.queryStandardWithoutParent({
      searchKey: keyword || '',
      pageNum: 1,
      pageSize: 50,
      id: id || null,
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

const onSearchParentRelation = async (keyword = '', id?: number) => {
  searchLoading.value = true;
  try {
    const res = await companyApi.queryParentData({
      searchKey: keyword || '',
      pageNum: 1,
      pageSize: 50,
      id: id || null,
    });
    const opts = (res.data?.list || [])
      .filter((item: CompanyShortDto) => item.parentCompanyId != null)
      .map((item: CompanyShortDto) => ({
        label: item.companyStandardName || '',
        // value: item.parentCompanyId as number,
        value: item.standardId as number,
        item,
      }));
    relationParentOptions.value = opts;
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
  addFormData.parentCompanyShortName = '';
};

const onRelationChange = (val: any) => {
  const allOpts = relationOptions.value as any;
  const opt = allOpts.find((o: any) => o.value === val);
  if (opt && opt.item) {
    editFormData.companyStandardName = opt.item.companyStandardName || '';
    editFormData.companyShortName = opt.item.companyShortName || '';
    editFormData.companyType = opt.item.companyType || '';
    editFormData.parentCompanyShortName = opt.item.parentCompanyShortName || '';
    // 同步到新增表单，提交时一并传给后端
    addFormData.parentCompanyShortName = opt.item.parentCompanyShortName || '';
  }
};

const openAddModal = () => {
  addFormData.companyStandardName = '';
  addFormData.companyShortName = '';
  addFormData.companyType = '';
  addFormData.parentCompanyShortName = '';
  addFormData.parentCompanyId = '';
  addFormData.remark = '';
  addModalVisible.value = true;
};

const submitAddCompany = async () => {
  if (!addFormData.companyStandardName?.trim()) {
    MessagePlugin.warning('请填写标准名');
    return;
  }
  addLoading.value = true;
  try {
    const submitData: StandardCompanyDto = {
      companyStandardName: addFormData.companyStandardName,
      companyShortName: addFormData.companyShortName,
      companyType: addFormData.companyType,
      parentCompanyShortName:
        relationParentOptions.value.find((o: any) => o.value === addFormData.parentCompanyId)?.label || '',
      parentCompanyId: addFormData.parentCompanyId || undefined,
      remark: addFormData.remark,
      status: 0,
    };
    await companyApi.saveStandardCompany(submitData);
    MessagePlugin.success('新增成功');
    addModalVisible.value = false;

    // 刷新关联下拉选项，命中则自动选中新增的标准公司
    await onSearchRelation(addFormData.companyStandardName);
    const matched = (relationOptions.value as any).find(
      (o: any) => o.item?.companyStandardName === addFormData.companyStandardName,
    );
    if (matched) {
      editFormData.relationId = matched.value;
      onRelationChange(matched.value);
    }
  } catch (e) {
    console.error(e);
  } finally {
    addLoading.value = false;
  }
};

const openParentModal = () => {
  parentFormData.parentCompanyShortName = '';
  parentFormData.companyType = '';
  parentModalVisible.value = true;
};

const submitParentCompany = async () => {
  if (!parentFormData.parentCompanyShortName?.trim()) {
    MessagePlugin.warning('请填写母公司简称');
    return;
  }
  parentLoading.value = true;
  try {
    const submitData: ParentCompanyDto = {
      parentCompanyShortName: parentFormData.parentCompanyShortName,
      companyType: parentFormData.companyType,
    };
    await companyApi.saveParentCompany(submitData);
    MessagePlugin.success('新增成功');
    parentModalVisible.value = false;

    // 刷新母公司下拉选项，命中则自动选中新增的母公司
    await onSearchRelation(parentFormData.parentCompanyShortName);
    const matched = (relationParentOptions.value as any).find(
      (o: any) =>
        o.item?.parentCompanyShortName === parentFormData.parentCompanyShortName ||
        o.item?.companyStandardName === parentFormData.parentCompanyShortName,
    );
    if (matched) {
      addFormData.parentCompanyId = matched.value;
    }
  } catch (e) {
    console.error(e);
  } finally {
    parentLoading.value = false;
  }
};

const submitEdit = async () => {
  if (!currentEditRecord.value) return;
  editLoading.value = true;
  try {
    const submitData: CleanCompanyDto = {
      id: currentEditRecord.value.id,
      standardId: editFormData.relationId,
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

//#region Split Modal
const openSplitModal = (record: CleanCompanyDto) => {
  splitFormData.id = record.id;
  splitFormData.companyOriginName = record.companyOriginName || '';
  splitFormData.spiltNames = [{ companyOriginName: '' }];
  splitModalVisible.value = true;
};

const addSplitName = () => {
  splitFormData.spiltNames.push({ companyOriginName: '' });
};

const removeSplitName = (index: number) => {
  splitFormData.spiltNames.splice(index, 1);
};

const submitSplit = async () => {
  const names = splitFormData.spiltNames
    .map((item) => item.companyOriginName?.trim())
    .filter((name): name is string => !!name);
  if (!names.length) {
    MessagePlugin.warning('请至少填写一个拆分公司名称');
    return;
  }
  splitLoading.value = true;
  try {
    const submitData: SplitCompanyDto = {
      id: splitFormData.id,
      companyOriginName: splitFormData.companyOriginName,
      spiltNames: names.map((name) => ({ companyOriginName: name })),
    };
    await companyApi.spiltNames(submitData);
    MessagePlugin.success('拆分成功');
    splitModalVisible.value = false;
    fetchData();
  } catch (e) {
    console.error(e);
  } finally {
    splitLoading.value = false;
  }
};

const onSplitModalClose = () => {
  splitModalVisible.value = false;
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
