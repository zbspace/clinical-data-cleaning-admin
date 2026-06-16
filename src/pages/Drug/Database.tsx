import React, { useState, useEffect } from 'react';
import { Table, Button, Input, Form, Dialog, MessagePlugin, Card } from 'tdesign-react';
import { drugApi } from '../../api/drug';
import type { DrugStandardDto, DrugStandardInfo, DrugStandardParam } from '../../api/types/drug';

const { FormItem } = Form;

const DrugDatabase: React.FC = () => {
  const [filterForm] = Form.useForm();
  
  // Table state
  const [data, setData] = useState<DrugStandardDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });

  // Fetch Data
  const fetchData = async (curr = pagination.current, size = pagination.pageSize) => {
    setLoading(true);
    try {
      const values = filterForm.getFieldsValue(true);
      // NOTE: Company inputs are text in UI but API DrugStandardParam expects companyId (number).
      // If we don't have ID, we might just pass drugStandardName. 
      // Assuming backend might accept some string fields or we only filter by what's supported.
      const params: DrugStandardParam = {
        pageNum: curr,
        pageSize: size,
        drugStandardName: values.drugStandardName,
        // API does not seem to have direct text search for company/parent/genericName in DrugStandardParam
        // We will send what matches.
      };
      
      const res = await drugApi.standardPageData(params);
      if (res.code === 0) {
        setData(res.data?.list || []);
        setPagination({ current: curr, pageSize: size, total: res.data?.total || 0 });
      } else {
        MessagePlugin.error(res.msg || '查询失败');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onSearch = () => fetchData(1);

  const onReset = () => {
    filterForm.reset();
    fetchData(1);
  };

  // ----- 药品别名 Modal -----
  const [aliasModalVisible, setAliasModalVisible] = useState(false);
  const [aliasData, setAliasData] = useState<{ aliasName: string }[]>([]);
  const [aliasLoading, setAliasLoading] = useState(false);
  const [aliasPagination, setAliasPagination] = useState({ current: 1, pageSize: 5, total: 0 });
  const [currentDrugId, setCurrentDrugId] = useState<number>();

  const fetchAliasNos = async (drugId: number, curr = 1, size = 5) => {
    setAliasLoading(true);
    try {
      const res = await drugApi.commentDrugPageData({ id: drugId, pageNum: curr, pageSize: size });
      if (res.code === 0) {
        const mappedList = (res.data?.list || []).map((name) => ({ aliasName: name }));
        setAliasData(mappedList);
        setAliasPagination({ current: curr, pageSize: size, total: res.data?.total || 0 });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setAliasLoading(false);
    }
  };

  const openAliasModal = (id: number) => {
    setCurrentDrugId(id);
    fetchAliasNos(id, 1, 5);
    setAliasModalVisible(true);
  };

  const aliasColumns = [
    { colKey: 'rowIndex', title: '序号', width: 80, cell: ({ rowIndex }: any) => rowIndex + 1 + (aliasPagination.current - 1) * aliasPagination.pageSize },
    { colKey: 'aliasName', title: '源数据药品名（别名）' },
  ];

  // ----- 编辑 Modal -----
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editForm] = Form.useForm();
  const [editLoading, setEditLoading] = useState(false);
  const [currentEditRecord, setCurrentEditRecord] = useState<DrugStandardDto | null>(null);

  const openEditModal = (record: DrugStandardDto) => {
    setCurrentEditRecord(record);
    editForm.reset();
    editForm.setFieldsValue({
      cleanedDrugName: record.drugStandardName,
      genericNameCn: record.genericNameCn,
      genericNameEn: record.genericNameEn,
      developmentCode: record.developmentCode,
      otherInfo: record.otherInfo,
      dosageForm: record.dosageForm,
      drugType: record.drugType,
      companyName: record.companyName, // Readonly
    });
    setEditModalVisible(true);
  };

  const submitEdit = async () => {
    if (!currentEditRecord) return;
    try {
      const values = await editForm.validate();
      if (values === true) {
        setEditLoading(true);
        const fields = editForm.getFieldsValue(true);
        const submitData: DrugStandardInfo = {
          id: currentEditRecord.id,
          cleanedDrugName: fields.cleanedDrugName,
          genericNameCn: fields.genericNameCn,
          genericNameEn: fields.genericNameEn,
          developmentCode: fields.developmentCode,
          otherInfo: fields.otherInfo,
          dosageForm: fields.dosageForm,
          drugType: fields.drugType,
          status: currentEditRecord.status,
        };
        const res = await drugApi.standardSave(submitData);
        if (res.code === 0) {
          MessagePlugin.success('保存成功');
          setEditModalVisible(false);
          fetchData();
        } else {
          MessagePlugin.error(res.msg || '保存失败');
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setEditLoading(false);
    }
  };


  const columns = [
    { colKey: 'rowIndex', title: '序号', width: 80, cell: ({ rowIndex }: any) => rowIndex + 1 + (pagination.current - 1) * pagination.pageSize },
    { colKey: 'drugStandardName', title: '药品名（清洗后）', width: 180 },
    { colKey: 'genericNameCn', title: '通用名（中文）', width: 150 },
    { colKey: 'genericNameEn', title: '通用名（英文）', width: 150 },
    { colKey: 'developmentCode', title: '研发代号', width: 120 },
    { colKey: 'otherInfo', title: '其他（例如药物结构描述）', width: 220 },
    { colKey: 'dosageForm', title: '剂型', width: 100 },
    { colKey: 'drugType', title: '药品类型', width: 140 },
    {
      colKey: 'statisticCount',
      title: '源数据药品名（别名）',
      width: 180,
      align: 'center' as const,
      cell: ({ row }: any) => (
        <span style={{ color: '#0052d9', cursor: 'pointer', textDecoration: 'underline' }} onClick={() => openAliasModal(row.id!)}>
          {row.statisticCount || 0}
        </span>
      ),
    },
    { colKey: 'companyName', title: '相关公司', width: 200 },
    { colKey: 'parentCompanyName', title: '相关母公司', width: 200 },
    {
      colKey: 'operation',
      title: '编辑修正',
      width: 100,
      fixed: 'right' as const,
      cell: ({ row }: any) => (
        <Button theme="primary" variant="text" onClick={() => openEditModal(row)}>
          编辑
        </Button>
      ),
    },
    { colKey: 'updateUser', title: '操作人', width: 100 },
    { colKey: 'updateTime', title: '更新时间', width: 170 },
  ];

  return (
    <Card bordered={false} style={{ padding: '10px' }}>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ margin: '0 0 16px 0', fontSize: '18px', fontWeight: 600, color: 'var(--td-text-color-primary)' }}>药品名库管理</h2>
        <div style={{ 
          background: '#f8fafc', 
          padding: '16px', 
          borderRadius: '12px',
          border: '1px solid var(--td-border-level-1-color)'
        }}>
          <Form form={filterForm} layout="inline" labelWidth={140} style={{ display: 'flex', gap: '16px 0', flexWrap: 'wrap' }}>
            <FormItem label="药品名（清洗后）" name="drugStandardName" style={{ marginBottom: 0 }}>
              <Input placeholder="请输入关键字" clearable style={{ width: 220 }} />
            </FormItem>
            <FormItem label="公司" name="companyName" style={{ marginBottom: 0 }}>
              <Input placeholder="请输入关键字" clearable style={{ width: 220 }} />
            </FormItem>
            <FormItem label="母公司" name="parentCompanyName" style={{ marginBottom: 0 }}>
              <Input placeholder="请输入关键字" clearable style={{ width: 220 }} />
            </FormItem>
            <FormItem label="中文通用名" name="genericNameCn" style={{ marginBottom: 0 }}>
              <Input placeholder="不限" clearable style={{ width: 220 }} />
            </FormItem>
            <div style={{ display: 'flex', alignItems: 'center', marginLeft: 'auto' }}>
              <Button theme="default" onClick={onReset} style={{ background: '#fff', marginRight: 8 }}>重置条件</Button>
              <Button theme="primary" onClick={onSearch}>立即查询</Button>
            </div>
          </Form>
        </div>
      </div>

      <Table
        data={data}
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
          showJumper: true,
          onChange: (pageInfo) => fetchData(pageInfo.current, pageInfo.pageSize)
        }}
      />

      {/* 药品别名 Modal */}
      <Dialog
        header="药品别名"
        visible={aliasModalVisible}
        onClose={() => setAliasModalVisible(false)}
        footer={null}
        width={600}
      >
        <Table
          data={aliasData}
          columns={aliasColumns}
          rowKey="aliasName"
          loading={aliasLoading}
          bordered
          stripe
          pagination={{
            current: aliasPagination.current,
            pageSize: aliasPagination.pageSize,
            total: aliasPagination.total,
            onChange: (pageInfo) => fetchAliasNos(currentDrugId!, pageInfo.current, pageInfo.pageSize)
          }}
        />
      </Dialog>

      {/* 编辑 Modal */}
      <Dialog
        header="编辑"
        visible={editModalVisible}
        onClose={() => setEditModalVisible(false)}
        onConfirm={submitEdit}
        confirmBtn={{ content: '提交', theme: 'primary', loading: editLoading }}
        width={600}
      >
        <Form form={editForm} labelWidth={180} labelAlign="left">
          <div style={{ backgroundColor: '#e6f7ff', padding: '16px', borderRadius: 4 }}>
            <FormItem label="药品名（清洗后）" name="cleanedDrugName">
              <Input />
            </FormItem>
            <FormItem label="通用名（中文）" name="genericNameCn">
              <Input />
            </FormItem>
            <FormItem label="通用名（英文）" name="genericNameEn">
              <Input />
            </FormItem>
            <FormItem label="研发代号" name="developmentCode">
              <Input />
            </FormItem>
            <FormItem label="其他名（例如结构名称）" name="otherInfo">
              <Input />
            </FormItem>
            <FormItem label="剂型" name="dosageForm">
              <Input />
            </FormItem>
            <FormItem label="药品类型" name="drugType">
              <Input />
            </FormItem>
            <FormItem label="相关公司" name="companyName">
              <Input disabled />
            </FormItem>
          </div>
        </Form>
      </Dialog>
    </Card>
  );
};

export default DrugDatabase;
