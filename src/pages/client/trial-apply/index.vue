<template>
  <!--#region 试用申请页面 -->
  <div class="client-trial-apply-page">
    <!-- #region 主表格区（MTable：搜索 + 表格 + 分页 + 高度自适应） -->
    <MTable
      v-model:tableConfig="tableConfig"
      :search-config="searchConfig"
      :loading="loading"
      title="试用申请"
      @search="onSearch"
    >
      <!-- #region 审批状态列 -->
      <template #approvalStatus="{ row }">
        <el-tag :type="approvalStatusTagType(row.approvalStatus)" effect="light">
          {{ approvalStatusLabel(row.approvalStatus) }}
        </el-tag>
      </template>
      <!-- #endregion -->

      <!-- #region 操作列 -->
      <template #tableRowOperation="{ row }">
        <el-button
          type="primary"
          :disabled="row.approvalStatus !== 1"
          @click="openApprovalModal(row)"
        >
          审核
        </el-button>
      </template>
      <!-- #endregion -->
    </MTable>
    <!-- #endregion -->

    <!-- #region 审批弹窗 -->
    <el-dialog v-model="approvalModalVisible" title="申请审批" width="480px">
      <el-form :model="approvalFormData" label-width="100px" class="pt-8px">
        <el-form-item label="用户姓名">
          <el-input :model-value="approvalFormData.userName" disabled />
        </el-form-item>
        <el-form-item label="审批状态">
          <el-select
            v-model="approvalFormData.approvalStatus"
            placeholder="请选择审批状态"
            class="!w-full"
          >
            <el-option
              v-for="opt in approvalSelectOptions"
              :key="opt.value"
              :label="opt.label"
              :value="opt.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="审批备注">
          <el-input
            v-model="approvalFormData.approvalRemark"
            type="textarea"
            :rows="3"
            placeholder="请输入审批备注"
            :maxlength="200"
            show-word-limit
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="approvalModalVisible = false">取消</el-button>
        <el-button type="primary" :loading="approvalLoading" @click="submitApproval">
          提交
        </el-button>
      </template>
    </el-dialog>
    <!-- #endregion -->
  </div>
  <!--#endregion-->
</template>

<script setup lang="ts">
defineOptions({ name: 'ClientTrialApply' })

// #region 依赖导入
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import moment from 'moment'
import { vipApplicationApi } from '@/api'
import type { VipApplication } from '@/api/types/vipApplication'
// #endregion

// #region 常量配置
// 审批状态：1-待审批 2-审批通过 3-审批不通过
const approvalStatusOptions = [
  { label: '待审批', value: 1 },
  { label: '审批通过', value: 2 },
  { label: '审批不通过', value: 3 },
]

const approvalStatusLabel = (status?: number) =>
  approvalStatusOptions.find((o) => o.value === status)?.label || '-'

const approvalStatusTagType = (
  status?: number,
): 'primary' | 'success' | 'info' | 'warning' | 'danger' => {
  if (status === 1) return 'warning'
  if (status === 2) return 'success'
  if (status === 3) return 'danger'
  return 'info'
}

// 审批弹窗可选状态（排除“待审批”）
const approvalSelectOptions = computed(() => approvalStatusOptions.filter((o) => o.value !== 1))
// #endregion

// #region 搜索配置与状态
const loading = ref(false)

const searchConfig = reactive({
  form: {
    userName: '',
    userPhone: '',
    userCompany: '',
    // 初值为 undefined（不过滤）；MTable 重置会写入 ''，故类型兼容两种空值
    approvalStatus: undefined as number | '' | undefined,
    page: 1,
    rows: 20,
  },
  items: [
    {
      id: 'userName',
      label: '用户名',
      type: 'input',
      width: 200,
      placeholder: '请输入用户名',
    },
    {
      id: 'userPhone',
      label: '手机号',
      type: 'input',
      width: 200,
      placeholder: '请输入手机号',
    },
    {
      id: 'userCompany',
      label: '公司',
      type: 'input',
      width: 200,
      placeholder: '请输入公司',
    },
    {
      id: 'approvalStatus',
      label: '状态',
      type: 'select',
      width: 200,
      placeholder: '请选择状态',
      options: approvalStatusOptions,
    },
  ],
})
// #endregion

// #region 表格列配置
const tableConfig = ref<{ data: VipApplication[]; total: number; columns: Record<string, any>[] }>({
  data: [],
  total: 0,
  columns: [
    {
      type: 'index',
      label: '序号',
      width: 80,
      index: (index: number) =>
        index +
        1 +
        (Number(searchConfig.form.page || 1) - 1) * Number(searchConfig.form.rows || 20),
    },
    { id: 'userName', label: '姓名', width: 120 },
    {
      id: 'userPhone',
      label: '电话',
      width: 140,
      formatter: (row: VipApplication) => row.userPhone || '-',
    },
    {
      id: 'userCompany',
      label: '公司',
      width: 180,
      formatter: (row: VipApplication) => row.userCompany || '-',
    },
    {
      id: 'userPosition',
      label: '职位',
      width: 120,
      formatter: (row: VipApplication) => row.userPosition || '-',
    },
    {
      id: 'applicateDate',
      label: '申请日期',
      width: 170,
      formatter: (row: VipApplication) =>
        row.applicateDate ? moment(row.applicateDate).format('YYYY-MM-DD HH:mm:ss') : '-',
    },
    { id: 'approvalStatus', label: '状态', width: 120 },
    { type: 'action', label: '操作', width: 100, fixed: 'right' },
  ],
})
// #endregion

// #region 数据加载
const loadList = async () => {
  loading.value = true
  try {
    const {
      userName,
      userPhone,
      userCompany,
      approvalStatus,
      page = 1,
      rows = 20,
    } = searchConfig.form
    const res = await vipApplicationApi.getVipApplicationList({
      userName: userName || undefined,
      userPhone: userPhone || undefined,
      userCompany: userCompany || undefined,
      // 清空/重置后为 ''，需归一化为 undefined，避免 Number('') === 0 的误传
      approvalStatus:
        approvalStatus === '' || approvalStatus == null ? undefined : Number(approvalStatus),
      pageNum: page,
      pageSize: rows,
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

// #region 审批弹窗
const approvalModalVisible = ref(false)
const approvalLoading = ref(false)

const approvalFormData = reactive<Record<string, any>>({
  id: undefined,
  userName: '',
  approvalStatus: 2,
  approvalRemark: '',
})

const openApprovalModal = (record: VipApplication) => {
  approvalFormData.id = record.id
  approvalFormData.userName = record.userName || ''
  approvalFormData.approvalStatus = 2
  approvalFormData.approvalRemark = ''
  approvalModalVisible.value = true
}

const submitApproval = async () => {
  approvalLoading.value = true
  try {
    await vipApplicationApi.approval({
      id: approvalFormData.id,
      approvalStatus: Number(approvalFormData.approvalStatus),
      approvalRemark: approvalFormData.approvalRemark || undefined,
    })
    ElMessage.success('审批成功')
    approvalModalVisible.value = false
    loadList()
  } catch (e) {
    console.error(e)
  } finally {
    approvalLoading.value = false
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
.client-trial-apply-page {
  padding: 10px;
}
// #endregion
</style>
