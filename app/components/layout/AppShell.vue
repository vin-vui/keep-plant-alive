<template>
  <div class="flex flex-col min-h-screen">
    <AppHeader />
    <main class="flex-1 overflow-auto pb-20 pt-14">
      <slot />
    </main>
    <BottomNav />
  </div>
</template>
