import React, { useState, useEffect } from 'react';
import { Table, Button, Input, Card, Form, Select, Dialog, MessagePlugin, Tag } from 'tdesign-react';
import { indicationApi } from '../../api';
import type { IndicationDto, IndicationParam, IndicationDetailDto, IndicationTagDto } from '../../api';

const { FormItem } = Form;
const { Option } = Select;

const IndicationClean: React.FC = () => {
  const [filterForm] = Form.useForm();
  
  const [data, setData] = useState<IndicationDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });

  const fetchData = async (curr = pagination.current, size = pagination.pageSize) => {
    setLoading(true);
    try {
      const values = filterForm.getFieldsValue(true);
      const params: IndicationParam = {
        pageNum: curr,
        pageSize: size,
        status: values.status !== 'all' ? Number(values.status) : undefined,
        // 其他字段如果后端API支持的话可以映射进去
      };
      
      const res = await indicationApi.pageData(params);
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

  // ----- 相关受理号/备案号 Modal -----
  const [accModalVisible, setAccModalVisible] = useState(false);
  const [accData, setAccData] = useState<{ no: string }[]>([]);

  const openAccModal = (record: IndicationDto) => {
    // 假设从 sourceList 中读取
    const list = (record.sourceList || []).map(no => ({ no }));
    setAccData(list);
    setAccModalVisible(true);
  };

  const accColumns = [
    { colKey: 'rowIndex', title: '序号', width: 80, cell: ({ rowIndex }: any) => rowIndex + 1 },
    { colKey: 'no', title: '相关受理号/备案号' },
  ];

  // ----- 编辑 Modal -----
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [currentEditRecord, setCurrentEditRecord] = useState<IndicationDetailDto | null>(null);

  const openEditModal = async (record: IndicationDto) => {
    if (!record.indicationCommentId) return;
    try {
      const res = await indicationApi.getIndicationDetail(record.indicationCommentId);
      if (res.code === 0 && res.data) {
        // 深拷贝一份以供编辑
        setCurrentEditRecord(JSON.parse(JSON.stringify(res.data)));
        setEditModalVisible(true);
      } else {
        MessagePlugin.error(res.msg || '获取详情失败');
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleEditChange = (index: number, field: string, value: any) => {
    if (!currentEditRecord) return;
    const newData = { ...currentEditRecord };
    if (!newData.indicationTagDtoList) newData.indicationTagDtoList = [];
    newData.indicationTagDtoList[index] = {
      ...newData.indicationTagDtoList[index],
      [field]: value
    };
    setCurrentEditRecord(newData);
  };

  const submitEdit = async () => {
    if (!currentEditRecord) return;
    setEditLoading(true);
    try {
      const res = await indicationApi.saveIndication(currentEditRecord);
      if (res.code === 0) {
        MessagePlugin.success('保存成功');
        setEditModalVisible(false);
        fetchData();
      } else {
        MessagePlugin.error(res.msg || '保存失败');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setEditLoading(false);
    }
  };

  const editColumns = [
    { colKey: 'rowIndex', title: '序号', width: 60, cell: ({ rowIndex }: any) => rowIndex + 1 },
    { 
      colKey: 'aiClean', 
      title: 'AI清洗后适应症', 
      cell: ({ row }: any) => <span>{row.indicationStandard || ''}</span> 
    },
    { 
      colKey: 'manualClean', 
      title: '人工审核清洗后数据', 
      cell: ({ row, rowIndex }: any) => (
        <Input 
          value={row.indicationStandard} 
          onChange={(val) => handleEditChange(rowIndex, 'indicationStandard', val)} 
        />
      ) 
    },
  ];

  const columns = [
    { colKey: 'rowIndex', title: '序号', width: 80, cell: ({ rowIndex }: any) => rowIndex + 1 + (pagination.current - 1) * pagination.pageSize },
    { 
      colKey: 'indicationComment', 
      title: '适应症（源数据）', 
      width: 250,
      cell: ({ row }: any) => (
        <div style={{ maxHeight: 80, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }} title={row.indicationComment}>
          {row.indicationComment}
        </div>
      )
    },
    {
      colKey: 'statisticCount',
      title: '相关受理号/备案号',
      width: 150,
      align: 'center' as const,
      cell: ({ row }: any) => (
        <span style={{ color: '#0052d9', cursor: 'pointer', textDecoration: 'underline' }} onClick={() => openAccModal(row)}>
          {row.statisticCount || 0}
        </span>
      ),
    },
    {
      colKey: 'status',
      title: '清洗状态',
      width: 120,
      cell: ({ row }: any) => {
        let theme = 'default';
        let text = row.status;
        if (row.status === 1) text = '自动清洗';
        if (row.status === 2) text = '暂未匹配上';
        if (text === '自动清洗') theme = 'warning';
        return <Tag theme={theme as any} variant="light">{text}</Tag>;
      },
    },
    { 
      colKey: 'indicationTagList', 
      title: '适应症（清洗后）', 
      width: 200,
      cell: ({ row }: any) => {
        const tags = row.indicationTagList || [];
        return tags.map((t: any) => t.indicationStandard).filter(Boolean).join('; ');
      }
    },
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
    { colKey: 'updateUser', title: '操作人', width: 100 },
    { colKey: 'updateTime', title: '更新时间', width: 170 },
  ];

  return (
    <Card bordered={false} style={{ padding: '10px' }}>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ margin: '0 0 16px 0', fontSize: '18px', fontWeight: 600, color: 'var(--td-text-color-primary)' }}>适应症名称清洗</h2>
        <div style={{ 
          background: '#f8fafc', 
          padding: '16px', 
          borderRadius: '12px',
          border: '1px solid var(--td-border-level-1-color)'
        }}>
          <Form form={filterForm} layout="inline" labelWidth={140} style={{ display: 'flex', gap: '16px 0', flexWrap: 'wrap' }}>
            <FormItem label="适应症(源数据)" name="indicationComment" style={{ marginBottom: 0 }}>
              <Input placeholder="请输入关键字" clearable style={{ width: 220 }} />
            </FormItem>
            <FormItem label="适应症(清洗后)" name="indicationStandard" style={{ marginBottom: 0 }}>
              <Input placeholder="请输入关键字" clearable style={{ width: 220 }} />
            </FormItem>
            <FormItem label="清洗状态" name="status" initialData="all" style={{ marginBottom: 0 }}>
              <Select style={{ width: 220 }}>
                <Option key="all" value="all" label="全部" />
                <Option key="auto" value="1" label="自动清洗" />
                <Option key="unmatched" value="2" label="暂未匹配上" />
              </Select>
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
        rowKey="indicationCommentId" 
        loading={loading}
        bordered 
        stripe 
        tableLayout="auto" 
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: pagination.total,
          showJumper: true,
          onChange: (pageInfo) => fetchData(pageInfo.current, pageInfo.pageSize)
        }}
      />

      {/* 相关受理号/备案号 Modal */}
      <Dialog
        header="相关受理号/备案号"
        visible={accModalVisible}
        onClose={() => setAccModalVisible(false)}
        footer={null}
        width={600}
      >
        <Table
          data={accData}
          columns={accColumns}
          rowKey="no"
          bordered
          stripe
          pagination={{ pageSize: 5 }}
        />
      </Dialog>

      {/* 编辑 Modal */}
      <Dialog
        header="编辑"
        visible={editModalVisible}
        onClose={() => setEditModalVisible(false)}
        onConfirm={submitEdit}
        confirmBtn={{ content: '提交', theme: 'primary', loading: editLoading }}
        width={800}
      >
        <div style={{ backgroundColor: '#e6f7ff', padding: '16px', borderRadius: 4, marginBottom: 16 }}>
          <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
            <div style={{ width: 4, height: 16, background: 'var(--td-brand-color)', borderRadius: 2, marginTop: 4 }}></div>
            <div style={{ fontWeight: 'bold' }}>适应症（源数据）：</div>
          </div>
          <div style={{ background: '#fff', padding: 12, borderRadius: 4, fontSize: 13, lineHeight: '1.6', color: '#333' }}>
            {currentEditRecord?.indicationComment}
          </div>
        </div>

        <div style={{ backgroundColor: '#e6f7ff', padding: '16px', borderRadius: 4 }}>
          <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
            <div style={{ width: 4, height: 16, background: 'var(--td-brand-color)', borderRadius: 2, marginTop: 4 }}></div>
            <div style={{ fontWeight: 'bold' }}>适应症（清洗后）：</div>
          </div>
          <Table 
            data={currentEditRecord?.indicationTagDtoList || []} 
            columns={editColumns} 
            rowKey="id" 
            bordered 
            size="small"
            pagination={undefined}
          />
        </div>
      </Dialog>
    </Card>
  );
};

export default IndicationClean;
