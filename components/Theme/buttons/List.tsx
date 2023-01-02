import { useState, useEffect } from "react";
import Image from "next/image";
import styles from "../Theme.module.css";

const ListButton = () => {
    const [theme, setTheme] = useState(document.body.dataset.theme!);

    useEffect(() => {
        window.addEventListener("themeUpdate", () => {
            setTheme(localStorage.getItem("theme")!);
        });
    });

    return (
        <Image
            src={`/assets/${theme}/list.svg`}
            alt="Select List view"
            aria-hidden="true"
            width={20}
            height={20}
        />
    );
};

export default ListButton;
