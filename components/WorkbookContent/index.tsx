import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import oneDark from "react-syntax-highlighter/dist/cjs/styles/prism/one-dark";
import styles from "./Workbook.module.css";

interface Props {
    content: string;
}

const WorkbookContent = ({ content }: Props) => {
    return (
        <div className={styles.content} style={{ border: "none" }}>
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                    code({
                        node,
                        inline,
                        className,
                        children,
                        style,
                        ...props
                    }) {
                        const match = /language-(\w+)/.exec(className || "");
                        return !inline && match ? (
                            <SyntaxHighlighter
                                style={oneDark}
                                language={match[1]}
                                PreTag="div"
                                {...props}
                            >
                                {String(children).replace(/\n$/, "")}
                            </SyntaxHighlighter>
                        ) : (
                            <code className={className} {...props}>
                                {children}
                            </code>
                        );
                    },
                }}
            >
                {content}
            </ReactMarkdown>
        </div>
    );
};

export default WorkbookContent;
