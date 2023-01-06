import { useState, useEffect } from "react";
import styles from "./Theme.module.css";

const Toggle = () => {
    const [theme, setTheme] = useState(document.body.dataset.theme!);

    useEffect(() => {
        document.body.dataset.theme = theme;
        localStorage.setItem("theme", theme);
        window.dispatchEvent(new Event("themeUpdate")); // for responsiveness of other components
    }, [theme]);

    return (
        <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label={`Switch to ${theme === "dark" ? "Light" : "Dark"} Mode`}
            title={`Switch to ${theme === "dark" ? "Light" : "Dark"} Mode`}
            className={styles.themeToggle}
        >
            Switch to {theme === "dark" ? "Light" : "Dark"} Mode
        </button>
    );
};

export default Toggle;
