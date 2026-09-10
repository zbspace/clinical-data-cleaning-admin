<template>
  <!-- #region 公司名库管理页面 -->
  <div class="company-database-page">
    <!-- #region 主查询表格（MTable：搜索 + 表格 + 分页 + 高度自适应） -->
    <MTable
      v-model:tableConfig="tableConfig"
      :search-config="searchConfig"
      :loading="loading"
      title="公司名库"
      @search="onSearch"
    >
      <!-- #region 表格工具栏（只查母公司 + 新增） -->
      <template #tableTools>
        <!-- <span class="text-14px">只查母公司</span>
        <el-switch
          v-model="searchConfig.form.onlyParent"
          :active-value="1"
          :inactive-value="0"
          @change="onOnlyParentChange"
        /> -->
        <el-button type="primary" @click="handleAdd">新增</el-button>
      </template>
      <!-- #endregion -->

      <!-- #region 源数据公司名(别名)列 -->
      <template #cnt="{ row }">
        <el-link type="primary" underline="never" @click="openSourceModal(row.id!)">
          {{ row.cnt || 0 }}
        </el-link>
      </template>
      <!-- #endregion -->

      <!-- #region 操作列 -->
      <template #tableRowOperation="{ row }">
        <div class="flex">
          <el-button type="primary" @click="openEditModal(row)">编辑</el-button>
          <el-button type="primary" @click="openMergeModal(row)">合并</el-button>
        </div>
      </template>
      <!-- #endregion -->
    </MTable>
    <!-- #endregion -->

    <!-- #region 源数据公司名(别名)弹窗 -->
    <el-dialog v-model="sourceModalVisible" title="源数据公司名(别名)" width="600px">
      <el-table :data="sourceData" v-loading="sourceLoading" border stripe :max-height="420">
        <el-table-column
          type="index"
          label="序号"
          width="80"
          align="center"
          :index="
            (idx: number) => idx + 1 + (sourcePagination.current - 1) * sourcePagination.pageSize
          "
        />
        <el-table-column
          prop="originName"
          label="公司别名(源数名称)"
          min-width="300"
          align="left"
          show-overflow-tooltip
        />
      </el-table>
      <div class="flex justify-end mt-16px">
        <el-pagination
          v-model:current-page="sourcePagination.current"
          v-model:page-size="sourcePagination.pageSize"
          :page-sizes="[10, 20, 50]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="sourcePagination.total"
          @size-change="onSourceSizeChange"
          @current-change="onSourceCurrentChange"
        />
      </div>
    </el-dialog>
    <!-- #endregion -->

    <!-- #region 新增标准名公司弹窗 -->
    <el-dialog v-model="addModalVisible" title="新增标准名公司" width="600px">
      <el-form :model="addFormData" label-width="130px" class="pt-8px">
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
            :options="companyTypeOptions"
            placeholder="请选择公司类型"
            clearable
            class="!w-full"
          />
        </el-form-item>
        <el-form-item label="母公司简称">
          <div class="flex items-center gap-20px w-full">
            <el-select
              v-model="addFormData.parentCompanyId"
              filterable
              remote
              :remote-method="(keyword: string) => onSearchRelation(undefined, keyword)"
              :loading="searchLoading"
              placeholder="请输入搜索母公司"
              clearable
              class="!w-360px"
              @change="onAddRelationChange"
              @clear="onAddRelationClear"
            >
              <el-option
                v-for="opt in relationOptions"
                :key="opt.value"
                :label="opt.label"
                :value="opt.value"
              />
            </el-select>
            <el-button type="primary" @click="openParentModal">新增母公司</el-button>
          </div>
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            v-model="addFormData.remark"
            type="textarea"
            :rows="3"
            placeholder="请输入备注"
            maxlength="200"
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
      <el-form :model="newParentFormData" label-width="100px" class="pt-8px">
        <el-form-item label="母公司简称">
          <el-input
            v-model="newParentFormData.parentCompanyShortName"
            placeholder="请输入母公司简称"
            clearable
          />
        </el-form-item>
        <el-form-item label="公司类型">
          <el-select
            v-model="newParentFormData.companyType"
            :options="companyTypeOptions"
            placeholder="请选择公司类型"
            clearable
            class="!w-full"
          />
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

    <!-- #region 合并弹窗 -->
    <el-dialog v-model="mergeModalVisible" title="公司合并" width="520px">
      <el-form :model="mergeFormData" label-width="120px" class="pt-8px">
        <el-form-item label="公司名">
          <el-input :model-value="mergeFormData.sourceParentName" disabled />
        </el-form-item>
        <el-form-item label="合并到">
          <el-select
            v-model="mergeFormData.targetParentId"
            filterable
            remote
            :remote-method="(keyword: string) => onSearchMerge(keyword)"
            :loading="mergeSearchLoading"
            placeholder="请输入搜索合并到的公司"
            clearable
            class="!w-full"
          >
            <el-option
              v-for="opt in mergeOptions"
              :key="opt.value"
              :label="opt.label"
              :value="opt.value"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="mergeModalVisible = false">取消</el-button>
        <el-button type="primary" :loading="mergeLoading" @click="submitMerge">提交</el-button>
      </template>
    </el-dialog>
    <!-- #endregion -->

    <!-- #region 母公司编辑弹窗 -->
    <el-dialog
      v-model="editParentModalVisible"
      title="母公司修改"
      width="480px"
      @closed="onEditParentModalClose"
    >
      <el-form label-width="100px" class="pt-8px">
        <el-form-item label="原名称">
          <el-input :model-value="parentOriginalName" disabled />
        </el-form-item>
        <el-form-item label="修改后名称">
          <el-input v-model="parentFormData.companyShortName" placeholder="请输入修改后名称" />
        </el-form-item>
        <el-form-item label="公司类型">
          <el-select
            v-model="parentFormData.companyType"
            :options="companyTypeOptions"
            placeholder="请选择公司类型"
            class="!w-full"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="editParentModalVisible = false">取消</el-button>
        <el-button type="primary" :loading="editLoading" @click="submitParentEdit">保存</el-button>
      </template>
    </el-dialog>
    <!-- #endregion -->

    <!-- #region 非母公司编辑弹窗 -->
    <el-dialog
      v-model="editStandardModalVisible"
      title="标准公司名编辑"
      width="600px"
      @closed="onEditStandardModalClose"
    >
      <el-form :model="editFormData" label-width="130px" class="pt-8px">
        <el-form-item label="公司名(标准名称)">
          <el-input v-model="editFormData.companyStandardName" />
        </el-form-item>
        <el-form-item label="公司简称">
          <el-input v-model="editFormData.companyShortName" />
        </el-form-item>
        <el-form-item label="公司类型">
          <el-select
            v-model="editFormData.companyType"
            :options="companyTypeOptions"
            placeholder="请选择"
            class="!w-full"
          />
        </el-form-item>
        <!-- #region 母公司关联搜索 -->
        <el-form-item label="母公司简称">
          <el-select
            v-model="editFormData.parentCompanyId"
            filterable
            remote
            :remote-method="(keyword: string) => onSearchRelation(undefined, keyword)"
            :loading="searchLoading"
            placeholder="请输入搜索标准公司"
            clearable
            class="!w-full"
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
        </el-form-item>
        <!-- #endregion -->
        <el-form-item label="备注">
          <el-input v-model="editFormData.remark" type="textarea" :rows="3" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="editStandardModalVisible = false">取消</el-button>
        <el-button type="primary" :loading="editLoading" @click="submitStandardEdit">
          保存
        </el-button>
      </template>
    </el-dialog>
    <!-- #endregion -->
  </div>
  <!-- #endregion -->
