import Link from "next/link";
import styles from "./Footer.module.css";

const Footer = () => {
    return (
        <footer className={styles.footer}>
            <div className={styles.div}>
                <Link href="/library" className={styles.link}>
                    Library
                </Link>
                <Link href="/docs" className={styles.link}>
                    Docs
                </Link>
                <Link href="/community" target="_blank" className={styles.link}>
                    Discord
                </Link>
                <Link
                    href="https://xyntechx.com"
                    target="_blank"
                    className={styles.link}
                >
                    About Founder
                </Link>
            </div>
            <sub className={styles.sub}>
                Copyright &copy; 2023 Nyx Audrey Angelo Iskandar
            </sub>
        </footer>
    );
};

export default Footer;
