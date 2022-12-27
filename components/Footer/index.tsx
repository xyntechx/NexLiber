import Link from "next/link";
import styles from "./Footer.module.css"

const Footer = () => {
    return (
        <footer className={styles.footer}>
            <div className={styles.div}>
                <Link href="/library" className={styles.link}>Library</Link>
                <Link href="/docs" className={styles.link}>Docs</Link>
                <Link href="/community" target="_blank" className={styles.link}>
                    Discord
                </Link>
                <Link href="https://github.com/xyntechx/NexLiber" target="_blank" className={styles.link}>
                    GitHub
                </Link>
            </div>
            <sub className={styles.sub}>Copyright &copy; 2022 Nyx Audrey Angelo Iskandar</sub>
        </footer>
    );
};

export default Footer;
