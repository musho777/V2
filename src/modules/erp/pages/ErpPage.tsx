'use client';

import { Card, Empty } from 'antd';

import styles from './ErpPage.module.scss';

export default function ErpPage() {
  return (
    <div className={styles.erpPage}>
      <Card>
        <Empty description="ERP module coming soon" />
      </Card>
    </div>
  );
}
