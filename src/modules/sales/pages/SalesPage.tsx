'use client';

import {
  DollarOutlined,
  ShoppingCartOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Card, Col, Row, Statistic } from 'antd';

import { Typography } from '@/components/Typography';

export default function SalesPage() {
  return (
    <div>
      <Typography variant="heading1" className="mb-6">
        Sales Dashboard
      </Typography>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={8}>
          <Card>
            <Statistic
              title="Total Revenue"
              value={112893}
              precision={2}
              prefix={<DollarOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <Card>
            <Statistic
              title="Total Orders"
              value={1234}
              prefix={<ShoppingCartOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <Card>
            <Statistic
              title="Total Customers"
              value={567}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
