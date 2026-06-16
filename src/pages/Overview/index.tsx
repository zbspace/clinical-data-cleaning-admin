import React from 'react';
import { Card, Row, Col, Statistic } from 'tdesign-react';

const Overview: React.FC = () => {
  return (
    <div>
      <h2>总览</h2>
      <Row gutter={[16, 16]}>
        <Col span={3}>
          <Card bordered={false}>
            <Statistic title="待清洗公司" value={120} />
          </Card>
        </Col>
        <Col span={3}>
          <Card bordered={false}>
            <Statistic title="待清洗药品" value={345} />
          </Card>
        </Col>
        <Col span={3}>
          <Card bordered={false}>
            <Statistic title="待清洗适应症" value={56} />
          </Card>
        </Col>
        <Col span={3}>
          <Card bordered={false}>
            <Statistic title="待清洗研究中心" value={89} />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Overview;
