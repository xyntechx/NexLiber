import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { supabase } from "../../utils/supabase";
import styles from "../../styles/Auth.module.css";
import MainLayout from "../../layouts/MainLayout";
import Alert from "../../components/Alert";

const ResetPassword = () => {
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const [isResetting, setIsResetting] = useState(false);

    const emailInput = useRef<HTMLInputElement>(null);
    const passwordInput = useRef<HTMLInputElement>(null);
    const password2Input = useRef<HTMLInputElement>(null);

    useEffect(() => {
        supabase.auth.onAuthStateChange(async (event, session) => {
            if (event == "PASSWORD_RECOVERY") setIsResetting(true);
        });
    }, []);

    const sendResetLink = async () => {
        const email = emailInput.current!.value.toLowerCase();

        setLoading(true);

        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${process.env.NEXT_PUBLIC_ROOT_URL}/auth/reset-password`,
        });

        if (error) {
            setErrorMessage(error.message);
        } else {
            setSuccessMessage(
                "Success! Please check your email for the reset password link."
            );
        }

        setLoading(false);
        return;
    };

    const handlePasswordReset = async () => {
        const password = passwordInput.current!.value;
        const password2 = password2Input.current!.value;

        setLoading(true);

        if (password !== password2) {
            setErrorMessage("Please ensure your passwords match.");
        } else {
            const { error } = await supabase.auth.updateUser({
                password: password,
            });

            if (error) {
                setErrorMessage(error.message);
            } else {
                setSuccessMessage(
                    "Password updated successfully. You can now sign in with your new password."
                );
            }
        }

        setLoading(false);
        return;
    };

    return (
        <MainLayout
            title="NexLiber | Reset Password"
            description="Reset your NexLiber password"
            url="/auth/reset-password"
        >
            <Alert
                {...{
                    successMessage,
                    setSuccessMessage,
                    errorMessage,
                    setErrorMessage,
                }}
            />

            <section className={styles.container}>
                <h1 className={styles.title}>Reset Password</h1>
                {isResetting ? (
                    <>
                        <div
                            className={styles.inputContainer}
                            style={{ marginTop: "0" }}
                        >
                            <label
                                htmlFor="password"
                                className={styles.text}
                                style={{
                                    paddingLeft: "0.5rem",
                                    cursor: "text",
                                }}
                            >
                                New Password
                            </label>
                            <input
                                ref={passwordInput}
                                type="password"
                                placeholder="New Password"
                                id="password"
                                className={styles.input}
                            />
                        </div>

                        <div className={styles.inputContainer}>
                            <label
                                htmlFor="password2"
                                className={styles.text}
                                style={{
                                    paddingLeft: "0.5rem",
                                    cursor: "text",
                                }}
                            >
                                Confirm New Password
                            </label>
                            <input
                                ref={password2Input}
                                type="password"
                                placeholder="Confirm New Password"
                                id="password2"
                                className={styles.input}
                            />
                        </div>

                        <button
                            onClick={() => handlePasswordReset()}
                            className={styles.button}
                            aria-label="Update Password"
                            title="Update Password"
                        >
                            {loading ? "Loading..." : "Update Password"}
                        </button>
                    </>
                ) : (
                    <>
                        <div
                            className={styles.inputContainer}
                            style={{ marginTop: "0" }}
                        >
                            <label
                                htmlFor="email"
                                className={styles.text}
                                style={{
                                    paddingLeft: "0.5rem",
                                    cursor: "text",
                                }}
                            >
                                Email
                            </label>
                            <input
                                ref={emailInput}
                                type="email"
                                placeholder="Email"
                                id="email"
                                className={styles.input}
                            />
                        </div>
                        <button
                            onClick={() => sendResetLink()}
                            className={styles.button}
                            aria-label="Send Reset Link"
                            title="Send Reset Link"
                        >
                            {loading ? "Loading..." : "Send Reset Link"}
                        </button>
                    </>
                )}
                <sub className={styles.sub}>
                    Remember your password?{" "}
                    <Link href="/auth/" className={styles.pageToggle}>
                        Sign in
                    </Link>{" "}
                    now!
                </sub>
            </section>
        </MainLayout>
    );
};

export default ResetPassword;
