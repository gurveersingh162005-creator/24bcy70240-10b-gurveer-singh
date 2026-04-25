import Comment from '../models/Comment';
import User from '../models/User';

export async function getCommentsByPost(postId: string) {
  const comments = await Comment.find({ postId })
    .sort({ createdAt: -1 });

  const commentsWithAuthors = await Promise.all(
    comments.map(async (comment) => {
      const author = await User.findById(comment.userId).select('name');
      return {
        ...comment.toObject(),
        authorName: author?.name ?? 'Unknown',
      };
    })
  );

  return commentsWithAuthors;
}

export async function createComment(postId: string, userId: string, content: string) {
  return await Comment.create({ postId, userId, content });
}

export async function deleteComment(commentId: string, userId: string) {
  return await Comment.findOneAndDelete({ _id: commentId, userId });
}