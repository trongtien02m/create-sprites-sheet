<script setup lang="ts">
import { ref, computed } from 'vue'
import GridConfigForm from './components/GridConfigForm.vue'
import SpriteGrid from './components/SpriteGrid.vue'
import UploadActions from './components/UploadActions.vue'
import PreviewModal from './components/PreviewModal.vue'
import {
  resizeImage,
  createSpriteSheetCanvas,
  calculateSquareGrid,
} from './composables/useImageUtils'

interface GridCell {
  image: string | null
  file: File | null
}

const rows = ref<number>(2)
const cols = ref<number>(2)
const grid = ref<GridCell[][]>([])
const showGrid = ref<boolean>(false)
const spriteSheetUrl = ref<string>('')
const previewUrl = ref<string>('')
const isGenerating = ref<boolean>(false)
const isPreviewing = ref<boolean>(false)
const showPreviewModal = ref<boolean>(false)
const isSplitting = ref<boolean>(false)
const cellSize = ref<number>(64)
const isBulkUploading = ref<boolean>(false)
const autoCalcRows = ref<boolean>(false)
const autoCalcCols = ref<boolean>(false)

const createLayout = () => {
  if (!autoCalcRows.value && !autoCalcCols.value) {
    if (rows.value < 1 || cols.value < 1) {
      alert('Số hàng và cột phải lớn hơn 0!')
      return
    }

    if (rows.value > 20 || cols.value > 20) {
      alert('Số hàng và cột không được vượt quá 20!')
      return
    }

    grid.value = Array(rows.value)
      .fill(null)
      .map(() =>
        Array(cols.value)
          .fill(null)
          .map(() => ({ image: null, file: null })),
      )
    showGrid.value = true
    spriteSheetUrl.value = ''
  } else if (autoCalcRows.value && autoCalcCols.value) {
    // Auto-square mode: both will be calculated from image count
    grid.value = []
    showGrid.value = true
    spriteSheetUrl.value = ''
  } else {
    // Single auto-calc mode
    if (autoCalcRows.value && cols.value < 1) {
      alert('Vui lòng nhập số cột!')
      return
    }

    if (autoCalcCols.value && rows.value < 1) {
      alert('Vui lòng nhập số hàng!')
      return
    }

    grid.value = []
    showGrid.value = true
    spriteSheetUrl.value = ''
  }
}

const handleCellClick = (rowIndex: number, colIndex: number) => {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = 'image/png,image/jpeg,image/jpg,image/webp,image/gif'

  input.onchange = async (e: Event) => {
    const target = e.target as HTMLInputElement
    const files = target.files
    if (!files) return

    const file = files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = async (event) => {
        const result = event.target?.result
        if (result && typeof result === 'string') {
          // Resize image to cell size
          const resizedImage = await resizeImage(result, cellSize.value)
          const row = grid.value[rowIndex]
          if (row) {
            row[colIndex] = {
              image: resizedImage,
              file: file,
            }
          }
        }
      }
      reader.readAsDataURL(file)
    }
  }

  input.click()
}

const handleRowUpload = (rowIndex: number) => {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = 'image/png,image/jpeg,image/jpg,image/webp,image/gif'
  input.multiple = true

  input.onchange = async (e: Event) => {
    const target = e.target as HTMLInputElement
    const fileList = target.files
    if (!fileList) return

    const files = Array.from(fileList)
    const availableCols = cols.value

    // Process images up to available columns
    const imagesToProcess = Math.min(files.length, availableCols)

    for (let colIndex = 0; colIndex < imagesToProcess; colIndex++) {
      const file = files[colIndex]
      if (!file) continue

      const reader = new FileReader()

      await new Promise<void>((resolve) => {
        reader.onload = async (event) => {
          const result = event.target?.result
          if (result && typeof result === 'string') {
            // Resize image to cell size
            const resizedImage = await resizeImage(result, cellSize.value)
            const row = grid.value[rowIndex]
            if (row) {
              row[colIndex] = {
                image: resizedImage,
                file: file,
              }
            }
          }
          resolve()
        }
        reader.readAsDataURL(file)
      })
    }
  }

  input.click()
}

