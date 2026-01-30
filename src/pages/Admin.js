import { useState } from "react";
import { db } from "@/components/firebase";
import {
  collection,
  getDocs,
  doc,
  deleteDoc,
} from "firebase/firestore";

export async function getServerSideProps() {
  try {
    // Fetch all depositers from Firestore
    const snap = await getDocs(collection(db, "depositers"));
    const users = snap.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    return { props: { users } };
  } catch (err) {
    console.error(err);
    return { props: { users: [], error: "Failed to fetch users" } };
  }
}

export default function AdminPageSSR({ users: initialUsers, error }) {
  const [users, setUsers] = useState(initialUsers);

  // Delete a user (client-side)
  async function handleDelete(id) {
    if (!confirm("Are you sure you want to delete this user?")) return;
    try {
      await deleteDoc(doc(db, "depositers", id));
      setUsers(users.filter(u => u.id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete user");
    }
  }

  // Inline CSS
  const containerStyle = {
    minHeight: "100vh",
    padding: "40px",
    fontFamily: "Segoe UI, sans-serif",
    background: "linear-gradient(135deg,#fdfbfb,#ebedee)",
  };

  const cardStyle = {
    maxWidth: "800px",
    margin: "20px auto",
    background: "#fff",
    borderRadius: "15px",
    boxShadow: "0 10px 25px rgba(0,0,0,.1)",
    padding: "20px",
  };

  const headingStyle = { fontSize: "1.5rem", marginBottom: "20px" };

  const tableStyle = { width: "100%", borderCollapse: "collapse" };

  const thStyle = { textAlign: "left", borderBottom: "2px solid #ddd", padding: "10px" };
  const tdStyle = { borderBottom: "1px solid #eee", padding: "10px" };

  const buttonStyle = {
    padding: "5px 10px",
    background: "#ff4d4f",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  };

  if (error) return <div style={containerStyle}>❌ {error}</div>;

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h2 style={headingStyle}>All Depositors (SSR)</h2>
        {users.length === 0 ? (
          <p>No users found</p>
        ) : (
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>Username</th>
                <th style={thStyle}>NES</th>
                <th style={thStyle}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id}>
                  <td style={tdStyle}>{user.username}</td>
                  <td style={tdStyle}>{user.nes || 0}</td>
                  <td style={tdStyle}>
                    <button style={buttonStyle} onClick={() => handleDelete(user.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
