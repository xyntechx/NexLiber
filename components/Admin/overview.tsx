import { useEffect, useRef, useState } from "react";
import { supabase } from "../../utils/supabase";
import { currentUTCDateTime, convertTZ } from "../../utils/datetime";
import Link from "next/link";
import styles from "./Overview.module.css";

interface Workbook {
    id: string;
    title: string;
    lower_title: string;
    description: string;
    field: string;
    type: string;
    slug: string;
    creator_id: string;
    status: string;
    is_published: boolean;
    publication_date: string;
    storyblok_id: string;
    storyblok_num_id: number;
    added_project: boolean;
    buyer_count: number;
    publication_index: number;
}

interface Props {
    workbookID: string;
    setSuccessMessage: (successMessage: string) => void;
    setErrorMessage: (errorMessage: string) => void;
}

const WorkbookOverview = ({
    workbookID,
    setSuccessMessage,
    setErrorMessage,
}: Props) => {
    const [feedbackLoading, setFeedbackLoading] = useState(false);
    const [publishLoading, setPublishLoading] = useState(false);
    const [workbook, setWorkbook] = useState<Workbook | null>(null);
    const [feedbacks, setFeedbacks] = useState<any[] | null>(null);
    const [statusColor, setStatusColor] = useState<string>();
    const feedbackInput = useRef<HTMLTextAreaElement>(null);
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");

    useEffect(() => {
        const loadWorkbook = async () => {
            const { data } = await supabase
                .from("workbooks")
                .select("*")
                .eq("id", workbookID);
            if (data) setWorkbook(data[0]);
        };

        if (workbookID) loadWorkbook();
    }, [workbookID]);

    useEffect(() => {
        const loadFeedbacks = async () => {
            const { data } = await supabase
                .from("feedbacks")
                .select("id, created_at, content")
                .eq("workbook_id", workbookID);
            if (data) setFeedbacks(data);
        };

        if (workbookID) loadFeedbacks();
    }, [workbookID]);

    useEffect(() => {
        const statusToColor: {
            [key: string]: string;
        } = {
            "Under Review": "#f59e0b",
            "Changes Required": "#ef4444",
        };

        if (workbook) setStatusColor(statusToColor[workbook.status]);
    }, [workbook]);

    useEffect(() => {
        const loadUserData = async () => {
            const { data } = await supabase
                .from("users")
                .select("username, email")
                .eq("id", workbook!.creator_id);

            if (data) {
                setUsername(data[0].username);
                setEmail(data[0].email);
            }
        };

        if (workbook) loadUserData();
    }, [workbook]);

    const submitFeedback = async () => {
        setFeedbackLoading(true);
        const feedback = feedbackInput.current!.value;

        if (!feedback) {
            setErrorMessage("Please include your feedback before submitting!");
            setFeedbackLoading(false);
            return;
        }

        const { error: feedbackError } = await supabase
            .from("feedbacks")
            .insert({
                created_at: currentUTCDateTime(),
                workbook_id: workbookID,
                content: feedback,
            });

        if (feedbackError) {
            setErrorMessage("An error has occurred. Please try again.");
            setFeedbackLoading(false);
            return;
        }

        const updates = {
            id: workbookID,
            status: "Changes Required",
        };

        const { error: workbookError } = await supabase
            .from("workbooks")
            .upsert(updates);

        if (workbookError) {
            setErrorMessage("An error has occurred. Please try again.");
            setFeedbackLoading(false);
            return;
        }

        const postData = async () => {
            const data = {
                email: email,
                bcc: "teamxynlab@gmail.com",
                subject: `${workbook!.title}: Changes Required`,
                text: `Hi ${username}!
                
                ${
                    workbook!.title
                } has been reviewed and we have suggested some changes for you to make before it can be published. Please check your Creator Dashboard for the feedback(s).
                
                Thank you and we look forward to the improvements!
                
                The NexLiber Team`,
                html: `<p>Hi ${username}!</p>
                
                <p><b>${
                    workbook!.title
                }</b> has been reviewed and we have suggested some changes for you to make before it can be published. Please check your Creator Dashboard for the feedback(s).</p>
                
                <p>Thank you and we look forward to the improvements!</p>
                
                <p>The NexLiber Team</p>`,
            };

            const response = await fetch("/api/sendgrid", {
                method: "POST",
                body: JSON.stringify(data),
            });

            return response.json();
        };

        postData().then((data) => {
            setFeedbackLoading(false);
            if (data.success) {
                setSuccessMessage("Feedback submitted!");
                setTimeout(() => window.location.reload(), 1000);
            } else setErrorMessage("An error has occurred. Please try again.");
        });

        return;
    };

    const deleteFeedback = async (id: string) => {
        const { error } = await supabase
            .from("feedbacks")
            .delete()
            .eq("id", id);

        if (error) {
            setErrorMessage("An error has occurred. Please try again.");
        } else {
            setSuccessMessage("Feedback successfully resolved.");
            if (!error) setTimeout(() => window.location.reload(), 1000);
        }
        return;
    };

    const publishWorkbook = async () => {
        setPublishLoading(true);

        const { error: feedbackError } = await supabase
            .from("feedbacks")
            .delete()
            .eq("workbook_id", workbookID);

        if (feedbackError) {
            setErrorMessage("An error has occurred. Please try again.");
            setPublishLoading(false);
            return;
        }

        const { count, error: countError } = await supabase
            .from("workbooks")
            .select("is_published", { count: "exact", head: true })
            .eq("is_published", true);

        if (countError) {
            setErrorMessage("An error has occurred. Please try again.");
            setPublishLoading(false);
            return;
        }

        const updates = {
            id: workbookID,
            status: "Published",
            is_published: true,
            publication_date: currentUTCDateTime(),
            publication_index: count ? count + 1 : 1,
        };

        const { error: workbookError } = await supabase
            .from("workbooks")
            .upsert(updates);

        if (workbookError) {
            setErrorMessage("An error has occurred. Please try again.");
            setPublishLoading(false);
            return;
        }

        const postData = async () => {
            const data = {
                email: email,
                bcc: "teamxynlab@gmail.com",
                subject: `${workbook!.title}: Published`,
                text: `Hi ${username}!
                
                Congratulations! ${
                    workbook!.title
                } has been published. You can read it at ${
                    process.env.NEXT_PUBLIC_ROOT_URL
                }/workbook/${workbook!.slug}. 
                
                Feel free to share the link to let others read your insightful Workbook!
                
                Thank you and we hope to read more Workbooks by you!
                
                The NexLiber Team`,
                html: `<p>Hi ${username}!</p>
                
                <p>Congratulations! <b>${
                    workbook!.title
                }</b> has been published. You can read it at <a href="${
                    process.env.NEXT_PUBLIC_ROOT_URL
                }/workbook/${workbook!.slug}" target="_blank">${
                    process.env.NEXT_PUBLIC_ROOT_URL
                }/workbook/${workbook!.slug}</a>.</p>
                
                <p>Feel free to share the link to let others read your insightful Workbook!</p>
                
                <p>Thank you and we hope to read more Workbooks by you!</p>
                
                <p>The NexLiber Team</p>`,
            };

            const response = await fetch("/api/sendgrid", {
                method: "POST",
                body: JSON.stringify(data),
            });

            return response.json();
        };

        postData().then((data) => {
            setPublishLoading(false);
            if (data.success) {
                setSuccessMessage("Workbook successfully published!");
                setTimeout(() => window.location.reload(), 1000);
            } else setErrorMessage("An error has occurred. Please try again.");
        });

        return;
    };

    return (
        <>
            {workbook ? (
                <>
                    <div className={styles.topContainer}>
                        <h1 className={styles.title} title={workbook.title}>
                            {workbook.title}
                        </h1>

                        <div className={styles.buttons}>
                            <Link
                                href={`/admin/view/${workbook.slug}`}
                                className={styles.blueButton}
                            >
                                View
                            </Link>
                            <button
                                onClick={() => publishWorkbook()}
                                className={styles.greenButton}
                                aria-label="Publish Workbook"
                                title="Publish Workbook"
                            >
                                {publishLoading ? "Loading..." : "Publish"}
                            </button>
                        </div>
                    </div>
                    <div className={styles.mainContainer}>
                        <p className={styles.text}>
                            Status:{" "}
                            <span
                                style={{
                                    color: statusColor,
                                    fontWeight: "800",
                                }}
                            >
                                {workbook.status}
                            </span>
                        </p>

                        <p
                            className={styles.text}
                            style={{ marginTop: "1rem" }}
                        >
                            {workbook.description}
                        </p>

                        <p className={styles.text}>{workbook.field}</p>

                        {!workbook.is_published && (
                            <>
                                <div className={styles.feedbackContainer}>
                                    <p
                                        className={styles.text}
                                        style={{
                                            fontWeight: "800",
                                            margin: "0",
                                        }}
                                    >
                                        Feedback
                                    </p>
                                    <textarea
                                        ref={feedbackInput}
                                        placeholder="New Feedback"
                                        id="feedback"
                                        className={styles.input}
                                        rows={5}
                                    />
                                    <div className={styles.buttonContainer}>
                                        <button
                                            onClick={() => submitFeedback()}
                                            className={styles.button}
                                            aria-label="Submit Feedback"
                                            title="Submit Feedback"
                                        >
                                            {feedbackLoading
                                                ? "Loading..."
                                                : "Submit"}
                                        </button>
                                    </div>
                                    {feedbacks?.length ? (
                                        <>
                                            {feedbacks.map(
                                                (feedback, index) => (
                                                    <div
                                                        key={index}
                                                        className={
                                                            styles.feedback
                                                        }
                                                    >
                                                        <p
                                                            className={
                                                                styles.text
                                                            }
                                                            style={{
                                                                whiteSpace:
                                                                    "pre",
                                                            }}
                                                        >
                                                            {feedback.content}
                                                        </p>
                                                        <div
                                                            className={
                                                                styles.feedbackSubs
                                                            }
                                                        >
                                                            <sub
                                                                className={
                                                                    styles.subAction
                                                                }
                                                                onClick={() =>
                                                                    deleteFeedback(
                                                                        feedback.id
                                                                    )
                                                                }
                                                            >
                                                                Mark as Resolved
                                                            </sub>
                                                            <sub
                                                                className={
                                                                    styles.sub
                                                                }
                                                            >
                                                                {convertTZ(
                                                                    feedback.created_at
                                                                )}
                                                            </sub>
                                                        </div>
                                                    </div>
                                                )
                                            )}
                                        </>
                                    ) : (
                                        <div
                                            className={styles.feedback}
                                            style={{
                                                backgroundColor: "#22c55eaa",
                                            }}
                                        >
                                            <p
                                                className={styles.text}
                                                style={{ fontStyle: "italic" }}
                                            >
                                                Nothing to show yet...
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                </>
            ) : (
                <></>
            )}
        </>
    );
};

export default WorkbookOverview;
