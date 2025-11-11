'use client';

import type { ReactNode } from 'react';
import React, { useEffect, useState } from 'react';

import type { TableProps } from 'antd';
import { Card, Table as AntTable } from 'antd';
import type { ColumnsType } from 'antd/es/table';

import { Typography } from '../Typography';

import styles from './styles.module.scss';

export interface ResponsiveTableProps<T> extends TableProps<T> {
  columns: ColumnsType<T>;
  mobileColumnsCount?: number;
}

type RecordType = Record<string, unknown>;

const renderValue = (value: unknown): ReactNode => {
  if (value === null || value === undefined) {
    return '';
  }
  if (React.isValidElement(value)) {
    return value;
  }
  if (typeof value === 'object') {
    return JSON.stringify(value);
  }
  return String(value);
};

export function ResponsiveTable<T extends object>({
  columns,
  mobileColumnsCount = 4,
  ...restProps
}: ResponsiveTableProps<T>) {
  const [isMobile, setIsMobile] = useState(false);
  const [expandedRowKeys, setExpandedRowKeys] = useState<React.Key[]>([]);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const getExpandedRowRender = (record: T) => {
    const hiddenColumns = columns.slice(mobileColumnsCount);

    return (
      <div className="space-y-2 pl-4">
        {hiddenColumns
          .filter(
            (col): col is typeof col & { dataIndex?: string } =>
              'dataIndex' in col,
          )
          .map((col, index) => {
            const colKey = col.key || col.dataIndex;
            const recordData = record as RecordType;
            const dataIndex = col.dataIndex as string;
            const value = col.render
              ? col.render(recordData[dataIndex], record, index)
              : recordData[dataIndex];

            return (
              <div
                key={String(colKey)}
                className="flex justify-between border-b pb-2"
              >
                <Typography
                  variant="label"
                  as="span"
                  className="font-medium text-gray-600"
                >
                  {col.title as string}:
                </Typography>
                <Typography variant="body2" as="span" className="text-gray-900">
                  {renderValue(value)}
                </Typography>
              </div>
            );
          })}
      </div>
    );
  };

  const mobileColumns = isMobile
    ? columns.slice(0, mobileColumnsCount)
    : columns;

  const tableProps: TableProps<T> = {
    ...restProps,
    columns: mobileColumns,
    scroll: { x: 'max-content', ...restProps.scroll },
  };

  if (isMobile && columns.length > mobileColumnsCount) {
    tableProps.expandable = {
      expandedRowRender: getExpandedRowRender,
      expandedRowKeys,
      onExpandedRowsChange: (keys) => setExpandedRowKeys(keys as React.Key[]),
      expandRowByClick: true,
      showExpandColumn: false,
      ...restProps.expandable,
    };
  }

  return (
    <div
      className={`${isMobile ? 'overflow-x-auto' : ''} ${styles.tableWrapper}`}
    >
      <Card styles={{ body: { padding: 0 } }}>
        <AntTable<T> {...tableProps} />
      </Card>
    </div>
  );
}
