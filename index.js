import fs from 'node:fs/promises'
import path from 'node:path';
import sizeOf from 'image-size'
import readline from 'node:readline/promises'
import { stdin, stdout } from 'node:process';
import calcBlockSize from './calc.js';

// const rl = readline.createInterface(stdin, stdout)

// const packPath = await rl.question('Enter images directory path:')
// console.log(packPath);

// const r = rl.question()

const deepLoopTraversal = async (directory, filePathArr, extnameArr) => {
    const filesList = await fs.readdir(directory);
    
    for (let i = 0; i < filesList.length; i++) {
        const filename = filesList[i];
        const filePath = path.join(directory, filename);
        const stats = await fs.stat(filePath);
        if (stats.isDirectory()) {
            await deepLoopTraversal(filePath, filePathArr, extnameArr);
        } else {
            if (extnameArr && extnameArr.length) {
                const isFile = stats.isFile();
                const extname = isFile ? path.extname(filePath) : '';
                if (extnameArr.includes(extname)) {
                    filePathArr.push(filePath)
                }
            } else {
                filePathArr.push(filePath)
            }
        }
    }
}

const scanDir = path.join('./input')
const outputDir = path.join('./output')
const packSuffix = 'nyarray_kingdom'
const packs = await fs.readdir(scanDir)

for (const pack of packs) {
    const packPath = path.join(scanDir, pack)
    const filePathArr = []
    await deepLoopTraversal(packPath, filePathArr, ['.png', '.jpg'])
    const ppm = { paintings: [] }
    for (const file of filePathArr) {
        const dimensions = await new Promise((resolve, reject) => {
            sizeOf(file, function (err, dimensions) {
                if (err) {
                    reject(err)
                } else {
                    resolve(dimensions)
                }
            })
        })
        const blockSize = calcBlockSize(dimensions.width, dimensions.height)
        ppm.paintings.push({
            name: `${packSuffix}:${path.basename(file).split('.')[0]}`, ...blockSize
        })
    }
    const fsIsExists = async (file) => {
        const { err, _ } = await fs.stat(file)
        return err == null
    }
    if (!await fsIsExists(outputDir)) fs.mkdir(outputDir)
    fs.writeFile(path.join(outputDir, 'paintings++.json'), JSON.stringify(ppm))
    console.log(ppm);
    
}
