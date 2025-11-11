import { useMutation, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';

import { notificationService } from '@/components/Notification/Notification';

import { commentService } from '../services/comment.service';

interface AddCommentData {
  ticketId: number;
  comment: string;
}

interface TicketData {
  comments?: Array<{
    id: number;
    comment: string;
    createdAt: string;
    user: { id: number; name: string };
  }>;
  [key: string]: unknown;
}

export const useAddCommentMutation = (ticketId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AddCommentData) => commentService.addComment(data),
    onMutate: async (newComment) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['pm', 'ticket', ticketId] });

      // Snapshot the previous value
      const previousTicket = queryClient.getQueryData<TicketData>([
        'pm',
        'ticket',
        ticketId,
      ]);

      // Optimistically update to the new value
      queryClient.setQueryData<TicketData>(['pm', 'ticket', ticketId], (old) => {
        if (!old) return old;

        const optimisticComment = {
          id: Date.now(), // Temporary ID
          comment: newComment.comment,
          createdAt: new Date().toISOString(),
          user: {
            id: 0, // Will be replaced with real data
            name: 'You',
          },
        };

        return {
          ...old,
          comments: [...(old.comments || []), optimisticComment],
        };
      });

      // Return a context object with the snapshotted value
      return { previousTicket };
    },
    onError: (error: unknown, _newComment, context) => {
      // Rollback on error
      if (context?.previousTicket) {
        queryClient.setQueryData(
          ['pm', 'ticket', ticketId],
          context.previousTicket,
        );
      }

      const errorMessage =
        (
          error as {
            response?: { data?: { message?: string } };
            message?: string;
          }
        )?.response?.data?.message ||
        (error as { message?: string })?.message ||
        'Failed to add comment';

      notificationService.error({
        message: 'Error',
        description: errorMessage,
      });
    },
    onSuccess: () => {
      // Refetch to get the real data from server
      void queryClient.invalidateQueries({ queryKey: ['pm', 'ticket', ticketId] });
      message.success('Comment added successfully');
    },
  });
};