const handleBulkUpload = () => {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = 'image/png,image/jpeg,image/jpg,image/webp,image/gif'
  input.multiple = true

  input.onchange = async (e: Event) => {
    const target = e.target as HTMLInputElement
    const fileList = target.files
    if (!fileList) return

    const files = Array.from(fileList)
    if (files.length === 0) return

    // Auto-calculate grid dimensions
    if (autoCalcRows.value && autoCalcCols.value) {
      // Auto-square mode
      const { rows: bestRows, cols: bestCols } = calculateSquareGrid(files.length)
      rows.value = bestRows
      cols.value = bestCols
      const usedImages = bestRows * bestCols

      if (usedImages < files.length) {
        alert(
          `Sẽ tạo grid ${bestRows}×${bestCols} (${usedImages} ảnh). ${files.length - usedImages} ảnh dư sẽ không được sử dụng.`,
        )
      }

      grid.value = Array(bestRows)
        .fill(null)
        .map(() =>
          Array(bestCols)
            .fill(null)
            .map(() => ({ image: null, file: null })),
        )
    } else if (autoCalcRows.value) {
      const calculatedRows = Math.ceil(files.length / cols.value)
      rows.value = calculatedRows
      grid.value = Array(calculatedRows)
        .fill(null)
        .map(() =>
          Array(cols.value)
            .fill(null)
            .map(() => ({ image: null, file: null })),
        )
    } else if (autoCalcCols.value) {
      const calculatedCols = Math.ceil(files.length / rows.value)
      cols.value = calculatedCols
      grid.value = Array(rows.value)
        .fill(null)
        .map(() =>
          Array(calculatedCols)
            .fill(null)
            .map(() => ({ image: null, file: null })),
        )
    }

    const totalCells = rows.value * cols.value

    if (files.length > totalCells) {
      alert(
        `Bạn đã chọn ${files.length} ảnh nhưng grid chỉ có ${totalCells} ô. Chỉ ${totalCells} ảnh đầu tiên sẽ được sử dụng.`,
      )
    }

    isBulkUploading.value = true

    try {
      let fileIndex = 0

      for (let r = 0; r < rows.value && fileIndex < files.length; r++) {
        for (let c = 0; c < cols.value && fileIndex < files.length; c++) {
          const file = files[fileIndex]
          if (!file) continue
          fileIndex++

          const reader = new FileReader()
          await new Promise<void>((resolve) => {
            reader.onload = async (event) => {
              const result = event.target?.result
              if (result && typeof result === 'string') {
                const resizedImage = await resizeImage(result, cellSize.value)
                const row = grid.value[r]
                if (row) {
                  row[c] = {
                    image: resizedImage,
                    file: file,
                  }
                }
              }
              resolve()
            }
            reader.readAsDataURL(file)
          })
        }
      }

      const message =
        autoCalcRows.value && autoCalcCols.value
          ? `Đã tạo grid vuông ${rows.value}×${cols.value} và upload ${Math.min(files.length, totalCells)} ảnh!`
          : autoCalcRows.value
            ? `Đã tạo ${rows.value} hàng × ${cols.value} cột và upload ${Math.min(files.length, totalCells)} ảnh!`
            : autoCalcCols.value
              ? `Đã tạo ${rows.value} hàng × ${cols.value} cột và upload ${Math.min(files.length, totalCells)} ảnh!`
              : `Đã upload thành công ${Math.min(files.length, totalCells)} ảnh!`

      alert(message)
    } catch (error) {
      console.error('Error bulk uploading:', error)
      alert('Có lỗi xảy ra khi upload hàng loạt!')
    } finally {
      isBulkUploading.value = false
    }
  }

  input.click()
}

