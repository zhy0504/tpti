/**
 * Poster generation utilities for TPTI result sharing
 * Uses native Canvas 2D API for image composition
 */

import QRCode from 'qrcode'
import { pageConfig } from '@/data/page-config.js'

/**
 * Poster dimensions (mobile-friendly aspect ratio)
 */
const POSTER_WIDTH = 375
const POSTER_HEIGHT = 600

/**
 * Export pixel ratio for high-definition output
 * 2x = retina quality, sufficient for sharp sharing on phones
 */
const EXPORT_PIXEL_RATIO = 2

/**
 * Color palette derived from existing design system
 */
const COLORS = {
  primary: '#0f766e',      // Teal from existing design
  secondary: '#0f172a',    // Dark slate
  accent: '#ccfbf1',       // Light teal background
  text: '#0f172a',         // Primary text
  textLight: '#64748b',    // Secondary text
  white: '#ffffff',
  divider: '#e4eaf0'
}

/**
 * Get the home/test URL for QR code
 * Uses origin + pathname as a stable base URL
 * @returns {string} Base URL for QR code
 */
function getHomeUrl() {
  return `${window.location.origin}${window.location.pathname}#/`
}

function drawWrappedText(ctx, text, x, startY, maxWidth, lineHeight, maxLines = 3) {
  if (!text) {
    return startY
  }

  const chars = Array.from(text)
  const lines = []
  let currentLine = ''

  for (const char of chars) {
    const nextLine = `${currentLine}${char}`
    if (ctx.measureText(nextLine).width <= maxWidth || currentLine.length === 0) {
      currentLine = nextLine
      continue
    }

    lines.push(currentLine)
    currentLine = char

    if (lines.length >= maxLines) {
      break
    }
  }

  if (currentLine && lines.length < maxLines) {
    lines.push(currentLine)
  }

  if (lines.length === maxLines && chars.join('') !== lines.join('')) {
    let lastLine = lines[maxLines - 1]
    while (lastLine.length > 0 && ctx.measureText(`${lastLine}…`).width > maxWidth) {
      lastLine = lastLine.slice(0, -1)
    }
    lines[maxLines - 1] = `${lastLine}…`
  }

  lines.forEach((line, index) => {
    ctx.fillText(line, x, startY + (index * lineHeight))
  })

  return startY + ((lines.length - 1) * lineHeight)
}

/**
 * Load an image from a URL and return it as an HTMLImageElement
 * @param {string} src - Image source URL
 * @returns {Promise<HTMLImageElement>}
 */
function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}

function shouldPreferDirectDownload() {
  if (typeof window === 'undefined') {
    return false
  }

  const hasCoarsePointer = window.matchMedia?.('(pointer: coarse)').matches ?? false
  const isWideScreen = window.innerWidth >= 1024

  return !hasCoarsePointer && isWideScreen
}

/**
 * Generate QR code as a data URL
 * @param {string} text - Text to encode in QR
 * @param {number} size - QR code size in pixels
 * @returns {Promise<string>} Data URL of QR code
 */
async function generateQRDataUrl(text, size = 120) {
  return QRCode.toDataURL(text, {
    width: size,
    margin: 1,
    color: {
      dark: '#0f172a',
      light: '#ffffff'
    }
  })
}

/**
 * Create and draw the poster on a canvas
 * @param {Object} result - Result object with imagePath, resultName, oneLiner, levelTitle
 * @param {string} shareTitle - Title text for the poster
 * @returns {Promise<HTMLCanvasElement>} Canvas element with drawn poster
 */
