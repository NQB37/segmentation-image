const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const boardSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
        },
        image: { type: String, required: true },
        ownerId: { type: String, required: true },
        membersId: [{ type: String, required: false }],
        labelsId: [{ type: String, required: false }],
    },
    { timestamps: true },
);

module.exports = mongoose.model('Board', boardSchema);
