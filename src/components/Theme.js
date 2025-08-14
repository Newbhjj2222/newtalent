import React, { createContext, useState, useContext, useEffect } from "react";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(false);
  const [fontSize, setFontSize] = useState("16px");
  const [fontStyle, setFontStyle] = useState("Arial");

  // Gusoma settings za theme muri localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem("themeSettings");
    if (savedTheme) {
      const { darkMode, fontSize, fontStyle } = JSON.parse(savedTheme);
      if (darkMode !== undefined) setDarkMode(darkMode);
      if (fontSize) setFontSize(fontSize);
      if (fontStyle) setFontStyle(fontStyle);
    }
  }, []);

  // Kubika theme muri localStorage no gushyira ku body
  useEffect(() => {
    localStorage.setItem(
      "themeSettings",
      JSON.stringify({ darkMode, fontSize, fontStyle })
    );

    // Style ya global
    document.body.style.backgroundColor = darkMode ? "#121212" : "#fff";
    document.body.style.color = darkMode ? "#fff" : "#000";
    document.body.style.fontSize = fontSize;
    document.body.style.fontFamily = fontStyle;
    document.body.style.transition = "all 0.3s ease";
  }, [darkMode, fontSize, fontStyle]);

  const toggleDarkMode = () => setDarkMode(prev => !prev);
  const changeFontSize = (size) => setFontSize(size);
  const changeFontStyle = (style) => setFontStyle(style);

  return (
    <ThemeContext.Provider
      value={{ darkMode, toggleDarkMode, fontSize, changeFontSize, fontStyle, changeFontStyle }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
