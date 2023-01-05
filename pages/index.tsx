import { useEffect } from "react";
import MainLayout from "../layouts/MainLayout";
import Link from "next/link";
import { supabase } from "../utils/supabase";
import styles from "../styles/Home.module.css";

const Home = () => {
    useEffect(() => {
        supabase.auth.onAuthStateChange(async (event, session) => {
            if (event == "SIGNED_IN") window.location.href = "/account";
        });
    }, []);

    return (
        <MainLayout title="NexLiber" description="Create to Learn" url="/">
            <p>home</p>
            {/* https://www.youtube.com/watch?v=l-BFTVtpFUA -- combine this with the changing fields (i.e. artificial intelligence, cybersecurity, ...) */}
        </MainLayout>
    );
};

export default Home;
