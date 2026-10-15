import { useEffect, useState } from "react";
import AdminLayout from "../layouts/AdminLayout";
import api from "../services/api";

const STATS = [
  { key: "totalMembers",    label: "Total Members",    icon: "👥", color: "purple" },
  { key: "activeMembers",   label: "Active Members",   icon: "✅", color: "green"  },
  { key: "expiredMembers",  label: "Expired Members",  icon: "⚠️", color: "red"    },
  { key: "todayAttendance", label: "Today's Check-ins", icon: "📋", color: "blue"   },
];

function SkeletonCard() {
  return (
    <div className="stat-card" style={{ padding: 20 }}>
      <div className="skeleton" style={{ width: 44, height: 44, borderRadius: 10, marginBottom: 14 }} />
      <div className="skeleton" style={{ width: "60%", height: 12, marginBottom: 8 }} />
      <div className="skeleton" style={{ width: "40%", height: 32 }} />
    </div>
  );
}

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchDashboard(); }, []);

  const fetchDashboard = async () => {
    try {
      const res = await api.get("/dashboard");
      setStats(res.data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="page-header">
        <h1>Dashboard</h1>
        <p>Welcome back! Here&apos;s what&apos;s happening at PowerFit today.</p>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        {loading
          ? STATS.map((s) => <SkeletonCard key={s.key} />)
          : STATS.map((s) => (
              <div key={s.key} className={`stat-card ${s.color}`}>
                <div className={`stat-icon ${s.color}`}>{s.icon}</div>
                <p className="stat-label">{s.label}</p>
                <p className="stat-value">{stats?.[s.key] ?? 0}</p>
              </div>
            ))}
      </div>

      {/* Quick Tips */}
      <div className="card animate-slide-up" style={{ marginTop: 8 }}>
        <div className="card-header">
          <span className="card-title">⚡ Quick Overview</span>
        </div>
        <div style={{ padding: "20px 24px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
          {[
            { icon: "📅", label: "Mark attendance for today's members via the Attendance page." },
            { icon: "➕", label: "Add new gym members and manage their subscriptions." },
            { icon: "💳", label: "Track all payments and monthly revenue in Payments." },
          ].map((tip, i) => (
            <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
              <span style={{ fontSize: 20 }}>{tip.icon}</span>
              <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.5 }}>{tip.label}</p>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}

export default Dashboard;