</template>

<script setup lang="ts">
//#region Imports
import { ref, reactive, onMounted, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import moment from 'moment'
import { companyApi } from '@/api'
import type { ParentCompanyDto, StandardCompanyDto } from '@/api/types/company'
import { COMPANY_TYPE, createEnumsToOptions } from '@/utils/enums'
//#endregion

//#region Constants
const companyTypeOptions = createEnumsToOptions(COMPANY_TYPE)
//#endregion

//#region 搜索配置（MTable 约定：page / rows 由组件内部维护）
const searchConfig = reactive({
  form: {
    companyName: '',
    parentCompanyShortName: '',
    companyType: '',
    onlyParent: 0 as number | '',
    page: 1,
    rows: 20,
  },
  items: [
    {
      id: 'companyName',
      label: '公司名(标准名)',
      type: 'input',
      width: 220,
      placeholder: '请输入',
    },
    {
      id: 'parentCompanyShortName',
      label: '母公司简称',
      type: 'input',
      width: 180,
      placeholder: '请输入',
    },
    {
      id: 'companyType',
      label: '公司类型',
      type: 'select',
      width: 130,
      options: companyTypeOptions,
      placeholder: '请选择',
    },
    {
      id: 'onlyParent',
      label: '只仅查母公司',
      type: 'switch',
      width: 40,
      options: [
        { label: '是', value: 1 },
        { label: '否', value: 0 },
      ],
    },
  ],
})
//#endregion

//#region 表格配置
const tableConfig = ref<Record<string, any>>({
  data: [],
  total: 0,
  columns: [
    {
      id: 'rowIndex',
      type: 'index',
      label: '序号',
      width: 80,
      index: (idx: number) =>
        idx + 1 + (Number(searchConfig.form.page || 1) - 1) * Number(searchConfig.form.rows || 20),
    },
    { id: 'companyStandardName', label: '公司名(标准名称)', minWidth: 280, align: 'left' },
    { id: 'cnt', label: '源数据公司名（别名）', width: 180, align: 'center' },
    { id: 'companyType', label: '公司类型', width: 100, align: 'center' },
    { id: 'companyShortName', label: '公司简称', width: 180, align: 'left' },
    { id: 'parentCompanyShortName', label: '母公司简称', width: 180, align: 'left' },
    { id: 'updater', label: '操作人', width: 100, align: 'center' },
    {
      id: 'updateTime',
      label: '更新时间',
      width: 180,
      align: 'center',
      formatter: (row: any) =>
        row.updateTime ? moment(row.updateTime).format('YYYY-MM-DD HH:mm:ss') : '-',
    },
    { id: 'operation', type: 'action', label: '操作', width: 160, align: 'center', fixed: 'right' },
  ],
})
//#endregion

//#region State
const loading = ref(false)

// 源数据弹窗
const sourceModalVisible = ref(false)
const sourceData = ref<{ originName: string }[]>([])
const sourceLoading = ref(false)
const sourcePagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0,
})
const currentCompanyId = ref<number>()

