declare var Config: {
    SIZE_4X: number,
    SIZE_3X: number,
    BLOCK_PIXEL_SIZE: number,
    MCMETA: {
        pack: {
            pack_format: number,
            upported_formats: {
                min_inclusive: number,
                max_inclusive: number
            },
            description: string
        }
    }
}

interface Painting {
    name: string,
    x: number,
    y: number
}

interface PPM {
    paintings: Painting[]
}
