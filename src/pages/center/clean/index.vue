<template>
  <!--#region 研究中心名称清洗页面 -->
  <div class="center-clean-page">
    <!-- #region 主表格区（MTable：搜索 + 表格 + 分页 + 高度自适应） -->
    <MTable
      v-model:tableConfig="tableConfig"
      :search-config="searchConfig"
      :loading="loading"
      title="研究中心名称清洗"
      @search="onSearch"
    >
      <!-- #region 相关备案/登记号列 -->
      <template #cnt="{ row }">
        <el-link type="primary" :underline="false" @click="openAccModal(row.id!)">
          {{ row.cnt || 0 }}
        </el-link>
      </template>
      <!-- #endregion -->

      <!-- #region 清洗状态列（行内切换） -->
      <template #cleanStatus="{ row }">
        <el-select
          :model-value="row.cleanStatus"
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
    <el-dialog v-model="accModalVisible" title="相关备案/登记号" width="600px">
      <el-table :data="accData" v-loading="accLoading" border stripe :max-height="420">
        <el-table-column
          type="index"
          label="序号"
          width="80"
          align="center"
          :index="(idx: number) => idx + 1 + (accPagination.current - 1) * accPagination.pageSize"
        />
        <el-table-column prop="acceptanceNo" label="相关登记号/备案号" align="left" />
      </el-table>
      <div class="flex justify-end mt-16px">
        <el-pagination
          v-model:current-page="accPagination.current"
          v-model:page-size="accPagination.pageSize"
          :page-sizes="[5, 10, 20, 50]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="accPagination.total"
          @size-change="onAccSizeChange"
          @current-change="onAccCurrentChange"
        />
      </div>
    </el-dialog>
    <!-- #endregion -->

    <!-- #region 关联弹窗 -->
    <el-dialog v-model="editModalVisible" title="关联" width="760px" @closed="onEditModalClose">
      <el-form :model="editFormData" label-width="140px">
        <!-- #region 原始名称信息 -->
        <div class="form-info-block mb-16px">
          <p style="margin: 0 0 8px 0">
            <strong>原始名称：</strong>
            {{ currentEditRecord?.hosOriginName }}
          </p>
          <div class="flex gap-10px">
            <span>{{ currentEditRecord?.country || '-' }}</span>
            <span>{{ currentEditRecord?.province || '-' }}</span>
            <span>{{ currentEditRecord?.city || '-' }}</span>
          </div>
        </div>
        <!-- #endregion -->

        <!-- #region 关联标准研究中心 -->
        <div class="form-info-block">
          <el-form-item label="关联标准研究中心：">
            <div class="flex items-center gap-20px w-full">
              <el-select
                v-model="editFormData.hosStandardId"
                filterable
                remote
                clearable
                :remote-method="(kw: string) => onSearchRelation(kw)"
                :loading="searchLoading"
                placeholder="请输入搜索标准研究中心"
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
              <el-button
                type="primary"
                @click="openAddModal(currentEditRecord || ({} as HospitalCleanDto))"
              >
                新增
              </el-button>
            </div>
          </el-form-item>
        </div>
        <!-- #endregion -->

        <!-- #region 标准中心信息 -->
        <div class="form-field-grid">
          <el-form-item label="标准名称">
            <el-input v-model="editFormData.hosStandardName" disabled />
          </el-form-item>
          <el-form-item label="简称">
            <el-input v-model="editFormData.hosShortName" disabled />
          </el-form-item>
          <el-form-item label="国家">
            <el-input v-model="editFormData.country" disabled />
          </el-form-item>
          <el-form-item label="省份">
            <el-input v-model="editFormData.province" disabled />
          </el-form-item>
          <el-form-item label="城市">
            <el-input v-model="editFormData.city" disabled />
          </el-form-item>
          <el-form-item label="清洗状态">
            <el-select
              v-model="editFormData.cleanStatus"
              placeholder="请选择清洗状态"
              clearable
              class="!w-full"
            >
              <el-option
                v-for="opt in statusOptions"
                :key="opt.value"
                :label="opt.label"
                :value="opt.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="备注" class="col-span-2">
            <el-input
              v-model="editFormData.remark"
              type="textarea"
              :rows="3"
              placeholder="请输入备注"
            />
          </el-form-item>
        </div>
        <!-- #endregion -->
      </el-form>
      <template #footer>
        <el-button @click="editModalVisible = false">取消</el-button>
        <el-button type="primary" :loading="editLoading" @click="submitEdit">提交</el-button>
      </template>
    </el-dialog>
    <!-- #endregion -->

    <!-- #region 新增标准名中心弹窗 -->
    <el-dialog v-model="addModalVisible" title="新增标准名中心" width="700px">
      <el-form :model="addFormData" label-width="90px" class="pt-8px">
        <div class="form-field-grid">
          <el-form-item label="标准名称" class="col-span-2">
            <el-input
              v-model="addFormData.hosStandardName"
              placeholder="请输入标准名称"
              clearable
            />
          </el-form-item>
          <el-form-item label="简称">
            <el-input v-model="addFormData.hosShortName" placeholder="请输入简称" clearable />
          </el-form-item>
          <el-form-item label="国家">
            <el-select
              v-model="addFormData.country"
              placeholder="请选择"
              filterable
              allow-create
              default-first-option
              class="!w-full"
            >
              <el-option
                v-for="opt in countryOptions"
                :key="opt.value"
                :label="opt.label"
                :value="opt.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="省份">
            <el-select
              v-model="addFormData.province"
              placeholder="请选择"
              filterable
              allow-create
              default-first-option
              class="!w-full"
            >
              <el-option
                v-for="opt in provinceOptions"
                :key="opt.value"
                :label="opt.label"
                :value="opt.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="城市">
            <el-select
              v-model="addFormData.city"
              placeholder="请选择"
              filterable
              allow-create
              default-first-option
              class="!w-full"
            >
              <el-option
                v-for="opt in cityOptions"
                :key="opt.value"
                :label="opt.label"
                :value="opt.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="备注" class="col-span-2">
            <el-input
              v-model="addFormData.remark"
              type="textarea"
              :rows="3"
              placeholder="请输入备注"
            />
          </el-form-item>
        </div>
      </el-form>
      <template #footer>
        <el-button @click="addModalVisible = false">取消</el-button>
        <el-button type="primary" :loading="addLoading" @click="submitAddStandard">保存</el-button>
      </template>
    </el-dialog>
    <!-- #endregion -->
  </div>
  <!--#endregion-->