// 新增弹窗
const addModalVisible = ref(false)
const addLoading = ref(false)
const addFormData = reactive<Record<string, any>>({
  companyStandardName: '',
  companyShortName: '',
  companyType: '',
  parentCompanyShortName: '',
  parentCompanyId: undefined,
  remark: '',
})

// 新增母公司弹窗
const parentModalVisible = ref(false)
const parentLoading = ref(false)
const newParentFormData = reactive<Record<string, any>>({
  parentCompanyShortName: '',
  companyType: '',
})

// 编辑弹窗
const editLoading = ref(false)
const currentEditRecord = ref<StandardCompanyDto | null>(null)
const relationOptions = ref<{ label: string; value: number; item: any }[]>([])
const searchLoading = ref(false)

// 合并弹窗
const mergeModalVisible = ref(false)
const mergeLoading = ref(false)
const mergeSearchLoading = ref(false)
const mergeOptions = ref<{ label: string; value: number; item: any }[]>([])
const mergeFormData = reactive<Record<string, any>>({
  sourceParentId: undefined,
  sourceParentName: '',
  targetParentId: undefined,
  targetParentName: '',
})

// 母公司编辑弹窗
const editParentModalVisible = ref(false)
const parentOriginalName = ref('')
const parentFormData = reactive<Record<string, any>>({
  id: undefined,
  companyShortName: '',
  companyType: '',
})

// 非母公司编辑弹窗
const editStandardModalVisible = ref(false)
const editFormData = reactive<Record<string, any>>({
  companyStandardName: '',
  companyShortName: '',
  companyType: '',
  parentCompanyShortName: '',
  parentCompanyId: undefined,
  remark: '',
})
//#endregion

