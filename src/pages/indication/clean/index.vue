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
      row-key="indicationCommentId"
      :loading="loading"
      bordered
      stripe
      table-layout="fixed"
      max-height="calc(100vh - 290px)"
      :pagination="pagination"
      @page-change="onPageChange"
    >
      <template #operation="{ row }">
        <t-button theme="primary" @click="openEditModal(row)"> 编辑 </t-button>
      </template>

      <template #status="{ row }">
        <t-select
          :value="row.status"
          :options="statusOptions"
          style="width: 100px"
          @change="(val: number) => onCleanStatusChange(row, val)"
        />
      </template>
    </t-table>
    <!--#endregion-->

    <!--#region 相关受理号/备案号弹窗 -->
    <t-dialog
      v-model:visible="accModalVisible"
      header="相关受理号/备案号"
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
        <t-input
          :model-value="currentEditRecord?.indicationComment ?? ''"
          @update:model-value="
            (val: string) => {
              if (currentEditRecord) currentEditRecord.indicationComment = val;
            }
          "
          placeholder="请输入适应症（源数据）"
          :autosize="{ minRows: 2, maxRows: 6 }"
          style="background: #fff; border-radius: 4px; font-size: 13px; line-height: 1.6"
        />
      </div>

      <div style="background-color: #e6f7ff; padding: 16px; border-radius: 4px">
        <div style="display: flex; gap: 8px; margin-bottom: 16px">
          <div
            style="width: 4px; height: 16px; background: var(--td-brand-color); border-radius: 2px; margin-top: 4px"
          ></div>
          <div style="font-weight: bold">适应症（清洗后）：</div>
        </div>
        <!--#region 编辑列表 -->
        <div style="margin-bottom: 8px">
          <t-button theme="primary" variant="outline" @click="addEditRow">+ 新增</t-button>
        </div>
        <div
          style="
            display: flex;
            gap: 8px;
            align-items: center;
            margin-bottom: 4px;
            padding: 4px 12px;
            font-size: 12px;
            color: #999;
          "
        >
          <div style="width: 40px; text-align: center; flex-shrink: 0">序号</div>
          <div style="flex: 1; min-width: 0">适应症归类</div>
          <div style="flex: 2; min-width: 0">人工审核清洗后数据</div>
          <div style="width: 56px; flex-shrink: 0"></div>
        </div>
        <div
          v-for="(item, index) in currentEditRecord?.indicationTagDtoList || []"
          :key="index"
          style="
            display: flex;
            gap: 8px;
            align-items: center;
            margin-bottom: 8px;
            background: #fff;
            padding: 8px 12px;
            border-radius: 4px;
          "
        >
          <div style="width: 40px; text-align: center; font-weight: 500; flex-shrink: 0">{{ index + 1 }}</div>
          <div style="flex: 1; min-width: 0">
            <t-select
              v-model="item.indicationCategoryId"
              :options="categoryOptions"
              placeholder="请选择适应症归类"
              clearable
              style="width: 100%"
              value-key="id"
              :keys="{ label: 'categoryName', value: 'id' }"
            />
          </div>
          <div style="flex: 2; min-width: 0">
            <t-select
              v-model="item.indicationTagId"
              :options="dictOptions"
              placeholder="请选择清洗后数据"
              clearable
              filterable
              style="width: 100%"
              :keys="{ label: 'indicationStandard', value: 'indicationTagId' }"
            />
          </div>
          <t-button theme="danger" variant="text" style="flex-shrink: 0" @click="removeEditRow(index)">删除</t-button>
        </div>
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
import type {
  IndicationDto,
  IndicationDetailDto,
  IndicationTagDto,
  IndicationCategory,
  IndicationDictDto,
  IndicationRelDto,
} from '@/api/types/indication';
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
  pageSize: 20,
  total: 0,
  showJumper: true,
  foldedMaxPageBtn: 3,
});

const formData = reactive({
  indicationComment: '',
  status: 0 as number | undefined,
});

// 备案号弹窗
const accModalVisible = ref(false);
const accLoading = ref(false);
const accData = ref<IndicationRelDto[]>([]);
const accPagination = reactive({
  current: 1,
  pageSize: 5,
  total: 0,
  showJumper: true,
});
const currentIndicationId = ref<number | null>(null);

// 编辑弹窗
const editModalVisible = ref(false);
const editLoading = ref(false);
const currentEditRecord = ref<IndicationDetailDto | null>(null);

// 编辑弹窗下拉选项
const categoryOptions = ref<IndicationCategory[]>([]);
const dictOptions = ref<IndicationDictDto[]>([]);
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
    colKey: 'indicationComment',
    title: '适应症(源数据)',
    width: 300,
    cell: (h: any, { row }: any) => row.indicationComment || '-',
    ellipsis: true,
  },
  {
    colKey: 'statisticCount',
    title: '相关受理号/备案号',
    width: 120,
    align: 'center' as const,
    cell: (h: any, { row }: any) =>
      h(
        'span',
        {
          style: { color: '#0052d9', cursor: 'pointer' },
          onClick: () => openAccModal(row),
        },
        row.statisticCount || 0,
      ),
  },
  {
    colKey: 'status',
    title: '状态',
    width: 110,
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
    width: 80,
    fixed: 'right' as const,
  },
];

