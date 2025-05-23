const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const labelSchema = new Schema(
    {
        title: { type: String, required: true },
        color: { type: String, required: true },
    },
    { timestamps: true },
);

module.exports = mongoose.model('Label', labelSchema);
