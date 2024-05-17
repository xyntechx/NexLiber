import Head from "next/head";
import Link from "next/link";
import styles from "../styles/Community.module.css";

const Community = () => {
    return (
        <div>
            <Head>
                <title>NexLiber | Community</title>
                <meta name="viewport" content="width=device-width" />
                <meta
                    name="description"
                    content="Join NexLiber's Discord Server"
                />
                <meta name="author" content="Nyx Iskandar" />
                <meta property="og:title" content="NexLiber | Community" />
                <meta
                    property="og:description"
                    content="Join NexLiber's Discord Server"
                />
                <meta
                    property="og:image"
                    content="https://nexliber.vercel.app/favicons/og-image.png"
                />
                <meta
                    property="og:url"
                    content="https://nexliber.vercel.app/community"
                />
                <meta property="og:type" content="website" />
                <meta
                    httpEquiv="Refresh"
                    content="0; url='https://discord.gg/CvZGEjyzbR'"
                />
            </Head>

            <main className={styles.main}>
                <p className={styles.text}>
                    Click{" "}
                    <Link
                        href="https://discord.gg/CvZGEjyzbR"
                        className={styles.link}
                    >
                        me
                    </Link>{" "}
                    to join NexLiber&apos;s Discord server!
                </p>
            </main>
        </div>
    );
};

export default Community;
