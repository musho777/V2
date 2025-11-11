import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';

import { skillService } from '../services/skill.service';
import type { OwnSkillsRequest, UserSkillRequest } from '../types/skill.types';

/**
 * Hook to fetch user skills
 * @param userId - User ID to fetch skills for
 */
export const useUserSkills = (userId: number | null | undefined) => {
  return useQuery({
    queryKey: ['userSkills', userId],
    queryFn: () => {
      if (!userId) return Promise.resolve([]);
      return skillService.getUserSkills(userId);
    },
    enabled: !!userId,
  });
};

/**
 * Hook to create skills for a user
 */
export const useCreateUserSkills = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UserSkillRequest) => skillService.createUserSkills(data),
    onSuccess: (_, variables) => {
      message.success('Skill created successfully');
      void queryClient.invalidateQueries({
        queryKey: ['userSkills', variables.userId],
      });
    },
    onError: (error: any) => {
      message.error(error?.response?.data?.message || 'Failed to create skill');
    },
  });
};

/**
 * Hook to create own skills
 */
export const useCreateOwnSkills = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: OwnSkillsRequest) => skillService.createOwnSkills(data),
    onSuccess: () => {
      message.success('Skill created successfully');
      void queryClient.invalidateQueries({
        queryKey: ['userSkills'],
      });
    },
    onError: (error: any) => {
      message.error(error?.response?.data?.message || 'Failed to create skill');
    },
  });
};

/**
 * Hook to delete a skill
 */
export const useDeleteSkill = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ skillId }: { userId: number; skillId: number }) =>
      skillService.deleteSkill(skillId),
    onSuccess: (_, variables) => {
      message.success('Skill deleted successfully');
      void queryClient.invalidateQueries({
        queryKey: ['userSkills', variables.userId],
      });
    },
    onError: (error: any) => {
      message.error(error?.response?.data?.message || 'Failed to delete skill');
    },
  });
};
