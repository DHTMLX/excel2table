export function createXSLXStyles(styles) {
    let style = document.getElementById("xlsx_generated_styles");
    if (style) {
        style.innerHTML = "";
    } else {
        style = document.createElement("style");
        style.id = "xlsx_generated_styles";
        document.head.appendChild(style);
    }

    style.innerHTML = createCssTable(styles);
}

function createCssTable(styles) {
    let result = "";
    let base = (new Date()).valueOf();
    for (let i=0; i<styles.length; i++) {
        const record = styles[i];
        record.id = "s" + (base++);
        let cssString = "";
        for (const key in record) {
            if (key === "format" || key === "id") continue;

            const prop = record[key];
            const name = key.replace(/[A-Z]{1}/g, letter => `-${letter.toLowerCase()}`);
            cssString += `${name}:${prop};`;
        }       
        result += `.excel2table td.${record.id}{${cssString}}\n`;
    }
    return result;
}