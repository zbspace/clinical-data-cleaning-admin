<template>
  <!-- #region 研究中心库管理页面 -->
  <div class="center-database-page">
    <!-- #region 主查询表格（MTable：搜索 + 表格 + 分页 + 高度自适应） -->
    <MTable
      v-model:tableConfig="tableConfig"
      :search-config="searchConfig"
      :loading="loading"
      title="研究中心库"
      @search="onSearch"
    >
      <!-- #region 表格工具栏（新增） -->
      <template #tableTools>
        <el-button type="primary" @click="openEditModal()">新增</el-button>
      </template>
      <!-- #endregion -->

      <!-- #region 别名列 -->
      <template #cnt="{ row }">
        <el-link type="primary" :underline="false" @click="openSourceModal(row.id!)">
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

    <!-- #region 源数据研究中心名(别名)弹窗 -->
    <el-dialog
      v-model="sourceModalVisible"
      title="源数据研究中心名(别名)"
      width="600px"
      @closed="onSourceModalClose"
    >
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
          label="研究中心别名(源数名称)"
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

    <!-- #region 编辑/新增弹窗 -->
    <el-dialog
      v-model="editModalVisible"
      :title="currentEditRecord ? '编辑' : '新增'"
      width="720px"
      @closed="onEditModalClose"
    >
      <el-form :model="editFormData" label-width="calc(2em + 40px)">
        <div
          style="
            margin-top: 16px;
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 0 24px;
            align-items: start;
          "
        >
          <el-form-item label="标准名称" prop="hosStandardName" style="grid-column: 1 / -1">
            <el-input v-model="editFormData.hosStandardName" />
          </el-form-item>
          <el-form-item label="简称" prop="hosShortName" style="grid-column: 1 / -1">
            <el-input v-model="editFormData.hosShortName" />
          </el-form-item>
          <el-form-item label="国家" prop="country">
            <el-select
              v-model="editFormData.country"
              placeholder="请选择"
              filterable
              allow-create
              default-first-option
            >
              <el-option
                v-for="opt in countryOptions"
                :key="opt.value"
                :label="opt.label"
                :value="opt.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="省份" prop="province">
            <el-select
              v-model="editFormData.province"
              placeholder="请选择"
              filterable
              allow-create
              default-first-option
            >
              <el-option
                v-for="opt in provinceOptions"
                :key="opt.value"
                :label="opt.label"
                :value="opt.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="城市" prop="city">
            <el-select
              v-model="editFormData.city"
              placeholder="请选择"
              filterable
              allow-create
              default-first-option
            >
              <el-option
                v-for="opt in cityOptions"
                :key="opt.value"
                :label="opt.label"
                :value="opt.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="备注" prop="remark" style="grid-column: 1 / -1">
            <el-input v-model="editFormData.remark" type="textarea" />
          </el-form-item>
        </div>
      </el-form>
      <template #footer>
        <el-button @click="editModalVisible = false">取消</el-button>
        <el-button type="primary" :loading="editLoading" @click="submitEdit">保存</el-button>
      </template>
    </el-dialog>
    <!-- #endregion -->

    <!-- #region 合并弹窗 -->
    <el-dialog v-model="mergeModalVisible" title="中心合并" width="520px">
      <el-form :model="mergeFormData" label-width="120px" class="pt-8px">
        <el-form-item label="中心名称" prop="sourceStandardName">
          <el-input :model-value="mergeFormData.sourceStandardName" disabled />
        </el-form-item>
        <el-form-item label="合并到" prop="targetStandardId">
          <el-select
            v-model="mergeFormData.targetStandardId"
            filterable
            remote
            :remote-method="(keyword: string) => onSearchMerge(keyword)"
            :loading="mergeSearchLoading"
            placeholder="请输入搜索合并到的中心"
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
  </div>
  <!-- #endregion -->
</template>

<script setup lang="ts">
//#region Imports
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import moment from 'moment'
import { hospitalApi } from '@/api'
import type { StandardHospitalDto } from '@/api/types/hospital'
import { createEnumsToOptions } from '@/utils/enums'
import { COUNTRY_LIST, PROVINCE_LIST, CITY_LIST } from '@/utils/address'

defineOptions({ name: 'CenterDatabase' })
//#endregion

//#region Constants
const countryOptions = createEnumsToOptions(COUNTRY_LIST)
const provinceOptions = createEnumsToOptions(PROVINCE_LIST)
const cityOptions = createEnumsToOptions(CITY_LIST)
//#endregion

