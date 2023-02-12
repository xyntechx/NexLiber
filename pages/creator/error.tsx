import MainLayout from "../../layouts/MainLayout";
import Link from "next/link";
import styles from "../../styles/Creator.module.css";

const Error = () => {
    return (
        <MainLayout
            title="NexLiber | Creator Error"
            description="Creator Dashboard error page"
            url="/creator/error"
        >
            <section className={styles.container}>
                <h1 className={styles.text}>
                    An error has occurred. Please try to{" "}
                    <Link href="/creator" className={styles.link}>
                        create your Workbook
                    </Link>{" "}
                    again.
                </h1>
            </section>
        </MainLayout>
    );
};

export default Error;
