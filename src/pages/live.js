"use client";
import React, { useEffect, useState } from "react";
import styles from "../styles/live.module.css";

const API_KEY = "af2aa3a86b48c0b3e4ea990982a03c8138256a2b53b7c9a672baf1fc85770461";

// Leagues/competitions codes (API-Football ids)
const COMPETITIONS = [
  352, // Rwanda Premier League (example id)
  1,   // FIFA World Cup
  2,   // UEFA Champions League
  3,   // CAF Champions League
  39, 140, 78, 135, 61, 2, // Top 6 European leagues + UEFA CL
];

export default function Live() {
  const [matches, setMatches] = useState([]);

  const fetchMatches = async () => {
    try {
      let allMatches = [];
      for (let i = 0; i < COMPETITIONS.length; i++) {
        const res = await fetch(`https://v3.football.api-sports.io/fixtures?league=${COMPETITIONS[i]}&season=2025`, {
          headers: { "x-apisports-key": API_KEY }
        });
        const data = await res.json();
        if (data.response) {
          allMatches = allMatches.concat(data.response);
        }
      }
      setMatches(allMatches);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchMatches();
    const interval = setInterval(fetchMatches, 5000); // Refresh every 5s
    return () => clearInterval(interval);
  }, []);

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
