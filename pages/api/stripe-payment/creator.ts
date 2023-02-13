import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
    url: string;
};

const handler = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
    const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
    const body = JSON.parse(req.body);

    const session = await stripe.checkout.sessions.create({
        mode: "payment",
        line_items: [
            {
                price: process.env.STRIPE_CREATE_PREMIUM_WB_PRICE_ID,
                quantity: 1,
            },
        ],
        success_url: `${process.env.NEXT_PUBLIC_ROOT_URL}/creator/editor/${body.slug}`,
        cancel_url: `${process.env.NEXT_PUBLIC_ROOT_URL}/creator/error`,
        payment_intent_data: { metadata: body },
    });

    res.status(200).json({
        url: session.url,
    });
};

export default handler;
