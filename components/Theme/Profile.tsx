import { useState, useEffect } from "react";
import Image from "next/image";
import styles from "./Theme.module.css";

const Profile = () => {
    const [theme, setTheme] = useState(document.body.dataset.theme!);

    useEffect(() => {
        window.addEventListener("themeUpdate", () => {
            setTheme(localStorage.getItem("theme")!);
        });
    });

    return (
        <Image
            src={`/assets/${theme}/profile.svg`}
            alt="Default profile picture"
            aria-hidden="true"
            width={50}
            height={50}
            className={styles.img}
        />
    );
};

export default Profile;
