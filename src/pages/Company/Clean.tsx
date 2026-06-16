import React from 'react';
import { Table, Button, Space, Input } from 'tdesign-react';

const CompanyClean: React.FC = () => {
  const columns = [
    { colKey: 'id', title: 'ID', width: 100 },
    { colKey: 'originalName', title: '原始公司名称', width: 200 },
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
    { id: 1, originalName: '辉瑞(中国)投资有限公司', suggestedName: '辉瑞', status: '待处理' },
    { id: 2, originalName: '阿斯利康制药', suggestedName: '阿斯利康', status: '待处理' },
  ];

  return (
    <div>
      <h2>公司名清洗</h2>
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

export default CompanyClean;
