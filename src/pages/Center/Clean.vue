<template>
  <!--#region 研究中心名称清洗页面 -->
  <t-card bordered>
    <div style="margin-bottom: 16px;">
      <h2 style="margin: 0 0 16px 0; font-size: 18px; font-weight: 600; color: var(--td-text-color-primary);">
        研究中心名称清洗
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
          <t-form-item label="原始研究中心名称" name="originalName" style="margin-bottom: 0;">
            <t-input v-model="formData.originalName" placeholder="请输入关键字" clearable style="width: 220px;" />
          </t-form-item>
          <t-form-item label="建议标准名称" name="suggestedName" style="margin-bottom: 0;">
            <t-input v-model="formData.suggestedName" placeholder="请输入关键字" clearable style="width: 220px;" />
          </t-form-item>
          <t-form-item label="清洗状态" name="cleanStatus" style="margin-bottom: 0;">
            <t-select
              v-model="formData.cleanStatus"
              :options="statusOptions"
              placeholder="请选择"
              clearable
              style="width: 220px;"
            />
          </t-form-item>
          <div style="display: flex; align-items: center; margin-left: auto;">
            <t-button theme="default" @click="onReset" style="background: #fff; margin-right: 8px;">
              重置条件
            </t-button>
            <t-button theme="primary" type="submit">
              立即查询
            </t-button>
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
      bordered
      stripe
      table-layout="auto"
      :pagination="pagination"
    />
    <!--#endregion-->

    <!--#region 编辑弹窗 -->
    <t-dialog
      v-model:visible="editModalVisible"
      header="编辑"
      width="500px"
      :confirm-btn="{ content: '保存', theme: 'primary', loading: editLoading }"
      @confirm="submitEdit"
      @close="onEditModalClose"
    >
      <div style="background-color: #f3f4f6; padding: 16px; margin-bottom: 16px; border-radius: 4px;">
        <p style="margin: 0 0 8px 0;">
          <strong>原始名称：</strong>
          {{ currentEditRecord?.originalName }}
        </p>
        <p style="margin: 0;">
          <strong>状态：</strong>
          {{ currentEditRecord?.status }}
        </p>
      </div>
      <t-form ref="editFormRef" :data="editFormData" label-width="140" label-align="left">
        <t-form-item label="标准名称" name="standardName">
          <t-input v-model="editFormData.standardName" />
        </t-form-item>
        <t-form-item label="省份" name="province">
          <t-input v-model="editFormData.province" />
        </t-form-item>
        <t-form-item label="城市" name="city">
          <t-input v-model="editFormData.city" />
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
//#endregion

//#region Constants
const statusOptions = [
  { label: '未清洗', value: 0 },
  { label: '已清洗', value: 1 },
  { label: '不用清洗', value: 2 },
];

// 生成模拟数据
const generateMockData = () => {
  const origins = [
    '北京协和医院(东院)',
    '复旦大学附属中山医院徐汇院区',
    '上海交通大学医学院附属瑞金医院北院',
    '北京大学第三医院(总院)',
    '华中科技大学同济医学院附属同济医院光谷院区',
    '中山大学附属第一医院(黄埔院区)',
    '四川大学华西医院温江院区',
    '浙江大学医学院附属第一医院之江院区',
  ];
  return origins.map((name, index) => ({
    id: index + 1,
    originalName: name,
    suggestedName: name.replace(/[（(].*[）)]/g, ''),
    status: index % 3 === 0 ? '未清洗' : index % 3 === 1 ? '已清洗' : '不用清洗',
    cleanStatus: index % 3,
    updateTime: moment().subtract(index, 'days').format('YYYY-MM-DD HH:mm:ss'),
    updater: '系统',
  }));
};

const mockData = generateMockData();
//#endregion

//#region State
const formRef = ref();
const editFormRef = ref();
const tableData = ref<any[]>(mockData);
const pagination = reactive({
  current: 1,
  pageSize: 20,
  total: mockData.length,
  showJumper: true,
});

const formData = reactive({
  originalName: '',
  suggestedName: '',
  cleanStatus: undefined as number | undefined,
});

// 编辑弹窗
const editModalVisible = ref(false);
const editLoading = ref(false);
const currentEditRecord = ref<any>(null);

const editFormData = reactive<Record<string, any>>({
  standardName: '',
  province: '',
  city: '',
});
//#endregion

//#region Columns Definition
const columns = [
  { colKey: 'id', title: '序号', width: 80 },
  { colKey: 'originalName', title: '原始研究中心名称', width: 280 },
  { colKey: 'suggestedName', title: '建议标准名称', width: 250 },
  { colKey: 'status', title: '状态', width: 100 },
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
    width: 150,
    fixed: 'right' as const,
    cell: (h: any, { row }: any) =>
      h('t-space', null, {
        default: () => [
          h(
            't-button',
            { theme: 'primary', variant: 'text', onClick: () => openEditModal(row) },
            { default: () => '采纳' },
          ),
          h(
            't-button',
            { theme: 'danger', variant: 'text' },
            { default: () => '忽略' },
          ),
        ],
      }),
  },
];
//#endregion

//#region Search
const onSearch = () => {
  const query = {
    originalName: formData.originalName?.toLowerCase() || '',
    suggestedName: formData.suggestedName?.toLowerCase() || '',
    cleanStatus: formData.cleanStatus,
  };
  const filtered = mockData.filter((item) => {
    const matchOrigin = !query.originalName || item.originalName.toLowerCase().includes(query.originalName);
    const matchStandard = !query.suggestedName || item.suggestedName.toLowerCase().includes(query.suggestedName);
    const matchStatus = query.cleanStatus === undefined || query.cleanStatus === null || item.cleanStatus === query.cleanStatus;
    return matchOrigin && matchStandard && matchStatus;
  });
  tableData.value = filtered;
  pagination.total = filtered.length;
  pagination.current = 1;
};

const onReset = () => {
  formData.originalName = '';
  formData.suggestedName = '';
  formData.cleanStatus = undefined;
  tableData.value = mockData;
  pagination.total = mockData.length;
  pagination.current = 1;
};
//#endregion

//#region Edit Modal
const openEditModal = (record: any) => {
  currentEditRecord.value = record;
  editFormData.standardName = record.suggestedName || '';
  editFormData.province = '';
  editFormData.city = '';
  editModalVisible.value = true;
};

const submitEdit = async () => {
  editLoading.value = true;
  try {
    // 模拟保存
    await new Promise((resolve) => setTimeout(resolve, 500));
    MessagePlugin.success('保存成功');
    editModalVisible.value = false;
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
</script>
