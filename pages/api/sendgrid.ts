import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
    success: boolean;
};

const handler = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
    const body = JSON.parse(req.body);
    const sgMail = require("@sendgrid/mail");
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    const message = {
        to: body.email,
        bcc: body.bcc ? body.bcc : "",
        from: {
            email: "teamxynlab@gmail.com",
            name: "NexLiber",
        },
        subject: body.subject,
        text: body.text,
        html: body.html,
    };

    const response = await sgMail.send(message);

    res.status(200).json({
        success:
            Number(response[0].statusCode.toString()[0]) === 2 ? true : false,
    });
};

export default handler;
