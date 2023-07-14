import { promises } from 'fs';
import { join } from 'path';
import promptSync from "prompt-sync";
import {Canvas} from 'skia-canvas';
import colorsea from "colorsea";

const prompt = promptSync({sigint:true});

const letters = prompt("What would you like to display on this tag?");
let width = (letters.length * 7)+2;

const hex = prompt("What colour would you like the tag to be?");
const colour = colorsea(hex);

async function createTag(word) {
    //const template = await Canvas.loadImage(`./templates/${templateName}.png`);
    const canvas = new Canvas(width, 7);
    const context = canvas.getContext('2d');
    context.imageSmoothingEnabled = false;

    context.fillStyle = hex;
    context.fillRect(0, 0, width, 7);

    context.font = "5px Beef'd";
    let textPath = context.outlineText(word)

    // Select the style that will be used to fill the text in
    context.fillStyle = colour.darken(10).hex();
    context.fill(textPath.offset(1, 7)) //SHADOW

    context.fillStyle = '#ffffff';
    context.fill(textPath.offset(0, 7)) //TEXT

    const png = await canvas.png
    await promises.writeFile(join("./output", `${letters}.png`), png);
}



createTag(letters);
