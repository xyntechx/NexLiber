import { useState, useEffect } from "react";
import Image from "next/image";
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
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            className={styles.themeToggle}
        >
            <Image
                src={`/assets/${theme}/toggle.svg`}
                alt={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
                aria-hidden="true"
                width={30}
                height={30}
            />
        </button>
    );
};

export default Toggle;
