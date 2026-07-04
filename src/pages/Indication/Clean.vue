<template>
  <!--#region 适应症名称清洗页面 -->
  <t-card bordered>
    <div style="margin-bottom: 16px">
      <h2 style="margin: 0 0 16px 0; font-size: 18px; font-weight: 600; color: var(--td-text-color-primary)">
        适应症名称清洗
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
          <t-form-item label="适应症(源数据)" name="indicationComment" style="margin-bottom: 0">
            <t-input v-model="formData.indicationComment" placeholder="请输入关键字" clearable style="width: 220px" />
          </t-form-item>
          <t-form-item label="清洗状态" name="status" style="margin-bottom: 0">
            <t-select
              v-model="formData.status"
              :options="statusOptions"
              placeholder="请选择"
              clearable
              style="width: 220px"
            />
          </t-form-item>
          <div style="display: flex; align-items: center; margin-left: auto">
            <t-button theme="default" @click="onReset" style="background: #fff; margin-right: 8px"> 重置条件 </t-button>
            <t-button theme="primary" type="submit"> 立即查询 </t-button>
          </div>
        </t-form>
      </div>
      <!--#endregion-->
    </div>

    <!--#region 数据表格 -->
    <t-table
      :data="tableData"
      :columns="columns"
      row-key="indicationCommentId"
      :loading="loading"
      bordered
      stripe
      table-layout="auto"
      :pagination="pagination"
      @page-change="onPageChange"
    />
    <!--#endregion-->

    <!--#region 相关受理号/备案号弹窗 -->
    <t-dialog
      v-model:visible="accModalVisible"
      header="相关受理号/备案号"
      :footer="false"
      width="600px"
      @close="onAccModalClose"
    >
      <t-table :data="accData" :columns="accColumns" row-key="no" bordered stripe :pagination="{ pageSize: 5 }" />
    </t-dialog>
    <!--#endregion-->

    <!--#region 编辑弹窗 -->
    <t-dialog
      v-model:visible="editModalVisible"
      header="编辑"
      width="800px"
      :confirm-btn="{ content: '提交', theme: 'primary', loading: editLoading }"
      @confirm="submitEdit"
      @close="onEditModalClose"
    >
      <div style="background-color: #e6f7ff; padding: 16px; border-radius: 4px; margin-bottom: 16px">
        <div style="display: flex; gap: 8px; margin-bottom: 8px">
          <div
            style="width: 4px; height: 16px; background: var(--td-brand-color); border-radius: 2px; margin-top: 4px"
          ></div>
          <div style="font-weight: bold">适应症（源数据）：</div>
        </div>
        <div
          style="background: #fff; padding: 12px; border-radius: 4px; font-size: 13px; line-height: 1.6; color: #333"
        >
          {{ currentEditRecord?.indicationComment }}
        </div>
      </div>

      <div style="background-color: #e6f7ff; padding: 16px; border-radius: 4px">
        <div style="display: flex; gap: 8px; margin-bottom: 16px">
          <div
            style="width: 4px; height: 16px; background: var(--td-brand-color); border-radius: 2px; margin-top: 4px"
          ></div>
          <div style="font-weight: bold">适应症（清洗后）：</div>
        </div>
        <!--#region 内嵌编辑表格 -->
        <t-table
          :data="currentEditRecord?.indicationTagDtoList || []"
          :columns="editColumns"
          row-key="id"
          bordered
          size="small"
          :pagination="undefined"
        />
        <!--#endregion-->
      </div>
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
import { indicationApi } from '@/api';
import type { IndicationDto, IndicationDetailDto, IndicationTagDto } from '@/api/types/indication';
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
const loading = ref(false);
const tableData = ref<IndicationDto[]>([]);
const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0,
  showJumper: true,
});

const formData = reactive({
  indicationComment: '',
  status: undefined as number | undefined,
});

// 备案号弹窗
const accModalVisible = ref(false);
const accData = ref<{ no: string }[]>([]);

