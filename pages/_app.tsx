import "../styles/globals.css";
import type { AppProps } from "next/app";
import { Analytics } from "@vercel/analytics/react";
import { supabase } from "../utils/supabase";
import { SessionContextProvider } from "@supabase/auth-helpers-react";

const MyApp = ({ Component, pageProps }: AppProps) => {
    return (
        <SessionContextProvider
            supabaseClient={supabase}
            initialSession={pageProps.initialSession}
        >
            <Component {...pageProps} />
            <Analytics />
        </SessionContextProvider>
    );
};

export default MyApp;
