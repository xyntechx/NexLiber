import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "./Theme.module.css";

const Logo = () => {
    const [theme, setTheme] = useState(document.body.dataset.theme!);

    useEffect(() => {
        window.addEventListener("themeUpdate", () => {
            setTheme(localStorage.getItem("theme")!);
        });
    });

    return (
        <Link href="/">
            <Image
                src={`/assets/${theme}/nexliber.svg`}
                alt="NexLiber logo"
                aria-hidden="true"
                width={50}
                height={50}
                className={styles.logo}
            />
        </Link>
    );
};

export default Logo;
