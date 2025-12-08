export const resizeImage = async (imageUrl: string, targetSize: number): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = targetSize
      canvas.height = targetSize
      const ctx = canvas.getContext('2d')
      if (ctx) {
        // Clear canvas with transparent background
        ctx.clearRect(0, 0, targetSize, targetSize)

        // Calculate scaling to fit image in cell while maintaining aspect ratio
        const scale = Math.min(targetSize / img.width, targetSize / img.height)
        const scaledWidth = img.width * scale
        const scaledHeight = img.height * scale

        // Center the image
        const x = (targetSize - scaledWidth) / 2
        const y = (targetSize - scaledHeight) / 2

        ctx.drawImage(img, x, y, scaledWidth, scaledHeight)
      }
      resolve(canvas.toDataURL('image/png'))
    }
    img.src = imageUrl
  })
}

export const createSpriteSheetCanvas = async (
  grid: { image: string | null; file: File | null }[][],
  rows: number,
  cols: number,
  cellSize: number,
): Promise<string | null> => {
  try {
    // Filter out empty rows
    const nonEmptyRows = grid.filter((row) => row.some((cell) => cell.image !== null))

    if (nonEmptyRows.length === 0) {
      throw new Error('No images found')
    }

    const actualRows = nonEmptyRows.length
    const cellWidth = cellSize
    const cellHeight = cellSize

    // Create canvas with actual row count
    const canvas = document.createElement('canvas')
    canvas.width = cellWidth * cols
    canvas.height = cellHeight * actualRows
    const ctx = canvas.getContext('2d')
    if (!ctx) {
      throw new Error('Could not get canvas context')
    }

    // Draw all images from non-empty rows
    for (let r = 0; r < actualRows; r++) {
      for (let c = 0; c < cols; c++) {
        const cell = nonEmptyRows[r]?.[c]
        if (!cell?.image) continue

        const img = new Image()
        img.src = cell.image
        await new Promise((resolve) => {
          img.onload = resolve
        })

        ctx.drawImage(img, c * cellWidth, r * cellHeight, cellWidth, cellHeight)
      }
    }

    // Convert to data URL
    return canvas.toDataURL('image/png')
  } catch (error) {
    console.error('Error creating sprite sheet:', error)
    return null
  }
}

export const calculateSquareGrid = (imageCount: number): { rows: number; cols: number } => {
  const sqrt = Math.sqrt(imageCount)
  const size = Math.floor(sqrt)

  // Try to create the most square-like grid
  let bestRows = size
  let bestCols = size

  // If perfect square, use it
  if (size * size === imageCount) {
    return { rows: size, cols: size }
  }

  // Find the best rectangular fit
  for (let r = size; r >= 1; r--) {
    const c = Math.floor(imageCount / r)
    if (r * c <= imageCount && Math.abs(r - c) <= Math.abs(bestRows - bestCols)) {
      bestRows = r
      bestCols = c
    }
  }

  return { rows: bestRows, cols: bestCols }
}
