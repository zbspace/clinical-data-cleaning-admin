import React, { useState, useEffect } from 'react';
import { Table, Button, Input, Card, Form, Select, Dialog, MessagePlugin } from 'tdesign-react';
import { indicationApi } from '../../api';
import type { IndicationDictDto, IndicationDictParam, IndicationCategory } from '../../api/types/indication';

const { FormItem } = Form;
const { Option } = Select;

const IndicationDatabase: React.FC = () => {
  const [filterForm] = Form.useForm();
  
  // Table state
  const [data, setData] = useState<IndicationDictDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });

  // 适应症归类选项
  const [categoryOptions, setCategoryOptions] = useState<IndicationCategory[]>([]);

  useEffect(() => {
    // 页面加载时获取下拉分类
    indicationApi.categoryPageData({ pageNum: 1, pageSize: 1000 }).then(res => {
      if (res.code === 0) {
        setCategoryOptions(res.data?.list || []);
      }
    });
    fetchData();
  }, []);

  const fetchData = async (curr = pagination.current, size = pagination.pageSize) => {
    setLoading(true);
    try {
      const values = filterForm.getFieldsValue(true);
      const params: IndicationDictParam = {
        pageNum: curr,
        pageSize: size,
        indicationCategoryId: values.indicationCategoryId,
        indicationStandard: values.indicationStandard,
      };
      
      const res = await indicationApi.dictPageData(params);
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

  const onSearch = () => fetchData(1);
  const onReset = () => {
    filterForm.reset();
    fetchData(1);
  };

  // ----- 别名（源数据） Modal -----
  const [aliasModalVisible, setAliasModalVisible] = useState(false);
  const [aliasData, setAliasData] = useState<{ aliasName: string }[]>([]);
  const [aliasLoading, setAliasLoading] = useState(false);
  const [aliasPagination, setAliasPagination] = useState({ current: 1, pageSize: 5, total: 0 });
  const [currentTagId, setCurrentTagId] = useState<number>();

  const fetchAliasList = async (tagId: number, curr = 1, size = 5) => {
    setAliasLoading(true);
    try {
      const res = await indicationApi.getIndicationCommentList({ id: tagId, pageNum: curr, pageSize: size });
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

  const openAliasModal = (record: IndicationDictDto) => {
    if (!record.indicationTagId) return;
    setCurrentTagId(record.indicationTagId);
    fetchAliasList(record.indicationTagId, 1, 5);
    setAliasModalVisible(true);
  };

  const aliasColumns = [
    { colKey: 'rowIndex', title: '序号', width: 80, cell: ({ rowIndex }: any) => rowIndex + 1 + (aliasPagination.current - 1) * aliasPagination.pageSize },
    { colKey: 'aliasName', title: '源数据适应症（别名）' },
  ];

  const columns = [
    { colKey: 'rowIndex', title: '序号', width: 80, cell: ({ rowIndex }: any) => rowIndex + 1 + (pagination.current - 1) * pagination.pageSize },
    { colKey: 'indicationCategoryName', title: '适应症归类', width: 200 },
    { colKey: 'indicationStandard', title: '适应症', width: 200 },
    {
      colKey: 'statisticCount',
      title: '源数据适应症（别名）',
      width: 180,
      align: 'center' as const,
      cell: ({ row }: any) => (
        <span style={{ color: '#0052d9', cursor: 'pointer', textDecoration: 'underline' }} onClick={() => openAliasModal(row)}>
          {row.statisticCount || 0}
        </span>
      ),
    },
    {
      colKey: 'operation',
      title: '修正编辑',
      width: 100,
      cell: () => (
        <Button theme="primary" variant="text">
          编辑
        </Button>
      ),
    },
    { colKey: 'updateUser', title: '操作人', width: 120 },
    { colKey: 'updateTime', title: '操作时间', width: 170 },
  ];

  return (
    <Card bordered={false} style={{ padding: '10px' }}>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ margin: '0 0 16px 0', fontSize: '18px', fontWeight: 600, color: 'var(--td-text-color-primary)' }}>适应症库管理</h2>
        <div style={{ 
          background: '#f8fafc', 
          padding: '16px', 
          borderRadius: '12px',
          border: '1px solid var(--td-border-level-1-color)'
        }}>
          <Form form={filterForm} layout="inline" labelWidth={100} style={{ display: 'flex', gap: '16px 0', flexWrap: 'wrap' }}>
            <FormItem label="适应症归类" name="indicationCategoryId" style={{ marginBottom: 0 }}>
              <Select placeholder="请选择" clearable style={{ width: 220 }}>
                {categoryOptions.map(cat => (
                  <Option key={cat.id} value={cat.id?.toString() || ''} label={cat.categoryName || ''} />
                ))}
              </Select>
            </FormItem>
            <FormItem label="适应症" name="indicationStandard" style={{ marginBottom: 0 }}>
              <Input placeholder="请输入关键字" clearable style={{ width: 220 }} />
            </FormItem>
            <div style={{ display: 'flex', alignItems: 'center', marginLeft: 'auto' }}>
              <Button theme="default" onClick={onReset} style={{ background: '#fff', marginRight: 8 }}>重置条件</Button>
              <Button theme="primary" onClick={onSearch}>搜索</Button>
            </div>
          </Form>
        </div>
      </div>

      <Table 
        data={data} 
        columns={columns} 
        rowKey="indicationTagId" 
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

      {/* 源数据别名 Modal */}
      <Dialog
        header="源数据适应症（别名）"
        visible={aliasModalVisible}
        onClose={() => setAliasModalVisible(false)}
        footer={null}
        width={800}
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
            onChange: (pageInfo) => fetchAliasList(currentTagId!, pageInfo.current, pageInfo.pageSize)
          }}
        />
      </Dialog>
    </Card>
  );
};

export default IndicationDatabase;
