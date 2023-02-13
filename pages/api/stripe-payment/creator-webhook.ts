import type { NextApiRequest, NextApiResponse } from "next";
import { buffer } from "micro";
import { createClient } from "@supabase/supabase-js";
import { getStoryblokApi } from "@storyblok/react";

export const config = { api: { bodyParser: false } };

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

    const endpointSecret = process.env.STRIPE_CREATOR_WEBHOOK_SECRET;
    const sig = req.headers["stripe-signature"];
    const reqBuffer = await buffer(req);

    let event;

    try {
        event = stripe.webhooks.constructEvent(reqBuffer, sig, endpointSecret);
    } catch (err) {
        res.status(400).end();
        return;
    }

    if (event.type === "payment_intent.succeeded") {
        const data = event.data.object.metadata;
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_PROJECT_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        await fetch("https://mapi.storyblok.com/v1/spaces/192717/stories", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: process.env.NEXT_PUBLIC_STORYBLOK_PAT!,
            },
            body: JSON.stringify({
                story: {
                    name: data.title,
                    slug: data.slug,
                    content: {
                        component: "content",
                        title: data.title,
                        markdown: "",
                    },
                },
                publish: 1,
            }),
        }).then((response) => {
            if (!response.ok) return;
        });

        const storyblokApi = getStoryblokApi();
        const { data: storyblokData } = await storyblokApi.get(
            `cdn/stories/${data.slug}`,
            {}
        );

        const { error } = await supabase.from("workbooks").insert({
            ...data,
            storyblok_id: storyblokData.story.uuid,
            storyblok_num_id: storyblokData.story.id,
        });
    }

    res.status(200).end();
};

export default handler;
