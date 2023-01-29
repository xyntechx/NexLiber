const MONTHS = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
];

export const currentUTCDateTime = () => {
    const fullDate = new Date();

    const day = fullDate.getUTCDate().toString().padStart(2, "0");
    const month = MONTHS[fullDate.getUTCMonth()];
    const year = fullDate.getUTCFullYear();
    const hour = fullDate.getUTCHours().toString().padStart(2, "0");
    const minute = fullDate.getUTCMinutes().toString().padStart(2, "0");

    return `${month} ${day}, ${year} at ${hour}:${minute}`;
};

export const simplifyDate = (fullDateStr: string) => {
    // to remove the time
    return fullDateStr.slice(0, fullDateStr.indexOf("at")).trim();
};

export const convertTZ = (fullDateStr: string) => {
    const diffWithUTC = new Date().getTimezoneOffset() * -1; // e.g. for UTC+8, .getTimezoneOffset() returns -480

    const splitFullDate = fullDateStr.split(" "); // month | day, | year | "at" | hour:min
    const time = splitFullDate[4].split(":");

    const UTCMonth: number = MONTHS.indexOf(splitFullDate[0]); // 0: Jan, 1: Feb, ..., 11: Dec
    const UTCDay: number = Number(splitFullDate[1].slice(0, -1));
    const UTCYear: number = Number(splitFullDate[2]);
    const UTCHour: number = Number(time[0]);
    const UTCMinute: number = Number(time[1]);
    const UTCCombinedTime: number = UTCHour * 60 + UTCMinute; // (hours converted to mins) + mins

    // default value is 0
    // final___ are the values to be returned
    let finalDay: number = 0;
    let finalMonth: number = 0;
    let finalYear: number = 0;
    let finalHour: number = 0;
    let finalMinute: number = 0;

    const combinedTime: number = UTCCombinedTime + diffWithUTC;

    if (combinedTime < 0) {
        // the previous day
        const finalCombinedTime = 1440 + combinedTime; // time in mins in the prev day
        finalHour = Math.floor(finalCombinedTime / 60);
        finalMinute = finalCombinedTime % 60;

        finalDay = UTCDay - 1;

        if (finalDay === 0) {
            // the previous month
            finalMonth = UTCMonth - 1;

            if (finalMonth === -1) {
                // Dec the previous year
                finalDay = 31;
                finalMonth = 11;
                finalYear = UTCYear - 1;
            } else {
                finalYear = UTCYear;
                if ([0, 2, 4, 6, 7, 9, 11].includes(finalMonth)) finalDay = 31;
                else if ([3, 5, 8, 10].includes(finalMonth)) finalDay = 30;
                else if (finalMonth === 1) {
                    if (finalYear % 4) finalDay = 28; // not leap year
                    else finalDay = 29; // leap year
                }
            }
        } else {
            // the same month
            finalMonth = UTCMonth;
            finalYear = UTCYear;
        }
    } else if (combinedTime >= 1440) {
        // the next day
        const finalCombinedTime = combinedTime - 1440; // time in mins in the next day
        finalHour = Math.floor(finalCombinedTime / 60);
        finalMinute = finalCombinedTime % 60;

        finalDay = UTCDay + 1;

        if (UTCMonth === 11) {
            if (finalDay === 32) {
                // Jan the next year
                finalDay = 1;
                finalMonth = 0;
                finalYear = UTCYear + 1;
            } else {
                finalMonth = UTCMonth;
                finalYear = UTCYear;
            }
        } else {
            finalYear = UTCYear;
            if ([0, 2, 4, 6, 7, 9].includes(UTCMonth)) {
                if (finalDay === 32) {
                    // the next month
                    finalDay = 1;
                    finalMonth = UTCMonth + 1;
                } else {
                    finalMonth = UTCMonth;
                }
            } else if ([3, 5, 8, 10].includes(UTCMonth)) {
                if (finalDay === 31) {
                    // the next month
                    finalDay = 1;
                    finalMonth = UTCMonth + 1;
                } else {
                    finalMonth = UTCMonth;
                }
            } else if (UTCMonth === 1) {
                if (finalYear % 4) {
                    // not leap year
                    if (finalDay === 29) {
                        // on Mar
                        finalDay = 1;
                        finalMonth = 2;
                    } else {
                        finalMonth = UTCMonth;
                    }
                } else {
                    // leap year
                    if (finalDay === 30) {
                        // on Mar
                        finalDay = 1;
                        finalMonth = 2;
                    } else {
                        finalMonth = UTCMonth;
                    }
                }
            }
        }
    } else {
        // the same day
        finalHour = Math.floor(combinedTime / 60);
        finalMinute = combinedTime % 60;

        finalDay = UTCDay;
        finalMonth = UTCMonth;
        finalYear = UTCYear;
    }

    return `${MONTHS[finalMonth]} ${finalDay
        .toString()
        .padStart(2, "0")}, ${finalYear} at ${finalHour
        .toString()
        .padStart(2, "0")}:${finalMinute.toString().padStart(2, "0")}`;
};
