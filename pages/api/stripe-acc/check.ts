import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
    charges_enabled: boolean;
    details_submitted: boolean;
};

const handler = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
    const body = JSON.parse(req.body);
    const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

    let account;
    let is_charges_enabled = false;
    let is_details_submitted = false;

    if (body.stripe_id && body.stripe_id !== "NIL") {
        account = await stripe.accounts.retrieve(body.stripe_id);
        is_charges_enabled = account.charges_enabled;
        is_details_submitted = account.details_submitted;
    }

    if (body.stripe_id && body.stripe_id === "NIL") {
        is_charges_enabled = true;
        is_details_submitted = true;
    }

    res.status(200).json({
        charges_enabled: body.stripe_id ? is_charges_enabled : false,
        details_submitted: body.stripe_id ? is_details_submitted : false,
    });
};

export default handler;
