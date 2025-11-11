import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';

import { languageService } from '../services/language.service';
import type {
  OwnLanguagesRequest,
  UserLanguageRequest,
} from '../types/language.types';

/**
 * Hook to fetch user languages
 * @param userId - User ID to fetch languages for
 */
export const useUserLanguages = (userId: number | null | undefined) => {
  return useQuery({
    queryKey: ['userLanguages', userId],
    queryFn: () => {
      if (!userId) return Promise.resolve([]);
      return languageService.getUserLanguages(userId);
    },
    enabled: !!userId,
  });
};

/**
 * Hook to create languages for a user
 */
export const useCreateUserLanguages = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UserLanguageRequest) =>
      languageService.createUserLanguages(data),
    onSuccess: (_, variables) => {
      message.success('Language created successfully');
      void queryClient.invalidateQueries({
        queryKey: ['userLanguages', variables.userId],
      });
    },
    onError: (error: any) => {
      message.error(
        error?.response?.data?.message || 'Failed to create language',
      );
    },
  });
};

/**
 * Hook to create own languages
 */
export const useCreateOwnLanguages = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: OwnLanguagesRequest) =>
      languageService.createOwnLanguages(data),
    onSuccess: () => {
      message.success('Language created successfully');
      void queryClient.invalidateQueries({
        queryKey: ['userLanguages'],
      });
    },
    onError: (error: any) => {
      message.error(
        error?.response?.data?.message || 'Failed to create language',
      );
    },
  });
};

/**
 * Hook to delete a language
 */
export const useDeleteLanguage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ languageId }: { userId: number; languageId: number }) =>
      languageService.deleteLanguage(languageId),
    onSuccess: (_, variables) => {
      message.success('Language deleted successfully');
      void queryClient.invalidateQueries({
        queryKey: ['userLanguages', variables.userId],
      });
    },
    onError: (error: any) => {
      message.error(
        error?.response?.data?.message || 'Failed to delete language',
      );
    },
  });
};
