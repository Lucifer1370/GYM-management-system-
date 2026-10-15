import { useEffect, useState } from "react";
import AdminLayout from "../layouts/AdminLayout";
import api from "../services/api";

function Attendance() {
  const [members, setMembers]               = useState([]);
  const [todayAttendance, setTodayAttendance] = useState([]);
  const [loading, setLoading]               = useState(true);
  const [marking, setMarking]               = useState(null); // memberId being marked

  useEffect(() => {
    Promise.all([fetchMembers(), fetchTodayAttendance()]).finally(() => setLoading(false));
  }, []);

  const fetchMembers = async () => {
    try {
      const res = await api.get("/members");
      setMembers(res.data.members || []);
    } catch (error) { console.error(error); }
  };

  const fetchTodayAttendance = async () => {
    try {
      const res = await api.get("/attendance/today");
      setTodayAttendance(res.data.attendance || []);
    } catch (error) { console.error(error); }
  };

  const markAttendance = async (memberId) => {
    setMarking(memberId);
    try {
      await api.post("/attendance", { memberId });
      await fetchTodayAttendance();
    } catch (error) {
      alert(error.response?.data?.message || "Could not mark attendance.");
    } finally {
      setMarking(null);
    }
  };

  const presentCount = todayAttendance.length;
  const totalCount   = members.length;
  const percentage   = totalCount > 0 ? Math.round((presentCount / totalCount) * 100) : 0;

  const getInitials = (name = "") =>
    name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

  return (
    <AdminLayout>
      <div className="page-header">
        <h1>Attendance</h1>
        <p>Mark and track member check-ins for today.</p>
      </div>

      {/* Summary bar */}
      <div className="stats-grid" style={{ gridTemplateColumns: "repeat(3, 1fr)", marginBottom: 20 }}>
        <div className="stat-card blue">
          <div className="stat-icon blue">👥</div>
          <p className="stat-label">Total Members</p>
          <p className="stat-value">{totalCount}</p>
        </div>
        <div className="stat-card green">
          <div className="stat-icon green">✅</div>
          <p className="stat-label">Present Today</p>
          <p className="stat-value">{presentCount}</p>
        </div>
        <div className="stat-card purple">
          <div className="stat-icon purple">📊</div>
          <p className="stat-label">Attendance Rate</p>
          <p className="stat-value">{percentage}%</p>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <span className="card-title">Today&apos;s Attendance</span>
          <span style={{ fontSize: 13, color: "var(--text-muted)" }}>
            {new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          </span>
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Member</th>
                <th>Phone</th>
                <th>Membership</th>
                <th className="text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i}>
                    {[160, 100, 100, 100].map((w, j) => (
                      <td key={j}><div className="skeleton" style={{ height: 14, width: w, borderRadius: 4 }} /></td>
                    ))}
                  </tr>
                ))
              ) : members.length === 0 ? (
                <tr>
                  <td colSpan="4">
                    <div className="empty-state">
                      <div className="empty-state-icon">📋</div>
                      <p>No members found. Add members first.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                members.map((m) => {
                  const present = todayAttendance.find((a) => a.member?._id === m._id);
                  return (
                    <tr key={m._id}>
                      <td>
                        <div className="member-cell">
                          <div className="member-avatar">{getInitials(m.fullName)}</div>
                          <span className="member-name">{m.fullName}</span>
                        </div>
                      </td>
                      <td>{m.phone}</td>
                      <td><span className="badge badge-purple">{m.membershipType}</span></td>
                      <td className="text-center">
                        {present ? (
                          <span className="present-tag">Present</span>
                        ) : (
                          <button
                            id={`mark-btn-${m._id}`}
                            className="btn btn-ghost btn-sm"
                            onClick={() => markAttendance(m._id)}
                            disabled={marking === m._id}
                          >
                            {marking === m._id ? (
                              <><div className="spinner" style={{ width: 12, height: 12, borderWidth: 2 }} /> Marking...</>
                            ) : (
                              "Mark Present"
                            )}
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}

export default Attendance;