import React from "react";
import styles from "../styles/live.module.css";

const today = new Date().toISOString().split("T")[0];

// Leagues supported by free tier
const LEAGUE_CODES = ["PL", "PD", "SA", "BL1", "FL1"];

export async function getServerSideProps() {
  const API_KEY = "232c41c0d1b940c1b8e6c7ae5798b77b";

  let allMatches = [];
  let allStandings = [];

  try {
    for (let i = 0; i < LEAGUE_CODES.length; i++) {
      // Fetch matches
      const res = await fetch(
        `https://api.football-data.org/v4/competitions/${LEAGUE_CODES[i]}/matches?dateFrom=${today}&dateTo=${today}`,
        { headers: { "X-Auth-Token": API_KEY } }
      );
      const data = await res.json();
      if (data.matches) allMatches = allMatches.concat(data.matches);

      // Fetch standings
      try {
        const standingsRes = await fetch(
          `https://api.football-data.org/v4/competitions/${LEAGUE_CODES[i]}/standings`,
          { headers: { "X-Auth-Token": API_KEY } }
        );
        const standingsData = await standingsRes.json();
        if (standingsData.standings && standingsData.standings[0]) {
          allStandings.push({
            competition: standingsData.competition.name,
            table: standingsData.standings[0].table
          });
        }
      } catch (err) {
        console.error("Standings fetch failed for", LEAGUE_CODES[i]);
      }
    }

    return { props: { matches: allMatches, standings: allStandings } };
  } catch (error) {
    console.error(error);
    return { props: { matches: [], standings: [] } };
  }
}

export default function Live({ matches, standings }) {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Football Matches for Today</h1>

      {matches.length === 0 ? (
        <p className={styles.noData}>No matches are scheduled for today</p>
      ) : (
        <ul className={styles.matchList}>
          {matches.map(match => {
            const matchDate = new Date(match.utcDate);
            const localDate = matchDate.toLocaleDateString();
            const localTime = matchDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

            return (
              <li key={match.id} className={styles.matchCard}>
                <div className={styles.teams}>
                  <span>{match.homeTeam.name}</span>
                  <span className={styles.score}>
                    {match.score.fullTime.home ?? match.score.halfTime.home ?? 0}
                  </span>
                  <span>-</span>
                  <span className={styles.score}>
                    {match.score.fullTime.away ?? match.score.halfTime.away ?? 0}
                  </span>
                  <span>{match.awayTeam.name}</span>
                </div>
                <div className={styles.matchInfo}>
                  <span>Date: {localDate}</span>
                  <span>Time: {localTime}</span>
                  <span>Status: {match.status}</span>
                  <span>Competition: {match.competition.name}</span>
                </div>
              </li>
            )
          })}
        </ul>
      )}

      <div className={styles.standings}>
        <h2>League Standings</h2>
        {standings.length === 0 ? (
          <p className={styles.noData}>No standings data available</p>
        ) : (
          standings.map(league => (
            <div key={league.competition} className={styles.leagueTable}>
              <h3>{league.competition}</h3>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Pos</th>
                    <th>Team</th>
                    <th>MP</th>
                    <th>W</th>
                    <th>D</th>
                    <th>L</th>
                    <th>GF</th>
                    <th>GA</th>
                    <th>Pts</th>
                  </tr>
                </thead>
                <tbody>
                  {league.table.map(team => (
                    <tr key={team.team.id}>
                      <td>{team.position}</td>
                      <td>{team.team.name}</td>
                      <td>{team.playedGames}</td>
                      <td>{team.won}</td>
                      <td>{team.draw}</td>
                      <td>{team.lost}</td>
                      <td>{team.goalsFor}</td>
                      <td>{team.goalsAgainst}</td>
                      <td>{team.points}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
