import React from 'react';
import { Table, Button, Space, Input } from 'tdesign-react';

const IndicationDatabase: React.FC = () => {
  const columns = [
    { colKey: 'id', title: 'ID', width: 100 },
    { colKey: 'standardName', title: '标准适应症名称', width: 200 },
    { colKey: 'category', title: '疾病分类', width: 200 },
    { colKey: 'updateTime', title: '更新时间', width: 150 },
    {
      colKey: 'operation',
      title: '操作',
      width: 150,
      cell: () => (
        <Space>
          <Button theme="primary" variant="text">
            编辑
          </Button>
          <Button theme="danger" variant="text">
            删除
          </Button>
        </Space>
      ),
    },
  ];

  const data = [
    { id: 1, standardName: '非小细胞肺癌', category: '肿瘤', updateTime: '2023-10-01' },
    { id: 2, standardName: '2型糖尿病', category: '内分泌', updateTime: '2023-10-02' },
  ];

  return (
    <div>
      <h2>适应症库管理</h2>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
        <Space>
          <Input placeholder="搜索标准名称" />
          <Button theme="primary">搜索</Button>
        </Space>
        <Button theme="primary">新增标准适应症</Button>
      </div>
      <Table data={data} columns={columns} rowKey="id" />
    </div>
  );
};

export default IndicationDatabase;
