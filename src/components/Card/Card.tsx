'use client';

import React from 'react';

import { Card } from 'antd';

interface CardStyleConfig {
  body?: React.CSSProperties;
  actions?: React.CSSProperties;
  header?: React.CSSProperties;
  cover?: React.CSSProperties;
  extra?: React.CSSProperties;
  title?: React.CSSProperties;
}
interface AssignCardProps {
  title?: string;
  extra?: React.ReactNode;
  actions?: React.ReactNode[];
  styles?: CardStyleConfig;
  style?: React.CSSProperties;
  loading?: boolean;
  className?: string;
  renderBody?: () => React.ReactNode;
}

export const CustomCard: React.FC<AssignCardProps> = ({
  title,
  extra,
  actions,
  renderBody,
  styles,
  style,
  loading,
  className,
  ...rest
}) => {
  return (
    <Card
      loading={loading}
      title={title}
      style={style}
      styles={styles}
      className={className}
      extra={extra}
      actions={actions}
      {...rest}
    >
      {renderBody && renderBody()}
    </Card>
  );
};
