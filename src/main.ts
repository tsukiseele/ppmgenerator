import path from "node:path";
import { createWriteStream } from "node:fs";
import fs from 'node:fs/promises'
// import sizeOf from "image-size";
import calcBlockSize from "./calc.ts";
import { readPathInput, deepLoopTraversal } from "./utils.ts";
import archiver from 'archiver'
import { initialize } from "./app.ts";
import sharp from "sharp";

// initialize
await initialize()
// generate pack config
const inputDir = await readPathInput()
const outputPath = path.join(inputDir, '../', path.basename(inputDir) + '.zip')
console.log('INPUT <<< ', inputDir);
console.log('Processing...');

const filePathArr = [];
await deepLoopTraversal(inputDir, filePathArr, [".png", ".jpg"]);

const packageName = "nyarray_packs_" + Date.now().toString(36);
const ppm: PPM = { paintings: [] };
const imageDataSet: Promise<Buffer>[] = []

const generateConfiguration = async (files: string[]) => {
    let index = 0
    for (const file of files) {
        let image = sharp((await fs.readFile(file)).buffer);
        const metadata = await image.metadata()
        let size = { width: metadata.width!, height: metadata.height! }
        const { width: x, height: y } = calcBlockSize(size.width, size.height);

        if (Config.IMAGE_MINILIZE) {
            size = { width: size.width / 2, height: size.height / 2 }
            image = image.resize(size.width, size.height)
        }
        if (Config.IMAGE_BORDER.enable) {
            image = image.extend({
                top: Config.IMAGE_BORDER.borderSize,
                bottom: Config.IMAGE_BORDER.borderSize,
                left: Config.IMAGE_BORDER.borderSize,
                right: Config.IMAGE_BORDER.borderSize,
                background: Config.IMAGE_BORDER.borderColor
            })
        }
        if (Config.IMAGE_FIT) {
            image = image.resize(
                Math.floor(x > y ? size.width : size.height * x / y),
                Math.floor(x > y ? size.width * y / x : size.height),
                { fit: 'cover' })
        }
        if (Config.IMAGE_BORDER) {
            image = image.extend({
                top: 10,
                bottom: 10,
                left: 10,
                right: 10,
                background: { r: 0, g: 0, b: 0, alpha: 0 }
            })
        }
        imageDataSet.push(image.toBuffer())

        // const dimensions = await new Promise<{ width: number, height: number }>((resolve, reject) => {
        //     sizeOf(file, function (err, dimensions) {
        //         if (dimensions && dimensions.width && dimensions.height) {
        //             resolve({ width: dimensions.width, height: dimensions.height })
        //         }
        //         reject(err);
        //     });
        // })

        // const { width: x, height: y } = calcBlockSize(dimensions.width, dimensions.height,);
        ppm.paintings.push({ name: `${packageName}:${(index++).toString().padStart(3, '0')}`, x, y });
    }
    return JSON.stringify(ppm)
}
// create resource pack
const output = createWriteStream(outputPath)
const archive = archiver("zip", { zlib: { level: 9 } })
archive.pipe(output)
archive.append(await generateConfiguration(filePathArr) || '', { name: 'paintings++.json' })
archive.append(JSON.stringify(Config.MCMETA), { name: 'pack.mcmeta' })

for (let i = 0; i < ppm.paintings.length; i++) {
    const painting = ppm.paintings[i]

    const image = await imageDataSet[i]

    archive.append(image, {
        name: `assets/${packageName}/textures/painting/${painting.name.split(':')[1]}.png`
    })
}
// ppm.paintings.forEach(async (painting, index) => {
//     const image = await imageDataSet[index]

//     archive.append(image, {
//         name: `assets/${packageName}/textures/painting/${painting.name.split(':')[1]}.png`
//     })
//     // archive.file(filePathArr[index], {
//     //     name: `assets/${packageName}/textures/painting/${painting.name.split(':')[1]}.png`
//     // })
// })
await archive.finalize();

console.log('Completed!');
console.log('OUTPUT >>> ', outputPath);