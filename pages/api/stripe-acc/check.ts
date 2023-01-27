import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
    charges_enabled: boolean;
    details_submitted: boolean;
};

const handler = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
    const body = JSON.parse(req.body);
    const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

    const account = await stripe.accounts.retrieve(body.stripe_id);

    res.status(200).json({
        charges_enabled: account.charges_enabled,
        details_submitted: account.details_submitted,
    });
};

export default handler;
