import { useState, useEffect } from "react";
import Image from "next/image";
import styles from "../Theme.module.css";

const GridButton = () => {
    const [theme, setTheme] = useState(document.body.dataset.theme!);

    useEffect(() => {
        window.addEventListener("themeUpdate", () => {
            setTheme(localStorage.getItem("theme")!);
        });
    });

    return (
        <Image
            src={`/assets/${theme}/grid.svg`}
            alt="Select Grid view"
            aria-hidden="true"
            width={20}
            height={20}
        />
    );
};

export default GridButton;
