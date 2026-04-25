import Post from '../models/Post';
import User from '../models/User';

export async function paginatePosts(page: number = 1, limit: number = 5) {
  const skip = (page - 1) * limit;
  const total = await Post.countDocuments();
  const posts = await Post.find()
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  return { posts, total, totalPages: Math.ceil(total / limit) };
}

export async function getAllPostsExcluding(userId: string) {
  const posts = await Post.find({ userId: { $ne: userId } })
    .sort({ createdAt: -1 });

  const postsWithAuthors = await Promise.all(
    posts.map(async (post) => {
      const author = await User.findById(post.userId).select('name');
      return {
        ...post.toObject(),
        authorName: author?.name ?? 'Unknown',
      };
    })
  );

  return postsWithAuthors;
}

export async function createPost(userId: string, title: string, description: string) {
  return await Post.create({ userId, title, description });
}

export async function deletePost(postId: string, userId: string) {
  return await Post.findOneAndDelete({ _id: postId, userId });
}

export async function getPostById(postId: string) {
  return await Post.findById(postId);
}