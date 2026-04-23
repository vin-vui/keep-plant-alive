export function useToast() {
  function show(message: string, type: 'success' | 'error' = 'success') {
    if (import.meta.client && typeof (window as any).__appToast === 'function') {
      (window as any).__appToast(message, type)
    }
  }
  return { show }
}
