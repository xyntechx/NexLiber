import Link from "next/link";
import styles from "./Card.module.css";
import { convertTZ, simplifyDate } from "../../../utils/datetime";

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
    workbook: WorkbookProps;
    boughtWbIDs: string[] | null | undefined;
    user: any;
}

const Card = ({ workbook, boughtWbIDs, user }: Props) => {
    return (
        <Link
            href={`/workbook/${workbook.slug}`}
            key={workbook.id}
            className={styles.workbookCard}
        >
            <h1 className={styles.workbookTitle}>
                {workbook.title}{" "}
                {workbook.type === "Premium" &&
                    (boughtWbIDs?.includes(workbook.id) ||
                        workbook.creator_id === user.id) && (
                        <span className={styles.purchasedTag}>Purchased</span>
                    )}
                {workbook.type === "Premium" &&
                    !boughtWbIDs?.includes(workbook.id) &&
                    workbook.creator_id !== user.id && (
                        <span className={styles.premiumTag}>Premium</span>
                    )}
            </h1>
            <p className={styles.workbookDescription}>{workbook.description}</p>
            <p className={styles.workbookField}>{workbook.field}</p>
            <p className={styles.workbookCreator}>{workbook.creator_name}</p>
            <p className={styles.date}>
                {simplifyDate(convertTZ(workbook.publication_date))}
            </p>
        </Link>
    );
};

export default Card;
