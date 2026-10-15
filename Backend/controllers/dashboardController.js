import Member from "../models/Member.js";
import Attendance from "../models/Attendance.js";

export const getDashboardStats = async (req, res) => {
    try {

        const totalMembers = await Member.countDocuments();

        const activeMembers = await Member.countDocuments({
            status: "Active",
        });

        const expiredMembers = await Member.countDocuments({
            status: "Expired",
        });

        const today = new Date();
        today.setHours(0,0,0,0);

        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate()+1);

        const todayAttendance = await Attendance.countDocuments({
            date:{
                $gte:today,
                $lt:tomorrow
            }
        });

        res.status(200).json({
            success:true,
            data:{
                totalMembers,
                activeMembers,
                expiredMembers,
                todayAttendance,
            }
        });

    } catch(error){

        res.status(500).json({
            success:false,
            message:error.message
        });

    }
};