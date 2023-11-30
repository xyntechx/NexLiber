import MainLayout from "../layouts/MainLayout";
import Link from "next/link";
import Image from "next/image";
import styles from "../styles/Docs.module.css";

const Docs = () => {
    const setURL = (elem: EventTarget) => {
        window.location.href = `#${(elem as HTMLHeadingElement).id}`;
    };

    return (
        <MainLayout
            title="NexLiber | Docs"
            description="Learn about NexLiber"
            url="/docs"
        >
            <section className={styles.container}>
                <blockquote>
                    Click the{" "}
                    <span
                        style={{
                            color: "var(--color-theme)",
                            fontWeight: "800",
                        }}
                    >
                        orange
                    </span>{" "}
                    headings to anchor them.
                </blockquote>
                <h1
                    id="getting-started"
                    onClick={(e) => setURL(e.target)}
                    style={{ cursor: "pointer" }}
                >
                    Getting Started
                </h1>
                <p>Hi there! Welcome to NexLiber!</p>
                <p>
                    We want you to know that you&apos;re playing an important
                    role in extinguishing tutorial hell and levelling up the
                    skills of the global coding community (including yourself).
                    These docs will guide you through all you need to know as a
                    NexLiber user.
                </p>

                <h2
                    id="our-lingo"
                    onClick={(e) => setURL(e.target)}
                    style={{ cursor: "pointer" }}
                >
                    Our Lingo
                </h2>
                <p>
                    <b>Workbook</b>: A comprehensive community-created project
                    documentation explaining the &quot;why&quot; behind code.
                    Workbooks can be in any coding field from Artificial
                    Intelligence to Web Development.
                </p>
                <p>
                    <b>Library</b>: Where published Workbooks are found.
                </p>
                <p>
                    <b>Project</b>: What a Workbook is the documentation of. All
                    Projects whose Workbooks are in the Library are found in{" "}
                    <Link
                        href="https://github.com/teamxynlab/NexLiber-Projects"
                        className={styles.link}
                        target="_blank"
                    >
                        NexLiber-Projects
                    </Link>
                    .
                </p>
                <p>
                    <b>Creator</b>: A coder who writes Workbooks. They can be of
                    any skill level as long as they can thoroughly explain the
                    thought process behind their Projects&apos; code.
                </p>
                <p>
                    <b>Learner</b>: A coder who reads Workbooks. They can be of
                    any skill level as long as they are willing to learn and
                    understand code.
                </p>
                <p>
                    <b>Admin</b>: A member of NexLiber&apos;s team who reviews
                    Workbooks. They ensure that Workbooks published in the
                    Library are clear, thorough, and accurate.
                </p>

                <h2
                    id="joining-us"
                    onClick={(e) => setURL(e.target)}
                    style={{ cursor: "pointer" }}
                >
                    Joining Us
                </h2>
                <p>
                    Becoming a Creator and Learner is easy: just create an
                    account and go from there (these docs will help you out)! To
                    become an Admin, indicate your interest via{" "}
                    <Link
                        href="mailto:teamxynlab@gmail.com"
                        className={styles.link}
                    >
                        email
                    </Link>
                    . Also, everyone should join NexLiber&apos;s{" "}
                    <Link
                        href="/community"
                        target="_blank"
                        className={styles.link}
                    >
                        Discord
                    </Link>{" "}
                    server to connect with, learn from, and inspire your fellow
                    coders!
                </p>

                <h1
                    id="the-flow"
                    onClick={(e) => setURL(e.target)}
                    style={{ cursor: "pointer" }}
                >
                    The Flow
                </h1>
                <p>NexLiber has a pretty simple flow:</p>
                <Image
                    src="/assets/nexliber-flow.svg"
                    width={480}
                    height={312}
                    alt="NexLiber Flow"
                    className={styles.img}
                />
                <p>
                    A Creator would first draft a Workbook via the{" "}
                    <Link href="/creator" className={styles.link}>
                        Creator Dashboard
                    </Link>
                    , submitting its Project to{" "}
                    <Link
                        href="https://github.com/teamxynlab/NexLiber-Projects"
                        className={styles.link}
                        target="_blank"
                    >
                        NexLiber-Projects
                    </Link>
                    . Once the draft is done, the Creator will submit it and an
                    Admin will review the Workbook. The draft-review cycle
                    repeats until the Workbook is suitable for publication. Once
                    that Workbook status is achieved, the Admin will publish the
                    Workbook such that it can be read by Learners in the
                    Library. Learners can also view and study the Project in{" "}
                    <Link
                        href="https://github.com/teamxynlab/NexLiber-Projects"
                        className={styles.link}
                        target="_blank"
                    >
                        NexLiber-Projects
                    </Link>
                    .
                </p>
                <h2
                    id="drafting-a-workbook"
                    onClick={(e) => setURL(e.target)}
                    style={{ cursor: "pointer" }}
                >
                    Drafting a Workbook
                </h2>
                <p>
                    To create a Workbook, you must first{" "}
                    <Link href="/auth" className={styles.link}>
                        sign into
                    </Link>{" "}
                    your NexLiber account. Once you&apos;re signed in, go to
                    your{" "}
                    <Link href="/creator" className={styles.link}>
                        Creator Dashboard
                    </Link>
                    .
                </p>
                <h3
                    id="linking-your-stripe-account"
                    onClick={(e) => setURL(e.target)}
                    style={{ cursor: "pointer" }}
                >
                    Linking Your Stripe Account
                </h3>
                <p>
                    If you see a <b>Link Stripe Account</b> button in your
                    Creator Dashboard, that means you have not created a
                    connected Stripe account for NexLiber. You must do so to
                    start creating Workbooks and potentially gain revenue from
                    your{" "}
                    <Link href="/docs#workbook-details" className={styles.link}>
                        Premium Workbooks
                    </Link>
                    . So, click <b>Link Stripe Account</b> and follow the Stripe
                    onboarding process. Once you have successfully created and
                    linked your Stripe account, a <b>Create Workbook</b> button
                    will appear.
                </p>
                <h3
                    id="workbook-details"
                    onClick={(e) => setURL(e.target)}
                    style={{ cursor: "pointer" }}
                >
                    Workbook Details
                </h3>
                <p>
                    Clicking <b>Create Workbook</b> fires up a popup for you to
                    enter your Workbook details: title, description, field,
                    type.
                </p>
                <p>
                    <b>Title</b>: Your Project&apos;s name (e.g. Dragon Ball
                    Classifier, Personal Portfolio Website, roygbiv). Make sure
                    you&apos;re happy with the title because you won&apos;t be
                    able to edit it once your Workbook is successfully created.
                </p>
                <p>
                    <b>Description</b>: A one-sentence summary of your Project.
                    Make it concise and snappy!
                </p>
                <p>
                    <b>Field</b>: Your Project&apos;s field (e.g. Artificial
                    Intelligence, Web Development). If none of the options shown
                    are applicable, select <b>Others</b> and enter your custom
                    field.
                </p>
                <p>
                    <b>Type</b>: Either <b>Free</b> or <b>Premium</b>. A Free
                    Workbook is free to make and free to read; you spend nothing
                    to create it and Learners pay you nothing to read it. A
                    Premium Workbook costs S$5 (5 Singapore Dollars) to create
                    and S$1 to read; you spend S$5 to create it and each Learner
                    pays you a one-time fee of S$1 to read it. When creating a
                    Premium Workbook, you will pay the S$5 upon clicking{" "}
                    <b>Create</b>, and you will not receive a refund should you
                    delete the Premium Workbook. The Workbook type cannot be
                    changed once your Workbook is successfully created.
                </p>
                <p>
                    <b>Promo Code</b>: Joining NexLiber&apos;s{" "}
                    <Link
                        href="/community"
                        target="_blank"
                        className={styles.link}
                    >
                        Discord
                    </Link>{" "}
                    grants you a Promo Code for creating Premium Workbooks.
                    Instead of paying S$5, you will pay only S$3 to create
                    Premium Workbooks should you enter the correct Promo Code.
                </p>
                <h3
                    id="workbook-content"
                    onClick={(e) => setURL(e.target)}
                    style={{ cursor: "pointer" }}
                >
                    Workbook Content
                </h3>
                <p>
                    Upon clicking <b>Create</b> (and completing the Stripe
                    payment process should you create a Premium Workbook), you
                    will be redirected to the Editor for the new Workbook. In
                    the editor, you can edit the Workbook&apos;s description,
                    field, and content. Your Workbook content should be written
                    in{" "}
                    <Link
                        href="/docs#markdown-cheatsheet"
                        className={styles.link}
                    >
                        Markdown
                    </Link>
                    .
                </p>
                <p>
                    You can toggle between previewing or editing your draft by
                    clicking <b>Preview</b> (when you are currently editing) or{" "}
                    <b>Edit</b> (when you are currently previewing). Once you
                    have made changes, the <b>Save</b> button is activated.
                    Click <b>Save</b> to save, not yet submit, your progress.
                    The <b>Submit</b> button needs more work to be activated, so
                    read on!
                </p>
                <h3
                    id="project-submission"
                    onClick={(e) => setURL(e.target)}
                    style={{ cursor: "pointer" }}
                >
                    Project Submission
                </h3>
                <p>
                    Before you can submit your Workbook draft, you must first
                    add your Project to the{" "}
                    <Link
                        href="https://github.com/teamxynlab/NexLiber-Projects"
                        className={styles.link}
                        target="_blank"
                    >
                        NexLiber-Projects
                    </Link>{" "}
                    GitHub repo. Follow the instructions in the{" "}
                    <Link
                        href="https://github.com/teamxynlab/NexLiber-Projects/blob/main/CREATOR.md"
                        target="_blank"
                        className={styles.link}
                    >
                        Creator Guide
                    </Link>{" "}
                    for more information.
                </p>
                <p>
                    Once that&apos;s done, click <b>Done</b> under the
                    &quot;Please add your Project to NexLiber-Projects&quot;
                    prompt in your Creator Dashboard. The <b>Submit</b> button
                    in the Editor will now be activated.
                </p>
                <h2
                    id="getting-your-workbook-reviewed"
                    onClick={(e) => setURL(e.target)}
                    style={{ cursor: "pointer" }}
                >
                    Getting Your Workbook Reviewed
                </h2>
                <p>
                    Clicking <b>Submit</b> submits your Workbook draft to an
                    Admin. You will receive an email notification should your
                    Workbook draft be successfully submitted.
                </p>
                <p>
                    The Admin will review the submitted draft and leave some
                    feedback if necessary. You will receive an email
                    notification once the feedback is submitted. Access the
                    feedback(s) via your Creator Dashboard.
                </p>
                <p>
                    Should you be prompted to make changes, access the
                    Workbook&apos;s Editor, edit your draft, and submit it
                    again. This submission-feedback cycle continues until your
                    Workbook is ready to be published.
                </p>
                <h2
                    id="publishing-a-workbook"
                    onClick={(e) => setURL(e.target)}
                    style={{ cursor: "pointer" }}
                >
                    Publishing a Workbook
                </h2>
                <p>
                    Once your Workbook is ready to be published, the Admin will
                    publish it for you. This happens when all feedback is deemed
                    resolved by the Admin. You will receive an email
                    notification should your Workbook be successfully published.
                </p>
                <h2
                    id="reading-a-workbook"
                    onClick={(e) => setURL(e.target)}
                    style={{ cursor: "pointer" }}
                >
                    Reading a Workbook
                </h2>
                <p>
                    You can read every published Workbook in the{" "}
                    <Link href="/library" className={styles.link}>
                        Library
                    </Link>
                    . Workbooks labelled <b>Premium</b> each requires you to pay
                    S$1 to read. Workbooks labelled <b>Purchased</b> are either
                    already-bought Premium Workbooks or your own Premium
                    Workbooks. Unlabelled Workbooks are Free Workbooks.
                </p>
                <p>
                    Remember: the main aim of reading Workbooks is to thoroughly
                    understand the thought process which goes behind the code so
                    that you too can create your own original projects without
                    much copy-pasting. Always keep that in mind. Escape tutorial
                    hell!
                </p>
                <h2
                    id="viewing-a-project"
                    onClick={(e) => setURL(e.target)}
                    style={{ cursor: "pointer" }}
                >
                    Viewing a Project
                </h2>
                <p>
                    Go to{" "}
                    <Link
                        href="https://github.com/teamxynlab/NexLiber-Projects"
                        className={styles.link}
                        target="_blank"
                    >
                        NexLiber-Projects
                    </Link>{" "}
                    and find the folder with the same title/name as the
                    Workbook. The purpose of viewing a Project is to get a sense
                    of how the code is structured and see the thought process
                    materialised.
                </p>

                <h1
                    id="about-workbooks"
                    onClick={(e) => setURL(e.target)}
                    style={{ cursor: "pointer" }}
                >
                    About Workbooks
                </h1>
                <p>
                    Here are some good-to-know information regarding Workbooks.
                </p>
                <h2
                    id="workbook-status"
                    onClick={(e) => setURL(e.target)}
                    style={{ cursor: "pointer" }}
                >
                    Workbook Status
                </h2>
                <p>
                    <b style={{ color: "#0ea5e9" }}>In Progress</b>: Workbook
                    draft has been created/edited but not submitted.
                </p>
                <p>
                    <b style={{ color: "#f59e0b" }}>Under Review</b>: Workbook
                    draft has been successfully submitted and is being reviewed
                    by an Admin.
                </p>
                <p>
                    <b style={{ color: "#ef4444" }}>Changes Required</b>:
                    Workbook draft must be resubmitted with the changes as
                    requested in the feedback(s).
                </p>
                <p>
                    <b style={{ color: "#22c55e" }}>Published</b>: Workbook has
                    been successfully published and can be found in the{" "}
                    <Link href="/library" className={styles.link}>
                        Library
                    </Link>
                    .
                </p>
                <h2
                    id="markdown-cheatsheet"
                    onClick={(e) => setURL(e.target)}
                    style={{ cursor: "pointer" }}
                >
                    Markdown Cheatsheet
                </h2>
                <p>
                    Find it{" "}
                    <Link
                        href="/markdown-cheatsheet"
                        target="_blank"
                        className={styles.link}
                    >
                        here
                    </Link>
                    .
                </p>

                <h1
                    id="submitting-feedback"
                    onClick={(e) => setURL(e.target)}
                    style={{ cursor: "pointer" }}
                >
                    Submitting Feedback
                </h1>
                <p>
                    Should you find bugs, have improvement suggestions, or want
                    to give us any other feedback, please don&apos;t hesitate to{" "}
                    <Link
                        href="mailto:teamxynlab@gmail.com"
                        className={styles.link}
                    >
                        email
                    </Link>{" "}
                    us or message us via{" "}
                    <Link
                        href="/community"
                        target="_blank"
                        className={styles.link}
                    >
                        Discord
                    </Link>
                    .
                </p>

                <h1
                    id="important-notes"
                    onClick={(e) => setURL(e.target)}
                    style={{ cursor: "pointer" }}
                >
                    Important Notes
                </h1>
                <h2
                    id="privacy"
                    onClick={(e) => setURL(e.target)}
                    style={{ cursor: "pointer" }}
                >
                    Privacy
                </h2>
                <p>
                    All information and data collected by NexLiber (e.g. your
                    name, email, etc.) will only be used on and for
                    nexliberv2.vercel.app.
                </p>
                <h2
                    id="stripe-requirements"
                    onClick={(e) => setURL(e.target)}
                    style={{ cursor: "pointer" }}
                >
                    Stripe Requirements
                </h2>
                <p>
                    Due to{" "}
                    <Link
                        href="https://stripe.com/"
                        target="_blank"
                        className={styles.link}
                    >
                        Stripe&apos;s
                    </Link>{" "}
                    different policies in different countries, there are some
                    countries which are not supported by Stripe for the Stripe
                    features NexLiber needs. Furthermore, Stripe requires that
                    users be at least 18 years old to create the type of Stripe
                    account NexLiber needs.
                </p>
                <p>
                    In your{" "}
                    <Link href="/account" className={styles.link}>
                        My Account
                    </Link>{" "}
                    page, select <b>My country is not in the list</b> should
                    your country not be seen in the dropdown for <b>Country</b>{" "}
                    or if you are currently below 18. Don&apos;t worry, your
                    experience with NexLiber will be the same as others whose
                    countries are supported, only with a few differences:
                </p>
                <ul>
                    <li>
                        You are not required to link your Stripe account; the{" "}
                        <b>Link Stripe Account</b> button in your Creator
                        Dashboard will not appear and instead,{" "}
                        <b>Create Workbook</b> will immediately show.
                    </li>
                    <li>
                        You will not be able to create Premium Workbooks (but
                        you can still create and read Free Workbooks, and
                        purchase other&apos;s Premium Workbooks).
                    </li>
                </ul>
                <h2
                    id="updating-your-country"
                    onClick={(e) => setURL(e.target)}
                    style={{ cursor: "pointer" }}
                >
                    Updating Your Country
                </h2>
                <p>
                    Should you move to a different country or should you now
                    fulfil Stripe&apos;s age requirement, please contact
                    NexLiber via{" "}
                    <Link
                        href="mailto:teamxynlab@gmail.com"
                        className={styles.link}
                    >
                        email
                    </Link>
                    . We will handle the update and inform you of the simple
                    steps you need to take to successfully update your account.
                </p>
                <h2
                    id="deleting-your-account"
                    onClick={(e) => setURL(e.target)}
                    style={{ cursor: "pointer" }}
                >
                    Deleting Your Account
                </h2>
                <p>
                    Should you delete your NexLiber account, any payments made
                    by Learners for your Premium Workbook(s) starting from the
                    time your account is successfully deleted will be received
                    by NexLiber. Also, your Workbook(s) will display{" "}
                    <b>Anonymous Creator</b> instead of your full name.
                </p>
            </section>
        </MainLayout>
    );
};

export default Docs;