async function createPosterCanvas(result, shareTitle) {
  const canvas = document.createElement('canvas')
  const exportWidth = POSTER_WIDTH * EXPORT_PIXEL_RATIO
  const exportHeight = POSTER_HEIGHT * EXPORT_PIXEL_RATIO

  canvas.width = exportWidth
  canvas.height = exportHeight

  const ctx = canvas.getContext('2d')

  // Scale context for high-resolution output
  ctx.scale(EXPORT_PIXEL_RATIO, EXPORT_PIXEL_RATIO)

  // Enable high-quality image rendering
  ctx.imageSmoothingEnabled = true
  ctx.imageSmoothingQuality = 'high'

  // Background gradient or solid color
  ctx.fillStyle = COLORS.white
  ctx.fillRect(0, 0, POSTER_WIDTH, POSTER_HEIGHT)

  const cardX = 18
  const cardY = 18
  const cardWidth = POSTER_WIDTH - 36
  const cardHeight = POSTER_HEIGHT - 36

  ctx.fillStyle = '#f8fbfb'
  ctx.beginPath()
  ctx.roundRect(cardX, cardY, cardWidth, cardHeight, 24)
  ctx.fill()

  ctx.strokeStyle = 'rgba(15, 118, 110, 0.08)'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.roundRect(cardX, cardY, cardWidth, cardHeight, 24)
  ctx.stroke()

  // Result image
  const imageY = 34
  const imageHeight = 196
  const imagePadding = 24

  try {
    const img = await loadImage(result.imagePath)
    const imgRatio = img.width / img.height
    const imgDrawWidth = POSTER_WIDTH - (imagePadding * 2)
    const imgDrawHeight = imgDrawWidth / imgRatio
    const imageCardHeight = Math.min(imgDrawHeight + 16, imageHeight)

    // Draw image background/card
    ctx.fillStyle = '#f4f8fa'
    ctx.beginPath()
    ctx.roundRect(imagePadding, imageY, imgDrawWidth, imageCardHeight, 18)
    ctx.fill()

    // Draw image
    ctx.drawImage(
      img,
      imagePadding + 8,
      imageY + 8,
      imgDrawWidth - 16,
      Math.min(imgDrawHeight, imageCardHeight - 16)
    )
  } catch (e) {
    // Fallback: draw placeholder
    ctx.fillStyle = COLORS.accent
    ctx.beginPath()
    ctx.roundRect(imagePadding, imageY, POSTER_WIDTH - imagePadding * 2, imageHeight, 18)
    ctx.fill()

    ctx.fillStyle = COLORS.textLight
    ctx.font = '14px sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('评估结果插图', POSTER_WIDTH / 2, imageY + imageHeight / 2)
  }

  // Result name
  const nameY = imageY + imageHeight + 44
  ctx.fillStyle = COLORS.text
  ctx.font = 'bold 24px sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText(result.resultName, POSTER_WIDTH / 2, nameY)

  // Evaluation / one-liner
  const llinerY = nameY + 34
  ctx.fillStyle = COLORS.primary
  ctx.font = '14px sans-serif'
  drawWrappedText(ctx, result.oneLiner || shareTitle, POSTER_WIDTH / 2, llinerY, POSTER_WIDTH - 72, 22, 2)

  // Level and score info
  const infoCardY = llinerY + 48
  const infoCardX = 34
  const infoCardWidth = POSTER_WIDTH - 68
  const infoCardHeight = 68

  ctx.fillStyle = '#ffffff'
  ctx.beginPath()
  ctx.roundRect(infoCardX, infoCardY, infoCardWidth, infoCardHeight, 18)
  ctx.fill()

  ctx.strokeStyle = 'rgba(148, 163, 184, 0.16)'
  ctx.beginPath()
  ctx.roundRect(infoCardX, infoCardY, infoCardWidth, infoCardHeight, 18)
  ctx.stroke()

  ctx.fillStyle = COLORS.textLight
  ctx.font = '12px sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText('知识水平', infoCardX + 18, infoCardY + 24)
  ctx.fillText('评估得分', infoCardX + 190, infoCardY + 24)

  ctx.fillStyle = COLORS.text
  ctx.font = 'bold 15px sans-serif'
  ctx.fillText(result.levelTitle, infoCardX + 18, infoCardY + 48)
  ctx.fillText(`${result.score}/${result.totalScore}`, infoCardX + 190, infoCardY + 48)

  // QR Code section
  const qrSectionY = infoCardY + infoCardHeight + 18
  const homeUrl = getHomeUrl()
  const qrCardX = infoCardX
  const qrCardWidth = infoCardWidth

  // QR code background card
  ctx.fillStyle = '#f4f8fa'
  ctx.beginPath()
  ctx.roundRect(qrCardX, qrSectionY, qrCardWidth, 126, 18)
  ctx.fill()

  ctx.strokeStyle = 'rgba(148, 163, 184, 0.14)'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.roundRect(qrCardX, qrSectionY, qrCardWidth, 126, 18)
  ctx.stroke()

  // Generate and draw QR code
  const qrSize = 72
  const qrX = POSTER_WIDTH / 2 - qrSize / 2

  try {
    const qrDataUrl = await generateQRDataUrl(homeUrl, qrSize * 2)
    const qrImg = await loadImage(qrDataUrl)
    ctx.drawImage(qrImg, qrX, qrSectionY + 12, qrSize, qrSize)
  } catch (e) {
    // Fallback: draw placeholder square
    ctx.fillStyle = COLORS.divider
    ctx.fillRect(qrX, qrSectionY + 12, qrSize, qrSize)
  }

  // CTA text below QR
  const ctaY = qrSectionY + 110
  ctx.fillStyle = COLORS.textLight
  ctx.font = '600 11px sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText('长按识别二维码，一起来评估吧', POSTER_WIDTH / 2, ctaY)

  return canvas
}

