import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Provider } from "@supabase/supabase-js";
import { supabase } from "../../utils/supabase";
import { useUser } from "@supabase/auth-helpers-react";
import styles from "../../styles/Auth.module.css";
import MainLayout from "../../layouts/MainLayout";
import Alert from "../../components/Alert";

const Auth = () => {
    const user = useUser();

    const [isSignIn, setIsSignIn] = useState(true);
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const providers: Provider[] = ["google", "discord", "github"];

    const emailInput = useRef<HTMLInputElement>(null);
    const passwordInput = useRef<HTMLInputElement>(null);
    const password2Input = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (user) window.location.href = "/account";
    }, [user]);

    const handleEmailSignIn = async () => {
        // For returning users

        const email = emailInput.current!.value.toLowerCase();
        const password = passwordInput.current!.value;

        setLoading(true);

        const { error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        });

        if (error) {
            setErrorMessage(error.message);
        } else {
            setSuccessMessage("Signed in!");
        }

        setLoading(false);
        return;
    };

    const handleEmailSignUp = async () => {
        // For new users

        const email = emailInput.current!.value.toLowerCase();
        const password = passwordInput.current!.value;
        const password2 = password2Input.current!.value;

        setLoading(true);

        if (password !== password2) {
            setErrorMessage("Please ensure your passwords match.");
        } else {
            const { error } = await supabase.auth.signUp({
                email: email,
                password: password,
                options: {
                    data: {
                        email: email,
                    },
                },
            });

            if (error) {
                setErrorMessage(error.message);
            } else {
                setSuccessMessage(
                    "Success! Please check your email and confirm your signup."
                );
            }
        }

        setLoading(false);
        return;
    };

    const handleProviderSignIn = async (provider: Provider) => {
        setLoading(true);
        const { error } = await supabase.auth.signInWithOAuth({
            provider,
            options: {
                redirectTo: `${process.env.NEXT_PUBLIC_ROOT_URL}/account`,
            },
        });
        if (error) setErrorMessage(error.message);
        setLoading(false);
    };

    return (
        <MainLayout
            title="NexLiber | Auth"
            description="Join NexLiber"
            url="/auth"
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
                <h1 className={styles.title}>
                    {isSignIn ? "Sign In" : "Sign Up"}
                </h1>
                <div className={styles.providerContainer}>
                    {providers.map((provider) => (
                        <button
                            onClick={() => handleProviderSignIn(provider)}
                            aria-label={`Sign in with ${provider}`}
                            className={styles.provider}
                            key={provider}
                        >
                            <Image
                                src={`/assets/providers/${provider}.svg`}
                                alt={`Sign in with ${provider}`}
                                aria-hidden="true"
                                width={30}
                                height={30}
                            />
                        </button>
                    ))}
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
                        ref={emailInput}
                        type="email"
                        placeholder="Email"
                        id="email"
                        className={styles.input}
                    />
                </div>
                <div className={styles.inputContainer}>
                    <label
                        htmlFor="password"
                        className={styles.text}
                        style={{ paddingLeft: "0.5rem", cursor: "text" }}
                    >
                        Password
                    </label>
                    <input
                        ref={passwordInput}
                        type="password"
                        placeholder="Password"
                        id="password"
                        className={styles.input}
                    />
                </div>

                {isSignIn ? (
                    <>
                        <button
                            onClick={() => handleEmailSignIn()}
                            className={styles.button}
                            aria-label="Sign in with email"
                            title="Sign in with email"
                        >
                            {loading ? "Loading..." : "Sign In"}
                        </button>
                        <sub className={styles.sub}>
                            Forgot your password?{" "}
                            <Link
                                href="/auth/reset-password"
                                className={styles.pageToggle}
                            >
                                Reset
                            </Link>{" "}
                            it!
                        </sub>
                        <sub
                            className={styles.sub}
                            style={{ marginTop: "0.5rem" }}
                        >
                            New to NexLiber?{" "}
                            <span
                                onClick={() => setIsSignIn(false)}
                                className={styles.pageToggle}
                            >
                                Sign up
                            </span>{" "}
                            instead!
                        </sub>
                    </>
                ) : (
                    <>
                        <div className={styles.inputContainer}>
                            <label
                                htmlFor="password2"
                                className={styles.text}
                                style={{
                                    paddingLeft: "0.5rem",
                                    cursor: "text",
                                }}
                            >
                                Confirm Password
                            </label>
                            <input
                                ref={password2Input}
                                type="password"
                                placeholder="Confirm Password"
                                id="password2"
                                className={styles.input}
                            />
                        </div>

                        <button
                            onClick={() => handleEmailSignUp()}
                            className={styles.button}
                            aria-label="Sign up with email"
                            title="Sign up with email"
                        >
                            {loading ? "Loading..." : "Sign Up"}
                        </button>
                        <sub className={styles.sub}>
                            Already have an account?{" "}
                            <span
                                onClick={() => setIsSignIn(true)}
                                className={styles.pageToggle}
                            >
                                Sign in
                            </span>{" "}
                            instead!
                        </sub>
                    </>
                )}
            </section>
        </MainLayout>
    );
};

export default Auth;
