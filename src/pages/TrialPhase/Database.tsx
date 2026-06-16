import React from 'react';
import { Table, Button, Space, Input } from 'tdesign-react';

const TrialPhaseDatabase: React.FC = () => {
  const columns = [
    { colKey: 'id', title: 'ID', width: 100 },
    { colKey: 'phaseName', title: '分期名称', width: 200 },
    { colKey: 'description', title: '描述', width: 300 },
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
    { id: 1, phaseName: 'I期', description: '初步的临床药理学及人体安全性评价试验', updateTime: '2023-10-01' },
    { id: 2, phaseName: 'II期', description: '治疗作用初步评价阶段', updateTime: '2023-10-02' },
    { id: 3, phaseName: 'III期', description: '治疗作用确证阶段', updateTime: '2023-10-03' },
    { id: 4, phaseName: 'IV期', description: '新药上市后应用研究阶段', updateTime: '2023-10-04' },
  ];

  return (
    <div>
      <h2>试验分期库管理</h2>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
        <Space>
          <Input placeholder="搜索分期名称" />
          <Button theme="primary">搜索</Button>
        </Space>
        <Button theme="primary">新增试验分期</Button>
      </div>
      <Table data={data} columns={columns} rowKey="id" />
    </div>
  );
};

export default TrialPhaseDatabase;
