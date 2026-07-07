<template>
  <!--#region 研究中心库管理页面 -->
  <t-card bordered style="height: calc(100vh - 80px)">
    <!-- 页面标题 -->
    <div style="margin-bottom: 16px">
      <h2 style="margin: 0 0 16px 0; font-size: 18px; font-weight: 600; color: var(--td-text-color-primary)">
        研究中心库
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
          <t-form-item label="中心名称（标准名）" name="hosStandardName" style="margin-bottom: 0">
            <t-input v-model="formData.hosStandardName" placeholder="请输入" clearable style="width: 220px" />
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
      max-height="calc(100vh - 280px)"
      style="white-space: nowrap"
      :pagination="pagination"
      @page-change="onPageChange"
    >
      <template #operation="{ row }">
        <t-button theme="primary" @click="openEditModal(row)"> 编辑 </t-button>
      </template>
    </t-table>
    <!--#endregion-->

    <!--#region 源数据研究中心名(别名)弹窗 -->
    <t-dialog
      v-model:visible="sourceModalVisible"
      header="源数据研究中心名(别名)"
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

    <!--#region 编辑/新增弹窗 -->
    <t-dialog
      v-model:visible="editModalVisible"
      :header="currentEditRecord ? '编辑' : '新增'"
      width="500px"
      :confirm-btn="{ content: '保存', theme: 'primary', loading: editLoading }"
      @confirm="submitEdit"
      @close="onEditModalClose"
    >
      <t-form ref="editFormRef" :data="editFormData" label-width="120" label-align="left">
        <t-form-item label="标准名称" name="hosStandardName">
          <t-input v-model="editFormData.hosStandardName" />
        </t-form-item>
        <t-form-item label="简称" name="hosShortName">
          <t-input v-model="editFormData.hosShortName" />
        </t-form-item>
        <t-form-item label="省份" name="province">
          <t-input v-model="editFormData.province" />
        </t-form-item>
        <t-form-item label="城市" name="city">
          <t-input v-model="editFormData.city" />
        </t-form-item>
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
import { ref, reactive, h, onMounted } from 'vue';
import { MessagePlugin } from 'tdesign-vue-next';
import moment from 'moment';
import { hospitalApi } from '@/api';
import type { StandardHospitalDto } from '@/api/types/hospital';
//#endregion

//#region State
const formRef = ref();
const editFormRef = ref();
const loading = ref(false);
const tableData = ref<StandardHospitalDto[]>([]);
const pagination = reactive({
  current: 1,
  pageSize: 20,
  total: 0,
  showJumper: true,
});

const formData = reactive<Record<string, any>>({
  hosStandardName: '',
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
const currentHospitalId = ref<number>();

// 编辑弹窗
const editModalVisible = ref(false);
const editLoading = ref(false);
const currentEditRecord = ref<StandardHospitalDto | null>(null);

const editFormData = reactive<Record<string, any>>({
  hosStandardName: '',
  hosShortName: '',
  province: '',
  city: '',
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
  { colKey: 'hosStandardName', title: '中心名称（标准名）', width: 300, ellipsis: true },
  { colKey: 'province', title: '省份', width: 150 },
  { colKey: 'city', title: '城市', width: 150 },
  {
    colKey: 'cnt',
    title: '别名',
    width: 80,
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
  { colKey: 'hosShortName', title: '简称', width: 200, ellipsis: true },
  { colKey: 'updater', title: '操作人', width: 100 },
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

const sourceColumns = [
  {
    colKey: 'rowIndex',
    title: '序号',
    width: 80,
    cell: (h: any, { rowIndex }: any) => rowIndex + 1 + (sourcePagination.current - 1) * sourcePagination.pageSize,
  },
  { colKey: 'originName', title: '研究中心别名(源数名称)' },
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
    const res = await hospitalApi.queryStandardList(params);
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
const fetchSourceData = async (hospitalId: number, curr = 1, size = 10) => {
  sourceLoading.value = true;
  try {
    const res = await hospitalApi.queryOriginHospitalList({ queryId: hospitalId, pageNum: curr, pageSize: size });
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
  currentHospitalId.value = id;
  fetchSourceData(id, 1, 10);
  sourceModalVisible.value = true;
};

const onSourcePageChange = (pageInfo: any) => {
  if (currentHospitalId.value) {
    fetchSourceData(currentHospitalId.value, pageInfo.current, pageInfo.pageSize);
  }
};

const onSourceModalClose = () => {
  sourceModalVisible.value = false;
};
//#endregion

//#region Edit Modal
const openEditModal = (record?: StandardHospitalDto) => {
  if (record) {
    currentEditRecord.value = record;
    editFormData.hosStandardName = record.hosStandardName || '';
    editFormData.hosShortName = record.hosShortName || '';
    editFormData.province = record.province || '';
    editFormData.city = record.city || '';
    editFormData.remark = record.remark || '';
    editModalVisible.value = true;
  } else {
    currentEditRecord.value = null;
    editFormData.hosStandardName = '';
    editFormData.hosShortName = '';
    editFormData.province = '';
    editFormData.city = '';
    editFormData.remark = '';
    editModalVisible.value = true;
  }
};

const submitEdit = async () => {
  editLoading.value = true;
  try {
    const submitData: StandardHospitalDto = {
      ...currentEditRecord.value,
      hosStandardName: editFormData.hosStandardName,
      hosShortName: editFormData.hosShortName,
      province: editFormData.province,
      city: editFormData.city,
      remark: editFormData.remark,
    };
    await hospitalApi.saveStandardHospital(submitData);
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
