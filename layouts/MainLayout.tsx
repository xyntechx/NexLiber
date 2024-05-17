import Head from "next/head";
import Topnav from "../components/Topnav";
import Footer from "../components/Footer";

interface WorkbookLayoutProps {
    title: string;
    description: string;
    url: string;
    children: React.ReactNode | React.ReactNode[];
}

const MainLayout = ({
    title,
    description,
    url,
    children,
}: WorkbookLayoutProps) => {
    return (
        <div>
            <Head>
                <title>{title}</title>
                <meta name="viewport" content="width=device-width" />
                <meta name="description" content={description} />
                <meta name="author" content="Nyx Iskandar" />
                <meta property="og:title" content={title} />
                <meta property="og:description" content={description} />
                <meta
                    property="og:image"
                    content="https://nexliber.vercel.app/favicons/og-image.png"
                />
                <meta
                    property="og:url"
                    content={`https://nexliber.vercel.app${url}`}
                />
                <meta property="og:type" content="website" />
            </Head>

            <main
                style={{
                    minHeight: "100vh",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <Topnav />
                <>{children}</>
                <Footer />
            </main>
        </div>
    );
};

export default MainLayout;
