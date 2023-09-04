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
            required: true,
            validate: {
                validator: function (value) {
                    return value !== null && value !== undefined && value.trim() !== "";
                },
                message: "Debe introducir una imagen",
            },
        },
    },
    {
        timestamps: true,
    }
);

const Doubt = mongoose.model("Doubt", DoubtSchema);

module.exports = Doubt;
