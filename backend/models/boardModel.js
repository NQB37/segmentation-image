const mongoose = require('mongoose');
const Schema = mongoose.Schema;
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

module.exports = mongoose.model('Board', boardSchema);
