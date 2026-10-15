import { useState, useEffect } from "react";
import api from "../services/api";

function AddMember({ member, onClose, fetchMembers }) {
  const isEdit = Boolean(member);

  const blank = {
    fullName: "", email: "", phone: "", age: "",
    gender: "", height: "", weight: "", membershipType: "Monthly",
  };

  const [formData, setFormData] = useState(blank);
  const [loading, setLoading]   = useState(false);

  useEffect(() => {
    if (member) {
      setFormData({
        fullName: member.fullName || "",
        email:    member.email    || "",
        phone:    member.phone    || "",
        age:      member.age      || "",
        gender:   member.gender   || "",
        height:   member.height   || "",
        weight:   member.weight   || "",
        membershipType: member.membershipType || "Monthly",
      });
    } else {
      setFormData(blank);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [member]);

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isEdit) {
        await api.put(`/members/${member._id}`, formData);
      } else {
        await api.post("/members", formData);
      }
      fetchMembers();
      onClose();
    } catch (error) {
      alert(error.response?.data?.message || "Failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h2 className="modal-title">{isEdit ? "✏️ Edit Member" : "➕ Add New Member"}</h2>
          <button className="modal-close" onClick={onClose} id="modal-close-btn">✕</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <input id="member-fullname" name="fullName" type="text" placeholder="John Doe"
                  value={formData.fullName} onChange={handleChange}
                  className="form-input" required />
              </div>
              <div className="form-group">
                <label className="form-label">Email *</label>
                <input id="member-email" name="email" type="email" placeholder="john@email.com"
                  value={formData.email} onChange={handleChange}
                  className="form-input" required />
              </div>
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Phone *</label>
                <input id="member-phone" name="phone" type="text" placeholder="9876543210"
                  value={formData.phone} onChange={handleChange}
                  className="form-input" required />
              </div>
              <div className="form-group">
                <label className="form-label">Age *</label>
                <input id="member-age" name="age" type="number" placeholder="25"
                  value={formData.age} onChange={handleChange}
                  className="form-input" required />
              </div>
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Height (cm)</label>
                <input id="member-height" name="height" type="number" placeholder="170"
                  value={formData.height} onChange={handleChange}
                  className="form-input" />
              </div>
              <div className="form-group">
                <label className="form-label">Weight (kg)</label>
                <input id="member-weight" name="weight" type="number" placeholder="70"
                  value={formData.weight} onChange={handleChange}
                  className="form-input" />
              </div>
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Gender *</label>
                <select id="member-gender" name="gender" value={formData.gender}
                  onChange={handleChange} className="form-select" required>
                  <option value="">Select gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Membership *</label>
                <select id="member-membership" name="membershipType" value={formData.membershipType}
                  onChange={handleChange} className="form-select" required>
                  <option value="Monthly">Monthly</option>
                  <option value="Quarterly">Quarterly</option>
                  <option value="Half-Yearly">Half-Yearly</option>
                  <option value="Yearly">Yearly</option>
                </select>
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <button id="member-submit-btn" type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? (
                <><div className="spinner" style={{ width: 14, height: 14, borderWidth: 2 }} />
                  {isEdit ? "Updating..." : "Saving..."}</>
              ) : (isEdit ? "Update Member" : "Add Member")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddMember;