import mongoose, { Schema } from 'mongoose';

const CommentSchema = new Schema({
  postId: { type: String, required: true, index: true },
  userId: { type: String, required: true },
  content: { type: String, required: true },
}, { timestamps: true });

export default mongoose.models.Comment ?? mongoose.model('Comment', CommentSchema);