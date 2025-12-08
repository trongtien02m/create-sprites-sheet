<script setup lang="ts">
interface GridCell {
  image: string | null
  file: File | null
}

defineProps<{
  grid: GridCell[][]
}>()

const emit = defineEmits<{
  cellClick: [rowIndex: number, colIndex: number]
  removeImage: [rowIndex: number, colIndex: number, event: Event]
  rowUpload: [rowIndex: number]
  removeRow: [rowIndex: number]
  insertRow: [rowIndex: number]
  insertColumn: [colIndex: number]
  removeColumn: [colIndex: number]
}>()
</script>

<template>
  <div class="grid-container">
    <!-- Column Headers with Insert/Delete -->
    <div v-if="grid.length > 0" class="column-headers">
      <div class="column-header-spacer"></div>
      <div v-for="(_, colIndex) in grid[0]" :key="`col-${colIndex}`" class="column-header">
        <button
          class="btn-col-insert"
          @click="emit('insertColumn', colIndex)"
          title="Chèn cột trước"
        >
          ⬇️
        </button>
        <button class="btn-col-delete" @click="emit('removeColumn', colIndex)" title="Xóa cột này">
          ❌
        </button>
      </div>
      <div class="column-header-spacer"></div>
    </div>

    <div class="grid-wrapper">
      <div v-for="(row, rowIndex) in grid" :key="rowIndex" class="grid-row-container">
        <!-- Insert Row Button -->
        <button class="btn-row-insert" @click="emit('insertRow', rowIndex)" title="Chèn hàng trước">
          ➡️
        </button>

        <div class="grid-row">
          <!-- Grid Cells -->
          <div
            v-for="(cell, colIndex) in row"
            :key="colIndex"
            class="grid-cell"
            :class="{ 'has-image': cell.image }"
            @click="emit('cellClick', rowIndex, colIndex)"
          >
            <img v-if="cell.image" :src="cell.image" alt="Sprite" />
            <div v-else class="upload-hint">📁<br />Click</div>
            <button
              v-if="cell.image"
              class="remove-btn"
              @click="emit('removeImage', rowIndex, colIndex, $event)"
            >
              ✕
            </button>
          </div>
        </div>

        <!-- Row Actions -->
        <div class="row-actions">
          <button class="btn btn-row-upload" @click="emit('rowUpload', rowIndex)">
            📤 Upload {{ row.length }} ảnh
          </button>
          <button
            class="btn btn-row-delete"
            @click="emit('removeRow', rowIndex)"
            title="Xóa hàng này"
          >
            🗑️
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