const handleSplitSpriteSheet = () => {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = 'image/png,image/jpeg,image/jpg,image/webp'

  input.onchange = async (e: Event) => {
    const target = e.target as HTMLInputElement
    const fileList = target.files
    if (!fileList) return

    const file = fileList[0]
    if (!file) return

    isSplitting.value = true

    try {
      const img = new Image()
      const reader = new FileReader()

      reader.onload = async (event) => {
        const result = event.target?.result
        if (result && typeof result === 'string') {
          img.src = result
          await new Promise((resolve) => {
            img.onload = resolve
          })

          const cellWidth = Math.floor(img.width / cols.value)
          const cellHeight = Math.floor(img.height / rows.value)

          const canvas = document.createElement('canvas')
          canvas.width = cellWidth
          canvas.height = cellHeight
          const ctx = canvas.getContext('2d')
          if (!ctx) {
            throw new Error('Could not get canvas context')
          }

          for (let r = 0; r < rows.value; r++) {
            for (let c = 0; c < cols.value; c++) {
              ctx.clearRect(0, 0, cellWidth, cellHeight)

              ctx.drawImage(
                img,
                c * cellWidth,
                r * cellHeight,
                cellWidth,
                cellHeight,
                0,
                0,
                cellWidth,
                cellHeight,
              )

              const cellImage = canvas.toDataURL('image/png')

              const row = grid.value[r]
              if (row) {
                row[c] = {
                  image: cellImage,
                  file: null,
                }
              }
            }
          }

          alert(`Đã tách thành công ${rows.value}x${cols.value} ô!`)
        }
      }

      reader.readAsDataURL(file)
    } catch (error) {
      console.error('Error splitting sprite sheet:', error)
      alert('Có lỗi xảy ra khi tách sprite sheet!')
    } finally {
      isSplitting.value = false
    }
  }

  input.click()
}

const removeImage = (rowIndex: number, colIndex: number, event: Event) => {
  event.stopPropagation()
  const row = grid.value[rowIndex]
  if (row) {
    row[colIndex] = { image: null, file: null }
  }
}

const isGridComplete = computed(() => {
  if (!showGrid.value || grid.value.length === 0) return false
  return grid.value.every((row) => row.every((cell) => cell.image !== null))
})

const previewSpriteSheet = async () => {
  if (!isGridComplete.value) {
    alert('Vui lòng upload đủ ảnh cho tất cả các ô!')
    return
  }

  isPreviewing.value = true
  const result = await createSpriteSheetCanvas(grid.value, rows.value, cols.value, cellSize.value)
  if (result) {
    previewUrl.value = result
    showPreviewModal.value = true
  } else {
    alert('Có lỗi xảy ra khi tạo preview!')
  }
  isPreviewing.value = false
}

const closePreviewModal = () => {
  showPreviewModal.value = false
}

const generateSpriteSheet = async () => {
  if (!isGridComplete.value) {
    alert('Vui lòng upload đủ ảnh cho tất cả các ô!')
    return
  }

  isGenerating.value = true
  const result = await createSpriteSheetCanvas(grid.value, rows.value, cols.value, cellSize.value)
  if (result) {
    spriteSheetUrl.value = result
  } else {
    alert('Có lỗi xảy ra khi tạo sprite sheet!')
  }
  isGenerating.value = false
}

const downloadSpriteSheet = () => {
  if (!spriteSheetUrl.value) return

  const link = document.createElement('a')
  const timestamp = new Date().getTime()
  link.download = `sprite-sheet-${timestamp}.png`
  link.href = spriteSheetUrl.value
  link.click()
}

const addRow = () => {
  const newRow = Array(cols.value)
    .fill(null)
    .map(() => ({ image: null, file: null }))
  grid.value.push(newRow)
  rows.value = grid.value.length
}

const insertRow = (rowIndex: number) => {
  const newRow = Array(cols.value)
    .fill(null)
    .map(() => ({ image: null, file: null }))
  grid.value.splice(rowIndex, 0, newRow)
  rows.value = grid.value.length
}

