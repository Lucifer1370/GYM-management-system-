import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
    {
        member: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Member",
            required: true,
        },

        amount: {
            type: Number,
            required: true,
        },

        paymentMethod: {
            type: String,
            enum: ["Cash", "UPI", "Card"],
            required: true,
        },

        membershipType: {
            type: String,
            enum: ["Monthly", "Quarterly", "Half-Yearly", "Yearly"],
            required: true,
        },

        paymentDate: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model("Payment", paymentSchema);