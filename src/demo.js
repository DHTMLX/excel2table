import {render} from "./main.js";

const input = document.querySelector("#convert-button");
function doConvert(){
    render(".content", input.files[0], {
      scales:true,
      sheets: true,
      formulas: true 
    })
};

input.addEventListener("change", doConvert);