// 编辑弹窗
const editModalVisible = ref(false);
const editLoading = ref(false);
const currentEditRecord = ref<IndicationDetailDto | null>(null);
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
    colKey: 'indicationComment',
    title: '适应症(源数据)',
    width: 250,
    cell: (h: any, { row }: any) =>
      h(
        'div',
        {
          style: {
            maxHeight: '80px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
          },
          title: row.indicationComment,
        },
        row.indicationComment || '-',
      ),
  },
  {
    colKey: 'statisticCount',
    title: '统计',
    width: 100,
    align: 'center' as const,
    cell: (h: any, { row }: any) =>
      h(
        'span',
        {
          style: { color: '#0052d9', cursor: 'pointer', textDecoration: 'underline' },
          onClick: () => openAccModal(row),
        },
        row.statisticCount || 0,
      ),
  },
  {
    colKey: 'status',
    title: '状态',
    width: 120,
    cell: (h: any, { row }: any) => {
      const item = statusOptions.find((opt) => opt.value === row.status);
      return item ? item.label : '-';
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
  { colKey: 'rowIndex', title: '序号', width: 80, cell: (h: any, { rowIndex }: any) => rowIndex + 1 },
  { colKey: 'no', title: '相关受理号/备案号' },
];

const editColumns = [
  { colKey: 'rowIndex', title: '序号', width: 60, cell: (h: any, { rowIndex }: any) => rowIndex + 1 },
  {
    colKey: 'aiClean',
    title: 'AI清洗后适应症',
    cell: (h: any, { row }: any) => h('span', row.indicationStandard || ''),
  },
  {
    colKey: 'manualClean',
    title: '人工审核清洗后数据',
    cell: (h: any, { row, rowIndex }: any) =>
      h('t-input', {
        value: row.indicationStandard,
        onChange: (val: string) => handleEditChange(rowIndex, 'indicationStandard', val),
      }),
  },
];
//#endregion

//#region Data Fetching
const fetchData = async (curr = pagination.current, size = pagination.pageSize) => {
  loading.value = true;
  try {
    const params: Record<string, any> = {
      pageNum: curr,
      pageSize: size,
      status: formData.status !== undefined ? Number(formData.status) : undefined,
    };
    const res = await indicationApi.pageData(params);
    if (res.code === 0) {
      tableData.value = res.data?.list || [];
      pagination.current = curr;
      pagination.pageSize = size;
      pagination.total = res.data?.total || 0;
    } else {
      MessagePlugin.error(res.msg || '查询失败');
    }
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }
};

const onSearch = () => fetchData(1);

const onReset = () => {
  formData.indicationComment = '';
  formData.status = undefined;
  fetchData(1);
};

const onPageChange = (pageInfo: any) => {
  fetchData(pageInfo.current, pageInfo.pageSize);
};
//#endregion

//#region Acc Modal
const openAccModal = (record: IndicationDto) => {
  const list = (record.sourceList || []).map((no: string) => ({ no }));
  accData.value = list;
  accModalVisible.value = true;
};

const onAccModalClose = () => {
  accModalVisible.value = false;
};
//#endregion

//#region Edit Modal
const openEditModal = async (record: IndicationDto) => {
  if (!record.indicationCommentId) return;
  try {
    const res = await indicationApi.getIndicationDetail(record.indicationCommentId);
    if (res.code === 0 && res.data) {
      currentEditRecord.value = JSON.parse(JSON.stringify(res.data));
      editModalVisible.value = true;
    } else {
      MessagePlugin.error(res.msg || '获取详情失败');
    }
  } catch (e) {
    console.error(e);
  }
};

const handleEditChange = (index: number, field: string, value: any) => {
  if (!currentEditRecord.value) return;
  const newData = { ...currentEditRecord.value };
  if (!newData.indicationTagDtoList) newData.indicationTagDtoList = [];
  newData.indicationTagDtoList[index] = {
    ...newData.indicationTagDtoList[index],
    [field]: value,
  };
  currentEditRecord.value = newData;
};

const submitEdit = async () => {
  if (!currentEditRecord.value) return;
  editLoading.value = true;
  try {
    const res = await indicationApi.saveIndication(currentEditRecord.value);
    if (res.code === 0) {
      MessagePlugin.success('保存成功');
      editModalVisible.value = false;
      fetchData();
    } else {
      MessagePlugin.error(res.msg || '保存失败');
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
};
//#endregion

//#region Lifecycle
onMounted(() => {
  fetchData();
});
//#endregion
</script>
