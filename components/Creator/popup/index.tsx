import styles from "./Popup.module.css";
import { useRef, useState } from "react";
import { storyblokInit, apiPlugin, getStoryblokApi } from "@storyblok/react";
import { supabase } from "../../../utils/supabase";
import { useUser } from "@supabase/auth-helpers-react";
import Alert from "../../Alert";
import workbookFields from "../../../utils/workbookFields";

interface Props {
    setShowCreatePopup: (showCreatePopup: boolean) => void;
}

const CreateWorkbookPopup = ({ setShowCreatePopup }: Props) => {
    const user = useUser();

    const titleInput = useRef<HTMLInputElement>(null);
    const descriptionInput = useRef<HTMLInputElement>(null);
    const fieldInput = useRef<HTMLInputElement>(null);

    const [field, setField] = useState<string>();
    const [type, setType] = useState<string>();

    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(false);

    storyblokInit({
        accessToken: process.env.NEXT_PUBLIC_STORYBLOK_PUBLIC_TOKEN,
        use: [apiPlugin],
    });

    const createWorkbook = async () => {
        const title = titleInput.current!.value;
        const description = descriptionInput.current!.value;
        const customField = fieldInput.current!.value;

        setLoading(true);

        if (!title || !description || !field || !type) {
            setErrorMessage("Please complete the form.");
            setLoading(false);
            return;
        }

        if (field === "Others")
            handleBackend(title, description, customField, type);
        else handleBackend(title, description, field, type);

        return;
    };

    const handleBackend = async (
        title: string,
        description: string,
        field: string,
        type: string
    ) => {
        const { count, error } = await supabase
            .from("workbooks")
            .select("lower_title", { count: "exact", head: true })
            .eq("lower_title", title.toLowerCase());

        if (error) {
            setErrorMessage("An error has occurred. Please try again.");
            setLoading(false);
            return;
        }

        let slug: string;
        if (count === 0 || count === null)
            slug = `${title.toLowerCase().split(" ").join("-")}`;
        else slug = `${title.toLowerCase().split(" ").join("-")}-${count + 1}`;

        await fetch("https://mapi.storyblok.com/v1/spaces/192717/stories", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: process.env.NEXT_PUBLIC_STORYBLOK_PAT!,
            },
            body: JSON.stringify({
                story: {
                    name: title,
                    slug: slug,
                    parent_id: 251853159,
                    content: {
                        component: "page",
                        body: [
                            {
                                component: "content",
                                title: title,
                                markdown: "",
                            },
                            {
                                component: "quiz",
                                question: "What is your name?",
                                options: {
                                    nyxkey: "nyx",
                                    audreykey: "audrey",
                                    angelokey: "angelo",
                                    iskandarkey: "iskandar",
                                },
                            },
                            {
                                component: "quiz",
                                question: "Again, what is your name?",
                                options: {
                                    nyxkey: "nyx",
                                    audreykey: "audrey",
                                    angelokey: "angelo",
                                    iskandarkey: "iskandar",
                                },
                            },
                        ],
                    },
                },
                publish: 1,
            }),
        }).then((response) => {
            if (!response.ok) {
                setErrorMessage("An error has occurred. Please try again.");
                setLoading(false);
                return;
            }

            handleSupabase(title, slug, description, field, type);

            return;
        });
    };

    const handleSupabase = async (
        title: string,
        slug: string,
        description: string,
        field: string,
        type: string
    ) => {
        const storyblokApi = getStoryblokApi();
        const { data } = await storyblokApi.get(
            `cdn/stories/draft/${slug}`,
            {}
        );

        const { error } = await supabase.from("workbooks").insert({
            title,
            description,
            field,
            type,
            slug,
            lower_title: title.toLowerCase(),
            creator_id: user!.id,
            storyblok_id: data.story.uuid,
            storyblok_num_id: data.story.id,
        });

        if (error) {
            setErrorMessage("An error has occurred. Please try again.");
            setLoading(false);
            return;
        }

        setSuccessMessage("Workbook created! Teleporting you to the Editor...");
        setLoading(false);
        setTimeout(
            () => (window.location.href = `/creator/editor/${data.story.uuid}`),
            1000
        );

        return;
    };

    return (
        <div className={styles.popupContainer}>
            <Alert
                {...{
                    successMessage,
                    setSuccessMessage,
                    errorMessage,
                    setErrorMessage,
                }}
            />

            <div className={styles.popup}>
                <div className={styles.popupTop}>
                    <p
                        className={styles.text}
                        style={{
                            margin: "0",
                            fontWeight: "800",
                        }}
                    >
                        New Workbook
                    </p>
                    <button
                        onClick={() => setShowCreatePopup(false)}
                        className={styles.button}
                        style={{
                            padding: "0",
                            border: "none",
                            minWidth: "0",
                        }}
                    >
                        X
                    </button>
                </div>
                <div className={styles.popupMain}>
                    <label htmlFor="title" className={styles.inputlabel}>
                        Title
                    </label>
                    <input
                        ref={titleInput}
                        placeholder="Title"
                        id="title"
                        type="text"
                        className={styles.input}
                    />

                    <label htmlFor="description" className={styles.inputlabel}>
                        Description
                    </label>
                    <input
                        ref={descriptionInput}
                        placeholder="Description"
                        id="description"
                        type="text"
                        className={styles.input}
                    />

                    <label htmlFor="field" className={styles.inputlabel}>
                        Field
                    </label>
                    <select
                        id="field"
                        defaultValue=""
                        className={styles.input}
                        onChange={(e) => setField(e.target.value)}
                    >
                        <option disabled />
                        {workbookFields.map((field) => (
                            <option key={field} value={field}>
                                {field}
                            </option>
                        ))}
                    </select>
                    <input
                        ref={fieldInput}
                        placeholder="Custom Field"
                        id="field"
                        type="text"
                        className={styles.input}
                        style={{
                            display: field === "Others" ? "block" : "none",
                        }}
                    />

                    <label htmlFor="type" className={styles.inputlabel}>
                        Type
                    </label>
                    <select
                        id="type"
                        defaultValue=""
                        className={styles.input}
                        onChange={(e) => setType(e.target.value)}
                    >
                        <option disabled />
                        <option value="Free">Free</option>
                        <option value="Premium">Premium</option>
                    </select>

                    <button
                        onClick={() => createWorkbook()}
                        className={styles.button}
                        style={{ marginTop: "1rem" }}
                        aria-label="Create Workbook"
                        title="Create Workbook"
                    >
                        {loading ? "Loading..." : "Create"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreateWorkbookPopup;