const removeRow = (rowIndex: number) => {
  if (grid.value.length <= 1) {
    alert('Phải có ít nhất 1 hàng!')
    return
  }
  grid.value.splice(rowIndex, 1)
  rows.value = grid.value.length
}

const insertColumn = (colIndex: number) => {
  grid.value.forEach((row) => {
    row.splice(colIndex, 0, { image: null, file: null })
  })
  cols.value = grid.value[0]?.length || cols.value + 1
}

const removeColumn = (colIndex: number) => {
  if (cols.value <= 1) {
    alert('Phải có ít nhất 1 cột!')
    return
  }
  grid.value.forEach((row) => {
    row.splice(colIndex, 1)
  })
  cols.value = grid.value[0]?.length || cols.value - 1
}

const resetAll = () => {
  grid.value = []
  showGrid.value = false
  spriteSheetUrl.value = ''
  previewUrl.value = ''
  showPreviewModal.value = false
  isSplitting.value = false
  isBulkUploading.value = false
  rows.value = 2
  cols.value = 2
  cellSize.value = 64
  autoCalcRows.value = false
  autoCalcCols.value = false
}
</script>

<template>
  <div class="container">
    <!-- Header -->
    <header class="header">
      <h1>🎨 Sprite Sheet Generator</h1>
      <p>Tạo sprite sheet chuyên nghiệp từ nhiều ảnh riêng lẻ</p>
    </header>

    <!-- Main Card -->
    <div class="card">
      <!-- Grid Config Form -->
      <GridConfigForm
        v-model:rows="rows"
        v-model:cols="cols"
        v-model:cellSize="cellSize"
        v-model:autoCalcRows="autoCalcRows"
        v-model:autoCalcCols="autoCalcCols"
        @createLayout="createLayout"
      />

      <!-- Upload Actions -->
      <UploadActions
        v-if="showGrid"
        :rows="rows"
        :cols="cols"
        :cellSize="cellSize"
        :isSplitting="isSplitting"
        :isBulkUploading="isBulkUploading"
        @splitSpriteSheet="handleSplitSpriteSheet"
        @bulkUpload="handleBulkUpload"
      />

      <!-- Sprite Grid -->
      <SpriteGrid
        v-if="showGrid && grid.length > 0"
        :grid="grid"
        @cellClick="handleCellClick"
        @removeImage="removeImage"
        @rowUpload="handleRowUpload"
        @removeRow="removeRow"
        @insertRow="insertRow"
        @insertColumn="insertColumn"
        @removeColumn="removeColumn"
      />

      <!-- Actions -->
      <div v-if="showGrid" class="actions">
        <button
          class="btn btn-primary"
          :disabled="!isGridComplete || isPreviewing || isSplitting || isBulkUploading"
          @click="previewSpriteSheet"
        >
          {{ isPreviewing ? 'Đang tạo...' : '👁️ Preview' }}
          <span v-if="isPreviewing" class="loading"></span>
        </button>
        <button
          class="btn btn-success"
          :disabled="!isGridComplete || isGenerating || isSplitting || isBulkUploading"
          @click="generateSpriteSheet"
        >
          {{ isGenerating ? 'Đang tạo...' : '✨ Tạo Sprite Sheet' }}
          <span v-if="isGenerating" class="loading"></span>
        </button>
        <button
          class="btn btn-primary"
          :disabled="isSplitting || isBulkUploading"
          @click="resetAll"
        >
          🔄 Làm Mới
        </button>
      </div>
    </div>

    <!-- Preview Modal -->
    <PreviewModal :show="showPreviewModal" :previewUrl="previewUrl" @close="closePreviewModal" />

    <!-- Final Sprite Sheet Section -->
    <div v-if="spriteSheetUrl" class="preview-section">
      <h2>🎉 Sprite Sheet Đã Tạo</h2>
      <img :src="spriteSheetUrl" alt="Sprite Sheet" class="preview-image" />
      <div class="actions">
        <button class="btn btn-success" @click="downloadSpriteSheet">💾 Tải Về</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Component-specific styles if needed */
</style>
