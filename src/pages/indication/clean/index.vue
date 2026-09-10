<template>
  <!-- #region 适应症名称清洗页面 -->
  <div class="indication-clean-page">
    <!-- #region 主表格区（MTable：搜索 + 表格 + 分页 + 高度自适应） -->
    <MTable
      v-model:tableConfig="tableConfig"
      :search-config="searchConfig"
      :loading="loading"
      title="适应症名称清洗"
      @search="onSearch"
    >
      <!-- #region 相关受理号/备案号列 -->
      <template #statisticCount="{ row }">
        <el-link type="primary" underline="never" @click="openAccModal(row)">
          {{ row.statisticCount || 0 }}
        </el-link>
      </template>
      <!-- #endregion -->

      <!-- #region 状态列（行内切换） -->
      <template #status="{ row }">
        <el-select
          :model-value="row.status"
          style="width: 110px"
          @change="(val: number) => onCleanStatusChange(row, val)"
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
        <el-button type="primary" @click="openEditModal(row)">编辑</el-button>
      </template>
      <!-- #endregion -->
    </MTable>
    <!-- #endregion -->

    <!-- #region 相关受理号/备案号弹窗 -->
    <el-dialog
      v-model="accModalVisible"
      title="相关受理号/备案号"
      width="600px"
      @closed="onAccModalClose"
    >
      <el-table :data="accData" v-loading="accLoading" border stripe :max-height="420">
        <el-table-column
          type="index"
          label="序号"
          width="80"
          align="center"
          :index="(idx: number) => idx + 1"
        />
        <el-table-column prop="acceptanceNo" label="相关受理号/备案号" align="center" />
        <el-table-column prop="sourceRef" label="来源" width="100" align="center" />
        <template #empty>
          <el-empty :image-size="80" description="暂无数据" />
        </template>
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

    <!-- #region 编辑弹窗 -->
    <el-dialog v-model="editModalVisible" title="编辑" width="800px" @closed="onEditModalClose">
      <!-- #region 适应症（源数据） -->
      <div class="edit-source-block">
        <div class="flex gap-8px mb-8px">
          <div class="edit-source-bar"></div>
          <div class="font-bold">适应症（源数据）：</div>
        </div>
        <el-input
          :model-value="currentEditRecord?.indicationComment ?? ''"
          type="textarea"
          :autosize="{ minRows: 2, maxRows: 6 }"
          placeholder="请输入适应症（源数据）"
          @update:model-value="
            (val: string) => {
              if (currentEditRecord) currentEditRecord.indicationComment = val
            }
          "
        />
      </div>
      <!-- #endregion -->

      <!-- #region 适应症（清洗后） -->
      <div class="edit-source-block mt-16px">
        <div class="flex gap-8px mb-16px">
          <div class="edit-source-bar"></div>
          <div class="font-bold">适应症（清洗后）：</div>
        </div>
        <!-- #region 编辑列表 -->
        <div class="mb-8px">
          <el-button type="primary" plain @click="addEditRow">+ 新增</el-button>
        </div>
        <div class="edit-row edit-row-header">
          <div style="width: 40px; text-align: center; flex-shrink: 0">序号</div>
          <div style="flex: 1; min-width: 0">适应症归类</div>
          <div style="flex: 2; min-width: 0">人工审核清洗后数据</div>
          <div style="width: 56px; flex-shrink: 0"></div>
        </div>
        <div
          v-for="(item, index) in currentEditRecord?.indicationTagDtoList || []"
          :key="index"
          class="edit-row"
        >
          <div style="width: 40px; text-align: center; font-weight: 500; flex-shrink: 0">
            {{ index + 1 }}
          </div>
          <div style="flex: 1; min-width: 0">
            <el-select
              v-model="item.indicationCategoryId"
              placeholder="请选择适应症归类"
              clearable
              style="width: 100%"
            >
              <el-option
                v-for="opt in categoryOptions"
                :key="opt.id"
                :label="opt.categoryName"
                :value="opt.id"
              />
            </el-select>
          </div>
          <div style="flex: 2; min-width: 0">
            <el-select
              v-model="item.indicationTagId"
              placeholder="请选择清洗后数据"
              clearable
              filterable
              style="width: 100%"
            >
              <el-option
                v-for="opt in dictOptions"
                :key="opt.indicationTagId"
                :label="opt.indicationStandard"
                :value="opt.indicationTagId"
              />
            </el-select>
          </div>
          <el-button type="danger" link style="flex-shrink: 0" @click="removeEditRow(index)">
            删除
          </el-button>
        </div>
        <!-- #endregion -->
      </div>
      <!-- #endregion -->

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
defineOptions({ name: 'IndicationClean' })

