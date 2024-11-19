import path from "node:path";
import fs from "node:fs/promises";
import {stdin, stdout} from "node:process"
import readline from "node:readline/promises"

const rl = readline.createInterface(stdin, stdout)
const readPathInput = () => new Promise<string>(async (resolve, reject) => {
    do {
        const packPath = await rl.question('Enter the image directory path or drag the directory into the window:\n ')
        const isDrag = packPath.startsWith('&')
        const inputDir = isDrag ? packPath.slice(3, packPath.length - 1).trim() : packPath
        try {
            const inputDirStats = await fs.stat(inputDir)
            if (!inputDirStats.isDirectory) {
                throw `'${inputDir}' not a directory!`
            }
        } catch (error) {
            console.error(error)
            continue
        }
        resolve(inputDir)
        break
    } while (true);
})


const deepLoopTraversal = async (directory: string, filePathArr: string[], extnameArr: string[]) => {
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
                const extname = isFile ? path.extname(filePath) : "";
                if (extnameArr.includes(extname)) {
                    filePathArr.push(filePath);
                }
            } else {
                filePathArr.push(filePath);
            }
        }
    }
};

export { deepLoopTraversal, readPathInput }