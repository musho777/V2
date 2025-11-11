import { useMutation, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';

import { personalService } from '../services/personal.service';
import type { ProfilePhoto } from '../types/personal.types';

export const useUploadProfilePhoto = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ProfilePhoto) =>
      personalService.uploadProfilePhoto(data),
    onSuccess: (data, variables) => {
      message.success('Profile photo uploaded successfully');
      void queryClient.invalidateQueries({
        queryKey: ['userProfilePhoto'],
      });
    },
    onError: (error: any) => {
      message.error(
        error?.response?.data?.message || 'Failed to create language',
      );
    },
  });
};
