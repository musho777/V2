'use client';

import { useState } from 'react';

import { Button } from '@/components/Button';
import { TextEditor } from '@/components/TextEditor';
import { Typography } from '@/components/Typography';
import { formatDateTime } from '@/utils/utils';

import { useAddCommentMutation } from '../../hooks/useAddComment';

import styles from './styles.module.scss';

export interface Comment {
  id: number;
  comment: string;
  createdAt: string;
  user: {
    id: number;
    name: string;
  };
}

interface CommentSectionProps {
  ticketId: string;
  comments: Comment[];
}

export const CommentSection: React.FC<CommentSectionProps> = ({
  ticketId,
  comments,
}) => {
  const [commentContent, setCommentContent] = useState('');
  const { mutate: addComment, isPending } = useAddCommentMutation(ticketId);

  const handleSubmit = () => {
    if (!commentContent.trim()) return;

    addComment(
      {
        ticketId: Number(ticketId),
        comment: commentContent,
      },
      {
        onSuccess: () => {
          setCommentContent('');
        },
      },
    );
  };

  return (
    <div className={styles.commentSection}>
      <Typography variant="heading4" className={styles.title}>
        Comments ({comments.length})
      </Typography>

      <div className={styles.addComment}>
        <TextEditor
          height={150}
          placeholder="Add a comment..."
          value={commentContent}
          onChange={(content) => setCommentContent(content)}
        />
        <div className={styles.buttonContainer}>
          <Button
            buttonType="action"
            height={36}
            onClick={handleSubmit}
            disabled={isPending || !commentContent.trim()}
          >
            {isPending ? 'Adding...' : 'Add Comment'}
          </Button>
        </div>
      </div>

      <div className={styles.commentsList}>
        {comments.map((comment) => (
          <div key={comment.id} className={styles.comment}>
            <div className={styles.commentHeader}>
              <Typography variant="body2" className={styles.userName}>
                {comment.user.name}
              </Typography>
              <Typography variant="textPlaceholder" color="muted">
                {formatDateTime(comment.createdAt)}
              </Typography>
            </div>
            <div
              className={styles.commentContent}
              dangerouslySetInnerHTML={{ __html: comment.comment }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
