import Payment from "../models/payment.js";
import Member from "../models/Member.js";


// ================= MEMBER PAYMENT HISTORY =================
export const getMemberPayments = async (req, res) => {

    try {

        const payments = await Payment.find({
            member: req.params.id,
        }).sort({ paymentDate: -1 });

        res.status(200).json({
            success: true,
            count: payments.length,
            payments,
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message,
        });

    }

};

// ================= MONTHLY REVENUE =================
export const getMonthlyRevenue = async (req, res) => {

    try {

        const revenue = await Payment.aggregate([
            {
                $group: {
                    _id: {
                        year: { $year: "$paymentDate" },
                        month: { $month: "$paymentDate" },
                    },
                    totalRevenue: {
                        $sum: "$amount",
                    },
                    totalPayments: {
                        $sum: 1,
                    },
                },
            },
            {
                $sort: {
                    "_id.year": -1,
                    "_id.month": -1,
                },
            },
        ]);

        res.status(200).json({
            success: true,
            revenue,
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message,
        });

    }

};
// ================= GET ALL PAYMENTS =================
export const getAllPayments = async (req, res) => {
    try {

        const payments = await Payment.find()
            .populate("member", "fullName phone membershipType")
            .sort({ paymentDate: -1 });

        res.status(200).json({
            success: true,
            count: payments.length,
            payments,
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message,
        });

    }
};



export const createPayment = async (req, res) => {
    try {
        const {
            memberId,
            amount,
            paymentMethod,
            membershipType,
        } = req.body;

        const member = await Member.findById(memberId);

        if (!member) {
            return res.status(404).json({
                success: false,
                message: "Member not found",
            });
        }

        const payment = await Payment.create({
            member: memberId,
            amount,
            paymentMethod,
            membershipType,
        });

        res.status(201).json({
            success: true,
            message: "Payment added successfully",
            payment,
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message,
        });

    }
};