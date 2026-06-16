import React from 'react';
import { Table, Button, Space, Input } from 'tdesign-react';

const CompanyDatabase: React.FC = () => {
  const columns = [
    { colKey: 'id', title: 'ID', width: 100 },
    { colKey: 'standardName', title: '标准公司名称', width: 200 },
    { colKey: 'aliases', title: '别名/曾用名', width: 300 },
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
    { id: 1, standardName: '辉瑞', aliases: '辉瑞制药, 辉瑞投资', updateTime: '2023-10-01' },
    { id: 2, standardName: '阿斯利康', aliases: '阿斯利康制药', updateTime: '2023-10-02' },
  ];

  return (
    <div>
      <h2>公司名库</h2>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
        <Space>
          <Input placeholder="搜索标准名称" />
          <Button theme="primary">搜索</Button>
        </Space>
        <Button theme="primary">新增标准公司</Button>
      </div>
      <Table data={data} columns={columns} rowKey="id" />
    </div>
  );
};

export default CompanyDatabase;
