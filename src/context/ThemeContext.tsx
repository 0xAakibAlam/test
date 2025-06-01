
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useAppKitTheme } from "@reown/appkit/react";

type Theme = "light" | "dark";

interface ThemeContextProps {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<Theme>("light");
  const { setThemeMode, setThemeVariables } = useAppKitTheme();
  // Initialize theme from localStorage or system preference
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as Theme;
    
    if (savedTheme) {
      setTheme(savedTheme);
      setThemeMode(savedTheme);
      // setThemeVariables({
      //   '--w3m-accent': savedTheme === "dark" ? '#8c8c8c' : '#000000',
      // });
      document.documentElement.classList.toggle("dark", savedTheme === "dark");
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setTheme("dark");
      setThemeMode("dark");
      // setThemeVariables({
      //   '--w3m-accent': theme === "dark" ? '#8c8c8c' : '#000000',
      // });
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.classList.toggle("dark");
    localStorage.setItem("theme", newTheme);

    setThemeMode(newTheme);
    // setThemeVariables({
    //   '--w3m-accent': newTheme === "dark" ? '#8c8c8c' : '#000000',
    // });
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
