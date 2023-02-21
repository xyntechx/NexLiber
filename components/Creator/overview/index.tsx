import { useEffect, useState } from "react";
import { supabase } from "../../../utils/supabase";
import { simplifyDate, convertTZ } from "../../../utils/datetime";
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
    const [loading, setLoading] = useState(false);
    const [workbook, setWorkbook] = useState<Workbook | null>(null);
    const [feedbacks, setFeedbacks] = useState<any[] | null>(null);
    const [statusColor, setStatusColor] = useState<string>();

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
                .select("created_at, content")
                .eq("workbook_id", workbookID);
            if (data) setFeedbacks(data);
        };

        if (workbookID) loadFeedbacks();
    }, [workbookID]);

    useEffect(() => {
        const statusToColor: {
            [key: string]: string;
        } = {
            "In Progress": "#0ea5e9",
            "Under Review": "#f59e0b",
            "Changes Required": "#ef4444",
            Published: "#22c55e",
        };

        if (workbook) setStatusColor(statusToColor[workbook.status]);
    }, [workbook]);

    const deleteWorkbook = async () => {
        if (workbook) {
            await fetch(
                `https://mapi.storyblok.com/v1/spaces/192717/stories/${workbook.storyblok_num_id}`,
                {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: process.env.NEXT_PUBLIC_STORYBLOK_PAT!,
                    },
                }
            ).then((response) => {
                if (!response.ok) {
                    setErrorMessage("An error has occurred. Please try again.");
                    setLoading(false);
                    return;
                }

                handleSupabase();

                return;
            });
        }
    };

    const handleSupabase = async () => {
        const { error } = await supabase
            .from("workbooks")
            .delete()
            .eq("storyblok_id", workbook!.storyblok_id);

        if (error) {
            setErrorMessage("An error has occurred. Please try again.");
            setLoading(false);
        } else {
            setSuccessMessage("Workbook successfully deleted.");
            setLoading(false);
            if (!error) setTimeout(() => window.location.reload(), 1000);
        }
        return;
    };

    const confirmSourceCodeAddition = async () => {
        const updates = {
            id: workbookID,
            added_project: true,
        };

        const { error } = await supabase.from("workbooks").upsert(updates);
        window.location.reload();
    };

    return (
        <>
            {workbook ? (
                <>
                    <div className={styles.topContainer}>
                        <h1 className={styles.title} title={workbook.title}>
                            {workbook.title}
                        </h1>
                        {workbook.is_published ? (
                            <Link
                                href={`/workbook/${workbook.slug}`}
                                className={styles.blueButton}
                            >
                                Read
                            </Link>
                        ) : (
                            <div className={styles.buttons}>
                                <Link
                                    href={`/creator/editor/${workbook.slug}`}
                                    className={styles.blueButton}
                                >
                                    Edit
                                </Link>
                                <button
                                    onClick={() => deleteWorkbook()}
                                    className={styles.redButton}
                                    aria-label="Delete Workbook"
                                    title="Delete Workbook"
                                >
                                    {loading ? "Loading..." : "Delete"}
                                </button>
                            </div>
                        )}
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

                        {workbook.is_published && (
                            <p className={styles.text}>
                                Published On:{" "}
                                <span style={{ fontWeight: "800" }}>
                                    {simplifyDate(
                                        convertTZ(workbook.publication_date)
                                    )}
                                </span>
                            </p>
                        )}

                        {workbook.is_published &&
                            workbook.type === "Premium" && (
                                <p className={styles.text}>
                                    Number of Buyers:{" "}
                                    <span style={{ fontWeight: "800" }}>
                                        {workbook.buyer_count}
                                    </span>
                                </p>
                            )}

                        {!workbook.is_published && (
                            <>
                                <div
                                    className={styles.actionContainer}
                                    style={{
                                        border: workbook.added_project
                                            ? "1px solid #22c55e"
                                            : "1px solid #ef4444",
                                    }}
                                >
                                    {workbook.added_project ? (
                                        <p
                                            className={styles.text}
                                            style={{ textAlign: "center" }}
                                        >
                                            Source Code Added
                                        </p>
                                    ) : (
                                        <>
                                            <p
                                                className={styles.text}
                                                style={{ textAlign: "center" }}
                                            >
                                                Please add your Project to{" "}
                                                <Link
                                                    href="https://github.com/teamxynlab/NexLiber-Projects"
                                                    target="_blank"
                                                    className={styles.link}
                                                >
                                                    NexLiber-Projects
                                                </Link>
                                                . Click the button below once
                                                you&apos;ve done so!
                                            </p>
                                            <button
                                                onClick={() =>
                                                    confirmSourceCodeAddition()
                                                }
                                                className={styles.button}
                                                aria-label="I have added my Project to NexLiber-Projects"
                                                title="I have added my Project to NexLiber-Projects"
                                            >
                                                Done
                                            </button>
                                        </>
                                    )}
                                </div>
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
