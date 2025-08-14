import React, { createContext, useState, useContext, useEffect } from "react";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(false);
  const [fontSize, setFontSize] = useState("16px");
  const [fontStyle, setFontStyle] = useState("Arial");
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("themeSettings");
    if (savedTheme) {
      const parsed = JSON.parse(savedTheme);
      if (parsed.darkMode !== undefined) setDarkMode(parsed.darkMode);
      if (parsed.fontSize) setFontSize(parsed.fontSize);
      if (parsed.fontStyle) setFontStyle(parsed.fontStyle);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "themeSettings",
      JSON.stringify({ darkMode, fontSize, fontStyle })
    );
  }, [darkMode, fontSize, fontStyle]);

  // Kwandika CSS variables ku body yose
  useEffect(() => {
    document.body.style.backgroundColor = darkMode ? "#121212" : "#ffffff";
    document.body.style.color = darkMode ? "#ffffff" : "#000000";
    document.body.style.fontSize = fontSize;
    document.body.style.fontFamily = fontStyle;
    document.body.style.transition = "all 0.3s ease";
  }, [darkMode, fontSize, fontStyle]);

  const toggleDarkMode = () => setDarkMode(prev => !prev);
  const changeFontSize = (size) => setFontSize(size);
  const changeFontStyle = (style) => setFontStyle(style);

  const settingsBoxStyle = {
    position: "fixed",
    top: "60px",
    right: "20px",
    background: darkMode ? "#1e1e1e" : "#f9f9f9",
    color: darkMode ? "#fff" : "#000",
    padding: "15px",
    borderRadius: "10px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
    zIndex: 9999,
    width: "220px",
    fontSize: "14px",
  };

  const settingsButtonStyle = {
    position: "fixed",
    top: "15px",
    right: "20px",
    background: darkMode ? "#444" : "#eee",
    color: darkMode ? "#fff" : "#000",
    border: "none",
    padding: "8px 12px",
    borderRadius: "5px",
    cursor: "pointer",
    zIndex: 10000,
  };

  return (
    <ThemeContext.Provider
      value={{
        darkMode,
        toggleDarkMode,
        fontSize,
        changeFontSize,
        fontStyle,
        changeFontStyle,
      }}
    >
      {/* Theme Button */}
      <button
        style={settingsButtonStyle}
        onClick={() => setShowSettings(!showSettings)}
      >
        {showSettings ? "Close Theme" : "Theme"}
      </button>

      {/* Settings Box */}
      {showSettings && (
        <div style={settingsBoxStyle}>
          <div style={{ marginBottom: "10px" }}>
            <strong>Theme Mode:</strong><br />
            <button
              onClick={toggleDarkMode}
              style={{
                marginTop: "5px",
                background: darkMode ? "#555" : "#ddd",
                color: darkMode ? "#fff" : "#000",
                border: "none",
                padding: "5px 10px",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              {darkMode ? "Light Mode" : "Dark Mode"}
            </button>
          </div>

          <div style={{ marginBottom: "10px" }}>
            <strong>Font Size:</strong><br />
            <select
              value={fontSize}
              onChange={(e) => changeFontSize(e.target.value)}
              style={{
                width: "100%",
                padding: "5px",
                borderRadius: "4px",
                marginTop: "5px",
              }}
            >
              <option value="14px">Small</option>
              <option value="16px">Medium</option>
              <option value="20px">Large</option>
              <option value="24px">Extra Large</option>
            </select>
          </div>

          <div>
            <strong>Font Style:</strong><br />
            <select
              value={fontStyle}
              onChange={(e) => changeFontStyle(e.target.value)}
              style={{
                width: "100%",
                padding: "5px",
                borderRadius: "4px",
                marginTop: "5px",
              }}
            >
              <option value="Arial">Arial</option>
              <option value="'Times New Roman', serif">Times New Roman</option>
              <option value="Verdana">Verdana</option>
              <option value="'Courier New', monospace">Courier New</option>
            </select>
          </div>
        </div>
      )}

      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
