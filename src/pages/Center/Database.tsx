import React from 'react';
import { Table, Button, Space, Input } from 'tdesign-react';

const CenterDatabase: React.FC = () => {
  const columns = [
    { colKey: 'id', title: 'ID', width: 100 },
    { colKey: 'standardName', title: '标准研究中心名称', width: 200 },
    { colKey: 'province', title: '省份', width: 150 },
    { colKey: 'city', title: '城市', width: 150 },
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
    { id: 1, standardName: '北京协和医院', province: '北京', city: '北京市', updateTime: '2023-10-01' },
    { id: 2, standardName: '复旦大学附属中山医院', province: '上海', city: '上海市', updateTime: '2023-10-02' },
  ];

  return (
    <div>
      <h2>研究中心库</h2>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
        <Space>
          <Input placeholder="搜索标准名称" />
          <Button theme="primary">搜索</Button>
        </Space>
        <Button theme="primary">新增研究中心</Button>
      </div>
      <Table data={data} columns={columns} rowKey="id" />
    </div>
  );
};

export default CenterDatabase;
