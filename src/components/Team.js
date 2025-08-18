import React, { useEffect, useState } from "react";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { FaWhatsapp } from "react-icons/fa";

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
    return <p className="text-center text-gray-500 mt-6">Loading team...</p>;
  }

  if (team.length === 0) {
    return <p className="text-center text-gray-600 mt-6">No Team member</p>;
  }

  return (
    <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {team.map((member) => (
        <div
          key={member.id}
          className="bg-white rounded-2xl shadow-md p-4 flex flex-col items-center text-center"
        >
          <img
            src={member.photo}
            alt={member.name}
            className="w-24 h-24 rounded-full object-cover mb-4"
          />
          <h2 className="text-lg font-semibold">{member.name}</h2>
          <a
            href={`https://wa.me/${member.whatsapp.replace(/\D/g, "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-green-600 mt-2"
          >
            <FaWhatsapp size={20} />
            <span>{member.whatsapp}</span>
          </a>
        </div>
      ))}
    </div>
  );
};

export default Team;
