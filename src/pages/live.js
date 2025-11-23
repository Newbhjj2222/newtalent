import React, { useState } from "react";
import styles from "../styles/live.module.css";

const LEAGUE_CODES = [
  { code: "PL", name: "Premier League" },
  { code: "PD", name: "La Liga" },
  { code: "SA", name: "Serie A" },
  { code: "BL1", name: "Bundesliga" },
  { code: "FL1", name: "Ligue 1" },
  { code: "CL", name: "Champions League" },
  { code: "EL", name: "Europa League" },
  { code: "WC", name: "World Cup" },
  // ongeramo andi uko ubishaka
];

export default function Live({ matches, standings }) {
  const [selectedCompetition, setSelectedCompetition] = useState("");

  const filteredMatches = matches.filter(
    (m) =>
      selectedCompetition === "" ||
      m.competition.code === selectedCompetition
  );

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Football Matches</h1>

      <div className={styles.filter}>
        <label htmlFor="competition">Choose a competition: </label>
        <select
          id="competition"
          value={selectedCompetition}
          onChange={(e) => setSelectedCompetition(e.target.value)}
          className={styles.select}
        >
          <option value="">All</option>
          {LEAGUE_CODES.map((l) => (
            <option key={l.code} value={l.code}>
              {l.name}
            </option>
          ))}
        </select>
      </div>

      <ul className={styles.matchList}>
        {filteredMatches.map((match) => {
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
          );
        })}
      </ul>

      {/* standings bisareshwa nk’uko wabikoze */}
    </div>
  );
}
