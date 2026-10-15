import mongoose from "mongoose";

const memberSchema = new mongoose.Schema(
    {
        fullName: {
            type: String,
            required: true,
            trim: true,
        },

        email: {
            type: String,
            unique: true,
            lowercase: true,
            trim: true,
        },

        phone: {
            type: String,
            required: true,
        },

        age: {
            type: Number,
            required: true,
        },

        gender: {
            type: String,
            enum: ["Male", "Female", "Other"],
            required: true,
        },

        height: {
            type: Number,
        },

        weight: {
            type: Number,
        },

        membershipType: {
            type: String,
            enum: ["Monthly", "Quarterly", "Half-Yearly", "Yearly"],
            required: true,
        },

        joiningDate: {
            type: Date,
            default: Date.now,
        },

        expiryDate: {
            type: Date,
            required: true,
        },

        status: {
            type: String,
            enum: ["Active", "Expired"],
            default: "Active",
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model("Member", memberSchema);