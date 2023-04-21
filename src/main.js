import { createXSLXStyles } from "./css";
import { formatCell } from "./formatter";
import { convert } from "excel2json-wasm";

export function render(container, rawData, config = {}) {
    if (typeof container === "string"){
        container = document.querySelector(container);
    }

    convert(rawData, config).then(({ data, styles }) => {
        renderJSON(container, data, styles, config);
    });
}

export function renderJSON(container, data, styles, config = {}){
    createXSLXStyles(styles);

    let html="";
    if (config.sheets){
        // render html select with list of sheets
        html += `<select class='excel2table-sheets'>`;
        for (let i=0; i<data.length; i++){
            const sheet = data[i];
            html += `<option value="${i}">${sheet.name}</option>`;
        }
        html += "</select>";
    }

    html += sheetToHTML(data[0], styles, config);
    container.innerHTML = html;

    if (config.sheets){
        const sel = container.querySelector(".excel2table-sheets");
        const table = container.querySelector(".excel2table-box");
        sel.addEventListener("change", (e) => {
            table.innerHTML = sheetToHTML(data[sel.value*1], styles, config);
        });
    }
}

export function sheetToHTML(sheet, styles, config) {
    const {
        cells,
        cols,
        rows,
        merged
    } = sheet;

    applyMerges(cells, merged);


    let html = "<div class='excel2table-box'><table class='excel2table'><tr>";
    if (config.scales){
        html += "<th class='scale-x-cell'></td>";
        for (let j=0; j<cols.length; j++){
            html += `<th style='width:${cols[j].width}px;' class='scale-x-cell'>${getLetterFromNumber(j+1)}</td>`;
        }
    } else {
        for (let j=0; j<cols.length; j++){
            html += `<th style='width:${cols[j].width}px;'></td>`;
        }
    }
    html += "</tr>";

    for (let i=0; i<rows.length; i++) {
        const rowNumber = i + 1;
        html += `<tr style='height: ${rows[i].height}px'>`;
        if (config.scales){
            html += `<td class='scale-y-cell'>${rowNumber}</td>`;
        }

        for (let j=0; j<cols.length; j++) {
            html += createCell(cells[i][j], styles);
        }
        html+="</tr>";
    }
    html+="</table></div>";

    return html;
}

function createCell(cell, styles) {
    if (cell === -1) return "";

    let spans = "";
    let text = "";
    let style = styles[0];

    if (cell){
        if (cell.s){
            style = styles[cell.s];
        }
        if (cell.v){
            text = style.format ? formatCell(cell.v, style.format) : cell.v;
        }
        if (cell.colspan || cell.rowspan){
            spans = ` colspan="${cell.colspan}" rowspan="${cell.rowspan}" `;
        }
    }

    return `<td class="${style.id}"${spans}>${text||""}</td>`;
}

function getLetterFromNumber(num) {
	num = --num;
	const numeric = num % 26;
	const letter = String.fromCharCode(65 + numeric);
	const group = Math.floor(num / 26);
	if (group > 0) {
		return getLetterFromNumber(group) + letter;
	}
	return letter;
}

function applyMerges(cells, merged){
    for (let i=0; i<merged.length; i++){
        const { from, to } = merged[i];
        const cell = cells[from.row][from.column] || { v: null, s: 0 };
        cell.colspan = to.column - from.column + 1;
        cell.rowspan = to.row - from.row + 1;

        for (let x=from.row; x<=to.row; x++){
            for (let y=from.column; y<=to.column; y++){
                cells[x][y] = -1;
            }
        }

        cells[from.row][from.column] = cell;
    }
}

window.excel2table = { render };