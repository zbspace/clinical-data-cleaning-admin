<template>
  <div class="m-table">
    <!-- #region 查询表单 -->
    <div ref="searchCardRef" v-if="searchConfig?.items?.length">
      <el-card class="!border-none shadow-sm mb-10px">
        <el-form
          :inline="true"
          :model="searchConfig.form"
          class="flex flex-wrap gap-10px"
          @keyup.enter="handleSearch"
        >
          <!-- 动态渲染搜索表单项 -->
          <template v-for="item in searchConfig.items" :key="item.id">
            <el-form-item :label="item.label" class="!mb-0 !mr-10px">
              <!-- 输入框 -->
              <el-input
                v-if="item.type === 'input'"
                v-model="searchConfig.form[item.id]"
                :placeholder="item.placeholder || `请输入`"
                clearable
                :style="selectWidthStyle(item)"
                v-bind="item.inputConfig || {}"
              />
              <!-- 下拉选择 -->
              <el-select
                v-else-if="item.type === 'select'"
                v-model="searchConfig.form[item.id]"
                :placeholder="item.placeholder || `请选择`"
                clearable
                :style="selectWidthStyle(item)"
                v-bind="item.selectConfig || {}"
              >
                <el-option
                  v-for="opt in item.options || []"
                  :key="opt.value"
                  :label="opt.label"
                  :value="opt.value"
                />
              </el-select>

              <!-- 日期或日期范围选择 -->
              <template
                v-else-if="['date', 'daterange', 'datetime', 'datetimerange'].includes(item.type)"
              >
                <el-date-picker
                  v-model="searchConfig.form[item.id]"
                  :type="item.type"
                  :start-placeholder="`${`请选择开始时间`}`"
                  :end-placeholder="`${`请选择结束时间`}`"
                  :format="getDateFormat(item.type, item.format)"
                  :value-format="getDateFormat(item.type, item.format)"
                  clearable
                  :placeholder="item.placeholder || `请选择`"
                  :style="selectWidthStyle(item)"
                />
              </template>

              <!-- 开关 -->
              <el-switch
                v-else-if="item.type === 'switch'"
                v-model="searchConfig.form[item.id]"
                :active-value="1"
                :inactive-value="0"
                :style="selectWidthStyle(item)"
                v-bind="item.switchConfig || {}"
              />
            </el-form-item>
          </template>

          <!-- 搜索/重置按钮 -->
          <el-form-item class="!mb-0">
            <el-button type="primary" :icon="Search" @click="handleSearch">搜索</el-button>
            <el-button :icon="Refresh" @click="handleReset">重置</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
    <!-- #endregion -->

    <!-- #region 数据表格区域 -->
    <el-card class="!border-none shadow-sm">
      <!-- 工具栏 -->
      <div
        v-if="title || tableConfig?.total !== undefined"
        class="flex justify-between items-center w-stretch"
      >
        <div class="flex items-center gap-8px min-h-32px mb-16px" v-if="title">
          <span v-if="title" class="text-16px font-bold">{{ title }}</span>
          <span v-if="tableConfig?.total !== undefined" class="text-gray-400 text-14px">
            共 {{ tableConfig.total }} {{ totalUnit }}
          </span>
        </div>
        <div
          v-if="hasTableToolsSlot"
          class="flex items-center gap-8px mb-16px"
          :class="{ 'w-stretch': !title }"
        >
          <slot name="tableTools" />
        </div>
      </div>

      <!-- 表格主体 -->
      <el-table
        ref="tableRef"
        :data="tableConfig?.data || []"
        v-loading="loading"
        border
        stripe
        class="!w-full"
        :max-height="computedMaxHeight"
        @selection-change="onSelectionChange"
        @row-click="onRowClick"
      >
        <!-- 动态渲染列 -->
        <template v-for="col in tableConfig?.columns || []" :key="col.id">
          <template v-if="!col?.show || col.show()">
            <!-- 序号列 -->
            <el-table-column
              v-if="col.type === 'index'"
              type="index"
              :label="col.label || '序号'"
              :width="col.width || 60"
              :align="col.align || 'center'"
              :fixed="col.fixed"
              v-bind="getColumnAttrs(col)"
            />
            <!-- 多选列 -->
            <el-table-column
              v-else-if="col.type === 'selection'"
              type="selection"
              :width="col.width || 50"
              :align="col.align || 'center'"
              v-bind="getColumnAttrs(col)"
            />
            <!-- 操作列 -->
            <el-table-column
              v-else-if="col.type === 'action'"
              :label="col.label || '操作'"
              :width="col.width"
              :fixed="col.fixed || 'right'"
              :align="col.align || 'center'"
              v-bind="getColumnAttrs(col)"
            >
              <template #default="{ row }">
                <slot name="tableRowOperation" :row="row" />
              </template>
            </el-table-column>
            <!-- 自定义内容列（支持命名插槽 / formatter / 纯文本） -->
            <el-table-column
              v-else-if="col.formatter || $slots[col.id]"
              :prop="col.id"
              :label="col.label"
              :width="col.width"
              :min-width="col.minWidth"
              :align="col.align || 'center'"
              :fixed="col.fixed"
              :show-overflow-tooltip="col.showOverflowTooltip !== false"
              v-bind="getColumnAttrs(col)"
            >
              <template #default="{ row }">
                <slot v-if="$slots[col.id]" :name="col.id" :row="row" />
                <RenderVNode v-else :create="() => col.formatter!(row)" />
              </template>
            </el-table-column>
            <!-- 纯文本列 -->
            <el-table-column
              v-else
              :prop="col.id"
              :label="col.label"
              :width="col.width"
              :min-width="col.minWidth || 120"
              :align="col.align || 'center'"
              :fixed="col.fixed"
              :show-overflow-tooltip="col.showOverflowTooltip !== false"
              v-bind="getColumnAttrs(col)"
            />
          </template>
        </template>

        <!-- 空状态 -->
        <template #empty>
          <el-empty :image-size="100" description="暂无数据" />
        </template>
      </el-table>

      <!-- 分页器 -->
      <div v-if="showPagination" class="flex justify-end mt-16px">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="pageSizes"
          :disabled="loading"
          layout="total, sizes, prev, pager, next, jumper"
          :total="tableConfig?.total || 0"
          @size-change="onSizeChange"
          @current-change="onCurrentChange"
        />
      </div>
    </el-card>
    <!-- #endregion -->
  </div>
