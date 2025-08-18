import React, { useEffect, useState } from "react";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { FaWhatsapp } from "react-icons/fa";
import "./Team.css"; // ✅ Import CSS

const Team = () => {
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);
  const db = getFirestore();

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
  }, [db]);

  if (loading) {
    return (
      <p className="text-center text-gray-500 mt-6">Loading team...</p>
    );
  }

  if (team.length === 0) {
    return (
      <p className="text-center text-gray-600 mt-6">No Team member</p>
    );
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
                <td data-label="Photo">
                  <img src={member.photo} alt={member.name} />
                </td>
                <td data-label="Name">{member.name}</td>
                <td data-label="Whatsapp">
                  <a
                    href={`https://wa.me/${member.whatsapp.replace(/\D/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FaWhatsapp size={16} />
                    <span>{member.whatsapp}</span>
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Team;
