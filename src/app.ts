import path from "node:path"
import fs from "node:fs/promises";
import { existsSync } from "node:fs";

const configPath = path.join('config.json')

const initialize = async () => {
    const isConfigExists = existsSync(configPath)
    if (!isConfigExists) {
        fs.writeFile(configPath, JSON.stringify({
            SIZE_4X: 2048,
            SIZE_3X: 1024,
            BLOCK_PIXEL_SIZE: 16,
            MCMETA: {
                "pack": {
                    "pack_format": 15,
                    "supported_formats": {
                        "min_inclusive": 15,
                        "max_inclusive": 1048576
                    },
                    "description": "Painting Pack made with PPMGenerator!"
                }
            }
        }))
    }
    global.Config = JSON.parse(await fs.readFile(configPath, { encoding: 'utf-8' }))

    console.log('===================== CONFIG =====================');
    console.log(global.Config);
    console.log('==================================================');
}

export { initialize }