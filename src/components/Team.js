import { useEffect, useState } from "react";
import { FaWhatsapp } from "react-icons/fa";
import { db } from "./firebase"; // Hindura niba path itari yo
import { collection, getDocs } from "firebase/firestore";

export default function Team() {
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "Team"));
        const members = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setTeam(members);
      } catch (error) {
        console.error("Error fetching team members:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTeam();
  }, []);

  if (loading) {
    return <p className="team-loading">Loading team...</p>;
  }

  if (team.length === 0) {
    return <p className="team-empty">No Team member</p>;
  }

  return (
    <div className="team-container">
      <h2>OUR AUTHORS AND PARTNERS</h2>

      <div className="team-table-wrapper">
        <table className="team-table">
          <thead>
            <tr>
              <th>Photo</th>
              <th>Name</th>
              <th>Whatsapp</th>
            </tr>
          </thead>
          <tbody>
            {team.map((member) => (
              <tr key={member.id}>
                <td>
                  <img
                    src={member.photo}
                    alt={member.name}
                    className="team-photo"
                  />
                </td>
                <td>{member.name}</td>
                <td>
                  <a
                    href={`https://wa.me/${member.whatsapp.replace(/\D/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FaWhatsapp /> <span>{member.whatsapp}</span>
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <style jsx>{`
        /* Container */
        .team-container {
          padding: 1.5rem;
          max-width: 1200px;
          margin: 0 auto;
        }

        /* Heading */
        .team-container h2 {
          font-size: 1.5rem;
          font-weight: bold;
          text-align: center;
          margin-bottom: 1.5rem;
          color: #111;
        }

        /* Table wrapper */
        .team-table-wrapper {
          width: 100%;
          overflow-x: auto;
          background: #fff;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }

        /* Table style */
        .team-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.9rem;
        }

        /* Table head */
        .team-table thead {
          background-color: #f3f4f6;
        }

        .team-table th {
          padding: 0.5rem 1rem;
          text-align: left;
          font-weight: 600;
          color: #374151;
          border-bottom: 1px solid #e5e7eb;
        }

        /* Table body */
        .team-table td {
          padding: 0.5rem 1rem;
          vertical-align: middle;
          border-bottom: 1px solid #e5e7eb;
        }

        /* Row hover */
        .team-table tbody tr:hover {
          background-color: #f9fafb;
        }

        /* Circular photo */
        .team-photo {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          object-fit: cover;
          display: block;
          cursor: pointer;
          transition: transform 0.2s ease;
        }

        .team-photo:hover {
          transform: scale(1.15);
        }

        /* Whatsapp link */
        .team-table a {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          color: #16a34a;
          text-decoration: none;
          font-size: 0.875rem;
        }

        .team-table a:hover {
          text-decoration: underline;
        }

        /* Loading & Empty states */
        .team-loading,
        .team-empty {
          text-align: center;
          color: #555;
          margin-top: 1rem;
          font-size: 1rem;
        }

        /* Responsive for mobile */
        @media (max-width: 640px) {
          .team-table th,
          .team-table td {
            padding: 0.5rem;
            font-size: 0.8rem;
          }

          .team-photo {
            width: 28px;
            height: 28px;
          }
        }
      `}</style>
    </div>
  );
}
