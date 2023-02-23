import MainLayout from "../../../layouts/MainLayout";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { supabase } from "../../../utils/supabase";
import { useUser } from "@supabase/auth-helpers-react";
import { storyblokInit, apiPlugin, getStoryblokApi } from "@storyblok/react";
import Alert from "../../../components/Alert";
import Link from "next/link";
import workbookFields from "../../../utils/workbookFields";
import styles from "../../../styles/Creator.module.css";
import WorkbookContent from "../../../components/WorkbookContent";

const Editor = () => {
    const user = useUser();

    const router = useRouter();

    // Workbook Data
    const { workbookSlug } = router.query;
    const [workbookData, setWorkbookData] = useState<any[] | null>();
    const [supabaseID, setSupabaseID] = useState("");
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [field, setField] = useState("");
    const [content, setContent] = useState("");
    const [creatorID, setCreatorID] = useState("");
    const [storyblokNumID, setStoryblokNumID] = useState<number>();
    const [addedProject, setAddedProject] = useState<boolean>();

    // User Data
    const [completeUserData, setCompleteUserData] = useState(false);
    const [userData, setUserData] = useState<any[] | null>();
    const [fullname, setFullname] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [countryCode, setCountryCode] = useState("");
    const [stripeID, setStripeID] = useState("");
    const [isCompleteStripe, setIsCompleteStripe] = useState(false);

    // Misc
    const [isEditing, setIsEditing] = useState(true);
    const [isMyWorkbook, setIsMyWorkbook] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [saveLoading, setSaveLoading] = useState(false);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [needSave, setNeedSave] = useState(false);
    const [needSubmit, setNeedSubmit] = useState(false);
    const [fieldChangeTrigger, setFieldChangeTrigger] = useState(0); // only used as toggle

    storyblokInit({
        accessToken: process.env.NEXT_PUBLIC_STORYBLOK_PUBLIC_TOKEN,
        use: [apiPlugin],
    });

    useEffect(() => {
        const loadWorkbookData = async () => {
            const { data } = await supabase
                .from("workbooks")
                .select(
                    "id, title, description, field, creator_id, storyblok_num_id, added_project"
                )
                .eq("slug", workbookSlug);
            setWorkbookData(data);
        };

        if (workbookSlug) loadWorkbookData();
    }, [workbookSlug]);

    useEffect(() => {
        const loadUserData = async () => {
            const { data } = await supabase
                .from("users")
                .select(
                    "full_name, username, email, stripe_acc_id, country_code"
                )
                .eq("id", user!.id);
            setUserData(data);
        };

        if (user) loadUserData();
    }, [user]);

    useEffect(() => {
        if (workbookData) {
            setSupabaseID(workbookData[0].id);
            setTitle(workbookData[0].title);
            setDescription(workbookData[0].description);
            setField(workbookData[0].field);
            setCreatorID(workbookData[0].creator_id);
            setStoryblokNumID(workbookData[0].storyblok_num_id);
            setAddedProject(workbookData[0].added_project);
        }
    }, [workbookData]);

    useEffect(() => {
        if (userData) {
            setFullname(userData[0].full_name);
            setUsername(userData[0].username);
            setEmail(userData[0].email);
            setCountryCode(userData[0].country_code);
            setStripeID(userData[0].stripe_acc_id);
        }
    }, [userData]);

    useEffect(() => {
        if (fullname && username && email && countryCode) {
            setCompleteUserData(true);
        }
    }, [fullname, username, email, countryCode]);

    useEffect(() => {
        if (creatorID && user) {
            if (creatorID === user.id) setIsMyWorkbook(true);
        }
    }, [creatorID, user]);

    useEffect(() => {
        if (addedProject && content) setNeedSubmit(true);
        else setNeedSubmit(false);
    }, [addedProject, content]);

    useEffect(() => {
        if (fieldChangeTrigger) {
            if (field === "Others") setNeedSave(false);
            else setNeedSave(true);
        }
    }, [fieldChangeTrigger, field]);

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

    const saveWorkbook = async (isSubmit: boolean) => {
        setSaveLoading(true);

        if (!description || !field) {
            setErrorMessage(
                "You must fill both the Workbook description and field up."
            );
            setSaveLoading(false);
            return;
        }

        await fetch(
            `https://mapi.storyblok.com/v1/spaces/192717/stories/${storyblokNumID}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: process.env.NEXT_PUBLIC_STORYBLOK_PAT!,
                },
                body: JSON.stringify({
                    story: {
                        name: title,
                        slug: workbookSlug,
                        content: {
                            component: "content",
                            title: title,
                            markdown: content,
                        },
                    },
                    publish: 1,
                }),
            }
        ).then((response) => {
            if (!response.ok) {
                setErrorMessage("An error has occurred. Please try again.");
                return;
            }
            handleSaveSupabase(isSubmit);
        });
    };

    const handleSaveSupabase = async (isSubmit: boolean) => {
        const updates = {
            id: supabaseID,
            description: description,
            field: field,
            status: isSubmit ? "Under Review" : "In Progress",
        };

        const { error } = await supabase.from("workbooks").upsert(updates);

        if (error) {
            setErrorMessage("An error has occurred. Please try again.");
            setSaveLoading(false);
            return;
        } else {
            setSaveLoading(false);
            setNeedSave(false);
            if (isSubmit) handleEmailNotif();
            else setSuccessMessage("Workbook draft successfully saved.");
            return;
        }
    };

    const submitDraft = async () => {
        setSubmitLoading(true);

        if (!addedProject) {
            setErrorMessage(
                "Please add your Project to NexLiber-Projects before publishing your Workbook."
            );
            setSubmitLoading(false);
            return;
        }

        saveWorkbook(true);
        return;
    };

    const handleEmailNotif = () => {
        const postData = async () => {
            const data = {
                email: email,
                bcc: "teamxynlab@gmail.com",
                subject: `${title}: Under Review`,
                text: `Hi ${username}!
                
                Thank you for submitting your draft of ${title}. It is currently being reviewed by the NexLiber team.
                
                You will be notified via email should you need to make improvements to your Workbook before publishing it. If no further improvements are required, our team will publish your Workbook as soon as possible. You will also be notified via email when your Workbook has been published.

                If you have any questions, please feel free to reply to this email to ask!
                
                Thank you and expect to hear from us soon!
                
                The NexLiber Team`,
                html: `<p>Hi ${username}!</p>
                
                <p>Thank you for submitting your draft of <strong>${title}</strong>. It is currently being reviewed by the NexLiber team.</p>
                
                <p>You will be notified via email should you need to make improvements to your Workbook before publishing it. If no further improvements are required, our team will publish your Workbook as soon as possible. You will also be notified via email when your Workbook has been published.</p>

                <p>If you have any questions, please feel free to reply to this email to ask!</p>
                
                <p>Thank you and expect to hear from us soon!</p>
                
                <p>The NexLiber Team</p>`,
            };

            const response = await fetch("/api/sendgrid", {
                method: "POST",
                body: JSON.stringify(data),
            });

            return response.json();
        };

        postData().then((data) => {
            setSubmitLoading(false);
            if (data.success)
                setSuccessMessage("Workbook draft successfully submitted.");
            else setErrorMessage("An error has occurred. Please try again.");
        });
    };

    return (
        <MainLayout
            title="NexLiber | Workbook Editor"
            description="Create, edit, and publish Workbooks"
            url="/creator/editor"
        >
            <Alert
                {...{
                    successMessage,
                    setSuccessMessage,
                    errorMessage,
                    setErrorMessage,
                }}
            />
            {user && completeUserData && isCompleteStripe && isMyWorkbook ? (
                <section className={styles.container}>
                    <div className={styles.topDiv}>
                        <div className={styles.workbookDetails}>
                            <h1
                                className={styles.editorWorkbookTitle}
                                title={title}
                            >
                                <Link
                                    href="/creator"
                                    className={styles.link}
                                    style={{ marginRight: "0.5rem" }}
                                >
                                    &lt;
                                </Link>{" "}
                                {title}
                            </h1>
                            <input
                                value={description}
                                onChange={(e) => {
                                    setDescription(e.target.value);
                                    setNeedSave(true);
                                }}
                                placeholder="Description"
                                id="description"
                                type="text"
                                className={styles.input}
                            />
                            <select
                                id="field"
                                defaultValue={
                                    workbookFields.includes(field)
                                        ? field
                                        : "Others"
                                }
                                className={styles.input}
                                onChange={(e) => {
                                    setField(e.target.value);
                                    setFieldChangeTrigger(
                                        fieldChangeTrigger + 1
                                    );
                                }}
                            >
                                {workbookFields.map((field) => (
                                    <option key={field} value={field}>
                                        {field}
                                    </option>
                                ))}
                            </select>
                            {(!workbookFields.includes(field) ||
                                field === "Others") && (
                                <input
                                    value={field === "Others" ? "" : field}
                                    onChange={(e) => {
                                        if (e.target.value) {
                                            setField(e.target.value);
                                            setNeedSave(true);
                                        } else {
                                            setField("");
                                            setNeedSave(false);
                                        }
                                    }}
                                    placeholder="Custom Field"
                                    id="field"
                                    type="text"
                                    className={styles.input}
                                />
                            )}
                        </div>
                        <div className={styles.buttons}>
                            <button
                                onClick={() => setIsEditing(!isEditing)}
                                className={styles.button}
                                aria-label={`Switch to ${
                                    isEditing ? "Preview" : "Editing"
                                } Mode`}
                                title={`Switch to ${
                                    isEditing ? "Preview" : "Editing"
                                } Mode`}
                            >
                                {isEditing ? "Preview" : "Edit"}
                            </button>
                            <button
                                onClick={() => saveWorkbook(false)}
                                className={styles.blueButton}
                                aria-label="Save Workbook Draft"
                                title={
                                    !needSave
                                        ? "Make changes first before saving"
                                        : "Save Workbook Draft"
                                }
                                disabled={!needSave}
                                style={{
                                    color: needSave
                                        ? "#0ea5e9"
                                        : "var(--color-text-blur)",
                                    borderColor: needSave
                                        ? "#0ea5e9"
                                        : "var(--color-text-blur)",
                                    cursor: needSave ? "pointer" : "default",
                                }}
                            >
                                {saveLoading ? "Loading..." : "Save"}
                            </button>
                            <button
                                onClick={() => submitDraft()}
                                className={styles.greenButton}
                                aria-label="Submit Workbook Draft"
                                title={
                                    !needSubmit
                                        ? "Complete your Workbook draft and add your Project before submitting"
                                        : "Submit Workbook Draft"
                                }
                                disabled={!needSubmit}
                                style={{
                                    color: needSubmit
                                        ? "#22c55e"
                                        : "var(--color-text-blur)",
                                    borderColor: needSubmit
                                        ? "#22c55e"
                                        : "var(--color-text-blur)",
                                    cursor: needSubmit ? "pointer" : "default",
                                }}
                            >
                                {submitLoading ? "Loading..." : "Submit"}
                            </button>
                        </div>
                    </div>
                    {isEditing ? (
                        <textarea
                            value={content}
                            onChange={(e) => {
                                setContent(e.target.value);
                                setNeedSave(true);
                            }}
                            placeholder="Write your Workbook here..."
                            id="content"
                            className={styles.editorArea}
                        />
                    ) : (
                        <WorkbookContent {...{ content }} />
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
                            to your NexLiber account to access your Creator
                            Dashboard.
                        </h1>
                    ) : (
                        <>
                            {!isMyWorkbook ? (
                                <h1 className={styles.text}>
                                    You cannot edit someone else&apos;s
                                    Workbook! Please{" "}
                                    <Link href="/auth" className={styles.link}>
                                        sign in
                                    </Link>{" "}
                                    to the correct NexLiber account to edit this
                                    Workbook.
                                </h1>
                            ) : (
                                <>
                                    {!isCompleteStripe ? (
                                        <h1 className={styles.text}>
                                            Please{" "}
                                            <Link
                                                href="/creator"
                                                className={styles.link}
                                            >
                                                link your Stripe Account
                                            </Link>{" "}
                                            to NexLiber.
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
                                            in the My Account page to access
                                            your Creator Dashboard.
                                        </h1>
                                    )}
                                </>
                            )}
                        </>
                    )}
                </section>
            )}
        </MainLayout>
    );
};

export default Editor;
