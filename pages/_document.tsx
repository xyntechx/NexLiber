import { Html, Head, Main, NextScript } from "next/document";

const MyDocument = () => {
    const setInitialTheme = `
        const getSavedTheme = () => {
            if (window.localStorage.getItem("theme")) {
                return window.localStorage.getItem("theme");
            }
            return window.matchMedia("(prefers-color-scheme: dark)").matches
                ? "dark"
                : "light";
        };
        document.body.dataset.theme = getSavedTheme();    
    `;

    return (
        <Html>
            <Head lang="en">
                <meta charSet="UTF-8" />
                <link
                    rel="apple-touch-icon"
                    sizes="180x180"
                    href="/favicons/apple-touch-icon.png?v=3"
                />
                <link
                    rel="icon"
                    type="image/png"
                    sizes="32x32"
                    href="/favicons/favicon-32x32.png?v=3"
                />
                <link
                    rel="icon"
                    type="image/png"
                    sizes="16x16"
                    href="/favicons/favicon-16x16.png?v=3"
                />
                <link rel="manifest" href="/favicons/site.webmanifest?v=3" />
                <link
                    rel="mask-icon"
                    href="/favicons/safari-pinned-tab.svg?v=3"
                    color="#ff6633"
                />
                <link rel="shortcut icon" href="/favicons/favicon.ico?v=3" />
                <meta name="apple-mobile-web-app-title" content="NexLiber" />
                <meta name="application-name" content="NexLiber" />
                <meta name="msapplication-TileColor" content="#da532c" />
                <meta
                    name="msapplication-config"
                    content="/favicons/browserconfig.xml?v=3"
                />
                <meta name="theme-color" content="#ff6633" />
            </Head>
            <body>
                <script dangerouslySetInnerHTML={{ __html: setInitialTheme }} />
                <Main />
                <NextScript />
            </body>
        </Html>
    );
};

export default MyDocument;
