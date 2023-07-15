import { promises } from 'fs';
import { join } from 'path';
import {Canvas} from 'skia-canvas';
import colorsea from "colorsea";
import 'dotenv/config';
import express from "express";
import crypto from "crypto";
const app = express();
app.use(express.json());
const port = process.env.PORT;

async function createTag(word, colour,darken) {
    let width = (word.length * 7)+2;
    colour = colorsea(colour);

    const canvas = new Canvas(width, 7);
    const context = canvas.getContext('2d');
    context.imageSmoothingEnabled = false;

    context.fillStyle = colour.hex();
    context.fillRect(0, 0, width, 7);

    context.font = "5px Beef'd";
    let textPath = context.outlineText(word)

    // Select the style that will be used to fill the text in
    context.fillStyle = colour.darken(darken).hex();
    context.fill(textPath.offset(1, 7)) //SHADOW

    context.fillStyle = '#ffffff';
    context.fill(textPath.offset(0, 7)) //TEXT

    const png = await canvas.png
    await promises.writeFile(join("./output", `${word}-${crypto.randomBytes(12).toString('hex')}.png`), png);
    return png;
}

app.get('/tag/create', async (req, res) => {
    const text = req.body.text;
    const colour = req.body.colour;
    let darken = req.body.darken;
    if (text === null || colour === null) {
        res.sendStatus(422).send("Missing requirement parameters.")
        return;
    }

    if(darken == null){
        darken = 10;
    }

    const tag = await createTag(text, colour, darken);
    res.send(tag);
})

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});