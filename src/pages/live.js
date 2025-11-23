// pages/live.js
import React from "react";
import styles from "../styles/live.module.css";

const API_KEY = "af2aa3a86b48c0b3e4ea990982a03c8138256a2b53b7c9a672baf1fc85770461";

// Leagues/competitions codes
const COMPETITIONS = [
  352, // Rwanda Premier League (example)
  1,   // FIFA World Cup
  2,   // UEFA Champions League
  3,   // CAF Champions League
  39, 140, 78, 135, 61, 2  // Top European leagues + UEFA CL
];

export default function Live({ matches }) {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Global Football Live Matches</h1>
      {matches.length === 0 ? (
        <p className={styles.noData}>No matches available</p>
      ) : (
        <ul className={styles.matchList}>
          {matches.map((item) => {
            const match = item.fixture;
            const home = item.teams.home.name;
            const away = item.teams.away.name;
            const scoreHome = item.goals.home;
            const scoreAway = item.goals.away;
            const status = item.fixture.status.short;
            const league = item.league.name;
            const lineupHome = item.lineups?.home?.map(p => p.player.name).join(", ") || "No lineup";
            const lineupAway = item.lineups?.away?.map(p => p.player.name).join(", ") || "No lineup";

            return (
              <li key={match.id} className={styles.matchCard}>
                <div className={styles.teams}>
                  {home} <span className={styles.score}>{scoreHome != null ? scoreHome : 0}</span> - <span className={styles.score}>{scoreAway != null ? scoreAway : 0}</span> {away}
                </div>
                <div className={styles.time}>Status: {status} | Date: {match.date}</div>
                <div className={styles.league}>Competition: {league}</div>
                <div className={styles.lineup}>
                  Home lineup: {lineupHome} <br />
                  Away lineup: {lineupAway}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

// SSR fetch
export async function getServerSideProps() {
  const currentYear = new Date().getFullYear();
  let allMatches = [];

  for (const league of COMPETITIONS) {
    try {
      const res = await fetch(`https://v3.football.api-sports.io/fixtures?league=${league}&season=${currentYear}`, {
        headers: { "x-apisports-key": API_KEY }
      });
      const data = await res.json();
      if (data.response) allMatches = allMatches.concat(data.response);
    } catch (err) {
      console.error(`Error fetching league ${league}:`, err);
    }
  }

  return { props: { matches: allMatches } };
}