// #region Imports
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import moment from 'moment'
import { indicationApi } from '@/api'
import type {
  IndicationDto,
  IndicationDetailDto,
  IndicationCategory,
  IndicationDictDto,
  IndicationRelDto,
} from '@/api/types/indication'
// #endregion

// #region Constants
const statusOptions = [
  { label: '未清洗', value: 0 },
  { label: '已清洗', value: 1 },
  { label: '不用清洗', value: 2 },
]
// #endregion

// #region 搜索配置与状态
const loading = ref(false)

const searchConfig = reactive({
  form: {
    indicationComment: '',
    // 默认按“未清洗(0)”查询；MTable 重置会写入 ''，故类型兼容两种空值
    status: 0 as number | '',
    page: 1,
    rows: 20,
  },
  items: [
    {
      id: 'indicationComment',
      label: '适应症(源数据)',
      type: 'input',
      width: 220,
      placeholder: '请输入关键字',
    },
    {
      id: 'status',
      label: '清洗状态',
      type: 'select',
      width: 220,
      placeholder: '请选择',
      options: statusOptions,
    },
  ],
})
// #endregion

// #region 表格列配置
const tableConfig = ref<{
  data: IndicationDto[]
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
    },
    {
      id: 'indicationComment',
      label: '适应症(源数据)',
      minWidth: 300,
      align: 'left',
      formatter: (row: any) => row.indicationComment || '-',
    },
    { id: 'statisticCount', label: '相关受理号/备案号', width: 150, align: 'center' },
    { id: 'status', label: '状态', width: 140, align: 'center' },
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
      width: 200,
      align: 'center',
      formatter: (row: any) =>
        row.updateTime ? moment(row.updateTime).format('YYYY-MM-DD HH:mm:ss') : '-',
    },
    { id: 'operation', type: 'action', label: '操作', width: 100, align: 'center', fixed: 'right' },
  ],
})
// #endregion

// #region 弹窗与表单状态
// 备案号弹窗
const accModalVisible = ref(false)
const accLoading = ref(false)
const accData = ref<IndicationRelDto[]>([])
const accPagination = reactive({
  current: 1,
  pageSize: 5,
  total: 0,
})
const currentIndicationId = ref<number | null>(null)

// 编辑弹窗
const editModalVisible = ref(false)
const editLoading = ref(false)
const currentEditRecord = ref<IndicationDetailDto | null>(null)

// 编辑弹窗下拉选项
const categoryOptions = ref<IndicationCategory[]>([])
const dictOptions = ref<IndicationDictDto[]>([])
// #endregion

