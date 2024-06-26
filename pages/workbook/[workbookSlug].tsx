import MainLayout from "../../layouts/MainLayout";
import WorkbookContent from "../../components/WorkbookContent";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { supabase } from "../../utils/supabase";
import { useUser } from "@supabase/auth-helpers-react";
import { storyblokInit, apiPlugin, getStoryblokApi } from "@storyblok/react";
import { convertTZ, currentUTCDateTime } from "../../utils/datetime";
import Alert from "../../components/Alert";
import Link from "next/link";
import styles from "../../styles/Workbook.module.css";

interface WorkbookProps {
    id: string;
    type: string;
    title: string;
    description: string;
    field: string;
    creator_id: string;
    publication_date: string;
    storyblok_num_id: number;
}

interface CommentProps {
    id: string;
    created_at: string;
    commenter_name: string;
    content: string;
}

const Workbook = () => {
    const router = useRouter();
    const user = useUser();

    const { workbookSlug } = router.query;
    const [workbookData, setWorkbookData] = useState<WorkbookProps | null>();
    const [content, setContent] = useState("");
    const [isBought, setIsBought] = useState(false);

    const [completeData, setCompleteData] = useState(false);
    const [fullname, setFullname] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [countryCode, setCountryCode] = useState("");
    const [boughtWbIDs, setBoughtWbIDs] = useState<string[] | null>();
    const [isAdmin, setIsAdmin] = useState(false);

    const commentInput = useRef<HTMLTextAreaElement>(null);
    const [comments, setComments] = useState<CommentProps[] | null>();
    const [commentLoading, setCommentLoading] = useState(false);

    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    storyblokInit({
        accessToken: process.env.NEXT_PUBLIC_STORYBLOK_PUBLIC_TOKEN,
        use: [apiPlugin],
    });

    useEffect(() => {
        const loadWorkbookData = async () => {
            const { data } = await supabase
                .from("workbooks")
                .select(
                    "id, type, title, description, field, creator_id, publication_date, storyblok_num_id"
                )
                .eq("slug", workbookSlug);
            if (data) setWorkbookData(data[0]);
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
                .select(
                    "full_name, username, email, bought_wb_ids, is_admin, country_code"
                )
                .eq("id", user!.id);

            if (data) {
                setFullname(data[0].full_name);
                setUsername(data[0].username);
                setEmail(data[0].email);
                setCountryCode(data[0].country_code);
                setBoughtWbIDs(data[0].bought_wb_ids);
                setIsAdmin(data[0].is_admin);
            }
        };

        if (user) loadUserData();
    }, [user]);

    useEffect(() => {
        if (fullname && username && email && countryCode) {
            setCompleteData(true);
        }
    }, [fullname, username, email, countryCode]);

    useEffect(() => {
        const checkIsBought = () => {
            if (
                workbookData!.type === "Free" ||
                boughtWbIDs?.includes(workbookData!.id) ||
                workbookData!.creator_id === user!.id ||
                isAdmin
            )
                setIsBought(true);
        };

        if (workbookData && user) checkIsBought();
    }, [workbookData, boughtWbIDs, isAdmin, user]);

    useEffect(() => {
        const loadComments = async () => {
            const { data } = await supabase
                .from("comments")
                .select("id, created_at, commenter_name, content")
                .eq("workbook_id", workbookData!.id);
            if (data) setComments(data);
        };

        if (workbookData) loadComments();
    }, [workbookData]);

    const handlePurchase = async () => {
        const { data: creatorData } = await supabase
            .from("users")
            .select("stripe_acc_id")
            .eq("id", workbookData!.creator_id);

        const postData = async () => {
            const data = {
                id: workbookData!.id,
                slug: workbookSlug,
                user_id: user!.id,
                creator_stripe_acc_id: creatorData
                    ? creatorData![0].stripe_acc_id
                    : null,
            };

            const response = await fetch("/api/stripe-payment/learner", {
                method: "POST",
                body: JSON.stringify(data),
            });

            return response.json();
        };

        postData().then((data) => {
            if (data.url) window.location.href = data.url;
        });
    };

    const submitComment = async () => {
        setCommentLoading(true);
        const comment = commentInput.current!.value;

        if (!comment) {
            setErrorMessage("Please include your feedback before submitting!");
            setCommentLoading(false);
            return;
        }

        const { error } = await supabase.from("comments").insert({
            created_at: currentUTCDateTime(),
            workbook_id: workbookData!.id,
            commenter_name: fullname,
            content: comment,
        });

        if (error) setErrorMessage("An error has occurred. Please try again.");
        else {
            setSuccessMessage("Comment successfully submitted!");
            setTimeout(() => window.location.reload(), 1000);
        }

        setCommentLoading(false);
        return;
    };

    return (
        <>
            {workbookData ? (
                <MainLayout
                    title={`NexLiber | ${workbookData.title}`}
                    description={workbookData.description}
                    url={`/workbook/${workbookSlug}`}
                >
                    <Alert
                        {...{
                            successMessage,
                            setSuccessMessage,
                            errorMessage,
                            setErrorMessage,
                        }}
                    />
                    {user && completeData ? (
                        <section className={styles.container}>
                            <header className={styles.header}>
                                <h1 className={styles.title}>
                                    {workbookData.title}
                                </h1>
                                <p className={styles.details}>
                                    {workbookData.description}
                                </p>

                                <p className={styles.details}>
                                    {workbookData.field}
                                </p>
                            </header>
                            {isBought ? (
                                <>
                                    <WorkbookContent {...{ content }} />
                                    <section className={styles.comments}>
                                        <p
                                            className={styles.text}
                                            style={{
                                                fontWeight: "800",
                                                margin: "0",
                                            }}
                                        >
                                            Comments
                                        </p>
                                        <sub className={styles.disclaimer}>
                                            Please comment responsibly and
                                            constructively. Your name will be
                                            shown and you will not be able to
                                            delete your comment.
                                        </sub>
                                        <textarea
                                            ref={commentInput}
                                            placeholder="New Comment"
                                            id="comment"
                                            className={styles.input}
                                            rows={5}
                                        />
                                        <div className={styles.buttonContainer}>
                                            <button
                                                onClick={() => submitComment()}
                                                className={styles.button}
                                                aria-label="Submit Comment"
                                                title="Submit Comment"
                                            >
                                                {commentLoading
                                                    ? "Loading..."
                                                    : "Submit"}
                                            </button>
                                        </div>
                                        {comments?.length ? (
                                            <>
                                                {comments.map((comment) => (
                                                    <div
                                                        key={comment.id}
                                                        className={
                                                            styles.comment
                                                        }
                                                    >
                                                        <p
                                                            className={
                                                                styles.text
                                                            }
                                                            style={{
                                                                whiteSpace:
                                                                    "pre",
                                                                textAlign:
                                                                    "left",
                                                            }}
                                                        >
                                                            {comment.content}
                                                        </p>
                                                        <div
                                                            className={
                                                                styles.subContainer
                                                            }
                                                        >
                                                            <sub
                                                                className={
                                                                    styles.sub
                                                                }
                                                            >
                                                                {
                                                                    comment.commenter_name
                                                                }
                                                            </sub>
                                                            <sub
                                                                className={
                                                                    styles.sub
                                                                }
                                                            >
                                                                {convertTZ(
                                                                    comment.created_at
                                                                )}
                                                            </sub>
                                                        </div>
                                                    </div>
                                                ))}
                                            </>
                                        ) : (
                                            <div
                                                className={styles.comment}
                                                style={{
                                                    backgroundColor:
                                                        "#22c55eaa",
                                                }}
                                            >
                                                <p
                                                    className={styles.text}
                                                    style={{
                                                        fontStyle: "italic",
                                                    }}
                                                >
                                                    Nothing to show yet...
                                                </p>
                                            </div>
                                        )}
                                    </section>
                                </>
                            ) : (
                                <div style={{ height: "50vh" }}>
                                    <h1 className={styles.text}>
                                        This is a Premium Workbook. Please{" "}
                                        <button
                                            onClick={() => handlePurchase()}
                                            className={styles.linkButton}
                                        >
                                            purchase
                                        </button>{" "}
                                        it to read it.
                                    </h1>
                                </div>
                            )}
                        </section>
                    ) : (
                        <section className={styles.container}>
                            {!user ? (
                                <h1 className={styles.text}>
                                    Please{" "}
                                    <Link href="/auth" className={styles.link}>
                                        sign in
                                    </Link>{" "}
                                    to your NexLiber account to access the
                                    Library.
                                </h1>
                            ) : (
                                <h1 className={styles.text}>
                                    Please{" "}
                                    <Link
                                        href="/account"
                                        className={styles.link}
                                    >
                                        complete all fields
                                    </Link>{" "}
                                    in the My Account page to access the
                                    Library.
                                </h1>
                            )}
                        </section>
                    )}
                </MainLayout>
            ) : (
                <></>
            )}
        </>
    );
};

export default Workbook;
