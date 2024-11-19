import path from "node:path";
import { createWriteStream } from "node:fs";
import sizeOf from "image-size";
import calcBlockSize from "./calc.ts";
import { readPathInput, deepLoopTraversal } from "./utils.ts";
import archiver from 'archiver'
import { initialize } from "./app.ts";

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
const generateConfiguration = async (images: string[]) => {
    const ppm: PPM = { paintings: [] };
    for (const file of filePathArr) {
        const dimensions = await new Promise<{width: number, height: number}>((resolve, reject) => {
            sizeOf(file, function (err, dimensions) {
                if (dimensions && dimensions.width && dimensions.height) {
                    resolve({width: dimensions.width, height: dimensions.height})
                }
                reject(err);
            });
        })

        const blockSize = calcBlockSize(
            dimensions.width,
            dimensions.height,
        );
        ppm.paintings.push({
            name: `${packageName}:${path.basename(file).split(".")[0]}`,
            ...blockSize,
        });
    }
    return JSON.stringify(ppm)
}
// create resource pack
const output = createWriteStream(outputPath)
const archive = archiver("zip", { zlib: { level: 9 } })
archive.pipe(output)
archive.append(await generateConfiguration(filePathArr) || '', { name: 'paintings++.json' })
archive.append(JSON.stringify(Config.MCMETA), { name: 'pack.mcmeta' })

filePathArr.forEach(file =>
    archive.file(file, {
        name: `assets/${packageName}/textures/painting/${path.basename(file)}`
    })
)
await archive.finalize();

console.log('Completed!');
console.log('OUTPUT >>> ', outputPath);