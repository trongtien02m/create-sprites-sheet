<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  rows: number
  cols: number
  cellSize: number
  autoCalcRows: boolean
  autoCalcCols: boolean
}>()

const emit = defineEmits<{
  'update:rows': [value: number]
  'update:cols': [value: number]
  'update:cellSize': [value: number]
  'update:autoCalcRows': [value: boolean]
  'update:autoCalcCols': [value: boolean]
  createLayout: []
}>()

const showAutoHint = computed(() => props.autoCalcRows && props.autoCalcCols)
</script>

<template>
  <div class="input-group">
    <div class="input-field">
      <div class="label-with-checkbox">
        <label for="rows">Số Hàng</label>
        <label class="checkbox-label">
          <input
            type="checkbox"
            :checked="autoCalcRows"
            @change="emit('update:autoCalcRows', ($event.target as HTMLInputElement).checked)"
          />
          <span>Tự động</span>
        </label>
      </div>
      <input
        id="rows"
        :value="rows"
        @input="emit('update:rows', Number(($event.target as HTMLInputElement).value))"
        type="number"
        min="1"
        max="20"
        placeholder="Nhập số hàng"
        :disabled="autoCalcRows"
      />
    </div>
    <div class="input-field">
      <div class="label-with-checkbox">
        <label for="cols">Số Cột</label>
        <label class="checkbox-label">
          <input
            type="checkbox"
            :checked="autoCalcCols"
            @change="emit('update:autoCalcCols', ($event.target as HTMLInputElement).checked)"
          />
          <span>Tự động</span>
        </label>
      </div>
      <input
        id="cols"
        :value="cols"
        @input="emit('update:cols', Number(($event.target as HTMLInputElement).value))"
        type="number"
        min="1"
        max="20"
        placeholder="Nhập số cột"
        :disabled="autoCalcCols"
      />
      <p v-if="showAutoHint" class="auto-hint">💡 Cả 2 đều tự động: Tạo grid vuông từ số ảnh</p>
    </div>
    <div class="input-field">
      <label for="cellSize">Kích Thước Ô (px)</label>
      <input
        id="cellSize"
        :value="cellSize"
        @input="emit('update:cellSize', Number(($event.target as HTMLInputElement).value))"
        type="number"
        min="16"
        max="512"
        step="8"
        placeholder="Kích thước mỗi ô"
      />
    </div>
    <div class="input-field" style="display: flex; align-items: flex-end">
      <button class="btn btn-primary" @click="emit('createLayout')">Tạo Layout</button>
    </div>
  </div>
</template>
