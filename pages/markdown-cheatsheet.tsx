import MainLayout from "../layouts/MainLayout";
import MDElem from "../components/MDElem";
import Link from "next/link";
import Image from "next/image";
import styles from "../styles/Docs.module.css";

const Docs = () => {
    return (
        <MainLayout
            title="NexLiber | MD Cheatsheet"
            description="NexLiber Markdown Cheatsheet"
            url="/markdown-cheatsheet"
        >
            <section className={styles.container}>
                <MDElem md={"# Main Heading"}>
                    <h1>Main Heading</h1>
                </MDElem>
                <MDElem md={"## Sub Heading"}>
                    <h2>Sub Heading</h2>
                </MDElem>
                <MDElem md={"### Sub Sub Heading"}>
                    <h3>Sub Sub Heading</h3>
                </MDElem>
                <MDElem md={"Normal Text"}>
                    <p>Normal Text</p>
                </MDElem>
                <MDElem md={"**Bold Text**"}>
                    <b>Bold Text</b>
                </MDElem>
                <MDElem md={"*Italicised Text*"}>
                    <i>Italicised Text</i>
                </MDElem>
                <MDElem md="~~Strikethrough~~">
                    <s>Strikethrough</s>
                </MDElem>
                <MDElem md={"> Blockquote"}>
                    <blockquote>Blockquote</blockquote>
                </MDElem>
                <MDElem md={`1. Item 1\n2. Item 2\n3. Item 3`}>
                    <ol>
                        <li>Item 1</li>
                        <li>Item 2</li>
                        <li>Item 3</li>
                    </ol>
                </MDElem>
                <MDElem md={`- Item 1\n- Item 2\n- Item 3`}>
                    <ul>
                        <li>Item 1</li>
                        <li>Item 2</li>
                        <li>Item 3</li>
                    </ul>
                </MDElem>
                <MDElem md={"---"}>
                    <hr />
                </MDElem>
                <MDElem md={"[Link](https://nexliber.vercel.app)"}>
                    <Link href="https://nexliber.vercel.app" className={styles.link}>
                        Link
                    </Link>
                </MDElem>
                <MDElem md={"![Image Alt](/path/to/image.png)"}>
                    <Image
                        src="/assets/nexliber-flow.svg"
                        width={480}
                        height={312}
                        alt="NexLiber Flow"
                        className={styles.img}
                    />
                </MDElem>
                <MDElem
                    md={`| Title 1 | Title 2 |
| ----------- | ----------- |
| Content 1a | Content 2a |
| Content 1b | Content 2b |`}
                >
                    <table>
                        <tbody>
                            <tr>
                                <th>Title 1</th>
                                <th>Title 2</th>
                            </tr>
                            <tr>
                                <td>Content 1a</td>
                                <td>Content 2a</td>
                            </tr>
                            <tr>
                                <td>Content 1b</td>
                                <td>Content 2b</td>
                            </tr>
                        </tbody>
                    </table>
                </MDElem>
                <MDElem md={"`code`"}>
                    <code>code</code>
                </MDElem>
                <MDElem
                    md={`\`\`\`py
def add(x, y):
    return x + y
\`\`\``}
                >
                    <Image
                        src="/assets/codeblock.png"
                        width={1612}
                        height={155}
                        alt="Sample Codeblock"
                        className={styles.img}
                        style={{ border: "none" }}
                    />
                </MDElem>
            </section>
        </MainLayout>
    );
};

export default Docs;
