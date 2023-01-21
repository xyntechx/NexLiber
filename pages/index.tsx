import { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "../utils/supabase";
import { useUser } from "@supabase/auth-helpers-react";
import styles from "../styles/Home.module.css";

const Home = () => {
    const user = useUser();

    const [completeData, setCompleteData] = useState(false);

    const [data, setData] = useState<any[] | null>();

    const [fullname, setFullname] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");

    useEffect(() => {
        const loadData = async () => {
            const { data } = await supabase
                .from("users")
                .select("full_name, username, email")
                .eq("id", user!.id);
            setData(data);
        };

        if (user) loadData();
    }, [user]);

    useEffect(() => {
        if (data) {
            setFullname(data[0].full_name);
            setUsername(data[0].username);
            setEmail(data[0].email);
        }
    }, [data]);

    useEffect(() => {
        if (fullname && username && email) {
            setCompleteData(true);
        }
    }, [fullname, username, email]);

    useEffect(() => {
        supabase.auth.onAuthStateChange(async (event, session) => {
            if (event == "SIGNED_IN") {
                if (completeData) window.location.href = "/library";
                else window.location.href = "/account";
            }
        });
    }, [completeData]);

    return (
        <MainLayout title="NexLiber" description="Create to Learn" url="/">
            <p>home</p>
            {/* https://www.youtube.com/watch?v=l-BFTVtpFUA -- combine this with the changing fields (i.e. artificial intelligence, cybersecurity, ...) */}
        </MainLayout>
    );
};

export default Home;