</template>

<script setup lang="ts">
// #region 依赖导入
import { ref, computed, useSlots, onMounted, onUnmounted } from 'vue'
import { Search, Refresh } from '@element-plus/icons-vue'
import { throttle } from '@/utils/helpers'
// #endregion

// #region VNode 渲染辅助组件（在模板中渲染 h() 返回的 VNode）
// 使用工厂函数而非直接传递 VNode，避免槽函数上下文丢失导致的告警
import { defineComponent } from 'vue'
const RenderVNode = defineComponent({
  props: { create: Function },
  setup(props) {
    return () => {
      if (props.create) return props.create()
      return null
    }
  },
})
// #endregion

// #region 类型定义
interface SearchItem {
  id: string
  label: string
  type: 'input' | 'select'
  placeholder?: string
  /** 表单项宽度（如 160、'200px'） */
  width?: string | number
  options?: { label: string; value: any }[]
  inputConfig?: Record<string, any>
  selectConfig?: Record<string, any>
  switchConfig?: Record<string, any>
  format?: string
}

interface SearchConfig {
  form: Record<string, any>
  items: SearchItem[]
}

interface TableColumn {
  id: string
  label?: string
  type?: 'index' | 'selection' | 'action'
  width?: number | string
  minWidth?: number | string
  align?: 'left' | 'center' | 'right'
  fixed?: 'left' | 'right' | boolean
  showOverflowTooltip?: boolean
  formatter?: (row: any) => any
  [key: string]: any
}

interface TableConfig {
  data?: any[]
  total?: number
  columns?: TableColumn[]
  currentRow?: any
  [key: string]: any
}
// #endregion

// #region Props 定义
interface MTableProps {
  /** 搜索表单配置 */
  searchConfig?: SearchConfig
  /** 加载状态 */
  loading?: boolean
  /** 每页条数选项 */
  pageSizes?: number[]
  /** 是否显示分页器 */
  pagination?: boolean
  /** 表格标题 */
  title?: string
  /** 是否启用动态表格高度自适应 */
  autoHeight?: boolean
  /** 表格底部偏移量（px） */
  heightOffset?: number
  /** 总记录数单位，如"人"、"条" */
  totalUnit?: string
}

const props = withDefaults(defineProps<MTableProps>(), {
  searchConfig: () => ({ form: {}, items: [] }),
  loading: false,
  pageSizes: () => [10, 20, 50, 100],
  pagination: true,
  title: '',
  autoHeight: true,
  heightOffset: 150,
  totalUnit: '条',
})
// #endregion

// #region Emits 与双向绑定
const emit = defineEmits<{
  search: [params?: Record<string, any>]
  'update:tableConfig': [config: TableConfig]
}>()

const tableConfig = defineModel<TableConfig>('tableConfig', {
  default: () => ({ data: [], total: 0, columns: [] }),
})
// #endregion

// #region 分页处理（共享表单对象引用，直接修改 searchConfig.form）
const currentPage = computed({
  get: () => props.searchConfig.form?.page ?? 1,
  set: (val) => {
    if (props.searchConfig.form) {
      props.searchConfig.form.page = val
    }
  },
})

