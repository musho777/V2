import { API_CONFIG } from '@/config/api.config';
import { httpClient } from '@/utils/httpClient';

const BASE_URL = API_CONFIG.BASE_URL;

interface AddCommentData {
  ticketId: number;
  comment: string;
}

export const commentService = {
  addComment: async (data: AddCommentData): Promise<void> => {
    await httpClient.post(`${BASE_URL}/pm/ticket/comment`, data);
  },
};
