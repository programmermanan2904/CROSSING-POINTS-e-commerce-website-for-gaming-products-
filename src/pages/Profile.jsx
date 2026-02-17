import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import "../styles/profile.css";

export default function Profile() {
  const { user } = useContext(AuthContext);

  return (
    <section className="profile-page">
      <div className="profile-card">
        <h2>My Profile</h2>

        <form>
          <label>Name</label>
          <input value={user?.name || ""} disabled />

          <label>Email</label>
          <input value={user?.email || ""} disabled />

          <label>Phone</label>
          <input value={user?.phone || ""} disabled />

          <label>Date of Birth</label>
          <input value={user?.dob || ""} disabled />

          <button className="save-btn" disabled>
            Edit Profile (Coming Soon)
          </button>
        </form>

        <p className="profile-msg">
          Profile editing will be available soon.
        </p>
      </div>
    </section>
  );
}