//#region 数据请求（MTable 分页/搜索统一入口）
const loadList = async () => {
  loading.value = true
  try {
    const {
      companyName,
      parentCompanyShortName,
      companyType,
      onlyParent,
      page = 1,
      rows = 20,
    } = searchConfig.form
    const params: Record<string, any> = {
      companyName,
      parentCompanyShortName,
      companyType,
      // 重置后 onlyParent 可能被清为 ''，统一按 0（查询全部）处理
      onlyParent: onlyParent === 1 ? 1 : 0,
      pageNum: page,
      pageSize: rows,
    }
    const res = await companyApi.queryStandardList(params)
    tableConfig.value.data = res.data?.list || []
    tableConfig.value.total = res.data?.total || 0
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

const onSearch = () => {
  loadList()
}

const onOnlyParentChange = () => {
  loadList()
}
//#endregion

//#region Source Modal（源数据公司名弹窗）
const fetchSourceData = async (companyId: number, curr = 1, size = 10) => {
  sourceLoading.value = true
  try {
    const res = await companyApi.getOriginCompanies({
      queryId: companyId,
      pageNum: curr,
      pageSize: size,
    })
    const mappedList = (res.data?.list || []).map((name: string) => ({ originName: name }))
    sourceData.value = mappedList
    sourcePagination.current = curr
    sourcePagination.pageSize = size
    sourcePagination.total = res.data?.total || 0
  } catch (e) {
    console.error(e)
  } finally {
    sourceLoading.value = false
  }
}

const openSourceModal = (id: number) => {
  currentCompanyId.value = id
  fetchSourceData(id, 1, 10)
  sourceModalVisible.value = true
}

const onSourceSizeChange = (size: number) => {
  sourcePagination.current = 1
  if (currentCompanyId.value) {
    fetchSourceData(currentCompanyId.value, 1, size)
  }
}

const onSourceCurrentChange = (curr: number) => {
  if (currentCompanyId.value) {
    fetchSourceData(currentCompanyId.value, curr, sourcePagination.pageSize)
  }
}
//#endregion

//#region Edit Modal（母公司/标准公司远程搜索关联）
const onSearchRelation = async (id?: number, keyword = '') => {
  searchLoading.value = true
  try {
    const res = await companyApi.queryParentData({
      searchKey: keyword,
      pageNum: 1,
      pageSize: 50,
      id,
    })
    const opts = (res.data?.list || [])
      .filter((item: any) => item.parentCompanyId != null)
      .map((item: any) => ({
        label: item.companyStandardName || '',
        value: item.standardId as number,
        item,
      }))
    relationOptions.value = opts
  } catch (e) {
    console.error(e)
  } finally {
    searchLoading.value = false
  }
}

const onRelationChange = (val: any) => {
  const opt = relationOptions.value.find((o) => o.value === val)
  if (opt && opt.item) {
    editFormData.parentCompanyShortName = opt.item.parentCompanyShortName
  }
}

const onRelationClear = () => {
  editFormData.parentCompanyShortName = ''
}

const openEditModal = async (record: StandardCompanyDto) => {
  if (!record || !record.id) return
  relationOptions.value = []
  editLoading.value = true
  currentEditRecord.value = record
  try {
    const res = await companyApi.getStandardCompany(record.id)
    const data = res.data
    currentEditRecord.value = data
    if (data.isParent === 1) {
      // 母公司：仅修改母公司简称
      parentFormData.id = data.id
      parentFormData.companyShortName =
        data.parentCompanyShortName != null ? String(data.parentCompanyShortName) : ''
      parentFormData.companyType = data.companyType || ''
      parentOriginalName.value = parentFormData.companyShortName
      editParentModalVisible.value = true
    } else {
      // 非母公司：修改标准公司信息
      editFormData.companyStandardName = data.companyStandardName || ''
      editFormData.companyShortName = data.companyShortName || ''
      editFormData.companyType = data.companyType || ''
      editFormData.parentCompanyShortName =
        data.parentCompanyShortName != null ? String(data.parentCompanyShortName) : ''
      editFormData.parentCompanyId = data.parentCompanyId || undefined
      editFormData.remark = data.remark || ''
      if (data.parentCompanyShortName != null) {
        // 等待弹窗渲染后预加载母公司选项，便于展示当前选中项
        nextTick(() => onSearchRelation(data.parentCompanyId))
      }
      editStandardModalVisible.value = true
    }
  } catch (e) {
    console.error(e)
  } finally {
    editLoading.value = false
  }
}

const onAddRelationChange = (val: any) => {
  const opt = relationOptions.value.find((o) => o.value === val)
  if (opt && opt.item) {
    addFormData.parentCompanyShortName = opt.item.parentCompanyShortName || ''
  }
}

const onAddRelationClear = () => {
  addFormData.parentCompanyShortName = ''
}

const onEditParentModalClose = () => {
  editParentModalVisible.value = false
  currentEditRecord.value = null
}

const onEditStandardModalClose = () => {
  editStandardModalVisible.value = false
  currentEditRecord.value = null
}
//#endregion

//#region 新增标准名公司 / 新增母公司
const handleAdd = () => {
  addFormData.companyStandardName = ''
  addFormData.companyShortName = ''
  addFormData.companyType = ''
  addFormData.parentCompanyShortName = ''
  addFormData.parentCompanyId = undefined
  addFormData.remark = ''
  addModalVisible.value = true
}

const openParentModal = () => {
  newParentFormData.parentCompanyShortName = ''
  newParentFormData.companyType = ''
  parentModalVisible.value = true
}

const submitParentCompany = async () => {
  if (!newParentFormData.parentCompanyShortName?.trim()) {
    ElMessage.warning('请填写母公司简称')
    return
  }
  parentLoading.value = true
  try {
    const submitData: ParentCompanyDto = {
      parentCompanyShortName: newParentFormData.parentCompanyShortName,
      companyType: newParentFormData.companyType,
    }
    await companyApi.saveParentCompany(submitData)
    ElMessage.success('新增成功')
    parentModalVisible.value = false

    // 刷新母公司下拉选项，命中则自动选中新增的母公司
    await onSearchRelation(undefined, newParentFormData.parentCompanyShortName)
    const matched = relationOptions.value.find(
      (o) => o.item?.parentCompanyShortName === newParentFormData.parentCompanyShortName,
    )
    if (matched) {
      addFormData.parentCompanyId = matched.value
      onAddRelationChange(matched.value)
    }
  } catch (e) {
    console.error(e)
  } finally {
    parentLoading.value = false
  }
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
      parentCompanyShortName: addFormData.parentCompanyShortName,
      parentCompanyId: addFormData.parentCompanyId || undefined,
      remark: addFormData.remark,
      status: 0,
    }
    await companyApi.saveStandardCompany(submitData)
    ElMessage.success('新增成功')
    addModalVisible.value = false
    loadList()
  } catch (e) {
    console.error(e)
  } finally {
    addLoading.value = false
  }
}
//#endregion

