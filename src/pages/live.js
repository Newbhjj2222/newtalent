import React from "react";
import styles from "../styles/live.module.css";

export async function getServerSideProps() {
  try {
    const res = await fetch("https://api.football-data.org/v4/matches?status=LIVE", {
      headers: {
        "X-Auth-Token": "232c41c0d1b940c1b8e6c7ae5798b77b"
      }
    });

    const data = await res.json();

    return {
      props: {
        matches: data.matches || []
      }
    };
  } catch (error) {
    console.error(error);
    return {
      props: {
        matches: []
      }
    };
  }
}

export default function Live({ matches }) {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Live Football Scores</h1>

      {matches.length === 0 ? (
        <p className={styles.noMatches}>No live matches currently.</p>
      ) : (
        <ul className={styles.matchList}>
          {matches.map((match) => (
            <li key={match.id} className={styles.matchCard}>
              <div className={styles.teams}>
                {match.homeTeam.name}{" "}
                <span className={styles.score}>{match.score.fullTime.home ?? match.score.halfTime.home ?? 0}</span>
                {" - "}
                <span className={styles.score}>{match.score.fullTime.away ?? match.score.halfTime.away ?? 0}</span>{" "}
                {match.awayTeam.name}
              </div>
              <div className={styles.time}>
                Status: {match.status}
              </div>
              <div className={styles.league}>Competition: {match.competition.name}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
