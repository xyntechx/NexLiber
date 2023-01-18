import { useState, useEffect } from "react";
import Image from "next/image";

const CreateButton = () => {
    const [theme, setTheme] = useState(document.body.dataset.theme!);

    useEffect(() => {
        window.addEventListener("themeUpdate", () => {
            setTheme(localStorage.getItem("theme")!);
        });
    });

    return (
        <Image
            src={`/assets/${theme}/create.svg`}
            alt="Create Workbook"
            aria-hidden="true"
            width={20}
            height={20}
        />
    );
};

export default CreateButton;