//#region 母公司编辑 / 非母公司编辑
const submitParentEdit = async () => {
  const newName = (parentFormData.companyShortName || '').trim()
  if (!newName) {
    ElMessage.warning('请填写修改后名称')
    return
  }
  if (!parentFormData.id) {
    ElMessage.warning('无母公司可修改')
    return
  }
  editLoading.value = true
  try {
    await companyApi.saveParentCompany({
      id: parentFormData.id,
      parentCompanyShortName: newName,
      companyType: parentFormData.companyType,
    })
    ElMessage.success('保存成功')
    editParentModalVisible.value = false
    loadList()
  } catch (e) {
    console.error(e)
  } finally {
    editLoading.value = false
  }
}

const submitStandardEdit = async () => {
  editLoading.value = true
  try {
    const submitData: StandardCompanyDto = {
      ...currentEditRecord.value,
      companyStandardName: editFormData.companyStandardName,
      companyShortName: editFormData.companyShortName,
      companyType: editFormData.companyType,
      parentCompanyShortName: editFormData.parentCompanyShortName,
      parentCompanyId: editFormData.parentCompanyId,
      remark: editFormData.remark,
    }
    await companyApi.saveStandardCompany(submitData)
    ElMessage.success('保存成功')
    editStandardModalVisible.value = false
    loadList()
  } catch (e) {
    console.error(e)
  } finally {
    editLoading.value = false
  }
}
//#endregion

//#region Merge Modal（公司合并）
const onSearchMerge = async (keyword = '') => {
  mergeSearchLoading.value = true
  try {
    const res = await companyApi.queryByName({ searchKey: keyword, pageNum: 1, pageSize: 50 })
    mergeOptions.value = (res.data?.list || [])
      .filter((item: any) => item.standardId != null || item.id != null)
      .map((item: any) => ({
        label: item.companyStandardName || '',
        value: (item.standardId ?? item.id) as number,
        item,
      }))
  } catch (e) {
    console.error(e)
  } finally {
    mergeSearchLoading.value = false
  }
}

const openMergeModal = (record: StandardCompanyDto) => {
  mergeFormData.sourceParentId = record.id
  mergeFormData.sourceParentName = record.companyStandardName || ''
  mergeFormData.targetParentId = undefined
  mergeFormData.targetParentName = ''
  mergeOptions.value = []
  mergeModalVisible.value = true
}

const submitMerge = async () => {
  if (!mergeFormData.targetParentId) {
    ElMessage.warning('请选择合并到的公司')
    return
  }
  const target = mergeOptions.value.find((o) => o.value === mergeFormData.targetParentId)
  if (!target) return
  mergeLoading.value = true
  try {
    await companyApi.parentCompanyMerge({
      sourceStandardId: mergeFormData.sourceParentId,
      sourceStandardName: mergeFormData.sourceParentName,
      targetStandardId: target.value,
      targetStandardName: target.label,
    })
    ElMessage.success('合并成功')
    mergeModalVisible.value = false
    loadList()
  } catch (e) {
    console.error(e)
  } finally {
    mergeLoading.value = false
  }
}
//#endregion

//#region Lifecycle
onMounted(() => {
  loadList()
})
//#endregion
</script>

<style scoped lang="scss">
//#region 页面样式
.company-database-page {
  padding: 10px;
}
//#endregion
</style>
