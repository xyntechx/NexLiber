import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
    stripe_acc_id: string;
    onboarding_url: string;
};

const handler = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
    const body = JSON.parse(req.body);
    const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

    let account;

    if (!body.stripe_id) {
        // if user does not have a stripe_acc_id stored in database
        account = await stripe.accounts.create({
            email: body.email,
            type: "express",
            capabilities: {
                card_payments: { requested: true },
                transfers: { requested: true },
            },
            business_type: "individual",
            business_profile: {
                mcc: "8299",
                product_description: "NexLiber Workbooks",
            },
        });
    }

    const accountLink = await stripe.accountLinks.create({
        account: body.stripe_id ? body.stripe_id : account.id,
        refresh_url: `${process.env.NEXT_PUBLIC_ROOT_URL}/creator`,
        return_url: `${process.env.NEXT_PUBLIC_ROOT_URL}/creator`,
        type: "account_onboarding",
    });

    res.status(200).json({
        stripe_acc_id: body.stripe_id ? body.stripe_id : account.id,
        onboarding_url: accountLink.url,
    });
};

export default handler;
