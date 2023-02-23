import { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import Link from "next/link";
import { supabase } from "../utils/supabase";
import { useUser } from "@supabase/auth-helpers-react";
import workbookFields from "../utils/workbookFields";
import styles from "../styles/Home.module.css";

const Home = () => {
    const user = useUser();

    const [completeData, setCompleteData] = useState(false);

    const [data, setData] = useState<any[] | null>();

    const [fullname, setFullname] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [countryCode, setCountryCode] = useState("");

    const [learnerField, setLearnerField] = useState<string | null>();
    const [creatorField, setCreatorField] = useState<string | null>();
    const [showDiscord, setShowDiscord] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            const { data } = await supabase
                .from("users")
                .select("full_name, username, email, country_code")
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
            setCountryCode(data[0].country_code);
        }
    }, [data]);

    useEffect(() => {
        if (fullname && username && email && countryCode) {
            setCompleteData(true);
        }
    }, [fullname, username, email, countryCode]);

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
            <section className={styles.container}>
                <div className={styles.introContainer}>
                    <div className={styles.titleContainer}>
                        <h1 className={styles.maintitle}>Create to Learn.</h1>
                        <p
                            className={styles.maintext}
                            style={{ color: "var(--color-text-blur" }}
                        >
                            Extinguish tutorial hell with NexLiber&apos;s
                            comprehensive community-created Workbooks.
                        </p>
                        <div className={styles.nav}>
                            <Link href="/auth" className={styles.button}>
                                Get Started
                            </Link>
                            <Link href="/docs" className={styles.button}>
                                Documentation
                            </Link>
                        </div>
                    </div>
                    <div className={styles.testimonial}>
                        <p className={styles.text}>
                            &quot;Our whole partnership was a <b>godsend</b>!
                            Dreampiper will keep using NexLiber Workbooks for
                            future code-focused DreamUP challenges, and
                            contribute to the growth of NexLiber in every way we
                            can.&quot;
                        </p>
                        <sub
                            className={styles.text}
                            style={{
                                width: "100%",
                                textAlign: "right",
                                fontSize: "0.8rem",
                            }}
                        >
                            ~ Dreampiper DAO
                        </sub>
                    </div>
                </div>

                <div className={styles.contentContainer}>
                    <h1 className={styles.title}>For Coders, By Coders.</h1>
                    <p
                        className={styles.text}
                        style={{
                            textAlign: "center",
                            color: "var(--color-text-blur",
                        }}
                    >
                        We know tutorial hell is{" "}
                        <b style={{ color: "var(--color-theme)" }}>hell</b>.
                        That&apos;s exactly why NexLiber was made by us (coders)
                        for us (coders), including you.
                    </p>
                    <p
                        className={styles.text}
                        style={{ marginTop: "2rem", textAlign: "center" }}
                    >
                        NexLiber enables you to:
                    </p>
                    <div className={styles.highlightContainer}>
                        <div className={styles.highlight}>
                            <h3
                                className={styles.text}
                                style={{
                                    fontWeight: "800",
                                    fontSize: "1.2rem",
                                }}
                            >
                                Learn
                            </h3>
                            <p className={styles.text}>
                                NexLiber Workbooks are unlike any other existing
                                coding tutorials out there; our Workbooks
                                thoroughly explain not just the
                                &quot;what&quot;, but also the{" "}
                                <b>&quot;why&quot;</b> behind code.
                            </p>
                        </div>
                        <div className={styles.highlight}>
                            <h3
                                className={styles.text}
                                style={{
                                    fontWeight: "800",
                                    fontSize: "1.2rem",
                                }}
                            >
                                Create
                            </h3>
                            <p className={styles.text}>
                                Newbie or pro, you can hone your computational
                                thinking, technical writing, and coding skills
                                by writing Workbooks. As long as you can{" "}
                                <b>clearly articulate your thought process</b>,
                                you can be a NexLiber Creator!
                            </p>
                        </div>
                        <div className={styles.highlight}>
                            <h3
                                className={styles.text}
                                style={{
                                    fontWeight: "800",
                                    fontSize: "1.2rem",
                                }}
                            >
                                Earn
                            </h3>
                            <p className={styles.text}>
                                With NexLiber, you can <b>monetise</b> your
                                Workbooks, transforming the mundane task of
                                writing documentations into a profitable one!
                                You can also build your portfolio and impress
                                potential recruiters through publishing
                                Workbooks.
                            </p>
                        </div>
                        <div className={styles.highlight}>
                            <h3
                                className={styles.text}
                                style={{
                                    fontWeight: "800",
                                    fontSize: "1.2rem",
                                }}
                            >
                                Stay Accountable
                            </h3>
                            <p className={styles.text}>
                                Investing your money into our Premium Workbooks
                                will encourage you to <b>remain committed</b> to
                                learning. Of course, you can still casually read
                                our Free Workbooks!
                            </p>
                        </div>
                    </div>
                </div>

                <div className={styles.contentContainer}>
                    <h1 className={styles.title}>Any. Field.</h1>
                    <p
                        className={styles.text}
                        style={{
                            textAlign: "center",
                            color: "var(--color-text-blur",
                        }}
                    >
                        We don&apos;t discriminate.{" "}
                        <b style={{ color: "var(--color-theme)" }}>Any</b> coder
                        can write{" "}
                        <b style={{ color: "var(--color-theme)" }}>any</b>{" "}
                        Workbook about{" "}
                        <b style={{ color: "var(--color-theme)" }}>any</b>{" "}
                        Project in{" "}
                        <b style={{ color: "var(--color-theme)" }}>any</b>{" "}
                        field.
                    </p>
                    <div className={styles.bubbleContainer}>
                        <div className={styles.bubble}>
                            <p className={styles.text}>Can I learn</p>
                            <select
                                id="field"
                                defaultValue=""
                                className={styles.input}
                                onChange={(e) =>
                                    setLearnerField(e.target.value)
                                }
                            >
                                <option disabled />
                                {workbookFields.map((field) => (
                                    <option key={field} value={field}>
                                        {field}
                                    </option>
                                ))}
                            </select>
                            <p className={styles.text}>with NexLiber?</p>
                        </div>
                    </div>
                    {learnerField && (
                        <div
                            className={styles.bubbleContainer}
                            style={{ justifyContent: "flex-start" }}
                        >
                            <p className={styles.bubbleAnswer}>
                                For sure! NexLiber values all fields and aims to
                                empower you to succeed in those you love!
                            </p>
                        </div>
                    )}
                    <div className={styles.bubbleContainer}>
                        <div className={styles.bubble}>
                            <p className={styles.text}>Can I create</p>
                            <select
                                id="field"
                                defaultValue=""
                                className={styles.input}
                                onChange={(e) =>
                                    setCreatorField(e.target.value)
                                }
                            >
                                <option disabled />
                                {workbookFields.map((field) => (
                                    <option key={field} value={field}>
                                        {field}
                                    </option>
                                ))}
                            </select>
                            <p className={styles.text}>
                                Workbooks on NexLiber?
                            </p>
                        </div>
                    </div>
                    {creatorField && (
                        <div
                            className={styles.bubbleContainer}
                            style={{ justifyContent: "flex-start" }}
                        >
                            <p className={styles.bubbleAnswer}>
                                Of course! We love to see diversity in our
                                Library and support Creators and Learners in all
                                coding fields!
                            </p>
                        </div>
                    )}
                </div>

                <div className={styles.contentContainer}>
                    <h1 className={styles.title}>
                        Supportive Global Community
                    </h1>
                    <p
                        className={styles.text}
                        style={{
                            textAlign: "center",
                            color: "var(--color-text-blur",
                        }}
                    >
                        We have an awesome global Discord community who{" "}
                        <b style={{ color: "var(--color-theme)" }}>
                            loves NexLiber
                        </b>
                        .
                    </p>
                    <div className={styles.highlightContainer}>
                        <div
                            className={styles.testimonial}
                            style={{ width: "100%" }}
                        >
                            <p className={styles.text}>
                                &quot;Looking through NexLiber, I was{" "}
                                <b>blown</b> away! NexLiber seems like a{" "}
                                <b>win-win</b> situation for Creators and
                                Learners, especially those who have zero ideas
                                on what projects to do (this was my pain point
                                when I was attending a bootcamp). It&apos;s{" "}
                                <b>much easier</b> to learn coding when
                                you&apos;re building a project that you&apos;re
                                interested in!&quot;
                            </p>
                            <sub
                                className={styles.text}
                                style={{
                                    width: "100%",
                                    textAlign: "right",
                                    fontSize: "0.8rem",
                                }}
                            >
                                ~ Annabel Yvette Teo
                            </sub>
                        </div>
                        <div
                            className={styles.testimonial}
                            style={{ width: "100%" }}
                        >
                            <p className={styles.text}>
                                &quot;Hi Nyx, few students (or founders for that
                                matter) are{" "}
                                <b>
                                    genuinely building to fulfill an education
                                    mission
                                </b>{" "}
                                to prepare students for the future. Keep up the
                                good work and I hope you will continue building
                                in this spirit, all the best (:&quot;
                            </p>
                            <sub
                                className={styles.text}
                                style={{
                                    width: "100%",
                                    textAlign: "right",
                                    fontSize: "0.8rem",
                                }}
                            >
                                ~ Kahhow Lee
                            </sub>
                        </div>
                    </div>
                    <p
                        className={styles.text}
                        style={{ marginTop: "2rem", textAlign: "center" }}
                    >
                        Want to know what&apos;s currently happening on our
                        Discord?
                    </p>
                    <button
                        onClick={() => setShowDiscord(true)}
                        className={styles.button}
                        aria-label="Show Discord Overview"
                        title="Show Discord Overview"
                    >
                        You Bet!
                    </button>
                    {showDiscord && (
                        <iframe
                            src="https://discord.com/widget?id=980475689948037130&theme=dark"
                            sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
                            className={styles.iframe}
                        />
                    )}
                </div>

                <div className={styles.finalContainer}>
                    <h1 className={styles.title}>Join Us</h1>
                    <p
                        className={styles.text}
                        style={{
                            textAlign: "center",
                            color: "var(--color-text-blur",
                        }}
                    >
                        Now that you know what&apos;s in store for you at
                        NexLiber,{" "}
                        <b style={{ color: "var(--color-theme)" }}>
                            what are you waiting for?
                        </b>
                    </p>
                    <div className={styles.navRow}>
                        <Link href="/auth" className={styles.button}>
                            Sign Up
                        </Link>
                        <Link href="/docs" className={styles.button}>
                            Read the Docs
                        </Link>
                        <Link href="/library" className={styles.button}>
                            Learn
                        </Link>
                        <Link href="/creator" className={styles.button}>
                            Create
                        </Link>
                    </div>
                </div>
            </section>
        </MainLayout>
    );
};

export default Home;