</template>

<script setup lang="ts">
defineOptions({ name: 'CenterClean' })

// #region 依赖导入
import { ref, reactive, onMounted, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import moment from 'moment'
import { hospitalApi } from '@/api'
import type { HospitalCleanDto, StandardHospitalDto } from '@/api/types/hospital'
import { COUNTRY_LIST, PROVINCE_LIST, CITY_LIST } from '@/utils/address'
import { createEnumsToOptions } from '@/utils/enums'
// #endregion

// #region 常量配置
// 清洗状态：0-未清洗 1-已清洗 2-不用清洗
const statusOptions = [
  { label: '未清洗', value: 0 },
  { label: '已清洗', value: 1 },
  { label: '不用清洗', value: 2 },
]

const countryOptions = createEnumsToOptions(COUNTRY_LIST)
const provinceOptions = createEnumsToOptions(PROVINCE_LIST)
const cityOptions = createEnumsToOptions(CITY_LIST)
// #endregion

// #region 搜索配置与状态
const loading = ref(false)

const searchConfig = reactive({
  form: {
    hosOriginName: '',
    hosStandardName: '',
    // 默认按“未清洗(0)”查询；MTable 重置会写入 ''，故类型兼容两种空值
    cleanStatus: 0 as number | '',
    page: 1,
    rows: 20,
  },
  items: [
    {
      id: 'hosOriginName',
      label: '中心名称（原名称）',
      type: 'input',
      width: 200,
      placeholder: '请输入关键字',
    },
    {
      id: 'hosStandardName',
      label: '标准名称',
      type: 'input',
      width: 200,
      placeholder: '请输入关键字',
    },
    {
      id: 'cleanStatus',
      label: '清洗状态',
      type: 'select',
      width: 140,
      placeholder: '请选择状态',
      options: statusOptions,
    },
  ],
})
// #endregion

// #region 表格列配置
const tableConfig = ref<{
  data: HospitalCleanDto[]
  total: number
  columns: Record<string, any>[]
}>({
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
    { id: 'hosOriginName', label: '中心名称（原名称）', width: 280, align: 'left' },
    { id: 'cnt', label: '相关备案/登记号', width: 150, align: 'center' },
    { id: 'cleanStatus', label: '清洗状态', width: 130, align: 'center' },
    { id: 'hosStandardName', label: '清洗后', width: 250, align: 'left' },
    { id: 'updater', label: '操作人', width: 100, align: 'center' },
    {
      id: 'updateTime',
      label: '更新时间',
      width: 180,
      align: 'center',
      formatter: (row: HospitalCleanDto) =>
        row.updateTime ? moment(row.updateTime).format('YYYY-MM-DD HH:mm:ss') : '-',
    },
    { type: 'action', label: '操作', width: 100, align: 'center', fixed: 'right' },
  ],
})
// #endregion

