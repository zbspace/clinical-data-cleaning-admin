import React, { useState, useEffect, useRef } from 'react';
import { Table, Button, Space, Input, Select, Form, Dialog, MessagePlugin, Card, Textarea } from 'tdesign-react';
import moment from 'moment';
import { companyApi } from '../../api';
import type { CleanCompanyDto, CompanyQueryParam, CompanyShortDto } from '../../api';

const statusOptions = [
  { label: '全部', value: 0 },
  { label: '自动清洗', value: 1 },
  { label: '暂未匹配上', value: 2 },
  { label: '手动清洗', value: 3 },
  { label: '不需要清洗', value: 4 },
];

const companyTypeOptions = [
  { label: '药企', value: '药企' },
  { label: 'CRO', value: 'CRO' },
  { label: '机构', value: '机构' },
];

const CompanyClean: React.FC = () => {
  const [form] = Form.useForm();
  const isFirstRender = useRef(true);

  // Table state
  const [data, setData] = useState<CleanCompanyDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });

  // Fetch Data
  const fetchData = async (curr = pagination.current, size = pagination.pageSize) => {
    setLoading(true);
    try {
      const values = form.getFieldsValue(true);
      const params: CompanyQueryParam = {
        ...values,
        pageNum: curr,
        pageSize: size,
      };
      if (params.status === 0) delete params.status;

      const res = await companyApi.pageData(params);
      setData(res.data?.list || []);
      setPagination({ current: curr, pageSize: size, total: res.data?.total || 0 });
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      fetchData();
    }
  }, []);

  const onSearch = () => fetchData(1);

  const onReset = () => {
    form.reset();
    fetchData(1);
  };

  // ----- 备案号 Modal -----
  const [accModalVisible, setAccModalVisible] = useState(false);
  const [accData, setAccData] = useState<{ acceptanceNo: string }[]>([]);
  const [accLoading, setAccLoading] = useState(false);
  const [accPagination, setAccPagination] = useState({ current: 1, pageSize: 5, total: 0 });
  const [currentCompanyId, setCurrentCompanyId] = useState<number>();

  const fetchAcceptanceNos = async (companyId: number, curr = 1, size = 5) => {
    setAccLoading(true);
    try {
      const res = await companyApi.getAcceptanceNos({ queryId: companyId, pageNum: curr, pageSize: size });
      const mappedList = (res.data?.list || []).map((no) => ({ acceptanceNo: no }));
      setAccData(mappedList);
      setAccPagination({ current: curr, pageSize: size, total: res.data?.total || 0 });
    } catch (e) {
      console.error(e);
    } finally {
      setAccLoading(false);
    }
  };

  const openAccModal = (id: number) => {
    setCurrentCompanyId(id);
    fetchAcceptanceNos(id, 1, 5);
    setAccModalVisible(true);
  };

  // ----- 编辑 Modal -----
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editForm] = Form.useForm();
  const [editLoading, setEditLoading] = useState(false);
  const [currentEditRecord, setCurrentEditRecord] = useState<CleanCompanyDto | null>(null);

  // 关联搜索
  const [relationOptions, setRelationOptions] = useState<{ label: string; value: number; item: CompanyShortDto }[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);

  const onSearchRelation = async (keyword: string) => {
    if (!keyword) return;
    setSearchLoading(true);
    try {
      const res = await companyApi.queryByName({ searchKey: keyword, pageNum: 1, pageSize: 50 });
      const opts = (res.data?.list || []).map((item) => ({
        label: item.companyStandardName || item.companyShortName || '',
        value: item.id as number,
        item,
      }));
      setRelationOptions(opts);
    } catch (e) {
      console.error(e);
    } finally {
      setSearchLoading(false);
    }
  };

  const openEditModal = (record: CleanCompanyDto) => {
    setCurrentEditRecord(record);
    editForm.reset();
    setRelationOptions([]);
    editForm.setFieldsValue({
      relationId: record.standardId,
      companyStandardName: record.companyStandardName,
      companyShortName: record.companyShortName,
      companyType: record.companyType,
      parentCompanyShortName: record.parentCompanyShortName,
      remark: record.remark,
    });
    setEditModalVisible(true);
  };

  const onRelationChange = (val: any) => {
    const opt = relationOptions.find((o) => o.value === val);
    if (opt && opt.item) {
      editForm.setFieldsValue({
        companyStandardName: opt.item.companyStandardName,
        companyShortName: opt.item.companyShortName,
        companyType: opt.item.companyType,
        parentCompanyShortName: opt.item.parentCompanyShortName,
      });
    }
  };

  const submitEdit = async () => {
    if (!currentEditRecord) return;
    try {
      const values = await editForm.validate();
      if (values === true) {
        setEditLoading(true);
        const fields = editForm.getFieldsValue(true);
        const submitData: CleanCompanyDto = {
          ...currentEditRecord,
          standardId: fields.relationId,
          companyStandardName: fields.companyStandardName,
          companyShortName: fields.companyShortName,
          companyType: fields.companyType,
          parentCompanyShortName: fields.parentCompanyShortName,
          remark: fields.remark,
          status: 3, // 标记为手动清洗
        };
        await companyApi.saveClean(submitData);
        MessagePlugin.success('保存成功');
        setEditModalVisible(false);
        fetchData();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setEditLoading(false);
    }
  };

  const columns = [
    {
      colKey: 'rowIndex',
      title: '序号',
      width: 80,
      cell: ({ rowIndex }: any) => rowIndex + 1 + (pagination.current - 1) * pagination.pageSize,
    },
    { colKey: 'companyOriginName', title: '公司名(源数据)', width: 220 },
    {
      colKey: 'cnt',
      title: '相关备案/登记号',
      width: 160,
      align: 'center' as const,
      cell: ({ row }: any) => (
        <span
          style={{ color: '#0052d9', cursor: 'pointer', textDecoration: 'underline' }}
          onClick={() => openAccModal(row.id!)}
        >
          {row.cnt || 0}
        </span>
      ),
    },
    {
      colKey: 'status',
      title: '清洗状态',
      width: 120,
      cell: ({ row }: any) => {
        const statusItem = statusOptions.find((opt) => opt.value === row.status);
        return statusItem ? statusItem.label : '-';
      },
    },
    { colKey: 'companyStandardName', title: '清洗后公司名称(标准名)', width: 250 },
    { colKey: 'companyType', title: '公司类型', width: 100 },
    { colKey: 'companyShortName', title: '公司简称', width: 150 },
    { colKey: 'parentCompanyShortName', title: '母公司简称', width: 150 },
    {
      colKey: 'operation',
      title: '操作',
      width: 100,
      fixed: 'right' as const,
      cell: ({ row }: any) => (
        <Button theme="primary" variant="text" onClick={() => openEditModal(row)}>
          编辑
        </Button>
      ),
    },
    { colKey: 'updater', title: '操作人', width: 100 },
    {
      colKey: 'updateTime',
      title: '更新时间',
      width: 180,
      cell: ({ row }: any) => (row.updateTime ? moment(row.updateTime).format('YYYY-MM-DD HH:mm:ss') : '-'),
    },
  ];

  const accColumns = [
    {
      colKey: 'rowIndex',
      title: '序号',
      width: 80,
      cell: ({ rowIndex }: any) => rowIndex + 1 + (accPagination.current - 1) * accPagination.pageSize,
    },
    { colKey: 'acceptanceNo', title: '相关登记号/备案号' },
  ];

  return (
    <Card bordered={false} style={{  height: 'calc(100vh - 86px)' }}>
      <div style={{ marginBottom: 16 }}>
        <h2 style={{ margin: '0 0 16px 0', fontSize: '18px', fontWeight: 600, color: 'var(--td-text-color-primary)' }}>
          公司名清洗
        </h2>
        <div
          style={{
            background: '#f8fafc',
            padding: '16px',
            borderRadius: '12px',
            border: '1px solid var(--td-border-level-1-color)',
          }}
        >
          <Form
            form={form}
            layout="inline"
            labelWidth={140}
            style={{ display: 'flex', gap: '16px 0', flexWrap: 'wrap' }}
          >
            <Form.FormItem label="公司名(标准名)" name="companyName" style={{ marginBottom: 0 }}>
              <Input placeholder="请输入关键字" clearable style={{ width: 220 }} />
            </Form.FormItem>
            <Form.FormItem label="母公司简称" name="parentCompanyShortName" style={{ marginBottom: 0 }}>
              <Input placeholder="请输入关键字" clearable style={{ width: 220 }} />
            </Form.FormItem>
            <Form.FormItem label="公司类型" name="companyType" style={{ marginBottom: 0 }}>
              <Select options={companyTypeOptions} placeholder="请选择公司类型" clearable style={{ width: 220 }} />
            </Form.FormItem>
            <Form.FormItem label="清洗状态" name="status" initialData={0} style={{ marginBottom: 0 }}>
              <Select options={statusOptions} placeholder="请选择状态" clearable style={{ width: 220 }} />
            </Form.FormItem>
            <div style={{ display: 'flex', alignItems: 'center', marginLeft: 'auto' }}>
              <Space>
                <Button theme="default" onClick={onReset} style={{ background: '#fff' }}>
                  重置条件
                </Button>
                <Button theme="primary" onClick={onSearch}>
                  立即查询
                </Button>
              </Space>
            </div>
          </Form>
        </div>
      </div>

      <Table
        data={data}
        columns={columns}
        rowKey="id"
        loading={loading}
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: pagination.total,
          showJumper: true,
          onChange: (pageInfo) => fetchData(pageInfo.current, pageInfo.pageSize),
        }}
        bordered
        stripe
        tableLayout="auto"
      />

      {/* 备案号弹窗 */}
      <Dialog
        header="相关备案/登记号"
        visible={accModalVisible}
        onClose={() => setAccModalVisible(false)}
        footer={null}
        width={600}
      >
        <Table
          data={accData}
          columns={accColumns}
          rowKey="acceptanceNo"
          loading={accLoading}
          pagination={{
            current: accPagination.current,
            pageSize: accPagination.pageSize,
            total: accPagination.total,
            onChange: (pageInfo) => fetchAcceptanceNos(currentCompanyId!, pageInfo.current, pageInfo.pageSize),
          }}
          bordered
          stripe
        />
      </Dialog>

      {/* 编辑弹窗 */}
      <Dialog
        header="编辑"
        visible={editModalVisible}
        onClose={() => setEditModalVisible(false)}
        onConfirm={submitEdit}
        confirmBtn={{ content: '提交', theme: 'primary', loading: editLoading }}
        width={600}
      >
        <Form form={editForm} labelWidth={140} labelAlign="left">
          <div style={{ backgroundColor: '#e6f7ff', padding: '16px', borderRadius: 4, marginBottom: 16 }}>
            <Form.FormItem label="关联：" name="relationId" style={{ marginBottom: 0 }}>
              <Select
                filterable
                onSearch={onSearchRelation}
                loading={searchLoading}
                options={relationOptions}
                onChange={onRelationChange}
                placeholder="请输入搜索标准公司"
              />
            </Form.FormItem>
          </div>
          <div style={{ backgroundColor: '#e6f7ff', padding: '16px', borderRadius: 4 }}>
            <div style={{ fontWeight: 'bold', marginBottom: 16 }}>新增：</div>
            <Form.FormItem label="公司名(标准名称)" name="companyStandardName">
              <Input />
            </Form.FormItem>
            <Form.FormItem label="公司简称" name="companyShortName">
              <Input />
            </Form.FormItem>
            <Form.FormItem label="公司类型" name="companyType">
              <Input />
            </Form.FormItem>
            <Form.FormItem label="母公司简称" name="parentCompanyShortName">
              <Input />
            </Form.FormItem>
            <Form.FormItem label="备注" name="remark">
              <Textarea />
            </Form.FormItem>
          </div>
        </Form>
      </Dialog>
    </Card>
  );
};

export default CompanyClean;
