<template>
  <!--#region 研究中心库管理页面 -->
  <t-card bordered>
    <div style="margin-bottom: 16px;">
      <h2 style="margin: 0 0 16px 0; font-size: 18px; font-weight: 600; color: var(--td-text-color-primary);">
        研究中心库
      </h2>

      <!--#region 搜索与操作栏 -->
      <div style="margin-bottom: 16px; display: flex; justify-content: space-between; align-items: center;">
        <t-space>
          <t-input v-model="searchKeyword" placeholder="搜索标准名称" clearable style="width: 220px;" />
          <t-button theme="primary" @click="onSearch">搜索</t-button>
        </t-space>
        <t-button theme="primary" @click="handleAdd">新增研究中心</t-button>
      </div>
      <!--#endregion-->
    </div>

    <!--#region 数据表格 -->
    <t-table
      :data="filteredData"
      :columns="columns"
      row-key="id"
      bordered
      stripe
      table-layout="auto"
      hover
    />
    <!--#endregion-->

    <!--#region 编辑/新增弹窗 -->
    <t-dialog
      v-model:visible="editModalVisible"
      :header="isAddMode ? '新增研究中心' : '编辑研究中心'"
      width="500px"
      :confirm-btn="{ content: '保存', theme: 'primary', loading: editLoading }"
      @confirm="submitEdit"
      @close="onEditModalClose"
    >
      <t-form ref="editFormRef" :data="editFormData" label-width="120" label-align="left">
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
import { ref, reactive, h, computed } from 'vue';
import { MessagePlugin } from 'tdesign-vue-next';
import moment from 'moment';
//#endregion

//#region Mock Data
const mockData = [
  { id: 1, standardName: '北京协和医院', province: '北京', city: '北京市', updateTime: '2023-10-01 10:00:00' },
  { id: 2, standardName: '复旦大学附属中山医院', province: '上海', city: '上海市', updateTime: '2023-10-02 14:30:00' },
  { id: 3, standardName: '上海交通大学医学院附属瑞金医院', province: '上海', city: '上海市', updateTime: '2023-10-03 09:15:00' },
  { id: 4, standardName: '北京大学第三医院', province: '北京', city: '北京市', updateTime: '2023-10-04 16:45:00' },
  { id: 5, standardName: '华中科技大学同济医学院附属同济医院', province: '湖北', city: '武汉市', updateTime: '2023-10-05 11:20:00' },
  { id: 6, standardName: '中山大学附属第一医院', province: '广东', city: '广州市', updateTime: '2023-10-06 08:00:00' },
  { id: 7, standardName: '四川大学华西医院', province: '四川', city: '成都市', updateTime: '2023-10-07 13:30:00' },
  { id: 8, standardName: '浙江大学医学院附属第一医院', province: '浙江', city: '杭州市', updateTime: '2023-10-08 15:00:00' },
];
//#endregion

//#region State
const editFormRef = ref();
const searchKeyword = ref('');
const editModalVisible = ref(false);
const editLoading = ref(false);
const isAddMode = ref(false);
const currentEditRecord = ref<any>(null);

const editFormData = reactive<Record<string, any>>({
  standardName: '',
  province: '',
  city: '',
});

const dataList = ref<any[]>(mockData);
const nextId = ref(mockData.length + 1);

const filteredData = computed(() => {
  const keyword = searchKeyword.value?.toLowerCase() || '';
  if (!keyword) return dataList.value;
  return dataList.value.filter((item) => item.standardName.toLowerCase().includes(keyword));
});
//#endregion

//#region Columns Definition
const columns = [
  { colKey: 'id', title: '序号', width: 80 },
  { colKey: 'standardName', title: '标准研究中心名称', width: 300 },
  { colKey: 'province', title: '省份', width: 150 },
  { colKey: 'city', title: '城市', width: 150 },
  {
    colKey: 'updateTime',
    title: '更新时间',
    width: 170,
    cell: (h: any, { row }: any) =>
      row.updateTime ? moment(row.updateTime).format('YYYY-MM-DD HH:mm:ss') : '-',
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
            { default: () => '编辑' },
          ),
          h(
            't-button',
            { theme: 'danger', variant: 'text', onClick: () => handleDelete(row) },
            { default: () => '删除' },
          ),
        ],
      }),
  },
];
//#endregion

//#region Operations
const onSearch = () => {
  // computed property handles filtering
};

const handleAdd = () => {
  isAddMode.value = true;
  currentEditRecord.value = null;
  editFormData.standardName = '';
  editFormData.province = '';
  editFormData.city = '';
  editModalVisible.value = true;
};

const openEditModal = (record: any) => {
  isAddMode.value = false;
  currentEditRecord.value = { ...record };
  editFormData.standardName = record.standardName || '';
  editFormData.province = record.province || '';
  editFormData.city = record.city || '';
  editModalVisible.value = true;
};

const handleDelete = (record: any) => {
  const index = dataList.value.findIndex((item) => item.id === record.id);
  if (index !== -1) {
    dataList.value.splice(index, 1);
    MessagePlugin.success('删除成功');
  }
};

const submitEdit = async () => {
  editLoading.value = true;
  try {
    await new Promise((resolve) => setTimeout(resolve, 300));
    if (isAddMode.value) {
      dataList.value.push({
        id: nextId.value++,
        standardName: editFormData.standardName,
        province: editFormData.province,
        city: editFormData.city,
        updateTime: moment().format('YYYY-MM-DD HH:mm:ss'),
      });
      MessagePlugin.success('新增成功');
    } else {
      if (currentEditRecord.value) {
        const item = dataList.value.find((d) => d.id === currentEditRecord.value.id);
        if (item) {
          item.standardName = editFormData.standardName;
          item.province = editFormData.province;
          item.city = editFormData.city;
          item.updateTime = moment().format('YYYY-MM-DD HH:mm:ss');
        }
        MessagePlugin.success('保存成功');
      }
    }
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