// #region 数据加载
const loadList = async () => {
  loading.value = true
  try {
    const { indicationComment, status, page = 1, rows = 20 } = searchConfig.form
    const params: Record<string, any> = {
      indicationComment: indicationComment || '',
      // 空值按“未清洗(0)”处理，保持默认队列语义
      status: status === '' || status == null ? 0 : Number(status),
      pageNum: page,
      pageSize: rows,
    }
    const res = await indicationApi.pageData(params)
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

// #region 清洗状态 select 切换
const onCleanStatusChange = async (row: any, val: number) => {
  if (val === row.cleanStatus) return
  try {
    await indicationApi.updateCleanStatus({
      id: row.indicationCommentId!,
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

// #region 相关受理号/备案号弹窗
const fetchAcceptanceNos = async (id: number, curr = 1, size = 5) => {
  accLoading.value = true
  try {
    const res = await indicationApi.getAcceptanceNos({
      id,
      pageNum: curr,
      pageSize: size,
    })
    accData.value = res.data?.list || []
    accPagination.current = curr
    accPagination.pageSize = size
    accPagination.total = res.data?.total || 0
  } catch (e) {
    console.error(e)
  } finally {
    accLoading.value = false
  }
}

const openAccModal = (record: IndicationDto) => {
  if (!record.indicationCommentId) return
  currentIndicationId.value = record.indicationCommentId
  fetchAcceptanceNos(record.indicationCommentId, 1, 5)
  accModalVisible.value = true
}

const onAccSizeChange = () => {
  if (!currentIndicationId.value) return
  accPagination.current = 1
  fetchAcceptanceNos(currentIndicationId.value, 1, accPagination.pageSize)
}

const onAccCurrentChange = () => {
  if (currentIndicationId.value) {
    fetchAcceptanceNos(currentIndicationId.value, accPagination.current, accPagination.pageSize)
  }
}

const onAccModalClose = () => {
  accModalVisible.value = false
}
// #endregion

// #region 编辑弹窗
const openEditModal = (record: IndicationDto) => {
  if (!record.indicationCommentId) return
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
  }
  editModalVisible.value = true
}

const addEditRow = () => {
  if (!currentEditRecord.value) return
  if (!currentEditRecord.value.indicationTagDtoList) {
    currentEditRecord.value.indicationTagDtoList = []
  }
  currentEditRecord.value.indicationTagDtoList.push({
    id: undefined,
    indicationTagId: undefined,
    indicationCategoryId: undefined,
    indicationStandard: '',
  })
}

const removeEditRow = (index: number) => {
  if (!currentEditRecord.value?.indicationTagDtoList) return
  currentEditRecord.value.indicationTagDtoList.splice(index, 1)
}

const submitEdit = async () => {
  if (!currentEditRecord.value) return
  editLoading.value = true
  try {
    // 提交前移除 indicationStandard，后端需要的是 indicationTagId
    const submitData = JSON.parse(JSON.stringify(currentEditRecord.value))
    if (submitData.indicationTagDtoList) {
      submitData.indicationTagDtoList = submitData.indicationTagDtoList.map(
        ({ indicationStandard, ...rest }: any) => rest,
      )
    }
    await indicationApi.saveIndication(submitData)
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
onMounted(async () => {
  // 获取分类下拉选项
  try {
    const catRes = await indicationApi.categoryPageData({ pageNum: 1, pageSize: 1000 })
    categoryOptions.value = catRes.data?.list || []
  } catch (e) {
    console.error(e)
  }
  // 获取清洗后数据字典选项
  try {
    const dictRes = await indicationApi.dictPageData({ pageNum: 1, pageSize: 1000 })
    dictOptions.value = dictRes.data?.list || []
  } catch (e) {
    console.error(e)
  }
  loadList()
})
// #endregion
</script>

<style scoped lang="scss">
// #region 页面样式
.indication-clean-page {
  padding: 10px;
}

// 弹窗内的浅蓝色信息块
.edit-source-block {
  background-color: #e6f7ff;
  padding: 16px;
  border-radius: 4px;
}

// 信息块标题前的品牌色竖条
.edit-source-bar {
  width: 4px;
  height: 16px;
  background: var(--el-color-primary);
  border-radius: 2px;
  margin-top: 4px;
}

// 编辑列表行
.edit-row {
  display: flex;
  gap: 8px;
  align-items: center;
  margin-bottom: 8px;
  background: #fff;
  padding: 8px 12px;
  border-radius: 4px;
}

// 编辑列表表头
.edit-row-header {
  margin-bottom: 4px;
  padding: 4px 12px;
  font-size: 12px;
  color: #999;
  background: transparent;
}
// #endregion
</style>
