<template>
  <!-- #region 药品名清洗页面 -->
  <div class="drug-clean-page">
    <!-- #region 主表格区（MTable：搜索 + 表格 + 分页 + 高度自适应） -->
    <MTable
      v-model:tableConfig="tableConfig"
      :search-config="searchConfig"
      :loading="loading"
      title="药品名清洗"
      @search="onSearch"
    >
      <!-- #region 相关受理号/登记号列 -->
      <template #acceptanceCount="{ row }">
        <el-link type="primary" underline="never" @click="openAccModal(row)">
          {{ row.acceptanceCount || '-' }}
        </el-link>
      </template>
      <!-- #endregion -->

      <!-- #region 清洗状态列（行内切换） -->
      <template #cleanStatus="{ row }">
        <el-select
          :model-value="row.status"
          style="width: 110px"
          @change="(val: number | string) => onCleanStatusChange(row, Number(val))"
        >
          <el-option
            v-for="opt in statusOptions"
            :key="opt.value"
            :label="opt.label"
            :value="opt.value"
          />
        </el-select>
      </template>
      <!-- #endregion -->

      <!-- #region 操作列 -->
      <template #tableRowOperation="{ row }">
        <el-button type="primary" @click="openEditModal(row)">关联</el-button>
      </template>
      <!-- #endregion -->
    </MTable>
    <!-- #endregion -->

    <!-- #region 相关备案/登记号弹窗 -->
    <el-dialog v-model="accModalVisible" title="相关备案/登记号" width="880px">
      <el-table :data="accData" v-loading="accLoading" border stripe :max-height="420">
        <el-table-column
          type="index"
          label="序号"
          width="80"
          align="center"
          :index="(idx: number) => idx + 1 + (accPagination.current - 1) * accPagination.pageSize"
        />
        <el-table-column prop="acceptanceNo" label="相关登记号/备案号" width="160" align="center" />
        <el-table-column
          prop="companyNameOrigin"
          label="相关公司（源数据）"
          width="180"
          align="left"
          show-overflow-tooltip
        />
        <el-table-column
          prop="registrationCategoryOrigin"
          label="注册分类（源数据）"
          width="160"
          align="center"
        />
        <el-table-column
          prop="registrationCategoryCleaned"
          label="注册分类（清洗后）"
          width="160"
          align="center"
        />
        <template #empty>
          <el-empty :image-size="80" description="暂无数据" />
        </template>
      </el-table>
      <div class="flex justify-end mt-16px">
        <el-pagination
          v-model:current-page="accPagination.current"
          v-model:page-size="accPagination.pageSize"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="accPagination.total"
          @size-change="onAccSizeChange"
          @current-change="onAccCurrentChange"
        />
      </div>
    </el-dialog>
    <!-- #endregion -->

    <!-- #region 关联弹窗 -->
    <el-dialog v-model="editModalVisible" title="编辑" width="800px" @closed="onEditModalClose">
      <!-- 源数据信息块 -->
      <div class="form-source-block">
        <p style="margin: 0">
          <strong>药品名（源数据）：</strong>
          {{
            currentEditRecord?.drugNickName ||
            currentEditRecord?.drugComment ||
            currentEditRecord?.drugStandardName
          }}
        </p>
        <p style="margin: 0">
          <strong>药品类型：</strong>
          {{ currentEditRecord?.drugTypeOrigin || '-' }}
        </p>
      </div>

      <el-form :model="editFormData" label-width="180px" label-position="left">
        <!-- #region 关联标准药品名 -->
        <div class="form-info-block">
          <el-form-item label="关联标准药品名">
            <div class="flex items-center w-full">
              <el-select
                v-model="editFormData.drugStandardId"
                filterable
                remote
                clearable
                :remote-method="(kw: string) => onSearchRelation(kw)"
                :loading="searchLoading"
                placeholder="请搜索选择标准药品名"
                style="width: 360px"
                @change="onStandardDrugChange"
                @clear="onStandardDrugClear"
              >
                <el-option
                  v-for="opt in standardDrugOptions"
                  :key="opt.value"
                  :label="opt.label"
                  :value="opt.value"
                />
              </el-select>
              <el-button type="primary" class="ml-20px" @click="openAddModal">新增</el-button>
            </div>
          </el-form-item>
        </div>
        <!-- #endregion -->

        <!-- #region 标准药品信息（只读） -->
        <el-form-item label="药品名（清洗后）">
          <el-input v-model="editFormData.cleanedName" disabled />
        </el-form-item>
        <el-form-item label="通用名（中文）">
          <el-input v-model="editFormData.genericNameCn" disabled />
        </el-form-item>
        <el-form-item label="通用名（英文）">
          <el-input v-model="editFormData.genericNameEn" disabled />
        </el-form-item>
        <el-form-item label="研发代号">
          <el-input v-model="editFormData.rdCode" disabled />
        </el-form-item>
        <el-form-item label="其他名（例如结构名称）">
          <el-input v-model="editFormData.otherNames" disabled />
        </el-form-item>
        <el-form-item label="剂型">
          <el-select
            v-model="editFormData.dosageForm"
            placeholder="请选择"
            disabled
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
          <el-select v-model="editFormData.drugType" placeholder="请选择" disabled class="!w-full">
            <el-option
              v-for="opt in drugTypeOptions"
              :key="opt.value"
              :label="opt.label"
              :value="opt.value"
            />
          </el-select>
        </el-form-item>
        <!-- #endregion -->
      </el-form>

      <template #footer>
        <el-button @click="editModalVisible = false">取消</el-button>
        <el-button type="primary" :loading="editLoading" @click="submitEdit">提交</el-button>
      </template>
    </el-dialog>
    <!-- #endregion -->

    <!-- #region 新增标准名弹窗 -->
    <el-dialog v-model="addModalVisible" title="新增标准名" width="600px">
      <el-form :model="addFormData" label-width="180px" label-position="left">
        <div class="">
          <el-form-item label="药品名（清洗后）">
            <el-input v-model="addFormData.cleanedDrugName" />
          </el-form-item>
          <el-form-item label="通用名（中文）">
            <el-input v-model="addFormData.genericNameCn" />
          </el-form-item>
          <el-form-item label="通用名（英文）">
            <el-input v-model="addFormData.genericNameEn" />
          </el-form-item>
          <el-form-item label="研发代号">
            <el-input v-model="addFormData.developmentCode" />
          </el-form-item>
          <el-form-item label="其他名（例如结构名称）">
            <el-input v-model="addFormData.otherInfo" />
          </el-form-item>
          <el-form-item label="剂型">
            <el-select
              v-model="addFormData.dosageForm"
              filterable
              remote
              :remote-method="(val: string) => onSearchDosageForm(val)"
              :loading="dosageFormLoading"
              placeholder="请选择或输入搜索"
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
            <el-select v-model="addFormData.drugType" placeholder="请选择" class="!w-full">
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
        <el-button @click="addModalVisible = false">取消</el-button>
        <el-button type="primary" :loading="addLoading" @click="submitAdd">提交</el-button>
      </template>
    </el-dialog>
    <!-- #endregion -->
  </div>
  <!-- #endregion -->
