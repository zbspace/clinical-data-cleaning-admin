<template>
  <!--#region 用户管理页面 -->
  <t-card bordered>
    <div ref="searchCardRef" style="margin-bottom: 16px" class="search-card">
      <h2 style="margin: 0 0 16px 0; font-size: 18px; font-weight: 600; color: var(--td-text-color-primary)">
        用户管理
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
          <t-form-item label="用户名" name="username" style="margin-bottom: 0">
            <t-input v-model="formData.username" placeholder="请输入用户名" clearable />
          </t-form-item>
          <t-form-item label="手机号" name="phone" style="margin-bottom: 0">
            <t-input v-model="formData.phone" placeholder="请输入手机号" clearable style="width: 200px" />
          </t-form-item>
          <t-form-item label="用户类型" name="vipCode" style="margin-bottom: 0">
            <t-select v-model="formData.vipCode" :options="vipCodeOptions" placeholder="请选择用户类型" clearable />
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
      <template #operation="{ row }">
        <t-button theme="primary" @click="openEditModal(row)"> 编辑 </t-button>
      </template>
    </t-table>
    <!--#endregion-->

    <!--#region VIP信息编辑弹窗 -->
    <t-dialog
      v-model:visible="editModalVisible"
      header="VIP信息编辑"
      width="520px"
      :confirm-btn="{ content: '保存', theme: 'primary', loading: editLoading }"
      @confirm="submitEdit"
      @close="onEditModalClose"
    >
      <t-form ref="editFormRef" :data="editFormData" label-width="120px" label-align="left" style="padding: 8px 0">
        <t-form-item label="用户类型" name="vipCode">
          <t-select v-model="editFormData.vipCode" :options="vipCodeOptions" placeholder="请选择用户类型" />
        </t-form-item>
        <t-form-item label="会员开始时间" name="vipBeginTime">
          <t-date-picker
            v-model="editFormData.vipBeginTime"
            format="YYYY-MM-DD HH:mm:ss"
            value-type="YYYY-MM-DD HH:mm:ss"
            placeholder="请选择会员开始时间"
            clearable
            style="width: 100%"
          />
        </t-form-item>
        <t-form-item label="会员结束时间" name="vipEndTime">
          <t-date-picker
            v-model="editFormData.vipEndTime"
            format="YYYY-MM-DD HH:mm:ss"
            value-type="YYYY-MM-DD HH:mm:ss"
            placeholder="请选择会员结束时间"
            clearable
            style="width: 100%"
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
import { ref, reactive, onMounted } from 'vue';
import { MessagePlugin } from 'tdesign-vue-next';
import moment from 'moment';
import { wxUserApi } from '@/api';
import type { WxUserDto } from '@/api/types/wxUser';
//#endregion

//#region Constants
// 会员编码：0-普通用户 1-VIP试用 100-VIP用户
const vipCodeOptions = [
  { label: '普通用户', value: 0 },
  { label: 'VIP试用', value: 1 },
  { label: 'VIP用户', value: 100 },
];
//#endregion

//#region State
const formRef = ref();
const editFormRef = ref();
const loading = ref(false);

// 表格最大高度，根据 .search-card 动态计算
const tableMaxHeight = ref('calc(100vh - 320px)');
const searchCardRef = ref<HTMLElement | null>(null);

const tableData = ref<WxUserDto[]>([]);
const pagination = reactive({
  current: 1,
  pageSize: 20,
  total: 0,
  showJumper: true,
  foldedMaxPageBtn: 3,
});

const formData = reactive<Record<string, any>>({
  username: '',
  phone: '',
  vipCode: undefined,
});

// 编辑弹窗
const editModalVisible = ref(false);
const editLoading = ref(false);
const currentEditRecord = ref<WxUserDto | null>(null);

const editFormData = reactive<Record<string, any>>({
  id: undefined,
  vipCode: 0,
  vipBeginTime: '',
  vipEndTime: '',
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
  { colKey: 'username', title: '用户名', width: 160, ellipsis: true },
  { colKey: 'phone', title: '手机号', width: 140, cell: (h: any, { row }: any) => row.phone || '-' },
  {
    colKey: 'createTime',
    title: '首次登录时间',
    width: 170,
    cell: (h: any, { row }: any) => (row.createTime ? moment(row.createTime).format('YYYY-MM-DD HH:mm:ss') : '-'),
  },
  {
    colKey: 'vipDesc',
    title: '用户类型',
    width: 120,
    cell: (h: any, { row }: any) => row.vipDesc || '-',
  },
  {
    colKey: 'vipEndTime',
    title: '到期时间',
    width: 170,
    cell: (h: any, { row }: any) => (row.vipEndTime ? moment(row.vipEndTime).format('YYYY-MM-DD HH:mm:ss') : '-'),
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
    const res = await wxUserApi.pageData({
      username: formData.username || undefined,
      phone: formData.phone || undefined,
      vipCode: formData.vipCode !== undefined ? Number(formData.vipCode) : undefined,
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
  formData.username = '';
  formData.phone = '';
  formData.vipCode = undefined;
  fetchData(1);
};

const onPageChange = (pageInfo: any) => {
  fetchData(pageInfo.current, pageInfo.pageSize);
};
//#endregion

//#region Edit Modal
const openEditModal = (record: WxUserDto) => {
  currentEditRecord.value = record;
  editFormData.id = record.id;
  // 响应无 vipCode 字段，根据是否存在到期时间推断用户类型
  editFormData.vipCode = record.vipCode;
  editFormData.vipBeginTime = record.vipBeginTime ? moment(record.vipBeginTime).format('YYYY-MM-DD HH:mm:ss') : '';
  editFormData.vipEndTime = record.vipEndTime ? moment(record.vipEndTime).format('YYYY-MM-DD HH:mm:ss') : '';
  editModalVisible.value = true;
};

const submitEdit = async () => {
  editLoading.value = true;
  try {
    await wxUserApi.editUserVIP({
      id: editFormData.id,
      vipCode: Number(editFormData.vipCode),
      vipBeginTime: editFormData.vipBeginTime || undefined,
      vipEndTime: editFormData.vipEndTime || undefined,
    });
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