/**
 * Convert canvas to Blob
 * @param {HTMLCanvasElement} canvas - Canvas element
 * @param {string} type - MIME type
 * @param {number} quality - Quality for JPEG/WebP
 * @returns {Promise<Blob>}
 */
function canvasToBlob(canvas, type = 'image/png', quality = 0.92) {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob)
      else reject(new Error('Failed to convert canvas to blob'))
    }, type, quality)
  })
}

/**
 * Download canvas as file
 * @param {HTMLCanvasElement} canvas - Canvas element
 * @param {string} filename - Download filename
 */
async function downloadCanvas(canvas, filename = 'tpti-report.png') {
  const url = canvas.toDataURL('image/png')
  const link = document.createElement('a')
  link.download = filename
  link.href = url
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

/**
 * Copy canvas image to clipboard
 * @param {HTMLCanvasElement} canvas - Canvas element
 * @returns {Promise<boolean>} Success status
 */
async function copyCanvasToClipboard(canvas) {
  try {
    const blob = await canvasToBlob(canvas, 'image/png')
    await navigator.clipboard.write([
      new ClipboardItem({ 'image/png': blob })
    ])
    return true
  } catch (e) {
    return false
  }
}

/**
 * Share poster using native share API with file
 * @param {Blob} blob - Poster blob
 * @param {string} title - Share title
 * @param {string} text - Share text
 * @returns {Promise<boolean>} Success status
 */
async function sharePosterFile(blob, title, text) {
  if (!navigator.share || !navigator.canShare) {
    return false
  }

  const file = new File([blob], 'tpti-report.png', { type: 'image/png' })

  if (navigator.canShare({ files: [file] })) {
    await navigator.share({
      title,
      text,
      files: [file]
    })
    return true
  }

  return false
}

/**
 * Generate and share/download poster for a result
 * @param {Object} result - Result object
 * @param {string} shareTitle - Title for sharing
 * @returns {Promise<{success: boolean, message: string}>}
 */
export async function sharePoster(result, shareTitle) {
  try {
    // Generate poster canvas
    const canvas = await createPosterCanvas(result, shareTitle)

    if (shouldPreferDirectDownload()) {
      await downloadCanvas(canvas)
      return { success: true, message: '评估结果图已下载，可直接发送图片继续分享。' }
    }

    // Try native share with file first
    const blob = await canvasToBlob(canvas)
    const shared = await sharePosterFile(blob, shareTitle, result.oneLiner)

    if (shared) {
      return { success: true, message: '已调起系统分享，可直接发送这张评估结果图。' }
    }

    // Fallback: try clipboard copy
    const copied = await copyCanvasToClipboard(canvas)
    if (copied) {
      return { success: true, message: '评估结果图已复制到剪贴板，可直接粘贴发送。' }
    }

    // Final fallback: download
    await downloadCanvas(canvas)
    return { success: true, message: '评估结果图已下载，可在相册或下载目录中查看。' }
  } catch (error) {
    console.error('Poster generation failed:', error)
    return { success: false, message: '评估结果图生成未成功，请稍后重试。' }
  }
}

/**
 * Generate poster blob without sharing
 * @param {Object} result - Result object
 * @param {string} shareTitle - Title for sharing
 * @returns {Promise<Blob>}
 */
export async function generatePosterBlob(result, shareTitle) {
  const canvas = await createPosterCanvas(result, shareTitle)
  return canvasToBlob(canvas)
}

export default {
  sharePoster,
  generatePosterBlob,
  downloadCanvas,
  createPosterCanvas
}
