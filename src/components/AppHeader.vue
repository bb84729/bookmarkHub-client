<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { useThemeStore } from '@/stores/theme'
import { Moon, Sun } from 'lucide-vue-next'

const emit = defineEmits<{
  logout: []
}>()

const themeStore = useThemeStore()
</script>

<template>
  <header class="bg-card shadow border-b border-border">
    <div class="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
      <h1 class="text-xl font-bold text-primary">BookmarkHub</h1>
      <div class="flex gap-4">
        <Button variant="ghost" size="icon" @click="themeStore.toggleTheme()">
          <Sun v-if="themeStore.theme === 'dark'" class="size-5" />
          <Moon v-else class="size-5" />
        </Button>
        <Button variant="ghost" @click="emit('logout')">Logout</Button>
      </div>
    </div>
  </header>
</template>
