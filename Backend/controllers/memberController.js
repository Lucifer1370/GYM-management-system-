import Member from "../models/Member.js";

// ================= ADD MEMBER =================
// ================= GET ALL MEMBERS =================
export const getMembers = async (req, res) => {
    try {

        const members = await Member.find().sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: members.length,
            members,
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message,
        });

    }
};



// ================= GET SINGLE MEMBER =================
export const getMemberById = async (req, res) => {
    try {

        const member = await Member.findById(req.params.id);

        if (!member) {
            return res.status(404).json({
                success: false,
                message: "Member not found",
            });
        }

        res.status(200).json({
            success: true,
            member,
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message,
        });

    }
};



// ================= UPDATE MEMBER =================
export const updateMember = async (req, res) => {
    try {

        const member = await Member.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true,
            }
        );

        if (!member) {
            return res.status(404).json({
                success: false,
                message: "Member not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Member updated successfully",
            member,
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message,
        });

    }
};

// ================= DELETE MEMBER =================
export const deleteMember = async (req, res) => {
    try {

        const member = await Member.findById(req.params.id);

        if (!member) {
            return res.status(404).json({
                success: false,
                message: "Member not found",
            });
        }

        await member.deleteOne();

        res.status(200).json({
            success: true,
            message: "Member deleted successfully",
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message,
        });

    }
};

// ================= SEARCH MEMBER =================

export const searchMembers = async (req, res) => {
    try {

        const keyword = req.query.keyword || "";

        const members = await Member.find({
            $or: [
                {
                    fullName: {
                        $regex: keyword,
                        $options: "i",
                    },
                },
                {
                    phone: {
                        $regex: keyword,
                        $options: "i",
                    },
                },
            ],
        });

        res.status(200).json({
            success: true,
            count: members.length,
            members,
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message,
        });

    }
};

export const addMember = async (req, res) => {
    try {
        const {
            fullName,
            email,
            phone,
            age,
            gender,
            height,
            weight,
            membershipType,
        } = req.body;

        // Check required fields
        if (
            !fullName ||
            !phone ||
            !age ||
            !gender ||
            !membershipType
        ) {
            return res.status(400).json({
                success: false,
                message: "Please fill all required fields",
            });
        }

        // Check existing member by phone or email
        const existingMember = await Member.findOne({
            $or: [{ phone }, { email }]
        });

        if (existingMember) {
            return res.status(400).json({
                success: false,
                message: existingMember.phone === phone 
                    ? "Member with this phone number already exists" 
                    : "Member with this email already exists",
            });
        }

        const joiningDate = new Date();

        // Expiry Date
        const expiryDate = new Date(joiningDate);

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
                break;
        }

        const member = await Member.create({
            fullName,
            email,
            phone,
            age,
            gender,
            height,
            weight,
            membershipType,
            joiningDate,
            expiryDate,
        });

        res.status(201).json({
            success: true,
            message: "Member added successfully",
            member,
        });

    } catch (error) {
        console.error("Error in addMember controller:", error);
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};