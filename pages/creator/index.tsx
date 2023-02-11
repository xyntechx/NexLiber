import MainLayout from "../../layouts/MainLayout";
import { useEffect, useState } from "react";
import { supabase } from "../../utils/supabase";
import { useUser } from "@supabase/auth-helpers-react";
import { storyblokInit, apiPlugin } from "@storyblok/react";
import dynamic from "next/dynamic";
import Link from "next/link";
import Alert from "../../components/Alert";
import styles from "../../styles/Creator.module.css";
import CreateWorkbookPopup from "../../components/Creator/popup";
import WorkbookOverview from "../../components/Creator/overview";

const CreateButton = dynamic(
    () => import("../../components/Theme/buttons/Create"),
    {
        ssr: false,
    }
);

interface Workbook {
    id: string;
    title: string;
}

const Creator = () => {
    // User data
    const user = useUser();
    const [userData, setUserData] = useState<any[] | null>();
    const [completeUserData, setCompleteUserData] = useState(false);
    const [fullname, setFullname] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [stripeID, setStripeID] = useState("");
    const [isCompleteStripe, setIsCompleteStripe] = useState(false);

    // Workbook data
    const [freeDraftWbs, setFreeDraftWbs] = useState<any[] | null>();
    const [freePublishedWbs, setFreePublishedWbs] = useState<any[] | null>();
    const [premiumDraftWbs, setPremiumDraftWbs] = useState<any[] | null>();
    const [premiumPublishedWbs, setPremiumPublishedWbs] = useState<
        any[] | null
    >();
    const [viewedWorkbook, setViewedWorkbook] = useState<Workbook | null>(null);

    // Misc
    const [showCreatePopup, setShowCreatePopup] = useState(false);
    const [isViewDraft, setIsViewDraft] = useState(true);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    storyblokInit({
        accessToken: process.env.NEXT_PUBLIC_STORYBLOK_PUBLIC_TOKEN,
        use: [apiPlugin],
    });

    useEffect(() => {
        const loadWorkbooks = async () => {
            const { data: freeDraftData } = await supabase
                .from("workbooks")
                .select("id, title")
                .match({
                    creator_id: user!.id,
                    is_published: false,
                    type: "Free",
                });
            setFreeDraftWbs(freeDraftData);

            const { data: freePublishedData } = await supabase
                .from("workbooks")
                .select("id, title")
                .match({
                    creator_id: user!.id,
                    is_published: true,
                    type: "Free",
                });
            setFreePublishedWbs(freePublishedData);

            const { data: premiumDraftData } = await supabase
                .from("workbooks")
                .select("id, title")
                .match({
                    creator_id: user!.id,
                    is_published: false,
                    type: "Premium",
                });
            setPremiumDraftWbs(premiumDraftData);

            const { data: premiumPublishedData } = await supabase
                .from("workbooks")
                .select("id, title")
                .match({
                    creator_id: user!.id,
                    is_published: true,
                    type: "Premium",
                });
            setPremiumPublishedWbs(premiumPublishedData);
        };

        if (user) loadWorkbooks();
    }, [user]);

    useEffect(() => {
        const loadUserData = async () => {
            const { data } = await supabase
                .from("users")
                .select("full_name, username, email, stripe_acc_id")
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
            setStripeID(userData[0].stripe_acc_id);
        }
    }, [userData]);

    useEffect(() => {
        if (fullname && username && email) {
            setCompleteUserData(true);
        }
    }, [fullname, username, email]);

    useEffect(() => {
        const checkStripeAcc = () => {
            const postData = async () => {
                const data = {
                    stripe_id: stripeID,
                };

                const response = await fetch("/api/stripe-acc/check", {
                    method: "POST",
                    body: JSON.stringify(data),
                });

                return response.json();
            };

            postData().then((data) => {
                if (data.charges_enabled && data.details_submitted)
                    setIsCompleteStripe(true);
            });
        };

        if (stripeID) checkStripeAcc();
    }, [stripeID]);

    const handleStripeLink = () => {
        setSuccessMessage("Redirecting you to Stripe Onboarding...");

        const postData = async () => {
            const data = {
                email: email,
                stripe_id: stripeID,
            };

            const response = await fetch("/api/stripe-acc/link", {
                method: "POST",
                body: JSON.stringify(data),
            });

            return response.json();
        };

        postData().then((data) => {
            handleStripeResponse(data.stripe_acc_id, data.onboarding_url);
        });
    };

    const handleStripeResponse = async (
        stripe_acc_id: string,
        onboarding_url: string
    ) => {
        const updates = {
            id: user!.id,
            stripe_acc_id,
        };
        const { error } = await supabase.from("users").upsert(updates);
        if (!error) window.location.href = onboarding_url;
    };

    return (
        <MainLayout
            title="NexLiber | Creator Dashboard"
            description="Access your Workbook overviews, link your Stripe account, and create Workbooks"
            url="/creator"
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
                    {showCreatePopup && (
                        <CreateWorkbookPopup
                            setShowCreatePopup={setShowCreatePopup}
                        />
                    )}

                    <div className={styles.topDiv}>
                        <h1 className={styles.title}>Creator Dashboard</h1>
                        <div className={styles.buttons}>
                            {isCompleteStripe ? (
                                <>
                                    <div className={styles.buttonGreen}>
                                        Stripe Account Linked
                                    </div>
                                    <button
                                        onClick={() => setShowCreatePopup(true)}
                                        className={styles.button}
                                        style={{ paddingRight: "1rem" }}
                                        aria-label="Create Workbook"
                                        title="Create Workbook"
                                    >
                                        <CreateButton /> Create Workbook
                                    </button>
                                </>
                            ) : (
                                <button
                                    onClick={() => handleStripeLink()}
                                    className={styles.button}
                                    style={{ paddingRight: "1rem" }}
                                    aria-label="Link Stripe Account"
                                    title="Link Stripe Account"
                                >
                                    <CreateButton /> Link Stripe Account
                                </button>
                            )}
                        </div>
                    </div>
                    <div className={styles.mainDiv}>
                        <div className={styles.contents}>
                            <div className={styles.toggles}>
                                <button
                                    onClick={() => setIsViewDraft(true)}
                                    className={styles.toggle}
                                    style={{
                                        color: isViewDraft
                                            ? "var(--color-theme)"
                                            : "var(--color-text)",
                                        paddingLeft: "1rem",
                                    }}
                                >
                                    Draft
                                </button>
                                <button
                                    onClick={() => setIsViewDraft(false)}
                                    className={styles.toggle}
                                    style={{
                                        color: !isViewDraft
                                            ? "var(--color-theme)"
                                            : "var(--color-text)",
                                    }}
                                >
                                    Published
                                </button>
                            </div>
                            <div className={styles.workbookTitles}>
                                {isViewDraft ? (
                                    <>
                                        <p className={styles.typeLabel}>
                                            Premium
                                        </p>
                                        {premiumDraftWbs?.length ? (
                                            <>
                                                {premiumDraftWbs!.map(
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
                                        <p className={styles.typeLabel}>Free</p>
                                        {freeDraftWbs?.length ? (
                                            <>
                                                {freeDraftWbs!.map(
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
                                        <p className={styles.typeLabel}>
                                            Premium
                                        </p>
                                        {premiumPublishedWbs?.length ? (
                                            <>
                                                {premiumPublishedWbs!.map(
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
                                        <p className={styles.typeLabel}>Free</p>
                                        {freePublishedWbs?.length ? (
                                            <>
                                                {freePublishedWbs!.map(
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
                            to your NexLiber account to access your Creator
                            Dashboard.
                        </h1>
                    ) : (
                        <h1 className={styles.text}>
                            Please{" "}
                            <Link href="/account" className={styles.link}>
                                complete all fields
                            </Link>{" "}
                            in the My Account page to access your Creator
                            Dashboard.
                        </h1>
                    )}
                </section>
            )}
        </MainLayout>
    );
};

export default Creator;
