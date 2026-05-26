import { BrowserMultiFormatReader } from '@zxing/browser'
import { BarcodeFormat, DecodeHintType } from '@zxing/library'
import type { PackingImageItem } from '/@/type/packagingShipping/shippedType'

interface DetectedBarcode {
  rawValue: string
  format: string
}

interface BarcodeDetectorInstance {
  detect(image: ImageBitmapSource): Promise<DetectedBarcode[]>
}

interface BarcodeDetectorConstructor {
  new (options?: { formats?: string[] }): BarcodeDetectorInstance
  getSupportedFormats?: () => Promise<string[]>
}

declare global {
  interface Window {
    BarcodeDetector?: BarcodeDetectorConstructor
  }
}

// BarcodeDetector 使用浏览器自己的格式名称，ZXing 使用枚举；两边都只放一维码格式。
const BARCODE_DETECTOR_ONE_DIMENSIONAL_FORMATS = ['code_128', 'code_39', 'code_93', 'codabar', 'ean_13', 'ean_8', 'itf', 'upc_a', 'upc_e']
const ZXING_ONE_DIMENSIONAL_FORMATS = [
  BarcodeFormat.CODE_128,
  BarcodeFormat.CODE_39,
  BarcodeFormat.CODE_93,
  BarcodeFormat.CODABAR,
  BarcodeFormat.EAN_13,
  BarcodeFormat.EAN_8,
  BarcodeFormat.ITF,
  BarcodeFormat.UPC_A,
  BarcodeFormat.UPC_E,
]
// 现场拍照图片可能很大。先缩到一个足够识别、又不会太慢的尺寸。
const DETECT_MAX_DIMENSION = 1800
// 标签可能横着、倒着、竖着拍，所以同一张图按几个常见方向尝试。
const ROTATE_DEGREES = [0, 180, 90, 270]

export const isBarcodeDetectorSupported = () => typeof window !== 'undefined' && typeof window.BarcodeDetector === 'function'

/**
 * 判断单张图片里是否存在一维码。
 *
 * 当前业务只要求“图片里有条形码”，不校验条码内容是不是当前 FNSKU/GTIN。
 * 识别顺序：
 * 1. 优先用浏览器原生 BarcodeDetector，速度最快。
 * 2. 原生 API 不支持、异常或没识别到时，再降级用 @zxing/browser。
 */
export const hasOneDimensionalBarcode = async (file: File) => {
  const bitmap = await createImageBitmap(file)
  try {
    if (isBarcodeDetectorSupported()) {
      try {
        if (await detectWithNativeBarcodeDetector(bitmap)) {
          return true
        }
      } catch {
        // 原生 BarcodeDetector 不可用或识别异常时，降级到 ZXing。
      }
    }

    return detectWithZxing(bitmap)
  } finally {
    bitmap.close()
  }
}

// Chrome/Edge 等浏览器支持 BarcodeDetector 时走这里。它通常比 JS ZXing 更快。
const detectWithNativeBarcodeDetector = async (bitmap: ImageBitmap) => {
  const BarcodeDetector = window.BarcodeDetector!
  const detector = new BarcodeDetector({ formats: await getSupportedOneDimensionalFormats(BarcodeDetector) })
  for (const degrees of ROTATE_DEGREES) {
    const canvas = drawImageCandidate(bitmap, degrees)
    const barcodes = await detector.detect(canvas)
    if (barcodes.some((barcode) => barcode.rawValue)) {
      return true
    }
  }
  return false
}

// 非 Chromium 浏览器或原生识别失败时，使用 JS 版 ZXing 兜底。
const detectWithZxing = (bitmap: ImageBitmap) => {
  const hints = new Map<DecodeHintType, unknown>()
  hints.set(DecodeHintType.POSSIBLE_FORMATS, ZXING_ONE_DIMENSIONAL_FORMATS)
  hints.set(DecodeHintType.TRY_HARDER, true)

  const reader = new BrowserMultiFormatReader(hints)
  for (const degrees of ROTATE_DEGREES) {
    const canvas = drawImageCandidate(bitmap, degrees)
    try {
      const result = reader.decodeFromCanvas(canvas)
      if (result.getText()) {
        return true
      }
    } catch {
      // 换下一个旋转候选继续尝试。
    }
  }
  return false
}

// 不同浏览器支持的 BarcodeDetector 格式可能不一样，先取交集，避免传入不支持的格式。
const getSupportedOneDimensionalFormats = async (BarcodeDetector: BarcodeDetectorConstructor) => {
  const supportedFormats = await BarcodeDetector.getSupportedFormats?.()
  if (!supportedFormats?.length) {
    return BARCODE_DETECTOR_ONE_DIMENSIONAL_FORMATS
  }

  const formats = BARCODE_DETECTOR_ONE_DIMENSIONAL_FORMATS.filter((format) => supportedFormats.includes(format))
  if (formats.length === 0) {
    throw new Error('当前浏览器不支持原生一维码识别')
  }
  return formats
}

/**
 * 多张装箱图片里只要有一张识别到一维码，就认为通过。
 */
export const hasOneDimensionalBarcodeInImages = async (images: PackingImageItem[]) => {
  for (const image of images) {
    if (await hasOneDimensionalBarcode(image.file)) {
      return true
    }
  }
  return false
}

/**
 * 把图片画到 canvas 上，顺便完成两个预处理：
 * 1. 大图缩小，降低本地识别耗时。
 * 2. 按指定角度旋转，解决倒拍/横拍的标签。
 */
const drawImageCandidate = (bitmap: ImageBitmap, degrees: number) => {
  const sourceWidth = bitmap.width
  const sourceHeight = bitmap.height
  const scale = Math.min(1, DETECT_MAX_DIMENSION / Math.max(sourceWidth, sourceHeight))
  const scaledWidth = Math.max(1, Math.round(sourceWidth * scale))
  const scaledHeight = Math.max(1, Math.round(sourceHeight * scale))
  const swapSize = degrees === 90 || degrees === 270
  const canvas = document.createElement('canvas')
  canvas.width = swapSize ? scaledHeight : scaledWidth
  canvas.height = swapSize ? scaledWidth : scaledHeight

  const context = canvas.getContext('2d')
  if (!context) {
    throw new Error('图片处理失败，请重新拍摄')
  }

  context.translate(canvas.width / 2, canvas.height / 2)
  context.rotate((degrees * Math.PI) / 180)
  context.drawImage(bitmap, -scaledWidth / 2, -scaledHeight / 2, scaledWidth, scaledHeight)
  return canvas
}
