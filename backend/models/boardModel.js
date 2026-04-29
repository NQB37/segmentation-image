import mongoose from 'mongoose';
const { Schema } = mongoose;
const boardSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
        },
        image: { type: String, required: true },
        ownerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        membersId: [
            { type: Schema.Types.ObjectId, ref: 'User', required: false },
        ],
        labelsId: [
            { type: Schema.Types.ObjectId, ref: 'Label', required: false },
        ],
        annotationImage: { type: String, required: false },
        segmentImage: { type: String, required: false },
    },
    { timestamps: true },
);

export default mongoose.model('Board', boardSchema);
