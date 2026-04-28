<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="modelValue"
        class="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
        @click.self="$emit('update:modelValue', false)"
      >
        <div
          class="absolute inset-0 backdrop-blur-sm"
          :style="{ background: 'rgba(0,0,0,0.4)' }"
          @click="$emit('update:modelValue', false)"
        />
        <div
          class="relative w-full sm:max-w-md rounded-2xl shadow-2xl overflow-hidden neon-border fade-in"
          :style="{ background: 'var(--c-card)' }"
        >
          <div
            v-if="title"
            class="px-6 pt-5 pb-3 font-semibold text-lg uppercase tracking-widest neon-text"
          >
            {{ title }}
          </div>
          <div class="px-6 pb-6">
            <slot />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
defineProps<{ modelValue: boolean; title?: string }>()
defineEmits(['update:modelValue'])
</script>

<style scoped>
.modal-enter-active, .modal-leave-active { transition: opacity 0.2s; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
</style>
