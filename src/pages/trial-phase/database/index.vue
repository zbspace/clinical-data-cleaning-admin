<template>
  <!-- #region 试验分期库管理页面 -->
  <div class="trial-phase-database-page">
    <!-- #region 主表格区（MTable：搜索 + 表格 + 分页 + 高度自适应） -->
    <MTable
      v-model:tableConfig="tableConfig"
      :search-config="searchConfig"
      :loading="loading"
      title="试验分期库管理"
      @search="onSearch"
    >
      <!-- #region 操作列 -->
      <template #tableRowOperation="{ row }">
        <el-button type="primary" @click="openEditModal(row)">编辑</el-button>
      </template>
      <!-- #endregion -->
    </MTable>
    <!-- #endregion -->

    <!-- #region 编辑/新增弹窗 -->
    <el-dialog
      v-model="editModalVisible"
      title="编辑试验分期"
      width="600px"
      @closed="onEditModalClose"
    >
      <el-form :model="editFormData" label-width="140px">
        <el-form-item label="原始分期">
          <el-input v-model="editFormData.trialStages" placeholder="请输入原始分期，如 I期" />
        </el-form-item>
        <el-form-item label="清洗后分期">
          <el-select
            v-model="editFormData.cleanedTrialStages"
            placeholder="请选择清洗后分期"
            multiple
            clearable
            filterable
            style="width: 100%"
          >
            <el-option
              v-for="opt in cleanedStageOptions"
              :key="opt.value"
              :label="opt.label"
              :value="opt.value"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="editModalVisible = false">取消</el-button>
        <el-button type="primary" :loading="editLoading" @click="submitEdit">保存</el-button>
      </template>
    </el-dialog>
    <!-- #endregion -->
  </div>
  <!-- #endregion -->
</template>

<script setup lang="ts">
defineOptions({ name: 'TrialPhaseDatabase' })

// #region Imports
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import moment from 'moment'
import { trialStageApi } from '@/api'
import type { CdeTrialStagesMapping } from '@/api/types/trialStage'
// #endregion

// #region 搜索配置与状态
const loading = ref(false)

const searchConfig = reactive({
  form: {
    searchKey: '',
    page: 1,
    rows: 20,
  },
  items: [
    {
      id: 'searchKey',
      label: '分期名称',
      type: 'input',
      width: 280,
      placeholder: '请输入原始分期或清洗后分期',
    },
  ],
})
// #endregion

// #region 表格列配置
const tableConfig = ref<{
  data: CdeTrialStagesMapping[]
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
      width: 60,
      index: (idx: number) =>
        idx + 1 + (Number(searchConfig.form.page || 1) - 1) * Number(searchConfig.form.rows || 20),
    },
    { id: 'trialStages', label: '原试验期（源数据）', minWidth: 200, align: 'left' },
    {
      id: 'cleanedTrialStages',
      label: '试验分期（清洗后）',
      width: 160,
      align: 'center',
      formatter: (row: CdeTrialStagesMapping) => row.cleanedTrialStages || '-',
    },
    {
      id: 'updateTime',
      label: '更新时间',
      width: 170,
      align: 'center',
      formatter: (row: CdeTrialStagesMapping) =>
        row.updateTime ? moment(row.updateTime).format('YYYY-MM-DD HH:mm:ss') : '-',
    },
    {
      id: 'updateUser',
      label: '操作人',
      width: 100,
      align: 'center',
      formatter: (row: CdeTrialStagesMapping) => row.updateUser || '-',
    },
    { id: 'operation', type: 'action', label: '操作', width: 80, align: 'center', fixed: 'right' },
  ],
})
// #endregion

// #region 弹窗与表单状态
const editModalVisible = ref(false)
const editLoading = ref(false)
const currentEditRecord = ref<CdeTrialStagesMapping | null>(null)

const cleanedStageOptions = ref<{ value: string; label: string }[]>([])

const editFormData = reactive<Record<string, any>>({
  trialStages: '',
  cleanedTrialStages: [],
})
// #endregion

// #region 数据加载
const loadList = async () => {
  loading.value = true
  try {
    const { searchKey, page = 1, rows = 20 } = searchConfig.form
    const params: Record<string, any> = {
      searchKey: searchKey || '',
      pageNum: page,
      pageSize: rows,
    }
    const res = await trialStageApi.pageData(params)
    tableConfig.value.data = res.data?.list || []
    tableConfig.value.total = res.data?.total || 0
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

// MTable 搜索/重置/翻页统一触发
const onSearch = () => {
  loadList()
}
// #endregion

// #region 编辑弹窗
const openEditModal = (record: CdeTrialStagesMapping) => {
  currentEditRecord.value = { ...record }
  editFormData.trialStages = record.trialStages || ''
  editFormData.cleanedTrialStages = record.cleanedTrialStages
    ? record.cleanedTrialStages.replace(/；/g, ';').split(';')
    : []
  editModalVisible.value = true
}

const submitEdit = async () => {
  editLoading.value = true
  try {
    const submitData: CdeTrialStagesMapping = {
      ...currentEditRecord.value,
      trialStages: editFormData.trialStages,
      cleanedTrialStages: editFormData.cleanedTrialStages.join(';'),
      cleanedTrialStagesList: editFormData.cleanedTrialStages,
    }
    await trialStageApi.save(submitData)
    ElMessage.success('保存成功')
    editModalVisible.value = false
    loadList()
  } catch (e) {
    console.error(e)
  } finally {
    editLoading.value = false
  }
}

const onEditModalClose = () => {
  editModalVisible.value = false
  currentEditRecord.value = null
}
// #endregion

// #region 获取下拉选项
const fetchOptions = async () => {
  try {
    const res = await trialStageApi.getOptions()
    cleanedStageOptions.value = (res.data || []).map((item) => ({ value: item, label: item }))
  } catch (e) {
    console.error(e)
  }
}
// #endregion

// #region 生命周期
onMounted(() => {
  loadList()
  fetchOptions()
})
// #endregion
</script>

<style scoped lang="scss">
// #region 页面样式
.trial-phase-database-page {
  padding: 10px;
}
// #endregion
</style>
