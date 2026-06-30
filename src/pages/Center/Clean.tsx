import React from 'react';
import { Table, Button, Space, Input, Card, Form, Select } from 'tdesign-react';

const { FormItem } = Form;
const { Option } = Select;

const CenterClean: React.FC = () => {
  const [filterForm] = Form.useForm();
  
  const columns = [
    { colKey: 'id', title: 'ID', width: 100 },
    { colKey: 'originalName', title: '原始研究中心名称', width: 200 },
    { colKey: 'suggestedName', title: '建议标准名称', width: 200 },
    { colKey: 'status', title: '状态', width: 100 },
    {
      colKey: 'operation',
      title: '操作',
      width: 150,
      cell: () => (
        <Space>
          <Button theme="primary" variant="text">
            采纳
          </Button>
          <Button theme="danger" variant="text">
            忽略
          </Button>
        </Space>
      ),
    },
  ];

  const data = [
    { id: 1, originalName: '北京协和医院(东院)', suggestedName: '北京协和医院', status: '待处理' },
    { id: 2, originalName: '复旦大学附属中山医院徐汇院区', suggestedName: '复旦大学附属中山医院', status: '待处理' },
  ];

  return (
    <Card bordered={false} style={{ padding: '10px' }}>
      <div style={{ marginBottom: 10 }}>
        <h2 style={{ margin: '0 0 16px 0', fontSize: '18px', fontWeight: 600, color: 'var(--td-text-color-primary)' }}>研究中心名称清洗</h2>
        <div style={{ 
          background: '#f8fafc', 
          padding: '16px', 
          borderRadius: '12px',
          border: '1px solid var(--td-border-level-1-color)'
        }}>
          <Form form={filterForm} layout="inline" labelWidth={140} style={{ display: 'flex', gap: '16px 0', flexWrap: 'wrap' }}>
            <FormItem label="原始研究中心名称" name="originalName" style={{ marginBottom: 0 }}>
              <Input placeholder="请输入关键字" clearable style={{ width: 220 }} />
            </FormItem>
            <FormItem label="建议标准名称" name="suggestedName" style={{ marginBottom: 0 }}>
              <Input placeholder="请输入关键字" clearable style={{ width: 220 }} />
            </FormItem>
            <FormItem label="清洗状态" name="cleanStatus" initialData="all" style={{ marginBottom: 0 }}>
              <Select style={{ width: 220 }}>
                <Option key="all" value="0" label="未清洗" />
                <Option key="pending" value="1" label="已清洗" />
                <Option key="done" value="2" label="不用清洗" />
              </Select>
            </FormItem>
            <div style={{ display: 'flex', alignItems: 'center', marginLeft: 'auto' }}>
              <Button theme="default" onClick={() => filterForm.reset()} style={{ background: '#fff', marginRight: 8 }}>重置条件</Button>
              <Button theme="primary">立即查询</Button>
            </div>
          </Form>
        </div>
      </div>
      <Table data={data} columns={columns} rowKey="id" bordered stripe tableLayout="auto" />
    </Card>
  );
};

export default CenterClean;
