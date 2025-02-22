const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DoubtSchema = new Schema(
    {
        topic: String,
        question: String,
        resolved: Boolean,
        _idAnswer: [
            {
                type: Schema.Types.ObjectId,
                ref: "Answer",
            },
        ],
        _idUser: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
        imagePath: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

const Doubt = mongoose.model("Doubt", DoubtSchema);

module.exports = Doubt;
