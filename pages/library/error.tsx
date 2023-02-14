import MainLayout from "../../layouts/MainLayout";
import Link from "next/link";
import styles from "../../styles/Library.module.css";

const Error = () => {
    return (
        <MainLayout
            title="NexLiber | Learner Error"
            description="Library error page"
            url="/library/error"
        >
            <section className={styles.container}>
                <h1 className={styles.text}>
                    An error has occurred. Please try to{" "}
                    <Link href="/library" className={styles.link}>
                        purchase the Premium Workbook
                    </Link>{" "}
                    again.
                </h1>
            </section>
        </MainLayout>
    );
};

export default Error;
