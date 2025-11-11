'use client';

import { useEffect } from 'react';

import { notification } from 'antd';

type NotificationType = 'success' | 'info' | 'warning' | 'error';

interface NotificationConfig {
  message: string;
  description?: string;
}

let notificationApi: ReturnType<typeof notification.useNotification>[0] | null =
  null;

export const NotificationProvider = () => {
  const [api, contextHolder] = notification.useNotification();

  useEffect(() => {
    notificationApi = api;
  }, [api]);

  return <>{contextHolder}</>;
};

export const showNotification = (
  type: NotificationType,
  config: NotificationConfig,
) => {
  if (notificationApi) {
    notificationApi[type](config);
  }
};

export const notificationService = {
  success: (config: NotificationConfig) => showNotification('success', config),
  error: (config: NotificationConfig) => showNotification('error', config),
  info: (config: NotificationConfig) => showNotification('info', config),
  warning: (config: NotificationConfig) => showNotification('warning', config),
};
