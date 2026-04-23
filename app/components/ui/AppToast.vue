<template>
  <Teleport to="body">
    <div class="fixed top-16 inset-x-0 z-50 flex flex-col items-center gap-2 px-4 pointer-events-none">
      <TransitionGroup name="toast">
        <div
          v-for="toast in toasts"
          :key="toast.id"
          class="pointer-events-auto max-w-sm w-full px-4 py-3 rounded-xl shadow-lg text-sm font-medium flex items-center gap-2"
          :class="toast.type === 'error'
            ? 'bg-red-600 text-white'
            : 'bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900'"
        >
          <span>{{ toast.type === 'error' ? '⚠️' : '✓' }}</span>
          <span>{{ toast.message }}</span>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
interface Toast { id: number; message: string; type: 'success' | 'error' }

const toasts = ref<Toast[]>([])
let nextId = 0

function show(message: string, type: Toast['type'] = 'success') {
  const id = nextId++
  toasts.value.push({ id, message, type })
  setTimeout(() => { toasts.value = toasts.value.filter(t => t.id !== id) }, 3000)
}

// Provide globally via nuxt plugin pattern
if (import.meta.client) {
  (window as any).__appToast = show
}
</script>

<style scoped>
.toast-enter-active, .toast-leave-active { transition: all 0.25s ease; }
.toast-enter-from { opacity: 0; transform: translateY(-8px); }
.toast-leave-to   { opacity: 0; transform: translateY(-8px); }
</style>