const pageSize = computed({
  get: () => props.searchConfig.form?.rows ?? 20,
  set: (val) => {
    if (props.searchConfig.form) {
      props.searchConfig.form.rows = val
    }
  },
})

const showPagination = computed(() => {
  return props.pagination && tableConfig.value?.total !== undefined
})
// #endregion

// #region 插槽检测
const slots = useSlots()
const hasTableToolsSlot = computed(() => !!slots.tableTools)
// #endregion

// #region 列属性处理（过滤掉自定义属性，只保留 el-table-column 原生属性）
const KNOWN_COLUMN_KEYS = new Set([
  'id',
  'type',
  'formatter',
  'label',
  'width',
  'minWidth',
  'align',
  'fixed',
  'showOverflowTooltip',
])

const getColumnAttrs = (col: TableColumn): Record<string, any> => {
  const attrs: Record<string, any> = {}
  for (const key of Object.keys(col)) {
    if (!KNOWN_COLUMN_KEYS.has(key)) {
      attrs[key] = col[key]
    }
  }
  return attrs
}
// #endregion

// #region 搜索项宽度样式
const toPx = (v?: string | number) => (typeof v === 'number' ? `${v}px` : v)

const selectWidthStyle = (item: SearchItem): Record<string, string> => {
  const width = toPx(item.width)
  // 未配置宽度时使用固定默认值（'100%' 在自适应容器中无参照，会导致各组件宽度不一致）
  const finalWidth = width || '180px'
  return {
    width: finalWidth,
    minWidth: finalWidth,
    '--el-select-width': finalWidth,
  }
}
// #endregion

// #region 搜索与重置
const handleSearch = () => {
  if (props.searchConfig.form) {
    props.searchConfig.form.page = 1
  }
  emit('search', props.searchConfig.form)
}

const handleReset = () => {
  const form = props.searchConfig.form
  if (form) {
    // 重置所有字段为空字符串
    for (const key of Object.keys(form)) {
      if (key !== 'page' && key !== 'rows') {
        form[key] = ''
      }
    }
    form.page = 1
  }
  emit('search', props.searchConfig.form)
}

const getDateFormat = (type: string, format?: string) => {
  let str = ''
  if (['date', 'daterange'].includes(type)) {
    str = 'YYYY-MM-DD'
  } else if (['datetime', 'datetimerange'].includes(type)) {
    str = 'YYYY-MM-DD HH:mm:ss'
  }
  return format || str
}
// #endregion

// #region 分页事件
const onSizeChange = (val: number) => {
  if (props.searchConfig.form) {
    props.searchConfig.form.rows = val
    props.searchConfig.form.page = 1
  }
  emit('search', props.searchConfig.form)
}

const onCurrentChange = (val: number) => {
  if (props.searchConfig.form) {
    props.searchConfig.form.page = val
  }
  emit('search', props.searchConfig.form)
}
// #endregion

// #region 表格事件
const onSelectionChange = (selection: any[]) => {
  if (tableConfig.value) {
    // 保存完整选中列表，供批量操作使用
    tableConfig.value.selectedRows = selection
    tableConfig.value.currentRow = selection?.[0] ?? null
  }
}

const onRowClick = (row: any) => {
  if (tableConfig.value) {
    tableConfig.value.currentRow = row
  }
}
// #endregion

// #region 动态表格高度
const searchCardRef = ref<HTMLDivElement>()
const computedMaxHeight = ref<string | undefined>(undefined)

const updateTableHeight = () => {
  if (!props.autoHeight) {
    computedMaxHeight.value = undefined
    return
  }
  const card = searchCardRef.value
  if (!card) {
    computedMaxHeight.value = `calc(100vh - ${props.heightOffset + 80}px)`
    return
  }
  const rect = card.getBoundingClientRect()
  const availableHeight = window.innerHeight - rect.bottom - props.heightOffset
  computedMaxHeight.value = `${Math.max(200, Math.floor(availableHeight))}px`
}
// #endregion

// #region 生命周期
let throttledResize: any
let observer: ResizeObserver | null = null

onMounted(() => {
  if (props.autoHeight) {
    updateTableHeight()
    throttledResize = throttle(updateTableHeight, 300)
    window.addEventListener('resize', throttledResize)
    const card = searchCardRef.value
    if (card) {
      observer = new ResizeObserver(updateTableHeight)
      observer.observe(card)
    }
  }
})

onUnmounted(() => {
  if (throttledResize) {
    window.removeEventListener('resize', throttledResize)
  }
  if (observer) {
    observer.disconnect()
    observer = null
  }
})
// #endregion
</script>

<style scoped lang="scss">
.m-table {
  :deep(.el-card__body) {
    padding: var(--el-card-padding);
  }

  // 表头背景色与文字颜色
  :deep(.el-table th.el-table__cell) {
    background: var(--el-fill-color-light);
  }
}
</style>
