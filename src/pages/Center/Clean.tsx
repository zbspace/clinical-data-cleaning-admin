import React from 'react';
import { Table, Button, Space, Input } from 'tdesign-react';

const CenterClean: React.FC = () => {
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
    <div>
      <h2>研究中心名称清洗</h2>
      <div style={{ marginBottom: 16 }}>
        <Space>
          <Input placeholder="搜索原始名称" />
          <Button theme="primary">搜索</Button>
        </Space>
      </div>
      <Table data={data} columns={columns} rowKey="id" />
    </div>
  );
};

export default CenterClean;
