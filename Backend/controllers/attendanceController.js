import Attendance from "../models/Attendance.js";
import Member from "../models/Member.js";

// ================= MARK ATTENDANCE =================




// ================= TODAY'S ATTENDANCE =================
// ================= MEMBER ATTENDANCE =================
export const getMemberAttendance = async (req, res) => {

    try {

        const attendance = await Attendance.find({
            member: req.params.id,
        }).sort({ date: -1 });

        res.status(200).json({
            success: true,
            count: attendance.length,
            attendance,
        });

    } catch (error) {

        res.status(500).json({
            success:false,
            message:error.message
        });

    }

};



export const getTodayAttendance = async (req, res) => {
    try {

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);

        const attendance = await Attendance.find({
            date: {
                $gte: today,
                $lt: tomorrow,
            },
        }).populate("member", "fullName phone membershipType");

        res.status(200).json({
            success: true,
            count: attendance.length,
            attendance,
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message,
        });

    }
};




export const markAttendance = async (req, res) => {
    try {
        const { memberId } = req.body;

        // Check member
        const member = await Member.findById(memberId);

        if (!member) {
            return res.status(404).json({
                success: false,
                message: "Member not found",
            });
        }

        // Today's Date
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Tomorrow's Date
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);

        // Check duplicate attendance
        const existingAttendance = await Attendance.findOne({
            member: memberId,
            date: {
                $gte: today,
                $lt: tomorrow,
            },
        });

        if (existingAttendance) {
            return res.status(400).json({
                success: false,
                message: "Attendance already marked today",
            });
        }

        // Save attendance
        const attendance = await Attendance.create({
            member: memberId,
        });

        res.status(201).json({
            success: true,
            message: "Attendance marked successfully",
            attendance,
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message,
        });

    }
};