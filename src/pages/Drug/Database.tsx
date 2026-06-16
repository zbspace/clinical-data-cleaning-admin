import React from 'react';
import { Table, Button, Space, Input } from 'tdesign-react';

const DrugDatabase: React.FC = () => {
  const columns = [
    { colKey: 'id', title: 'ID', width: 100 },
    { colKey: 'standardName', title: '标准药品名称', width: 200 },
    { colKey: 'genericName', title: '通用名', width: 200 },
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
    { id: 1, standardName: '阿莫西林', genericName: 'Amoxicillin', updateTime: '2023-10-01' },
    { id: 2, standardName: '布洛芬', genericName: 'Ibuprofen', updateTime: '2023-10-02' },
  ];

  return (
    <div>
      <h2>药品名库管理</h2>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
        <Space>
          <Input placeholder="搜索标准名称" />
          <Button theme="primary">搜索</Button>
        </Space>
        <Button theme="primary">新增标准药品</Button>
      </div>
      <Table data={data} columns={columns} rowKey="id" />
    </div>
  );
};

export default DrugDatabase;
