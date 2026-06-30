import React, { useState, useEffect, useRef } from 'react';
import { Table, Button, Space, Input, Select, Form, Dialog, MessagePlugin, Card, Textarea } from 'tdesign-react';
import moment from 'moment';
import { companyApi } from '../../api';
import type { StandardCompanyDto, CompanyQueryParam } from '../../api';

const companyTypeOptions = [
  { label: '药企', value: '药企' },
  { label: 'CRO', value: 'CRO' },
  { label: '申办方', value: '申办方' },
  { label: '第三方实验室', value: '第三方实验室' },
  { label: '其他', value: '其他' },
];

const CompanyDatabase: React.FC = () => {
  const [form] = Form.useForm();
  const isFirstRender = useRef(true);

  // ----- Table State -----
  const [data, setData] = useState<StandardCompanyDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });

  const fetchData = async (curr = pagination.current, size = pagination.pageSize) => {
    setLoading(true);
    try {
      const values = form.getFieldsValue(true);
      const params: CompanyQueryParam = {
        ...values,
        pageNum: curr,
        pageSize: size,
      };

      const res = await companyApi.queryStandardList(params);
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

  // ----- 别名(源数据) Modal -----
  const [sourceModalVisible, setSourceModalVisible] = useState(false);
  const [sourceData, setSourceData] = useState<{ originName: string }[]>([]);
  const [sourceLoading, setSourceLoading] = useState(false);
  const [sourcePagination, setSourcePagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const [currentCompanyId, setCurrentCompanyId] = useState<number>();

  const fetchSourceData = async (companyId: number, curr = 1, size = 10) => {
    setSourceLoading(true);
    try {
      const res = await companyApi.getOriginCompanies({ queryId: companyId, pageNum: curr, pageSize: size });
      const mappedList = (res.data?.list || []).map((name) => ({ originName: name }));
      setSourceData(mappedList);
      setSourcePagination({ current: curr, pageSize: size, total: res.data?.total || 0 });
    } catch (e) {
      console.error(e);
    } finally {
      setSourceLoading(false);
    }
  };

  const openSourceModal = (id: number) => {
    setCurrentCompanyId(id);
    fetchSourceData(id, 1, 10);
    setSourceModalVisible(true);
  };

  // ----- 编辑 Modal -----
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editForm] = Form.useForm();
  const [editLoading, setEditLoading] = useState(false);
  const [currentEditRecord, setCurrentEditRecord] = useState<StandardCompanyDto | null>(null);

  // 监听编辑状态和数据，处理表单回显
  useEffect(() => {
    if (editModalVisible) {
      if (currentEditRecord) {
        // 编辑模式：填充数据，使用 setTimeout 确保表单项已注册
        const timer = setTimeout(() => {
          editForm.setFieldsValue({
            companyStandardName: currentEditRecord.companyStandardName,
            companyShortName: currentEditRecord.companyShortName,
            companyType: currentEditRecord.companyType,
            parentCompanyShortName: currentEditRecord.parentCompanName,
            remark: currentEditRecord.remark,
          });
        }, 0);
        return () => clearTimeout(timer);
      }
      // 新增模式：重置表单
      editForm.reset();
    }
    return undefined;
  }, [editModalVisible, currentEditRecord, editForm]);

  const openEditModal = async (record?: StandardCompanyDto) => {
    if (record && record.id) {
      // Edit mode
      setEditModalVisible(true);
      setEditLoading(true);
      try {
        const res = await companyApi.getStandardCompany(record.id);
        setCurrentEditRecord(res.data);
      } catch (e) {
        console.error(e);
        setEditModalVisible(false);
      } finally {
        setEditLoading(false);
      }
    } else {
      // Create mode
      setCurrentEditRecord(null);
      setEditModalVisible(true);
    }
  };

  const submitEdit = async () => {
    try {
      const values = await editForm.validate();
      if (values === true) {
        setEditLoading(true);
        const fields = editForm.getFieldsValue(true);
        const submitData: StandardCompanyDto = {
          ...currentEditRecord,
          companyStandardName: fields.companyStandardName,
          companyShortName: fields.companyShortName,
          companyType: fields.companyType,
          parentCompanName: fields.parentCompanyShortName, // Mapping to API property
          remark: fields.remark,
        };
        await companyApi.saveStandardCompany(submitData);
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

  // ----- Table Columns -----
  const columns = [
    {
      colKey: 'rowIndex',
      title: '序号',
      width: 80,
      cell: ({ rowIndex }: any) => rowIndex + 1 + (pagination.current - 1) * pagination.pageSize,
    },
    { colKey: 'companyStandardName', title: '公司名(标准名称)', width: 280 },
    {
      colKey: 'cnt',
      title: '源数据公司名(别名)',
      width: 180,
      align: 'center' as const,
      cell: ({ row }: any) => (
        <div
          style={{
            padding: '4px',
            color: '#0052d9',
            cursor: 'pointer',
            display: 'inline-block',
            minWidth: '40px',
          }}
          onClick={() => openSourceModal(row.id!)}
        >
          {row.cnt || 0}
        </div>
      ),
    },
    { colKey: 'companyType', title: '公司类型', width: 120 },
    { colKey: 'companyShortName', title: '公司简称', width: 180 },
    { colKey: 'parentCompanName', title: '母公司简称', width: 180 }, // API has parentCompanName
    {
      colKey: 'operation',
      title: '编辑修正',
      width: 120,
      fixed: 'right' as const,
      cell: ({ row }: any) => (
        <div style={{  padding: '2px 8px', display: 'inline-block' }}>
          <Button theme="primary" variant="text" onClick={() => openEditModal(row)}>
            编辑
          </Button>
        </div>
      ),
    },
    { colKey: 'updateUser', title: '操作人', width: 100 },
    {
      colKey: 'updateTime',
      title: '更新时间',
      width: 170,
      cell: ({ row }: any) => (row.updateTime ? moment(row.updateTime).format('YYYY-MM-DD HH:mm:ss') : '-'),
    },
  ];

  const sourceColumns = [
    {
      colKey: 'rowIndex',
      title: '序号',
      width: 80,
      cell: ({ rowIndex }: any) => rowIndex + 1 + (sourcePagination.current - 1) * sourcePagination.pageSize,
    },
    { colKey: 'originName', title: '公司别名(源数名称)' },
  ];

  return (
    <Card bordered={false} style={{ padding: '10px' ,width: '100%'}}>
      <div style={{ marginBottom: 10 }}>
        <h2 style={{ margin: '0 0 16px 0', fontSize: '18px', fontWeight: 600, color: 'var(--td-text-color-primary)' }}>
          公司名库
        </h2>
        <div
          style={{
            background: '#f8fafc',
            padding: '10px',
            borderRadius: '12px',
            border: '1px solid var(--td-border-level-1-color)',
          }}
        >
          <Form
            form={form}
            layout="inline"
            labelWidth={120}
            style={{ display: 'flex', gap: '16px 0', flexWrap: 'wrap' }}
          >
            <Form.FormItem label="公司名(标准名)" name="companyName" style={{ marginBottom: 0 }}>
              <Input placeholder="请输入" clearable style={{ width: 220 }} />
            </Form.FormItem>
            <Form.FormItem label="母公司简称" name="parentCompanyShortName" style={{ marginBottom: 0 }}>
              <Input placeholder="请输入" clearable style={{ width: 220 }} />
            </Form.FormItem>
            <Form.FormItem label="公司类型" name="companyType" style={{ marginBottom: 0 }}>
              <Select options={companyTypeOptions} placeholder="请选择" clearable style={{ width: 220 }} />
            </Form.FormItem>
            <div style={{ display: 'flex', alignItems: 'center', marginLeft: 'auto' }}>
              <Space>
                <Button theme="primary" onClick={onSearch}>
                  搜索
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

      {/* 别名源数据弹窗 */}
      <Dialog
        header="源数据公司名(别名)"
        visible={sourceModalVisible}
        onClose={() => setSourceModalVisible(false)}
        footer={null}
        width={600}
      >
        <Table
          data={sourceData}
          columns={sourceColumns}
          rowKey="originName"
          loading={sourceLoading}
          pagination={{
            current: sourcePagination.current,
            pageSize: sourcePagination.pageSize,
            total: sourcePagination.total,
            onChange: (pageInfo) => fetchSourceData(currentCompanyId!, pageInfo.current, pageInfo.pageSize),
          }}
          bordered
          stripe
        />
      </Dialog>

      {/* 编辑弹窗 */}
      <Dialog
        header={currentEditRecord ? '编辑' : '新增'}
        visible={editModalVisible}
        onClose={() => {
          setEditModalVisible(false);
          setCurrentEditRecord(null);
        }}
        onConfirm={submitEdit}
        confirmBtn={{ content: '保存', theme: 'primary', loading: editLoading }}
        width={500}
      >
        <Form form={editForm} labelWidth={140} labelAlign="left">
          <Form.FormItem label="公司名(标准名称)" name="companyStandardName">
            <Input />
          </Form.FormItem>
          <Form.FormItem label="公司简称" name="companyShortName">
            <Input />
          </Form.FormItem>
          <Form.FormItem label="公司类型" name="companyType">
            <Select options={companyTypeOptions} placeholder="请选择" />
          </Form.FormItem>
          <Form.FormItem label="母公司简称" name="parentCompanyShortName">
            <Input />
          </Form.FormItem>
          <Form.FormItem label="备注" name="remark">
            <Textarea />
          </Form.FormItem>
        </Form>
      </Dialog>
    </Card>
  );
};

export default CompanyDatabase;
