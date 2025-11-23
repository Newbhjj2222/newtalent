import React, { useState } from "react";
import styles from "../styles/live.module.css";

const today = new Date().toISOString().split("T")[0];

// Amarushanwa (competitions) free tier zimenyerewe na football‑data.org
const COMPETITIONS = [
  { code: "PL", name: "Premier League" },
  { code: "SA", name: "Serie A" },
  { code: "PD", name: "La Liga" },
  { code: "BL1", name: "Bundesliga" },
  { code: "FL1", name: "Ligue 1" },
  { code: "DED", name: "Eredivisie" },
  { code: "PPL", name: "Primeira Liga" },
  { code: "WC", name: "World Cup" },
  { code: "EC", name: "European Championship" },
  { code: "CL", name: "Champions League" },
];

export async function getServerSideProps() {
  const API_KEY = "232c41c0d1b940c1b8e6c7ae5798b77b";

  let allMatches = [];
  let allStandings = [];

  try {
    for (const comp of COMPETITIONS) {
      // Fetch imikino y'irushanwa (competition) kuri uyu munsi
      const resMatches = await fetch(
        `https://api.football-data.org/v4/competitions/${comp.code}/matches?dateFrom=${today}&dateTo=${today}`,
        { headers: { "X-Auth-Token": API_KEY } }
      );
      const dataMatches = await resMatches.json();
      if (dataMatches.matches) {
        // Tanga n'irushanwa buri mukino (competition) ni byiza
        const matchesWithComp = dataMatches.matches.map(m => ({
          ...m,
          competition: { code: comp.code, name: comp.name },
        }));
        allMatches = allMatches.concat(matchesWithComp);
      }

      // Fetch standings (urukurikirane) rw’irushanwa
      try {
        const resStand = await fetch(
          `https://api.football-data.org/v4/competitions/${comp.code}/standings`,
          { headers: { "X-Auth-Token": API_KEY } }
        );
        const dataStand = await resStand.json();
        if (dataStand.standings && dataStand.standings[0]) {
          allStandings.push({
            competition: comp,
            table: dataStand.standings[0].table,
          });
        }
      } catch (err) {
        console.error("Standings fetch failed for competition", comp.code, err);
      }
    }

    return {
      props: {
        matches: allMatches || [],
        standings: allStandings || [],
      },
    };
  } catch (error) {
    console.error("getServerSideProps error:", error);
    return { props: { matches: [], standings: [] } };
  }
}

export default function Live({ matches = [], standings = [] }) {
  const [selectedCompetition, setSelectedCompetition] = useState("");

  // Safety: matches cyangwa standings zishobora kuba array y'ubusa
  const filteredMatches = matches.filter(
    m => !selectedCompetition || m.competition?.code === selectedCompetition
  );

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Football Matches for Today</h1>

      <div className={styles.filter}>
        <label htmlFor="competition">Select Competition: </label>
        <select
          id="competition"
          className={styles.select}
          value={selectedCompetition}
          onChange={e => setSelectedCompetition(e.target.value)}
        >
          <option value="">All</option>
          {COMPETITIONS.map(c => (
            <option key={c.code} value={c.code}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {filteredMatches.length === 0 ? (
        <p className={styles.noData}>No matches scheduled for selected competition (or today).</p>
      ) : (
        <ul className={styles.matchList}>
          {filteredMatches.map(match => {
            const matchDate = new Date(match.utcDate);
            const localDate = matchDate.toLocaleDateString();
            const localTime = matchDate.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            });

            return (
              <li key={match.id} className={styles.matchCard}>
                <div className={styles.teams}>
                  <span>{match.homeTeam.name}</span>
                  <span className={styles.score}>
                    {match.score.fullTime?.home ?? match.score.halfTime?.home ?? 0}
                  </span>
                  <span>-</span>
                  <span className={styles.score}>
                    {match.score.fullTime?.away ?? match.score.halfTime?.away ?? 0}
                  </span>
                  <span>{match.awayTeam.name}</span>
                </div>
                <div className={styles.matchInfo}>
                  <span>Date: {localDate}</span>
                  <span>Time: {localTime}</span>
                  <span>Status: {match.status}</span>
                  <span>Competition: {match.competition?.name}</span>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <div className={styles.standings}>
        <h2>Standings</h2>
        {standings.length === 0 ? (
          <p className={styles.noData}>No standings data available</p>
        ) : (
          standings.map(league => (
            <div key={league.competition.code} className={styles.leagueTable}>
              <h3>{league.competition.name}</h3>
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
