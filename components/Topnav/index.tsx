import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "../../utils/supabase";
import { useUser } from "@supabase/auth-helpers-react";
import Alert from "../Alert";
import styles from "./Topnav.module.css";

const Toggle = dynamic(() => import("../Theme/Toggle"), {
    ssr: false,
});

const Logo = dynamic(() => import("../Theme/Logo"), {
    ssr: false,
});

const Profile = dynamic(() => import("../Theme/Profile"), {
    ssr: false,
});

const Topnav = () => {
    const user = useUser();

    const [isSignedIn, setIsSignedIn] = useState(false);
    const [avatar_url, setAvatarUrl] = useState<string | null>();

    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const [showContent, setShowContent] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            const { data } = await supabase
                .from("users")
                .select("avatar_url")
                .eq("id", user!.id);
            if (data![0].avatar_url) setAvatarUrl(data![0].avatar_url);
        };

        if (user) {
            loadData();
            setIsSignedIn(true);
        }
    }, [user]);

    const handleSignOut = async () => {
        const { error } = await supabase.auth.signOut();

        if (error) {
            setErrorMessage(error.message);
        } else {
            setSuccessMessage("Signed out!");
        }

        setIsSignedIn(false);

        if (!error) setTimeout(() => (window.location.href = "/"), 1000);
        return;
    };

    return (
        <>
            <Alert
                {...{
                    successMessage,
                    setSuccessMessage,
                    errorMessage,
                    setErrorMessage,
                }}
            />
            <nav className={styles.topnav}>
                <div className={styles.logoContainer}>
                    <Logo />
                </div>
                <div className={styles.links}>
                    <Link href="/library" className={styles.link}>
                        Library
                    </Link>
                    <Link href="/docs" className={styles.link}>
                        Docs
                    </Link>
                </div>
                <div className={styles.dropdownContainer}>
                    {isSignedIn ? (
                        <div className={styles.dropdown}>
                            <button
                                onClick={() => setShowContent(!showContent)}
                                aria-label="View Actions"
                                title="View Actions"
                                className={styles.button}
                                style={{
                                    border: "none",
                                    padding: "0",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "flex-end",
                                    minWidth: "fit-content",
                                }}
                            >
                                {avatar_url ? <p>ada url</p> : <Profile />}
                            </button>
                            <div
                                className={styles.dropdownContent}
                                style={{
                                    display: showContent ? "flex" : "none",
                                }}
                            >
                                <Link href="/account" className={styles.action}>
                                    My Account
                                </Link>
                                <Link href="/creator" className={styles.action}>
                                    Creator Dashboard
                                </Link>
                                <Toggle />
                                <button
                                    onClick={() => {
                                        handleSignOut();
                                    }}
                                    aria-label="Sign Out"
                                    title="Sign Out"
                                    className={styles.action}
                                    style={{ marginBottom: "0.5rem" }}
                                >
                                    Sign Out
                                </button>
                            </div>
                        </div>
                    ) : (
                        <Link href="/auth" className={styles.button}>
                            Sign In
                        </Link>
                    )}
                </div>
            </nav>
        </>
    );
};

export default Topnav;
