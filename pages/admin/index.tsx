import MainLayout from "../../layouts/MainLayout";
import { useEffect, useState } from "react";
import { supabase } from "../../utils/supabase";
import { useUser } from "@supabase/auth-helpers-react";
import Alert from "../../components/Alert";
import WorkbookOverview from "../../components/Admin/overview";
import Link from "next/link";
import styles from "../../styles/Admin.module.css";

interface Workbook {
    id: string;
    title: string;
}

const Admin = () => {
    // User Data
    const user = useUser();
    const [userData, setUserData] = useState<any[] | null>();
    const [completeUserData, setCompleteUserData] = useState(false);
    const [fullname, setFullname] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");

    // Workbook Data
    const [underReviewWbs, setUnderReviewWbs] = useState<any[] | null>();
    const [changesReqWbs, setChangesReqWbs] = useState<any[] | null>();
    const [viewedWorkbook, setViewedWorkbook] = useState<Workbook | null>(null);

    // Misc
    const [isViewUnderReview, setIsViewUnderReview] = useState(true);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        const loadWorkbooks = async () => {
            const { data: underReviewData } = await supabase
                .from("workbooks")
                .select("id, title, creator_id")
                .match({
                    status: "Under Review",
                    is_published: false,
                });
            setUnderReviewWbs(underReviewData);

            const { data: changesReqData } = await supabase
                .from("workbooks")
                .select("id, title, creator_id")
                .match({
                    status: "Changes Required",
                    is_published: false,
                });
            setChangesReqWbs(changesReqData);
        };

        if (user) loadWorkbooks();
    }, [user]);

    useEffect(() => {
        const loadUserData = async () => {
            const { data } = await supabase
                .from("users")
                .select("full_name, username, email")
                .eq("id", user!.id);
            setUserData(data);
        };

        if (user) loadUserData();
    }, [user]);

    useEffect(() => {
        if (userData) {
            setFullname(userData[0].full_name);
            setUsername(userData[0].username);
            setEmail(userData[0].email);
        }
    }, [userData]);

    useEffect(() => {
        if (fullname && username && email) {
            setCompleteUserData(true);
        }
    }, [fullname, username, email]);

    return (
        <MainLayout
            title="NexLiber | Admin Dashboard"
            description="Manage NexLiber Creators and Workbooks"
            url="/admin"
        >
            <Alert
                {...{
                    successMessage,
                    setSuccessMessage,
                    errorMessage,
                    setErrorMessage,
                }}
            />

            {user && completeUserData ? (
                <section className={styles.container}>
                    <h1 className={styles.title}>Admin Dashboard</h1>
                    <div className={styles.mainDiv}>
                        <div className={styles.contents}>
                            <div className={styles.toggles}>
                                <button
                                    onClick={() => setIsViewUnderReview(true)}
                                    className={styles.toggle}
                                    style={{
                                        color: isViewUnderReview
                                            ? "var(--color-theme)"
                                            : "var(--color-text)",
                                        paddingLeft: "1rem",
                                    }}
                                >
                                    Pending
                                </button>
                                <button
                                    onClick={() => setIsViewUnderReview(false)}
                                    className={styles.toggle}
                                    style={{
                                        color: !isViewUnderReview
                                            ? "var(--color-theme)"
                                            : "var(--color-text)",
                                    }}
                                >
                                    Reviewed
                                </button>
                            </div>
                            <div className={styles.workbookTitles}>
                                {isViewUnderReview ? (
                                    <>
                                        {underReviewWbs?.length ? (
                                            <>
                                                {underReviewWbs!.map(
                                                    (file, index) => (
                                                        <p
                                                            key={index}
                                                            onClick={() =>
                                                                setViewedWorkbook(
                                                                    file
                                                                )
                                                            }
                                                            className={
                                                                styles.workbookTitle
                                                            }
                                                            title={file.title}
                                                        >
                                                            {file.title}
                                                        </p>
                                                    )
                                                )}
                                            </>
                                        ) : (
                                            <>
                                                <p
                                                    className={
                                                        styles.disclaimer
                                                    }
                                                >
                                                    No Workbooks found
                                                </p>
                                            </>
                                        )}
                                    </>
                                ) : (
                                    <>
                                        {changesReqWbs?.length ? (
                                            <>
                                                {changesReqWbs!.map(
                                                    (file, index) => (
                                                        <p
                                                            key={index}
                                                            onClick={() =>
                                                                setViewedWorkbook(
                                                                    file
                                                                )
                                                            }
                                                            className={
                                                                styles.workbookTitle
                                                            }
                                                            title={file.title}
                                                        >
                                                            {file.title}
                                                        </p>
                                                    )
                                                )}
                                            </>
                                        ) : (
                                            <>
                                                <p
                                                    className={
                                                        styles.disclaimer
                                                    }
                                                >
                                                    No Workbooks found
                                                </p>
                                            </>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                        <div className={styles.workbookContainer}>
                            {viewedWorkbook ? (
                                <WorkbookOverview
                                    workbookID={viewedWorkbook.id}
                                    setSuccessMessage={setSuccessMessage}
                                    setErrorMessage={setErrorMessage}
                                />
                            ) : (
                                <p
                                    style={{
                                        margin: 0,
                                        fontStyle: "italic",
                                        color: "var(--color-text-blur)",
                                    }}
                                >
                                    Please select a Workbook
                                </p>
                            )}
                        </div>
                    </div>
                </section>
            ) : (
                <section className={styles.container}>
                    {!user ? (
                        <h1 className={styles.text}>
                            Please{" "}
                            <Link href="/auth" className={styles.link}>
                                sign in
                            </Link>{" "}
                            to your NexLiber account to access the Admin
                            Dashboard.
                        </h1>
                    ) : (
                        <h1 className={styles.text}>
                            Please{" "}
                            <Link href="/account" className={styles.link}>
                                complete all fields
                            </Link>{" "}
                            in the My Account page to access the Admin
                            Dashboard.
                        </h1>
                    )}
                </section>
            )}
        </MainLayout>
    );
};

export default Admin;
