const calcAbsRatio = (width: number, height: number): number => {
    const whRatio = width > height ? height / width : width / height
    if (whRatio > 0.75) return 0.75
    if (whRatio > 2 / 3) return 2 / 3
    if (whRatio > 0.5) return 0.5
    return 1
}
const calcMaxBlockSize = (width: number, height: number, absRatio: number): number => {
    if (absRatio == 2 / 3) {
        return 3
    }
    const maxSize = width > height ? width : height
    if (maxSize > Config.SIZE_4X) {
        return 4
    } else if (maxSize > Config.SIZE_3X) {
        return 3
    } else {
        return 2
    }
}
const calcBlockSize = (width: number, height: number): {x: number, y: number} => {
    const ratio = calcAbsRatio(width, height)
    const size = calcMaxBlockSize(width, height, ratio)
    if (width > height) {
        return { x: size * Config.BLOCK_PIXEL_SIZE, y: size * Config.BLOCK_PIXEL_SIZE * ratio }
    } else {

        return { x: size * Config.BLOCK_PIXEL_SIZE * ratio, y: size * Config.BLOCK_PIXEL_SIZE }
    }
}

export default calcBlockSize