import React, { useState, useEffect, useRef } from 'react';
import { Table, Button, Select, Dialog, Form, Input, Tag, Card } from 'tdesign-react';
import { drugApi } from '../../api/drug';

const { FormItem } = Form;
const { Option } = Select;

const DrugClean: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [tableData, setTableData] = useState<any[]>([]);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });

  const [relatedDialogVisible, setRelatedDialogVisible] = useState(false);
  const [editDialogVisible, setEditDialogVisible] = useState(false);
  const [currentEditRecord, setCurrentEditRecord] = useState<any>(null);

  const [filterForm] = Form.useForm();
  const [editForm] = Form.useForm();
  const isFirstRender = useRef(true);

  const handleEdit = (record: any) => {
    setCurrentEditRecord(record);
    editForm.setFieldsValue({
      cleanedName: record.drugStandardName || record.cleanedName,
      genericNameCn: record.drugNormalNameCn || record.genericNameCn,
      genericNameEn: record.drugNormalNameEn || record.genericNameEn,
      rdCode: record.drugCode || record.rdCode,
      otherNames: record.otherComment || record.otherNames,
      dosageForm: record.dosageForm,
      drugType: record.drugType,
    });
    setEditDialogVisible(true);
  };

  const columns = [
    { colKey: 'index', title: '序号', width: 80, cell: ({ rowIndex }: { rowIndex: number }) => rowIndex + 1 },
    {
      colKey: 'originalName',
      title: '药品名（源数据）',
      width: 180,
      cell: ({ row }: any) => row.drugNickName || row.drugComment || row.originalName,
    },
    {
      colKey: 'relatedNo',
      title: '相关受理号/登记号',
      width: 150,
      cell: ({ row }: { row: any }) => (
        <Button variant="text" theme="primary" onClick={() => setRelatedDialogVisible(true)}>
          {row.acceptanceNo || row.relatedNo}
        </Button>
      ),
    },
    {
      colKey: 'status',
      title: '清洗状态',
      width: 120,
      cell: ({ row }: { row: any }) => {
        let theme = 'default';
        let statusText = row.status;
        if (row.status === 1) statusText = '自动清洗';
        if (row.status === 2) statusText = '暂未匹配上';

        if (statusText === '自动清洗') theme = 'warning';
        return (
          <Tag theme={theme as any} variant="light">
            {statusText}
          </Tag>
        );
      },
    },
    {
      colKey: 'cleanedName',
      title: '药品名（清洗后）',
      width: 180,
      cell: ({ row }: any) => row.drugStandardName || row.cleanedName,
    },
    {
      colKey: 'genericNameCn',
      title: '通用名（中文）',
      width: 150,
      cell: ({ row }: any) => row.drugNormalNameCn || row.genericNameCn,
    },
    {
      colKey: 'genericNameEn',
      title: '通用名（英文）',
      width: 150,
      cell: ({ row }: any) => row.drugNormalNameEn || row.genericNameEn,
    },
    { colKey: 'rdCode', title: '研发代号', width: 120, cell: ({ row }: any) => row.drugCode || row.rdCode },
    {
      colKey: 'otherNames',
      title: '其他名（例如结构描述）',
      width: 180,
      cell: ({ row }: any) => row.otherComment || row.otherNames,
    },
    { colKey: 'dosageForm', title: '剂型', width: 100 },
    { colKey: 'drugType', title: '药品类型', width: 120 },
    {
      colKey: 'operation',
      title: '操作',
      width: 100,
      fixed: 'right' as const,
      cell: ({ row }: { row: any }) => (
        <Button theme="primary" variant="text" onClick={() => handleEdit(row)}>
          编辑
        </Button>
      ),
    },
    { colKey: 'operator', title: '操作人', width: 100, cell: ({ row }: any) => row.updateUser || row.operator },
    { colKey: 'updateTime', title: '更新时间', width: 150 },
  ];

  const fetchData = async () => {
    setLoading(true);
    try {
      const formValues = filterForm.getFieldsValue(true);
      const res = await drugApi.cleanPageData({
        pageNum: pagination.current,
        pageSize: pagination.pageSize,
        drugStandardName: formValues.cleanedName,
        status: formValues.status !== 'all' ? Number(formValues.status) : undefined,
        // ... map other form values if needed
      });
      if (res.code === 0) {
        setTableData(res.data.list);
        setPagination((prev) => ({ ...prev, total: res.data.total }));
      }
    } catch (error) {
      console.error('Fetch data failed:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      fetchData();
      return;
    }
    fetchData();
  }, [pagination.current, pagination.pageSize]);

  const handleSearch = () => {
    if (pagination.current === 1) {
      fetchData();
    } else {
      setPagination((prev) => ({ ...prev, current: 1 }));
    }
  };

  const relatedColumns = [
    { colKey: 'index', title: '序号', width: 80, cell: ({ rowIndex }: { rowIndex: number }) => rowIndex + 1 },
    { colKey: 'recordNo', title: '相关登记号/备案号', width: 180 },
    { colKey: 'relatedCompany', title: '相关公司（源数据）', width: 180 },
    { colKey: 'regClassSource', title: '注册分类（源数据）', width: 150 },
    { colKey: 'regClassCleaned', title: '注册分类（清洗后）', width: 150 },
  ];

  const relatedData = [
    { id: 1, recordNo: '2020GH3914', relatedCompany: '', regClassSource: '', regClassCleaned: '' },
    { id: 2, recordNo: 'JXHL1100068', relatedCompany: '', regClassSource: '', regClassCleaned: '' },
    { id: 3, recordNo: 'CTR20132950', relatedCompany: '', regClassSource: '', regClassCleaned: '' },
  ];

  return (
    <Card bordered={false} style={{ padding: '10px' }}>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ margin: '0 0 16px 0', fontSize: '18px', fontWeight: 600, color: 'var(--td-text-color-primary)' }}>
          药品名清洗
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
            form={filterForm}
            layout="inline"
            labelWidth={140}
            style={{ display: 'flex', gap: '16px 0', flexWrap: 'wrap' }}
          >
            <FormItem label="药品名（清洗后）" name="cleanedName" style={{ marginBottom: 0 }}>
              <Input placeholder="请输入关键字" clearable style={{ width: 220 }} />
            </FormItem>
            <FormItem label="公司名（清洗后）" name="cleanedCompany" style={{ marginBottom: 0 }}>
              <Input placeholder="请输入关键字" clearable style={{ width: 220 }} />
            </FormItem>
            <FormItem label="母公司" name="parentCompany" style={{ marginBottom: 0 }}>
              <Input placeholder="请输入关键字" clearable style={{ width: 220 }} />
            </FormItem>
            <FormItem label="清洗状态" name="status" initialData="all" style={{ marginBottom: 0 }}>
              <Select style={{ width: 220 }}>
                <Option key="all" value="all" label="全部" />
                <Option key="auto" value="1" label="自动清洗" />
                <Option key="unmatched" value="2" label="暂未匹配上" />
                <Option key="manual" value="3" label="手动清洗" />
                <Option key="not_needed" value="4" label="不需要清洗" />
              </Select>
            </FormItem>
            <div style={{ display: 'flex', alignItems: 'center', marginLeft: 'auto' }}>
              <Button
                theme="default"
                onClick={() => {
                  filterForm.reset();
                  fetchData();
                }}
                style={{ background: '#fff', marginRight: 8 }}
              >
                重置条件
              </Button>
              <Button theme="primary" onClick={handleSearch}>
                立即查询
              </Button>
            </div>
          </Form>
        </div>
      </div>

      <Table
        data={tableData}
        columns={columns}
        rowKey="id"
        loading={loading}
        bordered
        stripe
        tableLayout="auto"
        hover
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: pagination.total,
          onChange: (pageInfo) => {
            setPagination((prev) => ({
              ...prev,
              current: pageInfo.current,
              pageSize: pageInfo.pageSize,
            }));
          },
        }}
      />

      {/* 相关备案/登记号 Modal */}
      <Dialog
        header="相关备案/登记号"
        visible={relatedDialogVisible}
        onClose={() => setRelatedDialogVisible(false)}
        footer={null}
        width={800}
      >
        <Table
          data={relatedData}
          columns={relatedColumns}
          rowKey="id"
          bordered
          pagination={{
            current: 2,
            pageSize: 5,
            total: 25,
            showPageSize: false,
            showJumper: false,
          }}
        />
      </Dialog>

      {/* 编辑 Modal */}
      <Dialog
        header="编辑"
        visible={editDialogVisible}
        onClose={() => setEditDialogVisible(false)}
        onConfirm={() => {
          editForm.submit();
        }}
        width={600}
      >
        <div style={{ backgroundColor: '#f3f4f6', padding: 16, marginBottom: 16, borderRadius: 4 }}>
          <p style={{ margin: '0 0 8px 0' }}>
            <strong>药品名（源数据）：</strong> {currentEditRecord?.originalName}
          </p>
          <p style={{ margin: 0 }}>
            <strong>药品类型：</strong> {currentEditRecord?.drugType || '化学药物'}
          </p>
        </div>
        <Form
          form={editForm}
          labelWidth={180}
          onSubmit={(e) => {
            console.log(e);
            setEditDialogVisible(false);
          }}
        >
          <FormItem label="药品名（清洗后）" name="cleanedName">
            <Input />
          </FormItem>
          <FormItem label="通用名（中文）" name="genericNameCn">
            <Input />
          </FormItem>
          <FormItem label="通用名（英文）" name="genericNameEn">
            <Input />
          </FormItem>
          <FormItem label="研发代号" name="rdCode">
            <Input />
          </FormItem>
          <FormItem label="其他名（例如结构名称）" name="otherNames">
            <Input />
          </FormItem>
          <FormItem label="剂型" name="dosageForm">
            <Select>
              <Option key="inj" value="注射液" label="注射液" />
              <Option key="tab" value="片剂" label="片剂" />
            </Select>
          </FormItem>
          <FormItem label="药品类型" name="drugType">
            <Select>
              <Option key="chem" value="化学药物" label="化学药物" />
              <Option key="bio" value="生物制品" label="生物制品" />
            </Select>
          </FormItem>
        </Form>
      </Dialog>
    </Card>
  );
};

export default DrugClean;
