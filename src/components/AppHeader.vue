<script setup lang="ts">
import { Button } from '@/components/ui/button'

defineProps<{
  onNewClick: () => void
  onLogout: () => void
}>()
</script>

<template>
  <header class="bg-white shadow">
    <div class="max-w-5xl mx-auto px-4 py-4 flex justify-between items-center">
      <h1 class="text-xl font-bold text-blue-600">BookmarkHub</h1>
      <div class="flex gap-4">
        <Button @click="onNewClick">+ New</Button>
        <Button variant="ghost" @click="onLogout">Logout</Button>
      </div>
    </div>
  </header>
</template>
