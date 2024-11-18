const SIZE_LARGER = 2048
const SIZE_MIDDLE = 1048
const pixelBlockSize = 16

const calcAbsRatio = (width, height) => {
    const whRatio = width > height ? height / width : width / height
    if (whRatio > 0.75) return 0.75
    if (whRatio > 2 / 3) return 2 / 3
    if (whRatio > 0.5) return 0.5
    return 1
}
const calcMaxBlockSize = (width, height, absRatio) => {
    if (absRatio == 2 / 3) {
        return 3
    }
    const maxSize = width > height ? width : height
    if (maxSize > SIZE_LARGER) {
        return 4
    } else if (maxSize > SIZE_MIDDLE) {
        return 3
    } else {
        return 2
    }
}
const calcBlockSize = (width, height) => {
    const ratio = calcAbsRatio(width, height)
    const size = calcMaxBlockSize(width, height, ratio)
    if (width > height) {
        return { x: size * pixelBlockSize, y: size * pixelBlockSize * ratio }
    } else {

        return { x: size * pixelBlockSize * ratio, y: size * pixelBlockSize }
    }
}

export default calcBlockSize