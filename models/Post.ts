import mongoose, { Schema } from 'mongoose';

const PostSchema = new Schema({
  userId: { type: String, required: true, index: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
}, { timestamps: true });

export default mongoose.models.Post ?? mongoose.model('Post', PostSchema);