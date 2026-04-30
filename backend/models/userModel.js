import mongoose from 'mongoose';
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    email: {
      type: String,
      unique: true,
      required: true,
    },
    name: { type: String, required: true },
    password: { type: String, required: true },
    avatar: { type: String, required: false },
  },
  { timestamps: true },
);

export default mongoose.model('User', userSchema);
