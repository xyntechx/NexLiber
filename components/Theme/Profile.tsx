import { useState, useEffect } from "react";
import Image from "next/image";
import styles from "./Theme.module.css";

interface Props {
    width: number;
    height: number;
}

const Profile = ({ width, height }: Props) => {
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
            width={width}
            height={height}
            className={styles.img}
        />
    );
};

export default Profile;
