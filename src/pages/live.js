import React from "react";
import styles from "../styles/live.module.css";

const today = new Date().toISOString().split("T")[0];

export async function getServerSideProps() {
  const API_KEY = "232c41c0d1b940c1b8e6c7ae5798b77b";

  try {
    const matchesRes = await fetch(
      "https://api.football-data.org/v4/matches?dateFrom=" + today + "&dateTo=" + today,
      { headers: { "X-Auth-Token": API_KEY } }
    );
    const matchesData = await matchesRes.json();

    const standingsRes = await fetch(
      "https://api.football-data.org/v4/competitions/PL/standings",
      { headers: { "X-Auth-Token": API_KEY } }
    );
    const standingsData = await standingsRes.json();

    return {
      props: {
        matches: matchesData.matches || [],
        standings: standingsData.standings && standingsData.standings[0] ? standingsData.standings[0].table : []
      }
    };
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
          {matches.map(function(match) {
            return (
              <li key={match.id} className={styles.matchCard}>
                <div className={styles.teams}>
                  {match.homeTeam.name} 
                  <span className={styles.score}>
                    {match.score.fullTime.home != null ? match.score.fullTime.home : match.score.halfTime.home != null ? match.score.halfTime.home : 0}
                  </span>
                  - 
                  <span className={styles.score}>
                    {match.score.fullTime.away != null ? match.score.fullTime.away : match.score.halfTime.away != null ? match.score.halfTime.away : 0}
                  </span>
                  {match.awayTeam.name}
                </div>
                <div className={styles.time}>Status: {match.status}</div>
                <div className={styles.league}>Competition: {match.competition.name}</div>
              </li>
            )
          })}
        </ul>
      )}

      <div className={styles.standings}>
        <h2>League Standings for Premier League</h2>
        {standings.length === 0 ? (
          <p className={styles.noData}>No standings data available</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Position</th>
                <th>Team</th>
                <th>MP</th>
                <th>W</th>
                <th>D</th>
                <th>L</th>
                <th>GF</th>
                <th>GA</th>
                <th>Points</th>
              </tr>
            </thead>
            <tbody>
              {standings.map(function(team) {
                return (
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
                )
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
