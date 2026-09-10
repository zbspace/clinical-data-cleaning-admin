<template>
  <!-- #region 药品名库管理页面 -->
  <div class="drug-database-page">
    <!-- #region 主查询表格（MTable：搜索 + 表格 + 分页 + 高度自适应） -->
    <MTable
      v-model:tableConfig="tableConfig"
      :search-config="searchConfig"
      :loading="loading"
      title="药品名库管理"
      @search="loadList"
    >
      <!-- #region 表格工具栏（新增） -->
      <template #tableTools>
        <el-button type="primary" @click="handleAdd">新增</el-button>
      </template>
      <!-- #endregion -->

      <!-- #region 源数据药品名（别名）列 -->
      <template #statisticCount="{ row }">
        <el-link type="primary" underline="never" @click="openAliasModal(row.standardId!)">
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

    <!-- #region 药品别名弹窗 -->
    <el-dialog
      v-model="aliasModalVisible"
      title="药品别名"
      width="600px"
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
          label="源数据药品名（别名）"
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
      :title="currentEditRecord ? '编辑' : '新增'"
      width="600px"
      @closed="onEditModalClose"
    >
      <el-form :model="editFormData" label-width="180px">
        <div class="form-tip-block">
          <el-form-item label="药品名（清洗后）">
            <el-input v-model="editFormData.cleanedDrugName" />
          </el-form-item>
          <el-form-item label="通用名（中文）">
            <el-input v-model="editFormData.genericNameCn" />
          </el-form-item>
          <el-form-item label="通用名（英文）">
            <el-input v-model="editFormData.genericNameEn" />
          </el-form-item>
          <el-form-item label="研发代号">
            <el-input v-model="editFormData.developmentCode" />
          </el-form-item>
          <el-form-item label="其他名（例如结构名称）">
            <el-input v-model="editFormData.otherInfo" />
          </el-form-item>
          <el-form-item label="剂型">
            <el-select
              v-model="editFormData.dosageForm"
              filterable
              remote
              clearable
              :remote-method="(keyword: string) => onSearchDosageForm(keyword)"
              :loading="dosageFormLoading"
              placeholder="请选择"
              class="!w-full"
            >
              <el-option
                v-for="opt in dosageFormOptions"
                :key="opt.value"
                :label="opt.label"
                :value="opt.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="药品类型">
            <el-select
              v-model="editFormData.drugType"
              clearable
              placeholder="请选择"
              class="!w-full"
            >
              <el-option
                v-for="opt in drugTypeOptions"
                :key="opt.value"
                :label="opt.label"
                :value="opt.value"
              />
            </el-select>
          </el-form-item>
        </div>
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
defineOptions({ name: 'DrugDatabase' })
// #region 依赖导入
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import moment from 'moment'
import { drugApi } from '@/api'
import type { DrugStandardDto, DrugStandardInfo } from '@/api/types/drug'
import { DRUG_TYPE, createEnumsToOptions } from '@/utils/enums'
// #endregion

// #region 常量与状态
const loading = ref(false)
const drugTypeOptions = createEnumsToOptions(DRUG_TYPE)

// 状态文案映射
const statusMap: Record<number, string> = { 0: '无冲突', 1: '待确认', 2: '已确认' }

// 别名弹窗
const aliasModalVisible = ref(false)
const aliasData = ref<{ aliasName: string }[]>([])
const aliasLoading = ref(false)
const aliasPagination = reactive({ current: 1, pageSize: 5, total: 0 })
const currentDrugId = ref<number>()

// 编辑弹窗
const editModalVisible = ref(false)
const editLoading = ref(false)
const currentEditRecord = ref<DrugStandardDto | null>(null)
const editFormData = reactive<Record<string, any>>({
  id: undefined,
  cleanedDrugName: '',
  genericNameCn: '',
  genericNameEn: '',
  developmentCode: '',
  otherInfo: '',
  dosageForm: '',
  drugType: '',
  companyName: '',
})

// 剂型下拉选项（远程搜索）
const dosageFormOptions = ref<{ label: string; value: string }[]>([])
const dosageFormLoading = ref(false)
// #endregion

// #region 搜索配置（MTable 约定：page / rows 由组件内部维护）
const searchConfig = reactive({
  form: {
    drugStandardName: '',
    companyName: '',
    page: 1,
    rows: 20,
  },
  items: [
    {
      id: 'drugStandardName',
      label: '药品名（清洗后）',
      type: 'input',
      width: 220,
      placeholder: '请输入关键字',
    },
    {
      id: 'companyName',
      label: '公司',
      type: 'input',
      width: 220,
      placeholder: '请输入关键字',
    },
  ],
})
// #endregion

