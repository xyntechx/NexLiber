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

        const { data: userData } = await supabase
            .from("users")
            .select("bought_wb_ids")
            .eq("id", data.user_id);

        let newBoughtWbIDs: string[] = userData![0].bought_wb_ids;
        if (userData![0].bought_wb_ids) newBoughtWbIDs.push(data.id);
        else newBoughtWbIDs = [data.id];

        const { error: userError } = await supabase
            .from("users")
            .upsert({ id: data.user_id, bought_wb_ids: newBoughtWbIDs });

        const { data: workbookData } = await supabase
            .from("workbooks")
            .select("buyer_count")
            .eq("id", data.id);

        const { error: workbookError } = await supabase
            .from("workbooks")
            .upsert({
                id: data.id,
                buyer_count: workbookData![0].buyer_count + 1,
            });
    }

    res.status(200).end();
};

export default handler;
