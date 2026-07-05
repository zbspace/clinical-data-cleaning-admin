<template>
  <!--#region 研究中心名称清洗页面 -->
  <t-card bordered style="height: calc(100vh - 86px)">
    <!-- 页面标题 -->
    <div style="margin-bottom: 16px">
      <h2 style="margin: 0 0 16px 0; font-size: 18px; font-weight: 600; color: var(--td-text-color-primary)">
        研究中心名称清洗
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
          <t-form-item label="原始研究中心名称" name="hosOriginName" style="margin-bottom: 0">
            <t-input v-model="formData.hosOriginName" placeholder="请输入关键字" clearable style="width: 220px" />
          </t-form-item>
          <t-form-item label="标准名称" name="hosStandardName" style="margin-bottom: 0">
            <t-input v-model="formData.hosStandardName" placeholder="请输入关键字" clearable style="width: 220px" />
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
      max-height="calc(100vh - 290px)"
      style="white-space: nowrap"
      :pagination="pagination"
      @page-change="onPageChange"
      @sort-change="onSortChange"
    >
      <template #operation="{ row }">
        <t-button theme="primary" @click="openEditModal(row)"> 编辑 </t-button>
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
          <p style="margin: 0 0 8px 0"><strong>原始名称：</strong>{{ currentEditRecord?.hosOriginName }}</p>
        </div>
        <div style="background-color: #e6f7ff; padding: 16px; border-radius: 4px">
          <!--#region 关联搜索 -->
          <t-form-item label="关联标准研究中心：" name="hosStandardId" style="margin-bottom: 0">
            <t-select
              v-model="editFormData.hosStandardId"
              :options="relationOptions"
              filterable
              :loading="searchLoading"
              placeholder="请输入搜索标准研究中心"
              style="width: 360px"
              @search="onSearchRelation"
              @change="onRelationChange"
              @clear="onRelationClear"
              clearable
            />
          </t-form-item>
          <!--#endregion-->
        </div>
        <div style="margin-top: 16px">
          <t-form-item label="标准名称" name="hosStandardName">
            <t-input v-model="editFormData.hosStandardName" :disabled="!!editFormData.hosStandardId" />
          </t-form-item>
          <t-form-item label="备注" name="remark">
            <t-textarea v-model="editFormData.remark" />
          </t-form-item>
          <t-button theme="primary" variant="outline" v-if="!editFormData.hosStandardId" @click="confirmAddNewStandard">
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
import { hospitalApi } from '@/api';
import type { HospitalCleanDto, StandardHospitalDto } from '@/api/types/hospital';
//#endregion

//#region Constants
const statusOptions = [
  { label: '未清洗', value: 0 },
  { label: '已清洗', value: 1 },
  { label: '不用清洗', value: 2 },
];
//#endregion

//#region State
const formRef = ref();
const editFormRef = ref();
const loading = ref(false);
const tableData = ref<HospitalCleanDto[]>([]);
const pagination = reactive({
  current: 1,
  pageSize: 20,
  total: 0,
  showJumper: true,
});

