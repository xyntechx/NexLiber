import dynamic from "next/dynamic";
import Link from "next/link";
import styles from "./Topnav.module.css";

const Toggle = dynamic(() => import("../Theme/Toggle"), {
    ssr: false,
});

const Logo = dynamic(() => import("../Theme/Logo"), {
    ssr: false,
});

const Topnav = () => {
    return (
        <nav className={styles.topnav}>
            <Logo />
            <div className={styles.links}>
                <Link href="/library" className={styles.link}>
                    Library
                </Link>
                <Link href="/docs" className={styles.link}>
                    Docs
                </Link>
            </div>
            {/* TODO: Account (only if signed in, can log out through /account) */}
            {/* TODO: 
                - When signed out, replace Toggle with Sign In button
                - When signed in, replace Toggle with circular profile picture
                - When circular profile picture is clicked, show drop down of
                    - "My Account" (link to /account)
                    - "Creator Dashboard" (link to /creator)
                    - "Theme: Dark" or "Theme: Light" (change theme onclick) -- This is the new Toggle
                    - "Sign Out" (sign out user onclick)
            */}
            <Toggle />
        </nav>
    );
};

export default Topnav;
