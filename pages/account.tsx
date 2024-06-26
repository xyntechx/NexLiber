import MainLayout from "../layouts/MainLayout";
import { useEffect, useState } from "react";
import { supabase } from "../utils/supabase";
import { useUser } from "@supabase/auth-helpers-react";
import dynamic from "next/dynamic";
import Link from "next/link";
import Image from "next/image";
import styles from "../styles/Account.module.css";
import Alert from "../components/Alert";
import { countries } from "../utils/countries";

const Profile = dynamic(() => import("../components/Theme/Profile"), {
    ssr: false,
});

const Account = () => {
    const user = useUser();

    const [updateLoading, setUpdateLoading] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [showPopup, setShowPopup] = useState(false);

    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const [fullname, setFullname] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [countryCode, setCountryCode] = useState("");
    const [avatar_url, setAvatarUrl] = useState("");
    const [avatarSrc, setAvatarSrc] = useState("");
    const [stripeID, setStripeID] = useState("");

    useEffect(() => {
        const loadData = async () => {
            const { data } = await supabase
                .from("users")
                .select(
                    "full_name, username, email, avatar_url, stripe_acc_id, country_code"
                )
                .eq("id", user!.id);

            if (data) {
                setFullname(data[0].full_name);
                setUsername(data[0].username);
                setEmail(data[0].email);
                setCountryCode(data[0].country_code);
                setAvatarUrl(data[0].avatar_url);
                setStripeID(data[0].stripe_acc_id);
            }
        };

        if (user) loadData();
    }, [user]);

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

        if (!fullname || !username || !email || !countryCode) {
            setErrorMessage("Please ensure all fields are filled in.");
            setUpdateLoading(false);
            return;
        }

        let updates;

        if (countryCode === "OTHERS") {
            updates = {
                id: user!.id,
                full_name: fullname,
                username,
                email,
                country_code: countryCode,
                stripe_acc_id: "NIL",
            };
        } else {
            updates = {
                id: user!.id,
                full_name: fullname,
                username,
                email,
                country_code: countryCode,
            };
        }

        const { error } = await supabase.from("users").upsert(updates);

        if (error) {
            if (
                error.message ===
                'duplicate key value violates unique constraint "users_username_key"'
            )
                setErrorMessage(
                    `The username ${username} has been taken. Please choose another username.`
                );
            else if (
                error.message ===
                'duplicate key value violates unique constraint "users_email_key"'
            )
                setErrorMessage(
                    `The email ${email} has been taken. Please choose another email.`
                );
            else
                setErrorMessage(
                    "An error has occurred. Please ensure all fields are filled in appropriately."
                );
        } else {
            setSuccessMessage("Profile updated!");
        }

        setUpdateLoading(false);
        if (!error) setShowPopup(true);

        return;
    };

    const handleSupabaseDelete = async () => {
        const { data } = await supabase
            .from("workbooks")
            .select("id")
            .eq("creator_id", user!.id);

        let updates = [];

        for (let i = 0; i < data!.length; i++) {
            updates.push({
                id: data![i].id,
                creator_id: null,
            });
        }

        const { error: workbookError } = await supabase
            .from("workbooks")
            .upsert(updates);

        const { error: avatarError } = await supabase.storage
            .from("avatars")
            .remove([avatar_url]);

        const { error: userError } = await supabase
            .from("users")
            .delete()
            .eq("id", user!.id);

        if (userError || workbookError || avatarError) {
            setErrorMessage("An error has occurred. Please try again.");
            setDeleteLoading(false);
            return;
        }

        const { error } = await supabase.auth.signOut();

        if (error) {
            setErrorMessage("An error has occurred. Please try again.");
            setDeleteLoading(false);
            return;
        }

        setSuccessMessage("Your account has been successfully deleted.");
        setDeleteLoading(false);
        return;
    };

    const handleDeleteAccount = async () => {
        setDeleteLoading(true);

        const postData = async () => {
            const data = {
                stripe_id: stripeID,
            };

            const response = await fetch("/api/stripe-acc/delete", {
                method: "POST",
                body: JSON.stringify(data),
            });

            return response.json();
        };

        postData().then((data) => {
            if (data.deleted) handleSupabaseDelete();
            else setErrorMessage("An error has occurred. Please try again.");
            setDeleteLoading(false);
        });

        return;
    };

    const downloadImage = async (path: string) => {
        setAvatarSrc("");

        const { data, error } = await supabase.storage
            .from("avatars")
            .download(path);

        if (!error) {
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

            {showPopup && (
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
                                Where to go?
                            </p>
                            <button
                                onClick={() => setShowPopup(false)}
                                className={styles.button}
                                style={{
                                    padding: "0",
                                    border: "none",
                                    minWidth: "0",
                                    margin: "0",
                                }}
                            >
                                X
                            </button>
                        </div>
                        <div className={styles.popupMain}>
                            <Link href="/library" className={styles.button}>
                                Library
                            </Link>
                            <Link href="/creator" className={styles.button}>
                                Creator Dashboard
                            </Link>
                        </div>
                    </div>
                </div>
            )}

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
                    <div className={styles.inputContainer}>
                        <label
                            htmlFor="country"
                            className={styles.text}
                            style={{ paddingLeft: "0.5rem", cursor: "text" }}
                        >
                            Country
                        </label>
                        <select
                            id="country"
                            defaultValue={countryCode ? countryCode : ""}
                            className={styles.input}
                            onChange={(e) => setCountryCode(e.target.value)}
                        >
                            <option disabled />
                            {countries.map((country) => (
                                <option
                                    key={country.code}
                                    value={country.code}
                                    selected={countryCode === country.code}
                                >
                                    {country.country}
                                </option>
                            ))}
                        </select>
                        <sub className={styles.sub}>
                            If your country is not in the list, or if you are
                            below 18 years old, please read the{" "}
                            <Link
                                href="/docs#stripe-requirements"
                                className={styles.link}
                            >
                                Stripe Requirements
                            </Link>{" "}
                            section of the docs. Don&apos;t worry, you can still
                            learn and create with NexLiber.
                        </sub>
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
                        <p className={styles.text}>
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
                        <p className={styles.text}>
                            Please read the{" "}
                            <Link
                                href="/docs#deleting-your-account"
                                target="_blank"
                                className={styles.link}
                            >
                                Deleting Your Account
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
