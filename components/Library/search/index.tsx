import { useRef, useState } from "react";
import { supabase } from "../../../utils/supabase";
import styles from "./Search.module.css";

interface WorkbookProps {
    id: string;
    type: string;
    title: string;
    description: string;
    field: string;
    creator_id: string;
    creator_name: string;
    publication_date: string;
    slug: string;
}

interface Props {
    setShowSearch: (showSearch: boolean) => void;
    setWorkbooks: (workbooks: WorkbookProps[]) => void;
    setIsSearching: (isSearching: boolean) => void;
}

const Search = ({ setShowSearch, setWorkbooks, setIsSearching }: Props) => {
    const searchInput = useRef<HTMLInputElement>(null);
    const [targetColumn, setTargetColumn] = useState("title");

    const searchWorkbook = async () => {
        const { data } = await supabase
            .from("workbooks")
            .select(
                "id, type, title, description, field, creator_id, publication_date, slug",
                { count: "exact" }
            )
            .eq("is_published", true)
            .textSearch(targetColumn, searchInput.current!.value)
            .order("publication_index", { ascending: false });

        if (data) {
            const tempWorkbooks = [];
            for (let i = 0; i < data.length; i++) {
                const { data: userData } = await supabase
                    .from("users")
                    .select("full_name")
                    .eq("id", data[i].creator_id);
                tempWorkbooks.push({
                    ...data[i],
                    creator_name: userData![0].full_name,
                });
            }
            setWorkbooks(tempWorkbooks);
        }

        setShowSearch(false);
    };

    return (
        <div className={styles.popupContainer}>
            <div className={styles.popup}>
                <div className={styles.popupTop}>
                    <p
                        className={styles.text}
                        style={{
                            margin: "0",
                            fontWeight: "800",
                        }}
                    >
                        Search Workbook
                    </p>
                    <button
                        onClick={() => {
                            setShowSearch(false);
                            setIsSearching(false);
                        }}
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
                    <p className={styles.label}>Search by...</p>
                    <div className={styles.toggleContainer}>
                        <button
                            onClick={() => setTargetColumn("title")}
                            className={styles.button}
                            style={{
                                color:
                                    targetColumn === "title"
                                        ? "var(--color-theme)"
                                        : "var(--color-text)",
                            }}
                        >
                            Title
                        </button>
                        <button
                            onClick={() => setTargetColumn("description")}
                            className={styles.button}
                            style={{
                                color:
                                    targetColumn === "description"
                                        ? "var(--color-theme)"
                                        : "var(--color-text)",
                            }}
                        >
                            Desc
                        </button>
                        <button
                            onClick={() => setTargetColumn("field")}
                            className={styles.button}
                            style={{
                                color:
                                    targetColumn === "field"
                                        ? "var(--color-theme)"
                                        : "var(--color-text)",
                            }}
                        >
                            Field
                        </button>
                    </div>
                    <input
                        ref={searchInput}
                        placeholder="Search..."
                        type="text"
                        className={styles.input}
                    />
                    <button
                        onClick={() => searchWorkbook()}
                        className={styles.button}
                        style={{ marginTop: "1rem", minWidth: "90px" }}
                        aria-label="Search Workbook"
                        title="Search Workbook"
                    >
                        Search
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Search;
