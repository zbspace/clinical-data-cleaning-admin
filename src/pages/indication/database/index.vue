<template>
  <!-- #region 适应症库管理页面 -->
  <div class="indication-database-page">
    <!-- #region 主查询表格（MTable：搜索 + 表格 + 分页 + 高度自适应） -->
    <MTable
      v-model:tableConfig="tableConfig"
      :search-config="searchConfig"
      :loading="loading"
      title="适应症库管理"
      @search="loadList"
    >
      <!-- #region 源数据适应症（别名）列 -->
      <template #statisticCount="{ row }">
        <el-link type="primary" underline="never" @click="openAliasModal(row)">
          {{ row.statisticCount || 0 }}
        </el-link>
      </template>
      <!-- #endregion -->

      <!-- #region 操作列 -->
      <template #tableRowOperation="{ row }">
        <div class="flex justify-center">
          <el-button type="primary" @click="openEditModal(row)">编辑</el-button>
        </div>
      </template>
      <!-- #endregion -->
    </MTable>
    <!-- #endregion -->

    <!-- #region 源数据适应症（别名）弹窗 -->
    <el-dialog
      v-model="aliasModalVisible"
      title="源数据适应症（别名）"
      width="800px"
      @closed="onAliasModalClose"
    >
      <el-table :data="aliasData" v-loading="aliasLoading" border stripe :max-height="360">
        <el-table-column
          type="index"
          label="序号"
          width="80"
          align="center"
          :index="aliasIndexFn"
        />
        <el-table-column
          prop="aliasName"
          label="源数据适应症（别名）"
          align="left"
          show-overflow-tooltip
        />
        <template #empty>
          <el-empty :image-size="80" description="暂无数据" />
        </template>
      </el-table>
      <div class="flex justify-end mt-16px">
        <el-pagination
          v-model:current-page="aliasPagination.current"
          v-model:page-size="aliasPagination.pageSize"
          layout="total, prev, pager, next"
          :total="aliasPagination.total"
          @current-change="onAliasCurrentChange"
        />
      </div>
    </el-dialog>
    <!-- #endregion -->

    <!-- #region 编辑弹窗 -->
    <el-dialog
      v-model="editModalVisible"
      title="编辑适应症"
      width="600px"
      @closed="onEditModalClose"
    >
      <el-form :model="editFormData" label-width="100px">
        <el-form-item label="适应症归类">
          <el-select
            v-model="editFormData.indicationCategoryId"
            clearable
            placeholder="请选择"
            class="!w-full"
          >
            <el-option
              v-for="opt in categorySelectOptions"
              :key="opt.value"
              :label="opt.label"
              :value="opt.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="适应症">
          <el-input
            v-model="editFormData.indicationStandard"
            clearable
            placeholder="请输入"
            class="!w-full"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="editModalVisible = false">取消</el-button>
        <el-button type="primary" :loading="editLoading" @click="submitEdit">提交</el-button>
      </template>
    </el-dialog>
    <!-- #endregion -->
  </div>
  <!-- #endregion -->
</template>

<script setup lang="ts">
defineOptions({ name: 'IndicationDatabase' })
// #region 依赖导入
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import moment from 'moment'
import { indicationApi } from '@/api'
import type { IndicationDictDto, IndicationCategory } from '@/api/types/indication'
// #endregion

// #region State
const loading = ref(false)

// 适应症归类选项
const categoryOptions = ref<IndicationCategory[]>([])
const categorySelectOptions = computed(() =>
  categoryOptions.value.map((item) => ({ label: item.categoryName || '', value: item.id })),
)

// 别名弹窗
const aliasModalVisible = ref(false)
const aliasData = ref<{ aliasName: string }[]>([])
const aliasLoading = ref(false)
const aliasPagination = reactive({ current: 1, pageSize: 5, total: 0 })
const currentTagId = ref<number>()

// 编辑弹窗
const editModalVisible = ref(false)
const editLoading = ref(false)
const editFormData = reactive<IndicationDictDto>({
  indicationTagId: undefined,
  indicationCategoryId: undefined,
  indicationCategoryName: undefined,
  indicationStandard: '',
})
// #endregion

// #region 搜索配置（MTable 约定：page / rows 由组件内部维护）
const searchConfig = reactive({
  form: {
    indicationCategoryId: undefined as number | '' | undefined,
    indicationStandard: '',
    page: 1,
    rows: 20,
  },
  items: [
    {
      id: 'indicationCategoryId',
      label: '适应症归类',
      type: 'select',
      width: 220,
      placeholder: '请选择',
      options: categorySelectOptions,
    },
    {
      id: 'indicationStandard',
      label: '适应症',
      type: 'input',
      width: 220,
      placeholder: '请输入关键字',
    },
  ],
})
// #endregion

