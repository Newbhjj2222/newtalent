import React from "react";
import styles from "../styles/live.module.css";

export async function getServerSideProps() {
  try {
    const res = await fetch("https://v3.football.api-sports.io/fixtures?live=all", {
      headers: {
        "x-apisports-key": "af2aa3a86b48c0b3e4ea990982a03c8138256a2b53b7c9a672baf1fc85770461"
      }
    });

    const data = await res.json();

    return {
      props: {
        matches: data.response || []
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
            <li key={match.fixture.id} className={styles.matchCard}>
              <div className={styles.teams}>
                {match.teams.home.name} <span className={styles.score}>{match.goals.home}</span>
                {" - "}
                <span className={styles.score}>{match.goals.away}</span> {match.teams.away.name}
              </div>
              <div className={styles.time}>Time: {match.fixture.status.elapsed}'</div>
              <div className={styles.league}>League: {match.league.name}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
