<template>
  <!--#region 用户管理页面 -->
  <div class="client-user-page">
    <!--#region 主表格区（MTable：搜索 + 表格 + 分页 + 高度自适应） -->
    <MTable
      v-model:tableConfig="tableConfig"
      :search-config="searchConfig"
      :loading="loading"
      title="用户管理"
      @search="onSearch"
    >
      <!--#region 操作列 -->
      <template #tableRowOperation="{ row }">
        <el-button type="primary" @click="openEditModal(row)">编辑</el-button>
      </template>
      <!--#endregion-->
    </MTable>
    <!--#endregion-->

    <!--#region VIP信息编辑弹窗 -->
    <el-dialog v-model="editModalVisible" title="VIP信息编辑" width="520px">
      <el-form :model="editFormData" label-width="120px" class="pt-8px">
        <el-form-item label="用户类型">
          <el-select v-model="editFormData.vipCode" placeholder="请选择用户类型" class="!w-full">
            <el-option
              v-for="opt in vipCodeOptions"
              :key="opt.value"
              :label="opt.label"
              :value="opt.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="会员开始时间">
          <el-date-picker
            v-model="editFormData.vipBeginTime"
            type="datetime"
            format="YYYY-MM-DD HH:mm:ss"
            value-format="YYYY-MM-DD HH:mm:ss"
            placeholder="请选择会员开始时间"
            clearable
            class="!w-full"
          />
        </el-form-item>
        <el-form-item label="会员结束时间">
          <el-date-picker
            v-model="editFormData.vipEndTime"
            type="datetime"
            format="YYYY-MM-DD HH:mm:ss"
            value-format="YYYY-MM-DD HH:mm:ss"
            placeholder="请选择会员结束时间"
            clearable
            class="!w-full"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="editModalVisible = false">取消</el-button>
        <el-button type="primary" :loading="editLoading" @click="submitEdit">保存</el-button>
      </template>
    </el-dialog>
    <!--#endregion-->
  </div>
  <!--#endregion-->
</template>

<script setup lang="ts">
defineOptions({ name: 'ClientUser' })

//#region Imports
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import moment from 'moment'
import { wxUserApi } from '@/api'
import type { WxUserDto } from '@/api/types/wxUser'
//#endregion

//#region Constants
// 会员编码：0-普通用户 1-VIP试用 100-VIP用户
const vipCodeOptions = [
  { label: '普通用户', value: 0 },
  { label: 'VIP试用', value: 1 },
  { label: 'VIP用户', value: 100 },
]
//#endregion

//#region 搜索配置与状态（page / rows 由 MTable 内部维护）
const loading = ref(false)

const searchConfig = reactive({
  form: {
    username: '',
    phone: '',
    // 初值为 undefined（不过滤）；MTable 重置会写入 ''，故类型兼容两种空值
    vipCode: undefined as number | '' | undefined,
    page: 1,
    rows: 20,
  },
  items: [
    {
      id: 'username',
      label: '用户名',
      type: 'input',
      width: 140,
      placeholder: '请输入',
    },
    {
      id: 'phone',
      label: '手机号',
      type: 'input',
      width: 140,
      placeholder: '请输入',
    },
    {
      id: 'vipCode',
      label: '用户类型',
      type: 'select',
      width: 140,
      placeholder: '请选择',
      options: vipCodeOptions,
    },
  ],
})
//#endregion

//#region 表格配置
const tableConfig = ref<{ data: WxUserDto[]; total: number; columns: Record<string, any>[] }>({
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
    { id: 'username', label: '用户名', minWidth: 260 },
    {
      id: 'phone',
      label: '手机号',
      minWidth: 140,
      formatter: (row: WxUserDto) => row.phone || '-',
    },
    {
      id: 'createTime',
      label: '首次登录时间',
      width: 170,
      formatter: (row: WxUserDto) =>
        row.createTime ? moment(row.createTime).format('YYYY-MM-DD HH:mm:ss') : '-',
    },
    {
      id: 'vipDesc',
      label: '用户类型',
      minWidth: 120,
      formatter: (row: WxUserDto) => row.vipDesc || '-',
    },
    {
      id: 'vipEndTime',
      label: '到期时间',
      minWidth: 170,
      formatter: (row: WxUserDto) =>
        row.vipEndTime ? moment(row.vipEndTime).format('YYYY-MM-DD HH:mm:ss') : '-',
    },
    {
      id: 'operation',
      type: 'action',
      label: '操作',
      width: 100,
      fixed: 'right',
    },
  ],
})
//#endregion

//#region 编辑弹窗状态
const editModalVisible = ref(false)
const editLoading = ref(false)

const editFormData = reactive<Record<string, any>>({
  id: undefined,
  vipCode: 0,
  vipBeginTime: '',
  vipEndTime: '',
})
//#endregion

//#region 数据加载（MTable 搜索/重置/翻页统一入口）
const loadList = async () => {
  loading.value = true
  try {
    const { username, phone, vipCode, page = 1, rows = 20 } = searchConfig.form
    const res = await wxUserApi.pageData({
      username: username || undefined,
      phone: phone || undefined,
      // 清空/重置后为 ''，需归一化为 undefined，避免 Number('') === 0 的误传
      vipCode: vipCode === '' || vipCode == null ? undefined : Number(vipCode),
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

const onSearch = () => {
  loadList()
}
//#endregion

//#region 编辑弹窗
const openEditModal = (record: WxUserDto) => {
  editFormData.id = record.id
  // 响应无 vipCode 字段，根据是否存在到期时间推断用户类型
  editFormData.vipCode = record.vipCode
  editFormData.vipBeginTime = record.vipBeginTime
    ? moment(record.vipBeginTime).format('YYYY-MM-DD HH:mm:ss')
    : ''
  editFormData.vipEndTime = record.vipEndTime
    ? moment(record.vipEndTime).format('YYYY-MM-DD HH:mm:ss')
    : ''
  editModalVisible.value = true
}

const submitEdit = async () => {
  editLoading.value = true
  try {
    await wxUserApi.editUserVIP({
      id: editFormData.id,
      vipCode: Number(editFormData.vipCode),
      vipBeginTime: editFormData.vipBeginTime || undefined,
      vipEndTime: editFormData.vipEndTime || undefined,
    })
    ElMessage.success('保存成功')
    editModalVisible.value = false
    loadList()
  } catch (e) {
    console.error(e)
  } finally {
    editLoading.value = false
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
.client-user-page {
  padding: 10px;
}
//#endregion
</style>
