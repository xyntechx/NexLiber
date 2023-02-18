import { useState } from "react";
import styles from "./MD.module.css";

interface Props {
    md: string;
    children: React.ReactNode | React.ReactNode[];
}

const MDElem = ({ md, children }: Props) => {
    const [show, setShow] = useState(false);

    return (
        <>
            <div className={styles.show} onClick={() => setShow(!show)}>
                {show ? "-" : "+"} {children}
            </div>
            <p
                style={{
                    display: show ? "block" : "none",
                }}
                className={styles.md}
            >
                {md}
            </p>
        </>
    );
};

export default MDElem;