// #region 表格列配置
const tableConfig = ref<{
  data: DrugStandardDto[]
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
      index: (idx: number) => idx + 1,
      fixed: 'left',
    },
    { id: 'drugStandardName', label: '药品名（清洗后）', width: 180, align: 'left' },
    {
      id: 'genericNameCn',
      label: '通用名（中文）',
      width: 250,
      align: 'left',
      formatter: (row: DrugStandardDto) => row.genericNameCn || '-',
      fixed: 'left',
    },
    {
      id: 'genericNameEn',
      label: '通用名(英文)',
      width: 250,
      align: 'left',
      formatter: (row: DrugStandardDto) => row.genericNameEn || '-',
    },
    {
      id: 'developmentCode',
      label: '研发代码',
      width: 120,
      align: 'left',
      formatter: (row: DrugStandardDto) => row.developmentCode || '-',
    },
    {
      id: 'otherInfo',
      label: '其他（例如药物结构描述）',
      width: 220,
      align: 'left',
      formatter: (row: DrugStandardDto) => row.otherInfo || '-',
    },
    { id: 'dosageForm', label: '剂型', width: 160, align: 'left' },
    { id: 'drugType', label: '药品类型', width: 140, align: 'left' },
    {
      id: 'companyName',
      label: '相关公司',
      width: 200,
      align: 'left',
      formatter: (row: DrugStandardDto) => row.companyName || '-',
    },
    {
      id: 'parentCompanyName',
      label: '相关母公司',
      width: 200,
      align: 'left',
      formatter: (row: DrugStandardDto) => row.parentCompanyName || '-',
    },
    { id: 'statisticCount', label: '源数据药品名（别名）', width: 170, align: 'center' },
    {
      id: 'status',
      label: '状态',
      width: 80,
      align: 'center',
      formatter: (row: DrugStandardDto) => statusMap[row.status as number] ?? '-',
    },
    {
      id: 'updateUser',
      label: '操作人',
      width: 100,
      align: 'center',
      formatter: (row: DrugStandardDto) => row.updateUser || '-',
    },
    {
      id: 'updateTime',
      label: '更新时间',
      width: 170,
      align: 'center',
      formatter: (row: DrugStandardDto) =>
        row.updateTime ? moment(row.updateTime).format('YYYY-MM-DD HH:mm:ss') : '-',
    },
    { id: 'operation', type: 'action', label: '操作', width: 100, align: 'center', fixed: 'right' },
  ],
})
// #endregion

// #region 数据请求（MTable 分页/搜索统一入口）
const loadList = async () => {
  loading.value = true
  try {
    const { drugStandardName, page = 1, rows = 20 } = searchConfig.form
    const params: Record<string, any> = {
      pageNum: page,
      pageSize: rows,
      drugStandardName: drugStandardName || undefined,
    }
    const res = await drugApi.standardPageData(params)
    tableConfig.value.data = res.data?.list || []
    tableConfig.value.total = res.data?.total || 0
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}
// #endregion

// #region 剂型选项查询
const onSearchDosageForm = async (keyword = '') => {
  dosageFormLoading.value = true
  try {
    const res = await drugApi.dosageFormList({ pageNum: 1, pageSize: 1000, searchKey: keyword })
    dosageFormOptions.value = (res.data?.list || []).map((name: string) => ({
      label: name,
      value: name,
    }))
  } catch (e) {
    console.error(e)
  } finally {
    dosageFormLoading.value = false
  }
}
// #endregion

// #region 药品别名弹窗
const aliasIndexFn = (index: number) =>
  index + 1 + (aliasPagination.current - 1) * aliasPagination.pageSize

const fetchAliasNos = async (drugId: number, curr = 1, size = 5) => {
  aliasLoading.value = true
  try {
    const res = await drugApi.commentDrugPageData({ id: drugId, pageNum: curr, pageSize: size })
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

const openAliasModal = (id: number) => {
  currentDrugId.value = id
  fetchAliasNos(id, 1, 5)
  aliasModalVisible.value = true
}

const onAliasCurrentChange = (curr: number) => {
  if (currentDrugId.value) {
    fetchAliasNos(currentDrugId.value, curr, aliasPagination.pageSize)
  }
}

const onAliasModalClose = () => {
  aliasModalVisible.value = false
}
// #endregion

// #region 编辑弹窗
const openEditModal = (record: DrugStandardDto) => {
  currentEditRecord.value = record
  editFormData.cleanedDrugName = record.drugStandardName || ''
  editFormData.genericNameCn = record.genericNameCn || ''
  editFormData.genericNameEn = record.genericNameEn || ''
  editFormData.developmentCode = record.developmentCode || ''
  editFormData.otherInfo = record.otherInfo || ''
  editFormData.dosageForm = record.dosageForm || ''
  editFormData.drugType = record.drugType || ''
  editFormData.companyName = record.companyName || ''
  editFormData.id = record.standardId || ''
  editModalVisible.value = true
}

const handleAdd = () => {
  currentEditRecord.value = null
  editFormData.cleanedDrugName = ''
  editFormData.genericNameCn = ''
  editFormData.genericNameEn = ''
  editFormData.developmentCode = ''
  editFormData.otherInfo = ''
  editFormData.dosageForm = ''
  editFormData.drugType = ''
  editFormData.companyName = ''
  editFormData.id = undefined
  editModalVisible.value = true
}

const submitEdit = async () => {
  editLoading.value = true
  try {
    const submitData: DrugStandardInfo = {
      id: editFormData.id || undefined,
      cleanedDrugName: editFormData.cleanedDrugName,
      genericNameCn: editFormData.genericNameCn,
      genericNameEn: editFormData.genericNameEn,
      developmentCode: editFormData.developmentCode,
      otherInfo: editFormData.otherInfo,
      dosageForm: editFormData.dosageForm,
      drugType: editFormData.drugType,
      status: currentEditRecord.value?.status ?? 0,
    }
    await drugApi.standardSave(submitData)
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

// #region 生命周期
onMounted(() => {
  loadList()
  // 获取剂型选项
  onSearchDosageForm()
})
// #endregion
</script>

<style scoped lang="scss">
// #region 页面样式
.drug-database-page {
  padding: 10px;

  .form-tip-block {
    background-color: #e6f7ff;
    padding: 16px;
    border-radius: 4px;
  }
}
// #endregion
</style>