</template>

<script setup lang="ts">
defineOptions({ name: 'DrugClean' })

// #region 依赖导入
import { ref, reactive, onMounted, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import moment from 'moment'
import { drugApi, companyApi } from '@/api'
import type { DrugStandardDto, DrugStandardInfo } from '@/api/types/drug'
import { createEnumsToOptions, DRUG_TYPE } from '@/utils/enums'
// #endregion

// #region 常量配置
const statusOptions = [
  { label: '未清洗', value: 0 },
  { label: '已清洗', value: 1 },
  { label: '不用清洗', value: 2 },
]

const dosageFormOptions = ref<{ label: string; value: string }[]>([])
const dosageFormLoading = ref(false)

const drugTypeOptions = createEnumsToOptions(DRUG_TYPE)
// #endregion

// #region 搜索配置与状态
const loading = ref(false)

const searchConfig = reactive({
  form: {
    drugStandardName: '',
    // 默认按“未清洗(0)”查询；MTable 重置会写入 ''，故类型兼容两种空值
    status: 0 as number | '',
    page: 1,
    rows: 20,
  },
  items: [
    {
      id: 'drugStandardName',
      label: '药品名（源数据）',
      type: 'input',
      width: 220,
      placeholder: '请输入',
    },
    {
      id: 'status',
      label: '清洗状态',
      type: 'select',
      width: 140,
      placeholder: '请选择',
      options: statusOptions,
    },
  ],
})
// #endregion

// #region 表格配置
const tableConfig = ref<{ data: any[]; total: number; columns: Record<string, any>[] }>({
  data: [],
  total: 0,
  columns: [
    {
      id: 'rowIndex',
      type: 'index',
      label: '序号',
      width: 80,
      index: (idx: number) => idx + 1,
      fixed: 'left',
    },
    {
      id: 'originalName',
      label: '药品名（源数据）',
      width: 200,
      align: 'left',
      formatter: (row: any) => row.drugNickName || row.drugComment || row.drugStandardName || '-',
      fixed: 'left',
    },
    { id: 'acceptanceCount', label: '相关受理号/登记号', width: 160, align: 'center' },
    { id: 'cleanStatus', label: '清洗状态', width: 140, align: 'center' },
    {
      id: 'drugStandardName',
      label: '药品名（清洗后）',
      width: 180,
      align: 'left',
      formatter: (row: any) => row.drugStandardName || row.drugStandardName || '-',
    },
    {
      id: 'genericNameCn',
      label: '通用名(中)',
      width: 150,
      align: 'left',
      formatter: (row: any) => row.drugGoodsNameCn || row.genericNameCn || '-',
    },
    {
      id: 'genericNameEn',
      label: '通用名(英)',
      width: 150,
      align: 'left',
      formatter: (row: any) => row.drugGoodsNameEn || row.genericNameEn || '-',
    },
    {
      id: 'drugCode',
      label: '研发代号',
      width: 100,
      align: 'center',
      formatter: (row: any) => row.drugCode || '-',
    },
    {
      id: 'otherComment',
      label: '其他名（如结构描述）',
      width: 200,
      align: 'left',
      formatter: (row: any) => row.otherComment || '-',
    },
    {
      id: 'dosageForm',
      label: '剂型',
      width: 100,
      align: 'center',
      formatter: (row: any) => row.dosageForm || '-',
    },
    {
      id: 'drugTypeOrigin',
      label: '药品类型',
      width: 150,
      align: 'left',
      formatter: (row: any) => row.drugType || row.drugTypeOrigin || '-',
    },
    {
      id: 'updateUser',
      label: '操作人',
      width: 100,
      align: 'center',
      formatter: (row: any) => row.updateUser || '-',
    },
    {
      id: 'updateTime',
      label: '更新时间',
      width: 170,
      align: 'center',
      formatter: (row: any) =>
        row.updateTime ? moment(row.updateTime).format('YYYY-MM-DD HH:mm:ss') : '-',
    },
    { id: 'operation', type: 'action', label: '操作', width: 100, align: 'center', fixed: 'right' },
  ],
})
// #endregion

// #region 弹窗与表单状态
// 公司选项
const companyOptions = ref<{ id?: number; companyStandardName?: string }[]>([])

// 备案号弹窗
const accModalVisible = ref(false)
const accData = ref<any[]>([])
const accLoading = ref(false)
const currentAccDrugId = ref<number | undefined>(undefined)
const accPagination = reactive({ current: 1, pageSize: 20, total: 0 })

// 编辑弹窗
const editModalVisible = ref(false)
const addModalVisible = ref(false)
const editLoading = ref(false)
const currentEditRecord = ref<any>(null)
const searchLoading = ref(false)
const addLoading = ref(false)

// 标准药品名选项
const standardDrugOptions = ref<any[]>([])

const editFormData = reactive<Record<string, any>>({
  drugStandardId: undefined,
  cleanedName: '',
  genericNameCn: '',
  genericNameEn: '',
  rdCode: '',
  otherNames: '',
  dosageForm: '',
  drugType: '',
})

const addFormData = reactive<Record<string, any>>({
  drugStandardId: undefined,
  cleanedName: '',
  genericNameCn: '',
  genericNameEn: '',
  rdCode: '',
  otherNames: '',
  dosageForm: '',
  drugType: '',
})
// #endregion

// #region 数据加载（MTable 分页/搜索统一入口）
const loadList = async () => {
  loading.value = true
  try {
    const { drugStandardName, status, page = 1, rows = 20 } = searchConfig.form
    const res = await drugApi.cleanPageData({
      pageNum: page,
      pageSize: rows,
      drugComment: drugStandardName || undefined,
      // 空值按“未清洗(0)”处理，保持默认队列语义
      status: status === '' || status == null ? 0 : Number(status),
    })
    tableConfig.value.data = res.data?.list || []
    tableConfig.value.total = res.data?.total || 0
  } catch (e) {
    console.error('Fetch data failed:', e)
  } finally {
    loading.value = false
  }
}

// MTable 搜索/重置/翻页统一触发
const onSearch = () => {
  loadList()
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

// #region 清洗状态行内切换
const onCleanStatusChange = async (row: any, val: number) => {
  try {
    await drugApi.updateCleanStatus({
      id: row.drugCommentId!,
      cleanStatus: val,
    } as any)
    ElMessage.success('状态已更新')
    loadList()
  } catch (e) {
    console.error(e)
    loadList()
  }
}
// #endregion

// #region 相关备案/登记号弹窗
const openAccModal = (row: any) => {
  currentAccDrugId.value = row.drugCommentId
  accPagination.current = 1
  fetchAccData(1, accPagination.pageSize)
  accModalVisible.value = true
}

const fetchAccData = async (curr = accPagination.current, size = accPagination.pageSize) => {
  accLoading.value = true
  try {
    const res = await drugApi.acceptanceNoList({
      id: currentAccDrugId.value,
      pageNum: curr,
      pageSize: size,
    })
    accData.value = res.data?.list || []
    accPagination.current = curr
    accPagination.pageSize = size
    accPagination.total = res.data?.total || 0
  } catch (e) {
    console.error('Fetch acceptance data failed:', e)
    accData.value = []
  } finally {
    accLoading.value = false
  }
}

const onAccSizeChange = () => {
  accPagination.current = 1
  fetchAccData(1, accPagination.pageSize)
}

const onAccCurrentChange = () => {
  fetchAccData(accPagination.current, accPagination.pageSize)
}
// #endregion

// #region 关联弹窗逻辑
const onSearchRelation = async (keyword = '', id?: number) => {
  searchLoading.value = true
  try {
    const res = await drugApi.standardPageData({
      drugStandardName: keyword || '',
      pageNum: 1,
      pageSize: 50,
      standardId: id || undefined,
    })
    const opts = (res.data?.list || [])
      .filter((item: DrugStandardDto) => item.standardId != null)
      .map((item: DrugStandardDto) => ({
        label: item.drugStandardName || '',
        value: item.standardId as number,
        item,
      }))
    standardDrugOptions.value = opts
  } catch (e) {
    console.error(e)
  } finally {
    searchLoading.value = false
  }
}

const openEditModal = (record: any) => {
  currentEditRecord.value = record
  editFormData.drugStandardId = record.drugStandardId || record.standardId || undefined
  editFormData.cleanedName = record.drugStandardName || record.cleanedName || ''
  editFormData.genericNameCn = record.drugNormalNameCn || record.genericNameCn || ''
  editFormData.genericNameEn = record.drugNormalNameEn || record.genericNameEn || ''
  editFormData.rdCode = record.drugCode || record.rdCode || ''
  editFormData.otherNames = record.otherComment || record.otherNames || ''
  editFormData.dosageForm = record.dosageForm || ''
  editFormData.drugType = record.drugType || ''
  editModalVisible.value = true

  nextTick(() => {
    if (editFormData.drugStandardId) {
      onSearchRelation('', editFormData.drugStandardId)
    }
  })
}

const onStandardDrugChange = (val: number | undefined) => {
  if (!val) return
  const selected = standardDrugOptions.value.find((o) => o.value === val)
  if (!selected) return
  editFormData.cleanedName = selected.item.drugStandardName || ''
  editFormData.genericNameCn = selected.item.genericNameCn || ''
  editFormData.genericNameEn = selected.item.genericNameEn || ''
  editFormData.rdCode = selected.item.developmentCode || ''
  editFormData.otherNames = selected.item.otherInfo || ''
  editFormData.dosageForm = selected.item.dosageForm || ''
  editFormData.drugType = selected.item.drugType || ''
}

const onStandardDrugClear = () => {
  editFormData.drugStandardId = undefined
}

const submitEdit = async () => {
  editLoading.value = true
  try {
    if (currentEditRecord.value) {
      const submitData = {
        drugCommentId: currentEditRecord.value.drugCommentId!,
        drugStandardId: editFormData.drugStandardId,
      }
      await drugApi.saveRelation(submitData)
      ElMessage.success('保存成功')
      editModalVisible.value = false
      loadList()
    }
  } catch (e) {
    console.error(e)
  } finally {
    editLoading.value = false
  }
}

const onEditModalClose = () => {
  currentEditRecord.value = null
  standardDrugOptions.value = []
}

const openAddModal = () => {
  addFormData.cleanedDrugName = ''
  addFormData.genericNameCn = ''
  addFormData.genericNameEn = ''
  addFormData.developmentCode = ''
  addFormData.otherInfo = ''
  addFormData.dosageForm = ''
  addFormData.drugType = ''
  addFormData.companyName = ''
  addFormData.id = undefined
  addModalVisible.value = true
}

const submitAdd = async () => {
  if (!addFormData.cleanedDrugName?.trim()) {
    ElMessage.warning('请填写标准名')
    return
  }
  addLoading.value = true
  try {
    const submitData: DrugStandardInfo = {
      id: addFormData.id || undefined,
      cleanedDrugName: addFormData.cleanedDrugName,
      genericNameCn: addFormData.genericNameCn,
      genericNameEn: addFormData.genericNameEn,
      developmentCode: addFormData.developmentCode,
      otherInfo: addFormData.otherInfo,
      dosageForm: addFormData.dosageForm,
      drugType: addFormData.drugType,
      status: currentEditRecord.value?.status ?? 0,
    }
    await drugApi.standardSave(submitData)
    ElMessage.success('新增成功')
    addModalVisible.value = false

    // 刷新关联下拉选项，命中则自动选中新增的标准药品名
    await onSearchRelation(addFormData.cleanedDrugName)
    const matched = (standardDrugOptions.value as any).find(
      (o: any) => o.item?.drugStandardName === addFormData.cleanedDrugName,
    )
    if (matched) {
      editFormData.drugStandardId = matched.value
      onStandardDrugChange(matched.value)
    }
  } catch (e) {
    console.error(e)
  } finally {
    addLoading.value = false
  }
}
// #endregion

// #region 生命周期
onMounted(async () => {
  // 获取公司选项
  try {
    const res = await companyApi.queryStandardList({ pageNum: 1, pageSize: 1000 })
    companyOptions.value = res.data?.list || []
  } catch (e) {
    console.error(e)
  }

  // 获取剂型选项
  await onSearchDosageForm()

  loadList()
})
// #endregion
</script>

<style scoped lang="scss">
// #region 页面样式
.drug-clean-page {
  padding: 10px;
}

// 弹窗内浅蓝色信息块
.form-info-block {
  background-color: var(--el-color-primary-light-9);
  padding: 16px;
  border-radius: 4px;
  margin-bottom: 16px;
}

// 弹窗顶部源数据信息块
.form-source-block {
  background-color: var(--el-color-primary-light-9);
  padding: 16px;
  border-radius: 4px;
  margin-bottom: 16px;
  display: flex;
  gap: 30px;
}
// #endregion
</style>
