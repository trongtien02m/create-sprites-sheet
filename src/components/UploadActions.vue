<script setup lang="ts">
defineProps<{
  rows: number
  cols: number
  cellSize: number
  isSplitting: boolean
  isBulkUploading: boolean
}>()

const emit = defineEmits<{
  splitSpriteSheet: []
  bulkUpload: []
}>()
</script>

<template>
  <div class="split-section">
    <div class="split-buttons">
      <button
        class="btn btn-secondary"
        :disabled="isSplitting || isBulkUploading"
        @click="emit('splitSpriteSheet')"
      >
        {{ isSplitting ? 'Đang tách...' : '📎 Tách Sprite Sheet' }}
        <span v-if="isSplitting" class="loading"></span>
      </button>
      <button
        class="btn btn-success"
        :disabled="isSplitting || isBulkUploading"
        @click="emit('bulkUpload')"
      >
        {{ isBulkUploading ? 'Đang upload...' : '📤 Upload Hàng Loạt' }}
        <span v-if="isBulkUploading" class="loading"></span>
      </button>
    </div>
    <p class="split-description">
      <strong>Tách:</strong> Upload 1 sprite sheet để tách thành {{ rows }}x{{ cols }} ô ({{
        cellSize
      }}x{{ cellSize }}px)<br />
      <strong>Hàng loạt:</strong> Upload tối đa {{ rows * cols }} ảnh để tự động điền vào grid
    </p>
  </div>
</template>
