import MainLayout from "../layouts/MainLayout";
import Link from "next/link";
import styles from "../styles/Home.module.css";

const Custom500 = () => {
    return (
        <MainLayout
            title="NexLiber | Error 500"
            description="500 Internal Server Error"
            url="/"
        >
            <section className={styles.container}>
                <h1 className={styles.text}>
                    Oops! Our server encountered an error. Why don&apos;t you
                    head on over to our{" "}
                    <Link href="/library" className={styles.link}>
                        Library
                    </Link>{" "}
                    instead?
                </h1>
            </section>
        </MainLayout>
    );
};

export default Custom500;