const accColumns = [
  { colKey: 'rowIndex', title: '序号', width: 80, cell: (h: any, { rowIndex }: any) => rowIndex + 1 },
  { colKey: 'acceptanceNo', title: '相关受理号/备案号', width: 180 },
  // { colKey: 'indicationComment', title: '适应症描述', width: 200, ellipsis: true },
  { colKey: 'sourceRef', title: '来源', width: 100, align: 'center' as const },
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
      indicationComment: formData.indicationComment,
    };
    const res = await indicationApi.pageData(params);
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
  formData.indicationComment = '';
  formData.status = undefined;
  fetchData(1);
};

const onPageChange = (pageInfo: any) => {
  fetchData(pageInfo.current, pageInfo.pageSize);
};
//#endregion

//#region 清洗状态 select 切换
const onCleanStatusChange = async (row: any, val: number) => {
  if (val === row.cleanStatus) return;
  try {
    await indicationApi.updateCleanStatus({
      id: row.indicationCommentId!,
      cleanStatus: val,
    } as any);
    MessagePlugin.success('状态已更新');
    fetchData();
  } catch (e) {
    console.error(e);
    fetchData();
  }
};
//#endregion

//#region Acc Modal
const fetchAcceptanceNos = async (id: number, curr = 1, size = 5) => {
  accLoading.value = true;
  try {
    const res = await indicationApi.getAcceptanceNos({
      id,
      pageNum: curr,
      pageSize: size,
    });
    accData.value = res.data?.list || [];
    accPagination.current = curr;
    accPagination.pageSize = size;
    accPagination.total = res.data?.total || 0;
  } catch (e) {
    console.error(e);
  } finally {
    accLoading.value = false;
  }
};

const openAccModal = (record: IndicationDto) => {
  if (!record.indicationCommentId) return;
  currentIndicationId.value = record.indicationCommentId;
  fetchAcceptanceNos(record.indicationCommentId, 1, 5);
  accModalVisible.value = true;
};

const onAccPageChange = (pageInfo: any) => {
  if (currentIndicationId.value) {
    fetchAcceptanceNos(currentIndicationId.value, pageInfo.current, pageInfo.pageSize);
  }
};

const onAccModalClose = () => {
  accModalVisible.value = false;
};
//#endregion

//#region Edit Modal
const openEditModal = (record: IndicationDto) => {
  if (!record.indicationCommentId) return;
  // 使用表格行数据直接回显，无需调用详情接口
  currentEditRecord.value = {
    indicationComment: record.indicationComment,
    indicationCommentId: record.indicationCommentId,
    indicationTagDtoList: (record.indicationTagList || []).map((tag) => ({
      id: tag.id,
      indicationTagId: tag.id,
      indicationCategoryId: tag.indicationCategoryId,
      indicationCategoryName: tag.indicationCategoryName,
      indicationStandard: tag.indicationStandard,
      isDeleted: tag.isDeleted,
      createTime: tag.createTime,
      createUser: tag.createUser,
      updateTime: tag.updateTime,
      updateUser: tag.updateUser,
    })),
    sourceList: record.sourceList,
    statisticCount: record.statisticCount,
    status: record.status,
    updateUser: record.updateUser,
  };
  editModalVisible.value = true;
};

const addEditRow = () => {
  if (!currentEditRecord.value) return;
  if (!currentEditRecord.value.indicationTagDtoList) {
    currentEditRecord.value.indicationTagDtoList = [];
  }
  currentEditRecord.value.indicationTagDtoList.push({
    id: undefined,
    indicationTagId: undefined,
    indicationCategoryId: undefined,
    indicationStandard: '',
  });
};

const removeEditRow = (index: number) => {
  if (!currentEditRecord.value?.indicationTagDtoList) return;
  currentEditRecord.value.indicationTagDtoList.splice(index, 1);
};

const submitEdit = async () => {
  if (!currentEditRecord.value) return;
  editLoading.value = true;
  try {
    // 提交前移除 indicationStandard，后端需要的是 indicationTagId
    const submitData = JSON.parse(JSON.stringify(currentEditRecord.value));
    if (submitData.indicationTagDtoList) {
      submitData.indicationTagDtoList = submitData.indicationTagDtoList.map(
        ({ indicationStandard, ...rest }: any) => rest,
      );
    }
    const res = await indicationApi.saveIndication(submitData);
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
onMounted(async () => {
  // 获取分类下拉选项
  try {
    const catRes = await indicationApi.categoryPageData({ pageNum: 1, pageSize: 1000 });
    categoryOptions.value = catRes.data?.list || [];
  } catch (e) {
    console.error(e);
  }
  // 获取清洗后数据字典选项
  try {
    const dictRes = await indicationApi.dictPageData({ pageNum: 1, pageSize: 1000 });
    dictOptions.value = dictRes.data?.list || [];
  } catch (e) {
    console.error(e);
  }
  fetchData();
});
//#endregion
</script>
