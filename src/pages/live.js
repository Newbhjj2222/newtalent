import React, { useEffect, useState } from "react";

export default function Live() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLiveMatches = async () => {
    try {
      const res = await fetch("/api/live");
      const data = await res.json();
      setMatches(data.response || []);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveMatches();
    const interval = setInterval(fetchLiveMatches, 15000); // refresh buri 15 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <h1>Live Football Scores</h1>
      {loading && <p>Loading...</p>}
      {matches.length === 0 && !loading && <p>No live matches currently.</p>}
      <ul>
        {matches.map((match) => (
          <li key={match.fixture.id} style={{ margin: "15px 0", borderBottom: "1px solid #ddd", paddingBottom: "10px" }}>
            <strong>{match.teams.home.name}</strong> {match.goals.home} - {match.goals.away} <strong>{match.teams.away.name}</strong>
            <p>Time: {match.fixture.status.elapsed}'</p>
            <p>League: {match.league.name}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
