<template>
  <!-- 公司名清洗页面 -->
  <div class="company-clean-page">
    <!-- #region 主表格区（MTable：搜索 + 表格 + 分页） -->
    <MTable
      v-model:tableConfig="tableConfig"
      :search-config="searchConfig"
      :loading="loading"
      title="公司名清洗"
      @search="onSearch"
    >
      <!-- 相关备案/登记号列 -->
      <template #cnt="{ row }">
        <el-link type="primary" @click="openAccModal(row.id)">{{ row.cnt ?? 0 }}</el-link>
      </template>

      <!-- 清洗状态列 -->
      <template #cleanStatus="{ row }">
        <el-select
          :model-value="row.cleanStatus"
          :disabled="row.cleanStatus === 3"
          style="width: 110px"
          @change="(val: number | string) => onCleanStatusChange(row, Number(val))"
        >
          <el-option
            v-for="opt in statusOptions"
            :key="opt.value"
            :label="opt.label"
            :value="opt.value"
            :disabled="opt.disabled"
          />
        </el-select>
      </template>

      <!-- 操作列 -->
      <template #tableRowOperation="{ row }">
        <div class="flex gap-8px justify-center">
          <el-button type="primary" size="small" @click="openEditModal(row)">关联</el-button>
          <el-button type="primary" size="small" @click="openSplitModal(row)">拆分</el-button>
        </div>
      </template>
    </MTable>
    <!-- #endregion -->

    <!-- #region 相关备案/登记号弹窗 -->
    <el-dialog v-model="accModalVisible" title="相关备案/登记号" width="640px">
      <el-table v-loading="accLoading" :data="accData" border stripe :max-height="400">
        <el-table-column type="index" label="序号" width="80" align="center" :index="accIndexFn" />
        <el-table-column prop="acceptanceNo" label="相关登记号/备案号" align="center" />
        <template #empty>
          <el-empty :image-size="80" description="暂无数据" />
        </template>
      </el-table>
      <div class="flex justify-end mt-16px">
        <el-pagination
          background
          layout="total, sizes, prev, pager, next, jumper"
          :total="accPagination.total"
          :page-sizes="[5, 10, 20, 50]"
          v-model:current-page="accPagination.current"
          v-model:page-size="accPagination.pageSize"
          @size-change="onAccSizeChange"
          @current-change="onAccCurrentChange"
        />
      </div>
    </el-dialog>
    <!-- #endregion -->

    <!-- #region 关联弹窗 -->
    <el-dialog v-model="editModalVisible" title="关联" width="620px" @closed="onEditModalClose">
      <el-form :model="editFormData" label-width="120px" label-position="left">
        <!-- 关联搜索（可新增标准名公司） -->
        <div class="dialog-tip-block mb-16px">
          <el-form-item label="关联：">
            <div class="flex items-center w-full">
              <el-select
                v-model="editFormData.relationId"
                filterable
                remote
                clearable
                :remote-method="(keyword: string) => onSearchRelation(keyword)"
                :loading="searchLoading"
                placeholder="请输入搜索标准公司"
                style="width: 360px"
                @change="onRelationChange"
                @clear="onRelationClear"
              >
                <el-option
                  v-for="opt in relationOptions"
                  :key="opt.value"
                  :label="opt.label"
                  :value="opt.value"
                />
              </el-select>
              <el-button type="primary" class="ml-20px" @click="openAddModal">新增</el-button>
            </div>
          </el-form-item>
        </div>

        <!-- 关联后的标准公司信息 -->
        <div class="dialog-tip-block">
          <el-form-item label="公司名(标准名称)">
            <el-input v-model="editFormData.companyStandardName" disabled />
          </el-form-item>
          <el-form-item label="公司简称">
            <el-input v-model="editFormData.companyShortName" disabled />
          </el-form-item>
          <el-form-item label="公司类型">
            <el-select
              v-model="editFormData.companyType"
              :options="companyTypeOptions"
              disabled
              clearable
            />
          </el-form-item>
          <el-form-item label="母公司简称">
            <el-input v-model="editFormData.parentCompanyShortName" disabled />
          </el-form-item>
          <el-form-item label="备注">
            <el-input v-model="editFormData.remark" type="textarea" :rows="3" />
          </el-form-item>
        </div>
      </el-form>
      <template #footer>
        <el-button @click="editModalVisible = false">取消</el-button>
        <el-button type="primary" :loading="editLoading" @click="submitEdit">提交</el-button>
      </template>
    </el-dialog>
    <!-- #endregion -->

    <!-- #region 新增标准名公司弹窗 -->
    <el-dialog v-model="addModalVisible" title="新增标准名公司" width="620px">
      <el-form :model="addFormData" label-width="120px" label-position="left">
        <el-form-item label="公司名(标准名称)">
          <el-input
            v-model="addFormData.companyStandardName"
            placeholder="请输入标准名称"
            clearable
          />
        </el-form-item>
        <el-form-item label="公司简称">
          <el-input v-model="addFormData.companyShortName" placeholder="请输入公司简称" clearable />
        </el-form-item>
        <el-form-item label="公司类型">
          <el-select
            v-model="addFormData.companyType"
            placeholder="请选择公司类型"
            clearable
            style="width: 100%"
          >
            <el-option
              v-for="opt in companyTypeOptions"
              :key="opt.value"
              :label="opt.label"
              :value="opt.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="母公司简称">
          <div class="flex items-center w-full">
            <el-select
              v-model="addFormData.parentCompanyId"
              filterable
              remote
              clearable
              :remote-method="(keyword: string) => onSearchParentRelation(keyword)"
              :loading="searchLoading"
              placeholder="请输入搜索母公司"
              style="width: 360px"
            >
              <el-option
                v-for="opt in relationParentOptions"
                :key="opt.value"
                :label="opt.label"
                :value="opt.value"
              />
            </el-select>
            <el-button type="primary" class="ml-20px" @click="openParentModal">
              新增母公司
            </el-button>
          </div>
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            v-model="addFormData.remark"
            type="textarea"
            :rows="3"
            placeholder="请输入备注"
            :maxlength="200"
            show-word-limit
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="addModalVisible = false">取消</el-button>
        <el-button type="primary" :loading="addLoading" @click="submitAddCompany">保存</el-button>
      </template>
    </el-dialog>
    <!-- #endregion -->

    <!-- #region 新增母公司弹窗 -->
    <el-dialog v-model="parentModalVisible" title="新增母公司" width="480px">
      <el-form :model="parentFormData" label-width="110px" label-position="left">
        <el-form-item label="母公司简称">
          <el-input
            v-model="parentFormData.parentCompanyShortName"
            placeholder="请输入母公司简称"
            clearable
          />
        </el-form-item>
        <el-form-item label="公司类型">
          <el-select
            v-model="parentFormData.companyType"
            placeholder="请选择公司类型"
            clearable
            style="width: 100%"
          >
            <el-option
              v-for="opt in companyTypeOptions"
              :key="opt.value"
              :label="opt.label"
              :value="opt.value"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="parentModalVisible = false">取消</el-button>
        <el-button type="primary" :loading="parentLoading" @click="submitParentCompany">
          保存
        </el-button>
      </template>
    </el-dialog>
    <!-- #endregion -->

    <!-- #region 拆分弹窗 -->
    <el-dialog v-model="splitModalVisible" title="源名称拆分" width="620px">
      <el-form :model="splitFormData" label-width="120px" label-position="left">
        <el-form-item label="公司名(源数据)">
          <el-input v-model="splitFormData.companyOriginName" disabled />
        </el-form-item>
        <el-form-item label="拆分公司名称">
          <div class="w-full">
            <div
              v-for="(item, index) in splitFormData.spiltNames"
              :key="index"
              class="flex gap-8px mb-8px"
            >
              <el-input v-model="item.companyOriginName" placeholder="请输入拆分后的公司名称" />
              <el-button type="danger" plain @click="removeSplitName(index)">
                <el-icon><Delete /></el-icon>
                <span class="ml-4px">删除</span>
              </el-button>
            </div>
            <el-button type="primary" plain @click="addSplitName">
              <el-icon><Plus /></el-icon>
              <span class="ml-4px">增加</span>
            </el-button>
          </div>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="splitModalVisible = false">取消</el-button>
        <el-button type="primary" :loading="splitLoading" @click="submitSplit">保存</el-button>
      </template>
    </el-dialog>
    <!-- #endregion -->
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: 'CompanyClean' })
// #region 依赖导入
import { ref, reactive, nextTick, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import moment from 'moment'
import { companyApi } from '@/api'
import type {
  CleanCompanyDto,
  StandardCompanyDto,
  CompanyShortDto,
  SplitCompanyDto,
  ParentCompanyDto,
} from '@/api/types/company'
import { COMPANY_TYPE, createEnumsToOptions, CLEANING_STATUS } from '@/utils/enums'
// #endregion

// #region 常量配置
// 清洗状态下拉（已拆分禁用，不允许手动改回）
const statusOptions = createEnumsToOptions(CLEANING_STATUS, [CLEANING_STATUS.已拆分])

const companyTypeOptions = createEnumsToOptions(COMPANY_TYPE)
// #endregion

// #region 搜索配置与状态
const loading = ref(false)

const searchConfig = reactive({
  form: {
    companyName: '',
    parentCompanyShortName: '',
    companyType: '',
    cleanStatus: 0 as number | '',
    page: 1,
    rows: 20,
  },
  items: [
    {
      id: 'companyName',
      label: '公司名(源数据)',
      type: 'input',
      width: 220,
      placeholder: '请输入关键字',
    },
    {
      id: 'parentCompanyShortName',
      label: '母公司简称',
      type: 'input',
      width: 220,
      placeholder: '请输入关键字',
    },
    {
      id: 'companyType',
      label: '公司类型',
      type: 'select',
      width: 220,
      placeholder: '请选择公司类型',
      options: companyTypeOptions,
    },
    {
      id: 'cleanStatus',
      label: '清洗状态',
      type: 'select',
      width: 220,
      placeholder: '请选择状态',
      options: statusOptions,
    },
  ],
})
// #endregion

// #region 表格列配置
const tableConfig = ref<{ data: CleanCompanyDto[]; total: number; columns: Record<string, any>[] }>(
  {
    data: [],
    total: 0,
    columns: [
      {
        type: 'index',
        label: '序号',
        width: 60,
        index: (index: number) =>
          index +
          1 +
          (Number(searchConfig.form.page || 1) - 1) * Number(searchConfig.form.rows || 20),
      },
      { id: 'companyOriginName', label: '公司名(源数据)', width: 280, align: 'left' },
      { id: 'cnt', label: '相关备案/登记号', width: 130, align: 'center' },
      { id: 'cleanStatus', label: '清洗状态', width: 130, align: 'center' },
      { id: 'companyStandardName', label: '清洗后公司名称(标准名)', width: 240, align: 'left' },
      { id: 'companyType', label: '公司类型', width: 100, align: 'center' },
      { id: 'companyShortName', label: '公司简称', width: 140, align: 'center' },
      { id: 'parentCompanyShortName', label: '母公司简称', width: 140, align: 'center' },
      { id: 'updater', label: '操作人', width: 100, align: 'center' },
      {
        id: 'updateTime',
        label: '更新时间',
        width: 170,
        align: 'center',
        formatter: (row: CleanCompanyDto) =>
          row.updateTime ? moment(row.updateTime).format('YYYY-MM-DD HH:mm:ss') : '-',
      },
      { type: 'action', label: '操作', width: 150, align: 'center', fixed: 'right' },
    ],
  },
)
// #endregion

// #region 弹窗与表单状态
// 备案号弹窗
const accModalVisible = ref(false)
const accData = ref<{ acceptanceNo: string }[]>([])
const accLoading = ref(false)
const accPagination = reactive({
  current: 1,
  pageSize: 5,
  total: 0,
})
const currentCompanyId = ref<number>()

// 关联弹窗
const editModalVisible = ref(false)
const editLoading = ref(false)
const currentEditRecord = ref<CleanCompanyDto | null>(null)
const relationOptions = ref<{ label: string; value: number; item: CompanyShortDto }[]>([])
const relationParentOptions = ref<{ label: string; value: number; item: CompanyShortDto }[]>([])
const searchLoading = ref(false)

const editFormData = reactive<Record<string, any>>({
  relationId: undefined,
  companyStandardName: '',
  companyShortName: '',
  companyType: '',
  parentCompanyShortName: '',
  remark: '',
})

// 新增标准名公司弹窗
const addModalVisible = ref(false)
const addLoading = ref(false)
const addFormData = reactive<Record<string, any>>({
  companyStandardName: '',
  companyShortName: '',
  companyType: '',
  parentCompanyShortName: '',
  parentCompanyId: '',
  remark: '',
})

// 新增母公司弹窗
const parentModalVisible = ref(false)
const parentLoading = ref(false)
const parentFormData = reactive<Record<string, any>>({
  parentCompanyShortName: '',
  companyType: '',
})

// 拆分弹窗
const splitModalVisible = ref(false)
const splitLoading = ref(false)
const splitFormData = reactive<{
  id?: number
  companyOriginName: string
  spiltNames: { companyOriginName: string }[]
}>({
  id: undefined,
  companyOriginName: '',
  spiltNames: [{ companyOriginName: '' }],
})
// #endregion

// #region 数据加载
const loadList = async () => {
  loading.value = true
  try {
    const {
      companyName,
      parentCompanyShortName,
      companyType,
      cleanStatus,
      page = 1,
      rows = 20,
    } = searchConfig.form
    const params: Record<string, any> = {
      companyName: companyName || '',
      parentCompanyShortName: parentCompanyShortName || '',
      companyType: companyType || '',
      // 空值按“未清洗(0)”处理，保持默认队列语义
      cleanStatus: cleanStatus === '' || cleanStatus == null ? 0 : cleanStatus,
      pageNum: page,
      pageSize: rows,
    }
    const res = await companyApi.pageData(params)
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

// #region 清洗状态行内切换
const onCleanStatusChange = async (row: CleanCompanyDto, val: number) => {
  try {
    await companyApi.updateCleanStatus({
      id: row.id!,
      cleanStatus: val,
    })
    ElMessage.success('状态已更新')
    loadList()
  } catch (e) {
    console.error(e)
    loadList()
  }
}
// #endregion

// #region 相关备案/登记号弹窗
const accIndexFn = (index: number) =>
  index + 1 + (accPagination.current - 1) * accPagination.pageSize

const fetchAcceptanceNos = async (companyId: number, curr = 1, size = 5) => {
  accLoading.value = true
  try {
    const res = await companyApi.getAcceptanceNos({
      queryId: companyId,
      pageNum: curr,
      pageSize: size,
    })
    const mappedList = (res.data?.list || []).map((no: string) => ({ acceptanceNo: no }))
    accData.value = mappedList
    accPagination.current = curr
    accPagination.pageSize = size
    accPagination.total = res.data?.total || 0
  } catch (e) {
    console.error(e)
  } finally {
    accLoading.value = false
  }
}

const openAccModal = (id?: number) => {
  if (!id) return
  currentCompanyId.value = id
  fetchAcceptanceNos(id, 1, 5)
  accModalVisible.value = true
}

const onAccSizeChange = () => {
  if (!currentCompanyId.value) return
  accPagination.current = 1
  fetchAcceptanceNos(currentCompanyId.value, 1, accPagination.pageSize)
}

const onAccCurrentChange = () => {
  if (currentCompanyId.value) {
    fetchAcceptanceNos(currentCompanyId.value, accPagination.current, accPagination.pageSize)
  }
}
// #endregion

// #region 关联弹窗逻辑
const resetEditForm = () => {
  relationOptions.value = []
  relationParentOptions.value = []
  editFormData.relationId = undefined
  editFormData.companyStandardName = ''
  editFormData.companyShortName = ''
  editFormData.companyType = ''
  editFormData.parentCompanyShortName = ''
  editFormData.remark = ''
}

const openEditModal = (record: CleanCompanyDto) => {
  resetEditForm()
  currentEditRecord.value = record
  editFormData.relationId = record.standardId || undefined
  editFormData.companyStandardName = record.companyStandardName || ''
  editFormData.companyShortName = record.companyShortName || ''
  editFormData.companyType = record.companyType || ''
  editFormData.parentCompanyShortName = record.parentCompanyShortName || ''
  editFormData.remark = record.remark || ''
  editModalVisible.value = true

  nextTick(() => {
    if (!record.standardId) return
    onSearchRelation('', record.standardId)
  })
}

const onSearchRelation = async (keyword = '', id?: number) => {
  searchLoading.value = true
  try {
    const res = await companyApi.queryStandardWithoutParent({
      searchKey: keyword || '',
      pageNum: 1,
      pageSize: 50,
      id: id || null,
    })
    relationOptions.value = (res.data?.list || [])
      .filter((item: CompanyShortDto) => item.parentCompanyId != null)
      .map((item: CompanyShortDto) => ({
        label: item.companyStandardName || '',
        value: item.standardId as number,
        item,
      }))
  } catch (e) {
    console.error(e)
  } finally {
    searchLoading.value = false
  }
}

const onSearchParentRelation = async (keyword = '', id?: number) => {
  searchLoading.value = true
  try {
    const res = await companyApi.queryParentData({
      searchKey: keyword || '',
      pageNum: 1,
      pageSize: 50,
      id: id || null,
    })
    relationParentOptions.value = (res.data?.list || [])
      .filter((item: CompanyShortDto) => item.parentCompanyId != null)
      .map((item: CompanyShortDto) => ({
        label: item.companyStandardName || '',
        value: item.standardId as number,
        item,
      }))
  } catch (e) {
    console.error(e)
  } finally {
    searchLoading.value = false
  }
}

const onRelationClear = () => {
  editFormData.companyStandardName = ''
  editFormData.companyShortName = ''
  editFormData.companyType = ''
  editFormData.parentCompanyShortName = ''
  addFormData.parentCompanyShortName = ''
}

const onRelationChange = (val: any) => {
  const opt = relationOptions.value.find((o) => o.value === val)
  if (opt?.item) {
    editFormData.companyStandardName = opt.item.companyStandardName || ''
    editFormData.companyShortName = opt.item.companyShortName || ''
    editFormData.companyType = opt.item.companyType || ''
    editFormData.parentCompanyShortName = opt.item.parentCompanyShortName || ''
    // 同步到新增表单，提交时一并传给后端
    addFormData.parentCompanyShortName = opt.item.parentCompanyShortName || ''
  }
}

const submitEdit = async () => {
  if (!currentEditRecord.value) return
  editLoading.value = true
  try {
    const submitData: CleanCompanyDto = {
      id: currentEditRecord.value.id,
      standardId: editFormData.relationId,
    }
    await companyApi.saveClean(submitData)
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
  currentEditRecord.value = null
}
// #endregion

// #region 新增标准名公司弹窗
const openAddModal = () => {
  addFormData.companyStandardName = ''
  addFormData.companyShortName = ''
  addFormData.companyType = ''
  addFormData.parentCompanyShortName = ''
  addFormData.parentCompanyId = ''
  addFormData.remark = ''
  addModalVisible.value = true
}

const submitAddCompany = async () => {
  if (!addFormData.companyStandardName?.trim()) {
    ElMessage.warning('请填写标准名')
    return
  }
  addLoading.value = true
  try {
    const submitData: StandardCompanyDto = {
      companyStandardName: addFormData.companyStandardName,
      companyShortName: addFormData.companyShortName,
      companyType: addFormData.companyType,
      parentCompanyShortName:
        relationParentOptions.value.find((o) => o.value === addFormData.parentCompanyId)?.label ||
        '',
      parentCompanyId: addFormData.parentCompanyId || undefined,
      remark: addFormData.remark,
      status: 0,
    }
    await companyApi.saveStandardCompany(submitData)
    ElMessage.success('新增成功')
    addModalVisible.value = false

    // 刷新关联下拉选项，命中则自动选中新增的标准公司
    await onSearchRelation(addFormData.companyStandardName)
    const matched = relationOptions.value.find(
      (o) => o.item?.companyStandardName === addFormData.companyStandardName,
    )
    if (matched) {
      editFormData.relationId = matched.value
      onRelationChange(matched.value)
    }
  } catch (e) {
    console.error(e)
  } finally {
    addLoading.value = false
  }
}
// #endregion

// #region 新增母公司弹窗
const openParentModal = () => {
  parentFormData.parentCompanyShortName = ''
  parentFormData.companyType = ''
  parentModalVisible.value = true
}

const submitParentCompany = async () => {
  if (!parentFormData.parentCompanyShortName?.trim()) {
    ElMessage.warning('请填写母公司简称')
    return
  }
  parentLoading.value = true
  try {
    const submitData: ParentCompanyDto = {
      parentCompanyShortName: parentFormData.parentCompanyShortName,
      companyType: parentFormData.companyType,
    }
    await companyApi.saveParentCompany(submitData)
    ElMessage.success('新增成功')
    parentModalVisible.value = false

    // 刷新母公司下拉选项，命中则自动选中新增的母公司
    await onSearchRelation(parentFormData.parentCompanyShortName)
    const matched = relationParentOptions.value.find(
      (o) =>
        o.item?.parentCompanyShortName === parentFormData.parentCompanyShortName ||
        o.item?.companyStandardName === parentFormData.parentCompanyShortName,
    )
    if (matched) {
      addFormData.parentCompanyId = matched.value
    }
  } catch (e) {
    console.error(e)
  } finally {
    parentLoading.value = false
  }
}
// #endregion

// #region 拆分弹窗
const openSplitModal = (record: CleanCompanyDto) => {
  splitFormData.id = record.id
  splitFormData.companyOriginName = record.companyOriginName || ''
  splitFormData.spiltNames = [{ companyOriginName: '' }]
  splitModalVisible.value = true
}

const addSplitName = () => {
  splitFormData.spiltNames.push({ companyOriginName: '' })
}

const removeSplitName = (index: number) => {
  splitFormData.spiltNames.splice(index, 1)
}

const submitSplit = async () => {
  const names = splitFormData.spiltNames
    .map((item) => item.companyOriginName?.trim())
    .filter((name): name is string => !!name)
  if (!names.length) {
    ElMessage.warning('请至少填写一个拆分公司名称')
    return
  }
  splitLoading.value = true
  try {
    const submitData: SplitCompanyDto = {
      id: splitFormData.id,
      companyOriginName: splitFormData.companyOriginName,
      spiltNames: names.map((name) => ({ companyOriginName: name })),
    }
    await companyApi.spiltNames(submitData)
    ElMessage.success('拆分成功')
    splitModalVisible.value = false
    loadList()
  } catch (e) {
    console.error(e)
  } finally {
    splitLoading.value = false
  }
}
// #endregion

// #region 生命周期
onMounted(() => {
  loadList()
})
// #endregion
</script>

<style scoped lang="scss">
// #region 页面样式
.company-clean-page {
  padding: 16px;
}

// 弹窗内浅蓝提示块
.dialog-tip-block {
  background-color: #e6f7ff;
  padding: 4px 16px 0;
  border-radius: 6px;

  .el-form-item {
    margin-bottom: 18px;
  }
}
// #endregion
</style>