// #region 表格列配置
const tableConfig = ref<{
  data: IndicationDictDto[]
  total: number
  columns: Record<string, any>[]
}>({
  data: [],
  total: 0,
  columns: [
    {
      id: 'rowIndex',
      type: 'index',
      label: '序号',
      width: 80,
      index: (idx: number) => idx + 1,
    },
    {
      id: 'indicationCategoryName',
      label: '适应症归类',
      minWidth: 150,
      align: 'left',
      formatter: (row: IndicationDictDto) => row.indicationCategoryName || '-',
    },
    { id: 'indicationStandard', label: '适应症', minWidth: 220, align: 'left' },
    { id: 'statisticCount', label: '源数据适应症（别名）', minWidth: 180, align: 'center' },
    {
      id: 'updateTime',
      label: '更新时间',
      minWidth: 170,
      align: 'center',
      formatter: (row: IndicationDictDto) =>
        row.updateTime ? moment(row.updateTime).format('YYYY-MM-DD HH:mm:ss') : '-',
    },
    {
      id: 'updateUser',
      label: '操作人',
      minWidth: 120,
      align: 'left',
      formatter: (row: IndicationDictDto) => row.updateUser || '-',
    },
    { id: 'operation', type: 'action', label: '操作', width: 100, align: 'center', fixed: 'right' },
  ],
})
// #endregion

// #region 数据请求（MTable 分页/搜索统一入口）
const loadList = async () => {
  loading.value = true
  try {
    const { indicationCategoryId, indicationStandard, page = 1, rows = 20 } = searchConfig.form
    const params: Record<string, any> = {
      pageNum: page,
      pageSize: rows,
      // 重置后 select 为空字符串，归一化为 undefined，保持原有请求语义
      indicationCategoryId:
        indicationCategoryId === '' || indicationCategoryId == null
          ? undefined
          : indicationCategoryId,
      indicationStandard: indicationStandard || undefined,
    }
    const res = await indicationApi.dictPageData(params)
    tableConfig.value.data = res.data?.list || []
    tableConfig.value.total = res.data?.total || 0
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}
// #endregion

// #region 源数据适应症（别名）弹窗
const aliasIndexFn = (index: number) =>
  index + 1 + (aliasPagination.current - 1) * aliasPagination.pageSize

const fetchAliasList = async (tagId: number, curr = 1, size = 5) => {
  aliasLoading.value = true
  try {
    const res = await indicationApi.getIndicationCommentList({
      id: tagId,
      pageNum: curr,
      pageSize: size,
    })
    aliasData.value = (res.data?.list || []).map((name: string) => ({ aliasName: name }))
    aliasPagination.current = curr
    aliasPagination.pageSize = size
    aliasPagination.total = res.data?.total || 0
  } catch (e) {
    console.error(e)
  } finally {
    aliasLoading.value = false
  }
}

const openAliasModal = (record: IndicationDictDto) => {
  if (!record.indicationTagId) return
  currentTagId.value = record.indicationTagId
  fetchAliasList(record.indicationTagId, 1, 5)
  aliasModalVisible.value = true
}

const onAliasCurrentChange = (curr: number) => {
  if (currentTagId.value) {
    fetchAliasList(currentTagId.value, curr, aliasPagination.pageSize)
  }
}

const onAliasModalClose = () => {
  aliasModalVisible.value = false
}
// #endregion

// #region 编辑弹窗
const openEditModal = (record: IndicationDictDto) => {
  editFormData.indicationTagId = record.indicationTagId
  editFormData.indicationCategoryId = record.indicationCategoryId
  editFormData.indicationCategoryName = record.indicationCategoryName
  editFormData.indicationStandard = record.indicationStandard
  editModalVisible.value = true
}

const submitEdit = async () => {
  editLoading.value = true
  try {
    await indicationApi.saveIndicationDict(editFormData)
    ElMessage.success('保存成功')
    editModalVisible.value = false
    loadList()
  } catch (e) {
    console.error(e)
    ElMessage.error('保存失败')
  } finally {
    editLoading.value = false
  }
}

const onEditModalClose = () => {
  editModalVisible.value = false
}
// #endregion

// #region 生命周期
onMounted(async () => {
  // 获取分类下拉选项
  try {
    const res = await indicationApi.categoryPageData({ pageNum: 1, pageSize: 1000 })
    categoryOptions.value = res.data?.list || []
  } catch (e) {
    console.error(e)
  }
  loadList()
})
// #endregion
</script>

<style scoped lang="scss">
// #region 页面样式
.indication-database-page {
  padding: 10px;
}
// #endregion
</style>
