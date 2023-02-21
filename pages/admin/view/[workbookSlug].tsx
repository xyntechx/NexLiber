import MainLayout from "../../../layouts/MainLayout";
import WorkbookContent from "../../../components/WorkbookContent";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { supabase } from "../../../utils/supabase";
import { useUser } from "@supabase/auth-helpers-react";
import { storyblokInit, apiPlugin, getStoryblokApi } from "@storyblok/react";
import Link from "next/link";
import styles from "../../../styles/Admin.module.css";

const View = () => {
    const router = useRouter();
    const user = useUser();

    const { workbookSlug } = router.query;
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");

    const [completeUserData, setCompleteUserData] = useState(false);
    const [fullname, setFullname] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [isAdmin, setIsAdmin] = useState(false);

    storyblokInit({
        accessToken: process.env.NEXT_PUBLIC_STORYBLOK_PUBLIC_TOKEN,
        use: [apiPlugin],
    });

    useEffect(() => {
        const loadWorkbookData = async () => {
            const { data } = await supabase
                .from("workbooks")
                .select("title, storyblok_num_id")
                .eq("slug", workbookSlug);
            if (data) setTitle(data[0].title);
        };

        if (workbookSlug) loadWorkbookData();
    }, [workbookSlug]);

    useEffect(() => {
        const loadWorkbookContent = async () => {
            const storyblokApi = getStoryblokApi();
            const { data } = await storyblokApi.get(
                `cdn/stories/${workbookSlug}`,
                {}
            );
            setContent(data.story.content.markdown);
        };

        if (workbookSlug) loadWorkbookContent();
    }, [workbookSlug]);

    useEffect(() => {
        const loadUserData = async () => {
            const { data } = await supabase
                .from("users")
                .select("full_name, username, email, is_admin")
                .eq("id", user!.id);

            if (data) {
                setFullname(data[0].full_name);
                setUsername(data[0].username);
                setEmail(data[0].email);
                setIsAdmin(data[0].is_admin);
            }
        };

        if (user) loadUserData();
    }, [user]);

    useEffect(() => {
        if (fullname && username && email) {
            setCompleteUserData(true);
        }
    }, [fullname, username, email]);

    return (
        <MainLayout
            title="NexLiber | Workbook Viewer"
            description="Read unpublished Workbooks"
            url="/admin/view"
        >
            {user && completeUserData && isAdmin ? (
                <section className={styles.container}>
                    <h1 className={styles.editorWorkbookTitle} title={title}>
                        <Link
                            href="/admin"
                            className={styles.link}
                            style={{ marginRight: "0.5rem" }}
                        >
                            &lt;
                        </Link>{" "}
                        {title}
                    </h1>
                    <WorkbookContent {...{ content }} />
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
                        <>
                            {!completeUserData ? (
                                <h1 className={styles.text}>
                                    Please{" "}
                                    <Link
                                        href="/account"
                                        className={styles.link}
                                    >
                                        complete all fields
                                    </Link>{" "}
                                    in the My Account page to access the Admin
                                    Dashboard.
                                </h1>
                            ) : (
                                <h1 className={styles.text}>
                                    The Admin Dashboard is only for Admins.
                                </h1>
                            )}
                        </>
                    )}
                </section>
            )}
        </MainLayout>
    );
};

export default View;
