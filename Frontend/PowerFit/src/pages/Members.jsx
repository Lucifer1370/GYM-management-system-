import { useEffect, useState } from "react";
import AdminLayout from "../layouts/AdminLayout";
import api from "../services/api";
import AddMember from "./AddMember";

function Members() {
  const [members, setMembers]             = useState([]);
  const [loading, setLoading]             = useState(true);
  const [search, setSearch]               = useState("");
  const [showModal, setShowModal]         = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);

  useEffect(() => { fetchMembers(); }, []);

  const fetchMembers = async () => {
    setLoading(true);
    try {
      const res = await api.get("/members");
      setMembers(res.data.members || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const searchMembers = async (keyword) => {
    if (!keyword.trim()) { fetchMembers(); return; }
    try {
      const res = await api.get(`/members/search?keyword=${keyword}`);
      setMembers(res.data.members || []);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this member?")) return;
    try {
      await api.delete(`/members/${id}`);
      fetchMembers();
    } catch (error) {
      alert(error.response?.data?.message || "Delete failed.");
    }
  };

  const openAdd = () => { setSelectedMember(null); setShowModal(true); };
  const openEdit = (m) => { setSelectedMember(m); setShowModal(true); };
  const closeModal = () => { setShowModal(false); setSelectedMember(null); };

  const getInitials = (name = "") =>
    name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

  return (
    <AdminLayout>
      <div className="page-header">
        <h1>Members</h1>
        <p>Manage all gym members and their subscriptions.</p>
      </div>

      {/* Action Bar */}
      <div className="action-bar">
        <div className="search-bar">
          <span>🔍</span>
          <input
            id="member-search"
            type="text"
            placeholder="Search by name or phone..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); searchMembers(e.target.value); }}
          />
        </div>
        <button id="add-member-btn" className="btn btn-primary" onClick={openAdd}>
          ➕ Add Member
        </button>
      </div>

      {/* Table */}
      <div className="card">
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Member</th>
                <th>Phone</th>
                <th>Membership</th>
                <th>Status</th>
                <th>Expiry</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 6 }).map((__, j) => (
                      <td key={j}>
                        <div className="skeleton" style={{ height: 14, width: j === 0 ? 160 : 80, borderRadius: 4 }} />
                      </td>
                    ))}
                  </tr>
                ))
              ) : members.length === 0 ? (
                <tr>
                  <td colSpan="6">
                    <div className="empty-state">
                      <div className="empty-state-icon">👥</div>
                      <p>No members found. Add your first member!</p>
                    </div>
                  </td>
                </tr>
              ) : (
                members.map((m) => (
                  <tr key={m._id}>
                    <td>
                      <div className="member-cell">
                        <div className="member-avatar">{getInitials(m.fullName)}</div>
                        <div>
                          <div className="member-name">{m.fullName}</div>
                          <div className="member-email">{m.email}</div>
                        </div>
                      </div>
                    </td>
                    <td>{m.phone}</td>
                    <td>
                      <span className="badge badge-purple">{m.membershipType}</span>
                    </td>
                    <td>
                      <span className={`badge ${m.status === "Active" ? "badge-green" : "badge-red"}`}>
                        {m.status}
                      </span>
                    </td>
                    <td>{new Date(m.expiryDate).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</td>
                    <td className="text-center">
                      <div className="flex items-center gap-2" style={{ justifyContent: "center" }}>
                        <button className="btn btn-ghost btn-sm" onClick={() => openEdit(m)}>
                          ✏️ Edit
                        </button>
                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(m._id)}>
                          🗑️ Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer count */}
        {!loading && members.length > 0 && (
          <div style={{ padding: "12px 24px", borderTop: "1px solid var(--border)", fontSize: 13, color: "var(--text-muted)" }}>
            Showing {members.length} member{members.length !== 1 ? "s" : ""}
          </div>
        )}
      </div>

      {showModal && (
        <AddMember member={selectedMember} onClose={closeModal} fetchMembers={fetchMembers} />
      )}
    </AdminLayout>
  );
}

export default Members;