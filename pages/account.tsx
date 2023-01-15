import MainLayout from "../layouts/MainLayout";
import { useEffect, useState } from "react";
import { supabase } from "../utils/supabase";
import { useUser } from "@supabase/auth-helpers-react";
import dynamic from "next/dynamic";
import Link from "next/link";
import Image from "next/image";
import styles from "../styles/Account.module.css";
import Alert from "../components/Alert";

const Profile = dynamic(() => import("../components/Theme/Profile"), {
    ssr: false,
});

const Account = () => {
    const user = useUser();

    const [updateLoading, setUpdateLoading] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [uploading, setUploading] = useState(false);

    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const [data, setData] = useState<any[] | null>();

    const [fullname, setFullname] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [isSubscribed, setIsSubscribed] = useState("");
    const [avatar_url, setAvatarUrl] = useState("");
    const [avatarSrc, setAvatarSrc] = useState("");

    useEffect(() => {
        const loadData = async () => {
            const { data } = await supabase
                .from("users")
                .select("full_name, username, email, avatar_url, is_subscribed")
                .eq("id", user!.id);
            setData(data);
        };

        if (user) loadData();
    }, [user]);

    useEffect(() => {
        if (data) {
            setFullname(data[0].full_name);
            setUsername(data[0].username);
            setEmail(data[0].email);
            setAvatarUrl(data[0].avatar_url);
            setIsSubscribed(data[0].is_subscribed);
        }
    }, [data]);

    useEffect(() => {
        if (avatar_url) downloadImage(avatar_url);
    }, [avatar_url]);

    useEffect(() => {
        window.addEventListener("avatarUpdate", () => {
            if (avatar_url) downloadImage(avatar_url);
        });
    });

    useEffect(() => {
        supabase.auth.onAuthStateChange(async (event, session) => {
            if (event == "SIGNED_OUT") window.location.href = "/";
        });
    }, []);

    const handleUpdateProfile = async () => {
        setUpdateLoading(true);

        if (!fullname || !username || !email) {
            setErrorMessage("Please ensure all fields are filled in.");
            setUpdateLoading(false);
            return;
        }

        const updates = {
            id: user!.id,
            full_name: fullname,
            username,
            email,
        };
        const { error } = await supabase.from("users").upsert(updates);

        if (error) {
            setErrorMessage(
                "An error has occurred. Please ensure all fields are filled in appropriately."
            );
        } else {
            setSuccessMessage(
                "Profile updated! Teleporting you to the Library..."
            );
        }

        setUpdateLoading(false);
        if (!error) setTimeout(() => (window.location.href = "/library"), 1000);

        return;
    };

    const handleDeleteAccount = async () => {
        setDeleteLoading(true);

        // TODO: Write logic here (See Notion "Delete Account button in /account")

        setDeleteLoading(false);
        return;
    };

    const downloadImage = async (path: string) => {
        setAvatarSrc("");

        const { data, error } = await supabase.storage
            .from("avatars")
            .download(path);
        
        console.log("error", error)

        if (!error) {
            console.log("no error")
            const url = URL.createObjectURL(data);
            setAvatarSrc(url);
        }
    };

    const uploadAvatar: React.ChangeEventHandler<HTMLInputElement> = async (
        event
    ) => {
        setUploading(true);

        if (!event.target.files || event.target.files!.length === 0) {
            setErrorMessage("Please select an image to upload.");
            setUploading(false);
            return;
        }

        const file = event.target.files[0];

        if (file.size / 1024 ** 2 > 0.1) {
            // 100kB limit
            setErrorMessage("Please select an image less than 100kB.");
            setUploading(false);
            return;
        }

        const fileExt = file.name.split(".").pop();
        const filePath = `${user!.id}.${fileExt}`;

        let { error } = await supabase.storage
            .from("avatars")
            .upload(filePath, file, { upsert: true });

        if (error) {
            setErrorMessage(error.message);
            setUploading(false);
            return;
        }

        const updates = { id: user!.id, avatar_url: filePath };

        const { error: tableError } = await supabase
            .from("users")
            .upsert(updates);

        if (tableError) {
            setErrorMessage(tableError.message);
            setUploading(false);
            return;
        }

        setSuccessMessage(
            "Profile picture updated! It may take some time to be displayed."
        );
        window.dispatchEvent(new Event("avatarUpdate")); // for responsiveness of other components
        setUploading(false);
        return;
    };

    return (
        <MainLayout
            title="NexLiber | My Account"
            description="Manage your NexLiber account"
            url="/account"
        >
            <Alert
                {...{
                    successMessage,
                    setSuccessMessage,
                    errorMessage,
                    setErrorMessage,
                }}
            />

            {user ? (
                <section className={styles.container}>
                    <h1 className={styles.title}>My Account</h1>

                    <label
                        htmlFor="profile"
                        style={{
                            cursor: "pointer",
                            width: "100px",
                            height: "100px",
                        }}
                    >
                        <input
                            type="file"
                            accept="image/*"
                            name="profile"
                            id="profile"
                            style={{ display: "none", cursor: "default" }}
                            onChange={(event) => uploadAvatar(event)}
                            disabled={uploading}
                        />
                        {avatarSrc ? (
                            <Image
                                src={avatarSrc}
                                alt="Profile Picture"
                                width={100}
                                height={100}
                                className={styles.avatar}
                            />
                        ) : (
                            <Profile width={100} height={100} />
                        )}
                    </label>

                    <div className={styles.inputContainer}>
                        <label
                            htmlFor="fullname"
                            className={styles.text}
                            style={{ paddingLeft: "0.5rem", cursor: "text" }}
                        >
                            Full Name
                        </label>
                        <input
                            value={fullname}
                            type="text"
                            onChange={(e) => setFullname(e.target.value)}
                            placeholder="Full Name"
                            id="fullname"
                            className={styles.input}
                        />
                    </div>
                    <div className={styles.inputContainer}>
                        <label
                            htmlFor="username"
                            className={styles.text}
                            style={{ paddingLeft: "0.5rem", cursor: "text" }}
                        >
                            Username
                        </label>
                        <input
                            value={username}
                            type="text"
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Username"
                            id="username"
                            className={styles.input}
                        />
                    </div>
                    <div className={styles.inputContainer}>
                        <label
                            htmlFor="email"
                            className={styles.text}
                            style={{ paddingLeft: "0.5rem", cursor: "text" }}
                        >
                            Email
                        </label>
                        <input
                            value={email}
                            type="email"
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email"
                            id="email"
                            className={styles.input}
                        />
                    </div>

                    <button
                        onClick={() => handleUpdateProfile()}
                        className={styles.button}
                        aria-label="Update Profile"
                        title="Update Profile"
                    >
                        {updateLoading ? "Loading..." : "Update Profile"}
                    </button>

                    <div className={styles.subContainer}>
                        <p
                            className={styles.text}
                            style={{ textAlign: "left" }}
                        >
                            You are currently under the{" "}
                            <Link
                                href="/docs#subscription"
                                className={styles.link}
                            >
                                {isSubscribed ? "Complete" : "Lite"}
                            </Link>{" "}
                            plan.
                        </p>
                        <Link href="/subscription" className={styles.button}>
                            Manage Subscription
                        </Link>
                    </div>

                    <div className={styles.subContainer}>
                        <p
                            className={styles.text}
                            style={{ textAlign: "left" }}
                        >
                            For your safety, we recommend that you change your
                            password every 3 months.
                        </p>
                        <Link
                            href="/auth/reset-password"
                            className={styles.button}
                        >
                            Reset Password
                        </Link>
                    </div>

                    <div className={styles.dangerContainer}>
                        <h2 className={styles.redTitle}>Danger Zone</h2>
                        <p className={styles.dangerText}>
                            Please read the{" "}
                            <Link
                                href="/docs#delete-account"
                                className={styles.link}
                            >
                                Delete Account
                            </Link>{" "}
                            section of the docs before you click the button
                            below.
                        </p>
                        <button
                            onClick={() => handleDeleteAccount()}
                            className={styles.redButton}
                            aria-label="Delete Account"
                            title="Delete Account"
                        >
                            {deleteLoading ? "Loading..." : "Delete Account"}
                        </button>
                    </div>
                </section>
            ) : (
                <section className={styles.container}>
                    <h1 className={styles.text}>
                        Please{" "}
                        <Link href="/auth" className={styles.link}>
                            sign in
                        </Link>{" "}
                        to your NexLiber account to access this page.
                    </h1>
                </section>
            )}
        </MainLayout>
    );
};

export default Account;
