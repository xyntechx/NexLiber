import styles from "./Alert.module.css";

interface Props {
    successMessage: string;
    setSuccessMessage: (successMessage: string) => void;
    errorMessage: string;
    setErrorMessage: (errorMessage: string) => void;
}

const Alert = ({
    successMessage,
    setSuccessMessage,
    errorMessage,
    setErrorMessage,
}: Props) => {
    return (
        <header
            aria-hidden={successMessage || errorMessage ? "false" : "true"}
            className={styles.message}
            style={{
                display: successMessage || errorMessage ? "flex" : "none",
                backgroundColor:
                    (successMessage && "#22c55e") ||
                    (errorMessage && "#ef4444"),
            }}
        >
            {(successMessage && successMessage) ||
                (errorMessage && errorMessage)}{" "}
            <button
                aria-hidden={successMessage || errorMessage ? "false" : "true"}
                aria-label={successMessage || errorMessage ? "Close alert" : ""}
                onClick={() => {
                    setSuccessMessage("");
                    setErrorMessage("");
                }}
                className={styles.close}
            >
                X
            </button>
        </header>
    );
};

export default Alert;
