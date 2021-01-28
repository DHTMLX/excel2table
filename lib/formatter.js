const formatProp = (v, prettify) => prettify && v < 10 ? "0" + v : v;

const getDateProps = d => ({
	y: d.getFullYear(),
	m: d.getMonth() + 1,
	d: d.getDate(),
	h: d.getHours(),
	min: d.getMinutes(),
    s: d.getSeconds(),
    w: d.getDay()
});

const month = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October", 
    "November", 
    "December"
];

const weekdays =  ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Monday"];

const specialDateSymbols = {
    y: true,
    m: true,
    d: true,
    h: true,
    s: true
};

function isDateFormat(format) {
    if (!format) {
        return false;
    }
    let count = 0;
    let waitCloseBracket = false;
    for (let i=0; i<format.length; i++) {
        if (waitCloseBracket) {
            waitCloseBracket = format[i] !== "]";
            continue;
        }
        if (format[i] === "[") {
            waitCloseBracket = true;
        }
        if (specialDateSymbols[format[i]]) {
            count += 1;
            if (count > 1) {
                return true;
            }
        }
    }
    return false;
}

const baseDate = new Date(1899, 11, 30, 0, 0, 0);
const baseOffset = baseDate.getTimezoneOffset();
const baseTimestamp = baseDate.getTime();

function offsetToDate(offset) {
	return new Date(baseTimestamp + (offset * 24 * 60 + baseOffset) * 60 * 1000);
}


function tryFormatAsDate(value, format) {
    if (!isDateFormat(format)) {
        return value;
    }

    const date = offsetToDate(value);
    const {m, d, y, h, min, s, w} = getDateProps(date);
    let afterH = false;
    let waitCloseBracket = false;
    let result = "";

    const ampm = format.indexOf("AM/PM");
    if (ampm !== -1) {
        format = format.slice(0, ampm) + (h < 12 ? "AM" : "PM") + format.slice(ampm);
    }

    for (let i=0; i<format.length; i++) {
        if (waitCloseBracket) {
            waitCloseBracket = format[i] !== "]";
            continue;
        }
        switch (format[i]) {
            case "[":
                waitCloseBracket = true;
                break;
            case "y":
                if (format.substr(i, 4) === "yyyy") {
                    result += y;
                    i += 3;
                } else if (format[i + 1] === "y") {
                    result += formatProp(y % 100, true);
                    i++;
                }
                break;
            case "m":
                const isMNext = format[i + 1] === "m";
                if (afterH) {
                    result += formatProp(min, isMNext);
                    if (isMNext) {
                        i++;
                    }
                } else {
                    if (format.substr(i, 4) === "mmmm") {
                        result += month[m - 1];
                        i += 3;
                    } else if (format.substr(i, 3) === "mmm") {
                        result += month[m - 1].substr(0, 3);
                        i += 2;
                    } else {
                        result += formatProp(m, isMNext);
                        if (isMNext) {
                            i++;
                        }
                    }
                }
                break;
            case "d":
                if (format.substr(i, 4) === "dddd") {
                    result += weekdays[w];
                    i += 3;
                } else if (format.substr(i, 3) === "ddd") {
                    result += weekdays[w].substr(0, 3);
                    i += 2;
                } else {
                    const isDNext = format[i + 1] === "d";
                    result += formatProp(d, isDNext);
                    if (isDNext) {
                        i++;
                    }
                }
                break;
            case "h":
                afterH = true;
                const isHNext = format[i + 1] === "h";
                result += formatProp(ampm !== -1 ? h % 12 || 12 : h, isHNext);
                if (isHNext) {
                    i++;
                }
                break;
            case "s":
                const isSNext = format[i + 1] === "s";
                result += formatProp(s, isSNext);
                if (isSNext) {
                    i++;
                }
                break;
            case "@":
            case ";":
            case "\\":
                break;
            default:
                result += format[i];
        }
    }
    return result;
}

export function formatCell(value, format) {
    if (isNaN(value)) {
        return value;
    }
    const float = parseFloat(value);
    switch (format) {
        case "General":
            return value;
        case "0.00":
            return float.toFixed(2);
        case "0%":
            return Math.round(float) + "%";
        case "0.00%":
            return float.toFixed(2) + "%";
        case "0.00E+00":
            const e = Math.ceil(Math.log(10, float)) + 1;
            return `${(float / Math.pow(10, e)).toFixed(2)}E${e > 0 ? "+" : ""}${formatProp(e, true)}`
        default:
            return tryFormatAsDate(float, format);
    }
}