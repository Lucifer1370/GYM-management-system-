import { useEffect, useState } from "react";
import AdminLayout from "../layouts/AdminLayout";
import api from "../services/api";

const METHODS = ["Cash", "UPI", "Card"];
const MEMBERSHIP_PRICES = { Monthly: 999, Quarterly: 2699, "Half-Yearly": 4999, Yearly: 8999 };

function AddPaymentModal({ members, onClose, onSuccess }) {
  const [form, setForm] = useState({ memberId: "", amount: "", paymentMethod: "Cash", membershipType: "Monthly" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const updated = { ...form, [e.target.name]: e.target.value };
    // Auto-fill amount from membership type
    if (e.target.name === "membershipType") {
      updated.amount = MEMBERSHIP_PRICES[e.target.value] || "";
    }
    setForm(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/payments", form);
      onSuccess();
      onClose();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to record payment.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h2 className="modal-title">💳 Record Payment</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div className="form-group">
              <label className="form-label">Member *</label>
              <select id="pay-member" name="memberId" value={form.memberId}
                onChange={handleChange} className="form-select" required>
                <option value="">Select a member</option>
                {members.map((m) => (
                  <option key={m._id} value={m._id}>{m.fullName} — {m.phone}</option>
                ))}
              </select>
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Membership Plan *</label>
                <select id="pay-membership" name="membershipType" value={form.membershipType}
                  onChange={handleChange} className="form-select" required>
                  <option value="Monthly">Monthly</option>
                  <option value="Quarterly">Quarterly</option>
                  <option value="Half-Yearly">Half-Yearly</option>
                  <option value="Yearly">Yearly</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Amount (₹) *</label>
                <input id="pay-amount" name="amount" type="number" placeholder="999"
                  value={form.amount} onChange={handleChange}
                  className="form-input" required />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Payment Method *</label>
              <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
                {METHODS.map((m) => (
                  <label key={m} style={{
                    flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
                    gap: 8, padding: "10px", borderRadius: 8, cursor: "pointer",
                    border: `1px solid ${form.paymentMethod === m ? "var(--accent)" : "var(--border)"}`,
                    background: form.paymentMethod === m ? "rgba(108,99,255,0.12)" : "rgba(255,255,255,0.03)",
                    color: form.paymentMethod === m ? "#fff" : "var(--text-secondary)",
                    fontSize: 13, fontWeight: 600, transition: "all 0.15s",
                  }}>
                    <input type="radio" name="paymentMethod" value={m}
                      checked={form.paymentMethod === m}
                      onChange={handleChange} style={{ display: "none" }} />
                    {m === "Cash" ? "💵" : m === "UPI" ? "📱" : "💳"} {m}
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={loading}>Cancel</button>
            <button id="pay-submit-btn" type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? (
                <><div className="spinner" style={{ width: 14, height: 14, borderWidth: 2 }} /> Recording...</>
              ) : "Record Payment"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Payments() {
  const [payments, setPayments] = useState([]);
  const [members, setMembers]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [pRes, mRes] = await Promise.all([
        api.get("/payments"),
        api.get("/members"),
      ]);
      setPayments(pRes.data.payments || []);
      setMembers(mRes.data.members || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const totalRevenue = payments.reduce((sum, p) => sum + (p.amount || 0), 0);
  const cashRevenue  = payments.filter((p) => p.paymentMethod === "Cash").reduce((s, p) => s + p.amount, 0);
  const upiRevenue   = payments.filter((p) => p.paymentMethod === "UPI").reduce((s, p) => s + p.amount, 0);
  const cardRevenue  = payments.filter((p) => p.paymentMethod === "Card").reduce((s, p) => s + p.amount, 0);

  const methodIcon = { Cash: "💵", UPI: "📱", Card: "💳" };
  const methodBadge = { Cash: "badge-green", UPI: "badge-blue", Card: "badge-purple" };

  return (
    <AdminLayout>
      <div className="page-header">
        <h1>Payments</h1>
        <p>Track all membership payments and revenue.</p>
      </div>

      {/* Revenue Stats */}
      <div className="stats-grid" style={{ marginBottom: 20 }}>
        <div className="stat-card green">
          <div className="stat-icon green">💰</div>
          <p className="stat-label">Total Revenue</p>
          <p className="stat-value">₹{totalRevenue.toLocaleString("en-IN")}</p>
        </div>
        <div className="stat-card purple">
          <div className="stat-icon purple">📑</div>
          <p className="stat-label">Total Transactions</p>
          <p className="stat-value">{payments.length}</p>
        </div>
        <div className="stat-card blue">
          <div className="stat-icon blue">💵</div>
          <p className="stat-label">Cash</p>
          <p className="stat-value">₹{cashRevenue.toLocaleString("en-IN")}</p>
        </div>
        <div className="stat-card yellow">
          <div className="stat-icon yellow" style={{ background: "var(--yellow-bg)" }}>📱</div>
          <p className="stat-label">UPI + Card</p>
          <p className="stat-value">₹{(upiRevenue + cardRevenue).toLocaleString("en-IN")}</p>
        </div>
      </div>

      {/* Action Bar */}
      <div className="action-bar">
        <span style={{ fontSize: 14, color: "var(--text-muted)" }}>
          {payments.length} payment{payments.length !== 1 ? "s" : ""} recorded
        </span>
        <button id="add-payment-btn" className="btn btn-primary" onClick={() => setShowModal(true)}>
          ➕ Record Payment
        </button>
      </div>

      {/* Table */}
      <div className="card">
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Member</th>
                <th>Plan</th>
                <th>Amount</th>
                <th>Method</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    {[160, 100, 80, 80, 100].map((w, j) => (
                      <td key={j}><div className="skeleton" style={{ height: 14, width: w, borderRadius: 4 }} /></td>
                    ))}
                  </tr>
                ))
              ) : payments.length === 0 ? (
                <tr>
                  <td colSpan="5">
                    <div className="empty-state">
                      <div className="empty-state-icon">💳</div>
                      <p>No payments recorded yet. Click &quot;Record Payment&quot; to add one.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                payments.map((p) => (
                  <tr key={p._id}>
                    <td>
                      <div className="member-cell">
                        <div className="member-avatar" style={{ fontSize: 11 }}>
                          {(p.member?.fullName || "?").split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)}
                        </div>
                        <div>
                          <div className="member-name">{p.member?.fullName || "Unknown"}</div>
                          <div className="member-email">{p.member?.phone || ""}</div>
                        </div>
                      </div>
                    </td>
                    <td><span className="badge badge-purple">{p.membershipType}</span></td>
                    <td>
                      <span style={{ fontWeight: 700, color: "var(--green)", fontSize: 15 }}>
                        ₹{p.amount?.toLocaleString("en-IN")}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${methodBadge[p.paymentMethod]}`}>
                        {methodIcon[p.paymentMethod]} {p.paymentMethod}
                      </span>
                    </td>
                    <td>
                      {new Date(p.paymentDate).toLocaleDateString("en-IN", {
                        day: "2-digit", month: "short", year: "numeric"
                      })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <AddPaymentModal
          members={members}
          onClose={() => setShowModal(false)}
          onSuccess={fetchAll}
        />
      )}
    </AdminLayout>
  );
}

export default Payments;