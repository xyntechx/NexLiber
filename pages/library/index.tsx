import MainLayout from "../../layouts/MainLayout";
import { useEffect, useState } from "react";
import { supabase } from "../../utils/supabase";
import { useUser } from "@supabase/auth-helpers-react";
import CreateButton from "../../components/Theme/buttons/Create";
import SearchButton from "../../components/Theme/buttons/Search";
import Link from "next/link";
import styles from "../../styles/Library.module.css";
import Card from "../../components/Library/card";
import Search from "../../components/Library/search";

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

const Library = () => {
    // User Data
    const user = useUser();
    const [completeData, setCompleteData] = useState(false);
    const [fullname, setFullname] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [boughtWbIDs, setBoughtWbIDs] = useState<string[] | null>();

    // Workbooks
    const [workbooks, setWorkbooks] = useState<WorkbookProps[] | null>();
    const [total, setTotal] = useState(0);

    // For Pagination (start and end are inclusive)
    const [fromIndex, setFromIndex] = useState(0);
    const [toIndex, setToIndex] = useState(3);

    // Misc
    const [showSearch, setShowSearch] = useState(false);
    const [isSearching, setIsSearching] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            const { data } = await supabase
                .from("users")
                .select("full_name, username, email, bought_wb_ids")
                .eq("id", user!.id);

            if (data) {
                setFullname(data[0].full_name);
                setUsername(data[0].username);
                setEmail(data[0].email);
                setBoughtWbIDs(data[0].bought_wb_ids);
            }
        };

        if (user) loadData();
    }, [user]);

    useEffect(() => {
        if (fullname && username && email) {
            setCompleteData(true);
        }
    }, [fullname, username, email]);

    useEffect(() => {
        const loadWorkbooks = async () => {
            const { data, count } = await supabase
                .from("workbooks")
                .select(
                    "id, type, title, description, field, creator_id, publication_date, slug",
                    { count: "exact" }
                )
                .eq("is_published", true)
                .order("publication_index", { ascending: false })
                .range(fromIndex, toIndex);

            if (data) {
                const tempWorkbooks = [];
                for (let i = 0; i < data.length; i++) {
                    const { data: userData } = await supabase
                        .from("users")
                        .select("full_name")
                        .eq("id", data[i].creator_id);
                    tempWorkbooks.push({
                        ...data[i],
                        creator_name: userData
                            ? userData![0].full_name
                            : "Anonymous Creator",
                    });
                }
                setWorkbooks(tempWorkbooks);
            }

            if (count) setTotal(count);
        };

        if (user) loadWorkbooks();
    }, [fromIndex, toIndex, user, isSearching]);

    return (
        <MainLayout
            title="NexLiber | Library"
            description="Browse NexLiber Workbooks"
            url="/library"
        >
            {user && completeData ? (
                <section className={styles.container}>
                    {showSearch && (
                        <Search
                            {...{
                                setShowSearch,
                                setWorkbooks,
                                setIsSearching,
                            }}
                        />
                    )}
                    <header className={styles.header}>
                        <h1 className={styles.title}>Library</h1>
                        <div className={styles.buttonContainer}>
                            <Link
                                href="/creator"
                                aria-label="Create Workbook"
                                title="Create Workbook"
                                className={styles.button}
                            >
                                <CreateButton />
                            </Link>
                            <button
                                aria-label="Search Workbook"
                                title="Search Workbook"
                                className={styles.button}
                                onClick={() => {
                                    setShowSearch(true);
                                    setIsSearching(true);
                                }}
                            >
                                <SearchButton />
                            </button>
                        </div>
                    </header>
                    <div className={styles.info}>
                        <p className={styles.subtitle}>
                            {isSearching ? "Search Results" : "All Workbooks"}
                        </p>
                        {isSearching && (
                            <button
                                onClick={() => setIsSearching(false)}
                                className={styles.textButton}
                            >
                                Reset
                            </button>
                        )}
                    </div>
                    {workbooks?.length ? (
                        <div className={styles.grid}>
                            {workbooks!.map((workbook) => (
                                <Card
                                    key={workbook.id}
                                    {...{ workbook, boughtWbIDs, user }}
                                />
                            ))}
                        </div>
                    ) : (
                        <p className={styles.text} style={{ height: "60vh" }}>
                            No Workbooks found.
                        </p>
                    )}
                    {!isSearching && (
                        <div className={styles.navButtons}>
                            <button
                                disabled={fromIndex === 0}
                                onClick={() => {
                                    setFromIndex(fromIndex - 4);
                                    setToIndex(toIndex - 4);
                                }}
                                className={styles.navButton}
                            >
                                &lt; Prev
                            </button>
                            <button
                                disabled={fromIndex + 4 >= total}
                                onClick={() => {
                                    setFromIndex(fromIndex + 4);
                                    setToIndex(toIndex + 4);
                                }}
                                className={styles.navButton}
                            >
                                Next &gt;
                            </button>
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
                            to your NexLiber account to access the Library.
                        </h1>
                    ) : (
                        <h1 className={styles.text}>
                            Please{" "}
                            <Link href="/account" className={styles.link}>
                                complete all fields
                            </Link>{" "}
                            in the My Account page to access the Library.
                        </h1>
                    )}
                </section>
            )}
        </MainLayout>
    );
};

export default Library;