//#region 搜索配置（MTable 约定：page / rows 由组件内部维护）
const searchConfig = reactive({
  form: {
    hosStandardName: '',
    page: 1,
    rows: 20,
  },
  items: [
    {
      id: 'hosStandardName',
      label: '中心名称（标准名）',
      type: 'input',
      width: 220,
      placeholder: '请输入',
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
    { id: 'hosStandardName', label: '中心名称（标准名）', minWidth: 300, align: 'left' },
    { id: 'country', label: '国家', width: 100, align: 'center' },
    { id: 'province', label: '省份', width: 150, align: 'center' },
    { id: 'city', label: '城市', width: 150, align: 'center' },
    { id: 'cnt', label: '别名', width: 80, align: 'center' },
    { id: 'hosShortName', label: '简称', width: 200, align: 'left' },
    { id: 'updater', label: '操作人', width: 100, align: 'center' },
    {
      id: 'updateTime',
      label: '更新时间',
      width: 170,
      align: 'center',
      formatter: (row: any) =>
        row.updateTime ? moment(row.updateTime).format('YYYY-MM-DD HH:mm:ss') : '-',
    },
    { id: 'operation', type: 'action', label: '操作', width: 170, align: 'center', fixed: 'right' },
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
const currentHospitalId = ref<number>()

// 编辑弹窗
const editModalVisible = ref(false)
const editLoading = ref(false)
const currentEditRecord = ref<StandardHospitalDto | null>(null)

const editFormData = reactive<Record<string, any>>({
  hosStandardName: '',
  hosShortName: '',
  country: '',
  province: '',
  city: '',
  remark: '',
})

// 合并弹窗
const mergeModalVisible = ref(false)
const mergeLoading = ref(false)
const mergeSearchLoading = ref(false)
const mergeOptions = ref<{ label: string; value: number; item: any }[]>([])
const mergeFormData = reactive<Record<string, any>>({
  sourceStandardId: undefined,
  sourceStandardName: '',
  targetStandardId: undefined,
  targetStandardName: '',
})
//#endregion

//#region 数据请求（MTable 分页/搜索统一入口）
const loadList = async () => {
  loading.value = true
  try {
    const { hosStandardName, page = 1, rows = 20 } = searchConfig.form
    const params: Record<string, any> = {
      hosStandardName,
      pageNum: page,
      pageSize: rows,
    }
    const res = await hospitalApi.queryStandardList(params)
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
//#endregion

//#region Source Modal
const fetchSourceData = async (hospitalId: number, curr = 1, size = 10) => {
  sourceLoading.value = true
  try {
    const res = await hospitalApi.queryOriginHospitalList({
      queryId: hospitalId,
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
  currentHospitalId.value = id
  fetchSourceData(id, 1, 10)
  sourceModalVisible.value = true
}

const onSourceSizeChange = (size: number) => {
  sourcePagination.current = 1
  if (currentHospitalId.value) {
    fetchSourceData(currentHospitalId.value, 1, size)
  }
}

const onSourceCurrentChange = (curr: number) => {
  if (currentHospitalId.value) {
    fetchSourceData(currentHospitalId.value, curr, sourcePagination.pageSize)
  }
}

const onSourceModalClose = () => {
  sourceModalVisible.value = false
}
//#endregion

//#region Edit Modal
const openEditModal = (record?: StandardHospitalDto) => {
  if (record) {
    currentEditRecord.value = record
    editFormData.hosStandardName = record.hosStandardName || ''
    editFormData.hosShortName = record.hosShortName || ''
    editFormData.country = record.country || ''
    editFormData.province = record.province || ''
    editFormData.city = record.city || ''
    editFormData.remark = record.remark || ''
    editModalVisible.value = true
  } else {
    currentEditRecord.value = null
    editFormData.hosStandardName = ''
    editFormData.hosShortName = ''
    editFormData.country = ''
    editFormData.province = ''
    editFormData.city = ''
    editFormData.remark = ''
    editModalVisible.value = true
  }
}

const submitEdit = async () => {
  editLoading.value = true
  try {
    const submitData: StandardHospitalDto = {
      ...currentEditRecord.value,
      hosStandardName: editFormData.hosStandardName,
      hosShortName: editFormData.hosShortName,
      country: editFormData.country,
      province: editFormData.province,
      city: editFormData.city,
      remark: editFormData.remark,
    }
    await hospitalApi.saveStandardHospital(submitData)
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
//#endregion

//#region Merge Modal
const onSearchMerge = async (keyword = '') => {
  mergeSearchLoading.value = true
  try {
    const res = await hospitalApi.queryStandardList({
      hosStandardName: keyword,
      pageNum: 1,
      pageSize: 50,
    })
    mergeOptions.value = (res.data?.list || [])
      .filter((item: StandardHospitalDto) => item.id !== mergeFormData.sourceStandardId)
      .map((item: StandardHospitalDto) => ({
        label: item.hosStandardName || '',
        value: item.id as number,
        item,
      }))
  } catch (e) {
    console.error(e)
  } finally {
    mergeSearchLoading.value = false
  }
}

const openMergeModal = (record: StandardHospitalDto) => {
  mergeFormData.sourceStandardId = record.id
  mergeFormData.sourceStandardName = record.hosStandardName || ''
  mergeFormData.targetStandardId = undefined
  mergeFormData.targetStandardName = ''
  mergeOptions.value = []
  mergeModalVisible.value = true
}

const submitMerge = async () => {
  if (!mergeFormData.targetStandardId) {
    ElMessage.warning('请选择合并到的中心')
    return
  }
  const target = mergeOptions.value.find((o) => o.value === mergeFormData.targetStandardId)
  if (!target) return
  mergeLoading.value = true
  try {
    await hospitalApi.standardHospitalMerge({
      sourceStandardId: mergeFormData.sourceStandardId,
      sourceStandardName: mergeFormData.sourceStandardName,
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
.center-database-page {
  padding: 10px;
}
//#endregion
</style>
