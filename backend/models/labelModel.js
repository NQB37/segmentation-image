import mongoose from 'mongoose';
const { Schema } = mongoose;
const labelSchema = new Schema(
    {
        title: { type: String, required: true },
        color: { type: String, required: true },
    },
    { timestamps: true },
);

export default mongoose.model('Label', labelSchema);
