import { API_CONFIG } from '@/config/api.config';
import { httpClient } from '@/utils/httpClient';

import type { OwnSkillsRequest, UserSkillRequest } from '../types/skill.types';

const BASE_URL = API_CONFIG.BASE_URL;

export const skillService = {
  /**
   * Get user pending skills by user ID
   * @param userId - User ID
   */
  getUserSkills: async (userId: number): Promise<any> => {
    const response = await httpClient.get<any>(
      `${BASE_URL}/user/pending-skills/${userId}`,
    );
    return response;
  },

  /**
   * Create pending skills for a user
   * @param data - User skills request data
   */
  createUserSkills: async (data: UserSkillRequest): Promise<any> => {
    const response = await httpClient.post<any>(
      `${BASE_URL}/user/pending-skills`,
      data,
    );
    return response;
  },

  /**
   * Create own pending skills
   * @param data - Own skills request data
   */
  createOwnSkills: async (data: OwnSkillsRequest): Promise<any> => {
    const response = await httpClient.post<any>(
      `${BASE_URL}/user/pending-skills/own`,
      data,
    );
    return response;
  },

  /**
   * Delete a pending skill
   * @param skillId - Skill ID
   */
  deleteSkill: async (skillId: number): Promise<void> => {
    await httpClient.delete(`${BASE_URL}/user/pending-skills/${skillId}`);
  },
};
