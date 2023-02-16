import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
    charges_enabled: boolean;
    details_submitted: boolean;
};

const handler = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
    const body = JSON.parse(req.body);
    const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

    let account;

    if (body.stripe_id)
        account = await stripe.accounts.retrieve(body.stripe_id);

    res.status(200).json({
        charges_enabled: body.stripe_id ? account.charges_enabled : false,
        details_submitted: body.stripe_id ? account.details_submitted : false,
    });
};

export default handler;
