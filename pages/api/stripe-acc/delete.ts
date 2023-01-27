import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
    deleted: boolean;
};

const handler = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
    const body = JSON.parse(req.body);
    const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

    if (body.stripe_id) {
        // If user has a Stripe Account
        const deleted = await stripe.accounts.del(body.stripe_id);
        res.status(200).json({
            deleted: deleted.deleted,
        });
    } else {
        res.status(200).json({
            deleted: true,
        });
    }
};

export default handler;
