import Member from "../models/Member.js";

// ================= RENEW MEMBERSHIP =================
export const renewMembership = async (req, res) => {
    try {

        const { membershipType } = req.body;

        const member = await Member.findById(req.params.id);

        if (!member) {
            return res.status(404).json({
                success: false,
                message: "Member not found",
            });
        }

        let expiryDate = new Date();

        // If membership is still active, extend from current expiry
        if (member.expiryDate > new Date()) {
            expiryDate = new Date(member.expiryDate);
        }

        switch (membershipType) {
            case "Monthly":
                expiryDate.setMonth(expiryDate.getMonth() + 1);
                break;

            case "Quarterly":
                expiryDate.setMonth(expiryDate.getMonth() + 3);
                break;

            case "Half-Yearly":
                expiryDate.setMonth(expiryDate.getMonth() + 6);
                break;

            case "Yearly":
                expiryDate.setFullYear(expiryDate.getFullYear() + 1);
                break;

            default:
                return res.status(400).json({
                    success: false,
                    message: "Invalid Membership Type",
                });
        }

        member.membershipType = membershipType;
        member.expiryDate = expiryDate;
        member.status = "Active";

        await member.save();

        res.status(200).json({
            success: true,
            message: "Membership renewed successfully",
            member,
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message,
        });

    }
};