import MainLayout from "../layouts/MainLayout";
import Link from "next/link";
import styles from "../styles/Home.module.css";

const Custom404 = () => {
    return (
        <MainLayout
            title="NexLiber | Error 404"
            description="404 Not Found"
            url="/"
        >
            <section className={styles.container}>
                <h1 className={styles.text}>
                    Oops! Seems like the page you&apos;re looking for
                    doesn&apos;t exist. Why don&apos;t you head on over to our{" "}
                    <Link href="/library" className={styles.link}>
                        Library
                    </Link>{" "}
                    instead?
                </h1>
            </section>
        </MainLayout>
    );
};

export default Custom404;
