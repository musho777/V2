'use client';

import { SearchOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Select } from '@/components/Select/Select';
import { ResponsiveTable } from '@/components/Table/Table';
import { Typography } from '@/components/Typography';

import { useSearchClient } from '../../hooks/useSearchClient';
import { useStreets } from '../../hooks/useStreets';
import type { Customer } from '../../services/customer.service';

import styles from './SearchClientPage.module.scss';

export default function SearchClientPage() {
  const {
    formParams,
    tableData,
    loading,
    pagination,
    handleFormChange,
    handleSearch,
    handleIdSearch,
    handleReset,
    handleTableChange,
  } = useSearchClient();

  // Fetch streets with cityId=1
  const { streets, loading: streetsLoading } = useStreets(1);

  const columns: ColumnsType<Customer> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: 'Անվանում',
      dataIndex: 'name',
      key: 'name',
      width: 200,
    },
    {
      title: 'Հեռախոսահամար',
      dataIndex: 'phoneNumbers',
      key: 'phoneNumbers',
      width: 150,
    },
    {
      title: 'Հասցե',
      dataIndex: 'serviceAddresses',
      key: 'serviceAddresses',
    },
  ];

  return (
    <div className={styles.searchClientPage}>
      <div className={styles.pageWrapper}>
        <div className={styles.cardHeader}>
          <Typography variant="heading2">Որոնել բաժանորդ</Typography>
          <Typography variant="body1">Ընտրեք բաժինը և լրացրեք</Typography>
        </div>

        <div className={styles.formContainer}>
          {/* First Row - ID, Search Icon, Reset Button */}
          <div className={styles.formRow}>
            <Input
              height={48}
              width={320}
              label="ID"
              placeholder="Որոնել ID"
              className={styles.idInput}
              value={formParams.id}
              onChange={(e) => handleFormChange('id', e.target.value)}
            />
            <Button
              icon={<SearchOutlined />}
              className={styles.searchIconButton}
              buttonType="action"
              onClick={handleIdSearch}
            />
            <Button
              className={styles.resetButton}
              buttonType="primary"
              variant="link"
              onClick={handleReset}
            >
              Մաքրել բոլորը
            </Button>
          </div>

          {/* Second Row - Անվանում, Փողոց, Տուն */}
          <div className={styles.formRow}>
            <Input
              height={48}
              width={320}
              label="Անվանում"
              placeholder="Բաժանորդի անվան"
              className={styles.fullWidthInput}
              value={formParams.name}
              onChange={(e) => handleFormChange('name', e.target.value)}
            />
            <Select
              placeholder="Փողոց"
              label="Փողոց"
              height={48}
              width={320}
              className={styles.selectInput}
              value={formParams.streetId}
              onChange={(value) => handleFormChange('streetId', value)}
              options={streets.map((street) => ({
                value: street.id,
                label: street.name,
              }))}
              loading={streetsLoading}
            />
            <Select
              placeholder="Տուն"
              label="Տուն"
              height={48}
              width={320}
              className={styles.selectInput}
              value={formParams.buildingId}
              onChange={(value) => handleFormChange('buildingId', value)}
            />
          </div>

          {/* Third Row - Բնակարան, Հեռախոսահամարի, Search Button */}
          <div className={styles.formRow}>
            <Input
              height={48}
              width={320}
              placeholder="Բնակարան"
              label="Բնակարան"
              className={styles.fullWidthInput}
              value={formParams.flat}
              onChange={(e) => handleFormChange('flat', e.target.value)}
            />
            <Input
              height={48}
              width={320}
              placeholder="Հեռախոսահամարի"
              label="Հեռախոսահամարի"
              className={styles.fullWidthInput}
              value={formParams.phoneNumber}
              onChange={(e) => handleFormChange('phoneNumber', e.target.value)}
            />
            <Button
              buttonType="action"
              className={styles.searchButton}
              onClick={handleSearch}
            >
              Որոնել
            </Button>
          </div>
        </div>

        <div className={styles.tableContainer}>
          <ResponsiveTable
            columns={columns}
            dataSource={tableData}
            rowKey="id"
            loading={loading}
            pagination={pagination}
            onChange={handleTableChange}
            locale={{
              emptyText: 'Տվյալներ չկան',
            }}
          />
        </div>
      </div>
    </div>
  );
}
