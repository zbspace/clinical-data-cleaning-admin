<template>
  <!--#region 适应症库管理页面 -->
  <t-card bordered>
    <div style="margin-bottom: 16px;">
      <h2 style="margin: 0 0 16px 0; font-size: 18px; font-weight: 600; color: var(--td-text-color-primary);">
        适应症库管理
      </h2>

      <!--#region 搜索表单 -->
      <div style="background: #f8fafc; padding: 16px; border-radius: 12px; border: 1px solid var(--td-border-level-1-color);">
        <t-form
          ref="formRef"
          :data="formData"
          layout="inline"
          label-width="100"
          style="display: flex; gap: 16px 0; flex-wrap: wrap;"
          @submit="onSearch"
        >
          <t-form-item label="适应症归类" name="indicationCategoryId" style="margin-bottom: 0;">
            <t-select
              v-model="formData.indicationCategoryId"
              :options="categoryOptions"
              placeholder="请选择"
              clearable
              style="width: 220px;"
              value-key="id"
              :keys="{ label: 'categoryName', value: 'id' }"
            />
          </t-form-item>
          <t-form-item label="适应症(标准)" name="indicationStandard" style="margin-bottom: 0;">
            <t-input v-model="formData.indicationStandard" placeholder="请输入关键字" clearable style="width: 220px;" />
          </t-form-item>
          <div style="display: flex; align-items: center; margin-left: auto;">
            <t-button theme="default" @click="onReset" style="background: #fff; margin-right: 8px;">
              重置条件
            </t-button>
            <t-button theme="primary" type="submit">
              搜索
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
      row-key="indicationTagId"
      :loading="loading"
      bordered
      stripe
      table-layout="auto"
      hover
      :pagination="pagination"
      @page-change="onPageChange"
    />
    <!--#endregion-->

    <!--#region 源数据适应症(别名)弹窗 -->
    <t-dialog
      v-model:visible="aliasModalVisible"
      header="源数据适应症（别名）"
      :footer="false"
      width="800px"
      @close="onAliasModalClose"
    >
      <t-table
        :data="aliasData"
        :columns="aliasColumns"
        row-key="aliasName"
        :loading="aliasLoading"
        bordered
        stripe
        :pagination="aliasPagination"
        @page-change="onAliasPageChange"
      />
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
import type { IndicationDictDto, IndicationCategory } from '@/api/types/indication';
//#endregion

//#region State
const formRef = ref();
const loading = ref(false);
const tableData = ref<IndicationDictDto[]>([]);
const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0,
  showJumper: true,
});

const formData = reactive({
  indicationCategoryId: undefined as number | undefined,
  indicationStandard: '',
});

// 适应症归类选项
const categoryOptions = ref<IndicationCategory[]>([]);

// 别名弹窗
const aliasModalVisible = ref(false);
const aliasData = ref<{ aliasName: string }[]>([]);
const aliasLoading = ref(false);
const aliasPagination = reactive({ current: 1, pageSize: 5, total: 0 });
const currentTagId = ref<number>();
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
    colKey: 'indicationIcdName',
    title: '适应症(ICD)',
    width: 200,
    cell: (h: any, { row }: any) => row.indicationIcdName || '-',
  },
  { colKey: 'indicationStandard', title: '适应症(标准)', width: 200 },
  {
    colKey: 'indicationCategoryName',
    title: '分类',
    width: 150,
    cell: (h: any, { row }: any) => row.indicationCategoryName || '-',
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
          onClick: () => openAliasModal(row),
        },
        row.statisticCount || 0,
      ),
  },
  {
    colKey: 'updateTime',
    title: '更新时间',
    width: 170,
    cell: (h: any, { row }: any) =>
      row.updateTime ? moment(row.updateTime).format('YYYY-MM-DD HH:mm:ss') : '-',
  },
  { colKey: 'updateUser', title: '操作人', width: 120, cell: (h: any, { row }: any) => row.updateUser || '-' },
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

const aliasColumns = [
  {
    colKey: 'rowIndex',
    title: '序号',
    width: 80,
    cell: (h: any, { rowIndex }: any) => rowIndex + 1 + (aliasPagination.current - 1) * aliasPagination.pageSize,
  },
  { colKey: 'aliasName', title: '源数据适应症（别名）' },
];
//#endregion

//#region Data Fetching
const fetchData = async (curr = pagination.current, size = pagination.pageSize) => {
  loading.value = true;
  try {
    const params: Record<string, any> = {
      pageNum: curr,
      pageSize: size,
      indicationCategoryId: formData.indicationCategoryId,
      indicationStandard: formData.indicationStandard || undefined,
    };
    const res = await indicationApi.dictPageData(params);
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
  formData.indicationCategoryId = undefined;
  formData.indicationStandard = '';
  fetchData(1);
};

const onPageChange = (pageInfo: any) => {
  fetchData(pageInfo.current, pageInfo.pageSize);
};
//#endregion

//#region Alias Modal
const fetchAliasList = async (tagId: number, curr = 1, size = 5) => {
  aliasLoading.value = true;
  try {
    const res = await indicationApi.getIndicationCommentList({ id: tagId, pageNum: curr, pageSize: size });
    if (res.code === 0) {
      const mappedList = (res.data?.list || []).map((name: string) => ({ aliasName: name }));
      aliasData.value = mappedList;
      aliasPagination.current = curr;
      aliasPagination.pageSize = size;
      aliasPagination.total = res.data?.total || 0;
    }
  } catch (e) {
    console.error(e);
  } finally {
    aliasLoading.value = false;
  }
};

const openAliasModal = (record: IndicationDictDto) => {
  if (!record.indicationTagId) return;
  currentTagId.value = record.indicationTagId;
  fetchAliasList(record.indicationTagId, 1, 5);
  aliasModalVisible.value = true;
};

const onAliasPageChange = (pageInfo: any) => {
  if (currentTagId.value) {
    fetchAliasList(currentTagId.value, pageInfo.current, pageInfo.pageSize);
  }
};

const onAliasModalClose = () => {
  aliasModalVisible.value = false;
};
//#endregion

//#region Edit Modal (placeholder - not implemented in React version either)
const editModalVisible = ref(false);
const openEditModal = (record: IndicationDictDto) => {
  // 编辑功能待实现，同React版本一致
  MessagePlugin.info('编辑功能开发中');
};
//#endregion

//#region Lifecycle
onMounted(async () => {
  // 获取分类下拉选项
  try {
    const res = await indicationApi.categoryPageData({ pageNum: 1, pageSize: 1000 });
    if (res.code === 0) {
      categoryOptions.value = res.data?.list || [];
    }
  } catch (e) {
    console.error(e);
  }
  fetchData();
});
//#endregion
</script>
