<script setup lang="ts">
defineProps<{
  show: boolean
  previewUrl: string
}>()

const emit = defineEmits<{
  close: []
}>()
</script>

<template>
  <div v-if="show" class="modal-overlay" @click="emit('close')">
    <div class="modal-content" @click.stop>
      <button class="modal-close" @click="emit('close')">✕</button>
      <h2>👁️ Preview Sprite Sheet</h2>
      <div class="modal-image-container">
        <img :src="previewUrl" alt="Preview" class="modal-image" />
      </div>
      <p class="modal-description">Đây là preview sprite sheet đã ghép (không có khoảng trống).</p>
    </div>
  </div>
</template>