const formData = reactive<Record<string, any>>({
  hosOriginName: '',
  hosStandardName: '',
  cleanStatus: null,
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
const currentHospitalId = ref<number>();

// 编辑弹窗
const editModalVisible = ref(false);
const editLoading = ref(false);
const currentEditRecord = ref<HospitalCleanDto | null>(null);
const relationOptions = ref<{ label: string; value: number; item: any }[]>([]);
const searchLoading = ref(false);

const editFormData = reactive<Record<string, any>>({
  hosStandardId: undefined,
  hosStandardName: '',
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
    colKey: 'hosOriginName',
    title: '中心名称（原名称）',
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
            textDecoration: 'underline',
          },
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
  {
    colKey: 'hosStandardName',
    title: '清洗后',
    width: 250,
  },
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

//#region Data Fetching
const fetchData = async (curr = pagination.current, size = pagination.pageSize) => {
  loading.value = true;
  try {
    const params: Record<string, any> = {
      ...formData,
      pageNum: curr,
      pageSize: size,
    };

    const res = await hospitalApi.pageData(params);
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
  formData.hosOriginName = '';
  formData.hosStandardName = '';
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
const fetchAcceptanceNos = async (hospitalId: number, curr = 1, size = 5) => {
  accLoading.value = true;
  try {
    const res = await hospitalApi.getAcceptanceNos({
      queryId: hospitalId,
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
  currentHospitalId.value = id;
  fetchAcceptanceNos(id, 1, 5);
  accModalVisible.value = true;
};

const onAccPageChange = (pageInfo: any) => {
  if (currentHospitalId.value) {
    fetchAcceptanceNos(currentHospitalId.value, pageInfo.current, pageInfo.pageSize);
  }
};

const onAccModalClose = () => {
  accModalVisible.value = false;
};
//#endregion

//#region Edit Modal
const resetEditForm = () => {
  relationOptions.value = [];
  editFormData.hosStandardId = undefined;
  editFormData.hosStandardName = '';
  editFormData.remark = '';
};

const openEditModal = (record: HospitalCleanDto) => {
  resetEditForm();
  currentEditRecord.value = record;
  editModalVisible.value = true;
  editFormData.hosStandardName = record.hosStandardName || '';
  editFormData.remark = record.remark || '';

  if (record.hosStandardName) {
    nextTick(() => {
      onSearchRelation(record.hosStandardName!);
    });
  }
};

const onSearchRelation = async (keyword: string) => {
  if (!keyword) return;
  searchLoading.value = true;
  try {
    const res = await hospitalApi.queryStandardList({
      hosStandardName: keyword,
      pageNum: 1,
      pageSize: 50,
    });
    const opts = (res.data?.list || []).map((item: StandardHospitalDto) => ({
      label: item.hosStandardName || '',
      value: item.id as number,
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
  editFormData.hosStandardName = '';
};

const onRelationChange = (val: any) => {
  const opt = relationOptions.value.find((o) => o.value === val);
  if (opt && opt.item) {
    editFormData.hosStandardName = opt.item.hosStandardName || '';
  }
};

const confirmAddNewStandard = () => {
  if (!editFormData.hosStandardName) {
    MessagePlugin.warning('请填写标准名称');
    return;
  }
  DialogPlugin.confirm({
    header: '确认新增',
    body: '确认要新增该研究中心标准名吗？',
    confirmBtn: '确认新增',
    cancelBtn: '取消',
    onConfirm: () => {
      handleAddNewStandard();
    },
  });
};

const handleAddNewStandard = async () => {
  if (!editFormData.hosStandardName) {
    MessagePlugin.warning('请填写标准名称');
    return;
  }
  try {
    const submitData: StandardHospitalDto = {
      hosStandardName: editFormData.hosStandardName,
      remark: editFormData.remark,
    };
    await hospitalApi.saveStandardHospital(submitData);
    MessagePlugin.success('新增成功');

    // 刷新关联选项并选中新增的标准
    const res = await hospitalApi.queryStandardList({
      hosStandardName: editFormData.hosStandardName,
      pageNum: 1,
      pageSize: 50,
    });
    const opts = (res.data?.list || []).map((item: StandardHospitalDto) => ({
      label: item.hosStandardName || '',
      value: item.id as number,
      item,
    }));
    relationOptions.value = opts;
    const matched = opts.find((o: any) => o.item.hosStandardName === editFormData.hosStandardName);
    if (matched) {
      editFormData.hosStandardId = matched.value;
      onRelationChange(matched.value);
    }
  } catch (e) {
    console.error(e);
  }
};

const submitEdit = async () => {
  if (!currentEditRecord.value) return;
  editLoading.value = true;
  try {
    const submitData: HospitalCleanDto = {
      ...currentEditRecord.value,
      hosStandardId: editFormData.hosStandardId,
      hosStandardName: editFormData.hosStandardName,
      remark: editFormData.remark,
      cleanStatus: 3,
    };
    await hospitalApi.saveClean(submitData);
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