// #region 弹窗与表单状态
// 相关备案/登记号弹窗
const accModalVisible = ref(false)
const accData = ref<{ acceptanceNo: string }[]>([])
const accLoading = ref(false)
const accPagination = reactive({
  current: 1,
  pageSize: 5,
  total: 0,
})
const currentHospitalId = ref<number>()

// 关联弹窗
const editModalVisible = ref(false)
const editLoading = ref(false)
const currentEditRecord = ref<HospitalCleanDto | null>(null)
const relationOptions = ref<{ label: string; value: number; item: StandardHospitalDto }[]>([])
const searchLoading = ref(false)

const editFormData = reactive<Record<string, any>>({
  hosStandardId: undefined,
  hosStandardName: '',
  hosShortName: '',
  country: '',
  province: '',
  city: '',
  remark: '',
  cleanStatus: undefined,
})

// 新增标准名中心弹窗
const addModalVisible = ref(false)
const addLoading = ref(false)
const addFormData = reactive<Record<string, any>>({
  hosStandardName: '',
  hosShortName: '',
  country: '',
  province: '',
  city: '',
  remark: '',
})
// #endregion

// #region 数据加载
const loadList = async () => {
  loading.value = true
  try {
    const { hosOriginName, hosStandardName, cleanStatus, page = 1, rows = 20 } = searchConfig.form
    const res = await hospitalApi.pageData({
      hosOriginName: hosOriginName || undefined,
      hosStandardName: hosStandardName || undefined,
      // 空值按“未清洗(0)”处理，保持默认队列语义
      cleanStatus: cleanStatus === '' || cleanStatus == null ? 0 : cleanStatus,
      pageNum: page,
      pageSize: rows,
    })
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

// 清洗状态 select 行内切换
const onCleanStatusChange = async (row: HospitalCleanDto, val: number) => {
  try {
    await hospitalApi.updateCleanStatus({
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
const fetchAcceptanceNos = async (hospitalId: number, curr = 1, size = 5) => {
  accLoading.value = true
  try {
    const res = await hospitalApi.getAcceptanceNos({
      queryId: hospitalId,
      pageNum: curr,
      pageSize: size,
    })
    accData.value = (res.data?.list || []).map((no: string) => ({ acceptanceNo: no }))
    accPagination.current = curr
    accPagination.pageSize = size
    accPagination.total = res.data?.total || 0
  } catch (e) {
    console.error(e)
  } finally {
    accLoading.value = false
  }
}

const openAccModal = (id: number) => {
  currentHospitalId.value = id
  fetchAcceptanceNos(id, 1, 5)
  accModalVisible.value = true
}

const onAccSizeChange = () => {
  if (!currentHospitalId.value) return
  accPagination.current = 1
  fetchAcceptanceNos(currentHospitalId.value, 1, accPagination.pageSize)
}

const onAccCurrentChange = () => {
  if (currentHospitalId.value) {
    fetchAcceptanceNos(currentHospitalId.value, accPagination.current, accPagination.pageSize)
  }
}
// #endregion

// #region 关联弹窗逻辑
const resetEditForm = () => {
  relationOptions.value = []
  editFormData.hosStandardId = undefined
  editFormData.hosStandardName = ''
  editFormData.hosShortName = ''
  editFormData.country = ''
  editFormData.province = ''
  editFormData.city = ''
  editFormData.remark = ''
  editFormData.cleanStatus = undefined
}

const openEditModal = (record: HospitalCleanDto) => {
  resetEditForm()
  currentEditRecord.value = record
  editModalVisible.value = true
  editFormData.hosStandardName = record.hosStandardName || ''
  editFormData.remark = record.remark || ''
  editFormData.cleanStatus = record.cleanStatus

  // 原数据已填写标准名称时，预加载关联下拉选项
  if (record.hosStandardName) {
    nextTick(() => {
      onSearchRelation(record.hosStandardName!)
    })
  }
}

const onSearchRelation = async (keyword: string) => {
  if (!keyword) return
  searchLoading.value = true
  try {
    const res = await hospitalApi.queryStandardList({
      hosStandardName: keyword,
      pageNum: 1,
      pageSize: 50,
    })
    const opts = (res.data?.list || []).map((item: StandardHospitalDto) => ({
      label: item.hosStandardName || '',
      value: item.id as number,
      item,
    }))
    relationOptions.value = opts

    // 如果已有 hosStandardId，自动选中匹配项
    if (editFormData.hosStandardId) {
      const matched = opts.find((o) => o.value === editFormData.hosStandardId)
      if (matched) {
        onRelationChange(matched.value)
      }
    }
  } catch (e) {
    console.error(e)
  } finally {
    searchLoading.value = false
  }
}

const onRelationClear = () => {
  editFormData.hosStandardName = ''
  editFormData.hosShortName = ''
  editFormData.country = ''
  editFormData.province = ''
  editFormData.city = ''
}

const onRelationChange = (val: any) => {
  const opt = relationOptions.value.find((o) => o.value === val)
  if (opt && opt.item) {
    editFormData.hosStandardName = opt.item.hosStandardName || ''
    editFormData.hosShortName = opt.item.hosShortName || ''
    editFormData.country = opt.item.country || ''
    editFormData.province = opt.item.province || ''
    editFormData.city = opt.item.city || ''
  }
}

const openAddModal = (record?: HospitalCleanDto) => {
  addFormData.hosStandardName = record?.hosOriginName || ''
  addFormData.hosShortName = record?.hosOriginName || ''
  addFormData.country = record?.country || ''
  addFormData.province = record?.province || ''
  addFormData.city = record?.city || ''
  addFormData.remark = ''
  addModalVisible.value = true
}

const submitAddStandard = async () => {
  if (!addFormData.hosStandardName?.trim()) {
    ElMessage.warning('请填写标准名称')
    return
  }
  addLoading.value = true
  try {
    const submitData: StandardHospitalDto = {
      hosStandardName: addFormData.hosStandardName,
      hosShortName: addFormData.hosShortName,
      country: addFormData.country,
      province: addFormData.province,
      city: addFormData.city,
      remark: addFormData.remark,
    }
    await hospitalApi.saveStandardHospital(submitData)
    ElMessage.success('新增成功')
    addModalVisible.value = false

    // 刷新关联下拉选项，命中则自动选中新增的标准中心
    await onSearchRelation(addFormData.hosStandardName)
    const matched = relationOptions.value.find(
      (o) => o.item?.hosStandardName === addFormData.hosStandardName,
    )
    if (matched) {
      editFormData.hosStandardId = matched.value
      onRelationChange(matched.value)
    }
  } catch (e) {
    console.error(e)
  } finally {
    addLoading.value = false
  }
}

const submitEdit = async () => {
  if (!currentEditRecord.value) return
  editLoading.value = true
  try {
    const submitData: HospitalCleanDto = {
      ...currentEditRecord.value,
      hosStandardId: editFormData.hosStandardId,
      hosStandardName: editFormData.hosStandardName,
      remark: editFormData.remark,
      cleanStatus: editFormData.cleanStatus ?? 3,
    }
    await hospitalApi.saveClean(submitData)
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

// #region 生命周期
onMounted(() => {
  loadList()
})
// #endregion
</script>

<style scoped lang="scss">
// #region 页面样式
.center-clean-page {
  padding: 10px;
}

// 弹窗内的浅蓝色信息块
.form-info-block {
  background-color: #e6f7ff;
  padding: 16px;
  border-radius: 4px;
}

// 弹窗内两列表单栅格
.form-field-grid {
  margin-top: 16px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0 24px;
  align-items: start;
}
// #endregion
</style>
