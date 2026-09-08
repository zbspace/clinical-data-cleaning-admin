<template>
  <!--#region 试用申请页面 -->
  <t-card bordered>
    <div ref="searchCardRef" style="margin-bottom: 16px" class="search-card">
      <h2 style="margin: 0 0 16px 0; font-size: 18px; font-weight: 600; color: var(--td-text-color-primary)">
        试用申请
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
          label-width="100"
          style="display: flex; gap: 16px 0; flex-wrap: wrap"
          @submit="onSearch"
        >
          <t-form-item label="用户名" name="userName" style="margin-bottom: 0">
            <t-input v-model="formData.userName" placeholder="请输入用户名" clearable style="width: 200px" />
          </t-form-item>
          <t-form-item label="手机号" name="userPhone" style="margin-bottom: 0">
            <t-input v-model="formData.userPhone" placeholder="请输入手机号" clearable style="width: 200px" />
          </t-form-item>
          <t-form-item label="公司" name="userCompany" style="margin-bottom: 0">
            <t-input v-model="formData.userCompany" placeholder="请输入公司" clearable style="width: 200px" />
          </t-form-item>
          <t-form-item label="状态" name="approvalStatus" style="margin-bottom: 0">
            <t-select
              v-model="formData.approvalStatus"
              :options="approvalStatusOptions"
              placeholder="请选择状态"
              clearable
              style="width: 200px"
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
      row-key="id"
      :loading="loading"
      bordered
      stripe
      table-layout="fixed"
      :max-height="tableMaxHeight"
      style="white-space: nowrap"
      :pagination="pagination"
      @page-change="onPageChange"
    >
      <template #approvalStatus="{ row }">
        <t-tag :theme="approvalStatusTheme(row.approvalStatus)" variant="light">
          {{ approvalStatusLabel(row.approvalStatus) }}
        </t-tag>
      </template>
      <template #operation="{ row }">
        <t-button theme="primary" :disabled="row.approvalStatus !== 1" @click="openApprovalModal(row)"> 审核 </t-button>
      </template>
    </t-table>
    <!--#endregion-->

    <!--#region 审批弹窗 -->
    <t-dialog
      v-model:visible="approvalModalVisible"
      header="申请审批"
      width="480px"
      :confirm-btn="{ content: '提交', theme: 'primary', loading: approvalLoading }"
      @confirm="submitApproval"
    >
      <t-form
        ref="approvalFormRef"
        :data="approvalFormData"
        label-width="100px"
        label-align="left"
        style="padding: 8px 0"
      >
        <t-form-item label="用户姓名" name="userName">
          <t-input :value="approvalFormData.userName" disabled />
        </t-form-item>
        <t-form-item label="审批状态" name="approvalStatus">
          <t-select
            v-model="approvalFormData.approvalStatus"
            :options="approvalStatusOptions.filter((o) => o.value !== 1)"
            placeholder="请选择审批状态"
          />
        </t-form-item>
        <t-form-item label="审批备注" name="approvalRemark">
          <t-textarea v-model="approvalFormData.approvalRemark" placeholder="请输入审批备注" :maxlength="200" />
        </t-form-item>
      </t-form>
    </t-dialog>
    <!--#endregion-->
  </t-card>
  <!--#endregion-->
</template>

<script setup lang="ts">
//#region Imports
import { ref, reactive, onMounted } from 'vue';
import { MessagePlugin } from 'tdesign-vue-next';
import moment from 'moment';
import { vipApplicationApi } from '@/api';
import type { VipApplication } from '@/api/types/vipApplication';
//#endregion

//#region Constants
// 审批状态：1-待审批 2-审批通过 3-审批不通过
const approvalStatusOptions = [
  { label: '待审批', value: 1 },
  { label: '审批通过', value: 2 },
  { label: '审批不通过', value: 3 },
];

const approvalStatusLabel = (status?: number) => {
  return approvalStatusOptions.find((o) => o.value === status)?.label || '-';
};

const approvalStatusTheme = (status?: number) => {
  if (status === 1) return 'warning' as const;
  if (status === 2) return 'success' as const;
  if (status === 3) return 'danger' as const;
  return 'default' as const;
};
//#endregion

//#region State
const formRef = ref();
const approvalFormRef = ref();
const loading = ref(false);

// 表格最大高度，根据 .search-card 动态计算
const tableMaxHeight = ref('calc(100vh - 320px)');
const searchCardRef = ref<HTMLElement | null>(null);

const tableData = ref<VipApplication[]>([]);
const pagination = reactive({
  current: 1,
  pageSize: 20,
  total: 0,
  showJumper: true,
  foldedMaxPageBtn: 3,
});

const formData = reactive<Record<string, any>>({
  userName: '',
  userPhone: '',
  userCompany: '',
  approvalStatus: undefined,
});

// 审批弹窗
const approvalModalVisible = ref(false);
const approvalLoading = ref(false);
const currentApprovalRecord = ref<VipApplication | null>(null);

const approvalFormData = reactive<Record<string, any>>({
  id: undefined,
  userName: '',
  approvalStatus: 2,
  approvalRemark: '',
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
  { colKey: 'userName', title: '姓名', width: 120, ellipsis: true },
  { colKey: 'userPhone', title: '电话', width: 140, cell: (h: any, { row }: any) => row.userPhone || '-' },
  {
    colKey: 'userCompany',
    title: '公司',
    width: 180,
    ellipsis: true,
    cell: (h: any, { row }: any) => row.userCompany || '-',
  },
  {
    colKey: 'userPosition',
    title: '职位',
    width: 120,
    ellipsis: true,
    cell: (h: any, { row }: any) => row.userPosition || '-',
  },
  {
    colKey: 'applicateDate',
    title: '申请日期',
    width: 170,
    cell: (h: any, { row }: any) => (row.applicateDate ? moment(row.applicateDate).format('YYYY-MM-DD HH:mm:ss') : '-'),
  },
  {
    colKey: 'approvalStatus',
    title: '状态',
    width: 120,
  },
  {
    colKey: 'operation',
    title: '操作',
    width: 100,
    fixed: 'right' as const,
  },
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
    const res = await vipApplicationApi.getVipApplicationList({
      userName: formData.userName || undefined,
      userPhone: formData.userPhone || undefined,
      userCompany: formData.userCompany || undefined,
      approvalStatus: formData.approvalStatus !== undefined ? Number(formData.approvalStatus) : undefined,
      pageNum: curr,
      pageSize: size,
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
  formData.userName = '';
  formData.userPhone = '';
  formData.userCompany = '';
  formData.approvalStatus = undefined;
  fetchData(1);
};

const onPageChange = (pageInfo: any) => {
  fetchData(pageInfo.current, pageInfo.pageSize);
};
//#endregion

//#region Approval Modal
const openApprovalModal = (record: VipApplication) => {
  currentApprovalRecord.value = record;
  approvalFormData.id = record.id;
  approvalFormData.userName = record.userName || '';
  approvalFormData.approvalStatus = 2;
  approvalFormData.approvalRemark = '';
  approvalModalVisible.value = true;
};

const submitApproval = async () => {
  approvalLoading.value = true;
  try {
    await vipApplicationApi.approval({
      id: approvalFormData.id,
      approvalStatus: Number(approvalFormData.approvalStatus),
      approvalRemark: approvalFormData.approvalRemark || undefined,
    });
    MessagePlugin.success('审批成功');
    approvalModalVisible.value = false;
    fetchData();
  } catch (e) {
    console.error(e);
  } finally {
    approvalLoading.value = false;
  }
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
