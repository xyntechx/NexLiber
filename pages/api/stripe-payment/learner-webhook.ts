import type { NextApiRequest, NextApiResponse } from "next";
import { buffer } from "micro";
import { createClient } from "@supabase/supabase-js";

export const config = { api: { bodyParser: false } };

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

    const endpointSecret = process.env.STRIPE_LEARNER_WEBHOOK_SECRET;
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

        let newBoughtWbIDs: string[] = data.bought_wb_ids;
        if (data.bought_wb_ids) newBoughtWbIDs.push(data.id);
        else newBoughtWbIDs = [data.id];

        const { error } = await supabase
            .from("users")
            .upsert({ id: data.user_id, bought_wb_ids: newBoughtWbIDs });
    }

    res.status(200).end();
};

export default handler;
