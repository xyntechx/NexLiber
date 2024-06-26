import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
    url: string;
};

const handler = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
    const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
    const body = JSON.parse(req.body);

    let session;

    if (body.creator_stripe_acc_id) {
        session = await stripe.checkout.sessions.create({
            mode: "payment",
            line_items: [
                {
                    price: process.env.STRIPE_BUY_PREMIUM_WB_PRICE_ID,
                    quantity: 1,
                },
            ],
            success_url: `${process.env.NEXT_PUBLIC_ROOT_URL}/workbook/${body.slug}`,
            cancel_url: `${process.env.NEXT_PUBLIC_ROOT_URL}/library/error`,
            payment_intent_data: {
                metadata: body,
                transfer_data: { destination: body.creator_stripe_acc_id },
                on_behalf_of: body.creator_stripe_acc_id,
            },
        });
    } else {
        session = await stripe.checkout.sessions.create({
            mode: "payment",
            line_items: [
                {
                    price: process.env.STRIPE_BUY_PREMIUM_WB_PRICE_ID,
                    quantity: 1,
                },
            ],
            success_url: `${process.env.NEXT_PUBLIC_ROOT_URL}/workbook/${body.slug}`,
            cancel_url: `${process.env.NEXT_PUBLIC_ROOT_URL}/library/error`,
            payment_intent_data: {
                metadata: body,
            },
        });
    }

    res.status(200).json({
        url: session.url,
    });
};

export default handler;
